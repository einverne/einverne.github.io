---
layout: post
title: "每天学习一个命令：fd find entries in the filesystem"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, fd, find, ag, ]
last_updated:
---

Linux 下的 find 命令自身就比较复杂，想要查找本地文件时通常需要敲一系列的命令，这时候 fd 就出来解决这个问题了。

最简单的 fd 命令就只需要：

	fd [pattern] [path...]

但如果需要使用 find 命令，那么需要：

	find ./ -name '*test*' -type f

并且 fd 命令要比 find 命令快很多。

fd 由 Rust 实现。

## Use case

### 查看包含关键字的文件
比如查看本地包含 mysql 的文件：

	fd "mysql"

对于 ag 命令则需要

	ag -g "mysql" .

而 find 则更加复杂

	find ./ -name '*mysql*' -type f

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
