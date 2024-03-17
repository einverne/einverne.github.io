---
layout: post
title: "我买了一台 Mac mini 以及记录一下 Mac mini 初始化设定"
aliases:
- "我买了一台 Mac mini 以及记录一下 Mac mini 初始化设定"
tagline: ""
description: ""
category: 经验总结
tags: [mac, macos, mac-init, mac-application, mac-app, ]
create_time: 2023-11-12 11:00:19
last_updated: 2023-11-12 11:00:19
---

之前在 [Mercari](https://gtk.pw/mercari) 看到一台二手的 Mac mini M1  16+512，看在便宜的份上（76500 JPY）就买了，正好替换一下当前用的有一点卡顿的 Intel，M1 的芯片完全能够处理我当前的任务，所以借着这篇文章记录一下初始化 Mac mini m1 的过程。

之前看 [[Terraform]] 和 [[Ansible]] 的时候了解到了「文本定义基础设施」，虽然这两个说的是去定义云服务，但是在我本地去设置 Mac mini 的时候，也可以通过类似的方式来定义我需要安装的基本软件，基本配置等等。

因为我的所有的配置文件都以配置文件的方式存放在了 [dotfiles](https://github.com/einverne/dotfiles) 项目中，我所有的服务器配置都使用 Ansible 定义好了，放在另外一个仓库，所以在初始化 Mac mini 的过程中也正好来更新一下 dotfiles 的配置，这样每一次我拿到一台新的电脑只需要执行一下自动化脚本，等跑完就可以完全恢复我的工作环境了。

##  安装必要的软件
因为脚本依赖 Homebrew 所以开始先安装 Homebrew

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

然后有一些基础的工具

```
brew install git vim tmux
```

然后就是 clone 我的项目

```
git clone git@github.com:einverne/dotfiles.git
cd dotfiles
make mac
```

然后根据我的配置自动完成设置。

## 同步我老电脑配置

ssh 配置信息

```
scp -r ~/.ssh einverne@mac-mini-ip:~/
```

配置我的输入法 [Rime](https://rime.im/)

```
scp -r ~/Library/Rime einverne@mac-mini-ip:~/Library
```

最后就是通过 [[Syncthing]] 来完成我的数据同步。

