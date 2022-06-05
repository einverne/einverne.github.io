---
layout: post
title: "电子邮件是如何工作的"
aliases: 
- "电子邮件是如何工作的"
tagline: ""
description: ""
category: 学习笔记
tags: [ email, mail, self-hosted, mail-server, gmail, smtp, linux, pop, imap, dns, spf ]
last_updated:
---

之前听一个播客，里面提到基于协议的应用不会轻易的被历史淘汰，想想基于 HTTP 协议的 Web 浏览器，基于 SMTP 的电子邮件，在过去的几十年里，存在于 HTTP 上层的网站更新换代了很多遍，但底层的协议依然还是 HTTP，而倒闭的电子邮箱也不在少数。但如今互联网依然还依赖 HTTP 协议，电子邮箱虽然没有那么流行但也是基础服务之一。

过去很多年里面，我陆陆续续一直在[寻找](/post/2018/09/mail-server.html)一个完美代替 Gmail 的存在，我的代办事项中一直存在一条叫做如何自建邮箱服务的 TODO，我陆陆续续体验过很多新出现的加密邮箱服务，但也还是一直用着 Gmail。陆陆续续把很多数据从 Google 的服务中迁移出来，但唯独摆脱不了 Gmail。但是最近体验了一些自建的邮箱服务之后，感觉自己可以现在再来尝试一下自建邮件服务器了。

过去我曾经体验过的自建邮箱服务器：

- [[Poste]] 一个单一 Docker 镜像的邮件服务器，存在免费版本和收费版本
- [[Mailu]]，一个 Python 编写的邮件服务器，可以使用 Docker 部署
- [[mailcow]]，同样是一个可以使用 Docker 部署的邮件服务器
- [[Mail-in-a-Box]]，一个非常方便部署的邮箱服务器
- [[postal]]，一个使用 Rust 实现的邮件服务器
- [[Maddy]] 一个使用 Go 语言实现的邮件服务器，没有 Webmail
- [[Salmon]] Python 实现的邮件服务器

还有一些比如 [[iRedMail]]、[[modoboa]]、[[zimbra]] 等等的服务还没有仔细看，但都能实现邮件服务器。

在尝试的过程中觉得自己还需要补习一些基本的知识，因为在自建邮箱服务的时候不可避免的需要配置多个 DNS 记录，包括了 [[MX 记录]]，[[SPF]]，[[DMARC]] 等等。如果理解了邮件的发送过程，会对这些有更多的理解。所以下面就再学习记录一下邮件发送过程。

## 邮件服务器发送与接受邮件
假设用户 a@gmail.com 发送一封邮件到 b@qq.com，会执行如下的流程。

### Webmail
为了简化理解，下面的所有操作都是通过网页版的 Web 应用触发。

当我们在 Gmail 网页上撰写一封邮件，并点击发送按钮之后。Gmail 会用自己的内部协议链接 Gmail 的 Outgoing SMTP 邮件服务器。

Outgoing SMTP 验证用户权限，然后将邮件以 MIME 格式发送到发送队列中。

### 查询 MX 记录
Gmail SMTP 服务器会通过 DNS 查询到 `qq.com` MX 记录，找到服务器 IP 所在。

在 Linux 下也可以通过 `dig mx qq.com` 来查询到。这一步在对应到自建的邮件服务器的时候，就是通过配置 DNS 的 MX 记录来实现的。

一般情况下会配置一个 A 记录 `mx.example.com` 指向服务器的 IP 地址。然后再配置一个 `MX` 记录，`@` 全部域名的 MX 请求全部转发给 `mx.example.com`。

MX 这里指的是 Mail Exchanger。

### SMTP 发送
当 Gmail 的服务器找到 QQ 邮箱的 IP 地址之后，邮件就会通过 SMTP 协议连接服务器的连接，尝试发送给 QQ 的服务器。

为了简化理解，SMTP 传输的时候就直接声明，我 a@gmail.com ，我要发送邮件到 b@qq.com ，内容是某某某。

这中间会发现不存在任何验证发送方身份的过程，这也就意味着任何人都可以伪装一个任意的发送邮箱以一个伪装的邮箱发送邮件。SMTP 最早是建立在信任的基础之上的，但是也给后面使用留下了一些漏洞，为了修复这个漏洞发明了 [[SPF]]。具体见下文。

### 接收
QQ 邮箱的服务器接收到 Gmail 的邮件之后再决定发给具体谁的邮箱。


### SMTP
[[SMTP]] 是 Simple Mail Transfer Protocol 的缩写，从协议名称上也能看出来是一个邮件传输协议。

## SPF
上文提到过 SMTP 协议发送邮件的过程中没有验证发送方，这也就意味着发信方可以任意指定发件人邮箱地址，这会存在一些安全问题。

具体来说，本来我的 Gmail 邮箱是 `a@gmail.com`，假如有不法分子，就可以利用这个漏洞，伪装成自己是 `a@gmail.com` 给别人发送邮件。

SPF 的目的就是为了防止伪造发信人。

### SPF 的原理
SPF 的实现原理非常简单，就是通过添加一条 DNS 记录。

如果邮件服务器收到一封来自主机 `1.1.1.1` 的邮件，并且发件人是 `a@gmai.com`，为了确认发件人，邮件服务器就会去查询 `gmail.com` 的 SPF 记录。如果域名设置了 SPF 记录，允许 `1.1.1.1` 的 IP 地址发送邮件，那么收件的邮件服务器就会认为邮件是合法的，否则就会退信。

有了 SPF 记录之后，如果有人想要伪装成 `a@gmail.com` 他既不能修改 gmail.com 的 DNS 解析，也无法伪造 IP 地址，就有效的防止了伪装。

### SPF 的语法
在自建邮件服务器的时候，经常会让我们设置一个 TXT 记录，配置值为 `v=spf1 mx ~all`，这表示的意思是允许当前域名的 MX 记录对应的 IP 地址。

下面再举个非常常见的例子：

```
v=spf1 a mx ip4:173.10.10.10 -all
```

表示允许当前域名配置的 A 记录，MX 记录的 IP 地址，以及一个额外的 IP。

### SPF 存在的问题
通过上面的描述我们知道通过 SPF 机制可以有效地规避了发送邮件方伪造发件人的问题。但实际使用的时候，如果你使用多个邮箱，然后设置了其中 c@163.com 邮箱自动转发到 a@gmail.com 中。

那么这个时候如果 `b@qq.com` QQ 邮箱发送了一封邮件到 `c@163.com` 邮箱，163 邮箱原封不动地将邮件转发到 Gmail 邮箱，这个时候发件人是 `b@qq.com`，但是 Gmail 回去查询 qq.com 的 SPF 记录，但会发现并不包含 163 邮箱的 IP 地址，会误判转发的邮件。

所以又诞生了 DKIM

## DKIM
[[DKIM]] 是 DomainKeys Identified Mail 的缩写，允许发送者通过在邮件的 header 中包含一段数字签名来验证邮件。DKIM 使用公私密钥来确保邮件内容是从授信的邮件服务器发送的。

还是利用上面的例子，因为我们把所有发送到 163 邮箱的邮件都转发到了 Gmail 邮箱，所以来自 QQ 邮箱的邮件在验证 SPF 时会失败。

那么在 DKIM 中，发送邮件的服务器，比如 QQ 邮箱，会使用公私钥对邮件内容进行签名，并将签名和邮件内容一起发送。当 Gmail 收到从 163 邮箱转发过来的 QQ 邮箱邮件的时候，就会去查询 `qq.com` 的 DNS 记录，拿到公钥。然后使用公钥和签名来验证邮件内容。如果验签不通过，则将邮件判定为伪造。

这里就需要我们再配置一个 DKIM 的 DNS 记录。TXT，键值是页面中的内容。

在 Mailu 的后台可以看到 DKIM 的设置

![mailu dkim](https://photo.einverne.info/images/2022/03/22/5Z0p.png)

## DMARC
经过了 SPF 和 DKIM 的保证是不是就可以完美的发送接收邮件了，其实并不能，我们通过邮件后台来看一下邮件的原始文本。

```
MIME-Version: 1.0
Return-Path: xxx@fake.com
DKIM-Signature: d=fake.com,b=adceabkekd12
Date: Tue, 22 Mar 2022 06:37:58 +0000
Content-Type: multipart/alternative;
 boundary="--=_RainLoop_587_997816661.1647931078"
From: admin@a.com
Message-ID: <a67d96a38592cdad46cca89e98dda26d@techfm.club>
Subject: Seems it works
To: "Somebody" <a@gmail.com>


----=_RainLoop_587_997816661.1647931078
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: quoted-printable

~~

----=_RainLoop_587_997816661.1647931078
Content-Type: text/html; charset="utf-8"
Content-Transfer-Encoding: quoted-printable

<!DOCTYPE html><html><head><meta http-equiv=3D"Content-Type" content=3D"t=
ext/html; charset=3Dutf-8" /></head><body><div data-html-editor-font-wrap=
per=3D"true" style=3D"font-family: arial, sans-serif; font-size: 13px;"><=
br>~~<signature></signature></div></body></html>

----=_RainLoop_587_997816661.1647931078--
```

SPF 解决了接收方验证发件人域名 SPF 记录内 IP 地址从而验证发件人的问题。但是因为 SPF 定义的发件人是 RFC5321 协议中规定的 Return-Path，而 DKIM 在邮件头中直接包含了域名，只要使用该域名的公钥验证通过即可。

而现在的邮件服务给用户展示的发件人都是 From 字段，而不是 SPF 的 `Return-Path`，也不是 DKIM 的 `DKIM-Sginatur: d=`，所以攻击者可以通过伪造这两个字段，发送如上的邮件，完美通过 SPF 和 DKIM 检查，因为 SPF 检查 `Return-Path` 而 DKIM 验证的 `d=` 也是 `fake.com` 所以最终用户看到的发件人却是 `admin@q.com`。

所以就诞生了 [[DMARC]]。DMARC 结合了 SPF 和 DKIM，规定了 `Return-Path` 和 `DKIM-Signature: d=` 两个至少需要有一个与 From 头对应，否则判定为失败。

当邮件服务器接收到邮件时，先验证 DKIM，SPF，然后再根据 DMARC 的配置，检查。这样就能确保最终用户看到的 `From` 字段和 SPF、DKIM 认证的发件人一致了。

## reference

- [邮件服务器](/post/2018/09/mail-server.html)