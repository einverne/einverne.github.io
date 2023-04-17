---
layout: post
title: "Samba 使用"
tagline: ""
description: ""
category: Linux
tags: [samba, smb, openwrt, linux]
last_updated: 2017-03-10
---

Samba，是种用来让 UNIX 系列的操作系统与微软 Windows 操作系统的 SMB/CIFS（Server Message Block/Common Internet File System）网络协议做链接的自由软件。[^1] Samba 能够为选定的 Unix 目录（包括所有子目录）创建网络共享。该功能使得 Windows 用户可以像访问普通 Windows 下的文件夹那样来通过网络访问这些 Unix 目录。

samba 有两个守护进程，smbd 和 nmbd，是 samba 的核心进程。nmbd 进程允许其他计算机浏览 Linux 服务器，smbd 进程在 SMB 服务请求到达时进行处理，并对共享的资源进行协调。

## 安装 {#install}

    sudo apt install samba

## 命令 {#command}

### smbd

启用 smb

	sudo service smbd start

Samba 进程，使用 `-D` 参数开启守护进程。

或者

	sudo /etc/init.d/samba start

### smbpasswd

smbpasswd 命令属于 samba ，能够实现添加或删除 samba 用户和为用户修改密码。

语法

	smbpasswd [option] [username]

smbpasswd（选项）（参数）
选项

    -a：向 smbpasswd 文件中添加用户；
    -c：指定 samba 的配置文件；
    -x：从 smbpasswd 文件中删除用户；
    -d：在 smbpasswd 文件中禁用指定的用户；
    -e：在 smbpasswd 文件中激活指定的用户；
    -n：将指定的用户的密码置空。


用户名：指定要修改 SMB 密码的用户。

添加用户

首先在 `/etc/passwd` 中添加一条，按照此格式：用户名：密码：uid:gid: 用户描述：主目录：登陆 shell

	einverne:*:1000:65534:einverne:/var:/bin/false

然后添加 Samba 用户：

	smbpasswd -a einverne

修改用户密码

	smbpasswd einverne

## 配置 {#config}

Samba 的配置文件地址在 `/etc/samba/smb.conf`

    [global]
        netbios name = OpenWrt
        display charset = UTF-8
        interfaces = 127.0.0.1/8 lo 192.168.1.1/24 ipv6 address/60 br-lan
        server string = OpenWrt Samba Server        # 服务器说明，显示了 samba 版本信息，可自定义
        unix charset = UTF-8
        workgroup = WORKGROUP	# Windows 默认
        host allow =                                # 可以把 ip 写全或只写前几位，表示允许访问服务端的客户端，与 hosts deny 刚好相反
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
        log file = /var/log/samba/%m.log            # 日志文件位置
        max log size = 50                           # 文件大小设置，单位是 M
        map to guest = Bad User
        max protocol = SMB2
        min receivefile size = 16384
        null passwords = yes
        obey pam restrictions = yes
        os level = 65
        passdb backend = smbpasswd                  # 用户名密码存放方式
        preferred master = yes
        printable = no
        security = user                             # 设置 samba 的安全等级
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

    [Home]
        path = /home/user			# 目录
        browseable  = no
        writable = yes              # 是否可写
        valid users = %S            # 具有合法登陆身份的用户登陆时，家目录变为自己的家目录

	# 创建了一个 Share 名为 OpenWrt
    [OpenWrt]
        path = /mnt/sda1			# 目录
        valid users = root			# 允许 root 读写操作
        read only = no				# 允许写
        guest ok = no				# 不允许匿名
        create mask = 0777			# 新文件权限
        directory mask = 0777		# 新文件夹权限

    [public]                        # 公共目录访问
        comment = Public Stuff      # 注释
        path = /home/samba
        public = yes
        writable = yes
        write list =+staff          # 该目录除了 staff 的组员拥有读写权限外，其他用户仅可读

Samba 安全等级可选值有 4 种

- user   由提供服务的 samba 服务器负责检查账户及密码（默认）
- share  无需共享密码，任何人都可以访问 samba 资源
- server 该级别下，身份验证由 windows 主机或者 samba 负责
- domain 身份验证由另一台 windows 主机负责

用户名密码存放方式设置可选值有 3，默认为 tdbsam，位置 `/var/lib/samba/private/passwd.tdb`

- smbpasswd 使用 /etc/samba/smbpasswd 给系统用户设置 samba 密码，这种方式，用户必须为系统用户
- tdbsam    使用数据库文件 passdb.tdb，可用 smbpasswd -a 创建 samba 用户，也可用 pdbedit 创建
- ldapsam   使用 ldap 方式验证用户

其中如果选择使用 tdbsam 那么用户管理可以使用如下方法

    pdbedit -a username              新建 samba 账户
    pdbedit -x username              删除 samba 账户
    pdbedit -L                               列出 samba 用户列表，读取 passdb.tdb
    pdbedit -Lv                             列出 samba 用户列表详细信息
    pdbedit -c “[D]” -u username  暂停该 samba 用户账号
    pdbedit -c “[]” -u username     恢复该 samba 用户账号

### 配置参数只读配置

正如上面提到的，创建一个新的名为 Openwrt 的共享，需要有些配置，有些配置看名字就能够看出，但是有一些有些复杂。

如果想要创建一个只读的，任何人都可以访问的分享：

    [Share]
        path = /media/movie
        comment = this is folder sync from bt
        read only = yes
        guest ok = yes
        create mask = 0777			# 新文件权限
        directory mask = 0777		# 新文件夹权限

参数：

- create mode – 这个配置定义新创建文件的属性。Samba 在新建文件时，会把 dos 文件的权限映射成对应的 unix 权限，在映射后所得的权限，会与这个参数所定义的值进行与操作。然后再和下面的 force create mode 进行或操作，这样就得到最终 linux 下的文件权限。
- force create mode – 见上面的描述。相当于此参数所设置的权限位一定会出现在文件属性中。
- directory mode – 这个配置与 create mode 参数类似，只是它是应用在新创建的目录上。Samba 在新建目录时，会把 dos–>linux 映射后的文件属性，与此参数所定义的值相与，再和 force directory mode 相或，然后按这个值去设置目录属性。
- force directory mode – 见上面的描述。相当于此参数中所设置的权限位一定会出现在目录的属性中。
- 说明一点，上面的 create mode 和 create mask 参数是同义词，用哪个都可以；而 directory mode 和 directory mask 参数是相同的。

### 用户名密码共享
公共的共享可能会有安全问题，所以可以通过用户名密码来管理权限。如果要创建一个用户名密码访问的共享，配置

    [PasswordShare]
        path = /home/samba
        writable = yes          # 是否可写
        public = yes            # 是否公开
        browseable = yes        # 是否允许在工作组
        create mode = 0655
        directory mode = 0755   # 设置不同的用户登陆后创建的文件和文件夹权限
        valid users = user,user1,@share    # 允许访问该共享的用户名（多个用户或者组中间用逗号隔开，组用“@组名”表示）

若希望每个人创建的内容都可以被其他人修改，则设置为 0770, 若希望每个人创建的内容只能被自己修改，分别设置 create 为 0655 和 directory 为 0755

    useradd user
    useradd user1
    groupadd share
    usermod -aG share user
    usermod -aG share user1
    mkdir /home/samba
    chmod 777 /home/samba
    chgrp share /home/samba
    echo "example" >  /home/samba/file1.txt
    smbpasswd -a user
    smbpasswd -a user1

## 客户端
客户端验证 Linux 访问 samba：

    smbclient -L 192.168.2.200/publicshare  -u user     # 密码是自己设置的密码，查看共享内容
    smbclient //192.168.2.200/publicshare -U user       # 密码是自己设置的密码，ls 可看到共享的详细内容

客户端挂载命令为（客户端需安装 cifs-utils)

    mount -t cifs -o username=einverne,password=xxxxx //192.168.2.200/publicshare /home/samba

## reference

- <https://www.samba.org/samba/docs/man/manpages-3/smb.conf.5.html>
- <http://man.linuxde.net/smbpasswd>
- <https://wiki.openwrt.org/doc/uci/samba>
- <https://www.samba.org/samba/docs/man/manpages-3/smb.conf.5.html>
- <https://gist.github.com/lanceliao/b21cc1b54236c6eadfbb>

[^1]: <https://zh.wikipedia.org/wiki/Samba>
