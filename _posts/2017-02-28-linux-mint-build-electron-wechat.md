---
layout: post
title: "Linux Mint 下使用 electron wechat"
tagline: ""
description: ""
category: 经验总结
tags: [wechat, linux, mint, npm, nodejs, node]
last_updated: 
---

在 Ubuntu 下明明非常好用的 `sudo snap install electronic-wechat` 到了 Mint 下竟然就不管用了，出现了如下错误

    cannot perform readlinkat() on the mount namespace file descriptor of the init process: Permission denied

无奈只能寻求另外的方法，手动编译安装果然可以。看 `electronic-wechat` 的 [GitHub](https://github.com/geeeeeeeeek/electronic-wechat) 代码知道该项目使用 [electron](https://github.com/atom/electron)。

[安装 nodejs](/post/2017/10/linux-install-nodejs.html) ，然后安装

    git clone https://github.com/geeeeeeeeek/electronic-wechat.git
    npm install
    npm run build:linux

然后在桌面上右击创建一个图标，名字，执行路径都填写清楚，然后就可以快速启动 electronic wechat 了。

