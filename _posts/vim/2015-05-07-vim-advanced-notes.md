---
layout: post
title: "vim 学习笔记2"
description: "vim学习笔记2"
category: [vim, 学习笔记]
tags: [vim, command]
last_updated: 2015-09-10
---

vim学习笔记进阶版，初级版可以参考这篇[文章](http://einverne.github.io/2015/05/06/vim-notes.html)

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

在全文中用一个单词替换另外一个单词

	:%s/想要被替换的字串/新字串/g g模式全局替换

"%" 范围前缀表示在所有行中执行替换， 相当于`:1,$s/`,"g" 标记表示替换行中所有匹配点。

替换的语法为：**[addr]s/源字符/目的字符/[option]**

**[addr] 表示检索范围, 省略表示当前行。**

- :n1,n2s/word1/word2/g 从 n1 行到 n2 行，替换
- :%s/ = :1,$s/
- :.,$/word1/word2/g 从当前行到尾行

**s: 表示替换操作**

**[option]表示操作类型**

- g 全局替换
- c 确认
- p 逐行显示结果

省略 option 时只对每一行的第一个匹配串进行替换

##多窗口操作

###新建与关闭窗口

在 Normal 模式下使用以下命令新建窗口

	:split 			水平分割窗口，内容一样
	:10split 		水平分割窗口，新窗口高度10行
	:split filename 窗口中打开新文件
	:new 			功能和split一样
	:sp 			split 缩写
	Ctrl-w s,v 		分割窗口的快捷方式，s水平分割，v垂直分割
	:vsplit 		垂直分割窗口，简写 :vs
	Ctrl-w c 		关闭当前窗口

###窗口间移动

	Ctrl-w h,j,k,l    Ctrl按下，按下w 松开，Ctrl松开，按hjkl 对应左下上右

###移动窗口

	Ctrl-w H,J,K,L    大写HJKL,移动窗口

###窗口最大化

	Ctrl-w o    让当前文件占据整个窗口

###调整窗口大小

	Ctrl-w < > 	调整窗口宽度，<缩小当前窗口宽度，向左扩展一列，>增加当前窗口宽度，向右扩展一列。当然 Ctrl-w 之后可以使用 n+< 调整多列宽度
	Ctrl-w - + 	调整窗口高度

##更正

Insert模式下

	<BS>  退格键，删除光标前
	<Del> Delete键，删除光标后
	<C-W> 删除一个单词
	<C-U> 删除光标前的字符，保留光标之后的文本，保留行首的缩进，只删除第一个非空字符至光标位置之间的文本。

##可视Visual mode

	v 按字符选择，在Normal mode下按下v进入Visual mode
	V 按行选择
	Ctrl+Q 块选择，Windows下，其他平台下Ctrl+V

选择字符之后操作

	d 剪切选择内容到剪贴板
	y 拷贝选择内容到剪贴板
	c 剪贴选择内容到剪贴板并进入Insert mode

## 命令模式
	
	:! command 暂时离开 vi 到命令模式下执行 command

##Other

	:verbose set tabstop?    in Vim, it will tell you where the tapstop option value is coming from
	:help + command  查看Vim命令的帮助，比如想要查看 c 命令的帮助直接使用 `:h c` 就能查到。
	g <C-g>  单词统计


差不多看到这里就能够直接看文档了：[http://vimcdoc.sourceforge.net/](http://vimcdoc.sourceforge.net/) 通过文档学习更多符合自己使用习惯的命令或者操作。
