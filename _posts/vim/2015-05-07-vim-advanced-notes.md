---
layout: post
title: "Vim 学习笔记 2: 组合命令"
description: "vim 学习笔记 2"
category: [Vim, 学习笔记 ]
tags: [vim, command, linux, editor]
last_updated: 2015-09-10
---

Vim 学习笔记进阶版，初级版可以参考这篇[文章](/post/2015/05/vim-notes.html)

这篇文章主要分为替换操作，多窗口操作，Vim 的 Tab 操作，以及 Visual mode 命令模式等等。

## 组合命令 combine command
Vim 所有的操作都是原子化的，将操作组合起来能够实现非常快捷的 Input。在引入 `.` 命令时需要记住这么几条原则， Vim 哲学的第一条，**不要重复自己**，所有重复的命令都可以使用 `.` 来实现，而在这一条之后需要注意的是**使得操作可重复**，每一次的编辑命令有意识的让其可以重复，这样就可以达成**一键移动，一键执行**，来实现重复编辑的脏活累活。

	.    (dot) will repeat the last command 点命令重复上一个命令
	n<commmand>    will repeat the command n times 将命令重复 n 次

for example:

	2dd    will delete 2 lines
	3p 	   will paste the text 3 times
	40idesu [ESC] will write "desu " 40 times
	5w     向后移动 5 个单词
	6j     向下移动 6 行

Vim 还支持另一种组合

	di"   光标在引号内， (d)elete (i)nside "  删除在引号之间的内容
	yi(   光标在括号内， (y)ank (i)nside ()  复制在 () 中的内容
	vi]   光标在中括号内， 选中 [] 内的内容
	dtx   向后删除字符直到遇到第一个 `x` 字符， (d)elete (t)ill x
	ytx   向后复制内容直到遇到第一个 `x` 字符

以下是命令 c 加上一些操作，其他 d(elete) y(ank) v(iual) 都可以接

    ctx   向后修改内容到 `x`，也就是意味着删除光标到 `x` 中间内容，并进入插入模式
    ci"                 改写双引号中的内容
    ci'                 改写单引号中的内容
    cib                 改写小括号中的内容
    cab                 改写小括号中的内容（包含小括号本身）
    ci)                 改写小括号中的内容
    ci]                 改写中括号中内容
    ciB                 改写大括号中内容
    caB                 改写大括号中的内容（包含大括号本身）
    ci}                 改写大括号中内容
    cit                 改写 xml tag 中的内容
    cis                 改写当前句子
    c2w                 改写下两个单词
    ct(                 改写到小括号前

## 文件中快速跳转

	nG    go to line N, N is a number, like 23G means go to line 23
	:x    跳转到第 x 行 x 为行号
	gg    shortcut for 1G - 跳转到第一行
	G     跳转到最后一行

## 标记和宏 macro

	ma    将当前位置标记为 a，26 个字母都可以作为标记，`mb`, `mc` 等
	'a    跳转到 a 标记位置
	qa    将所有的键盘操作录制下来，直到再次在命令模式按下 <kbd>q</kbd>， 并存储在 <kbd>a</kbd> 中
	@a    执行刚刚记录在 <kbd>a</kbd> 中的键盘操作
	@@    执行上一次 macro 操作

宏命令是 Vim 中最神奇的操作之一，需要慢慢体会，关于宏命令可以参考[这篇](/post/2017/11/vim-macro.html)

## 批量替换
简单的大小写替换可以使用：

    ~       替换大小写
    g~iw    替换当前单词大小写
    gUiw    将单词转为大写
    guiw    将单词转为小写
    gUU     全行转为大写
    guu     全行转为小写

在全文中用一个单词替换另外一个单词

	:%s/ 想要被替换的字串 / 新字串 /g

- "%" 范围前缀表示在所有行中执行替换，% 为当前文件， 相当于`:1,$s/`，如果不加 `%` 则表示在当前行中
- "s" 表示 substitute 替换
- "g" 标记表示替换行中所有匹配点。g 模式全局替换

替换的语法为：**:[addr]s/ 源字符 / 目的字符 /[option]**

**[addr] 表示检索范围，省略表示当前行。**

- :n1,n2s/word1/word2/g 从 n1 行到 n2 行，替换 word1 为 word2 全局替换
- :%s/ = :1,$s/
- :.,$/word1/word2/g 从当前行到尾行

**s: 表示替换操作**

**[option] 表示操作类型**

- g 全局替换
- c 确认，如果加上 c 选项，每次都需要确认 confirm
- p 逐行显示结果

省略 option 时只对每一行的第一个匹配串进行替换

删除所有空行

	:g/^$/d

删除所有空白行和空行

	:g/^[ ][ ]*$/d

在每行开始插入两个空白

	:%s/^/  /

在接下来 5 行末尾加入`"`

	:.,5/$/"/


## 多窗口操作

### 新建与关闭窗口

在 Normal 模式下使用以下命令新建窗口

	:split 			水平分割窗口，内容一样
	:sp 			split 缩写
	:10split 		水平分割窗口，新窗口高度 10 行
	:split filename 窗口中打开新文件
	:new 			功能和 split 一样
	:vsplit 		垂直分割窗口，简写 :vs
    :vsp            垂直分割
	Ctrl-w s,v 		分割窗口的快捷方式，s 水平分割，v 垂直分割
    :clo[se]        关闭窗口
	Ctrl-w c 		关闭当前窗口
    :on[ly]         只保留激活的窗口，关闭其他窗口

### 窗口间移动

	Ctrl-w w          w 窗口间循环移动  Ctrl-w Ctrl-w 同样
	Ctrl-w h,j,k,l    Ctrl 按下，按下 w 松开，Ctrl 松开，按 hjkl 对应左下上右

### 移动窗口

	Ctrl-w H,J,K,L    大写 HJKL, 移动窗口

### 窗口最大化

	Ctrl-w o    让当前文件占据整个窗口，同时会关闭其他窗口

### 调整窗口大小

    `Ctrl-w < >` 	调整窗口宽度，`<` 缩小当前窗口宽度，向左扩展一列，`>` 增加当前窗口宽度，向右扩展一列。当然 `Ctrl-w` 之后可以使用 `n+<` 调整多列宽度
	`Ctrl-w - +` 	调整窗口高度
    `Ctrl-w_`       高度最大化
    `Ctrl-w|`       宽度最大化

在使用 Nerd tree 插件后，可以使用 Nerd tree 内置的快捷键，在 Nerd tree 中

- `i` split 一个新窗口打开选中的文件，并跳转到该窗口
- `s` vsplit 一个新窗口打开选中文件，并跳到该窗口

## Tabs
在 Vim 中 Tab 和 Windows 是不一样的概念，如果平时使用 Chrome 或者 Firefox，就很好理解 Tab，中文可以翻译为标签页，但是 Vim 中 Tab 和正在编辑的 buffer 不是一对一的关系，在 Vim 中每一个 Tab 能够包含多个窗口 Window。

### Create New tab
有很多方法可以创建新 Tab , 这里是最简单方式：

	:tabnew 	create a empty new tab
	:tabedit {file} 	edit specified file in new tab

### Manage tabs
Some ways to close tabs:

	:tabc[lose]	close current tab
	:tabclose {i} 	close i-th tab
	:tabo[nly]	只保留当前 tab，close all other tabs

Some ways to move tabs:

	:tabm 0 	move current tab to first
	:tabm 		move current tab to last
	:tabm {i} 	move current tab to position i+1
	:tabs 		list all tabs including their opening windows

Ways to move between tabs:

	:tabn[ext] 		    go to next tab
	:tabp[revious] 		go to previous tab
	:tabfirst 	go to first tab
	:tablast 	go to last tab

While in normal mode, you can type:

	gt 			go to next tab
	gT 			go to previous tab
	{i}gt 		go to tab in position i

## 修改文本

Insert 模式下

	<BS>  退格键，删除光标前
	<Del> Delete 键，删除光标后
	<C-W> 删除一个单词
	<C-U> 删除光标前的字符，保留光标之后的文本，保留行首的缩进，只删除第一个非空字符至光标位置之间的文本。

## 可视 Visual mode

	v 按字符选择，在 Normal mode 下按下 v 进入 Visual mode
	V 按行选择
	Ctrl+Q 块选择，Windows 下，其他平台下 Ctrl+V

选择字符之后操作

	d 剪切选择内容到剪贴板
	y 拷贝选择内容到剪贴板
	c 剪贴选择内容到剪贴板并进入 Insert mode

## 命令模式

	:! command 暂时离开 vi 到命令模式下执行 command

## 把命令的结果读入 Vim
在命令模式下，可以不离开 Vim 进行操作，但如果想要把命令的结果粘贴到 Vim 中，就需要使用 read 命令

	:read !ls -al

Vim 会在当前光标处插入命令执行的结果。


## Other

	:verbose set tabstop?    in Vim, it will tell you where the tapstop option value is coming from
	:help + command  查看 Vim 命令的帮助，比如想要查看 c 命令的帮助直接使用 `:h c` 就能查到。
	g <C-g>  单词统计



差不多看到这里就能够直接看文档了：[http://vimcdoc.sourceforge.net/](http://vimcdoc.sourceforge.net/) 通过文档学习更多符合自己使用习惯的命令或者操作。

还有一些参考资料

- <http://vimhelp.appspot.com/>
- [Practial Vim](http://book.douban.com/subject/10599776/) Vim Tips 的书籍
- [Vimium](https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb) 用 Vim 方式操作 Chrome 浏览器
- [Vimer](http://www.vimer.cn/) 一个极好的博客

## reference

- <http://vim.wikia.com/wiki/Search_and_replace>
