---
layout: post
title: "使用 asdf-vm 管理编程语言多个版本"
tagline: ""
description: ""
category: 学习笔记
tags: [asdf, linux, mac, pyenv, nvm, ]
last_updated:
---

之前浏览文章的时候偶然看到了 [asdf](https://asdf-vm.com) 这个项目，然后惊讶的发现它整合了我之前经常使用的 [pyenv](/post/2017/04/pyenv.html) 还有不太常用的 jenv, nvm, rvm，通过这一个命令就可以实现，所以立马在机器上试了一下。

## Install
安装的过程具体可以参考官网，这里不多展开，Mac 下可以使用 Homebrew, 不过个人还是偏好使用 git clone 安装：

	git clone https://github.com/asdf-vm/asdf.git ~/.asdf

然后在 `~/.zshrc` 中添加：

	. $HOME/.asdf/asdf.sh

## Plugin
asdf 通过插件的形式可以添加不同语言的支持。支持的所用插件可以在[这里](https://asdf-vm.com/#/plugins-all) 看到。

	asdf plugin add python

安装具体版本：

	asdf list all python
	asdf install python latest
	asdf install python 3.6.1

设置版本

	asdf global python 3.6.1
	asdf shell python 3.6.1
	asdf local python 3.6.1

## 在 sudo 中使用 asdf
使用 asdf 安装的环境都在用户目录下， 如果要在 `sudo` 中使用，则会报错 `sudo: xxx command not found`，因为 sudo 默认不会将用户的环境变量传递过去。如果要在 sudo 中使用，则需要手动指定 PATH：

    sudo -E env "PATH=$PATH" [command] [options]

可以设置一个 alias:

    $ alias mysudo='sudo -E env "PATH=$PATH"'

## reference

- <https://asdf-vm.com/>
- <https://github.com/asdf-vm/asdf/issues/98>