---
layout: post
title: "Vim 的 normal 命令"
tagline: ""
description: ""
category: Vim
tags: [vim, linux]
last_updated:
---

normal 命令指定是 Vim 下可以通过 normal 来指定执行 Normal 模式下的命令，以便于达到快速编辑大量文本的操作。

比如说要批量注释一批代码，需要在行前插入 `#`
替换：

    :%s/^/#/g

visual block：

    gg<Ctrl-v>I#<Esc>

注释第一行后用 dot command 重复执行每一行

    .

我们可以用 normal 命令实现上述需求，步骤：

光标定位到首行，执行：

    I#<Esc>

选中之后的所有行

    jVG

然后执行

    :'<,'>normal .

这样刚刚选中的行都将执行 `.` 代表的最后一次操作。注：只要输入 `：`就能实现`:'<,'>`，你可以注意 Vim 的左下角的提示。

当然如果不适用 Visual block 那也可以指定具体的操作对象，比如：`:%normal I#`，`%` 代表这个文件，代表着注释整个文件，当然也可以选择具体的范围，如：`:1,4normal I#` 表示注释 1 到 4 行。

总结：:normal 命令可以执行任何 normal 模式下的命令，更多帮助：`:help normal`。
