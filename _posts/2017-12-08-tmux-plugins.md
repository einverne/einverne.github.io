---
layout: post
title: "Tmux 的插件们"
tagline: ""
description: "介绍目前我在使用的 Tmux 插件们"
category: 学习笔记
tags: [tmux, linux, terminal,]
last_updated: 
--

Vim 有插件管理，zsh 也有插件管理，那当然 Tmux 肯定有插件管理，其实学习 Tmux 的过程中，和 Vim 当时一样，所有的拷贝，粘贴的内容都是在 Tmux 和 Vim 的内部，和外部操作系统的粘贴板完全隔离了，我就是为了解决这个问题，才接触到了 [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm)。


## Tmux Plugin Manager
安装的方法，在 GitHub 的页面非常清楚，`git clone` 项目，在 `.tmux.conf` 文件中加入配置，重新加载配置即可。

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

这样，再使用 `<prefix>` + <kbd>I</kbd> 大写的 I (Install) 来安装新插件

卸载插件时，配置文件中移除一行，并使用 `<prefix>` + <kbd>alt</kbd> + <kbd>u</kbd> (uninstall) 来卸载。

更新快捷键是 `<prefix>` + <kbd>u</kbd> 


## tmux-yank

在 `.tmux.conf` 中加入

    set -g @plugin 'tmux-plugins/tmux-yank'

然后使用 `<prefix>` + <kbd>I</kbd> 来安装 `tmux-yank` 

Linux 平台下需要安装依赖 xsel 或者 xclip

    sudo apt-get install xsel # or xclip

快捷键

### 在 normal mode 下

`<prefix>` + <kbd>y</kbd> 来将命令行内容拷贝到 clipboard 系统粘贴板。

`<prefix>` + <kbd>Y</kbd> 将当前 panel 的 working directory 拷贝到粘贴板

### 在 copy mode 下

<kbd>y</kbd> 拷贝到系统粘贴板

<kbd>Y</kbd> 将选中的内容，粘贴到命令行
