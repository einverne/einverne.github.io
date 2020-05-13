---
layout: post
title: "终端的输入历史以及管理"
tagline: ""
description: ""
category: 学习笔记
tags: [terminal, history, clear, command, cli]
last_updated:
---


## 配置终端历史文件地址
bash 会将所有终端的输入历史保存在 `~/.bash_history` 中，同理，zsh 会保存在 `~/.zsh_history` 中。

zsh 使用 `HISTFILE` 变量来管理保存的 `zsh_history` 文件，默认一般保存在 `~/.zsh_history` 中。


## 配置 zsh 中记录的终端历史条数
在 zsh 的配置中：[^c]

[^c]: <https://unix.stackexchange.com/a/273863/115007>

	HISTFILE="$HOME/.zsh_history"
	HISTSIZE=10000000
	SAVEHIST=10000000
	setopt BANG_HIST                 # Treat the '!' character specially during expansion.
	setopt EXTENDED_HISTORY          # Write the history file in the ":start:elapsed;command" format.
	setopt INC_APPEND_HISTORY        # Write to the history file immediately, not when the shell exits.
	setopt SHARE_HISTORY             # Share history between all sessions.
	setopt HIST_EXPIRE_DUPS_FIRST    # Expire duplicate entries first when trimming history.
	setopt HIST_IGNORE_DUPS          # Don't record an entry that was just recorded again.
	setopt HIST_IGNORE_ALL_DUPS      # Delete old recorded entry if new entry is a duplicate.
	setopt HIST_FIND_NO_DUPS         # Do not display a line previously found.
	setopt HIST_IGNORE_SPACE         # Don't record an entry starting with a space.
	setopt HIST_SAVE_NO_DUPS         # Don't write duplicate entries in the history file.
	setopt HIST_REDUCE_BLANKS        # Remove superfluous blanks before recording entry.
	setopt HIST_VERIFY               # Don't execute immediately upon history expansion.
	setopt HIST_BEEP                 # Beep when accessing nonexistent history.


说明：

- `HISTSIZE` 是终端历史中保存的最大行数 [^histsize]
- `SAVEHIST` 是保存在历史文件中的最大行数


[^histsize]: <http://zsh.sourceforge.net/Doc/Release/Parameters.html#index-HISTSIZE>

