---
layout: post
title: "Windows下查看占用端口程序"
description: "Windows下查看占用端口程序"
category: 经验总结
tags: [Windows,]
---

今天启动shadowsocks，突然发现本地1080端口被占用，原本是只要改一下配置中的本地端口即可，但是不想修改Chrome和Proxifier中的配置，所以就找了一下Windows查找下端口占用的方法。

##查看所有端口占用情况

cmd命令行下

	netstat -ano

查看所有端口占用情况

##查看特定端口占用情况

cmd命令行下

	netstat -ano|findstr "1080"

查看特定本地1080端口占用

以上两个命令中最后一列就是PID，程序对应进程ID，知道了进程ID，在任务管理器中杀死该进程即可，而在我的情况下就是NVIDIA的一个进程占用了1080端口，杀死该进程重启shadowsocks即可。

##查看PID对应进程

用以下命令查看PID对应进程

	tasklist|findstr "5376"

查看PID为5376的进程名字，在我重启了shadowsocks之后就显示了以下

	shadowsocks.exe         5376 Console            1     28,020 K

##附录

shadowsocks报错内容

	Error: listen EACCES
