---
layout: post
title: "vim normal 命令"
tagline: ""
description: ""
category: vim
tags: [Vim, Linux]
last_updated: 
---


替换：:%s/^/#/g
visual block：gg<Ctrl-v>I#<Esc>
注释第一行后用.重复执行每一行
我们可以在第三种方法之上用normal命令实现上述需求，步骤：

光标定位到首行，执行：I#<Esc>
jVG选中之后的所有行
:'<,'>normal .这样刚刚选中的行都将执行.代表的最后一次操作。注：只要输入:就能实现:'<,'>，你可以注意VIm的左下角的提示。
第四种方法：:%normal I#，%代表这个文件，当然你可以选择具体的范围，如：:1,4normal I#

总结：:normal命令可以执行任何normal 模式下的命令，更多帮助：:help normal。
