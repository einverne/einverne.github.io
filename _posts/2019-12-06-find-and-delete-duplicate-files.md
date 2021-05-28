---
layout: post
title: "文件整理之重复文件删除"
tagline: ""
description: ""
category: [ 整理合集 , 开源项目 ]
tags: [linux, command, files, file-manager, ]
last_updated:
---

整理文件的时候总想快速的删掉重复的文件，这里就总结下个人使用感觉良好的几个命令工具，包括 jdupes, rdfind, fdupes 这些。

依据推荐指数从高到低。

## jdupes
开源地址：

- <https://github.com/jbruchon/jdupes>

jdupes 是 fdupes 的增强版，根据作者自己的描述，jdupes 比 fdupes 1.51 版本要快 7 倍左右。

使用方式：

	Usage: jdupes [options] DIRECTORY...

和 fdupes 类似， jdupes 也有类似的选项：

	 -d --delete            prompt user for files to preserve and delete all
							others; important: under particular circumstances,
							data may be lost when using this option together
							with -s or --symlinks, or when specifying a
							particular directory more than once; refer to the
							documentation for additional information
	 -N --noprompt          together with --delete, preserve the first file in
							each set of duplicates and delete the rest without
							prompting the user
	 -r --recurse           for every directory, process its subdirectories too

所以总结一下：

	jdupes -r path/to/dir

这行命令不会真正去删重复的文件，如果要删除，用 `-d` 参数：

	jdupes -dr path/to/dir

此时 jdupes 会打印出报告，然后一个一个让用户自己去确认要删除哪一个。

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
`-N` 选项和 `--delete` 一起使用时，会保留第一个文件，然后删除之后的重复文件，不会弹出让用户确认。

最强悍模式：

	fdupes -rdN path/to/dir

## duperemove
在 review tldr 的 PR 时又看到了一个 C 语言实现的 duperemove，作者没有提供 benchmark，有机会可以尝试一下。

- <https://github.com/markfasheh/duperemove>

## reference

- <https://www.tecmint.com/find-and-delete-duplicate-files-in-linux/>
