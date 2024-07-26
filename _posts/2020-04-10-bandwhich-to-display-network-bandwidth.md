---
layout: post
title: "每天学习一个命令：bandwhich 展示带宽使用"
aliases: "每天学习一个命令：bandwhich 展示带宽使用"
tagline: ""
description: ""
category: 经验总结
tags: [ linux, bandwhich, asdf, ]
last_updated:
---

如果你使用我之前推荐过的 [asdf](/post/2020/04/asdf-vm-manage-multiple-language.html)，可以直接通过 asdf 来安装 Rust 以及 bandwhich。

## 安装 {#install}

增加 rust

    asdf plugin-add rust

安装 rust 最新版

    asdf install rust latest

设置全局生效

    asdf global rust 1.51.0

这样你就可以在终端使用 `cargo` 来安装 `bandwhich`:

    cargo install bandwhich

然后将 `bandwhich` 链接到 `/usr/local/bin` 中：

    sudo ln -s /home/einverne/.asdf/installs/rust/1.51.0/bin/bandwhich /usr/local/bin

然后执行：

    sudo bandwhich

## Usage

执行 `bandwhich` 可以在界面中看到当前网络的情况，包括了上传下载的速度，以及建立了网络连接的进程，连接数，上传下载的速度，和远程哪些机器建立了连接等等情况。
