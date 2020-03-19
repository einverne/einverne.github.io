---
layout: post
title: "命令行的艺术"
tagline: ""
description: ""
category: 学习笔记
tags: [command, command-line, linux, ssh, 命令行 , ]
last_updated:
---

这些年陆陆续续学习，整理了一些[命令](/categories.html#%E6%AF%8F%E5%A4%A9%E5%AD%A6%E4%B9%A0%E4%B8%80%E4%B8%AA%E5%91%BD%E4%BB%A4)，其中也学到了不少，渐渐的才体会到用一行命令带来的效率。于是乎我几乎所有的设备都可以用 SSH 访问，少则有 BusyBox 这些精简的 Unix 工具集，多则就是完整的 Unix 工具集。不说桌面版的 Linux 系统，Android 上可以用 [Termux](/post/2019/06/termux-app.html), 路由器上 [OpenWrt](/post/2017/03/openwrt-settings-and-tips.html) 自身就带了一些基本的命令，而 NAS 上也可以选择 OpenMediaVault 或者在[威联通](/post/2018/04/qnap-ts453bmini.html) 上开启 SSH 登录，进入命令行的世界。

以前需要借助 GUI 才能实现的功能后来发现原来命令行是如此简单，比如设备间互联一个 SSH 就能搞定，要传输文件再多一个 scp，或者需要增量备份可以用 rsync，或者如果要找重复的文件，jdupes, rdfind 一系列的命令可以选择，更不用说测网速，测磁盘读写等等了。


## The Art lf Command Line

整体性对常见的命令做一些了解，可以参考这个项目：

- <https://github.com/jlevy/the-art-of-command-line/blob/master/README-zh.md>

我之前的文章都是临时想要用到某个功能现查的，浪费了我很多时间，如果早一点看到这一份文档的话就可以省去好多检索的时间。

## 规划

以后命令总结应该不会再更新了，简单的命令我会提交给 [tldr](https://github.com/tldr-pages/tldr)，除非是特别复杂的，有特别多选项的命令，否则就不展开了。

如果以后还会有命令行相关的内容，可能会有这样几类：

- 像 tmux, sed, awk 这些命令几乎可以用一本书来学习，可能会有一些常用的笔记
- 命令行合集，比如要实现某个功能有哪些实现方式，比如[查找重复的文件](/post/2019/12/find-and-delete-duplicate-files.html)，比如查看网速等等

## tldr
就像上文所说，简单命令的文章就不再写了，下面就记录下提交到 tldr 的 Pull Request：

- [pidstat](https://github.com/tldr-pages/tldr/pull/3529)
- [stress](https://github.com/tldr-pages/tldr/pull/3694)
- [pwdx](https://github.com/tldr-pages/tldr/pull/3743)
- [jdupes](https://github.com/tldr-pages/tldr/pull/3857)
- [vmstat](https://github.com/tldr-pages/tldr/pull/3890)
- [transmission-create](https://github.com/tldr-pages/tldr/pull/3916)

更多可以在[这里](https://github.com/tldr-pages/tldr/pulls?q=is%3Apr+author%3Aeinverne) 看到。
