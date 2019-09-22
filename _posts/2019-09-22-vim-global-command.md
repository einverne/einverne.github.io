---
layout: post
title: "Vim global 命令"
tagline: ""
description: ""
category: Vim
tags: [vim, vim-global, ex-command, vim-mode, editor, linux, ]
last_updated:
---

global 命令结合了 Ex 命令和 Vim 模式匹配的能力，借助该命令，可以在指定模式的所有匹配行上运行 Ex 命令。global 命令是除了点操作和宏命令之外，最强大的 Vim 工具之一。

## Basic
global 命令基本形式，可以读作在 range 上，如果行匹配 pattern，那么执行全局命令 cmd

	:[range] global[!]/{pattern}/[cmd]

说明：

- 缺省情况下，global 命令作用范围是整个文件 (%).
- 除了 `global` 还有 `:vglobal` 表示反转，在没有匹配 pattern 的行上执行 cmd
- pattern 与查找历史相互关联，如果留空，Vim 会自动使用当前的查找模式
- [cmd] 可以是 `:global` 之外的任何 Ex 命令，如果不指定 [cmd], 那么缺省是 `:print`

## Use case

### 删除所有包含模式的行 {#delete-line}

比如删除所有空行

	:g/^$/d

### 拷贝包含 TODO 的行到文件末尾
代码中经常会写一些 TODO , 如果想要统一处理这些 TODO，可以使用

	:g/TODO/t$

将 TODO 行拷贝到文件末尾，来处理。


