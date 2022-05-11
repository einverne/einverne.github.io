---
layout: post
title: "使用 Swizzin 从零开始构建自己的 Seedbox"
aliases:
- "使用 Swizzin 从零开始构建自己的 Seedbox"
tagline: ""
description: ""
category: 学习笔记
tags: [ swizzin, seedbox, seed, rtorrent, rutorrent, transmission, syncthing, linux, ubuntu, webmin, bittorrent, torrent ]
last_updated: 2022-02-27 05:20:36
create_time: 2021-12-10 12:45:14
---

[[Swizzin]] 是一个轻量级、模块化的 [[Seedbox]] 解决方案，可以安装在 Debian 9/10 或 Ubuntu 16.04/18.04/20.04 上。QuickBox 的软件包已经被移植过来，包括 Webmin 控制面板。

Swizzin 可以安装如下的组件：

- BT/PT 客户端：qBittorrent, rTorrent/ruTorrent, flood, Transmission, Deluge
- 影音播放：Plex, Emby, ffmpeg
- 资料同步：**rclone**, btsync(resilio sync), syncthing
- 其他影音相关：bazarr, headphones, [[Jackett]], lidarr, quassel, sickchill, [[Sonarr]], subsonic, ombi, 等等
- 资源获取：Couchpotato, rapidleech, sickgear, 等等
- 文件管理：shellinabox, filebrowser, vsftpd, 等等
- 网盘：[[NextCloud]]
- Usenet: nzbget, nzbhydra, 等等
- Linux 桌面环境：X2Go
- 聊天室：ZNC, the Lounge
- Web 服务器：Nginx, LEMP (Webmin), Let's Encrypt

后台界面：

![swizzin dashboard](/assets/swizzin-dashboard-20211006113822.png)

项目地址 GitHub: [https://github.com/swizzin/swizzin](https://github.com/swizzin/swizzin)

### 支持的操作系统

- Debian 9/10
- Ubuntu 16.04/18.04/20.04

### 一键安装脚本

wget

    bash <(wget -qO - git.io/swizzin) && . ~/.bashrc

curl

    bash <(curl -sL git.io/swizzin) && . ~/.bashrc

如果在 Ubuntu 下，以 sudo 来执行上面的安装脚本，需要在命令中包含 `-H` 参数，以确保你的主目录在 sudo 启动时被修改为 /root 。安装程序会自动处理这个问题:

    sudo -H su -c 'bash <(wget -O- -q https://git.io/swizzin-setup)'

更进阶的设置可以参考 [这里](https://swizzin.ltd/guides/advanced-setup) 。

## box 命令

box 有如下子命令：

```
help
install
remove
update
upgrade
adduser
deluser
chpasswd
panel fix-disk
list
test
```

## Swizzin 更改用户名密码
Swizzin 的密码是在执行初始化脚本的时候设定的，可以使用如下命令重置密码：

    sudo box chpasswd your_name

## 更改 rtorrent 默认下载位置

修改 `vi ~/.rtorrent.rc`:

    directory.default.set = /mnt/storage/torrents/rtorrent

重启 rtorrent 服务

    sudo systemctl restart rtorrent@<yourusername>
    sudo systemctl status rtorrent@<yourusername>

## Transdroid/Transdrone 配置
[[Transdroid]] 是一款 Android 上用来管理 BT 客户端的软件，Swizzin 安装的 ruTorrent 需要按照如下方式配置才能连接上。

```
Name: rtorrent (or whatever you like)
Server type: rtorrent
IP or host name: <the hostname of your server>
Username: <your username>
Password: <your password>
Advanced Settings:
    SCGI mount point: /rutorrent/plugins/httprpc/action.php OR /<username>
    Use SSL: ON
```
