---
layout: post
title: "每天学习一个命令：高级日志查看工具 lnav"
aliases:
- "每天学习一个命令：高级日志查看工具 lnav"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [ linux, lnav, log, less, zless, logfile ]
create_time: 2024-02-10 11:02:09
last_updated: 2024-02-10 11:02:09
---

[The Logfile Navigator](https://lnav.org/) 是一个高级的日志查看工具，后面简写为 lnav。

早上在看 [[Logdy]] 的时候（一款可以将终端的输出 （stdout）发送给浏览器 UI 界面，在可视化界面中检索浏览的开源工具），在作者发帖的讨论中，看到有人推荐 lnav 这一款工具，在本地开发的时候，用 lnav 来查看日志。[^1]

[^1]: <https://news.ycombinator.com/item?id=39277079>

在不知道 lnav 之前，我一直都是使用 tail -f, less, zless, more 来查看日志的，但是 less 这一些工具都是不带高亮的，所以每一次都需要通过搜索来找到自己的想要的内容，但看到 lnav 的介绍立即就看到了 lnav 的高亮显示，立马就尝试了一下。

## 特性

- 根据日志内容自动高亮 ERROR 等等关键字
- 自动滚动刷新
- 根据正则表达式过滤内容，比如查询 IP 地址等等情况
- 使用 SQL 查询

## 安装

Ubuntu 下

```
sudo apt install lnav
```

## 使用

完整的命令行参数

```
❯ lnav -h
usage: lnav [options] [logfile1 logfile2 ...]

A curses-based log file viewer that indexes log messages by type
and time to make it easier to navigate through files quickly.

Key bindings:
  ?     View/leave the online help text.
  q     Quit the program.

Options:
  -h         Print this message, then exit.
  -H         Display the internal help text.
  -I path    An additional configuration directory.
  -H         Display the internal help text.
  -I path    An additional configuration directory.
  -i         Install the given format files and exit.  Pass 'extra'
             to install the default set of third-party formats.
  -u         Update formats installed from git repositories.
  -C         Check configuration and then exit.
  -d file    Write debug messages to the given file.
  -V         Print version information.

  -a         Load all of the most recent log file types.
  -r         Recursively load files from the given directory hierarchies.
  -R         Load older rotated log files as well.
  -t         Prepend timestamps to the lines of data being read in
             on the standard input.
  -w file    Write the contents of the standard input to this file.

  -c cmd     Execute a command after the files have been loaded.
  -f path    Execute the commands in the given file.
  -n         Run without the curses UI. (headless mode)
  -q         Do not print the log messages after executing all
             of the commands or when lnav is reading from stdin.

Optional arguments:
  logfile1          The log files or directories to view.  If a
                    directory is given, all of the files in the
                    directory will be loaded.

Examples:
  To load and follow the syslog file:
    $ lnav

  To load all of the files in /var/log:
    $ lnav /var/log

  To watch the output of make with timestamps prepended:
    $ make 2>&1 | lnav -t

Version: lnav 0.8.5
```

直接查看日志文件

```
lnav /path/to/file.log
```

进入 lnav 之后还有一些快捷键，可以使用 `?` 呼出帮助。

和 Linux 下大部分交互的工具一样，lnav 也遵循了一直的交互逻辑

- g, 到文件第一行
- G, 到文件最后一行
- space, 下一页
- b/bs, 上一页
- j, 下一行
- k, 上一行
- h, 向左移
- l, 向右移动
- e/E, 上一个，下一个 error
- w/W, 上一个，下一个 warning
- f/F, 下一个，上一个文件
- `/`，检索
- n/N, 上一个下一个检索结果

可以看到上面的这些快捷，基本上和 Vim/less 的一致。

还有一些调整显示的选项

- i，开启显示日志直方图
- t，开启或关闭 text file view

检索语句

- `:<command>`  执行内部命令，具体的命令可以查看帮助文档，或者阅读 `?` 中的文档
    - `:goto 2 hour ago`
    - `:goto 12:00`
- `;<sql>`，执行 SQL 检索


