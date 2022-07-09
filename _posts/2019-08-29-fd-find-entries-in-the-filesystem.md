---
layout: post
title: "每天学习一个命令：fd find entries in the filesystem"
aliases: "每天学习一个命令：fd find entries in the filesystem"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, fd, find, ag, rust, ]
last_updated:
---

Linux 下的 find 命令自身就比较复杂，想要查找本地文件时通常需要敲一系列的命令，这时候 fd 就出来解决这个问题了。

最简单的 fd 命令就只需要：

	fd [pattern] [path...]

但如果需要使用 find 命令，那么需要：

	find ./ -name '*test*' -type f

并且 fd 命令要比 find 命令快很多。

fd 由 Rust 实现。

GitHub: <https://github.com/sharkdp/fd>

## Use case

### List all files
`fd` 可以直接不添加任何参数执行，当想要快速查看目录下所有内容时非常有用，类似于 `ls -R`。

如果想要递归的显示目录下，包括子目录所有的内容，可以使用：

    fd . /path/to/dir

### 查看包含关键字的文件
比如查看本地包含 mysql 的文件：

	fd "mysql"

对于 ag 命令则需要

	ag -g "mysql" .

而 find 则更加复杂

	find ./ -name '*mysql*' -type f
    
### 搜索特定的文件后缀
使用 `-e` 选项来搜索目录下所有的 Markdown 文件(`.md`)：

    fd -e md
    
### 使用准确的搜索 PATTERN 搜索
使用 `-g` 选项：

    fd -g libc.so /usr
    
### 找出目录下文件并删除
首先使用 fd 找出文件名，使用 `xargs` 发送给 rm(注意小心执行该该命令)：

    fd "keyword" -x rm -v
    
在很多情况下，我们不仅要找出搜索结果，还需要对搜索结果执行一些操作，上面提到的删除就是比较常见的，`fd` 提供了两种方式来对结果执行命令：

- `-x`/`--exec` 并行地对每一个结果执行额外的命令
- `-X`/`--exec-batch` 只执行额外的命令一次，将所有的结果作为参数

比如更复杂一些的，递归地找到所有的 zip 文件，然后解压：

    fd -e zip -x unzip

如果目录下有两个文件 `file1.zip` 和 `backup/file2.zip` ，那么这一行命令之后会并行执行 `unzip file1.zip` 和 `unzip backup/file2.zip`。

再比如将目录下所有的 `*.jpg` 转换成 `*.png`:

    fd -e jpg -x convert {} {.}.png

这里，`{}` 是搜索结果的一个占位符，`{.}` 类似，表示文件名无后缀。

还有一个常见，比如要搜索目录下所有的 `test_*.py` 然后用 `vim` 打开：

    fd -g 'test_*.py' -X vim

或者查看文件的权限、所有者、大小等等：

    fd ... -X ls -lhd

`-X` 命令结合 `rg` 命令一起使用的时候也非常方便：

    fd -e cpp -e cxx -e h -e hpp -X rg 'std::cout'

上面这句话的意思就是找到这些文件后缀的文件中包含 `std::cout` 的内容。

### 区分查找的类别
使用 `-t` 命令来区别要查找的内容

	f, file  		普通文件
	d, directories 		目录
	l, symlink 			symbolic links
	x, executable 		可执行文件
	e 					空文件或者目录
    

## 在 Vim 中使用

### installation
安装及配置参考官方：

- <https://github.com/junegunn/fzf.vim>

## reference

- <https://github.com/junegunn/fzf/wiki/Examples>
