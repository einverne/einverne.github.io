---
layout: post
title: "记录一下 Clientexec 中配置 SMTP 时的一些问题"
aliases:
- "记录一下 Clientexec 中配置 SMTP 时的一些问题"
tagline: ""
description: ""
category: 经验总结
tags: [ clientexec, web-hosting-billing, mailcow, smtp, email, python ]
create_time: 2023-04-04 08:40:14
last_updated: 2023-04-05 08:41:54
---

本文记录一下在配置 Clientexec 中的 SMTP 发送邮件的时候遇到的一些错误。添加了 [[mailcow]] 的 SMTP 配置，但是测试发送邮件总是报如下的错误。

## 验证 SMTP 配置

> SMTP Error: The following recipients failed: email-test@clientexec.com: : Sender address rejected: not owned by user admin@mailcow.email

这就非常奇怪， 为了验证我的 SMTP 配置是没有问题的，我还直接写了一段 Python 发送邮件的程序，邮件是可以正常的发送出去的。所以我把怀疑点移动到了 Clientexec 面板。开始怀疑是不是 [[Clientexec]] 在 SMTP 配置的地方有什么 BUG。

## 验证 Clientexec 后台 SMTP 设置

为了验证 Clientexec 后台的 SMTP 设置是可以正常工作的，我看到官方的文档上提供了 Gmail SMTP 设置的说明，所以我直接用之前的 Gmail 的 SMTP 设置，在 Clientexec 后台配置了一下。测试是可以正常发送邮件的。唉，难道还是我的 SMTP 配置不正确。

为了验证不是 Clientexec 只优化了 Gmail 的发送邮件，我又把域名添加到 [[MXRoute]] 生成了一个 SMTP 的用户名和密码。然后在 Clientexec 后台添加了配置，测试，发现竟然也发送成功了。那么到此时我只能怀疑是不是 Mailcow 在发信的时候有一些限制。

### 开启 Clientexec 调试日志

编辑 `config.php`

```
    // ***  LOG_LEVELS (each level adds additional information) ***
    // 0: No logging
    // 1: Security attacks attempts, errors and important messages (recommended level)
    // 2: Reserved for debugging
    // 3: + Warnings and EventLogs, VIEW/ACTION and Request URIs and URI redirections and POST/COOKIE values
    // 4. + plugin events, curl requests, some function calls with their parameters, etc.
    //          (use this when sending logs to support)
    // 5: + include suppressed actions
    // 6: + Action responses (ajax,serialized,XML (as array)
    // 7: + SQL queries
    define('LOG_LEVEL', 6);

    // To activate text file logging, replace the 'false' with the file full path. Do not use relative paths.
    // Use absolute paths(e.g. /home/yourinstallationpath/ce.log, instead of ce.log)
    // The log may show passwords, so please use a file outside the web root, but writable by the web server user.
    define('LOG_TEXTFILE', 'ce.log');

```

然后将日志等级调整到 6，将日志写到文件中方便查看。

然后在页面操作的时候查看日志 `less ce.log`。

于是我又将 Mailcow 的 SMTP 配置添加到后台，进行测试。同时观察日志。

```
(4) 04/05/23 07:35:42 - Starting to send Test Email with subject "Clientexec Test Email"...
(5) 04/05/23 07:35:43 - CLIENT -> SERVER: EHLO client.einverne.info

(5) 04/05/23 07:35:43 - CLIENT -> SERVER: STARTTLS

(5) 04/05/23 07:35:44 - CLIENT -> SERVER: EHLO client.einverne.info

(5) 04/05/23 07:35:44 - CLIENT -> SERVER: AUTH LOGIN

(5) 04/05/23 07:35:44 - CLIENT -> SERVER: [credentials hidden]
(5) 04/05/23 07:35:44 - CLIENT -> SERVER: [credentials hidden]
(5) 04/05/23 07:35:45 - CLIENT -> SERVER: MAIL FROM:<admin@client.einverne.info>

(5) 04/05/23 07:35:45 - CLIENT -> SERVER: RCPT TO:<email-test@clientexec.com>

(5) 04/05/23 07:35:45 - SMTP ERROR: RCPT TO command failed: 553 5.7.1 <admin@client.einverne.info>: Sender address rejected: not owned by user admin@mailcow.mail

(5) 04/05/23 07:35:45 - CLIENT -> SERVER: QUIT

(5) 04/05/23 07:35:45 - SMTP Error: The following recipients failed: email-test@clientexec.com: <admin@client.einverne.info>: Sender address rejected: not owned by user admin@mailcow.mail
```

发现了 SMTP Error。

## 验证 Mailcow

因为排除了 Clientexec 后台配置的问题，于是我使用 Mailcow 加上 `Sender address rejected` 关键字进行搜索，这才发现 Mailcow 相关的问题出现过很多次， 原来是 Mailcow 默认开启了 Sender Addresses Verification，必须要手动关闭这个[验证](https://docs.mailcow.email/manual-guides/Postfix/u_e-postfix-disable_sender_verification/) 才能代替发送邮件。

从错误日志中就能发现原来 Clientexec 在测试发送邮件的时候是使用的 `admin@clientexec-domain.com` 来发送邮件的。而我的 SMTP 配置的发件邮箱是 `no-reply@domain.com` 这样的，Mailcow 默认情况下是不允许用户以别人的身份发送邮件的(当然这也是能理解的，我不理解的是 Clientexec 后台明明是有 Override From 这样的选项的，却在测试邮件的功能里用其他邮箱来测试)，所以才会报错。

## 解决问题的方法

本来只是想简单的总结一下解决问题的过程，但这个解决问题的思维过程正好可以提炼成一个思考问题的方式。而我发现我周围的朋友们有大部分的人似乎缺乏这样的思考问题的方法。他们总是将问题简单的归咎于「你的问题」，「我的问题」，这样简单的总结，而不能清晰地将问题发生的错误以及相关的尝试说出来，以至于我无法帮其定位问题。

而以上解决问题的思考方式就是非常简单的排除法。

- 首先是验证 SMTP 配置是否有问题，用 Python 写了一段发信程序
- 然后是验证 Clientexec 后台 SMTP 配置是否有 BUG，通过尝试其他的 SMTP 配置，发现没有问题
- 那是不是 SMTP 提供服务的 Mailcow 有问题，通过日志和错误信息查询到原因
