---
layout: post
title: "自建邮件服务器的选择和比较"
aliases: 
- "自建邮件服务器的选择和比较"
tagline: ""
description: ""
category: 整理合集
tags: [ mail-server, email, self-hosted, self-host , linux, docker , smtp,  ]
last_updated: 2022-04-26 12:48:16
create_time: 2022-04-26 12:47:22
---

在过去几年的时间里面，一直再寻求各种服务的 Self-hosted ，但唯独邮件服务器自建起来的步骤比较麻烦，但也不是不可能，甚至邮件服务器的 Self-hosted 方案更加全面。

下面这些邮件服务器架设方案是过去几年里面尝试和使用的。

- [[Poste]] 分为免费版和收费版，可以使用 Docker 部署，所有服务集中在一个镜像中，部署比较简单，适合商用服务，如果出现问题还可以付费进行咨询。Poste 的付费版本提供了更加强大的日志审查，诊断分析工具等等，具体可以参考[官网](https://poste.io/order)
- [[Mailu]] 是一个使用 Python 编写的邮件服务器，可以使用 Docker 安装部署，集成了 dovecot, postfix 等等。个人的使用体验就是比较小巧，但是功能齐全。还自带 Webmail。 [使用 Mailu 搭建邮件服务器](/post/2021/07/email-server-mailu.html)
- [[mailcow]] 相对于 Mailu 更加强大，但也相对比较消耗资源，mailcow 可以管理多用户，多域名，后台功能非常详细，使用 [[SOGo]] webmail。 [使用 Mailcow 搭建邮件服务器](/post/2022/04/mailcow-email-server.html).
- [[postal]] 一个使用 Rust 编写的邮件服务器，可以发送和接收邮件。可以使用 HTTP 接口
- [[Maddy]] 是一个使用 Go 语言实现的多合一邮件服务器。没有 Web 界面，需要借助客户端

其他一些方案：

- [[Mail-in-a-Box]]
- [[iRedMail]]
- [[modoboa]]
- [[hMailServer]] 是一款为 Windows Server 编写的邮件服务器。
- [[Salmon]] Python 实现的邮件服务器
- [docker-mailserver](https://github.com/docker-mailserver/docker-mailserver)
- [[zimbra]]

## 总结
我个人在首先尝试 Mailu ，学习基本的[邮件服务器的协议](/post/2018/09/mail-server.html)必要的 DNS 配置之后，从 Mailu 切换长期使用 Mailcow。Mailcow 支持多用户，多域名配置，相对 Mailu 要重一些。所以如果是简单的轻度使用推荐 Mailu，Python 编写，Docker 镜像依赖简单，后台简洁。如果是重度使用，那么推荐 Mailcow，虽然镜像搭建稍微复杂，后台管理也稍微复杂一些，但是更强大。

更多总结： <https://medevel.com/list-os-mail-server/>

