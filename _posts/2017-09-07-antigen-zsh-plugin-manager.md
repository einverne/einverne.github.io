---
layout: post
title: "使用 antigen 来管理 zsh 插件"
tagline: ""
description: ""
category: 经验总结
tags: [antigen, zsh, bash, linux, vim, tmux]
last_updated:
---

antigen 是 zsh 的插件管理工具，在他 GitHub 主页上的一句话非常形象的解释了他的功能。

> Antigen is to zsh, what Vundle is to vim.

## 安装

    curl -L git.io/antigen > antigen.zsh

或者

    apt-get install zsh-antigen

## 配置

如果使用过 Vim 的 [Vundle](/post/2015/05/vim-plugin-vundle.html) 对 antigen 的配置应该不陌生。


```
    source /path-to-antigen-clone/antigen.zsh

    # Load the oh-my-zsh's library.
    antigen use oh-my-zsh

    # Bundles from the default repo (robbyrussell's oh-my-zsh).
    antigen bundle git
    antigen bundle heroku
    antigen bundle pip
    antigen bundle lein
    antigen bundle command-not-found

    # Syntax highlighting bundle.
    antigen bundle zsh-users/zsh-syntax-highlighting

    # Load the theme.
    antigen theme robbyrussell

    # Tell antigen that you're done.
    antigen apply
```

使配置生效 `source ~/.zshrc`

可以从这个[页面](https://github.com/unixorn/awesome-zsh-plugins) 查看更多的插件。

## reference

- <https://github.com/zsh-users/antigen>
