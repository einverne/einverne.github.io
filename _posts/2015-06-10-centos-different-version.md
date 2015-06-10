---
layout: post
title: "CentOS 安装文件区别"
description: "相同Centos版本，不同安装文件区别"
category: wiki
tags: [linux, centos, ]
---

##下载地址

- 官网：http://www.centos.org/
- 下载：http://www.centoscn.com/CentosSoft/iso/
- 阿里云开源镜像站： http://mirrors.aliyun.com/
- 搜狐开源镜像站：http://mirrors.sohu.com/
- 网易开源镜像站：http://mirrors.163.com/

i386是给32位机器使用的，而x86_64适用于64位机器。前者只能使用32位软件，后者可以兼用32位软件，这就是两者区别。如果你的服务器内存超4GB，强烈建议使用64位版本；如果只在虚拟机器里安装学习，那么32位就行了，也就是选择i386版本。如果想做服务器，则建议选64位。

http://mirrors.pubyun.com/centos/6.6/isos/

##版本区别

我们看到共分为LiveCD、LiveDVD、bin-DVD、bin-DVD和netinstall五种，分别作下介绍：

1. BinDVD版：这就是普通安装版，需安装到计算机硬盘才能用，bin版也是最完整的版本，一般都比较大，因为包含了大量的常用软件，安装时无需再在线下载。如果是安装到虚拟机里学习使用的，选它没错。

		DVD1：基本系统+部分软件包。
		DVD2：更多的软件包。

2. LiveDVD版：看名字就知道了，就是光盘安装版。它可以通过光盘启动电脑，启动出CentOS系统，也有图形界面，也有终端。也可以安装到计算机，但是有些内容可能还需要再次到网站下载（自动）。
3. LiveCD版：相比LiveDVD这是个更精简的光盘CentOS系统，体积更小，便于维护使用。
4. minimal版：就是迷你版，精简了更多的东西，针对服务器优化了许多内容。如果是虚拟机学习安装，不推荐用此版本。因为minimal不带一些最基本的软件，有时候用起来比较麻烦，例如minimal连文本编辑器都不带。相比而言，bin版本则带的太多了，装过一次把桌面都带上了，如果作为服务器就不需要这么多功能。
5. netinstall版：顾名思义，网络安装版。除非是逼不得已的情况，不然不推荐。
其实README.txt文件里面（如上图）已经写得比较清楚了，只不过都是英文的，可以看一下。另外，md5sum和sha1sum文件是MD5和SHA1的校验值。ISO文件下载后可以对照一下，以保证文件的原版完整性。

