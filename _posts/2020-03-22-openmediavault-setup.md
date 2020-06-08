---
layout: post
title: "OpenMediaVault 初始化设置"
tagline: ""
description: ""
category: 学习笔记
tags: [openmediavault, nas, operating-system, os, system, linux, open-source,]
last_updated:
---

OpenMediaVault，是一个开源的基于 Debian Linux 的下一代网络附加存储 (NAS) 解决方案。

关于 NAS 系统的选择可以参考[这篇文章](/post/2020/02/nas-operating-system-choice.html).

## 默认用户名和密码
OpenMediaVault 安装后的 Web UI，默认的用户名和密码是：

	admin
	openmediavault

登陆后进行修改。

## ssh 登录
Web UI 的用户名是 admin，但是 SSH 的用户名是 root

## 镜像源
如果安装的时候没有选择国内的镜像源，可以手动进行修改：

	vi /etc/apt/sources.list

然后使用如下配置：

	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free

## omv-extras
安装：

    wget -O - https://github.com/OpenMediaVault-Plugin-Developers/packages/raw/master/install | bash

来自：

- <http://omv-extras.org/>


## docker mirror
Docker 的安装可以在 OpenMediaVault 的 Web UI 上完成，在安装 OMV Extras 后可以直接启用。国内网络环境不好的情况下，一定先替换上面的源再安装。

编辑 `vi /etc/docker/daemon.json`:

注意这里微软提供的 Docker 镜像已经限制只能 Azure 的机器使用了，如果使用 azk8s 会返回 403 错误：

	Error response from daemon: error parsing HTTP 403 response body: invalid character '<' looking for beginning of value: "<html>\r\n<head><title>403 Forbidden</title></head>\r\n<body bgcolor=\"white\">\r\n<center><h1>403 Forbidden</h1></center>\r\n<hr><center>nginx/1.14.0 (Ubuntu)</center>\r\n</body>\r\n</html>\r\n"

自行替换成 aliyun 或者其他国内厂提供的 registry-mirrors 吧！

	{
		"registry-mirrors": [
			"https://registry.azk8s.cn",
			"https://reg-mirror.qiniu.com"
		],
	  "data-root": "/var/lib/docker"
	}

重启：

	/etc/init.d/docker restart

## 开启 sharedfolders
我全新安装的 OpenMediaVault 5.3.4 中，创建共享文件夹，系统不会自动在 sharedfolders 中创建文件夹，查了一下，发现是 OpenMediaVault 在 5.3.3-1 版本中将 sharedfolders 功能给禁用了，官方的[说明](https://github.com/openmediavault/openmediavault/blob/master/deb/openmediavault/debian/changelog#L52) 是可能造成不稳定。不过可以通过如下方法手工开启：

    Disable the '/sharedfolder/<xyz>' feature by default on new
    installations because it makes too much problems.
    It can be enabled by setting the environment variable to
    'OMV_SHAREDFOLDERS_DIR_ENABLED="YES"'. Finally run the command
    'omv-salt stage run prepare' to apply the modified default values
    and 'omv-salt deploy run systemd' to create the unit files.

但是我尝试一下之后发现创建共享文件后，sharedfolder 中依然没有，那我就只能手动 `ln` 了。（注意这里的地址需要换成你自己系统的地址）

	ln -s /srv/dev-disk-by-label-storage/appdata /sharedfolders/appdata
	ln -s /srv/dev-disk-by-label-storage/ruTorrent/ /sharedfolders/ruTorrent

## ruTorrent
Pull 镜像：

	docker pull linuxserver/rutorrent

创建：

```
docker run -d \
  --name=rutorrent \
  -e PUID=1000 \
  -e PGID=100 \
  -p 8080:80 \
  -p 5000:5000 \
  -p 51415:51413 \
  -p 6881:6881/udp \
  -v /sharedfolders/ruTorrent-config:/config \
  -v /sharedfolders/ruTorrent:/downloads \
  --restart unless-stopped \
  linuxserver/rutorrent
```

然后根据 [这里](/post/2020/03/rtorrent-and-rutorrent.html) 的说明改一下主题。

## syncthing

```
docker run -d \
  --name=syncthing \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/London \
  -e UMASK_SET=<022> \
  -p 8384:8384 \
  -p 22000:22000 \
  -p 21027:21027/udp \
  -v </path/to/appdata/config>:/config \
  -v </path/to/data1>:/data1 \
  -v </path/to/data2>:/data2 \
  --restart unless-stopped \
  linuxserver/syncthing
```

## Plex

	docker pull linuxserver/plex
