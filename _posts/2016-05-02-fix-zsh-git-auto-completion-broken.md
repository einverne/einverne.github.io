---
layout: post
title: "修复 zsh 下 git 自动提示失败"
tagline: ""
description: ""
category: 经验总结
tags: [zsh, git, auto-completion, hub, ]
last_updated:
---

前些天不知道调整了什么设置，可能是因为更新了 [dotfiles](https://github.com/einverne/dotfiles) 的缘故，突然 git 自动补充就失效了，然而其他命令的自动补充都是非常完美的。搜寻了一番有人说删除根目录下 `~/.zcompdump*` 就行了，但是我尝试无效，重启也无效，就觉得可能哪里的配置有了冲突。

后来发现可能是我本地安装了 [hub](/post/2018/10/use-hub-command-to-interact-with-github.html) 命令，zsh 自动填充可能会需要到 completions 目录中找一些索引，所以

- `mkdir -p ~/.zsh/completions`
- 然后将 hub 的自动填充复制一份到该目录

然后在 `~/.zshrc` 文件中

    fpath=(~/.zsh/completions $fpath)
    autoload -U compinit && compinit

重新打开 zsh，或者 source 一下，在使用 git + Tab 看看效果即可。

## reference

- <https://stackoverflow.com/a/52167900/1820217>
