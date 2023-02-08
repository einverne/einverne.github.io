---
layout: post
title: "zsh 配置文件解析及优先级"
aliases: 
- "zsh 配置文件解析及优先级"
tagline: ""
description: ""
category: 学习笔记
tags: [ zsh, zsh-config, zshrc, zprofile, bash, ]
last_updated:
---

zsh 的环境变量配置文件有：

- `.zprofile`
- `.zlogin`
- `.zshrc`
- `.zshenv`
- `.zlogout`

对我而言最熟悉的就是 `.zshrc` ，大部分的命令行或者折腾 zsh 的时候总是要很多配置需要放在 `.zshrc` 。所以因此也可以看到 `.zshrc` 就是用来对 Shell 整体做个性化配置的。

- `.zprofile` 和 `.zlogin` 差不多是一样的，他们都会被 login shells 设置环境变量，只是加载时间可能有一些差别。`.zprofile` 是基于 Bash 的 `.bash_profile` ，而 `.zlogin` 则是仿照 CSH 的 `.login` 遗留下来的名字
- `.zshrc` 会设置 interactive shells 的环境变量。它会在 `.zprofile` 之后加载。通常可以设置 `$PATH`, `$PROMPT`, `aliases`, `functions` 等等。
- `.zshenv` 总是会被读取，所以也可以在这里设置环境变量，`$PATH` 或 `$EDITOR` 等，但一般不怎么使用
- `zlogout` 是在一个会话登出的时候被加载，非常适合用来清理临时的配置，比如重置终端窗口的标题

zsh 会在用户登录时(login shell)加载 `~/.zprofile`

zsh 会在开启新的终端会话时加载 `~/.zshrc`

## 总结

需要注意的是首先会加载 `/etc/zshenv` 下的内容， 然后再加载 HOME 目录下的配置文件：

```
.zshenv → [.zprofile if login] → [.zshrc if interactive] → [.zlogin if login] → [.zlogout].
```

## reference

- [Source](https://apple.stackexchange.com/a/388623/149497)
