---
layout: post
title: "Vim 寄存器"
tagline: ""
description: ""
category: vim
tags: [Vim, Linux, ]
last_updated: 
---

Vim 的寄存器可以看成 Vim 中额外用来存储信息的区域，虽然看不见，但是如果使用 `x`, `s`, `y`, `p` 等等命令的时候都无意识的使用到了 Vim 的寄存器(register).

Vim 中每一个 register 都可以通过添加双引号的方式来访问，比如 `"a` 来访问 a 寄存器。

可以通过选择然后使用 `y` 来将内容放到寄存器中，比如 `"ay` 来将选择的内容 yank 复制到 `"a` 寄存器。 可以使用 `"ap` 来粘贴 a 寄存器中的内容。

同样可以再 Insert mode 下使用 <kbd>Ctrl</kbd> + <kbd>r</kbd> 再加 <kbd>a</kbd> 寄存器名字来插入。这会将寄存器内容粘贴进当前编辑位置。

可以使用 `:reg` 命令来查看所有寄存器及其内容，或者直接在后面添加寄存器名字来查看关心的内容 `:reg a b c`

    :reg a b c
    --- Registers ---
    "a   register a content
    "b   register b content
    "c   register c content

## 默认寄存器 unnamed register
Vim 有自己的 unnamed 或者说默认寄存器，可以通过 `""` 来访问。任何被 `d`, `c`, `s`, `x` 删除或者 `y` 复制的内容都会被存放在该寄存器中，使用 `p` 粘贴时也是中该寄存器中粘贴内容。直接使用 `p` 其实等效于 `""p` 。

## 数字寄存器
当使用 yank 复制一些内容，然后又执行了 d 命令，会发现粘贴时，当时 yank 的内容被 d 命令中的内容替换了，这是 Vim 非常常见的一个问题，然而问题并不在 Vim，而是 Vim 把 yank 的内容 ，delete 的内容都放到了 unnamed register 中了，但是复制的内容并没有丢失，并不需要再次回到想要复制的地方再次 yank 一遍。

这里就要介绍 Vim 的另外一种寄存器 ---- 数字寄存器 **numbered registers** , 正如他的名字一样，数字寄存器的名字就是 `"0` 到 `"9` 。

`"0` 寄存器永远保存着 yank 的最新内容，其他寄存器保存这历史 9 个内容，从 1 到 9 从新到老。如果复制了新的文字，永远可以通过 `"0p` 来粘贴。

## 只读寄存器 read only register
Vim 中有四个只读寄存器 `".`, `"%`, `":`, `"#` , 最后插入的文字被保存在 `".` 中，如果想要在其他地方使用刚刚输入的文字，非常方便。

`"%` 保存 Vim 最开始打开时，到当前文件的完整路径。最常用的组合就是将当前的路径放到粘贴板

    :let @+=@%

`let` 命令用来向寄存器写入， `"+`是粘贴板寄存器，将 `"%` 内容写入粘贴板

`":` 最近执行命令寄存器。如果最近保存过文件 `:w` ，那么 `w` 会保存在寄存器中。可以使用 `@:` 来执行前一次命令。再比如使用替换命令替换了一行中的内容 `:s/foo/bar` ，那么将光标移动到另一行再次使用 `@:` 就能够再次替换。

`"#` 保存 alternative file 名字。大致可以理解为 Vim 中编辑的上一个文件，可以通过 `:h alternate-file` 来查看更多。当使用 Ctrl + <kbd>^</kbd> 来切换文件时，使用的就是这个寄存器保存的文件名。同样可以使用 `:e Ctrl-r #` 来做同样的事情。不常用。

## 表达式寄存器 expression register

`"=` 用来处理表达式结果，如果在 Insert Mode 使用 <kbd>Ctrl</kbd>+<kbd>r</kbd>+<kbd>=</kbd> ，然后输入 `2+2<Enter>` ，结果 4 会显示出来。也可以用来执行外部命令，比如 `Ctrl - r =` 之后输入 `system('ls') <enter>` 来显示 `ls` 的结果。

## 搜索寄存器 search register
`"/` 这个寄存器保存最近搜索过的内容，包括 `/`, `?`, `*`, `#` 的内容。比如说最近搜索过 `/example` ，想要替换成 `another`， 可以使用

    :%s/<Ctrl-r/>/another/g

输入 `:%s/` 只有按下 Ctrl + r 再按 `/` 会自动插入寄存器保存的内容。

搜索寄存器也是可以写的，可以使用 `let` 命令写入：

    :let @/="keywords"

## 寄存器和宏 Macro 的关系
或许很多不熟悉 Vim 寄存器的用户曾经使用过 Vim 的 Macro， Vim 可以使用 Macro 来录制一连串命令，然后重复。(可以使用 :h recording 来查看更多)。

Vim 使用寄存器来保存 Macro 的命令。比如使用 `qw` 来录制 Macro ，寄存器 `"w` 会被用来记录所有录制的内容，所有的内容都有文本的形式存放。

更加 Cool 的事情就是，因为所有的内容都以文本的形式存在寄存器中，我们可以轻易的修改其中的内容，而不至于因为一个疏忽录制错误，而重新录制整个操作。

比如忘记了给文字最后添加分号，可以

    :let @W='i;'

来修改录制的内容，注意 `W` 是大写，这是追加到寄存器的意思，插入 `i;` 进入插入模式并输入 `;` 。

再比如如果需要直接修改 register 的内容，可以使用

    :let @w='<Ctrl-r w>

然后修改需要修改的内容，然后以 `'` 结束。

另外一个 Cool 的事情就是，因为所有的命令都是以文本的形式保存的，所以可以轻易的将录制的 macro 移动到另外的寄存器中，或者将录制的 macro 分享给其他人。

比如将录制在 `w` 寄存器中的内容复制给粘贴板寄存器，然后就能在其他 Vim 中使用。

## 总结
Vim 中的寄存器一共分为 9 大类：

1. The unnamed register ""
2. 10 numbered registers "0 to "9
3. The small delete register "-
4. 26 named registers "a to "z or "A to "Z
5. four read-only registers ":, "., "% and "#
6. the expression register "=
7. The selection and drop registers "*, "+ and "~ 
8. The black hole register "_
9. Last search pattern register "/

其中大部分的寄存器上文都有涉及，其中为涉及到的 selection and drop registers 和 GUI 中选取的内容有关系。

black hole register 是一个黑洞寄存器，当写入 black hole register 时，nothing happens . 像黑洞一样吞掉所有的输入，可以用来在大量删除文本时不影响任何寄存器。

## reference

- <http://www.brianstorti.com/vim-registers/>
- <http://vimdoc.sourceforge.net/htmldoc/change.html#registers>
