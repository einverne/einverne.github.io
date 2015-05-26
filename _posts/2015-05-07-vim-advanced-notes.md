---
layout: post
title: "vim 学习笔记2"
description: "vim学习笔记2"
category: vim
tags: [vim,]
---

##combine command

	.    (dot) will repeat the last command
	n<commmand>    will repeat the command n times

for example:

	2dd    will delete 2 lines
	3p 	   will paste the text 3 times
	40idesu [ESC] will write "desu " 40 times

##move in one file

	NG    go to line N, N is a number, like 23G means go to line 23
	gg    shortcut for 1G - go to the start of the file
	G     Go to last line

##批量替换

	%s/想要被替换的字串/新字串/g g模式全局替换

##多窗口操作

###窗口间移动

	Ctrl-w h,j,k,l    Ctrl按下，按下w 松开，Ctrl松开，按hjkl 对应左下上右

###移动窗口

	Ctrl-w H,J,K,L    大写移动窗口

###窗口最大化

	Ctrl-w o    让当前文件占据整个窗口

##更正

Insert模式下

	<BS>  退格键，删除光标前
	<Del> Delete键，删除光标后
	<C-W> 删除一个单词
	<C-U> 删除光标前的字符，保留光标之后的文本，保留行首的缩进，只删除第一个非空字符至光标位置之间的文本。

##可视Visual mode

###

	v 按字符选择，在Normal mode下按下v进入Visual mode
	V 按行选择

选择字符之后操作

	d 剪切选择内容到剪贴板
	y 拷贝选择内容到剪贴板
	c 剪贴选择内容到剪贴板并进入Insert mode

##Other

	:verbose set tabstop?    in Vim, it will tell you where the tapstop option value is coming from

差不多看到这里就能够直接看文档了：[http://vimcdoc.sourceforge.net/](http://vimcdoc.sourceforge.net/) 通过文档学习更多符合自己使用习惯的命令或者操作。
