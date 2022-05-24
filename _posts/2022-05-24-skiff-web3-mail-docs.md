---
layout: post
title: "去中心化的协同文档 Skiff 初体验"
aliases:
- "去中心化的协同文档 Skiff 初体验"
tagline: ""
description: ""
category: 产品体验
tags: [ google-docs, gmail, skiff, web3, metamask, ens, wallet, ]
last_updated:
---

昨天有朋友分享给我一篇文章，关于红杉领投两轮的 Skiff，简单的看了一下，文章介绍的 Skiff 是一款基于 Web3 的在线协同文档应用。具有与 Google Docs 类似的文档编写和共享功能。

Skiff 将 E2EE （端到端加密技术）作为在线工作的核心设计原则，被用于消息传递、写作、协作和通信。Skiff 服务器只会存储加密版本的数据，而无法破译它。

文档内容可以在设置中选择存放在 Skiff 的中心服务器上，或者 [[IPFS]] 中。

- 端到端加密
- 隐私优先
- 支持 [[MetaMask]] 加密钱包登录
- 数据可选择存储于 IPFS
- 支持发送和接收来自 ENS 地址的邮件
- 邮箱容量默认是 10G，可以通过升级扩容至 100G
- 支持三个邮箱别名
- 客户端有 Android, iOS, macOS 版本

今年 3 月 31 日，Skiff 完成了 1050 万美元 A 轮融资，由红杉资本领投。在去年 5 月红杉资本就参与领投了 Skiff 420 万美元种子轮，投资方还包括一群在隐私和去中心化领域拥有深厚专业知识的天使投资人：Mozilla 前首席执行官 John Lilly、Coinbase 前首席技术官 Balaji Srinivasan、TCG 加密投资者 Gaby Goldberg 和来自 Dropbox 和以太坊基金会的 Albert Ni。

## 端到端加密
用户每次登录 Skiff 时，浏览器都会生成一个密钥，该密钥用于在成功登录后解密由 Skiff 的服务器发送到您设备的帐户数据，并且都是在本地发生的。从中派生的密钥永远不会通过任何网络发送和存储在 Skiff 的服务器中。

当 A 编辑了一份文档后，会使用仅在他和 B 之间共享的对称加密密钥对其进行加密（该密钥不会与 Skiff 共享），B 接收到 A 的加密编辑后，执行验证和解密，然后将其合并到文档中。整个过程，数据不会泄露给任何中央服务器。这样便于验证和保护个人和敏感信息。

当文档出现敏感内容时，也可以通过设置密码进行保护。

## 存储
在数据存储方面，Skiff 与 IPFS 集成。在 IPFS 上，数据被复制并分布在参与计算机的网络中，这些计算机协同工作以确保存储在网络上的所有数据的完整性和持久性。所以使用 IPFS 就可以永久访问用户数据，并无需依赖中央服务器。

目前为止 Skiff 可以在设置中选择将内容保存到 IPFS 还是 Skiff 自身的服务器。

## Web 3 登录方式
2021 年 12 月上，Skiff 也开始支持 MetaMask 钱包登录，让用户使用现有的密钥对（以太坊地址）访问 Skiff 上端到端加密文档和数据。

在今年 1 月，Skiff 又可以使用以太坊域名服务（ENS）名称来简化 Skiff 上的用户名。

## Skiff Mail
在体验文档编辑的时候，发现 Skiff 还退出了端到端加密的邮箱服务。

![skiff mail](https://photo.einverne.info/images/2022/05/25/z5AY.jpg)

还能支持三个 `@skiff.com` 的别名，并且轻量使用起来问题不大，支持标签等等，就是目前搜索功能相较于成熟的 Gmail 还有一定距离。

## 注册

- 点击邮箱注册链接 <https://gtk.pw/skiff>（含个人推荐链接），如果使用 MetaMask 可以使用其登录，或者输入自己的邮箱地址然后点击下方按钮"Continue"，等待接收确认邮件；
- 收到邮件后，点击邮件内的"Confirm email"按钮（如果没有收到邮件查看一下垃圾箱），在打开的页面中输入密码并确认；
- 保存"recovery key"，直接点击"Save key as PDF"按钮即可；
- 根据需要选"Team"或"Personal"，为了简化注册过程建议选"Personal"；
- 注册 Workspace 成功后，在页面顶端"You’re invited to Skiff Mail’s Alpha release. Switch to your inbox to send end-to-end encrypted, private emails."通知后点击"Claim account"激活邮箱地址；
- 邮箱 ID 需 6 位数以上，可以包括字母、数字和英文句号，每个邮箱账户最多可以设置 3 个邮箱 ID。(和 Gmail 一样，"someone"和"some.one"是一样的，在邮件收发时会自动忽略英文句号)
