---
layout: post
title: "Sieve 一个过滤邮件的语言"
aliases:
- "Sieve 一个过滤邮件的语言"
tagline: ""
description: ""
category: 学习笔记
tags: [mail, mailcow, sieve, email, programming-language]
create_time: 2023-04-12 20:44:28
last_updated: 2023-04-12 20:44:28
---

之前在搭建 [Mailcow](/post/2022/04/mailcow-email-server.html) 邮件服务器的时候简单的了解到了 Sieve 这个可以用来编程过滤邮件的语言。刚好现在要充分利用起 [Mailcow](https://client.einverne.info)，所以系统地学习一下 Sieve 这个邮件过滤编程语言。

## 什么是 Sieve

[Sieve](https://en.wikipedia.org/wiki/Sieve_%28mail_filtering_language%29) 是由 [RFC 5528](http://www.ietf.org/rfc/rfc5228.txt) 定义的一门专门用来处理电子邮件的语言。它被设计不仅可以用于邮件客户端的邮件过滤，也可以在邮件服务器端进行过滤。设计它的目的在于扩展性，且独立于邮件架构和操作系统。 它适合运行在不允许用户执行程序的邮件服务器上运行，例如在 IMAP 服务器上。因为 Sieve 中没有变量，没有循环，也不运行调用外部的 Shell。

## Sieve 不是什么

- Sieve 不计划独立成为一门成熟的编程语言
- Sieve 并不适用于过滤或处理除 RFC 822 消息以外的内容
- Sieve 也不打算代替现存的其他工具

## Sieve 过滤器的格式

Sieve 没有特别复杂的结构，只是包含一组命令，比如 `discard`, `if`, `fileinto` 等等

```
require ["fileinto", "reject"];

# Daffy Duck is a good friend of mine.
if address :is "from" "daffy.duck@example.com"
{
    fileinto "friends";
}

# Reject mails from the hunting enthusiasts at example.com.
if header :contains "list-id" "<duck-hunting.example.com>"
{
    reject "No violence, please";
}

# The command "keep" is executed automatically, if no other action is taken.
```

第一行脚本（require 命令）告诉 Sieve 解释器将使用可选的命令文件。然后是两个过滤规则。第一个过滤规则将所有来自 “ daffy.duck@example.com” 的邮件存储到名为“friends”的邮箱中。第二个规则拒绝头部包含字符串“<duck-hunting.example.com>”的 List-Id 字段的邮件。

如果脚本中没有匹配的条件，则应用默认操作，即隐式“保留”命令。该命令将邮件存储在默认邮箱中，通常是 INBOX。

Sieve 有两种注释写法

```
# Everything after # character will be ignored.

/* this is a bracketed (C-style) comment. */
```

和地址比较，`From:`, `To:`, `Sender:`

还有三个可选的参数可以用来比较

- `:localpart`，`@` 符号前面的部分
- `:domain`，`@` 符号后面的部分
- `:all`，全部

```
# The two test below are equivalent;
# The first variant is clearer and probably also more efficient.
if address :is :domain "to" "example.com"
{
    fileinto "examplecom";
}
if address :matches :all "to" "*@example.com"
{
    fileinto "examplecom";
}
```

一个邮件地址通常是 `"FirstName LastName" <localpart@domain>` 这样组成的。

比较 Header 中其他字段。

```
# File mails with a Spamassassin score of 4.0 or more
# into the "junk" folder.
if header :contains "x-spam-level" "****"
{
    fileinto "junk";
}
```

### 匹配类型

Sieve 提供了三种比较方法：

- `:is`，比较两个字符串完全相等
- `:contains`，是否包含
- `:matches`，使用通配符 `?` 来匹配一个未知字符，使用`*` 来匹配零个或多个未知字符

```
# Reject all messages that contain the string "viagra"in the Subject.
if header :contains "subject" "viagra"
{
    reject "go away!";
}
# Silently discard all messages sent from the tax man
elsif address :matches :domain "from" "*hmrc.gov.uk"
{
    discard;
}
```

### List of Strings

匹配列表：

```
# A mail to any of the recipients in the list of strings is filed to the folder "friends".
if address :is "from" ["daffy.duck@example.com", "porky.pig@example.com", "speedy.gonzales@example.com"]
{
    fileinto "friends";
}
```

如果要表达，from 或 sender 是某邮箱的时候，做什么

```
# Check if either the "from" or the "sender" header is from Porky.
if address :is ["from", "sender"] "porky.pig@example.com"
{
    fileinto "friends";
}
```

如果要组合表达

```
# Match "from" or the "sender" file with any of Daffy, Porky or Speedy.
if address :is ["from", "sender"] ["daffy.duck@example.com", "porky.pig@example.com", "speedy.gonzales@example.com"]
{
    fileinto "friends";
}
```

### allof, anyof

- `allof` 测试列表，如果列表中的每一个都是 true，则返回 true，逻辑上的 and
- `anyof` 测试列表，只要其中一个满足，则返回 true，逻辑上的 or

```
# This test checks against Spamassassin's header fields:
# If the spam level ls 4 or more and the Subject contains too
# many illegal characters, then silently discard the mail.
if allof (header :contains "X-Spam-Level" "****",
          header :contains "X-Spam-Report" "FROM_ILLEGAL_CHARS")
{
    discard;
}
# Discard mails that do not have a Date: or From: header field
# or mails that are sent from the marketing department at example.com.
elsif anyof (not exists ["from", "date"],
        header :contains "from" "marketing@example.com") {
    discard;
}
```

### 过滤信息大小

可以使用 `size` 来检测

```
# Delete messages greater than half a MB
if size :over 500K
{
    discard;
}
# Also delete small mails, under 1k
if size :under 1k
{
    discard;
}
```

## Example

一个简单的 Sieve 过滤器的例子是将所有来自特定发件人的邮件自动转发到另一个邮箱。下面是一个示例 Sieve 脚本：

```
if header :contains "From" "example@example.com" {
  redirect "another@example.com";
}
```

这个脚本将检查邮件的发件人是否是"example@example.com"，如果是，则将邮件重定向到"another@example.com"。

## Mailcow

在 Mailcow 中可以通过如下的路径设置 Sieve 过滤器。

```
Configuration -> Mail Setup -> Filters -> Add filter
```

另外如果有人想要创建自己的自定义域名邮箱，欢迎到 [EV Hosting](https://client.einverne.info) 订购使用。

## reference

- <http://sieve.info/>
- <https://p5r.uk/blog/2011/sieve-tutorial.html>
- <https://proton.me/support/sieve-advanced-custom-filters>
