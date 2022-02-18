---
layout: post
title: "常用的 Tmux 的插件使用记录"
aliases: "常用的 Tmux 的插件使用记录"
tagline: ""
description: "介绍目前我在使用的 Tmux 插件们"
category: 学习笔记
tags: [tmux, linux, terminal, 终端工具 , ]
last_updated:
---

之前一篇[文章](/post/2017/07/tmux-introduction.html) 已经分享过 [[tmux]] 的基本使用。这一篇就来总结一下 Tmux 下常用的插件。

Vim 有自己的插件管理系统，zsh 也有插件管理，那当然 Tmux 肯定有插件管理，其实学习 Tmux 的过程中，和 Vim 当时一样，所有的拷贝，粘贴的内容都是在 Tmux 和 Vim 的内部，和外部操作系统的粘贴板完全隔离了，我就是为了解决这个问题，才接触到了 [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm)。


## Tmux Plugin Manager
Tmux Plugin Manager 是一个 Tmux 插件管理器，用这个插件可以很方便的管理相关的插件。下文中可能把 Tmux Plugin Manager 简写成 tpm。

tpm 的安装的方法，在 GitHub 的页面非常清楚，`git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm` 项目，在 `.tmux.conf` 文件中加入配置，重新加载配置即可。

    # List of plugins
    set -g @plugin 'tmux-plugins/tpm'
    set -g @plugin 'tmux-plugins/tmux-sensible'

    # Other examples:
    # set -g @plugin 'github_username/plugin_name'
    # set -g @plugin 'git@github.com/user/plugin'
    # set -g @plugin 'git@bitbucket.com/user/plugin'

    # Initialize TMUX plugin manager (keep this line at the very bottom of tmux.conf)
    run '~/.tmux/plugins/tpm/tpm'

新添加插件只需要，在配置文件中增加一行

    set -g @plugin '...'

三个操作：

- 这样，再使用 `<prefix>` + <kbd>I</kbd> 大写的 I (Install) 来安装新插件
- 卸载插件时，配置文件中移除一行，并使用 `<prefix>` + <kbd>alt</kbd> + <kbd>u</kbd> (uninstall) 来卸载。
- 更新所有插件的快捷键是 `<prefix>` + <kbd>U</kbd>，记住是大写的 `U`.
- 然后还有一个移除列表中不存在的所有插件 `<prefix> + Alt + u`

## tmux-yank

在 `.tmux.conf` 中加入

    set -g @plugin 'tmux-plugins/tmux-yank'

然后使用 `<prefix>` + <kbd>I</kbd> 来安装 `tmux-yank`

Linux 平台下需要安装依赖 xsel 或者 xclip

    sudo apt-get install xsel # or xclip

一些常用的快捷键

### 在 normal mode 下
在普通模式下

- `<prefix>` + <kbd>y</kbd> 来将命令行内容拷贝到 clipboard 系统粘贴板。
- `<prefix>` + <kbd>Y</kbd> 将当前 panel 的 working directory 拷贝到粘贴板

### 在 copy mode 下
在拷贝模式下复制到系统粘贴板

- <kbd>y</kbd> 拷贝到系统粘贴板
- <kbd>Y</kbd> 将选中的内容，粘贴到命令行

## tmux-open
从 Tmux copy mode 直接打开选中内容，这个插件可以在 Tmux 的 copy 模式下，直接打开高亮选中的部分。
比较常见的比如选中一段网址，然后按下 `o`，即可打开。

或者选中一个关键字，然后使用 <kbd>Shift</kbd>+<kbd>s</kbd> 来在搜索引擎中搜索。如果想要更换其他搜索引擎可以参考[官方配置](https://github.com/tmux-plugins/tmux-open)

## tmux-resurrect
Tmux 的 session 在机器关机再启动后就丢失了，使用 `tmux-resurrect` 可以将 session 保存到磁盘，再次启动机器的时候可以立即恢复。

- <https://github.com/tmux-plugins/tmux-resurrect>

安装：

	set -g @plugin 'tmux-plugins/tmux-resurrect'

然后按下 `prefix+I` 安装。`tmux-resurrect` 只有两个简单的 key-binding，分别是保存和恢复：

	prefix + Ctrl-s      save
	prefix + Ctrl-r      restore

## tmux-continuum
tmux-continuum 配合 tmux-resurrect 可以实现连续的保存 Tmux 的状态，如果自己的笔记本关机，那么 Tmux 的会话也会被销毁，下次开机需要重新创建，当然配合 [fzf](/post/2019/08/fzf-usage.html) 之后倒也是没有那么麻烦，但如果开了 Pane，新建了 Windows，要恢复还是需要花费一段时间的，continuum 能够实时保存，重启后也能快速恢复。

安装：

	set -g @plugin 'tmux-plugins/tmux-resurrect'
	set -g @plugin 'tmux-plugins/tmux-continuum'

然后启用：

	set -g @continuum-restore 'on'

## reference

- <https://github.com/einverne/dotfiles>
