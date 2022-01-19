---
layout: post
title: "命令行下使用 jdupes 删除重复的文件"
aliases: 
- "命令行下使用 jdupes 删除重复的文件"
tagline: ""
description: ""
category: 学习笔记
tags: [ jdupes, linux, file-manage, duplicate, tutorial, cli,  ]
last_updated:
---

很早之前整理过一篇文章介绍了几个之前在 Linux 上用过的用来快速找到重复文件并删除的[文章](/post/2019/12/find-and-delete-duplicate-files.html)，这么多年过去了，最后发现还是 jdupes 最好用，因为是 c 语言编写，可以在所有平台上面运行，并且速度远远好于其他的命令。

之前的文章对于 jdupes 总结的比较简单，所以这里单独再总结一下 jdupes 常用的几个例子。



## 查找文件夹下重复文件
查找文件夹下重复的文件，这也是最常见的需求，可以直接

    jdupes -r path/to/dir

`-r` 参数在这里表示 `--recurse` 递归查找文件夹下所有的子文件夹。

## 删除重复内容
jdupes 在输出重复的内容的同时也提供了方法可以让用户自行选择删除哪个文件，或者自动发现并删除重复的文件。

**注意**：个人推荐每一次都手动选择需要删除的内容，否则请提前做好备份工作，防止文件丢失

jdupes 提供了 `-d` 选择，如果使用 `-d` 选项，jdupes 会弹出提示让用户选择是否删除重复文件：

    jdupes -dr path/to/dir

如果确定自己不需要手动选择删除，可以使用 `-N` 选项，表示 `--noprompt`，谨慎使用该选项：

    jdupes -r -N path/to/dir
    

## 查找两个文件夹下重复文件并删除第二个文件夹下的重复内容

有些时候文件在两个文件夹中，比如 `dir1`, `dir2`，需要实现的是将 dir2 中和 dir1 中重复的文件删除，而保留 dir1 中的文件，这个时候可以使用 `-O` 选项。

`-O` 选择可以让用户控制出现在第一条的文件，以便将其保留。

    jdupes -nrdNO dir1 dir2

上面的命令会递归查找 dir1 和 dir2 中的文件，并自动将 dir2 中和 dir1 重复的文件删除。


## reference

- <https://github.com/jbruchon/jdupes>