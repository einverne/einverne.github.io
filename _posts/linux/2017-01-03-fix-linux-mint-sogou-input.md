---
layout: post
title: "修复 Linux mint 下 sogou 输入法"
tagline: ""
description: ""
category: Linux
tags: [Linux, Linux Mint, Sogou]
last_updated: 
---

记录一下 Linux 下 Sogou 输入法失效的问题，以及解决修复过程。 Linux 真是太难折腾了，一些配置总是太乱，没有文档，没有集中的 Q&A ,导致使用过程非常困难，一些基础设施都很难用。当然如果调教的好，也是能够非常高效的。比如解决了这个基础打字问题之后的这篇文章就是在 Linux Mint 下完成的。

## 问题描述 {#Question}

不知道是系统升级还是因为输入法升级，（可在我印象中完全没有做任何干扰到输入法的事情），搜狗输入法 Linux 版，就这么挂掉了，而其他设置一切正常，其他的输入法也都一切正常，但是实在无法用的过来， RIME没有一个可更新的词库，google pinyin 也是词库不全，使用起来总还是不太方便，虽然 sogou 输入法在 Linux 下有些问题所在，但是还是相对来说比较好用的，但是它就这么挂了。

## 解决过程 {#Solution}

在刚开始的时候以为是 Fcitx 的问题，卸载 `sudo apt remove fcitx`，重装，登入登出好几回，发现并没有任何用，期间也尝试使用过 iBus，但是实在无法使用。

最后在网上查阅问题的时候，[发现](http://blog.csdn.net/dc_726/article/details/51914827) 搜狗输入法在系统的 `~/.config` 下会有三个配置文件夹，包括

- SogouPY
- SogouPY.user
- sogou-qimpanel

将此三文件夹，移动位置，或者删除，重新安装搜狗输入法，登出，登录，即可。