---
layout: post
title: "一次 vim 的简单介绍"
tagline: ""
description: ""
category: Vim
tags: [vim, linux, editor, ]
last_updated:
---

下面是一次 vim 的组内介绍的大纲。记录一下。

大纲

## Vim 多模式编辑器

    Normal mode
    Insert mode
    Visual mode
    Command mode

## 插入模式 {#insert-mode}

	i 进入 insert mode，在光标为之前进入插入模式
	I 行首非空字符前插入 , I 等同于 `^i`
	s 删除光标下字符，并进入 insert mode， 等同于 `cl`
	S 删除光标所在一行，并进入 insert mode 行首 , 等同于 `^C`
	a 光标之后进入 insert mode
	A 光标移动到行尾并进入 insert mode , 等同于 `$a`
	o 在光标下一行插入一行，并进入 insert mode , 等同于 `A<CR>`
	O 在光标上一行插入新行，并进入 insert mode , O 等同于 `ko`
	C 删除光标后到行尾内容，并进入 insert mode , C 其实等同于 `c$`
    cc 删除行，并进入插入模式
    Esc 退出 Insert 模式

    Example: this is a text for testing mode.

## 移动

    h,j,k,l

        k
        ^
    h <   > l
        v
        j

    H,M,L
    w,W,e,E,b,B
    %
    0,^,$
    gg, G
    fx,Fx,tx,Tx,
    '', g;     move cursor to last edit change

    Example: This is a sentence for testing moving with a word and WO-RD test.

## 编辑

	p   光标之后粘贴 (p)aste
	P   paste before the cursor
	yy  复制当前行
	y   Yank 复制。Example: yw (yank word) 光标停留到词第一个字母上 yw 复制单词
	y0  copy the data from cursor to begining of the line
	y$  copy the data from cursor to end of the line
	x   删除光标下单个字符，将其放到粘贴板，剪切
	X   向前删除一个字符，相当于 Backspace
	dd  删除光标所在一行，并把该行复制
	dw  删除光标所在词 (d)elete (w)ord
	d0  删除光标到该行最前
    d^  删除光标到行首非空白字符
	d$  删除光标到该行最后
	J   删除光标所在行的换行符
    r,R 替换

## 组合

    Operator + Motion = Action

    dw      delete word
    da'     delete what in ' and include '

    Example:
    This is an 'example' for "word-to-delete".
    add quote to this "word"

## 搜索

	/pattern  - 正向搜索，从光标处开始向文件末搜索
	?pattern  - 反向搜索，从光标处开始向文件首搜索
	n  - 下一个，往下执行搜索命令
	N  - 上一个
	*  - Word under cursor - forward (bounded)
	#  - Word under cursor - backward (bounded)
	:n1, n2s/p1/p2/g - 将第 n1 至 n2 行中所有 p1 均用 p2 替代
	:g/p1/s//p2/g - 将文件中所有 p1 均用 p2 替换

## 替换

	:s/p1/p2/g - 将当前行中所有 p1 均用 p2 替代
    :%s/old/new/g 全局替换
    :'<,'>s/old/new/g 选中之后替换
    :g/^$/d 删除所有空行

    Example:

## Text Object

    dit, di', di", di), di}, di],
    yi), yi]
    vi', vit
    ciw, ciw)

## macro

    qw        开启 record macro, 保存到寄存器 w
    q         结束录制

    Example:
    int a = 1
    int b = 2
    int c = a+b
    print a
    print b
    print c

## register
共有 9 大类寄存器

- The unnamed register ""
- 10 numbered registers "0 to "9           数字寄存器中保存着 yank 的内容
- The small delete register "-
- 26 named registers "a to "z or "A to "Z    可供自定义使用
- four read-only registers ":, "., "% and "#
- the expression register "=
- The selection and drop registers "*, "+ and "~
- The black hole register "_
- Last search pattern register "/

寄存器访问
    "a   寄存器前加 "

其他操作

    :reg a 查看寄存器
    ""   noname buffer last dcsxy
    "_   blackhole register
    "%   filename register
    "/   last search register
    ":   last command
    insert mode <C-r> a insert text in register a
    "ap  Normal mode paste text in register a


## Plugin

    surround.vim

    cs"'      change surround " to '
    cs'<q>    change surround ' to <q>
    ds'       delete surround '
    ysiw"     add " to word
    yss)      add ) to entire line

    Example:
    "Hello world!"  and other strings

## start

    vimutor

## 总结

更快的编码效率


