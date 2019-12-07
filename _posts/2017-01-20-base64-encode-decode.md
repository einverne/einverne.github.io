---
layout: post
title: "每天学习一个命令: base64 编解码"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [base64, linux, encode, decode,]
last_updated: 
---

Base64 是一种使用 64 个可打印的字符来表示二进制数据的方法，base64 中仅且包括字母 A-Za-z0-9+/ 共64个字符。Base64 通常处理文本数据，表示、传输、存储二进制数据。

## Base64编码由来

有些网络传送渠道不支持所有字节，比如邮件发送，图像字节不可能全部都是可见字符，所以受到了很大限制。最好的解决办法就是**在不改变传统协议的情况下**，利用一种扩展方式来支持二进制文件的传送，把不可打印的字符用可打印字符来表示。 Base64 就是一种基于64个可打印字符来表示二进制数据的方法。

## 原理

Base64 索引中，64个字符使用 6 bit 位就可以全部表示，一个字节有 8 个bit位，所以在 Base64 编码中，使用3个传统字节(8bit位) 由4个 Base64 字符来表示，保证有效位数一致。


- Base64 按照字符串长度，每3个 8 bit 组成一组，正对每组，获取每个字符的 ASCII 编码
- 将 ASCII 码转成 8bit 的二进制，得到 3*8=24 bit 的字节
- 将 24 bit 划分为 4 个 6bit 的字节，每个 6 bit 的字节前填两个高位0，得到4个 8bit 的字节
- 将4个 8bit 字节转化成10进制，对照 Base64编码表，得到对应编码后的字符。

下面对 Tom 三个字符进行编码

                T           o           m
    ASCII:      84          111         109
    8bit字节:   01010100    01101111    01101101
    6bit字节:   010101      000110      111101      101101
    十进制:     21          6           61          45
    对应编码:   V           G           9           t

因此 Tom 在 Base64 编码之后变成了  VG9t

要求：

1. 要求被编码字符是8bit， 所以要在 ASCII 编码范围内， \u0000-\u00ff 中文就不行
2. 编码字符长度不是3倍数事，用0代替，对应的输出字符为 `=`，所以实际 Base64 有65 中不同的字符。

因此 Base64 字符串只可能末尾出现一个或者两个 `=` ，中间是不可能出现 `=` 的。

## 使用

Base64编码主要用在传输、存储、表示二进制等领域，还可以用来加密，但是这种加密比较简单，只是一眼看上去不知道什么内容罢了，当然也可以对Base64的字符序列进行定制来进行加密。

简单字符串的加密，图片文件二进制的加密。

## 常用方式

格式：base64

从标准输入中读取数据，按Ctrl+D结束输入。将输入的内容编码为base64字符串输出。

示例一

```
[root@web ~]# base64 
hello 
Ctrl+D

aGVsbG8K
[root@web ~]#

[root@web ~]# 
[root@web ~]# base64 -d 
aGVsbG8K 
Ctrl+D hello
base64: invalid input 
[root@web ~]#
```

你会发现，base64命令会输出 base64: invalid input，似乎它把按Ctrl+D后的空行也作为输入来处理了。


格式：`echo "str" | base64`

将字符串str+换行 编码为base64字符串输出。


格式： `base64 <<< "hello"`

将字符串 hello 编码为 base64 ， bash 中 `<<<` 三个小于号意味着将右边的字符转为左边命令的输入
 

格式：`echo -n "str" | base64`

将字符串 str 编码为 base64 字符串输出。**无换行。**

> 在 zsh 中，无换行会以 % 百分号结尾，在bash中，命令提示符会直接跟在输出结果的后面 []$，而 zsh 会强制转换。

格式：`base64 file`

从指定的文件file中读取数据，编码为base64字符串输出。

格式：`base64 -d`

从标准输入中读取已经进行base64编码的内容，解码输出。


示例二

```
[root@web ~]# cat >1.txt 
hello
world

Ctrl+D 
[root@web ~]# base64 1.txt 
aGVsbG8Kd29ybGQK
[root@web ~]# base64 1.txt >2.txt 
[root@web ~]# base64 -d 2.txt 
hello
world
base64: invalid input 
[root@web ~]#
```

格式：`base64 -d -i`

从标准输入中读取已经进行base64编码的内容，解码输出。加上-i参数，忽略非字母表字符，比如换行符。 

man base64 中

    -i, --ignore-garbage
    When decoding, ignore non-alphabet characters.

    use --ignore-garbage to attempt to recover from non-alphabet characters (such as newlines) in the encoded stream.

格式：`echo "str" | base64 -d`

将base64编码的字符串str+换行 解码输出。


格式：`echo -n "str" | base64 -d`

将base64编码的字符串str解码输出。

格式：`base64 -d file`

从指定的文件file中读取base64编码的内容，解码输出。


```
[root@web ~]# echo "hello" | base64 
aGVsbG8K
[root@web ~]# echo "aGVsbG8K" | base64 -d 
hello
base64: invalid input 
[root@web ~]# echo -n "aGVsbG8K" | base64 -d 
hello
[root@web ~]#
```

使用echo输出字符串时，如果没有-n参数会自动添加换行符，这会令base64命令发晕。

## reference

- <http://zh.wikipedia.org/zh/Base64>
- Base64 转图片 <http://codebeautify.org/base64-to-image-converter>
- <http://www.cnblogs.com/luguo3000/p/3940197.html>
