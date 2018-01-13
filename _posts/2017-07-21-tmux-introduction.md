---
layout: post
title: "Tmux 使用介绍"
tagline: ""
description: "非常棒的终端复用工具，和 Vim 一样，上手难，但使用起来非常方便"
category: 学习笔记
tags: [tmux, linux, command]
last_updated: 
---

Tmux 是一个很棒的终端复用工具，和 screen 命令类似，但是 Tmux 终极的分屏功能要比 screen 强大很多，当然入门也比 screen 要高很多。如果你长时间在终端进行编程或者操作，或者你陷入无数的 Tab 而无法自拔，那么你应该需要开始了解一些 Tmux。

本文会从如下几个方面对 Tmux 进行介绍：

1. Tmux 基本使用
2. Tmux 的基本模块
        - Windows
        - Panes
        - Sessions


Tmux主要包括以下几个模块：

- session    会话: 一个服务器连接可以包含多个会话
- window    窗口: 一个会话可以包含多个窗口
- pane    面板: 一个窗口可以包含多个面板，如果桌面足够大可以充分利用面板达到非常强大的分屏

## 安装 {#install}

Ubuntu/Debian 系下

	sudo apt-get install tmux

## 基础概念 {#basic}
Tmux is a tool that allows running multiple terminal sessions through a single terminal window. It allows you to have terminal sessions running in the background and attach and detach from them as needed, which is very useful. 

### Tmux 的前缀快捷键 {#tmux-prefix}

Tmux 的快捷键前缀（Prefix）, 为了使自身的快捷键和其他软件的快捷键互不干扰，Tmux 提供了一个快捷键前缀，和screen默认激活控制台的Ctrl+a不同，Tmux默认的是Ctrl+b。当想要使用Tmux的快捷键时，需要先按下快捷键前缀，然后再按下快捷键。Tmux 所使用的快捷键前缀**默认**是组合键 Ctrl-b（同时按下 Ctrl 键和 b 键）。 例如，假如你想通过快捷键列出当前 Tmux 中的会话（对应的快捷键是 s），那么你只需要做以下几步：

1. 按下组合键 Ctrl-b (Tmux 快捷键前缀)
2. 放开组合键 Ctrl-b
3. 按下 s 键


使用快捷键之后就可以执行一些相应的指令了。当然如果你不习惯使用Ctrl+b，也可以在~/.Tmux文件中加入以下内容把快捷键变为Ctrl+a,或者其他快捷键：

	# Set prefix key to Ctrl-a
	unbind-key C-b
	set-option -g prefix C-a

在下文中就使用 `<prefix>` 来代替 Tmux 的前缀快捷键了。

### Tmux 的配置文件 #{tmux-conf}
每当开启一个新的会话session时，Tmux 都会先读取 ~/.tmux.conf 这个文件。该文件中存放的就是对 Tmux 的配置。

如果你希望新的配置项能够立即生效，那么你可以将下面这一行配置加入到文件 ~/.tmux.conf 中。

	bind r source-file ~/.tmux.conf \; display-message "tmux config reloaded" # create new short cut to reload tmux.conf

这样配置了之后，每当向 ~/.tmux.conf 文件中添加了新的配置，只需要按下 `<prefix> r` 就可以重新加载配置并使新的配置生效，从而免去了开启一个新的会话。


以下所有的操作都是激活控制台之后，即键入 `<prefix>` 前提下才可以使用的命令
  
基本操作

	<prefix> ?    列出所有快捷键；按q返回    
	<prefix> d    脱离当前会话,可暂时返回Shell界面，输入`tmux attach`能够重新进入之前会话    
	<prefix> s    选择并切换会话session；在同时开启了多个会话时使用    
	<prefix> D    选择要脱离的会话；在同时开启了多个会话时使用    
	<prefix> :    进入命令行模式；此时可输入支持的命令，例如kill-server所有Tmux会话    
	<prefix> [    复制模式，光标移动到复制内容位置，空格键开始，方向键选择复制，回车确认，q/Esc退出    
	<prefix> ]    进入粘贴模式，粘贴之前复制的内容，按q/Esc退出    
	<prefix> = 	  选择性粘贴缓冲区中内容
	<prefix> ~    列出提示信息缓存；其中包含了之前Tmux返回的各种提示信息    
	<prefix> t    显示当前的时间    
	<prefix> Ctrl+z    挂起当前会话    

如果要查看当前 Tmux 的配置，可以通过 `tmux show -g` 来查看。

## session 相关
Tmux 的一个 Session 可以包含多个 Windows.

在 Tmux 外：

	tmux 		  						创建session
	tmux new -s $session_name  			创建并指定 session 名字
	tmux ls  							列出存在的 session，包括 session 中存在的 windows
	tmux attach -t session_name 		进入指定会话session_name
	tmux a -t $session_name  			上面的缩写形式，进入已存在的session
	tmux kill-session -t $session_name 	删除指定session

在 Tmux 内：

	<prefix> :kill-session  			删除退出当前 session
	<prefix> d 							临时退出session，回话在后台运行，可以通过 attach 进入指定的会话
	<prefix> :kill-server  				删除所有活跃session
    <prefix> :new -s session_name       在 Tmux 中新建 session
	<prefix> s  	列出所有活跃 session，并可以从列表中选择session
	<prefix> $  	重命名session


## 窗口相关 {#window}

window(窗口)在 session 里，一个 session 可以有N个window，并且window可以在不同的session里移动。 window 可以看成是一个 session 的不同 tab。

	<prefix> c 		创建window
	<prefix> & 		删除或者关闭window
	<prefix> n 		下一个window
	<prefix> p 		上一个window
	<prefix> w 		列出现在开启的 window
	<prefix> , 		重命名window
	<prefix> f 		在多个window里搜索关键字
	<prefix> l 	    last window 在相邻的两个window里切换
	<prefix> 0,1,2  在window之间切换，如果窗口数超过10个，可以使用 `<prefix> 'num` 来切换

## pane 相关

pane在window里，可以有N个pane，并且pane可以在不同的window里移动、合并、拆分

创建pane

	<prefix> " 		横切split pane horizontal，后面会 remap 这个键
	<prefix> %      竖切split pane vertical，后面 remap 这个键
	<prefix> o 		按顺序在pane之间移动
	<prefix> x      删除pane
	<prefix> z      最大化pane和恢复原状
	<prefix> !      移动pane至window
	<prefix> "空格" 更换pane排版
	<prefix> { 		移动pane往左边，往上面
	<prefix> } 		移动pane往右边，往下面
	<prefix> q 		显示pane编号,在显示编号的时候按对应数字可以切换到该pane，这个操作太复杂，后面remap
	<prefix> 方向键上下左右   	上下左右选择pane


调整pane的大小

	<prefix> :resize-pane -U #向上
	<prefix> :resize-pane -D #向下
	<prefix> :resize-pane -L #向左
	<prefix> :resize-pane -R #向右
	<prefix> :resize-pane -D 20 (Resizes the current pane down by 20 cells)
	<prefix> :resize-pane -U 20 (Resizes the current pane upward by 20 cells)
	<prefix> :resize-pane -L 20 (Resizes the current pane left by 20 cells)
	<prefix> :resize-pane -R 20 (Resizes the current pane right by 20 cells)
	<prefix> :resize-pane -t 2 20 (Resizes the pane with the id of 2 down by 20 cells)
	<prefix> :resize-pane -t -L 20 (Resizes the pane with the id of 2 left by 20 cells)




## 其他低频率操作

在上下左右的调整里，最后的参数可以加数字 用以控制移动的大小，例如：

	<prefix> :resize-pane -D 50


移动pane合并至某个window

	<prefix> :join-pane -t $window_name


列出缓冲区目标

	<prefix> :list-buffer

查看缓冲区内容

	<prefix> :show-buffer

vi模式

	<prefix> :set mode-keys vi


快捷键帮助

	<prefix> ? (<prefix> :list-keys)


Tmux内置命令帮助

	<prefix> :list-commands



## TIPS

让你的 Tmux 更加高效，一下内容都可以编辑进 `~/.tmux.conf` 用来进一步自定义 Tmux 的行为。 默认的 Tmux 有很多操作方式可能比较 [awkward](http://www.hamvocke.com/blog/a-guide-to-customizing-your-tmux-conf/), 只有自己配置让自己熟悉他的行为之后才能让 Tmux 展现出最高效的部分。

### 自定义 Prefix
在前面也说过， Tmux 默认的 Prefix 是 Ctrl + b，可以按照自己的习惯设定 Prefix 快捷键，很多人将 Caps 和 Ctrl 互换，并且将 Prefix 定义为 Ctrl + a, 我自己使用了以下还是不怎么习惯，所以我将 Prefix 定义成了 Ctrl + \ 

### 定义分割pane的快捷键

默认情况下 Tmux 使用 `"` 来垂直分割成上下两部分，使用 `%` 来水平分割成左右两部分，但是这两个键需要 <kbd>Shift</kbd>+<kbd>'</kbd>，以及很难按到的<kbd>%</kbd>，不如直观上使用 `|` 和 `-` 来分割pane。

	# split panes using | and -
	bind | split-window -h
	bind - split-window -v
	unbind '"'
	unbind %

### 在pane中移动
在 pane 中移动是最高频的操作了，默认 Tmux 的行为需要每一次都按 `<prefix>`,这样导致每一次都非常麻烦，所以在配置中定义 `M-<direction>` (M 代表 Meta，也就是键盘上的 Alt 键), 这样每一次只需要按 `Alt+h`,就能够移动到左边的 pane。


	# switch panes using Alt-arrow without prefix
	bind -n M-h select-pane -L
	bind -n M-l select-pane -R
	bind -n M-k select-pane -U
	bind -n M-j select-pane -D

这里另外推荐一个 Plugin，如果不想自己配置，可以使用这个插件[vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator) ，这个插件做到了在 pane 中移动就像在 vim 中一样，并且可以和 vim 无缝衔接。使用 Ctrl + hjkl 来在不同的 Panel 中移动。

### 设置 Colorscheme
在设置完 Tmux 在 Tmux 中使用 Vim 的时候会发现，Vim 的 colorscheme 变的有些奇怪，需要在 `.bashrc` 或者 `.zshrc` 中设置：

    export TERM="xterm-256color"

### 复制模式
Tmux 中的复制需要使用 `<prefix> [` 来进入，具体分为如下几步：

- `<prefix> [` 进入复制模式
- space 开始复制，一共光标进行选择复制
- Enter 复制并退出复制模式
- 在将光标移动到指定位置，按 `<prefix> ]` 进行粘贴

## Tmux 和 iTerm，Guake，Terminator 等终端的区别
X Windows系统中常用的Xterm，GNU Screen，SSH， GNome中的Terminal，KDE中的Konsole，Mac下常用的iTerm2等，这些软件都属于Terminal Emulator。 iTerm 等只是一个GUI软件，它的窗格只是窗格。而Tmux是终端复用，在一个命令行窗口中不仅可以显示多个Shell的内容，而且可以保持多个会话。 最重要的是：Tmux和Vim一样属于字符终端软件，不需要任何GUI的支持，在远程登录时尤其有用。


## reference

- <https://tmuxcheatsheet.com/>
- <https://gist.github.com/MohamedAlaa/2961058>
- <https://www.sitepoint.com/10-killer-tmux-tips/>
- <https://github.com/davidbrewer/tmux-conf/blob/master/tmux.conf>
- <http://mingxinglai.com/cn/2012/09/tmux/>
- 一本很翔实的书 <https://leanpub.com/the-tao-of-tmux/read>
- <http://www.hamvocke.com/blog/a-guide-to-customizing-your-tmux-conf/>
- <http://files.floriancrouzat.net/dotfiles/.tmux.conf>
