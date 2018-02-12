---
layout: post
title: "Linux 下安全的删除文件"
tagline: ""
description: ""
category: 经验总结
tags: [linux, rm, delete, file, manager]
last_updated: 
---

Linux 下有一个非常危险的命令----rm，虽然本意上rm命令是用来删除文件或者文件夹的，但是这个命令删除的文件很难找回来，一旦不小心手贱敲快了，就有可能导致不可挽回的结果。所以我搜了一圈，发现其实 Ubuntu 下有一个包 `trash-cli`。给Linux加了一层垃圾箱。

## 安装

    sudo apt install trash-cli

这个命令包，包括 `trash`, `trash-list`, `trash-restor`, `trash-empty` 等等几个命令，具体可以参看 man。

在 `~/.zshrc` 中添加 alias

    alias rm=trash

这样，以后使用 rm 时，默认将文件移动到垃圾箱中，再不会发生不小心删除文件之后无法找回的问题。

## reference

- <https://askubuntu.com/a/6703/407870>
