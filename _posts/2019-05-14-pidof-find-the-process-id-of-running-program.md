---
layout: post
title: "每天学习一个命令：pidof 查找进程 PID"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [pid, netstat, command, linux, ]
last_updated:
---

pidof finds the process id's(pids) of the names programs.

## Usage

    pidof [name]

## Example

### find chrome pid

    pidof chrome
    pidof -s chrome

Options：

- `-s` instructs the program to only return one pid.


## Extension

- pgrep
