---
layout: post
title: "每天学习一个命令：zgrep 不解压过滤压缩包中文本"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, grep, regex, gz]
last_updated:
---

Linux 下按照正则过滤文本的命令 grep 非常强大，grep 能够把正则匹配的行打印出来。而 zgrep 则能够对压缩包内容进行正则匹配。zgrep 全称是 search compressed files for a regular expression

grep 的命令格式是

    grep [option] pattern files

他的工作方式是，在一个或者多个文件中根据正则搜索匹配内容，将搜索的结果输出到标准输出，不更改源文件内容。

## grep 常用的一些选项

    -i   忽略字符大小写区别
    -v   显示不包含正则的所有行

关于更多的 grep 的内容可以参考另外一篇文章，zgrep 和 grep 用法类似，不过操作的对象是压缩的内容。支持 bzip2，gzip，lzip， xz 等等。

## zgrep 使用
但如果想要过滤 Nginx 的 access_log.gz 的压缩文件的内容，如果先解压，然后过滤出有用的文本，再把文件压缩回去，这就变的非常不方便。

    gunzip access_log.gz
    grep "/api" access_log
    gzip access_log

需要使用三个命令来实现文件的过滤，其实 Linux 下可以使用 `zgrep` 来一步完成

    zgrep "/api" access_log.gz

和 grep 类似， `zgrep` 也可以指定多个文件同时进行搜索过滤

    zgrep "/api" access_log.gz access_log_1.gz

## 延伸

既然提到了不解压搜索压缩包内容，`.gz` 的文件可以使用 `zgrep` ，而对于 `.tar.gz` 文件

    zcat access.tar.gz | grep -a '/api'
    zgrep -a "/api" access.tar.gz

其实这些带 `z` 的命令都包含在 Zutils 这个工具包中，这个工具包还提供了

    zcat  解压文件并将内容输出到标准输出
    zcmp  解压文件并且 byte by byte 比较两个文件
    zdiff 解压文件并且 line by line 比较两个文件
    zgrep 解压文件并且根据正则搜索文件内容
    ztest - Tests integrity of compressed files.
    zupdate - Recompresses files to lzip format.

这些命令支持 bzip2, gzip, lzip and xz 格式。


