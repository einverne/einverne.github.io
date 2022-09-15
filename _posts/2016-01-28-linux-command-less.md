---
layout: post
title: "每天学习一个命令：less 分页查看"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [less, linux, command, ]
last_updated:
---

less 命令可以对文件或其它输出进行分页显示，应该说是 linux 正统查看文件内容的工具，功能强大。less 的用法比起 more 更有弹性。在 more 的时候，我们并没有办法向前面翻，只能往后面看，但若使用了 less 时，就可以使用 [pageup] [pagedown] 等按键的功能来往前往后翻看文件，更容易用来查看一个文件的内容。除此之外，在 less 里拥有更强大的搜索功能，不止可以向下搜，也可以向上搜。

## 命令格式

    less [options] 文件

## 命令功能

less 与 more 类似，more 仅能向前移动，却不能向后移动，而且 less 在查看之前不会加载整个文件

命令参数：

    -b  缓冲区大小 设置缓冲区的大小
    -e  当文件显示结束后，自动离开
    -f  强迫打开特殊文件，例如外围设备代号、目录和二进制文件
    -g  只标志最后搜索的关键词
    -i  忽略搜索时的大小写
    -m  显示类似 more 命令的百分比
    -N  在 less 中显示每行的行号
    -o  文件名 将 less 输出的内容在指定文件中保存起来
    -Q  不使用警告音
    -s  显示连续空行为一行
    -S  行过长时间将超出部分舍弃
    -x  数字  将“tab”键显示为规定的数字空格

交互命令， less 中的交互命令可以在 less 中直接按下按键来使用：

    h H       显示帮助界面
    q :q Q :Q ZZ  退出 less 命令

移动，全屏导航

    F     	like tail -f 滚动到文件末尾并持续监听文件写入
    jk      下 / 上 一行，因为个人习惯了 vim 的 keymap 所以使用 jk，但 less 的移动键有很多个，可以 help 来查看
    G       移动到最后一行
    g       移动到第一行
    f 		向下移动一屏
    b 		向上移动一屏
    d 		向下移动半屏
    u 		向上移动半屏
    y       向前滚动一行
    空格键 滚动一页
    回车键 滚动一行
    [pagedown] 向下翻动一页
    [pageup]   向上翻动一页

less 命令和 Vim 类似，也可以使用比如 10k，表示向上移动 10 行。

less 内搜索

    /       字符串：向下搜索“字符串”的功能
    ?       字符串：向上搜索“字符串”的功能
    n       重复前一个搜索（与 / 或 ? 有关）
    N       反向重复前一个搜索（与 / 或 ? 有关）
    &pattern    只显示匹配的行

快速跳转

    g   <   ESC-<           跳转到第一行
    G   >   ESC->           跳转到最后行
    ''                      跳转到上一个位置

其它交互命令

    :e  检视其他文件
    v   使用配置的编辑器 ($VISUAL or $EDITOR) 编辑当前文件
    V   打印 less 版本
    !command    执行 $SHELL 命令
    h   显示 less 的帮助文档
    &pattern   仅显示匹配模式的行，而不是整个文件

标记导航

当使用 less 查看大文件时，可以在任何一个位置作**标记**，可以通过命令导航到标有特定标记的文本位置：

    ma   使用 a 标记文本的当前位置
    'a   导航到标记 a 处

看到这些交互命令其实应该一点都不陌生，如果使用 Vim 的话，基本都是 Vim 中用到的。

## 使用实例

### 查看文件
命令：

    less +F /var/log/syslog

### ps 查看进程信息并通过 less 分页显示
将其他命令的输出结果分页查看，尤其是当其他命令的输出结果多于一页时。

    ps -ef |less

举一反三

    apt search nemo | less

查看命令历史使用记录并通过 less 分页显示

    history | less

### 浏览多个文件
同时查看多个文件：

    less /var/log/syslog /var/log/mysql/error.log

此时 less 只会显示一个 syslog，此时

- 输入 `:n` 后，切换到 mysql/error.log
- 输入 `:p` 后，切换到 syslog

