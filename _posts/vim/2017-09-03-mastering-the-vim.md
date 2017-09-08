---
layout: post
title: "Mastering the Vim"
tagline: ""
description: ""
category: vim
tags: [vim, linux, editor]
last_updated: 
---

我已经用了很长一段时间 Vim 了，但是 Vim 最可贵之处便在于你永远达不到 Vim 的天花板，在使用的过程中我永远会发现操作 Vim 的其他便捷方法。最近看了一个关于 Vim 的[讲座](https://www.youtube.com/watch?v=wlR5gYd6um0) ，革新我对 Vim 命令的认识。可以说掌握这样的一个世界观可以对 Vim 的操作上到另外一个层次。下面就总结一下这个视频中的精髓内容。

@ChrisToomey 定义了一种 Vim Language，Vim 的语法由动词+名词组成，比如：

	d 删除
	w 单词
	将两个字母组合起来就是 删除单词

这个经常使用的命令非常容易记住。

重复和撤销，相信使用过一段时间 Vim 的人应该会知道 `.` 表示重复上一次命令， `u` 表示撤销上一次操作。而重复和撤销是针对命令而不是针对输入的，因此每使用一次 `.` 或者 `u` 都是命令级别。

Verbs: 常用的动作举例

	d Delete
	c Change  delete and enter insert mode
	y yank  copy
	>  intend 缩进
	v 选择

Nouns: 常见的动作 Motion

	w word
	b back
	2j   down 2 lines

定义了很多Vim中的移动

Nouns: Text Objects

	iw => inner word
	it => inner tag
	i" => inner quotes
	ip => inner paragraph
	as => a sentence

在单词中间, `diw` 删除光标下的单词，`dit` 删除光标下tag中的内容

Nouns: Parameterized Text Objects

	f,F => find the next character
	t,T => find till
	/,?   => search

比如有一行文本

	the program print ("Hello, World!")

如果想要删除 Hello 前面的内容，可以在行首使用 `dtH` , 解读这个命令可以理解为 d => `delete unti H` 从这里删除直到遇到H。典型的 verb + noun 组合。

记住动作加移动，能够很快的记忆很多命令。

比如使用 <https://github.com/tpope/vim-surround> 这个插件，可以轻松的实现，使用命令 `cs"'` 来将

	"hello world"

变成

	'hello world'

命令的语义解释就是 change surroundding double quote to single quote 将包围的双引号变成单引号

使用 `cs'<p>` 将单引号变成 <p>

	<p>hello world</p>

使用 `cst"` 将surrounding变成双引号

	"hello world"

或者可以使用 `ds"` 来将 surrounding 双引号删除 delete surrounding "

	hello world


## refernence

- <https://www.youtube.com/watch?v=wlR5gYd6um0>
- <http://www.viemu.com/a_vi_vim_graphical_cheat_sheet_tutorial.html>
