---
layout: post
title: "Intellij IDEA 快捷键使用学习"
tagline: ""
description: ""
category: 学习笔记
tags: [intellij, IDE, java, vim, editor, ]
last_updated:
---

这篇文章受到 IntelliJ 官方插件 IDE Features Trainer 的启发，学习一个编辑器应该归类，从不同的操作学习。从基本的编辑，到代码导航，再到辅助，到重构，重要的不是学习这些快捷键，而是学习可以怎么样做，并且用这样的思考方式用到不同的编辑器中。

Mac 上常见的四个快捷键对应关系，简单的可以将 Alt 对应 Mac 下的 Option，而在 Mac 下 Cmd 和 Ctrl 被人为的分隔开来，Cmd 大多数与GUI相关，Cmd+Q退出应用，Cmd+W关闭一个Tab，而Ctrl和终端相关，Ctrl+a则是跳转到行首，Ctrl+e跳转到行尾。然后和Shift，Option结合就能组合成非常多常用的功能。Windows下不足的一个地方就是将 Win 键的功能单一化了，大部分的情况下Win 键是鸡肋。

另外 Shift 可以认为是一个相反的操作，比如 Cmd+Tab 是切换应用，那么 Cmd+Shift+Tab 就是反向切换应用。再比如在 IntelliJ IDEA 中 Cmd+z 是 undo，那么 Cmd+Shift+z 就是 redo，撤销之前的撤销。

## Basics
一个编辑器基本的操作，包括复制，剪切，粘贴，选择，多点选择，折叠代码块等等。而关于复制，剪切，粘贴 IdeaVim 已经完全满足需求，不需要用 IntelliJ 内置的任何命令。

### Selection
选择，块选择，本来 Vim 的选择模式也已经足够强大，不过 IntelliJ 提供了如下两个方式相较于 Vim 的块选稍微强大一些。

- Alt + Shift + Up  扩展选择区块
- Alt + Shift + Down  缩减选择区块

原来 Vim 的块选，比如想要选择某一个方法，大致可以使用 `vap`，或者选择花括号内容 `vi{` 等等，在非常清楚需求的情况下非常方便，但是比如有些时候不想选择整个段落，想要可视化的选择一些代码块，不妨试试上面两个快捷键。

### Collapse
代码的折叠与展开，倒是不复杂。

- Ctrl -/+  Collapse/Expand a code region
- Ctrl Shift -/+   Collapse/Expand all regions in a file

### Multiple Selections
多选，比较常见地一种场景就是变量重命名，当然有些时候比如编辑 html 时批量替换某些标签，有很多方法可以实现，比如变量重命名功能，或者批量替换，又或者使用 vim 的 dot 命令。

- Alt + j 选择光标下的内容
- Alt + j 选择下一个
- Alt + Shift + j 取消选择最后一个
- **Ctrl + Alt + Shift + j** 选择文件中所有出现的字符

IntelliJ 当然也提供了很多方式，上面提到的只是其中的一种。

### Generate
生成一些模板方法，默认的快捷键是 Cmd+n, 自动生成构造方法，toString 方法，get-set 方法，或者 override 方法等等。

### Live template


## Refactorings

### Rename 重命名
批量重命名，很有用的快捷键，必须知道。

- Shift + F6

借助 IdeaVim 在我的[配置文件中](https://github.com/einverne/dotfiles), 我把 `,+r` 映射成了变量重命名:

```
nnoremap <Leader>r :<C-u>action RenameElement<CR>
```

### Extract Variable/Field 提取变量

Ctrl + Alt + V

### Extract Method 提取方法
个人对方法提取用的还是比较多的，重构代码或者重新规划代码时非常有用。

- Ctrl + Alt + M 提取选择到方法
- Ctrl + Alt + C 提取选择到 Constant
- Ctrl + Alt + P 提取选择到参数

## Code Assistance

### Formatting
格式化，对于格式化的要求应该在任何保存的时候进行格式化，应该在提交代码前强制进行格式化。当然用快捷键时不时的格式化一下也可以。

- Ctrl + Alt + L

### Parameter Info
显示参数

- Ctrl + P

### Quick Popups

- Ctrl + Q
- Esc
- Ctrl + Shift + I 查看光标下方法定义

### Editor Coding Assistance

- F2 遍历错误
- Ctrl + F1 查看错误明细
- **Ctrl + Alt + T** 在选择区域周围嵌套代码。

## Navigation
Vim 插件已经能够做到非常好的在单文件内浏览了，无论是上下，或者翻页，或者查询特定变量，方法。如果要做到查询方法的父类或者接口就不得不借助 IntelliJ 自身的快捷键。

我借助 IdeaVim 插件的魔力,将常见的代码流量都映射成了 g 开头的操作,比如跳转到超类就是 go to super, 快捷键就是 gs

### Jump to Source
在阅读代码时有几个操作经常会用到：

- 查看接口或者抽象类的具体实现 Ctrl + T
- 跳转到超类 Ctrl + B Super method
- 查看当前方法被调用的地方 Ctrl + G
- 跳转到类实现 F3


### Next/Previous Occurrences
个人使用 Vim 的 `*` 和 `np` 基本满足了查询当前字符串的需求，所以这里也就不列举 IDE 自带的快捷键了。


## IntelliJ 独有的功能快捷键

### Search Everywhere
全局搜索，默认的快捷键是 Shift + Shift, 这是一个非常有用的快捷键，可以搜索 IntelliJ IDEA 内部的功能，同时也可以模糊搜索项目代码文件，执行任务，跳转等等。

### Intention Action
默认的快捷键是 Alt+Enter

### Editor 内快速跳转到 Terminal
默认的快捷键是 Alt(Option)+F12

### Invoke refactoring
重构代码，会弹出一个功能选单 Refactor this，在这个功能选单中可以做如下事情。

停留在变量上，方法名，类名上：

- rename, 重命名光标下的变量名, 方法名，类名
- change signature, 改变方法签名
- copy class, 复制类
- move class, 移动类

## 整理总结

Cmd 系列

快捷键 | 功能描述
------|---------
Cmd+q | Q退出应用
Cmd+c/v/x | copy/paste/cut
Cmd+z |
Cmd+w | close Tab
Cmd+e | recent file
Cmd+n | generate
Cmd+o | file structure

Ctrl 系列

快捷键 | 功能描述
------|---------
Ctrl+a/e  | 行首行尾
Ctrl+n/p  | next line/Previous line
Ctrl+b | go to super class
Ctrl+g | find usage
Ctrl+h | find in path
Ctrl+Option+b | go to implements
