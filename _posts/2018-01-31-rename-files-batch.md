---
layout: post
title: "每天学习一个命令: rename 批量修改文件名"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, rename, file]
last_updated: 
---

虽然 Linux 下有很多方式可以重命名文件，比如 `mv filename newfilename`，设置可以使用 `cat` 命令来将一个文件输出重定向到文件 `cat file > newfile`，或者可以拷贝的时候重命名 `cp file newfile` 。

但是其实 Linux 下有一个命令 `rename` 顾名思义，就是用来重命名文件的，并且能够按照正则批量重命名文件。他的基本使用方式就是

    rename [options] "s/oldname/newname/" file

这个命令可以分开几部分来讲，首先对于整体命令先不看选项(options) 部分

    rename "s/oldname/newname/" file

其中包含三个部分：

- 原字符串oldname：将要被替换的字符串；
- 目标字符串newname：原字符替换成的目标字符串；
- 文件file：指定要改变文件名的文件列表。

其中每一个部分都可以使用正则，以上命令的解释可以理解为对于要重命名的 file 匹配的文件列表，将文件名中的 oldname 替换为 newname。

然后再来看选项options 部分，`rename` 支持以下的选项：

- `-v` 将重命名的内容都打印到标准输出，v 可以看成 verbose
- `-n` 测试会重命名的内容，将结果都打印，但是并不真正执行重命名的过程
- `-f` force 会覆盖本地已经存在的文件
- `-h` `-m` `-V` 分别为帮助，帮助，版本
- `-e` 比较复杂，可以通过该选项，写一些脚本来做一些复杂的事情

rename 支持通配符

    ?  可替代单个字符
    *  可替代多个字符

当命令中最后 file 为 `*` 时表示，匹配当前文件夹下所有文件，如果为 `?` 时则匹配只有一个字符的文件名。

## rename支持正则表达式
`rename` 支持 perl 的正则表达式

### 替换文件名中特定字段

    rename "s/AA/aa/" *  # 把文件名中的AA替换成aa

这一行命令的解释就是，对当前文件夹下满足 `*` 的所有文件，文件名中包含 `AA` 字符的替换为 `aa` 其中 `"s/pattern/new/"` 中的 `/` 一个都不能少。

### 修改文件后缀

    rename "s/.html/.php/" *     # 把.html 后缀的改成 .php后缀
    rename "s/.png/.jpg/" *      # 将 png 改为 jpg

批量修改文件后缀名

或者匹配最后的部分：

    rename "s/oldExt$/newExt/" *.oldExt
    

### 批量添加文件后缀

    rename "s/$/.txt/" *     # 把所有的文件名都以txt结尾

因为支持正则表达式，那么 `$` 表示的就是结尾，将结尾替换为 `.txt` 也就意味着给所有文件添加 `.txt` 的后缀

### 批量删除文件名

    rename "s/.txt//" *      # 把所有以.txt结尾的文件名的.txt删掉

同理，结尾有 `.txt` 的内容替换为空，也就是删掉后缀了。

### 应用正则匹配的部分文件名
假如需要在批量修改的时候保留部分文件名，可以使用引用 `\1` ，比如有下面格式的文件

    Screenshot from 2019-01-02 15-56-49.jpg

我只希望保留其中的日期部分，那么可以

    rename -n "s/Screenshot from ([0-9\\- ]+).jpg/\1.jpg/" *

将 `()` 匹配的内容取出来放到替换部分。

