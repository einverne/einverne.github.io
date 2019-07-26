---
layout: post
title: "Vim 插件之：vim-repeat"
tagline: ""
description: ""
category: vim-plugin
tags: [vim, vim-plugin, tpope, vim-repeat, ]
last_updated:
---

这个插件顾名思义，就是扩展了 vim 中 `.` 的功能，有些插件实现的复杂修改（比如修改 surrounding) 用原生的 `.` 无法实现，而用该插件可以实现。

## Installation

    Plug 'tpope/vim-repeat'

## Usage

既然提到了 `vim.repeat` 就不得不提到 vim 的 `.` 操作。

- 比如使用 `diw` 删除了一个 word，那么可以使用 `.` 来删除另一个 word
- 如果使用 `dd` 删除了一行，那么可以使用 `5.` 来删除 5 行
- 如果在 insert 模式下，输入 `hello!`，那么使用 ESC 进入 normal 模式，那么移动光标，在另外一个地方使用 `.` 可以快速输入 `hello!`

而如果使用 `:help repeat` 就会发现 vim 支持的 repeat，日常使用的 `.` 只不过是冰山一角。`.` 被叫做 single-repeat，vim 还支持

- multi-repeat
- complex-repeat
- using-scripts

等等复杂的 repeat commands。

### multi-repeat

vim 中的 multi-repeat 其实日常中也非常熟悉，比如 `:2,5g/^$/d` 这种类似的命令就被叫做 multi-repeat. 解释一下这个例子，就是从 2 到 5 行中匹配 `^$` （也就是空行） 的内容执行命令 `d` （删除）。

恢复到这个命令最原本的模式

    :[range]g[lobal]!/{pattern}/[cmd]

这条命令的也是就是在行数范围 range 的行上，匹配 pattern 的行，执行 Ex command（默认是 `:p`)

    :[range]g[lobal]/{pattern}/[cmd]

这条命令的也是就是在行数范围 range 的行上，**不**匹配 pattern 的行，执行 Ex command（默认是 `:p`)

    :[range]v[global]/{pattern}/[cmd]

同 `:g!`

几点说明：

- 对于上面在 pattern 两边的 `/` 可以使用其他非字母单字节字符来替换，比如使用 `\`, `"`, `|`, 等，这种方式使得可以在 pattern 中直接使用 `/`
- 对于这里的　`cmd` 是 vim 的 Ex cmd，使用 `:help ex-cmd-index` 来查看


#### 常见的 Ex 命令

- `:d`          delete lines
- `:g`          execute commands for matching lines
- `:grep`       run 'grepprg' and jump to first match
- `:help`
- `:insert`
- `:ls`
- `:m`          move lines
- `:new`        create a new empty window
- `:w`          write to a file
- `:wq`
- `:x`
- `:z`

比如替换文本中所有 pat 为 PAT

    :g/pat/s//PAT/g

同样也可以使用 `:%s/pat/PAT/g`

`g` 命令是一个非常强大的命令，更多的可以参考下一章节的 `g` 使用。


### complex-repeats
更为复杂的 repeat ，那就需要使用到 vim 内置的 register `0-9a-zA-z"`，

    q{0-9a-zA-z"}           " 来开启录制
    q                       " 之后使用 q 来停止录制
    @{0-9z-aA-Z".=*+}       " 执行 Register 中的内容，`%` 当前文件名，`#` 可选文件名，这两个 Register 不能使用
    @@                      " 执行上一次


## Power of g

delete all line match pattern

    :g/pattern/d

delete all lines not match pattern

    :g!/pattern/d
    :v/pattern/d

copy all match lines to the end of file

    :g/pattern/t$

move all match lines to the end of file

    :g/pattern/m$

copy all lines matching pattern to register 'a'

    qaq:g/pattern/y A

说明：

- `qaq` 清空 Register a
- y A 是 Ex cmd （`:help :y`), yank the current line into register A (append to register a)

reverse entire file

    :g/^/m0

## reference

- <https://vim.fandom.com/wiki/Power_of_g>
