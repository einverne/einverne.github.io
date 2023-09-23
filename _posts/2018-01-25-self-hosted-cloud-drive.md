---
layout: post
title: "自建网络硬盘 ownCloud"
tagline: ""
description: ""
category: 经验总结
tags: [linux, cloud, drive, owncloud,]
last_updated: 
---

ownCloud 是一个文件分享服务，可以将个人的文件内容，比如文本，图片，音频等等存储到一个中心服务器上，类似于 Dropbox。但是与 Dropbox 不同之处在于 ownCloud 是开源的，任何人都可以检视其源代码并且可以为之贡献代码，这意味着他将文件的控制权交给了个人，敏感的文件任何人都无法查看，但于此同时他也将文件的安全交给了个人管理。

## ownCloud 安装

[[OwnCloud]] 安装之前确保有 `sudo` 权限，并且 ownCloud 需要 

- web 服务器，比如 nginx 或者 Apache
- 数据库 MySQL
- PHP

安装

    apt install nginx mysql-server php7.0 php-bz2 php-curl php-gd php-imagick php-intl php-mbstring php-xml php-zip

更多的安装详细教程可以查看 DigitalOcean 的[教程](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-owncloud-on-ubuntu-16-04)

## Nextcloud

按照[教程](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-nextcloud-on-ubuntu-16-04) 使用 snap 安装。

或者手动[安装](https://docs.nextcloud.com/server/12.0/admin_manual/installation/index.html)

## reference

- <https://owncloud.org/download/>
- <https://www.geckoandfly.com/24024/self-hosted-cloud-storage/>
