---
layout: post
title: "IO 重定向"
tagline: ""
description: ""
category: Linux
tags: [Linux, Shell, Bash,]
last_updated: 
---

上一篇讲了 [shell 脚本的基本语法](/post/2017/03/bash-shell-script.html)，然后这篇补一补标准输入输出重定向命令，以及管道命令。

一般情况下，每个 Unix/Linux 命令运行时都会打开三个文件：

- 标准输入文件(stdin)：stdin的文件描述符为 0，Unix程序默认从stdin读取数据。
- 标准输出文件(stdout)：stdout 的文件描述符为 1，Unix程序默认向stdout输出数据。
- 标准错误文件(stderr)：stderr的文件描述符为 2，Unix程序会向stderr流中写入错误信息。


## 管道命令
管道命令的操作符是"|", 它将前一个命令的输出给下一个命令作为输入。

	command1 | command2 | command3

将前一个命令的输出作为下一个命令的输入，比如 `cat text.txt | less`。 管道命令不处理错误输出。

## 输出重定向

	> filename.txt

将 stdout 重定向到文件，如果不存在则创建，否则覆盖


	: > filename

此操作将文件 filename 变为空文件， size 为0。文件不存在则创建，与 touch 命令相同。 冒号是一个占位，不产生任何输出


	>>

追加到文件末尾

	2> filename

重定向 stderr 的输出到文件

	2>> filename

重定向并追加 stderr 到文件

	&> filename

将 stdout 和 stderr 都重定向到 file

下面是一个例子：

    cat *.txt | sort | uniq > result-file
    # 对所有.txt文件的输出进行排序, 并且删除重复行.
    # 最后将结果保存到"result-file"中.

在 crontab 任务中，需要使用 `2>&1` 来输出到日志

	* * * * * command >> file.log 2>&1

## 输入重定向

	command < file

将右边文件作为输入给左边的命令


	command <<< string

后面接 string，将 string 内容给 command

## /dev/null 文件

如果希望执行某个命令，但又不希望在屏幕上显示输出结果，那么可以将输出重定向到 /dev/null：

	$ command > /dev/null

/dev/null 是一个特殊的文件，写入到它的内容都会被丢弃；如果尝试从该文件读取内容，那么什么也读不到。但是 /dev/null 文件非常有用，将命令的输出重定向到它，会起到”禁止输出“的效果。

如果希望屏蔽 stdout 和 stderr，可以这样写：

	$ command > /dev/null 2>&1




## reference

- <http://c.biancheng.net/cpp/view/2738.html>
- <http://tldp.org/LDP/abs/html/index.html>