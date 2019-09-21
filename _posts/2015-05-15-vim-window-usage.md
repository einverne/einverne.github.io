---
layout: post
title: "Vim 窗口使用"
tagline: ""
description: ""
category: Vim
tags: [vim, linux, editor, vim-window, vim-buffer]
last_updated:
---

之前的文章讲过 [Vim Buffer 的管理](/post/2014/05/vim-buffer-management.html) 这使得工作可以在 Vim 中持续进行，而不需要退出然后重新载入文件。但是如果 Buffer 只能填满一个 Vim 窗口，假如想要在 Vim 中实现分屏，那么就必须要依赖于 Vim 的 Window。又因为 Vim 的 Windows 经常用来做分屏，又有的时候被称为 `splits` 。

## Windows
Vim 在启动时只会打开单个窗口，可以使用 `Ctrl-w s` 来水平分隔窗口，或者使用 `Ctrl-w v` 来垂直分隔窗口。

在 Vim 中有很多方式打开 Windows

命令 			| 解释
----------------|-------------
`<C-w>s` | 水平切分窗口，新窗口显示当前缓冲区
`<C-w>v` | 垂直切分窗口，新窗口显示当前缓冲区
`:sp[lit] { filename }` | 水平切分窗口，并在新窗口载入{filename} 文件
`:vsp[lit] { filename }` | 垂直切分窗口，并在新窗口载入{filename} 文件
`:new [filename]` | 在当前 window 下方新建 window
`:vnew [filename]` | 在当前 window 旁新建 window

## 窗口间切换


命令 			| 解释
----------------|-------------
`<C-w>w`  		| 窗口间循环切换
`<C-w>h`  		| 切换到左窗口
`<C-w>j`  		| 切换到下窗口
`<C-w>k`  		| 切换到上窗口
`<C-w>l`  		| 切换到右窗口

## 关闭窗口

Ex 命令 	| 普通模式命令		| 解释
------------|-------------------|-------------
`:clo[se]` 	| `<C-w>c` 			| 关闭活动窗口
`:on[ly]` 	| `<C-w>o` 			| 只保留活动窗口，关闭其他所有窗口
