---
layout: post
title: "Bash Script"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, shell, bash, assignment, ]
last_updated:
---

## Shell Syntax - what is your input means to the shell

### Shell Operations - what can shell do

- read input from file
- breaks the input into words and operations
- parse the token into simple and compound commands
- performs the various shell expansions
- redirections
- execute the commands
- wait for command to complete and collect the exit status

### Quoting - remove the special meaning from characters

#### Escape Character
A non-quoted backslash `\` is the Base escape character. It preserves the literal value of the next character that follows.

除了 `\newline` 有特殊意义。其他都表示转义。

#### Single Quotes
Enclosing characters in single quotes(`'`) perserves the literal value of each character within the quotes. A single quote **may not** occur between single quotes, even when proceded by a backslash.

#### Double Quotes
Enclosing characters in double quotes (`"`) perserves the literal value of all characters within the quotes, with the exception of `$`, ```, `\`.


#### ANSI-C Quoting

    \a      alert
    \e \E   an escape character
    \n      newline








`$(command)` is the modern synonym for `command` , `$()` will evaluate this command result and then evaluate the reset of line.

    echo $(pwd)/file

with be

    echo /path/to/file

Curly braces (`${}`) are also unconditionally required when

- expanding array elements, as in `${array[2]}`

## Shell Commands - the types of commands you can use



## Shell Functions - the way you group commands by name
Two ways to define a function:

    function functname {

    }

or

    functionName() {

    }

## Shell Parameters - how shell stores values


## Shell Expansions - how bash expands parameters and the various expansions available

## Redirections - a way to control where input and output go


## Executing Commands - what happens when you run a command


## Shell Scripts - executing files of shell commands



## Double parentheses
Double parentheses are used for arithmetic operations:

    ((a++))

    ((meaning = 42))

    for ((i=0; i<10; i++))

    echo $((a + b + (14 * c)))


## Bash built-in variables
if we have file `test.sh`

    #! /bin/sh
    echo '$#' $#
    echo '$@' $@
    echo '$?' $?

then run:

    > ./test.sh 1 2 3

We will get:

    $#  3
    $@  1 2 3
    $?  0

Explain:

    $# = number of arguments. Answer is 3
    $@ = what parameters were passed. Answer is 1 2 3
    $? = was last command successful. Answer is 0 which means 'yes'


## Tips

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
