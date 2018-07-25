---
layout: post
title: "Linux Mint 下禁用 Alt 拖拽窗口"
tagline: ""
description: ""
category: 经验总结
tags: [linux, mint, cinnamon, shortcut, ]
last_updated:
---

问题的出现，Linux Mint 使用了很长时间了，一直也没有啥大的问题，只是最近自定义一些快捷键，Alt + Shift ，发现所有的 Alt 相关的操作，只要按住 Alt 键，然后鼠标在任何窗口中就变成了小手，拖拽会直接拖动窗口。

## 解决方案一

在 System Settings 中选择 Windows， 然后在 Behavior 下面有 `Special key to move and resize windows` 选择 Disabled 即可。

## 解决方案二
安装 dconf

    sudo apt install dconf-tools

然后在 `org -> cinnamon > desktop > wm > preferences` 下面的 `mouse-button-modifier` 中修改 `<Alt>` 变为 `<Super>` 或者 `<Ctrl>`。


## reference

- <https://forums.linuxmint.com/viewtopic.php?t=264172>
