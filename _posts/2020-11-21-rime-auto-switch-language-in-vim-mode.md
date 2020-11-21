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
