---
layout: post
title: "使用 dotbot 管理 dotfiles 配置文件"
aliases: "使用 dotbot 管理 dotfiles 配置文件"
tagline: ""
description: ""
category: 经验总结
tags: [dotfiles, config, mac, linux, vim, zsh,]
last_updated: 2022-05-26 09:20:44
create_time: 2020-08-15 08:15:33
---

一直都使用手动的方式来管理 `dotfiles`，之前一方面是学习，一方面是熟悉整个配置，但随着配置文件的不断增多，管理便成为了一个问题。今天本来是在看 Karabiner 的配置，然后找到了一些参考，发现 [narze](https://github.com/narze/) 使用 `dotbot` 来管理其配置。便顺手也把我的 [dotfiles](https://github.com/einverne/dotfiles) 改了一下。

`dotbot` 的原理非常简单，就是将配置文件软链接到特定的位置，使得 Vim，Tmux, zsh 之类可以直接使用。然后 `dotbot` 使用 YAML 定义的一套配置格式将整个过程简化。使得最后可以直接运行 `git clone git@github.com:einverne/dotfiles.git && cd dotfiles && make bootstrap` 一键完成初始化。

## 使用 {#Usage}
最基本的使用方法，参考[说明](https://github.com/anishathalye/dotbot#getting-started):

```
cd ~/.dotfiles # replace with the path to your dotfiles
git init # initialize repository if needed
git submodule add https://github.com/anishathalye/dotbot
git config -f .gitmodules submodule.dotbot.ignore dirty # ignore dirty commits in the submodule
cp dotbot/tools/git-submodule/install .
touch install.conf.yaml
```

将其加入为作为 submodule 然后添加一个配置 `install.conf.yaml` 即可。

### 更新
更新子 module:

```
git submodule update --remote 
```


## Configuration

dotbot 的配置文件是 `yaml` 格式，非常易读。这是官网给的一个例子：

```
- defaults:
    link:
      relink: true

- clean: ['~']

- link:
    ~/.tmux.conf: tmux.conf
    ~/.vim: vim
    ~/.vimrc: vimrc

- create:
    - ~/downloads
    - ~/.vim/undo-history

- shell:
  - [git submodule update --init --recursive, Installing submodules]
```

目前 `Dotbot` 定义了一系常用的动作，比如 link, create, shell, clean 等等。

### defaults
defaults 定义了默认的行为。

### link

link 命令定义了文件或文件夹如何 symbolically linked。

### create

create 命令定义了回去创建这些目录。

### shell
Shell 命令则会指定需要运行的命令。

### clean
clean 命令会去检查目录下的连接，如果发现连接已经无效则会移除这些连接。


## reference

- <https://github.com/anishathalye/dotbot>
