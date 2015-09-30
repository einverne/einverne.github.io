---
layout: post
title: "Linux学习笔记 User and Group"
tagline: ""
description: "用户及用户组"
category: Linux
tags: [linux, user, group]
last_updated: 
---

##User

### /etc/passwd
类似如下：

	root:x:0:0:root:/root:/bin/bash
	daemon:x:1:1:daemon:/usr/sbin:/bin/sh
	bin:x:2:2:bin:/bin:/bin/sh

7个部分：

- 账户名称
- 密码，已被移到 `/etc/shadow` 目录中
- UID
    - 0 代表“系统管理员”
    - 1～499 保留系统使用，1～99保留系统默认帐号，另外100～499 则保留给服务使用
    - 500～65535 一般用户使用，Linux 2.6.x 已经可以支持 2 的32次方减1 UID
- GID
- 用户信息说明
- home dir
- shell

### /etc/shadow
加密的密码

9个部分：

- 帐号名称
- 密码，加密过，如果为* 或 ! 则表示这个帐号并不会用来登陆
- 最近更改密码日期，1970年1月1号作为1
- 密码不可更改天数
- 密码需要重新更改天数
- 密码更改期限前的警告期限
- 密码过期的宽限时间
- 帐号失效日期
- 保留

### useradd

	root@linux ~#  useradd username

#### /etc/default/useradd
新增用户模板

GROUP=100      #默认用户组  
HOME=/home   #默认Home目录  
INACTIVE=-1     # /etc/shadow 内第7栏  
EXPIRE=             # /etc/shadow 内第8栏  
SHELL=/bin/bash #默认shell  
SKEL=/etc/skel   #home目录内容数据参考  

#### /etc/skel/*
新增用户home目录参考

### passwd
设置密码，直接 `passwd` 则是修改自己密码

	root@Linux ~# passwd username

### usermod
调整用户帐户信息

### userdel
删除用户

	root@linux /# userdel [-r] username

-r 连同home目录一起删除

##Group

### /etc/group
类似

	root:x:0:root
	daemon:x:1:root,bin,daemon
	bin:x:2:root,bin,daemon
	sys:x:3:root,bin,adm

4部分：

- 用户组名称
- 用户组密码 /etc/gshadow
- GID
- 支持的帐号名称

####有效用户组
查看已einverne用户身份登录，支持的用户组命令：
    
	pi@linux / $ groups
	pi adm dialout cdrom sudo audio video plugdev games users netdev gpio i2c spi input

使用命令 `newgrp groupname` 切换有效用户

### /etc/gshadow
类似：

	root:::root

4个字段：

- 用户组名称
- 密码栏，以 ! 开头表示无法登陆
- 用户组管理员帐号
- 用户组所属帐号

### groupadd
命令：

	root@linux ~# groupadd groupname

### groupmod
调整 group 相关参数

	root@linux ～# groupmod -g 103 -n groupname groupothername

### groupdel
删除用户组

	root@linux ~# groupdel groupname

## su & sudo

/etc/sudoers 文件，建议使用 `visudo` 编辑该文件

格式：用户帐号 登录主机 = （可变换的身份） 可执行的命令

用户  
einverne ALL = (ALL) ALL  
用户组内  
%groupname ALL = (ALL) ALL  
不需要密码   
%groupname ALL = (ALL) NOPASSWD: ALL  

## permission related

### chgrp
change file group

	chgrp users dirname/filename [-R]

### chown [-R] 
chown change file owner

	chown root:root filename

### chmod
change file property, SUID

- number

		r:4
		w:2
		x:1

	chmod [-R] xyz filename/dir

- 符号

+加入 -除去 =设置  
u user  g group  o others  a all


