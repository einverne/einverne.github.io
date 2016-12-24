---
layout: post
title: "Samba 使用"
tagline: ""
description: ""
category: 经验总结
tags: [Samba, SMB, Openwrt, Linux]
last_updated: 
---


Samba，是种用来让UNIX系列的操作系统与微软Windows操作系统的SMB/CIFS（Server Message Block/Common Internet File System）网络协议做链接的自由软件。[^1] Samba能够为选定的Unix目录（包括所有子目录）创建网络共享。该功能使得Windows用户可以像访问普通Windows下的文件夹那样来通过网络访问这些Unix目录。

## 命令 {#command}


### smbd

启用 smb

	sudo service smbd start


Samba 进程，使用 `-D` 参数开启守护进程。



### smbpasswd

smbpasswd 命令属于 samba ，能够实现添加或删除samba用户和为用户修改密码。

语法

	smbpasswd [option] [username]

smbpasswd(选项)(参数)
选项

    -a：向smbpasswd文件中添加用户；
    -c：指定samba的配置文件；
    -x：从smbpasswd文件中删除用户；
    -d：在smbpasswd文件中禁用指定的用户；
    -e：在smbpasswd文件中激活指定的用户；
    -n：将指定的用户的密码置空。


用户名：指定要修改SMB密码的用户。

添加用户

首先在 `/etc/passwd` 中添加一条，按照此格式：用户名:密码:uid:gid:用户描述:主目录:登陆shell

	einverne:*:1000:65534:einverne:/var:/bin/false

然后添加 Samba 用户：

	smbpasswd -a einverne

修改用户密码

	smbpasswd einverne





## 配置 {#config}

文件地址 `/etc/samba/smb.conf`

    [global]
        netbios name = OpenWrt 
        display charset = UTF-8
        interfaces = 127.0.0.1/8 lo 192.168.1.1/24 ipv6 address/60 br-lan 
        server string = OpenWrt Samba Server
        unix charset = UTF-8
        workgroup = WORKGROUP	# Windows 默认
        browseable = yes
        deadtime = 30		# This is useful to stop a server's resources being exhausted by a large number of inactive connections
        domain master = yes
        encrypt passwords = true
        enable core files = no
        guest account = root
        guest ok = yes
        #invalid users = root
        local master = yes
        load printers = no
        map to guest = Bad User
        max protocol = SMB2
        min receivefile size = 16384
        null passwords = yes
        obey pam restrictions = yes
        os level = 65
        passdb backend = smbpasswd
        preferred master = yes
        printable = no
        security = user
        smb encrypt = disabled
        smb passwd file = /etc/samba/smbpasswd
        socket options = TCP_NODELAY IPTOS_LOWDELAY SO_RCVBUF=40960 SO_SNDBUF=40960
        syslog = 2
        strict allocate=no
        use sendfile = yes
        writeable = yes
        large readwrite = yes
        aio read size = 40960
        aio write size = 40960
        read raw = yes
        write raw = yes

	# 创建了一个 Share 名为 OpenWrt
    [OpenWrt]
        path = /mnt/sda1			# 目录
        valid users = root			# 允许root读写操作
        read only = no				# 允许写
        guest ok = no				# 不允许匿名
        create mask = 7777			# 权限
        directory mask = 7777		# 权限



## reference

- <http://man.linuxde.net/smbpasswd>
- <https://wiki.openwrt.org/doc/uci/samba>
- <https://www.samba.org/samba/docs/man/manpages-3/smb.conf.5.html>
- <https://gist.github.com/lanceliao/b21cc1b54236c6eadfbb>

[^1]: <https://zh.wikipedia.org/wiki/Samba>