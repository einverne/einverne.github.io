---
layout: post
title: "下载 YouTube 视频方法总结"
aliases:
- "下载 YouTube 视频方法总结"
tagline: ""
description: ""
category: 经验总结
tags: [ youtube, yt-dlp, linux, telegram, telegram-bot, python ]
create_time: 2023-03-19 13:55:49
last_updated: 2023-03-19 13:55:49
---

之前就简单地介绍过使用[yt-dlp](/post/2022/09/yt-dlp.html) 来下载 YouTube 视频，yt-dlp 是自从 youtube-dl 不再更新之后有人接手开发的新工具。但这篇文章重点是在于下载 YouTube 视频，我会整理一下我目前了解的所有可视化，命令行，Telegram bot 等等工具。

## 界面

- [[Downie]] 是一个非常好用的付费下载视频的工具，不仅支持 YouTube， 还可以下载很多视频网站。

## 命令行工具

- [yt-dlp](/post/2022/09/yt-dlp.html) 是一个 Python 编写的命令行工具，只要本地有 Python 环境就可以非常快速的安装。

## Telegram Bot

- [ytdlbot](https://github.com/tgbot-collection/ytdlbot) 是 BunnyThink 使用 Python 调用 yt-dlp 编写的一个 YouTube 下载机器人，可以自己 Self-hosted，然后改一下代码就可以下载大视频。
