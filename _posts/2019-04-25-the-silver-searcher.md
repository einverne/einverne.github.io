---
layout: post
title: "The Silver Searcher: ag 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ack-grep, search, grep, ag, ]
last_updated:
---

Once I wrote a post about [ack-grep](/post/2017/10/ack-grep.html), and Franklin Yu left a comment about the silver searcher. He said this tool is much faster than the ack-grep. So this post is about The Silver Searcher. As always, I will introduce what is the Silver Searcher, how to install and use it.

Follow the [link](https://geoff.greer.fm/ag/), we can see that author claim that this tool started off as a clone of ack, but then diverged slightly. And in most case, this tool is 5-10x faster then ack.

ag 是一个全文检索工具，非常适合查询大量文本文件，或者源代码的场景。

## Installation

Find the download link at [official site](https://geoff.greer.fm/ag/).

    apt-get install silversearcher-ag

## Usage

    ag [file-type] [options] PATTERN [PATH]

As the man describe, recursively search for PATTERN in PATH.


## Usage

Most options are similar to grep, like `-i`, `-v`, `-B`, `-A` etc

### 查询路径下的内容 Find text under a path
most use case will be find a keyword from a bunch of files. 最常用的一个方式便是在目录中搜索关键词，ag 能够非常快速的搜索文件内容，所以非常适合查询日志，或者代码等文本文件。

    ag keyword /path/to/

### Count the matches of keywords

    ag -c keyword /path/

### 自定义查询深度
Default depth is 25, if you want unlimited, you should use -1

    ag --depth NUM keyword .

### 查找包含关键字的文件名
If you forget the filename, but only remeber only few letters, you can use `-g` to print only filenames.

`-g` 选项表示查询文件名，而不会去查询文件内容。比如说想要查询目录下文件名中包含 Pattern 的文件名，那么可以使用：

    ag -g PATTERN .

results will be only filenames. 这样结果就只会打印出符合的文件名。

### 打印出包含关键字的文件名
上面 `-g` 选项只会去查询文件名，那么如果想要查找内容中包含某个关键字的文件名，可以使用 `-l` 选项：

    ag -l 'pattern' /path/to

使用 `-L` 会显示没有匹配的文件名

### 在特定的文件中查询
ag 提供了 `-G` 选项，可以用来缩小查询的范围，`-G PATTERN` 可以指定 Pattern，那么 ag 只会在 `-G` 指定的文件中查询，比如只查询 `.+\.java` 以 `.java` 结尾的文件。

    ag -G ".+\.java" "string to search" /path/to

For more details, you can check `man ag`

## Drawback
用了一段时间，唯一发现的缺点就是想要搜索中文内容时，发现`ag`并不能很好的处理。

## reference

- <https://github.com/ggreer/the_silver_searcher>
