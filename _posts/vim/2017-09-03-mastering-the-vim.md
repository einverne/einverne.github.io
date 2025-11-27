---
layout: post
title: "Mastering the Vim"
tagline: ""
description: ""
category: Vim
tags: [vim, linux, editor]
last_updated:
---

我已经用了很长一段时间 Vim 了，但是 Vim 最可贵之处便在于你永远达不到 Vim 的天花板，在使用的过程中我永远会发现操作 Vim 的其他便捷方法。最近看了一个关于 Vim 的[讲座](https://www.youtube.com/watch?v=wlR5gYd6um0) ，革新我对 Vim 命令的认识。可以说掌握这样的一个世界观可以对 Vim 的操作上到另外一个层次。下面就总结一下这个视频中的精髓内容。

## Text Objects and motions

`@ChrisToomey` 定义了一种 Vim Language，Vim 的语法由`数词 + 动词 + 名词` 组成，比如：

	d 删除
	w 单词
	将两个字母组合起来就是 删除单词

这个经常使用的命令非常容易记住。如果想要删除三个单词，则是 `3dw`，所以可以总结出

    {number}{command}{text-object}

这样的形式

- number 是数量
- command 是动作
- text-object 是对象

重复和撤销，相信使用过一段时间 Vim 的人应该会知道 `.` 表示重复上一次命令， `u` 表示撤销上一次操作。而重复和撤销是针对命令而不是针对输入的，因此每使用一次 `.` 或者 `u` 都是命令级别。因此这就给予了 `.` 操作非常强大的功能。

Verbs: 常用的动作举例

	d Delete
	c Change  delete and enter insert mode
	y yank
	>  intend 缩进
	v 选择

Nouns: 常见的动作 Motion

	w 移动到下一个 word 开始
	e 移动到下一个 word 的结尾
	b 移动到上一个 word 的开始 back
	2j   向下移动 2 lines

Vim 中定义了很多移动操作

基于内容 Nouns: Text Objects

	w => words 表示移动一个单词
	s => sentences 移动一个句子
	p => paragraphs 向下移动一个段落
	t => tags  (html xml)

动作 motions

	a => all
	i => in
	t => 'till
	f => find forward
	F => find backward

	iw => inner word
	it => inner tag
	i" => inner quotes
	ip => inner paragraph
	as => a sentence

命令 commands

	d => delete(also cut)
	c => change(delete, then into insert mode)
	y => yank (copy)
	v => visual select

组合举例

	diw  delete in word，即使光标在 word 中也能够快速删除 word
	yi)  yank all text inside the parentheses，光标在 `()` 中复制括号中的所有内容


上面的 Text Object

	{command}{text object or motion}

在单词中间，`diw` 删除光标下的单词，`dit` 删除光标下 tag 中的内容

Nouns: Parameterized Text Objects

	f,F => find the next character
	t,T => find till
	/,?   => search

比如有一行文本

	the program print ("Hello, World!")

如果想要删除 Hello 前面的内容，可以在行首使用 `dtH` , 解读这个命令可以理解为 d => `delete unti H` 从这里删除直到遇到 H。典型的 verb + noun 组合。

记住动作加移动，能够很快的记忆很多命令。

比如使用 <https://github.com/tpope/vim-surround> 这个插件，可以轻松的实现，使用命令 `cs"'` 来将

	"hello world"

变成

	'hello world'

命令的语义解释就是 change surroundding double quote to single quote 将包围的双引号变成单引号

使用 `cs'<p>` 将单引号变成 <p>

	<p>hello world</p>

使用 `cst"` 将 surrounding 变成双引号

	"hello world"

或者可以使用 `ds"` 来将 surrounding 双引号删除 delete surrounding "

	hello world


## DOT command

Vim 中的 "." 命令，以命令为单位，重复上一个命令。

Sublime ， IntelliJ IDEA 中经常被人提及的 multiple cursor 的功能，能够在编辑器中提供多个光标一起编辑，其实 Vim 不需要多光标就能够做到，结合强大的 `.` 和 `n .` 可以快速的编辑大量重复的内容。

比如在 Vim 中的 workflow 就是

- 使用 `/pattern` 来所有需要编辑的内容
- 使用可编辑的 edit，比如 `cw` 当前单词 `ESC` 退出，一个完成的动作
- 使用 `n` 来找到下一个匹配的地点
- 使用 `.` 来重复编辑操作，可以直接将单词替换为上一个动作编辑
- 然后重复上面两个步骤，整个文件即可替换完成


## macro
Vim 允许记录一个宏来完成一组命令

	qa                  # 将命令记录到寄存器 a 中
	q                   # 再次 q 结束记录
	@a                  # 使用寄存器
	@@                  # 使用上一次寄存器


## refernence

- <https://www.youtube.com/watch?v=wlR5gYd6um0>
- <http://www.viemu.com/a_vi_vim_graphical_cheat_sheet_tutorial.html>
