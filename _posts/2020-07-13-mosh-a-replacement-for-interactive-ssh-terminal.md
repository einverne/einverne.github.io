---
layout: post
title: "mosh: 使用 UDP 传输的 Shell"
tagline: ""
description: ""
category: 学习笔记
tags: [mosh, ssh, udp, ]
last_updated:
---


Mosh 是 `mobile shell` 的缩写，Mosh 允许间断性连接，使用传统的 SSH 连接远程设备时，如果遇到一点点的网络问题，SSH 连接就会被中断。Mosh 使用 UDP 传输，相较于 SSH，在漫游网络，Wi-Fi，移动 (cellular) 网络，长距离连接等网络场景下提供了更好的连接体验。

Mosh 提供的一些特性：

- Mosh 会自动在连接的网络环境中进行切换，而不会中断连接。尤其当在移动设备上使用 Wi-Fi，3/4G 移动连接时，可以保持连接状态
- 当笔记本进入睡眠状态，然后再被唤醒，网络连接会中断，使用 Mosh ，但网络中断时会提醒，而当网络恢复时会自动重连
- SSH 会等待服务端的回应然后再回显终端上的输入。这就导致了如果连接延迟过高，用户所见内容会有延迟。Mosh 则是会立即显示输入内容，包括输入，删除，行编辑等等。Mosh 会自适应，即使是全屏的应用比如 emacs 或者 vim 也可以得益。在连接不好的时候，提前输入的内容会标记下划线以告诉用户区别
- mosh 没有需要特殊权限运行的内容，客户端和服务端都是单独的可执行文件
- Mosh 不会监听网络端口或者需要创建授权用户。mosh 客户端通过 SSH 登录服务端，使用 SSH 相同的用户名。然后 Mosh 在远端运行 mosh-server，通过 UDP 进行数据传输
- Mosh 是一个命令行程序，和 ssh 一样。可以在 xterm, gnome-terminal, urxvt, Terminal.app, iTerm, emacs, screen, 或者 tmux 中运行。mosh 支持 UTF-8 编码，可以修复其他终端可能产生的 Unicode 错误
- 支持 Ctrl-C，Mosh 不会填满网络缓冲，Ctrl-C 可以用来终止一个正在运行的程序

## Install
安装过程就比较简单了：

	apt install mosh

其他平台类似。

## Usage
指定端口号：

	mosh --ssh="ssh -p 2222" someone@host

指定 ssh key：

	mosh --ssh="~/bin/ssh -i ./identity" someone@host


## reference

- <https://mosh.org/>
- <https://github.com/mobile-shell/mosh>
