---
layout: post
title: "使用 asdf-vm 管理编程语言多个版本"
tagline: ""
description: ""
category: 学习笔记
tags: [asdf, linux, mac, pyenv, nvm, ]
last_updated: 2026-04-08 13:11:05
---

> 更新说明：
>
> 这篇文章最初写于 2020 年。asdf 在 0.16.0 之后已经改为 Go 二进制实现，安装方式和部分命令都发生了变化。新版升级问题可以参考[asdf 升级 0.16.0 问题记录](https://blog.einverne.info/post/2025/02/asdf-upgrade-0-16-0.html)，如果你准备从 asdf 迁移到 mise，可以继续阅读[利用 mise 替换 asdf 的迁移方案](/post/2026/04/migrate-from-asdf-to-mise.html)。

之前浏览文章的时候偶然看到了 [asdf](https://asdf-vm.com) 这个项目，然后惊讶的发现它整合了我之前经常使用的 [pyenv](/post/2017/04/pyenv.html) 还有不太常用的 jenv, nvm, rvm，通过这一个命令就可以实现，所以立马在机器上试了一下。

## Install
安装的过程具体可以参考官网。对于当前版本的 asdf，Mac 下最推荐的方式是使用 Homebrew 安装：

```bash
brew install asdf
```

然后在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
export ASDF_DATA_DIR="$HOME/.asdf"
export PATH="$ASDF_DATA_DIR/shims:$PATH"
```

如果你看到一些老文章还在使用 `git clone https://github.com/asdf-vm/asdf.git ~/.asdf` 再 `source asdf.sh` 的方式，那是早期 Bash 版本 asdf 的安装方法。对于 0.16.0 之后的版本，不再推荐这样安装。

## Plugin
asdf 通过插件的形式可以添加不同语言的支持。支持的所用插件可以在[这里](https://asdf-vm.com/#/plugins-all) 看到。

```bash
asdf plugin add python
```

安装具体版本：

```bash
asdf list all python
asdf install python latest
asdf install python 3.12.9
```

设置版本

```bash
asdf set --home python 3.12.9
asdf set python 3.12.9
```

如果你看的是更早期的教程，可能会看到 `asdf global`、`asdf local` 和 `asdf shell` 这样的写法。对于新版 asdf：

- `asdf global` 和 `asdf local` 已经被 `asdf set` 取代
- `asdf shell` 已经移除
- 升级大版本之后，通常还需要执行一次 `asdf reshim`

## 在 sudo 中使用 asdf
使用 asdf 安装的环境都在用户目录下， 如果要在 `sudo` 中使用，则会报错 `sudo: xxx command not found`，因为 sudo 默认不会将用户的环境变量传递过去。如果要在 sudo 中使用，则需要手动指定 PATH：

```bash
sudo -E env "PATH=$PATH" [command] [options]
```

可以设置一个 alias:

```bash
alias mysudo='sudo -E env "PATH=$PATH"'
```

## reference

- <https://asdf-vm.com/>
- <https://asdf-vm.com/guide/upgrading-to-v0-16.html>
- <https://github.com/asdf-vm/asdf/issues/98>
