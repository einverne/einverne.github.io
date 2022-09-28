---
layout: post
title: "每天学习一个命令：sed 流式字符编辑器"
aliases: "每天学习一个命令：sed 流式字符编辑器"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, sed, editor]
last_updated:
---

`sed` 全名叫 stream editor，是面向字符流的编辑器，能够完美地配合正则表达式使用。sed 提供的功能是交互式文本编辑器的延伸，提供的查找替换程序可以被全局应用于单个文件或多个文件。

面向字符流，是因为输入流通过程序并将输出直接输出到标准输出。

sed 处理时，把当前处理的行存储在临时缓冲区中，称为“模式空间”（pattern space），接着用 sed 命令处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕。接着处理下一行，这样不断重复，直到文件末尾。文件内容并没有改变，除非使用重定向存储输出。sed 主要用来自动编辑一个或多个文件；简化对文件的反复操作；编写转换程序等。

sed 功能：

- 主要用来自动编辑一个或多个文件；
- 简化对文件的反复操作；
- 编写转换程序等。

`awk` 的典型示例是将数据转化为格式化报表。

## 行编辑器 ed

awk 的起源追溯到 sed 和 grep，再往前追溯就到了 ed，最初的 UNIX 行编辑器。关于 ed 编辑器可以参考之前的 [文章](/post/2018/02/ed-line-editor.html)。

## sed 使用参数

    sed [-neifr] [ 命令 ]

选项与参数：

- `-n` ：只有经过 sed 特殊处理的那一行（或者命令）才会被列出来。在一般 sed 的用法中，所有来自 STDIN 的数据一般都会被列出到终端上。
- `-e` ：直接在命令列模式上进行 sed 的命令编辑；
- `-f` ：从文件执行 sed 命令，`-f filename` 则可以运行 filename 内的 sed 命令；
- `-r` ：sed 默认支持正则表达式，使用 `-r` 开启扩展的正则表达式
- `-i` ：直接修改读取的文件内容，而不是输出到终端。

命令说明： [n1[,n2]]command

n1, n2 ：在 n1 到 n2 行之间使用命令，举例来说，如果我的命令是需要在 10 到 20 行之间进行的，则 `10,20[ 命令行为 ]`

command：

```
a ：新增， a 的后面可以接字串，而这些字串会在新的一行出现（目前的下一行）～
c ：取代， c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行！
d ：删除
i ：插入， i 的后面可以接字串，而这些字串会在新的一行出现（目前的上一行）；
p ：列印，亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运行～
s ：替换，通常这个 s 的命令可以搭配正则 `1,20s/old/new/g`
```

## 实例
注意如下的命令如果不清楚其含义的情况下，请谨慎执行!

下面的演示中会使用一个 `nl` 命令，这个命令会在打印文件内容的时候在前面增加行数显示。

### 显示特定行
仅列出 `/etc/passwd` 文件内的第 5-7 行

    nl /etc/passwd | sed -n '5,7p'
    5 lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
    6 sync:x:5:0:sync:/sbin:/bin/sync
    7 shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown

这个 sed 的以行为单位的显示功能，就能够将某一个文件内的某些行号选择出来显示。

也可以直接使用

```
# 打印文件第3到5行
sed -n '3,5p' /path/to/file
```


### 行删除及增加
以行为单位的新增 / 删除

将 `/etc/passwd` 的内容列出并且列印行号，同时，请将第 2~5 行删除，这里的删除是指在输出结果中删除，并不是真正去删除文件中的内容，如果要直接对文件进行修改，可以参考后文中的 `-i` 参数。

    nl /etc/passwd | sed '2,5d'
    1 root:x:0:0:root:/root:/bin/bash
    6 sync:x:5:0:sync:/sbin:/bin/sync
    7 shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown

说明：

- sed 的命令为 '2,5d' ，`d` 就是删除
- sed 后面接的命令，请务必以 `''` 两个单引号括住

只要删除第 2 行

    nl /etc/passwd | sed '2d'

要删除第 3 到最后一行

    nl /etc/passwd | sed '3,$d'

删除空白行

    sed '/^$/d' file.txt

在第二行后（即是加在第三行）添加内容

    nl /etc/passwd | sed '2a drink tea'
    1 root:x:0:0:root:/root:/bin/bash
    2 bin:x:1:1:bin:/bin:/sbin/nologin
    drink tea
    3 daemon:x:2:2:daemon:/sbin:/sbin/nologin


那如果是要在第二行前

    nl /etc/passwd | sed '2i drink tea'

如果是要增加两行以上，在第二行后面加入两行字

    nl /etc/passwd | sed '2a Drink tea or ......\
    > drink beer ?'
    1 root:x:0:0:root:/root:/bin/bash
    2 bin:x:1:1:bin:/bin:/sbin/nologin
    Drink tea or ......
    drink beer ?
    3 daemon:x:2:2:daemon:/sbin:/sbin/nologin

### 以行为单位替换
以行为单位的替换与显示

将第 2-5 行的内容替换为自己的内容

    nl /etc/passwd | sed '2,5c No 2-5 number'
    1 root:x:0:0:root:/root:/bin/bash
    No 2-5 number
    6 sync:x:5:0:sync:/sbin:/bin/sync

另外一个比较常见的场景是，在一个文件中针对特定的行需要在行尾增加一个字符。比如

    192.168.1.1 host1
    192.168.1.2 host2
    192.168.1.3 host3
    
想要在 host2 后面增加字符 `host25` 变成 `192.168.1.2 host2 host25`, 那就可以

    sed '/192.168.1.2/s/$/ host25' path/to/file
    
验证无误之后可以直接使用 `sed -i` 原地替换。

### 数据的搜寻并显示

搜索 `/etc/passwd` 有 root 关键字的行

    nl /etc/passwd | sed '/root/p'
    1  root:x:0:0:root:/root:/bin/bash
    1  root:x:0:0:root:/root:/bin/bash
    2  daemon:x:1:1:daemon:/usr/sbin:/bin/sh
    3  bin:x:2:2:bin:/bin:/bin/sh
    4  sys:x:3:3:sys:/dev:/bin/sh
    5  sync:x:4:65534:sync:/bin:/bin/sync

如果 root 找到，除了输出所有行，还会输出匹配行。

使用`-n`的时候将只打印包含正则的行。

    nl /etc/passwd | sed -n '/root/p'
    1  root:x:0:0:root:/root:/bin/bash

输出指定的行数 （输出 2-5 行的数据）

    sed -n '2,5p' file

### 数据搜寻删除

删除 `/etc/passwd` 所有包含 root 的行，其他行输出

    nl /etc/passwd | sed  '/root/d'
    2  daemon:x:1:1:daemon:/usr/sbin:/bin/sh
    3  bin:x:2:2:bin:/bin:/bin/sh

### 搜索执行命令

搜索 `/etc/passwd`, 找到 root 对应的行，执行后面花括号中的一组命令，每个命令之间用分号分隔，这里把 bash 替换为 blueshell，再输出这行：

    nl /etc/passwd | sed -n '/root/{s/bash/blueshell/;p}'
    1  root:x:0:0:root:/root:/bin/blueshell

如果只替换 /etc/passwd 的第一个 bash 关键字为 blueshell，就退出

    nl /etc/passwd | sed -n '/bash/{s/bash/blueshell/;p;q}'
    1  root:x:0:0:root:/root:/bin/blueshell

最后的 q 是退出。

### 数据的搜寻并替换
结尾的 g 表示匹配所有的

    sed 's/regex/replace/g' file.txt

假如没有结尾的 g，比如

    sed 's/book/books/' file.txt

则表示匹配一个 book，并替换为 books。


### 多点编辑
一条 sed 命令，删除 `/etc/passwd` 第三行到末尾的数据，并把 bash 替换为 blueshell

    nl /etc/passwd | sed -e '3,$d' -e 's/bash/blueshell/'
    1  root:x:0:0:root:/root:/bin/blueshell
    2  daemon:x:1:1:daemon:/usr/sbin:/bin/sh

`-e`表示多点编辑，第一个编辑命令删除 /etc/passwd 第三行到末尾的数据，第二条命令搜索 bash 替换为 blueshell。

### 直接修改文件内容

sed 可以启用 `-i` 选项直接修改文件的内容，不必使用管道命令或者重定向。

    sed -i 's/\.$/\!/g' filename.txt         # 将文件每一行最后的 `.` 替换为 `!`
    sed -i '$a # add to last' filename.txt   # 每一行后面 ($) 增加 (a) 后面的内容

sed 可以直接修改文件内容，这样对于大文本，可以不需要使用 vim 打开在进行编辑，直接使用 sed 行读取编辑就能够实现行修改和替换的作用。

### 过滤部分内容
利用替换可以将不需要的内容替换成空

    sed -n -e 's/^.*id=//p'

可以打印 id= 后面的内容，然后再做处理。

### Sed 处理 Tab
在 sed 的语法中，比如替换一行中的 Tab 到逗号，会发现

	sed -i 's/\\t/,/g' some.txt

`\t` 其实并没有用，而是需要按下 `Ctrl`+`v` 然后输入 `Tab` 才有效。

	sed -i 's/	/,/g' some.txt

这样才有效。

## reference

- tldr sed
- <http://vbird.dic.ksu.edu.tw/linux_basic/0330regularex_2.php#sed>
- <http://www.cnblogs.com/stephen-liu74/archive/2011/11/17/2245130.html>


