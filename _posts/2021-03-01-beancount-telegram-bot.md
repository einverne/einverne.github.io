---
layout: post
title: "使用 Beancount 记账篇五：使用 Telegram Bot 简化记账"
aliases: "使用 Beancount 记账篇五：使用 Telegram Bot 简化记账"
tagline: ""
description: ""
category: 经验总结
tags: [ beancount, telegram, telegram-bot, accounting, double-entry, ]
last_updated:
---

在了解并使用 [[Beancount]] 的过程中，大多数情况都是通过 VSCode 打开 Beancount 仓库，然后手动进行记录，但是通常情况下消费都是遍布在日常生活中的，不会随时随地都有一个 VSCode 环境，所以就需要一个可以随时随地记账的方法，很早之前想过通过 Alfred，或者通过在线构建一个 Fava 环境，但是一方面 Alfred 手机上并没有，而如果构建一个 Fava 则还有安全性问题，所以一直没有很好的对策，直到有一天我看到有人分享了一篇文章说自己使用 Telegram Bot 来作为 Beancount 的记账，我茅塞顿开。

如果要使用 Telegram Bot 来处理 Beancount 账号，那么有几个关键的步骤需要处理一下

- 读取 Beancount 仓库中的 Account 名
- 根据用户的输入自动和 Account 名匹配，因为在手机上肯定不如电脑有自动补全，所以使用模糊匹配
- 然后根据输入转换成 Beancount 的格式记录在文件中

基于以上的考虑，我调研了一些方案，

- [[CostFlow]]，[Costflow](https://github.com/costflow) 是一个 JavaScript 实现的文本记账工具，有一个实现比较好的 [Parser](https://www.costflow.io/docs/parser/)
- [YUEXUN](https://yuexun.me/blog/use-telegram-bot-and-beancount-for-accounting) 的方案也是通过 Costflow 加上 Node Telegram Bot
- [David Dai](https://blog.stdioa.com/2020/09/using-beancount/) 的方案是通过 Python，加上 OpenAI 的加持，通过 [[向量数据库]] 匹配 Account
- [Wogong beancount bot](https://github.com/wogong/beancount-bot) 通过正则匹配 Account，通过固定格式的输入作为解析源

我综合考虑了上述的所有方案，最后在 Wogong 的基础上做了一下自己的修改，因为使用正则的方式还是有可能匹配到多个 Account，所以每一个提交都做了一个提交和取消的确认操作，如果没有问题就提交到文件如果有问题，我就会再次输入更加精确的账户名字。

使用这个 Bot 的时候，也需要自己对 Beancount 中账户的名字比较了解，并且对正则表达式比较熟悉，才能够比较精准地匹配上 Account 名。

![P_ZjdylE4b](https://pic.einverne.info/images/P_ZjdylE4b.jpeg)

## related

- <https://web.archive.org/web/20210824054217/https://www.ahonn.me/blog/use-telegram-bot-and-beancount-for-accounting>
- https://www.ahonn.me/blog/use-telegram-bot-and-beancount-for-accounting

[[Beancount Telegram bot]]

## reference

- [个人 Beancount 模板](https://github.com/einverne/beancount-sample)
