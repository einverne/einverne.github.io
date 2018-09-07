---
layout: post
title: "Certificate pinning 介绍"
tagline: ""
description: ""
category: 经验总结
tags: [ssl, http, certificate, android, security, ]
last_updated:
---

在抓包 Instagram 的时候发现所有的请求都被加密，即使使用 MITM 也无法查看请求内容。Google 之后发现 Instagram，Facebook 等等应用都使用了 Certificate pinning（或者也被称为 ssl-pinning） 的技术来加强通信安全。

HTTP 在 TCP 和 IP 协议之上，HTTPS 则是在 TCP 和 HTTP 之间增加了一道 SSL or TLS 协议。

市面上的各种抓包软件的实现原理就是中间人攻击。TLS 建立时客户端生成的随机数 1 服务端生成的随机数 2 都是明文的，只有随机数据 3 使用非对称加密技术加密中间人攻击的关键就是截获服务器返回的证书并伪造证书发送给客户端骗取信任，获取随机数 3，进而达成盗取信息的目的。

Instagram 在开发时就将服务端证书打包到客户端中，在 HTTPS 建立时与服务端返回的证书对比一致性，从而识别中间人攻击后直接在客户端终止连接。

## 解决方案

### 方案一

- iOS 通过越狱安装 [ssl-kill-switch2](https://github.com/nabla-c0d3/ssl-kill-switch2) 来绕过证书验证
- Android 通过 Xposed Module 禁用证书验证 [JustTrustMe](https://github.com/Fuzion24/JustTrustMe) ，经过我的测试这种方式对 Instagram 已经失效

### 方案二

反编译高手可以拆解 apk 或者 iap 包，将客户端打包的证书替换掉，再签名，之后使用修改的包抓包

## reference

- <https://www.jianshu.com/p/22b56d977825>
- <https://nabla-c0d3.github.io/blog/2016/02/21/ssl-kill-switch-twitter/>
