---
layout: post
title: "Vim 中 buffer 操作及管理"
tagline: ""
description: ""
category: [ Vim, 学习笔记 ]
tags: [vim, buffer, vim-buffer, ]
last_updated:
---

通常情况下工作的内容都会是打开一个文件进行编辑，但是 Vim 的强大之处不仅在于单文件编辑，更重要的是可以对多文件编辑，这些文件可以存在不同的 Tab 中，不同的 Windows 中，甚至不同的 buffer 中，这一篇主要就是集中整理一下 buffer 相关的操作内容。

> A buffer is an area of Vim’s memory used to hold text read from a file. In addition, an empty buffer with no associated file can be created to allow the entry of text. –vim.wikia


Vim 中的 Buffer 是打开的文件，这意味着 Buffer 可能并不是当前可见的，Buffers 是 Vim 打开，存在于内存某个地方。通常只有一个 Buffer 可见。可以使用 `:ls` 来查看当前打开的 Buffers.

Vim 中的 Windows 是一个 `viewport onto a single buffer`，可以通过 `:spit` 或者 `:vsplit` 来水平或者垂直打开文件。

Vim 中的 Tab 是 `collection of one or more windows`. 可以允许用户来组织 Windows.

## Buffer 创建
通常情况下 `vim file1 file2` 便是将两个文件放到了 buffer 中。

- `:e /path/to/file` 也可以打开文件到 buffer 中
- `:new` 和 `:vnew`
- `:badd {filename}` 添加到缓冲区，光标保持在当前缓冲


## buffer delete
移除缓冲区

    :bd[elete]
    :bunload
    :bwipeout
    :3,5bdelete
    :bd file1

如果未保存会退出失败，强行退出

    :bd!

删除缓冲区并不会影响缓冲区关联的文件，只是简单地把文件从内存中删除。

	:bd2

`:bd2` 会将第二个 Buffer 从内存中移除。

## buffer navigation
使用 <kbd>Ctrl</kbd> + <kbd>^</kbd> 可以来在最近的缓冲去中切换。这个快捷键非常有用，得记住。可以使用如下命令来列出所有缓冲区：

    :ls, :buffers          " 列出所有缓冲区

在展示的列表中有一些 buffer 的状态：

- `-` 非活动的缓冲区
- `a` 光标所在缓冲区
- `h` 隐藏缓冲区
- `%` 当前的缓冲区
- `#` 交换缓冲区， 可以使用 `Ctrl + ^`
- `=` 只读缓冲区
- `+` 已经更改的缓冲区

切换缓冲区：

    :bn[ext]
    :bp[revious]
    :b {number, bufname}
    :bfirst
    :blast

说明：

- `:b <Tab>`    " 循环滚动 buffer 中的文件

假如在后面对 vim 了解更多之后，安装了 [fzf-vim 插件](/post/2019/09/fzf-vim.html)，那么也可以直接使用 `:Buffers` 来模糊查找当前打开的 Buffers.

## buffer 替换
在打开的所有 buffer 中替换操作：

    :bufdo %s/pattern/replace/ge | update


