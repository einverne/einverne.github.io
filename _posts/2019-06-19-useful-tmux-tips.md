---
layout: post
title: "一些 Tmux 使用小技巧"
tagline: ""
description: "一些有用的 Tmux 小技巧"
category: 学习笔记
tags: [tmux, linux, commands, terminal,]
last_updated:
---

Tmux 是一个很强大的终端复用工具，下面是日常积累中记录的一些使用经验。


## 多 Pane 同步输入 Multiple Pane Synchronization
Tmux 一个非常著名的功能就是可以多个 Pane 同步输入，使用方式：

- `prefix`
- 输入 `:setw synchronise-panes on`
- 然后在多个 Pane 中就开启了同步

同理配置 `:set synchronise-panes off` 就可以关闭

我在 `~/.tmux.conf` 中配置了：

```
bind C-x setw synchronize-panes
```

配合 `prefix` + `Ctrl-x` 就可以快速切换多 Pane 同步。

## Zooming tmux
tmux 1.8 引入了 Zoom 功能，支持一键最大化当前 Working Pane，使用 `prefix` + `z` 来放大，再次按下恢复。


## Navigation between Tmux Pane and vim
在 Tmux 和 Vim 之间无缝切换。

- <https://github.com/christoomey/vim-tmux-navigator>

更多内容可以参考我的 [配置](https://github.com/einverne/dotfiles)

## 结合 fzf
结合 fzf 的模糊查询，可以实现对 Tmux 会话的快速创建和搜寻，可以到 fzf 的 Wiki 页面具体查看。

## Tmuxinator vs tmuxp
通常情况下创建一个 Tmux session 需要按很多个按键，假如有一个稍微复杂一点的项目，要开多个 Windows，第一个 Window 下开 3 个 Pane，那么每一次重启机器都要恢复这么多状态的话会非常累。有两种解决办法，一种就是在之前 [Tmux Plugin](/post/2017/12/tmux-plugins.html) 文中提到的 [tmux-resurrect](http://einverne.github.io/post/2017/12/tmux-plugins.html#tmux-resurrect) 插件。另一种就是使用配置文件，然后利用 [Tmuxinator](https://github.com/tmuxinator/tmuxinator) 或者 [tmuxp](https://github.com/tmux-python/tmuxp) 这两个工具来快速创建 Session。这两个工具可以通过读取配置文件，然后创建一个预设的 Tmux session。

Tmuxinator 是 Ruby 编写的，tmuxp 是 Python 所写，根据自己的环境选择即可。

## reference

- <https://www.sitepoint.com/10-killer-tmux-tips/>
- <https://github.com/einverne/dotfiles>
