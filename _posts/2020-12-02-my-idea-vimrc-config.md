---
layout: post
title: "我的 IntelliJ IDEA Vim 插件配置"
aliases: "我的 IntelliJ IDEA Vim 插件配置"
tagline: ""
description: ""
category: 学习笔记
tags: [idea, vim, vimrc, config, vim-config, jetbrain, intellij-idea, ide ]
last_updated:
---

IdeaVim 是 IntelliJ IDEA 编辑器下一款模拟 Vim 快捷键的开源插件。

鉴于大部分的时间都在 IntelliJ IDEA 下工作，所以总结一下在 IDEA 下使用 Vim 的动作。

## 为什么要用 IdeaVim

- 既充分利用了 IntelliJ 提供的代码补全，重构，代码浏览等等功能，又可以充分利用 Vim 的[多模式](http://einverne.github.io/post/2015/05/vim-mode.html)，以及 Vim 在编辑器中的高效操作
- 利用 `~/.ideavimrc` 来复用 Vim 的工作方式，即使将工作环境切换到 Terminal 下也可以沿用，并且充分利用 Idea 提供的 Action
- 多平台下沿用一套工作流程，不需要解决因为操作系统不同而产生的快捷键冲突

## 必须安装的插件

- IdeaVim
- AceJump
- IdeaVim-EasyMotion


## 利用 .ideavimrc 配置 IdeaVim

### 重新加载 .ideavimrc
如果安装了插件之后，IntelliJ IDEA 在启动时会自动加载 `~/.ideavimrc` 这个配置文件，改动该文件后可以使用如下方式手动重新加载：

	:source ~/.ideavimrc

或者直接在编辑器中 `:e ~/.ideavimrc` 然后在右上角的地方会出现重新 Load 的图表，点击即可。

## 使用案例

### 打开最近使用的项目
我映射了 `leader` + `o` 打开最近项目列表，用来快速的打开项目。

首先创建一个 `keymap`(用过 Vim 的都知道，可以自定义一个 modifier key，通过这个修饰键可以形成一套新的快捷键组合):

```
let mapleader = ","
nnoremap <Leader>o :<C-u>action RecentProjectListGroup<CR>
```

然后使用配置的 leader 快捷键 <kbd>,</kbd> + <kbd>o</kbd> 就可以快速弹出最近打开项目，使用模糊搜索就可以快速打开新的项目。

在不知道这个方法以前，我都是在 [[Alfred]] 中配置了一个 Workflow 来打开新的项目的。在发现上面这个方法后，发现在 IDE 内通过这个方式打开别的项目，远比 Alfred 中要快。熟悉一段时间之后，甚至可以不用看搜索结果，直接使用逗号加 `o` 然后快速输入项目的模糊查询的关键字，然后回车。


### Go to Declaration
IDEA 自身就提供了非常多的快捷来在代码之间跳转，比如：

- 跳转到变量，方法，类的定义
- 跳转到 Super 类
- 跳转到方法被调用的地方
- 跳转到实现的地方
- 跳转到文件
- 跳转到测试类

等等，在我的工作流里面，为了方便记忆，统一使用 `g` 作为简记符。比如 `gd` 表示 `go to definition`。

在 `.ideavimrc` 文件中，定义 `map xxx :action yyy` 表示自定义一个 `keymap` 调用 IntelliJ 的 action。

	nnoremap gd :action GotoDeclaration

这里的 `GotoDeclaration` 是 IntelliJ 的一个 action，一个 IntelliJ 的 Action 对应着 IntelliJ 的一个功能。上面的定义就表示在 Normal 模式下定义新的 `keymap gd`，表示的是在 Normal 模式下，按下 `gd` 就会执行 IDEA 的 action `GotoDeclaration`。

IntelliJ 提供了一系列的 Action 可以使用。

比如我定义了如下的跳转：

```
" go to somewhere (g in normal mode for goto somewhere)
nnoremap ga :<C-u>action GotoAction<CR>
nnoremap gb :<C-u>action JumpToLastChange<CR>
nnoremap gc :<C-u>action GotoClass<CR>
nnoremap gd :<C-u>action GotoDeclaration<CR>
nnoremap gs :<C-u>action GotoSuperMethod<CR>
nnoremap gi :<C-u>action GotoImplementation<CR>
nnoremap gf :<C-u>action GotoFile<CR>
nnoremap gm :<C-u>action GotoSymbol<CR>
nnoremap gu :<C-u>action ShowUsages<CR>
nnoremap gt :<C-u>action GotoTest<CR>
nnoremap gp :<C-u>action FindInPath<CR>
nnoremap gr :<C-u>action RecentFiles<CR>
nnoremap gh :<C-u>action Back<CR>
nnoremap gl :<C-u>action Forward<CR>
```

### Toggle Actions
我使用 `t` 加上一个字母作为 Toggle 动作的开始方便记忆。

比如下面的第一条的 `ta`，表示的就是 `Toggle Annotate`，在 IDEA 主编辑区域经常看这行代码是谁提交的，那么会使用右击序号空白处，然后选择 Annotate，这个操作可以简化成直接在 Vim 模式的阅读模式下按下 `ta`。

一些其他的定义可以参考：

```
nnoremap ta :action Annotate<cr>  
nnoremap tb :action ToggleLineBreakpoint<cr>  
nnoremap tm :action ToggleBookmark<cr>  
nnoremap tp :action ActivateProjectToolWindow<CR>
```


### 查看 IDEA 支持的 Action

在安装 IdeaVim 之后，可以在 `normal` 模式下使用如下命令查看 IDE 支持的 action:

	:actionlist [pattern]

如果要搜索对应的 action 可以直接加上模糊词来搜索，比如 `:actionlist declaration` 来搜索相关的内容。

执行 action

	:action {name}

比如执行 `:action Debug`

### 重新命名 Action

在 `~/.ideavimrc` 文件中可以给 Action 其名字，比如

	command! Reformat action ReformatCode

在 action 后面的 `ReformatCode` 是一个合法的 ActionName，通过上面的语句就重新起了一个新的名字叫做 `Reformat`。这样就可以通过 `:Reformat` 来调用。

### 切换标签页

使用空格加 hl 来切换标签页

	nnoremap <space>h gT
	nnoremap <space>l gt

### 编辑器分屏
Vim 的命令 `:e`, `:sp`, `:vsp` 是支持的。

也可以直接使用快捷键 `<C-W>s`, `<C-W>v`, `<C-w>c` 来实现对编辑器的分屏。
    
`<C-W>w` 可以快速在不同的 Panel 之间切换。

我想要达到的效果是和我在终端中使用 Tmux+Vim 类似，使用 Ctrl+h/j/k/l 来进行分屏。

首先要到设置中把可能的快捷键冲突解决，比如 Ctrl+H 原来被我映射成 Find in Path，现在我使用 `gp` (go to path) 作为快捷键触发。

然后将 `，` 作为 Leader 快捷键。

```
" screen management
" Vertical split screen
nnoremap <Leader>\ <C-W>v
nnoremap <Leader>- <C-W>s
nnoremap <C-h> <C-W>h
nnoremap <C-l> <C-W>l
nnoremap <C-j> <C-W>j
nnoremap <C-k> <C-W>k
```

这样就实现了 IDEA 内部的快速分屏。

记得去设置中将 Ctrl + h/j/k/l 的默认快捷键移除，否则可能会有冲突。



更多的配置可以参考我的 [dotfile](https://github.com/einverne/dotfiles/blob/master/idea/.ideavimrc) 配置。

## 两个比较有用的快捷键

- ⌘+F12 ActivateTerminalToolWindow 在 Linux 下设置成 Alt+F12 可以快速调用或隐藏 IDEA 内置的终端
- ⌘+⇧+F12 HideAllWindows 最大化编辑器，隐藏所有其他窗口


### Cmd 组合

- Cmd+a/c/v/x/z
- Cmd+w 关闭当前的文件
- Cmd+e 最近的文件
- Cmd+t Refactor this 重构
- Cmd+n Generate 快速生成模板代码
- Cmd+o File Structure 当前文件的文件结构
- Cmd+b 跳转到定义
- Cmd+[/]

## surround
启用 surround 插件来模拟 [surround](http://einverne.github.io/post/2015/01/vim-plugin-vim-surround.html)

	set surround

## reference

- <https://ikenox.info/blog/getting-started-ideavim/>


[[idea-plugins]]

category: [[IntelliJ IDEA]] [[编程工具]] [[学习笔记]]
