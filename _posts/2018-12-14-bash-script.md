---
layout: post
title: "Using ${a:-b} 来赋值"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, bash, assignment, ]
last_updated:
---

看一些 shell 脚本的时候发现了如下的写法

    VAR1=${VAR1:-VAR2}

这个语句允许当 VAR1 为空时用 VAR2 来赋值。

    ${parameter:-word}
        If parameter is unset or null, the expansion of word is substituted.
        Otherwise, the value of parameter is substituted.

这个在 Bash 中叫做 parameter expansion ，更多的内容可以参考 Bash Hacker's [Wiki](http://wiki.bash-hackers.org/syntax/pe)

## 使用举例

当 variable 不存在时，会默认使用后者

    $ echo "$VAR1"

    $ VAR1="${VAR1:-default value}"
    $ echo "$VAR1"
    default value

当 variable 存在时，则使用前者

    $ VAR1="has value"
    $ echo "$VAR1"
    has value

    $ VAR1="${VAR1:-default value}"
    $ echo "$VAR1"
    has value

## reference

- <https://unix.stackexchange.com/a/122848/115007>
