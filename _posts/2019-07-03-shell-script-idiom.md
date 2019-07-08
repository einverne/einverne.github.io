---
layout: post
title: "shell script idiom"
tagline: ""
description: ""
category:
tags: [bash, shell, stdout, stderr, pipeline]
last_updated:
---

Bash 命令中一些常见的习惯。

    > file redirects stdout to file
    1> file redirects **stdout** to file
    2> file redirects **stderr** to file
    &> file redirects stdout and stderr to file

`/dev/null` is the null device it takes any input you want and throws it away. It can be used to suppress any output.

Using `2>&1` will redirect stderr to whatever value is set to stdout (and 1>&2 will do the opposite).

