---
layout: post
title: "写了一个推送图书到 Kindle 的 bot"
aliases: "写了一个推送图书到 Kindle 的 bot"
tagline: ""
description: ""
category: 学习笔记
tags: [kindle, telegram, bot, python-telegram-api, ]
last_updated:
---

最近因为好奇所以大致的看了一下 Telegram 的 bot，[很早](/post/2016/07/telegram-review.html) 就开始用 Telegram 但事实上，我大部分情况下就是将 Telegram 作为一个跨平台同步工具和备份工具来使用，直到最近因为 Ingress 的一些朋友和一个图书群我对 Telegram 才有了更多的使用，也在 Telegram 发现了每周会推送一本书的 Channel。

所以我想照着有一个叫做 to_kindle_bot 的号自己写了一个将图书发送到 kindle 邮箱的机器人，bot 要实现的功能很简单，就是将图书资源发送给 bot 之后将图书发送邮件推送到关联的 kindle 邮箱。将任务拆解开，主要的步骤也比较简单

- 首先要了解的就是 Telegram bot 的 API
- 再次存储用户的 kindle 邮箱
- 再次就是将文件获取之后发送到对应的邮箱中

再做的过程中，我又增加了一些功能

- 比如，在 bot 获取到图书之后会自动解析这本图书的 meta 信息和封面信息
- 比如，kindle 有些格式不支持，所以要提前进行转码

所以一一解决这些问题即可。

## How do bots works?
Telegram Bots 是一些特殊的账号，不需要设定电话号码。用户可以通过如下方式和 bot 交互：

- 通过直接或将 bot 添加到群组并[发送信息或命令给 bot](https://core.telegram.org/bots#commands)
- 直接在输入框中 `@botname` 并在后面输入请求，这样可以从 [inline bots](https://core.telegram.org/bots/inline) 直接发送内容到任何聊天，群组或频道

## Telegram Bot API
这一部分其实也没有什么要多说的，botFather 会创建好 bot，然后我用 Python 的 python-telegram-api。基本上也都是非常成熟的文档。

## 存储邮箱
因为早之前就已经做了一个图书相关的网站，所以理所当然的将用 telegram uid 和用户的 kindle 邮箱做了以下映射。

## 发送邮件
这部分其实之前也做过，所以直接使用 Flask mail 或者标准库里面的 smtp 去发就行了，邮件服务早[之前](/post/2017/07/email-services-collection.html) 也做过调查，也是现成的用 mailgun 了。

## 获取图书信息
这一部分确实花了我一些精力，使用 python 的 ebooklib 库来解析了 epub 格式的电子书，也因为 epub 格式鱼龙混杂，所以[修了几个 bug](https://github.com/aerkalov/ebooklib/issues/171)，但是 epub 格式的图书解析确实解决了，但是 mobi 格式我是没有找到任何方式来解析，不过幸好，调研的过程中发现了 Calibre 自带的 ebook-meta 命令行工具，在测试之后发现非常好用，支持的格式也非常多，几乎能够支持 99% 的情况，那这样一来获取图书 meta 和封面的工作也 OK。

## 图书格式转码
这部分一开始准备想要用 Amazon 提供的 kindlegen 命令行工具来实现的，但是发现他只能够将 其他的格式转为 mobi 格式，那这样局限就比较大了，虽然能够 cover 我现在的需求，但是如果以后有 mobi 格式转 epub 格式的需求，其实就有了问题，不够幸好还是 Calibre 这个强大的工具，提供了 ebook-convert 命令行工具，能够转化非常多的格式，所以理所当然的就采用了它。

至此就完成了 bot 90% 的工作，剩下就是组织一些文案和 bot 的零星的 bug 问题，所以可以试用下 [@kindlepush_bot](http://t.me/kindlepush_bot)。

## bot 主要命令功能

bot 现在为止一共有 `start` `help` `email` `settings` 这几个功能，除开 settings 功能还未完成， email 命令用来设置 kindle 邮箱，start 和 help 命令用来显示帮助，settings 功能我设想可以让用户选择一个频率，bot 会自动在这个频率下发送一本书到 kindle 邮箱中。

另外如果大家喜欢电子书，我用 Flask 练手的电子书网站 <https://book.einverne.info> 也欢迎使用。

## reference

- <https://core.telegram.org/bots>
