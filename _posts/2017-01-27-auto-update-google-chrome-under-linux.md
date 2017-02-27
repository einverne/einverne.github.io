---
layout: post
title: "Linux 下自动更新 Chrome"
tagline: ""
description: "使用 APT 自动更新 Google Chrome"
category: 
tags: [Linux, Chrome, Google, APT,]
last_updated: 
---

最近使用 Gmail 竟然告诉我“即将不支持此版本浏览器”，于是看了一样 Chrome 版本号 ---- v52 , 感觉还很新啊，查了一下发现 Chrome 版本已经更新到了 v56。 但是 Linux 下 Chrome 不会自动更新， chrome://help/ 来查看也不会自动更新。所以搜索了一下，发现 Google 其实维护了自己的 [Linux Repository](https://www.google.com/linuxrepositories/)。

因为我是通过网站下载 GUI 安装的，所以没有自动更新的模块，添加 Chrome 的 source 即可。

## 添加 PPA 源

如果使用 PPA，则可以通过下面的命令，让 apt 每一次检查更新时将 Chrome 的更新带下来。

    $ wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    $ sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
    # 如果是 64 位系统，则使用如下命令
    $ sudo sh -c 'echo "deb [amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

如果已经安装过 Chrome，则使用如下命令更新：

	$ sudo apt update
    $ sudo apt install google-chrome-stable

