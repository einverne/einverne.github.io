---
layout: post
title: "Linux 下找出重复文件"
tagline: ""
description: ""
category: 整理合集
tags: [linux, command, files, ]
last_updated:
---

## rdfind - find duplicate files in linux
安装使用：

	sudo apt-get install rdfind
	rdfind -dryrun true path/to/dir

结果会保存在 results.txt 文件中。如果要真正删除 (Be Carefule):

	rdfind -deleteduplicates true path/to/dir

或者建立硬链接

	rdfind -makehardlinks true path/to/dir

## fdupes
安装使用：

	sudo apt install fdupes
	fdupes path/to/dir

递归搜索：

	fdupes -r path/to/dir

如果要删除重复内容可以使用 `-d` 选项（同样需要非常谨慎）：

	fdupes -d path/to/dir

`-d` 选项会弹出选择，用户可以手动选择保留的文件。如果使用 `-I` 选项会在遇到重复文件时直接删除。

## reference

- <https://www.tecmint.com/find-and-delete-duplicate-files-in-linux/>
