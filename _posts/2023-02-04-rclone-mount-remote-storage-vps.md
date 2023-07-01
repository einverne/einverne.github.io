---
layout: post
title: "Rclone 简单使用之挂载存储型 VPS"
aliases:
- "Rclone 简单使用之挂载存储型 VPS"
tagline: ""
description: ""
category: 学习笔记
tags: [ rclone, linux, vps, storage-vps, plex ]
create_time: 2023-02-09 09:40:05
last_updated: 2023-02-09 09:40:05
---

[Rclone](https://rclone.org/) 是一款支持在不同对象存储、网盘间同步、上传、下载数据的命令行工具。

我有一个在欧洲的存储型 VPS，硬盘空间很大，但是网络传输速度不足，想要用日本的一台 VPS 加速一下在 Plex 中播放的速度，就想在日本的 VPS 上挂载这一台存储型 VPS，然后在日本的 VPS 上开启 Plex，加速一下网络使用效率，毕竟服务器和服务器之间的网络要更稳定一些。

支持如下主流的对象存储：

- Google Drive
- Amazon S3
- Openstack Swift / Rackspace cloud files / Memset Memstore
- Dropbox
- Google Cloud Storage
- Amazon Drive
- Microsoft One Drive
- Hubic
- Backblaze B2
- Yandex Disk
- FTP
- The local filesystem

## 安装

官方提供了一键安装脚本。

Linux/macOS

    curl https://rclone.org/install.sh | sudo bash

Beta 版本：

    curl https://rclone.org/install.sh | sudo bash -s beta

### 错误

如果在使用的过程中遇到如下的错误，可以尝试安装 `fuse`

> Fatal error: failed to mount FUSE fs: fusermount: exec: "fusermount": executable file not found in $PATH

在 Debian/Ubuntu 下安装：

    sudo apt install fuse

## 配置

安装完成之后可以通过 rclone 提供的交互式配置选项添加配置，直接运行 `rclone config`，根据提示添加远程访问的配置，比如通过 SFTP 添加远程大存储 VPS，或者添加 OneDrive 或 Google Drive 这样的云端存储。

交互式的配置添加方法非常直观，这里就略过。

## 挂载 mount

当完成远程配置的添加之后就可以使用 `mount` 命令来在本地挂载远程主机的内容。比如在 rclone 的配置中已经添加了一个 `remote_name` 的配置，如果要挂载到本地 `local_path`，就可以通过如下的命令。

```
rclone mount remote_name:/path/to/remote ~/local_path --read-only --transfers 4 --buffer-size 1024M --low-level-retries 200 --dir-cache-time 12h --vfs-read-chunk-size 128M --vfs-read-chunk-size-limit 1G
```

在最初挂载的时候可能会遇到这种问题，这个时候可以在命令行中加入 `-vv` 来输出 DEBUG 日志。

执行 `mount` 命令之后终端会处于等待中，这是正常的。如果在执行中使用了 Ctrl+C 中断了命令，那么本地不再能访问挂载的内容，但是挂载状态并没有结束，需要执行：

```
sudo umount ~/local_path
# 或者
fusermount -qzu ~/local_path
```

rclone 命令有非常多的参数可以调整，更多的使用细节需要插件其[官方文档](https://rclone.org/docs/)

## 后台执行

在 `/etc/init.d/rcloned` 创建如下文件，记住修改其中的 `NAME`, `REMOTE`, `LOCAL` 这三个内容。

```
#!/bin/bash

PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
NAME_BIN="rclone"
### BEGIN INIT INFO
# Provides:          rclone
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start rclone at boot time
# Description:       Enable rclone by daemon.
### END INIT INFO

NAME="remote_name" #Rclone配置时填写的name
REMOTE='/path/to/remote'  #远程文件夹，网盘里的挂载的一个文件夹，留空为整个网盘
LOCAL='/local_path'  #挂载地址，VPS本地挂载目录
LOG="/$HOME/.rclone/rcloned.log"

Green_font_prefix="\033[32m" && Red_font_prefix="\033[31m" && Green_background_prefix="\033[42;37m" && Red_background_prefix="\033[41;37m" && Font_color_suffix="\033[0m"
Info="${Green_font_prefix}[信息]${Font_color_suffix}"
Error="${Red_font_prefix}[错误]${Font_color_suffix}"
RETVAL=0

check_running(){
	PID="$(ps -C $NAME_BIN -o pid= |head -n1 |grep -o '[0-9]\{1,\}')"
	if [[ ! -z ${PID} ]]; then
		return 0
	else
		return 1
	fi
}
do_start(){
	check_running
	if [[ $? -eq 0 ]]; then
		echo -e "${Info} $NAME_BIN (PID ${PID}) 正在运行..." && exit 0
	else
		fusermount -zuq $LOCAL >/dev/null 2>&1
		mkdir -p $LOCAL
		mkdir -p ${LOG%/*}
		sudo /usr/bin/rclone mount -vv $NAME:$REMOTE $LOCAL --copy-links --allow-other --allow-non-empty --umask 000 > "${LOG}" 2>&1 &
		sleep 2s
		check_running
		if [[ $? -eq 0 ]]; then
			echo -e "${Info} $NAME_BIN 启动成功 !"
		else
			echo -e "${Error} $NAME_BIN 启动失败 !"
		fi
	fi
}
do_stop(){
	check_running
	if [[ $? -eq 0 ]]; then
		kill -9 ${PID}
		RETVAL=$?
		if [[ $RETVAL -eq 0 ]]; then
			echo -e "${Info} $NAME_BIN 停止成功 !"
		else
			echo -e "${Error} $NAME_BIN 停止失败 !"
		fi
	else
		echo -e "${Info} $NAME_BIN 未运行"
		RETVAL=1
	fi
	fusermount -zuq $LOCAL >/dev/null 2>&1
}
do_status(){
	check_running
	if [[ $? -eq 0 ]]; then
		echo -e "${Info} $NAME_BIN (PID $(echo ${PID})) 正在运行..."
	else
		echo -e "${Info} $NAME_BIN 未运行 !"
		RETVAL=1
	fi
}
do_restart(){
	do_stop
	sleep 2s
	do_start
}
case "$1" in
	start|stop|restart|status)
	do_$1
	;;
	*)
	echo "使用方法: $0 { start | stop | restart | status }"
	RETVAL=1
	;;
esac
exit $RETVAL
```

授予执行权限，并添加启动：

```
chmod +x /etc/init.d/rcloned
update-rc.d -f rcloned defaults
```

开始挂载

```
/etc/init.d/rcloned start
```

停止挂载

    /etc/init.d/rcloned stop

重新挂载

    /etc/init.d/rcloned restart

查看日志

    tail -f /$HOME/.rclone/rcloned.log

卸载服务：

```
/etc/init.d/rcloned stop
update-rc.d -f rcloned remove
```
