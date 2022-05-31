---
layout: post
title: "使用 antigen 来管理 zsh 插件"
aliases: "使用 antigen 来管理 zsh 插件"
tagline: ""
description: ""
category: 经验总结
tags: [antigen, zsh, bash, linux, vim, tmux]
last_updated:
---

antigen 是 zsh 的插件管理工具，在他 GitHub 主页上的一句话非常形象的解释了他的功能。

> Antigen is to zsh, what Vundle is to vim.

## 2021 年更新
在过去几年的使用里面 antigen 并没有出现多大的问题，但是随着 antigen 以及 zsh 安装的插件过多，导致每一次打开一个新的终端都会变得很慢，所以我在今年早些的时候切换成了 [zinit](/post/2020/10/use-zinit-to-manage-zsh-plugins.html)。


## 安装

    curl -L git.io/antigen > antigen.zsh

或者

    apt-get install zsh-antigen

或者直接 git clone 该项目，然后指定 antigen.zsh 的位置。

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

更加详细的配置可以参考[我的配置](https://github.com/einverne/dotfiles/blob/master/.zshrc)

## 直接在终端中使用 antigen
在安装 antigen 之后可以直接在命令行输入 `antigen version` 来查看版本。或者使用其他命令来直接安装插件，更新插件等等。

    ➜ antigen version
    apply       -- Load all bundle completions
    bundle      -- Install and load the given plugin
    bundles     -- Bulk define bundles
    cache-gen   -- Generate cache
    cleanup     -- Clean up the clones of repos which are not used by any bundles currently lo
    help        -- Show this message
    init        -- Load Antigen configuration from file
    list        -- List out the currently loaded bundles
    purge       -- Remove a cloned bundle from filesystem
    reset       -- Clears cache
    restore     -- Restore the bundles state as specified in the snapshot
    revert      -- Revert the state of all bundles to how they were before the last antigen up
    selfupdate  -- Update antigen itself
    snapshot    -- Create a snapshot of all the active clones
    theme       -- Switch the prompt theme
    update      -- Update all bundles
    use         -- Load any (supported) zsh pre-packaged framework
    version     -- Display Antigen version



## reference

- <https://github.com/zsh-users/antigen>
