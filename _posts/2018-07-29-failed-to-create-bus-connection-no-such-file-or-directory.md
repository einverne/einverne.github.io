---
layout: post
title: "解决 failed to create bus connection no such file or directory 错误"
tagline: ""
description: ""
category: 经验总结
tags: [linux, problem, dbus, hostnamectl]
last_updated:
---

今天在修改 hostname 使用 `sudo hostnamectl set-hostname ds` 命令时遇到问题：

    Failed to create bus connection: No such file or directory

查了一通之后发现缺少 dbus

    sudo apt-get install dbus

安装 dbus 然后再修改即可，使用 `hostnamectl` 方式来修改 hostname 不需要重启，直接推出登录，然后就可以实现了。

> D-Bus 是一种高级的进程间通信机制，它由 freedesktop.org 项目提供，使用 GPL 许可证发行。D-Bus 最主要的用途是在 Linux 桌面环境为进程提供通信，同时能将 Linux 桌面环境和 Linux 内核事件作为消息传递到进程。D-Bus 的主要概率为总线，注册后的进程可通过总线接收或传递消息，进程也可注册后等待内核事件响应，例如等待网络状态的转变或者计算机发出关机指令。目前，D-Bus 已被大多数 Linux 发行版所采用，开发者可使用 D-Bus 实现各种复杂的进程间通信任务。


