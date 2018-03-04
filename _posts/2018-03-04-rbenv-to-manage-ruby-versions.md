---
layout: post
title: "使用 rbenv 来管理多个版本 ruby"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, ruby, versions,]
last_updated: 
---

python 的版本管理有 pyenv，同样的 ruby 也有 rbenv，可以和 pyenv 一样在本地管理多个 ruby 版本，很久没有更新本地的 ruby 版本导致了 jekyll 的依赖不支持才想起来这件事情。

## 安装
其项目地址为：

    https://github.com/rbenv/rbenv

因此安装就很方便

    git clone https://github.com/rbenv/rbenv.git ~/.rbenv

然后将下面内容添加到 PATH

    export PATH="$HOME/.rbenv/bin:$PATH"

运行

    ~/.rbenv/bin/rbenv init

根据依赖将输出内容，添加到 `~/.zshrc`

重启shell，或者 `source ~/.zshrc` 使设置生效

再运行检查脚本

    curl -fsSL https://github.com/rbenv/rbenv-installer/raw/master/bin/rbenv-doctor | bash

一切没问题就OK。



`rbenv install` 命令不在 `rbenv` 中，而是在 [ruby-build](https://github.com/rbenv/ruby-build)中，可以通过下面的命令安装

    apt-get install autoconf bison build-essential libssl-dev libyaml-dev libreadline6 libreadline6-dev zlib1g zlib1g-dev
    git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build

如果是 Debian(>=7) 或者 Ubuntu (>=12.10) 也可以使用

    sudo apt-get update
    sudo apt-get install rbenv ruby-build

## 使用

    rbenv install --list       # 查看可用
    rbenv install 2.5.0        # 安装版本

rbenv 中的 Ruby 版本有三个不同的作用域：全局(global)，本地(local)，当前终端(shell)，和 pyenv 类似。

查找版本的优先级是 当前终端 > 本地 > 全局。

    rbenv global 2.1.2
    rbenv local 2.1.2
    rbenv shell 2.1.2

## reference

- <https://gist.github.com/sandyxu/8aceec7e436a6ab9621f>


