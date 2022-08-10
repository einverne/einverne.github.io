---
layout: post
title: "在 IntelliJ IDEA 中使用 reset frame 回退 Debug"
aliases:
- "在 IntelliJ IDEA 中使用 reset frame 回退 Debug"
tagline: ""
description: ""
category: 学习笔记
tags: [ intellij, intellij-idea, idea, java, debug, debug-tips, reset-frame, drop-frame, ]
create_time: 2022-08-08 17:07:56
last_updated: 2022-08-08 17:07:56
---

在 IntelliJ IDEA 中调试的时候，如果不小心断点跳过了，如果可以往前跳转就可以省去很多时间。搜索一下之后发现，在 IDEA 中叫做 Reset Frame（之前叫做 Drop Frame）。

在启动调试之后，在调试 Debugger 窗口中有 Frames ，其中就是调用堆栈。

![idea debugger reset frame](/assets/screenshot-area-2022-08-08-171318.png)

点击其中的某一条，然后右击就可以看到菜单，选择想要跳转回去的 Frame，然后 Reset。

不过需要注意的是这个操作只会重置局部变量，全局变量的状态不会重置。

## reference

- <https://www.jetbrains.com/help/idea/stepping-through-the-program.html#drop-frame>
