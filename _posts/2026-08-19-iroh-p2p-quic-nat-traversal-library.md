---
layout: post
title: "iroh：用公钥代替 IP 地址的 P2P 网络库"
aliases:
- "iroh：用公钥代替 IP 地址的 P2P 网络库"
tagline: ""
description: "从调研跨平台剪贴板同步工具偶然发现 iroh 说起，由浅入深介绍这个 Rust 编写的 P2P 网络库：公钥寻址、NAT 打洞、relay 中继、QUIC 多路径，以及如何用它构建点对点分布式应用。"
category: 学习笔记
tags: [ iroh, p2p, quic, nat-traversal, holepunching, rust, networking, local-first, distributed-systems, clipboard-sync ]
create_time: 2026-08-19 11:00:00
last_updated: 2026-08-19 11:00:00
---

最近在调研跨平台的剪贴板同步工具，我的需求其实很简单：在 macOS、Linux 和 Android 手机之间同步剪贴板，最好不要经过第三方服务器。市面上的方案要么依赖云端中转（隐私上总觉得别扭），要么像 KDE Connect 那样只能在局域网里工作，一旦设备不在同一个网络就歇菜了。顺着「设备之间怎么直连」这个问题挖下去，我偶然发现了 [iroh](https://github.com/n0-computer/iroh) 这个库，越看越觉得有意思。这篇文章就由浅入深地把 iroh 介绍一遍。

## 为什么设备之间直连这么难

在展开 iroh 之前，先把背景问题说清楚。两台设备想要互相通信，最朴素的想法是知道对方的 IP 地址然后直接连。但现实是：

- 绝大多数设备躲在 NAT 后面，没有公网 IP，家里的路由器、运营商的 CGNAT 层层叠叠
- 设备的网络位置一直在变，手机从 Wi-Fi 切到蜂窝网络，笔记本从家里带到咖啡馆，IP 说变就变
- 就算双方都知道对方的公网映射地址，防火墙默认也会丢弃「没见过的」入站包

传统的解法大家应该都不陌生。中心服务器中转最简单粗暴，所有流量过一遍服务器，隐私和带宽成本都是问题；WebRTC 的 ICE/STUN/TURN 那一套可以打洞，但信令服务器要自己搭，整套东西围绕浏览器音视频设计，拿来做通用数据传输相当繁琐；Tailscale 这类产品把打洞和中继做得很好，但它是一个面向用户的 VPN 产品，把整台设备拉进虚拟网络，而不是让我在自己的应用里嵌入连接能力。

## iroh 是什么

iroh 是 n0 Computer 开发的一个 Rust 网络库，口号非常直白：「IP addresses break, dial keys instead」——IP 地址会失效，改用密钥拨号。它于 2026 年 6 月发布了 1.0 版本，wire protocol 从此稳定，还带来了官方的 Python、Node.js、Swift、Kotlin 绑定，GitHub 上已经有超过 12k star，采用 Apache-2.0 和 MIT 双许可。

它的核心抽象只有一个：每个设备（endpoint）由一对加密密钥标识，公钥就是这台设备的「地址」，称为 EndpointId。你对着公钥拨号，iroh 负责找到对端、打洞建立直连、直连不成就走中继，并且在网络变化时无中断地迁移路径。这个公钥同时也是 TLS 身份，所以每一条连接天然就是双向认证、端到端加密的，不需要额外的证书体系。

用一个类比来说：传统网络编程像是打电话必须记住对方现在人在哪个城市哪条街；iroh 则像是存了对方的手机号，人走到哪里都能拨通。

## 由浅入深看它怎么工作

### 第一层：公钥怎么变成可达的地址

拨号方手里只有一个公钥，总得有办法解析出对端现在的网络位置。iroh 提供了几种发现（discovery）机制：

- DNS 发现，默认方式。每个节点把包含自己中继信息的签名记录发布到 n0 运营的 DNS 服务器 dns.iroh.link，拨号方通过 DNS 或 HTTPS 查询解析
- Mainline DHT 发现，可选。把同样的签名记录用 BitTorrent 的 BEP 44 扩展发布到 Mainline DHT 上，完全去中心化，不依赖 n0 的任何基础设施
- 局域网发现。同一网络内的设备直接交换本地地址，连打洞都省了

记录都是私钥签名的，DNS 服务器只是个公告板，伪造不了内容，这个设计和 pkarr 一脉相承。

### 第二层：relay 会合与打洞

节点启动时会向配置的中继服务器（relay）发送 QAD（QUIC Address Discovery）探测，一方面得知自己的公网映射地址，一方面测出延迟最低的 relay 作为自己的 home relay，保持一条长连接。

两个节点建立连接时，流程大致是：先经由双方都可达的 relay 会合，把 relay 当作侧信道交换各自的公网反射地址，然后双方同时向对方的反射地址发 UDP 包。因为两边的防火墙都刚见过对应四元组的出站流量，入站包会被当作合法应答放行，直连就这么建立起来了。这就是经典的 UDP simultaneous open 打洞，Tailscale 用户应该很熟悉，iroh 的 relay 设计也明确借鉴了 Tailscale 的 DERP。

打洞失败怎么办？流量继续走 relay 转发，应用层完全无感知。relay 只能看到加密后的 QUIC 包，既不知道内容，甚至分不清转发的是应用数据还是打洞协调消息。直连一旦验证成功，流量会平滑切换过去，relay 链路淡出。

### 第三层：把打洞塞进 QUIC 里

这是我觉得 iroh 最漂亮的一步演进。0.96 版本之前，打洞报文是游离在 QUIC 连接之外的，它们不受拥塞控制器管理，打洞成功后路径从 relay 切到直连时，QUIC 栈对此一无所知，属于工程上能跑但架构上别扭的设计。

0.96 引入的 QNT（QUIC NAT Traversal）协议把打洞过程直接整合进了 QUIC 连接内部，通过自定义的 transport parameter 实现，灵感来自 IETF 的 QUIC NAT traversal 草案。好处是立竿见影的：打洞报文免费获得了 QUIC 自带的加密、丢包恢复、拥塞控制和 DDoS 防护，路径迁移成了 QUIC 多路径机制的一部分。n0 团队还计划把这些扩展提交给 IETF 标准化。

顺带一提，iroh 1.0 使用的是 n0 自研的 QUIC 实现 noq，并发多流、流优先级、datagram 传输、没有队头阻塞，这些 QUIC 的好处拿来就用。

### 第四层：协议栈与生态

iroh 本体只负责「把两台设备连起来」，往上是可自由组合的协议层。架构上自下而上是：Transport（默认 UDP，理论上可以换成 Tor、Nym 甚至蓝牙）→ QUIC + TLS 1.3 → Endpoint（身份、发现、打洞、中继兜底）→ Router（按 ALPN 字符串分发入站连接）→ 应用协议。

官方维护了几个开箱即用的协议库：

- iroh-blobs：基于 BLAKE3 的内容寻址 blob 传输，支持可验证的断点续传，从 KB 到 TB 都能处理
- iroh-gossip：发布订阅覆盖网络，资源占用低到普通手机也能跑
- iroh-docs：构建在 blobs 之上的最终一致性键值存储，适合多设备同步

多个协议可以共享同一个 endpoint，也可以自己实现 ProtocolHandler trait 写自定义协议，或者接上 Automerge 这类 CRDT 库构建 local-first 应用。

## 上手体验

Rust 里 `cargo add iroh` 就能用。拨号方的代码大概长这样：

```rust
let endpoint = Endpoint::bind().await?;
let conn = endpoint.connect(addr, b"my-app/0").await?;
let (mut send, mut recv) = conn.open_bi().await?;
```

接收方通过 Router 注册协议处理器，按 ALPN 区分不同协议：

```rust
let router = Router::builder(endpoint)
    .accept(b"my-app/0", MyHandler)
    .spawn();
```

官方的 echo 示例（iroh/examples/echo.rs）不到百行就是一个完整的可跨 NAT 通信的程序，这个第一印象相当好。

几点实践建议和避坑提醒：

- 默认配置依赖 n0 运营的公共 relay 和 DNS 发现服务，个人项目直接用没问题，但对可用性有要求的产品应该自建，iroh-relay 和 iroh-dns-server 都是开源的
- 部分企业防火墙和蜂窝网络下打洞依然会失败，此时连接质量取决于 relay，测试时别只在家里的宽带下测
- 非 Rust 语言通过官方绑定使用，1.0 之后有 Python、Node.js、Swift、Kotlin 可选，不过生态核心仍然是 Rust，遇到问题最终还是要看 Rust 文档和源码
- 浏览器环境不是 iroh 的主场，如果目标平台包含 Web，还是得考虑 WebRTC 或混合方案

## 回到剪贴板同步这件事

绕回我的原始需求。用 iroh 的视角看剪贴板同步，每台设备一个密钥对，设备配对就是交换公钥（扫个二维码就行）；剪贴板内容的传播用 iroh-gossip 的发布订阅正合适，或者干脆开一条双向流；大文件、图片走 iroh-blobs；所有传输端到端加密，不需要任何账号体系，也没有第三方服务器能看到内容；设备在局域网时直连零延迟，跨网络时打洞或走 relay。

实际上社区里已经有人用 iroh 做类似的东西了，iroh-examples 仓库里有不少可以直接参考的项目。相比之下，Syncthing 这类工具解决的是文件目录同步，KDE Connect 局限在局域网，而基于 iroh 自己做一个剪贴板同步工具，工作量主要在各平台的剪贴板 API 和 UI 上，网络层几乎完全可以依赖 iroh。

## 最后

iroh 的设计理念，「公钥即地址」一句话就把 NAT 穿透、节点发现、连接迁移、加密认证全部收敛到一个干净的 API 后面，开发者面对的复杂度大大收敛。

放在更大的图景里看，iroh 属于 local-first 软件运动的基础设施层。过去十年我们习惯了一切经过云端，但剪贴板、笔记、照片这些本质上属于个人的数据，为什么非要绕道别人的服务器？有了 iroh 这样把 P2P 连接做到「几行代码就能用」的库，设备直连的应用会越来越多。

## 相关链接

- [iroh 官方文档](https://docs.iroh.computer/)
- [Holepunching 原理](https://docs.iroh.computer/concepts/holepunching)
- [iroh on QUIC Multipath](https://www.iroh.computer/blog/iroh-on-QUIC-multipath)
- [iroh-examples 示例仓库](https://github.com/n0-computer/iroh-examples)
