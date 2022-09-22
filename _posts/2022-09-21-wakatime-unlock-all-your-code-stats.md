---
layout: post
title: "使用 WakaTime 统计编码时间"
aliases:
- "使用 WakaTime 统计编码时间"
tagline: ""
description: ""
category: 产品体验
tags: [ wakatime, intellij-idea , code-stats ]
create_time: 2022-09-20 09:47:02
last_updated: 2022-09-22 03:33:47
---

[[WakaTime]] 是为程序员打造的编码统计 Dashboard，可以同来统计项目，编程语言，IDE，编码时间等等内容。 [之前在折腾 GitHub Profile](/post/2022/09/github-profile.html) 的时候发现的，可以在 GitHub Profile 页面中动态的展示最近的编程状态。

WakaTime 可以统计的内容包括：

- 每天在每个项目上的编码的时间
- 使用的编辑器
- 编程语言占比
- 所使用的操作系统
- 所在的项目

## Price
WakaTime 基础使用是免费的，但有如下限制：

- 只包含两个星期的历史
- 有限的整合
- 3 位朋友之间的 Leaderboards

对于 Premium 可以解锁更多的 [功能](https://wakatime.com/pricing) 。

## Config
WakaTime 的配置文件在 HOME 目录下的 `.wakatime.cfg` 文件中。

```
cat ~/.wakatime.cfg
[settings]
api_key=
proxy = 
debug = false
status_bar_enabled = true
```

## IntelliJ IDEA (JetBrains 系列)

插件 Market 中搜索 wakatime，重启 IDEA，在弹出的 WakaTime Settings 中填入 API key。

如果要设置 proxy，可以在下面填入 `http_proxy` 类似：`http://localhost:1080`

## Vim


    Plug 'wakatime/vim-wakatime'



## Self-hosted

- [[wakapi]]
