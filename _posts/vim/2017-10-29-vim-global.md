---
layout: post
title: "Vim 全局命令 g"
tagline: ""
description: ""
category: vim
tags: [Vim, Regex, Linux]
last_updated: 
---

全局命令 `:g` 在 Vim 中有着意想不到强大的功能。当想要在整个文件中对于匹配的行或者不匹配行进行一些操作时，应该第一时间想到这个 `:g` 命令。

    :[range]global[!]/{pattern}/{command}

简写可以写成

    :[range]g/pattern/command

- [range] 指定文本范围,默认为整个文档
- pattern 在范围 range 内的行如果匹配 pattern，则执行 command
- ! 表示取反，也就是不匹配的行，也可以使用 `vglobal`
- command 默认是打印文本

整个命令可以理解成，在 range 范围内匹配 patter 的行执行 Ex command。所有的 Ex command 可以使用 `:help ex-cmd` 来查看。

常用的 Ex command 可以参考如下例子：

- d 删除
- m 移动
- t 拷贝
- s 替换

## 举例

### 范围匹配
比如在 20 行到 200 行之间，每一行下插入空行

    :20,200g/^/pu _

### 删除匹配的行
最简单的使用

    :g/pattern/d

会删除 pattern 批量的行，再比如

    :g/^$/d

可以用来删除空白行。

### 删除不匹配的行
匹配使用 `:g` ，而不匹配有两种写法：

    :g!/pattern/d
    :v/pattern/d

`:v` 是 `:in(v)erse` 的缩写，如果为了记忆的话，可以记住 in**v**erse。

### 删除大量匹配行
Vim 在删除操作时，会先把要删除的内容放到寄存器中，假如没有指定寄存器，会默认放到一个未命名的寄存器中，对于要删除大量匹配行的行为，可能导致 Vim 花一些时间处理这些拷贝，避免花费不必要的时间可以指定一个 blackhole 寄存器 `_` 。

    :g/pattern/d_

### 移动匹配的行
将所有匹配的行移动到文件的末尾

    :g/pattern/m$

### 复制匹配的行
将所有匹配的行复制到文件末尾

    :g/pattern/t$

### 复制到 register a
Vim 每个字母都是一个寄存器，所以使用全局命令也可以将内容复制到某一个寄存器，比如 a

    qaq:g/pattern/y A

- `qaq` 清空寄存器 a，`qa` 开始记录命令到a寄存器，`q` 停止记录
- `y A` 将匹配的行 A (append) 追加到寄存器 a 中

### 反转文件中的每一行
just show the power of :g

    :g/^/m0

`:g` 命令一行行匹配，匹配第一行时将第一行 `m0` 放到文件顶部，第二行放到文件顶部，当跑完一遍之后整个文件的每一行就反转了。

### 在匹配行后添加文字
使用 `s` 命令可以实现，同样使用全局 `g` 命令也可以实现同样的效果

    :g/pattern/s/$/mytext

这里使用到了 `s` 命令， substitute 命令，可以使用 `:help :s` 来查看。

## reference

- <http://vim.wikia.com/wiki/Power_of_g>
