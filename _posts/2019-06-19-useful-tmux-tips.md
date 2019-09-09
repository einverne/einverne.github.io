---
layout: post
title: "Useful tmux tips"
tagline: ""
description: "一些有用的 Tmux 小技巧"
category: 学习笔记
tags: [tmux, linux, commands, terminal,]
last_updated:
---

Tmux 是一个很强大的终端复用工具，下面是日常积累中记录的一些使用经验。


## Multiple Pane Synchronization
Tmux 一个非常著名的功能就是可以多个 Pane 同步输入，使用方式：

- `prefix`
- 输入 `:setw synchronise-panes on`
- 然后在多个 Pane 中就开启了同步

同理配置 `:set synchronise-panes off` 就可以关闭


## Zooming tmux
tmux 1.8 引入了 Zoom 功能，支持一键最大化当前 Working Pane，使用 `prefix` + `z` 来放大，再次按下恢复。


## Navigation between Tmux Pane and vim
在 Tmux 和 Vim 之间无缝切换。

- <https://github.com/christoomey/vim-tmux-navigator>

更多内容可以参考我的 [配置](https://github.com/einverne/dotfiles)

## reference

- <https://www.sitepoint.com/10-killer-tmux-tips/>
- <https://github.com/einverne/dotfiles>
