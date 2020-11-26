---
layout: post
title: "配置 Rime 在 Vim 下退出编辑模式时自动切换成英文输入法"
tagline: ""
description: ""
category:
tags: [rime, macos, vim, vim-mode, input-method, ime, obsidian ]
last_updated:
---

半年以前在 Obisidian 的文章下面有人曾经问过我一个问题，如何在 Vim 或者其他使用 Vim 模式的编辑器，比如 IntelliJ，或者 Obisidian 开启 Vim 模式后方便地切换中英文输入法，因为在编辑模式和普通模式下，需要经常切换输入法，使得体验变得非常槽糕。

![rime vim mode auto switch](/assets/rime-vim-mode-auto-switch-english.png)

这个问题一直萦绕再我脑海里，直到今天再整理关于 Rime 相关的笔记的时候发现 macOS 下的 squirrel 支持了一个 `vim_mode` 选项，这使得我们可以在配置中定义在哪些应用中，当我们按下 Esc 的时候将 Rime 自动切换成英文状态。[^1]

[^1]: <https://github.com/rime/squirrel/commit/08ed4f4590e17c969f1536b347bbe1f05737d4aa>

## 配置

在 `squirrel.custom.yaml` 配置文件中可以配置 `vim_mode` 这样的语句。

	org.vim.MacVim:
	  ascii_mode: true
	  no_inline: true
	  vim_mode: true

表示在 MacVim 应用中，当按下 Esc 的时候会自动将 Rime 切换成英文输入法。这样就可以节省 一次切换输入法的麻烦。

所以最后我的配置：

    com.jetbrains.intellij:
      ascii_mode: true
      vim_mode: true
    net.kovidgoyal.kitty:
      ascii_mode: true
      vim_mode: true
    md.obsidian:
      vim_mode: true


## 配置不同的应用自动切换英文

上面的 `vim_mode` 只会对 `Esc` 按键进行响应，那么如果要针对不同的应用进行中英文的自动切换呢？答案上面的配置中也已经有了，通过 `ascii_mode` 来配置，比如我在 Alfred 中及几乎不会使用到中文的，基本上就是模糊打出应用的名字，然后直接回车就启动应用了；再比如在终端或者 IDE 中使用中文的场景也特别少，所以可以直接配置上 `ascii_mode` 当切换到该应用时立即切换成 Rime 下的英文模式。


## 在不同的应用间切换不同的输入法

上面的操作已经可以满足大部分人的需求了，但如果你还想更进一步，比如当我使用 Kakao talk 的时候想要切换成韩语输入法，那么就需要接触 Hammerspoon 了，配置可见我的 [dotfiles](https://github.com/einverne/dotfiles/blob/master/hammerspoon/ime.lua)


