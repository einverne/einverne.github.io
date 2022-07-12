---
layout: post
title: "邮件服务器相关概念学习"
tagline: ""
description: ""
category: 学习笔记
tags: [mail-server, mail, linux, smtp, mailgun, email]
last_updated:
---

学习邮件服务器的一些笔记。

## 几个概念
电子邮件相关的基本概念：

- [[MUA]]
- [[MTA]]
- [[MDA]]

### MUA
[[MUA]] 全称为 Mail User Agent 邮件用户代理。常见的 MUA 实例有： mutt, outlook, foxmail 等， 其主要任务是让用户能够收信，写信，发信。MUA 并非直接将 E-mail 发送到收件人手上，而是通过 MTA 代为传递。

### MTA
MTA 全称 Mail Transfer Agent，MTA 仅仅负责邮件的传输。常见的 MTA 有 Postfix, sendmail, [[exim4]]

### MDA
[[MDA]] 全称为 Mail Delivery Agent，负责投递本地邮件到适当的邮箱，一封邮件从 MUA 发出后，通过一个或者多个 MTA 最终到达 MDA。MDA 可以过滤邮件内容，依照规则，将邮件分类到适当的邮箱，甚至可以将邮件转回 MTA，以寄到另一个邮箱。一旦邮件到达邮箱，就原地等待用户通过 MUA 将其取走。

### SMTP
[[SMTP]] 全称 Simple Mail Transfer Protocol ，简单邮件传输协议。主要工作是把邮件信息从发件人邮件服务器中传送到接收人邮件服务器。SMTP 协议出现比较早，所有很多问题都没有考虑全面，比如信息内容需要是 ASCII 码，再比如 SMTP 没有对发送方进行身份验证，所有现在垃圾邮件非常多。

### LMTP
全称是 Local Mail Transfer Protocol，本地邮件传输协议，类似 SMTP，主要应用于非广域网的邮件网关。

### POP3
全称是 Post Office Protocol Version 3，RFC1939，用于用户管理邮件服务器上面的电子邮件。当外来邮件发送到收件人的邮件服务器上时，收件人可以使用邮件客户端连接邮件服务器，把未阅读的邮件服务器以及部分信息拉取回本地进行处理。

### IMAP
[[IMAP]] 全称 Internet Message Access Protocol,RFC 2060 相对于 pop3 协议所有邮件的管理都需要下载下来进而管理，IMAP 提供了用户远程访问邮件服务器的途径。

发送一封邮件的基本流程就是：

发件人 -> MUA -> 发送 -> MTA -> MTA ... -> MDA -- MUA -- 收件人收件

MUA 到 MTA，以及 MTA 和 MTA 之间使用 SMTP 协议，而收件时，MUA 到 MDA 之间最常使用的协议是 POP3 或 IMAP。

### Postfix
[[Postfix]] 是一个开源的 [[MTA]] 服务器，负责通过 SMTP 协议管理发送到本机的邮件以及由本机向外发送的邮件。

Postfix 使用的默认端口为 25

### Dovecot
[[Dovecot]] 是一个开源的 IMAP 及 POP3 服务器。[doc](https://www.dovecot.org/)

IMAP 协议使用的默认端口是 143

### SASL
全称是 Simple Authentication and Security Layer，因为 SMTP 协议没有验证用户身份的能力，虽然信封的寄件人地址已经隐含发信者身份，但是由于信封地址实在太容易造假，所以不能当成身份凭据。所以 SMTP 借助额外的机制 SASL 来验证客户端的身份，来决定谁有权使用转发服务。

### SSL TLS
SSL 全称是 Secure Socket Layer，加密传输层，TLS 是 Transport Layer Security 在 SSL 基础上提供更好的安全性。25 端口被设计用来转发邮件，并没有考虑认证和加密等问题，1997 年 465 端口被注册用于加密 （SMTPS）提交邮件，1998 年 STARTTLS 标准出现，规定使用 587 端口使用 STARTTLS 方式提交邮件。

## 邮件服务器发送接受邮件
假设用户 a@gmail.com 发送一封邮件到 b@qq.com，大致会执行流程：

- gmail.com 服务器会通过 DNS 查询到 qq.com MX 记录，找到服务器 IP 所在
- 邮件通过 SMTP 协议发送给 qq.com 服务器



## Ubuntu 安装 postfix
安装 postfix

    sudo apt install postfix

完成之后可以查看版本

    sudo postconf mail_version

安装过程中可能出现这几个选项：

- No configuration 表示不要做任何配置；
- Internet Site 表示使用本地 SMTP 服务器发送和接收邮件；
- Internet with smarthost 表示使用本地 SMTP 服务器接收邮件，但发送邮件时不使用本地 SMTP 服务器，而是使用第三方 smart host 来转发邮件；
- Satellite system 表示邮件的发送和接收都是由第三方 smarthost 来完成。
- Local only 表示邮件只能在本机用户之间发送和接收。

选择 Internet Site 即可。

postfix 配置文件主要集中在 `/etc/postfix` 目录下，最重要的两个文件是 `master.cf` 和 `main.cf` ，先编辑 `main.cf` 查看 hostname 设置正确，myhostname 的值要对应域名 MX 记录的主机名。

    myhostname = mail.example.com

修改配置后重新加载配置

    sudo /etc/init.d/postfix reload

其他相关的配置，注意真正配置时，不要在同一行加 # 注释，注释放在上下行。

    #这一行为配置域名也就是 @ 后面的部分
    mydomain = $mydomain
    mydestination = $myhostname
    # 默认为 all 表示接受来自所有网络的请求，改为 loopback-only http://www.postfix.org/postconf.5.html
    inet_interfaces = loopback-only
    # 配置哪些地址邮件能够被 Postfix 转发
    relay_domains = $mydomain

### 测试发信
在配置完成之后就能够通过命令行发送邮件，加入当前登陆的用户是 einverne，那么用户的邮箱就是 einverne@domain.com 类似。在安装 Postfix 同时，也会安装一个 sendmail 程序，可以通过这个命令行交互程序测试发送邮件。

    sendmail name@gmail.com

回车之后会进入等待，第一行输入 Subject，回车，输入 `.` 结束邮件，然后登录邮箱查看邮件，如果收到邮件表示 postfix 已经具有发件能力。

详细一些，可以新建文本 mail.txt：

    To: my@domain.com
    Subject: sendmail test two
    From: me@domain.com

    And here goes the e-mail body, test test test..

然后使用 `sendmail -vt < ~/.mail.txt`

或者

    echo "Subject: sendmail test" | sendmail -v my@email.com

### 测试收件

因为本机还没配置 DNS，所以其他邮件服务商无法识别主机，所以使用 telnet 测试。

    telnet localhost 25
    Trying 127.0.0.1
    Connected to localhost
    Escape character is '^]'.
    220 mail.example.com ESMTP Postfix (Ubuntu)
    MAIL FROM: youremail@gmail.com
    250 2.1.0 Ok
    RCPT TO: root
    250 2.1.5 Ok
    DATA
    354 End data with .
    text
    .
    250 2.0.0 Ok: queued as 9A13A130FDA
    QUIT
    Connection closed by foreign host.

中间 MAIL FROM， RCPT，DATA，text，点，QUIT 这几行都是需要手动输入的。然后在本地服务器上查看信件内容

    sudo tailf /var/mail/root

大致会看到

    Delivered-To: root@yourhost
    Received: from localhost (localhost [127.0.0.1])
            by yourhost (Postfix) with SMTP id 9A13A130FDA
            for <root>; Wed,  5 Sep 2018 16:56:14 +0800 (CST)
    Message-Id: <20180905085622.9A13A130FDA@yourhost>
    Date: Wed,  5 Sep 2018 16:56:14 +0800 (CST)
    From: youremail@gmail.com

    text

Postfix 默认使用 mbox 格式将系统用户的邮件存放到 /var/mail 目录下。

### 使用 mail 命令行
之前通过 sendmail 命令能够发送邮件，查看 `/var/mail` 目录也能够查看收件的信息。通过 `sudo apt install mailutils` 中的 mail 命令能够方便的进行发信和收信操作。

发信

    mail user@gmail.com

命令行会进入发信，自动出现 Cc， Subject 等等，填入主题和正文和使用 Ctrl + D 来发送邮件。

查看收件箱直接输入 mail 就行。如果要查看第一封邮件，输入数字 1。

- 删除第二封邮件， d 2
- 删除多封邮件， d 2 3 4 或者 d 2-10
- 阅读下一封邮件 n
- 回复第一封邮件， reply 1
- 退出 q 或者 x ，如果按 q 退出 mail 程序，那么已经阅读的邮件会从 /var/mail 移动到 /home/mbox 中，邮件客户端可能不能阅读这些邮件，如果不想移动可以使用 x 退出。



### 配置相关
master.cf 配置文件来决定如何启动 Postfix daemon，而 main.cf 配置文件则是配置 Postfix 的主要文件。Postfix 配置参数非常多，为了方便查找，通常在 main.cf 同目录下会附加一个 main.cf.proto 样例文件，里面有非常详细的注释。

Postfix 提供了一个命令行中修改 main.cf 配置文件的工具 ---- postconf，但是如果熟悉 main.cf 也可以直接使用 vim 等编辑工具直接修改文件。


### 设置 MX 记录
如果邮件服务器准备对外使用，需要接收来自其他邮件服务商的邮件，需要将域名 DNS 修改

    mail          A       123.45.6.7

主域名设置 MX 记录

    mail          MX         mail.domain.com

@ 符号表示主机名，相当于 domain.com，MX 记录制定了 domain.com 这个域名的邮件服务器主机，如果收件人邮箱 @ 域名地址，发件人 MTA 将邮件投递到 mail.domain.com 这个主机，A 记录将 mail.domain.com 解析为 IP

本地测试

    dig example.com mx

然后在本地发送邮件测试 `sendmail root@example.com`


## mbox 格式
mbox 格式的邮件，以 From 接一个空格开始，空格之后是邮件地址，然后是收件日期

    From name@example.com Wed Feb 25 16:04:34 2018

之后就是邮件正文内容，最后结束总是以一个空行结束。

## 安装 Dovecot
安装

    sudo apt-get install dovecot-core dovecot-imapd
    sudo dovecot --version

Dovecot 的配置在 `/etc/dovecot/` 下


## reference

- <http://www.postfix.org/documentation.html>
- <https://chloerei.com/2015/04/22/install-and-configure-postfix/>
- [Debian 8 中安装 Postfix](https://www.linuxdashen.com/debian-8-server%E6%90%AD%E5%BB%BApostfixdovecot%E9%82%AE%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8)
