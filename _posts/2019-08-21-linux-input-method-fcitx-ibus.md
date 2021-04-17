---
layout: post
title: "Linux 下的输入法 fcitx vs ibus"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, fcitx, ibus, input-method, rime, ]
last_updated:
---

无论在那个系统下，输入法几乎是必备的软件，在 Linux 下有两大主要的输入法支持框架 fcitx 和 IBus，当然有些还有 XIM ，scim 等等。Linux 下本来没有多少用起来非常舒服的中文输入法，有出名很久的 rime, 也有搜狗开发的输入法，不过也是不久之前的事情。

但是稍微注意一下就是知道，搜狗使用的是 fcitx, 而 rime 声称二者都支持，但是 fcitx-rime 已经很久没有更新，主要的更新还在 IBus 那边。那这就需要一个抉择，因为 Linux 下无法将二者并存。


## fcitx

fcitx 是 Free Chinese Input Toy for X 的简称。

源代码托管在 [Gitlab](https://gitlab.com/fcitx)

在 Debian/Ubuntu 下可以使用

    apt install fcitx
    apt install fcitx-pinyin    # 汉语拼音方案
    apt install fcitx-googlepinyin
    apt install fcitx-hangul    # 韩语
    apt install fcitx-rime      # 小狼毫


配置文件内容在

- `/usr/share/fcitx/data/`
- `~/.config/fcitx/`

在看 [fcitx 的一些历史](https://web.archive.org/web/20070712173307/http://www.fcitx.org/main/?q=node/123) 不经唏嘘，如今 2019 年已经过去 12 年 fcitx 依然健在，而那些说 fcitx 不好的人却不知道在哪里。

### 主题

一个非常漂亮的 fcitx 主题

- <https://github.com/hrko99/fcitx-skin-material>

## IBus

IBus 是 Intelligent Input Bus 的简称。

IBus 下也有 rime

    sudo apt install ibus-rime


## 切换输入法
切换输入法可以使用如下命令：

    im-config -s fcitx

如果要查看当前可用的输入法可以使用 `im-config -l` ，更多查看 `man im-config`

或者在界面搜索 `input method`

## Rime

OS X 下的配置管理工具

- <https://github.com/neolee/SCU>


## reference

- <https://wiki.archlinux.org/index.php/Fcitx>
- <https://wiki.archlinux.org/index.php/IBus>
- <https://blogs.gnome.org/happyaron/2011/01/15/linux-input-method-brief-summary/>
- <https://blogs.gnome.org/happyaron/2011/01/15/ubuntu-ime-chinese-pinyin-short-summary-zh/>
