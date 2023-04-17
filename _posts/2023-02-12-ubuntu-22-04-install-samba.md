---
layout: post
title: "在 Ubuntu 22.04 下安装 Samba"
aliases:
- "在 Ubuntu 22.04 下安装 Samba"
tagline: ""
description: ""
category: 经验总结
tags: [ linux, ubuntu, samba ]
create_time: 2023-04-16 21:44:56
last_updated: 2023-04-16 21:44:56
---

[[Samba]] 是一个在 Windows 上共享文件的协议，在 Linux 上也有一个开源的实现，在 Ubuntu 上安装 Samba 之后就可以让 Linux 分享文件到局域网的中，其他设备，比如 Windows，macOS 都可以进行访问。

虽然很早之前也整理过 [samba](/post/2016/12/samba-usage.html) 相关的内容，但是已经过很久了，再更新一下。

## Prerequisites

- Ubuntu Server
- sudo 执行权限
- vi 基础使用

## 安装和配置

```
sudo apt update
sudo apt install samba -y
samba -V
sudo systemctl status smbd
# enable auto start
sudo systemctl enable --now smbd
sudo ufw allow samba
```

设置 Samba 访问用户名和密码。

```
sudo usermod -aG sambashare $USER
sudo smbpasswd -a $USER
```

配置 `smb.conf` 共享文件夹。

```
sudo vi /etc/samba/smb.conf
```

在文件的最后加上：

```
[sharing]
comment = Samba share directory
path = /path/to/sharing
read only = no
writable = yes
browseable = yes
guest ok = no
valid users = username
```

- `comment` 共享的描述
- `path` 共享路径

```
sudo systemctl restart smbd
```

## macOS 连接

在 macOS 的 Finder 中，菜单栏连接，或者使用 `cmd`+`l`

然后输入

```
smb://ip
```

然后输入用户名和密码登录即可。

## Windows 下连接

在文件管理器中，右击，添加网络位置，然后输入：

```
\\ip\shared-folder
```

然后验证用户名和密码。

## reference

- <https://linux.how2shout.com/how-to-install-samba-on-ubuntu-22-04-lts-jammy-linux/>
