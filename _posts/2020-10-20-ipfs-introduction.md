---
layout: post
title: "IPFS 介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [ipfs, distribute-network, internet, file-sharing,]
last_updated:
---


IPFS 的全称是 「InterPlanetary File System」，直译过来叫做「星际文件系统」，这是一个点对点的媒体传输协议，作者创建这个项目的目的是为了建立一个持久的，分布式的文件系统。[^wiki]

> A peer-to-peer hypermedia protocol
> designed to make the web faster, safer, and more open.

[^wiki]: <https://en.wikipedia.org/wiki/InterPlanetary_File_System>

IPFS 白皮书由[Juan Benet](https://github.com/jbenet) 发表于 2014 年。

IPFS 允许用户不仅可以接受文件，还可以托管文件内容，类似 [BitTorrent](/post/2020/02/everything-related-about-bittorrent-and-pt.html) 协议的方式，网络节点中的每一个节点都可以既是客户端也是服务端。

和中心化的系统不一样的地方在于，IPFS 构建了一个去中心化的系统，任何用户都可以存储所有数据中的一部分，IPFS 网络创建了一个可以快速恢复的文件存储和分享系统。

任何用户都可以通过内容地址来分享文件，网络中的任何对等节点都可以通过分布式散列表 (Distributed Hash Table DHT) 来查找和请求文件内容。

IPFS 项目源码：<https://github.com/ipfs>

## IPFS 设计前提

在白皮书中，作者概括了 IPFS 的设计：

- peer-to-peer; no nodes are privileged
- IPFS nodes store IPFS objects in local storage
- Nodes connect to each other and transfer objects
- objects represent files and other data structures


## IPFS 网络和传统网络的区别
首先，让我们来看一下目前的互联网，现在互联网上的大部分内容都依赖于一些大型或小型的服务器托管商。如果你要架设一个网站，你需要花钱购买一个服务器，或者找能够托管内容的提供商，然后将产生的内容放置到服务中，这样当你提供内容时，别人都可以访问这一个中心化的节点来获取。而对于 IPFS ，任何人都可以注册一个节点，开始托管自己的内容，不管是在 Raspberry Pi 上，还是跑在世界上最大的服务器集群中，你自己的节点都可以成为一个非常高效的节点。因为即使你这个节点宕机了，只要在网络上还有地方存储着这部分内容，其他人都可以获取到。

IPFS 网络和普通网络的第二点区别在于，IPFS 的数据是内容寻址 (content-addressed)，而不是地址寻址 (location-addressed). 这是一个微妙的区别，但是结果却是巨大的。

目前如果你打开浏览器，输入 `example.com`，你是告诉浏览器「帮我获取存放在 example.com 的 IP 地址的数据」，这可能存放在 93.184.216.34 这台服务器中，然后你就请求这个 IP 地址的内容，然后服务器会将相关的内容返回到浏览器。（当然现代网络依赖的 DNS 系统，以及浏览器内部的实现细节这里就略过）。所以基本的逻辑是，你告诉网络你要查找地址，然后互联网会将找到的内容返回。

但是 IPFS 扭转了这一逻辑。

在 IPFS 网络中，每一个存放在系统的单一区块数据都会生成一个由自身内容产生的密码散列 (Hash)，也就是说，每一个块都会有一个唯一的由字符串和数字组成的串。当你想要在 IPFS 网络中获取数据时，你会请求这一个 HASH，所以并不是请求网络说「告诉我存放在 93.184.216.34 这个地址的内容」，而是说「请将 Hash 值为 QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy 的内容告诉我」，而 `QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy` 正好是一个包含了 "I'm trying out IPFS" 的 `.txt` 文件的 Hash。

那这样做有什么好处呢？

首先，这使得网络更有弹性，Hash 值是 `QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy` 的内容可能被存放在成千上万的节点中，即使有一个节点 Crash 或者下线了，也不影响其他缓存过这个 Hash 的其他节点。

第二，这个方式提高了安全级别。比如说你想要某一个 Hash 的文件，所以你向网络请求，给我 Hash 值是 `QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy` 的内容，然后网络响应请求，然后发送数据。当你接受了所有的数据，你可以重新计算 Hash，如果数据在传输的过程中被更改了，那么你重新计算的 Hash 就和请求的 Hash 不一致。你可以想象 Hash 就像是文件的唯一指纹。如果你接收到了一个和希望的不一致的内容，他们将拥有不同的指纹。这意味着这个方式实现的网络会知道这个内容是否被篡改了。

### IPFS 解决的问题
和传统的互联网相比，IPFS 不仅解决了内容从互联网消失的问题，并且在抵抗审查，抵抗大规模监控等等方面都要比传统的互联网要有优势。


## IPFS 地址和密码散列
既然上面提到了 content-addressed 系统的独特性，这就值得再来聊一聊 IPFS 地址是如何产生的。

每一个 IPFS 地址都是一个 [multihash](https://github.com/multiformats/multihash)，这意味着每一个地址既包含了 Hash 算法也包含了 Hash 值。

IPFS multihashes 有三个不同的部分：

- multihash 的第一个字节 (byte) 表示产生这个 Hash 的算法
- 第二个 byte 表示 Hash 的长度
- 剩下的 byte 表示 Hash 的结果

默认情况下，IPFS 使用 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) Hash 算法，会产生一个 32-byte 的 Hash。然后使用 [Base58](https://en.wikipedia.org/wiki/Base58) 来表示，这也就是为什么每一个 IPFS 地址都以 `Qm...` 开头。

虽然 SHA-256 算法是当今的标准，但是这个 multihash 格式允许 IPFS 协议自由的更改 Hash 算法。这就使得 如果在未来发现了 SHA-256 算法的缺陷，IPFS 网络可以迁移到另外的算法。如果有人使用其他的 Hash 算法，那么最后的地址可能就不是以 `Qm` 开头了。

## IPFS 可以做什么？
经过上面这么多解释可以知道，IPFS 本质上是一个**分布式**的**文件共享系统**，所以互联网能用来做什么，IPFS 也能做到。并且 IPFS 可以做的更好。

适合下面的场景：

- 归档文件，IPFS 自身会进行去重，并且提供了非常庞大的存储能力，适合归档文件
- 提供服务，IPFS 提供了安全的点对点文件传输，非常适合文件的分发，尤其是在分发大文件时可以节省大量的带宽。

## IPFS Gateway
IPFS Gateway 网关提供了互联网用户访问托管在 IPFS 网络上内容的一种能力。`ipfs.io` 网关是由社区运营由 Protocol Labs 资助以帮助开发者的工具。

- Cloudflare 提供的网关 <https://cloudflare-ipfs.com/>

其他一些公共的网关可以在[这个列表里面找到](https://ipfs.github.io/public-gateway-checker/)

如果想要了解更多 IPFS Gateway 相关的内容，可以到 <https://docs.ipfs.io/concepts/ipfs-gateway/> 了解。

## 上传文件到 IPFS


上传到 IPFS 网络的第一张图。

<https://ipfs.io/ipfs/QmcTzSJspTbafYWR1B8RqncNcvsaxnKQJmbtTU6GUkLJ8j>

在 [目录](https://ipfs.io/ipfs/QmQsLcmxzAh7Y6Ho1Nt8bispVmeHqjzdGBjG5m8KoGYjGi) 中。

## IPNS
IPFS 使用基于文件的寻址，这就使得分享文件的时候会有一大串的 Hash，并且一旦更新文件后，就会产生一个新的 Hash 值。

IPNS 全称是 The InterPlanetary Name System，IPNS 就是用了创建可以用于更新的地址。

IPNS 中的名字是一个公开密钥的 Hash，它会和一条记录相对应，这条记录被对应的私钥签名。新的记录可以被多次发布。

`ipns` 的地址会有一个前缀：

	/ipns/yourname

拥有这样一个机制后就可以通过自己设定绑定到 IPFS Hash 的记录，然后通过该记录来访问。

使用如下命令会返回节点 ID

	ipfs name publish QmQsLcmxzAh7Y6Ho1Nt8bispVmeHqjzdGBjG5m8KoGYjGi

使用 `ipfs id` 查看节点 ID。复制这一步的节点 ID，验证

	ipfs name resolve your_ID

同样的 ID 可以使用 IPNS 来访问。

- <https://ipfs.io/ipns/12D3KooWMrZpzzoSA2uxZiQ8NSizEK9A8SduhxcAc4yUB8imxXqU>

注意这里 URL 的 `ipns` 区别。

### DNSLink
如果想要发布一个友好的地址，也可以使用 [DNSLink](https://docs.ipfs.io/concepts/dnslink/)

IPFS 允许用户直接使用现有的域名，这样就可以用一个简单的域名来访问。

- <https://ipfs.io/ipns/p.einverne.info/>

只需要在 DNS 解析里面增加一条 TXT 记录，指向：

	dnslink=/ipns/12D3KooWMrZpzzoSA2uxZiQ8NSizEK9A8SduhxcAc4yUB8imxXqU

## Pin files
IPFS 节点默认情况下会将文件认为是缓存 (cache)，这意味着 IPFS 不会一直保存着文件。`Pinning` 一个文件就是告诉 IPFS 节点将这个文件视为重要的文件，不要抛弃这个文件。

## 常见的 ipfs 命令

将本地文件添加到 IPFS

	ipfs add filename

同理增加文件夹

	ipfs add -r directory

获取一个远程的文件，并指定一个名字，但是不 pin 它：

	ipfs get hash -o outputname

pin 一个远程的文件

	ipfs pin add hash

显示本地 pin 过的文件

	ipfs pin ls

从本地 unpin 一个文件

	ipfs pin rm hash

移除本地 unpinned 的文件：

	ipfs repo gc


## IPFS 私人网络
使用密钥工具，创建密钥：

	<https://github.com/Kubuxu/go-ipfs-swarm-key-gen>

然后将密钥放到 IPFS 默认配置下 `~/.ipfs/`

然后启动 `ipfs init`，默认情况下连接的是公网节点，如果要连接私有网络，删除所有的启动节点，然后手动添加自己的节点：

	ipfs bootstrap rm --all
    ipfs bootstrap add node

查看节点：

	ipfs swarm peers

## 在 IPFS 网络镜像本网站

最后借助 [fleek](https://fleek.co/) 可以快速的将 GitHub 中托管的静态网站镜像一份到 IPFS 网络。

- <https://ipfs.einverne.info>


## reference

- [IPFS 文档](https://docs.ipfs.io/)
- <https://blog.cloudflare.com/distributed-web-gateway/>
- https://pinata.cloud/
- https://fleek.co/
