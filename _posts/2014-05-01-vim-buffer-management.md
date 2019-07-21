---
layout: post
title: "Vim 中 buffer 操作及管理"
tagline: ""
description: ""
category: 学习笔记
tags: [vim, buffer, vim-buffer, ]
last_updated:
---

通常情况下工作的内容都会是打开一个文件进行编辑，但是 Vim 的强大之处不仅在于单文件编辑，更重要的是可以对多文件编辑，这些文件可以存在不同的 Tab 中，不同的 Windows 中，甚至不同的 buffer 中，这一篇主要就是集中整理一下 buffer 相关的操作内容。

> A buffer is an area of Vim’s memory used to hold text read from a file. In addition, an empty buffer with no associated file can be created to allow the entry of text. –vim.wikia


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

## buffer navigation
使用 <kbd>Ctrl</kbd> + <kbd>^</kbd> 可以来在最近的缓冲去中切换。

    :ls, :buffers          " 列出所有缓冲区

在展示的列表中有一些 buffer 的状态：

- `-` 非活动的缓冲区
- `a` 光标所在缓冲区
- `h` 隐藏缓冲区
- `%` 当前的缓冲区
- `#` 交换缓冲区， 可以使用 Ctrl + ^
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

## buffer 替换

    :bufdo %s/pattern/replace/ge | update


