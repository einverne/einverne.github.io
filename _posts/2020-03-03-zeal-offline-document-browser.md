---
layout: post
title: "Zeal 离线文档阅读"
tagline: ""
description: ""
category: 经验总结
tags: [zeal, linux, document, offline, ]
last_updated:
---

之前也总结过一篇[文章](/post/2016/10/document-browser-comparison.html)，对比了 Zeal 和 Mac 下的 Dash，不过这么长时间过来，已经熟悉了 Zeal，所以再总结一下 Zeal 的使用技巧。

## 指定文档搜索
Zeal 最常用的方式就是直接搜索方法名或者类名，但是有的时候本地的文档太多，就会出现很多结果，不同语言，不同内容混在一起。所以在 Zeal 搜索框中可以使用前缀来缩小搜索范围。比如想要搜索 `java8` 中的 `ConcurrentMap` 那么就可以输入：

	java8: ConcurrentMap


## 自定义 Docset 路径
默认情况下 Zeal 会使用 `~/.local/share/Zeal/Zeal/docsets` 作为 Docset 默认路径，这个路径在 `~/.config/Zeal/Zeal.conf` 配置文件中。

- 可以手动修改上述配置文件
- 或者在界面中 General 中配置

## User generate
用户贡献的 documents.

- <https://zealusercontributions.herokuapp.com/>


## reference

- <https://zealdocs.org/>
