---
layout: post
title: "raspberry pi 折腾"
tagline: ""
description: ""
category: 学习笔记
tags: [raspberryPi, linux, ]
last_updated:
---

关于树莓派的装机，配置，系统安装，网络配置等等网上有太多的叫教程，就不在一一介绍。这里主要想要整理一下在折腾过程中遇到的几个问题。一些细节很琐碎，记录下来备忘。我安装的是 Raspberry Pi 官方的系统，也就是 Debian 的衍生系统，所以绝大多数下面的内容在其他 Debian/Ubuntu/Linux Mint 系统上都可以操作。很多内容我在 Mint 下也都已经实现过。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/K1p1Y2" title="raspberry_pi_2"><img src="https://farm5.staticflickr.com/4320/35432584923_44a7da9cd2_z.jpg" width="640" height="461" alt="raspberry_pi_2"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>


## 树莓派的型号

树莓派到今天已经发布了很多代了，当时买的比较早，稍微和新一代比较一下

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/60A2W5" title="ras"><img src="https://farm5.staticflickr.com/4324/36104138831_76643fccff_z.jpg" width="640" height="411" alt="ras"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>


## 安装风扇
一图胜过千言

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/NXNYa7" title="raspberry_pi_fans"><img src="https://farm5.staticflickr.com/4311/35432484473_191cb0a91c_b.jpg" width="670" height="604" alt="raspberry_pi_fans"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

安装完成之后

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/770No3" title="raspberry_pi_fans_install"><img src="https://farm5.staticflickr.com/4327/36238064065_404b91c58e_z.jpg" width="535" height="472" alt="raspberry_pi_fans_install"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## 更改 raspberrypi 网卡名字

	sudo apt-get install raspi-config
	sudo raspi-config

选择 Network -> interface

或者手工编辑 `vim /lib/udev/rules.d/73-usb-net-by-mac.rules`：

	ACTION=="add", SUBSYSTEM=="net", SUBSYSTEMS=="usb", NAME=="", \
	ATTR{address}=="?[014589cd]:*", \
	TEST!="/etc/udev/rules.d/80-net-setup-link.rules", \
	IMPORT{builtin}="net_id", NAME="eth0"

修改其中的 NAME.

## 网卡 DHCP
编辑 `/etc/network/interfaces`:

	auto lo
	iface lo inet loopback

	auto eth0
	allow-hotplug eth0
	iface eth0 inet dhcp

## 无线网卡
查看设备：

	lsusb

扫描可见 SSID：

	sudo iwlist wlan0 scan


### wlan0 HDCP 配置
编辑：

    auto wlan0
    allow-hotplug wlan0
    iface wlan0 inet dhcp         # DHCP 自动分配 IP
    wpa-ssid  yourssid            # 要连接的 wifi 名称
    wpa-psk   yourpassword        # 要连接的 wifi 密码

### wlan0 static ip

	auto wlan0
	allow-hotplug wlan0           # 允许热插拔（非必须配置）
	iface wlan0 inet static       # 采用静态 IP 分配的方式
	address  192.168.2.249      # 为树莓派设置的 ip
	netmask  255.255.255.0        # 子网掩码
	gateway  192.168.2.1        # 网关地址
	wpa-ssid  yourssid            # 要连接的 wifi 名称
	wpa-psk   yourpassword        # 要连接的 wifi 密码

### 配置多个 wlan0 配置
编辑 `/etc/network/interfaces`:

	auto wlan0
	allow-hotplug wlan0
	iface wlan0 inet dhcp
	pre-up wpa_supplicant -B w -D wext -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
	post-down killall -q wpa_supplicant

编辑多个配置文件路径 `/etc/wpa_supplicant/wpa_supplicant.conf`，或者可以用命令生成：

	wpa_passphrase SSID password >> /etc/wpa_passphrase/wpa_passphrase.conf

或者手动编辑该文件：

    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1
    country=CN

    network={
        ssid="xxxx"      # wifi 名称
        psk="xxxx"       # wifi 密码
        key_mgmt=WPA-PSK # 加密方式
    }

    network={
        ssid="xxxx"
        psk="xxxx"
        key_mgmt=WPA-PSK
    }

	network={
		ssid="xxx"
		key_mgmt=NONE  # 加密方式，不加密
	}

	network={
		ssid="xxxx"
		key_mgmt=NONE
		wep_key0="xxxx"  # wep 密码
	}

	network={
		ssid="xxxx"
		psk="xxxx"
		key_mgmt=WPA-PSK
		scan_ssid=1  # 如果你的无线接入点是隐藏的，该配置就是必须的
	}

	network={
		ssid="xxxx"
		psk="xxxx"
		key_mgmt=WPA-PSK
		priority=999  # priority 指连接优先级，数字越大优先级越高（不可以是负数）
	}

启动网卡：

	sudo ifup wlan0
	sudo /etc/init.d/networking restart

查看详情：

	sudo ifconfig -a
	sudo iwconfig

### 使用命令行配置无线网卡

运行：

	sudo wpa_cli

在交互模式下可以使用这些命令：

- status  查看当前无线网卡状态
- help
- quit
- scan_results 扫描
- list_networks 列出网络

再该命令下需要先创建 network, 设置 network SSID, 密码，加密方式，最后再 enable。具体可以 help 查看。

## 更新系统

在安装完成之后可以使用国内的 sources.list 源，比如说 [清华大学的](https://mirror.tuna.tsinghua.edu.cn/help/raspbian/)

编辑 `/etc/apt/sources.list`:

	deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ stretch main non-free contrib
	deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ stretch main non-free contrib

编辑 `/etc/apt/sources.list.d/raspi.list`:

	deb http://mirrors.tuna.tsinghua.edu.cn/raspberrypi/ stretch main ui


然后更新软件包，一般 update 用来同步本地 package 和 源的 package 索引， update 一定要在 upgrade 或者 dist-upgrade 之前。update 只是用来同步 package 的状态，只是相当于检查更新，而需要手动触发更新。

    sudo apt-get update

更新系统， upgrade 用来更新本地安装过的所有 package 的新版本。

	sudo apt-get upgrade

更加智能的更新系统，会用更加智能的方式解决包冲突

	sudo apt-get dist-upgrade

最后更新 kernel 和 firmware:

	sudo rpi-update

## 中文支持

	sudo apt-get instal ttf-wqy-microhei
	sudo apt-get install scim-pinyin
	sudo dpkg-reconfigure locales


## 挂载 NTFS
不同系统有不同的文件系统，在 Windows 下绝大部分的文件系统都是 NTFS，当然我一直在用的移动硬盘也格式化成了 NTFS，那么在 Linux 下挂载 NTFS 格式的磁盘，需要借助 `ntfs-3g` 这个 Package。

[NTFS-3G](http://www.tuxera.com/community/ntfs-3g-download/) 是微软 NTFS 文件系统的一个开源实现，包括读写支持。

使用如下命令安装 NTFS-3G

	sudo apt-get install ntfs-3g

然后使用 `sudo fdisk -l` 来查看当前系统能够识别的磁盘及分区。一般来说额外的硬盘应该会是类似 `/dev/sda1` 这样的标示。

使用 `mount` 命令来挂载 NTFS 磁盘。

	sudo mount -t ntfs-3g /dev/sda1 /media/sda1

mount 命令默认会调用 /sbin/mount.ntfs ，它在安装了 ntfs-3g 之后被符号连接到 /bin/ntfs-3g。 确保本地挂载点文件夹存在，否则自己手工新建 `mkdir -p /media/sda1`。

或者可以直接使用 `ntfs-3g` 命令

	ntfs-3g /dev/sda1 /media/sda1

具体参考： [Arch Linux Wiki](https://wiki.archlinux.org/index.php/NTFS-3G_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

## 外网连接
使用 frp ， 在外网 VPS 上搞一个 server 。



## 共享 Samba
在之前的[文章](/post/2016/12/samba-usage.html) 就曾说到使用 Samba 来在局域网共享文件，搭配 Android 上 ES Explorer，电视盒子基本上可以做到类似家庭共享的作用，所有的一切都看路由器能够不能带动了。这里再说一下基本配置。

使用如下命令安装

	sudo apt-get install samba

修改配置文件 smb.conf

    [Public]
       comment = Public Storage  # 共享文件夹说明
       path = /home/pi/Public # 共享文件夹目录
       read only = no # 不只读
       create mask = 0777 # 创建文件的权限
       directory mask = 0777 # 创建文件夹的权限
       guest ok = yes # guest 访问，无需密码
       browseable = yes # 可见

设置文件夹权限

	sudo chmod -R 777 /home/pi/Public/

重启 Samba 服务

	sudo samba restart

完成后局域网中的其他设备就可以通过，`\\IP\` 来访问共享的内容

## 安装 Resilio Sync
很早之前，我也写过 [Resilio Sync](/post/2016/04/btsync-review.html) 的文章，那个时候还叫 BTSync。在笔记本上一直跑着，这些天我看树莓派负载也不高，跑一个 Resilio Sync 应该也还可以。

不过过程却有点繁复，国内似乎屏蔽了 Resilio Sync 的官网，连他的 Key 都无法下载下来，可以使用 proxychains 代理的方法（可以参考之前的文章），不过毕竟也稍微麻烦一点，不过后来发现，在官网下载一个可运行的 rslsync ，再配置一些 conf 文件就可以直接开跑。

在文件 `/etc/apt/sources.list.d/resilio-sync.list` 中写入：

	deb [arch=armhf] http://linux-packages.resilio.com/resilio-sync/deb resilio-sync non-free

添加公钥

	wget -qO - https://linux-packages.resilio.com/resilio-sync/key.asc | sudo apt-key add -

更新 index

	sudo dpkg --add-architecture armhf
	sudo apt-get update

安装

	sudo apt-get install resilio-sync

安装完之后，如果想要修改 conf 文件，可以去相应的位置 /etc 下找，然后使用树莓派的 IP:8888 来访问 WEB 管理界面。

然后就是添加相应的 KEY 来同步文件了。具体可以参考我之前那篇文章。



<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/7S0j5k" title="raspi_2_b"><img src="https://farm5.staticflickr.com/4307/36197077346_0177e2d14d_b.jpg" width="1024" height="724" alt="raspi_2_b"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>


## reference

- Raspberry Pi 官方源 <http://www.raspbian.org/RaspbianMirrors>
- <https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md>
