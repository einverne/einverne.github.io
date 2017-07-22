---
layout: post
title: "Tmux introduction"
tagline: ""
description: ""
category: 学习笔记
tags: [Tmux, Linux, ]
last_updated: 
---

Tmux 是一个很棒的终端复用工具，和 screen 命令类似，但是 Tmux 终极的分屏功能要比 screen 强大很多，当然入门也比 screen 要高很多。

Tmux主要包括以下几个模块：

- session    会话: 一个服务器连接可以包含多个会话
- window    窗口: 一个会话可以包含多个窗口
- pane    面板: 一个窗口可以包含多个面板，如果桌面足够大可以充分利用面板达到非常强大的分屏

## install

Ubuntu/Debian 系下

	sudo apt-get install tmux

## 基础概念 {#basic}

### Tmux 的前缀快捷键

Tmux 的快捷键前缀（Prefix）, 为了使自身的快捷键和其他软件的快捷键互不干扰，Tmux 提供了一个快捷键前缀，和screen默认激活控制台的Ctrl+a不同，Tmux默认的是Ctrl+b。当想要使用快捷键时，需要先按下快捷键前缀，然后再按下快捷键。Tmux 所使用的快捷键前缀默认是组合键 Ctrl-b（同时按下 Ctrl 键和 b 键）。 例如，假如你想通过快捷键列出当前 Tmux 中的会话（对应的快捷键是 s），那么你只需要做以下几步：

1. 按下组合键 Ctrl-b (Tmux 快捷键前缀)
2. 放开组合键 Ctrl-b
3. 按下 s 键


使用快捷键之后就可以执行一些相应的指令了。当然如果你不习惯使用Ctrl+b，也可以在~/.Tmux文件中加入以下内容把快捷键变为Ctrl+a,或者其他快捷键：

	# Set prefix key to Ctrl-a
	unbind-key C-b
	set-option -g prefix C-a

### Tmux 的配置文件
每当开启一个新的会话时，Tmux 都会先读取 ~/.tmux.conf 这个文件。该文件中存放的就是对 Tmux 的配置。

如果你希望新的配置项能够立即生效，那么你可以将下面这一行配置加入到文件 ~/.tmux.conf 中。

	bind r source-file ~/.tmux.conf \; display-message "tmux config reloaded" # create new short cut to reload tmux.conf

这样配置了之后，每当向 ~/.tmux.conf 文件中添加了新的配置，只需要按下 `<prefix> r` 就可以重新加载配置并使新的配置生效，从而免去了开启一个新的会话。


以下所有的操作都是激活控制台之后，即键入 `<prefix>` 前提下才可以使用的命令
  

基本操作

	<prefix> ?    列出所有快捷键；按q返回    
	<prefix> d    脱离当前会话,可暂时返回Shell界面，输入Tmux attach能够重新进入之前会话    
	<prefix> s    选择并切换会话；在同时开启了多个会话时使用    
	<prefix> D    选择要脱离的会话；在同时开启了多个会话时使用    
	<prefix> :    进入命令行模式；此时可输入支持的命令，例如kill-server所有Tmux会话    
	<prefix> [    复制模式，光标移动到复制内容位置，空格键开始，方向键选择复制，回车确认，q/Esc退出    
	<prefix> ]    进入粘贴模式，粘贴之前复制的内容，按q/Esc退出    
	<prefix> = 	选择性粘贴缓冲区中内容
	<prefix> ~    列出提示信息缓存；其中包含了之前Tmux返回的各种提示信息    
	<prefix> t    显示当前的时间    
	<prefix> Ctrl+z    挂起当前会话    


## session 相关

	tmux 		  						创建session
	tmux new -s $session_name  			创建并指定 session 名字
	tmux ls  							列出存在的 session，包括 session 中存在的 windows
	tmux attach -t session_name 		进入指定会话session_name
	<prefix> :kill-session  			删除 session
	<prefix> d 							临时退出session，回话在后台运行，可以通过 attach 进入指定的会话
	tmux a -t $session_name  			进入已存在的session
	<prefix> :kill-server  				删除所有session
	tmux kill-session -t $session_name 	删除指定session
	<prefix> s  	从列表中选择session
	<prefix> $  	重命名session


## 窗口相关 {#window}

window(窗口)在 session 里，一个 session 可以有N个window，并且window可以在不同的session里移动。 window 可以看成是一个 session 的不同 tab。

	<prefix> c 		创建window
	<prefix> & 		删除window
	<prefix> n 		下一个window
	<prefix> p 		上一个window
	<prefix> w 		列出现在开启的 window
	<prefix> , 		重命名window
	<prefix> f 		在多个window里搜索关键字
	<prefix> l 	    last window 在相邻的两个window里切换
	<prefix> 0,1,2  在window之间切换

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

这里另外推荐一个 Plugin，如果不想自己配置，可以使用这个插件[vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator) ，这个插件做到了在 pane 中移动就像在 vim 中一样，并且可以和 vim 无缝衔接。


## reference
- <https://tmuxcheatsheet.com/>
- <https://gist.github.com/MohamedAlaa/2961058>
- <https://www.sitepoint.com/10-killer-tmux-tips/>
- <https://github.com/davidbrewer/tmux-conf/blob/master/tmux.conf>
