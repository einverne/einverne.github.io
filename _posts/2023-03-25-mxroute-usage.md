---
layout: post
title: "邮件发送服务 MXRoute 使用体验"
aliases:
- "邮件发送服务 MXRoute 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [mxroute, email-hosting, email-server, email, email-service, email-route, provider,]
create_time: 2023-03-26 10:47:11
last_updated: 2023-03-26 10:47:11
---

[[MXRoute]] 是一家 Email Hosting 服务提供商，专注于提供高送达率的电子邮件发件服务。[[MXRoute]] 是由国外著名主机论坛 LET 的管理员 Jarland 开设。MXRoute 的主要目标之一是向其用户提供经济实惠的邮件托管服务。

MXRoute 的特点是无限域名，无限邮箱账号。MXRoute 配置非常简单，只要拥有自己的域名，通过修改域名的 DNS 配置，就能很方便的搭建自己的邮件服务器。MXRoute 是正规邮件服务，不能用于发送 SPAM 。

需要注意的是，MXRoute 与其他电子邮件提供商类似，存在电子邮件被标记为垃圾邮件的风险，并且发送者信誉和电子邮件内容等因素可能会影响其交付率。

## MXRoute 的优势

MXRoute 作为一家邮件服务提供商，提供了可靠的邮件送达率。

- 拥有高声誉的发信 IP，ARIN 直接分配
- 拥有一个帐号即可添加无限制的域名（当然这里需要声明的是在个人使用合理的范围内，如果添加超过万级别的域名可能需要向管理者申明，否则可能会被判定滥用）
- 可以添加无限制的域名邮箱，每个邮箱都有每个小时 300 封发件的限制，用户可以手动创建不同的邮箱来规避这个限制，比如创建一个邮箱用来发送注册邮件，创建一个邮箱用来发送充值密码邮件，一个邮箱用来发送通知，这样是被允许的，但是如果如果为了规避这个限制人为得创建不同的邮箱帐号来做同样的事情，可能会被判定滥用，请注意
- MXRoute 提供了非常实惠的价格，我购买的套餐就是 15 美元 1 一年，提供 25 GB 的空间，无限制的域名和邮箱

## MXRoute 购买登录

在购买了 MXRoute 的服务之后，系统会发送一封标题为「[MXroute] Important Account Information」的邮件到注册的邮箱中，其中包含了后台访问的地址，用户米和密码，还有一些重要的 DNS 配置，包括 DNS 的 [[MX 记录]]，[[SPF]] 记录。邮件中还包括了邮件客户端的配置，包括 [[IMAP]]，[[SMTP]] 的访问信息，包括地址和端口等等。

## 使用

使用邮件中的信息，登录管理后台，如下图所示。

![O9Dn](https://photo.einverne.info/images/2023/03/26/O9Dn.png)

在域名设置中可以添加域名，子域名也是可以设置的。

### 配置 MX 记录

以 Cloudflare 中 DNS 配置为例，添加记录，然后选择 MX，填入邮件中 MXRoute 发来的 MX 记录地址，然后设置优先级，MXRoute 提供了两个地址分别设置优先级 10， 20 即可。如果是添加的子域名，这里记得将 `@` 对应修改一下。

![OAJl](https://photo.einverne.info/images/2023/03/26/OAJl.png)

### 配置 SPF 记录

关于 SPF 记录，DKIM 记录，以及电子邮件是如何工作的，可以参考之前的[文章](/post/2022/03/how-email-send-and-receive.html)。

SPF（Sender Policy Framework）记录是一种 DNS 记录，用于指定哪些邮件服务器被授权发送来自特定域名的电子邮件。通过使用 SPF 记录，邮件接收服务器可以检查发送方 IP 地址是否被列入授权的 IP 地址列表中，从而减少垃圾邮件和电子邮件欺诈的风险。

SPF 记录的名称通常是类似于下面这样的：

```
example.com.    IN    TXT    "v=spf1 mx a:mail.example.com -all"
```

其中，`example.com` 是你的域名，`v=spf1` 是 SPF 记录的版本号，`mx` 表示允许域名的 MX 记录中列出的邮件服务器发送电子邮件，`a:mail.example.com` 表示允许特定 IP 地址的邮件服务器发送电子邮件，`-all` 表示拒绝所有未列入授权 IP 地址列表中的其他邮件服务器发送电子邮件。

在 SPF 记录中，你可以添加多个条目来授权多个 IP 地址和邮件服务器发送电子邮件。当邮件接收服务器收到一封电子邮件时，它会检查发送方 IP 地址是否在域名的 SPF 记录中列出，并根据 SPF 记录的设置来确定是否接受该电子邮件。如果 SPF 记录中未列出发送方 IP 地址，则接收方邮件服务器可能会将该邮件标记为垃圾邮件或拒绝接收。

在 Cloudflare 中选择 TXT 记录，然后在记录值中填入 MXRoute 发送过来的记录值。

### DKIM 记录

DKIM（DomainKeys Identified Mail）记录的名字通常是类似于下面这样的：

```
dkim._domainkey.example.com
```

其中，`example.com` 是你的域名，而 `default._domainkey` 是一个固定的字符串，表示这是一个 DKIM 记录。如果你有多个域名需要签名验证，则需要为每个域名创建一个相应的 DKIM 记录。

在 DNS 中添加 DKIM 记录时，需要将该记录类型设置为 TXT，并将 DKIM 信息放入记录的值字段中。DKIM 信息包括用于签名验证的公钥和用于加密 DKIM 签名的私钥。在 DKIM 记录中，公钥通常以 "k=" 开头，如下所示：

```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

当其他邮件服务器收到一封使用 DKIM 签名的电子邮件时，它们会检查该域名的 DNS 来查找 DKIM 记录，并使用公钥来验证该邮件的 DKIM 签名。如果签名验证成功，则说明该邮件确实是由该域名的授权发送者发送的，而不是伪造的垃圾邮件。

DKIM 记录没有在邮箱中，需要在 MXRoute 管理后台，找到 「帐号管理」 -> 「DKIM keys（USE ONLY DKIM KEY）」，然后复制 DKIM 值。

![OUxy](https://photo.einverne.info/images/2023/03/26/OUxy.png)

然后在 Cloudflare 中添加 TXT 记录，Name 填写 `dkim._domainkey`，值就填写上面拷贝出来的值即可。记住如果是配置的子域名，可能需要自行调整一下记录的 Name。

### 配置 DMARC 记录

虽然 DMARC 记录是可选的，但是为了追求完美，还是建议配置 [DMARC 记录](/post/2022/03/what-is-dmarc.html)。

DMARC 记录通常是

```
_dmarc.example.com.    IN    TXT    "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
```

一般直接建议配置一个：

```
v=DMARC1; p=none;, p=reject;, p=quarantine;
```

## 邮箱客户端配置

在 MXRoute 后台配置完域名之后，可以在「邮件管理器」->「邮箱帐号」 中添加域名邮箱，然后就可以在任意的邮件客户端使用 IMAP ，或者使用 MXRoute 提供的网页（[[Roundcube]]）客户端来发送或接受邮件。IMAP 的连接地址在邮件中，用户名和密码就是添加邮箱的时候设置的。

## 最后测试

打开网站 <https://www.mail-tester.com/>， 之前几篇将 Self-hosted Email 的文章中也提到过，可以用来检测邮件服务器的得分（从各个方面判定邮件会不会进入垃圾邮箱）。打开这个网站之后，会生成一个随机的邮箱，使用自定义的域名邮箱向这个邮箱发送一封邮件（标题和内容随意），发送后点击页面中的 Then check your score 按钮，即可查看分数。正常如果得到 10 分才算是正常，如果不是，则按里面的要求进行改进，一般都是 DNS 配置错误。或者 如果发信的 IP 地址在黑名单中，也可能导致分数不好看。

## 最后的最后

MXRoute 不仅提供了邮件中显示的 Roundcube 的 Web Client，还可以登录 <https://mail.mxlogin.com> 这个客户端来收发邮件。这个客户端还不仅提供邮件的功能，还能作为 NextCloud 来管理自己的文件。

![Oceh](https://photo.einverne.info/images/2023/03/28/Oceh.png)

同时登录的时候还可以选择自己喜欢的 Web Client。

![OMCC](https://photo.einverne.info/images/2023/03/28/OMCC.png)

我现在也通过 [EV Hosting](https://client.einverne.info/order.php?step=1&productGroup=9&product=14) 来售卖 MXRoute 的邮箱服务，可以以比官方更便宜的价格最低套餐一年只需要 50 元来使用 MXRoute 的服务。

## reference

- [官方文档](https://mxroutedocs.com/dns/cloudflare/)
