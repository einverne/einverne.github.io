---
layout: post
title: "macOS 下利用 Karabiner Elements 修改日本 JIS 键盘布局到美式键盘布局"
aliases:
- "macOS 下利用 Karabiner Elements 修改日本 JIS 键盘布局到美式键盘布局"
tagline: ""
description: ""
category: 经验总结
tags: [ japanese-keyboard, japanese, mac, keyboard, keyboard-layout, us-layout, jis-keyboard, jis, ]
create_time: 2023-06-29 13:49:41
last_updated: 2023-06-29 13:49:41
---

本文介绍一下在  macOS 下如何通过 Karabiner Elements 这一款键盘映射修改应用将 JIS 布局的日文键盘修改成我熟悉的 US Layout 的键盘。

## JIS 键盘布局

JIS 键盘布局是日本是最常见的键盘布局，它与国内常用的美式键盘布局有一些不同之处。如果你习惯了美式键盘布局，使用 JIS 键盘可能会感到不便。

可以明显感到区别的是

- JIS 键盘的空格键非常短，我个人几乎只能使用左手大拇指来按
- 空格左边原来非常高频使用的 Command 按键变成了「英数」按键，同样空格键右侧的 Command 按键也变成了 かな
- 原来美式键盘的 Caps Locks 变成了 control 按键，虽然使用 Vim 有些人还会被鸡肋的 Caps Locks 手动修改成 Control 键，当时我一直都是将 Caps Locks 修改成按下就表示同时按下 Command + Ctrl + Option + Shift 这样的组合按键（Hyper Key），然后通过 Caps Locks 按键组合其他快捷键就可以实现非常多的功能，比如 Caps Locks + hjkl 快速调节窗口的位置，Caps Locks + f 全屏窗口等等，我都用 [[Hammerspoon]] 和 [[Karabiner Elements]] 这样的工具实现了，但是在 JIS 键盘下就把我的习惯给打破了
- 最后一个令我非常不习惯的就是数字按键 1 左边的 `~` 按键，写 Markdown 非常常用的 **tilde** 按键（行内格式化代码） 在 JIS 键盘中消失了
- 最后还有一些细节部分，比如 JIS 键盘上退格键非常小！但是 Enter 键却又特别大！

![A8NI](https://photo.einverne.info/images/2023/06/29/A8NI.jpg)


## 通过 Karabiner Elements 修改键盘布局

[[Karabiner Elements]] 是一款强大的键盘映射工具，可以很容易地修改 JIS 键盘布局到美式键盘布局。本文将向你展示如何使用 Karabiner Elements 来实现这一目标。

首先，你需要下载并安装 Karabiner Elements。你可以在官方网站上找到适用于 macOS 的安装程序，并按照指示进行安装。一旦安装完成，你就可以打开 Karabiner Elements 并开始配置键盘映射。

或者通过 brew 来安装

```
brew install --cask karabiner-elements
```


## 简单修改

在 Simple Modifications 选项中配置了如下的映射关系。

- 英数キー -> left command
- left command -> left option
- left option -> left control
- left control -> caps lock

![PJjD](https://photo.einverne.info/images/2025/05/27/PJjD.png)

### Complex Mofications

在 Karabiner Elements 的界面中，点击左侧的“Complex Modifications”选项卡，然后点击右下角的“Add rule”按钮。在这个界面也可以通过从[在线网站](https://ke-complex-modifications.pqrs.org/)导入的方式。点击 Import more rules from Internet，来从网站下载更多的规则。打开网站规则列表，其中包含各种可用的键盘映射规则。

在规则列表中，找到“Japanese JIS Keyboard to US Keyboard：Remap Symbol Keys”规则，并勾选它。这将启用该规则并应用键盘映射。

接下来，你可以点击右侧的“Details”按钮，以查看该规则的详细信息。在这里，你可以看到该规则将会对哪些键进行映射，以及映射的具体内容。默认情况下，该规则将会将 JIS 键盘布局中的一些键映射为美式键盘布局中的相应键。例如，JIS 键盘布局中的 “@” 键将会映射为 `[` 键，而 `[` 键将会映射为 `]` 键。

现在，可以关闭 Karabiner Elements，并开始使用修改后的键盘布局。打开任何文本编辑器或其他应用程序，你会发现 JIS 键盘布局已经被修改为美式键盘布局。
