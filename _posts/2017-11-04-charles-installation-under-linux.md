---
layout: post
title: "在 Linux 下安装 Charles"
tagline: ""
description: ""
category: 经验总结
tags: [linux, charles, http, mitmproxy, https, android, ios, tcp,]
last_updated: 
---

Charles 是Mac上一款非常流行的[抓包软件](/post/2016/11/android-http-proxy-debug.html) ， 但其实各大平台上 Charles 都有安装包。这篇文章主要就是讲一下在 Linux 平台上（Debian/Ubuntu) 系上安装 Charles 。

## 使用 APT 源安装
Charles 拥有 APT 源，首先安装 PGP 公钥，当前公开的秘钥为 1AD28806， 他的 fingerprint 为 4BA7 DB85 7B57 0089 7420  96E1 5F16 B97C 1AD2 8806：

    wget -q -O - https://www.charlesproxy.com/packages/apt/PublicKey | sudo apt-key add -
    
或者

    sudo apt-key adv --keyserver pgp.mit.edu --recv-keys 1AD28806

然后添加源

    sudo sh -c 'echo deb https://www.charlesproxy.com/packages/apt/ charles-proxy main > /etc/apt/sources.list.d/charles.list'

最后更新源并安装

    sudo apt-get update && sudo apt-get install charles-proxy

安装完成之后会在 `/usr/bin` 下安装可执行二进制，该源中还包含 beta 版本的 Charles，可以通过包名 `charles-proxy-beta` 来安装。

## 使用文件安装

在官方下载最新的安装包: <https://www.charlesproxy.com/download/latest-release/>

## charles.jar 路径

charles.jar 文件在三大平台上的位置如下：

    Mac: /Applications/Charles.app/Contents/Java/charles.jar
    Windows: C:\Program Files\Charles\lib\charles.jar
    Linux: /usr/lib/charles-proxy/charles.jar
