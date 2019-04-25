---
layout: post
title: "The Silver Searcher 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ack-grep, search, ]
last_updated:
---

Once I wrote a post about [ack-grep](/post/2017/10/ack-grep.html), and Franklin Yu left a comment about the silver searcher. He said this tool is much faster than the ack-grep. So this post is about The Silver Searcher. As always, I will introduce what is the Silver Searcher, how to install and use it.

Follow the [link](https://geoff.greer.fm/ag/), we can see that author claim that this tool started off as a clone of ack, but then diverged slightly. And in most case, this tool is 5-10x faster then ack.

## Installation

Find the download link at [official site](https://geoff.greer.fm/ag/).

    apt-get install silversearcher-ag

## Usage

    ag [file-type] [options] PATTERN [PATH]

As the man describe, recursively search for PATTERN in PATH.


## Usage

Most options are like grep, like `-i`, `-v`, `-B`, `-A` etc

### Find text under a path
most use case will be find a keyword from a bunch of files.

    ag keyword /path/to/

### Count the matches of keywords

    ag -c keyword /path/

### Custom the depth of searching
Default depth is 25, if you want unlimited, you should use -1

    ag --depth NUM keyword .

### To find only filenames
If you forget the filename, but only remeber only few letters, you can use `-g` to print only filenames.

    ag -g PATTERN .

results will be only filenames.

For more details, you can check `man ag`

## reference

- <https://github.com/ggreer/the_silver_searcher>
