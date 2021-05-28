---
layout: post
title: "JetBrains IntelliJ IDEA 中使用 vim 总结"
tagline: ""
description: ""
category: 学习笔记
tags: [intellij, vim, editor, shortcut, summary, ]
last_updated:
---

虽然使用了很长时间的 Vim，也使用了很长时间的 IntelliJ IDEA，但总感觉没有充分利用，所以想再这里总结一下，系统的浏览一遍 Idea Vim 插件能提供的功能，看看能不能有所受益，Vim 和 IntelliJ IDEA 的基本操作和内容就省略了。

## Introduction
首先 [ideavim](https://github.com/JetBrains/ideavim) 这个插件是 JetBrains 官方提供的，基本上安装后即可。GitHub 的页面还提到 ideavim 插件提供了一些 Vim 插件的扩展功能，比如：

- [vim-easymotion](https://github.com/easymotion/vim-easymotion)
- vim-surround
- vim-multiple-cursors
- vim-commentary
- argtextobj.vim
- vim-textobj-entire
- ReplaceWithRegister

可以根据[这个页面](https://github.com/JetBrains/ideavim/blob/master/doc/emulated-plugins.md) 上的方式配置和开启这个扩展功能。

## 为什么要用 IdeaVim

- 既充分利用了 IntelliJ 提供的代码补全，重构，代码浏览等等功能，又可以充分利用 Vim 的[多模式](http://einverne.github.io/post/2015/05/vim-mode.html)，以及 Vim 在编辑器中的高效
- 利用 `~/.ideavimrc` 来复用 Vim 的工作方式，以及充分利用 Idea 提供的 Action


## vim-easymotion

Idea 中的 vim-easymotion 插件支持的配置，可以参考[这里](https://github.com/AlexPl292/IdeaVim-EasyMotion#supported-commands)

### AceJump
在了解 easymotion 时意外收获了 AceJump 插件，IntelliJ IDEA 中的 easymotion 实际上是通过 AceJump 插件来实现的。
:q

默认情况下，使用 <kbd>Ctrl</kbd> + <kbd>;</kbd> 来开启 AceJump 模式，不过我的 `Ctrl + ;` 已经作为输入法的多粘贴板来使用了，所以就改成 <kbd>Alt</kbd> + <kbd>k</kbd> 。

AceJump 的工作流程，按下 Alt + K 进入 AceJump ，此时按下任何按键就会在当前文件搜索，并给每一个结果一个 tag，按下回车，然后输入 tag 就可以快速跳转过去。


- <https://github.com/acejump/AceJump>


## 结合 action
在 IntelliJ IDEA 中，任何选项操作都会映射到一个 `action` 上，点击按钮，就执行对应的 `action`，所以记住 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>a</kbd> 这个快捷键。

在编辑器模式下，可以输入如下命令查看 actionlist:

	:actionlist

## vim-surround
启用方式：

	set surround

支持的 Commands: ys, cs, ds, S

下面的例子中，假设 `*`是当前光标的位置：

Old Text       | Command |  Text After command execute
---------------|---------|----------------------------
"Hello *world!" | ds"    | Hello world!
[123 + 4*56]/2 | cs])  | (123+456)/2
"Look ma, I'm *HTML!" | cs"<q>  | `<q>Look ma, I'm HTML!</p>`
if *x>3       | ysW(  | if ( x>3 )
`my $str = *www;`   | vllS'  | `my $str = 'www';`

vim-surround 在想要改变 `surround` 的时候非常方便。

## vim-multiple-cursors
目前我的使用场景大部分通过 IDEA 自带的 rename 功能批量替换变量即可做到，所以目前还没有开启这个功能的需求，更多多光标的操作技巧可以参考[这篇文章](https://www.vojtechruzicka.com/intellij-idea-tips-tricks-multiple-cursors/)

IdeaVim 支持的所有快捷键：

- <https://github.com/JetBrains/ideavim/blob/master/src/com/maddyhome/idea/vim/package-info.java>

## 总结

最后，[这里](https://github.com/einverne/dotfiles/blob/master/idea/.ideavimrc) 是我的 `.ideavimrc` 配置。


## reference

- <https://github.com/AlexPl292/IdeaVim-EasyMotion>
- <https://github.com/ikenox/dotfiles/blob/master/intellij/ideavimrc>
