---
layout: post
title: "Telegram 技巧"
tagline: ""
description: ""
category: 产品体验
tags: [Telegram, IM, ]
last_updated: 
---


感觉是时候写一篇 Telegram 的安利文了。Telegram 简单介绍就是一款 IM， 及时聊天工具。当然其实他远远的超越了一个IM，却依然保持了作为一个IM应有的速度和快捷。

对于基本功能，[電腦玩物 Telegram 10技](http://www.playpcesor.com/2015/12/telegram-10.html) 已经将 Telegram 的主要功能及使用技巧说得非常明白了，就不再多说了。其中我最喜欢的几点：

- 跨平台，这也正是我一直坚持 Hangout 的原因之一，我不喜欢整天抱着手机，我在电脑前的时间可比拿手机的时间长，我也不希望我坐下之后需要花很长的时间，打开一个客户端输入密码，然后还要花一段时间同步消息，关键有些客户端之间还不能同步消息记录。而 Telegram 给我的体验就和 Hangout 一致，多个平台，多个设备几乎能够在同一时间受到消息，我也能够在任何一个客户端回复，并且所有客户端的消息都是同步的。
- Bot ，聊天机器人，很久之前的 Gtalk 也是支持机器人的，对那个自动翻译的机器人还是略有记忆，只是后来就没有后来了。而 Telegram 正是将聊天机器人这个命题重新书写了。开放的Bot系统，让 Telegram 成为了一个全能的平台，他是一个 IM ，他也可以是一个翻译工具，只需要一个翻译bot，他也可以是一个RSS阅读器，只需要一个RSS订阅bot，他也可以是一个Tinder，只需要一个约会bot...... Telegram 可以变成想要的任何工具，更不说官方集成的 @gif， @bold，@sticker [等等 bot](https://core.telegram.org/bots)  。
- 开放，作为一个 IM，应该能够包容万千也能够开放的分享，这就提到了 Telegram 支持的媒体内容，文字，链接，音频，视频，gif，表情贴图，能够想到的几乎所有内容都可以兼容，甚至有人直接 Telegram 来当音乐播放器。并且 Telegram 在图片以及 Gif 分享的时候做了很多的优化处理，我在日常使用中几乎没有感受到任何卡顿，甚至流量的消耗也在我可接受的范围。

以下就是几个非常吸引人的Point：

## Sticker

说了这么多，其实重点想要谈谈他的贴图以及 Bot 系统。首先是贴图，在刚上手 Telegram 的时候，我就被他丰富的表情震撼到了，就像他在 [Blog 中所说](https://telegram.org/blog/stickers)， Telegram 觉得现存任何一个 IM 的表情系统设置都不是很理想，封闭，收费，并且糟糕透顶，于是 Telegram 大笔一挥自己做了一套系统，这是我迄今为止使用过最赞的表情贴图系统。尤其是在最近迷上 Pokemon Go 之后，更是找到了很多萌萌的小精灵。

![pokemon sticker](https://lh3.googleusercontent.com/-73Le-0Rx8L0/WCf4_fHYEzI/AAAAAAABGFI/Bm-EtR6ez2A0mG15eKHllMKuuaOBbKEOwCL0B/w350-h1120-no/Screenshot_20160710-155214.png)

从下面两个网站能够找到你想要的绝大多数表情，多到无法想象：

- <http://stickergram.ru/13.html>
- <http://telesticks.eu/>

如果这两个网站都无法让你满足，Google，以及官方的 @sticker 机器人都可以帮你找到喜欢的表情。当然如果参与到更多的对话中，就能找到更多的表情。

## Bots
几个神奇的内置 bot。在使用过程中竟然遇到了“向聊天群中添加 bot 这样的问题”，不过答案也很简单，拥有群管理权限时，直接添加成员，输入 `@ + bot` 的名字即可。

### @gif
寻找 gif bot，使用最简单了，聊天时直接输入 `@gif whatever I like` ， Telegram 会帮你搜索 `whatever I like` 字段的内容，点击分享即可。

### @bold
Markdown bot 格式化输入

输入： <code>@bold this is *bold* , this is _Italic_ , and this is `some code with *bold*`</code> 。即可得到。

![Telegram bold bot](https://lh5.googleusercontent.com/-2OBcfO5Pxlk/V4eoHnsOnCI/AAAAAAAA_8M/TThMXecHLEkUBumQHiiqK_UPbbdO-cljgCLcB/w435-h72/telegram_bold_bot.png)

### @vote
@vote 用来创建投票

### @like
用来创建 emoji based Like 投票。

### @Stickerdownloadbot
发送给这个 bot 表情，他就自动将表情转换成 png 。

### @sticker
inline bot，可以利用这个 bot 将普通的 emoji 转成其他表情贴图。

然后是一些其他好玩的第三方 bot：

- @GroupButler\_bot 用来管理群组的bot，可以设置 rules , 管理垃圾消息等等
- @storebot 用来发现其他 bot 的 bot
- @utubebot 下载 YouTube 视频
- @Instasave\_bot 用来下载 instagram 的 bot


## SuperGroup
最为人熟知的就是 Telegram 的聊天群了，在一个没有社交关系基础的 Message App 上，最快吸引大众的就是这个 Group 了，通过群组来建立最初的社交基础。而最初的 Group 功能没有那么强大，管理员也只能是创建群的人，后来 Telegram 升级了一次 supergroup ，于是乎 supergroup 就已经拥有了 Message App 该有的功能，管理员权限，置顶消息，消息管理，搜索等等功能，甚至可以再群中添加 bot 来实现一些自定义的功能。

特别值得称道的便是，所有在 Telegram 中分享的内容都保存历史记录，虽然目前中文搜索有些问题，但是跨平台，消息同步已经让我无法离开这个应用了。

最后来记录一些有爱的群组：

- Google Fans <https://telegram.me/googlecn>
- Kindle 中文圈 <https://telegram.me/kindlezh>
- 线上狼人 <https://telegram.me/cnwolf>
- Appinn Talk <https://telegram.me/appinn>
- Openwrt <https://telegram.me/wirelessrouter>
- /r/oneplus <https://telegram.me/joinchat/B9zpUzyx2bFy-Mgq25YFkg>

## Channel
频道的功能类似于微信的订阅号了，Channel 能实现一对多的通知，当然可以拿他当广播，但是和微信订阅号不同的时，Channel 是不能接收回复的。

一些值得关注一下的频道：

- Telegram 新手 <https://telegram.me/newbie_guide>
- 好书分享 <https://telegram.me/haoshufenxiang>
- Btsync Keys <https://telegram.me/btsync>
- 我自己的阅读分享 <https://telegram.me/inoreader>
- Pokemon Channel <https://telegram.me/PokemonChannel>

## Client
最后推荐一个第三方 Android Client : Plus Messenger [Link](https://play.google.com/store/apps/details?id=org.telegram.plus&hl=en)。 虽然官方的客户端已经足够完美了，但是因为加入的群比较多，经常无法找到对应的目的地，这个第三方客户端完美的解决了这个问题。

## Links

- 源代码：<http://telegram.org/apps#source-code>
- 通信协议： <https://core.telegram.org/mtproto>
- API : <https://core.telegram.org/api>
- 注销账户：<https://telegram.org/deactivate>
