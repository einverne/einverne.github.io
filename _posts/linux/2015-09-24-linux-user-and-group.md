---
layout: post
title: "Linux 学习笔记 User and Group"
tagline: ""
description: "用户及用户组"
category: Linux
tags: [linux, user, group, acl, uid, root, ]
last_updated:
---

Linux 是一个多用户、多任务的操作系统，所以为了运行这样一套系统，必须要有一套用户管理系统。

## User
root 用户是所有类 Unix 系统中的超级管理员，UID 是 0。

### /etc/passwd
类似如下：

	root:x:0:0:root:/root:/bin/bash
	daemon:x:1:1:daemon:/usr/sbin:/bin/sh
	bin:x:2:2:bin:/bin:/bin/sh

7 个部分：

- 账户名称
- 密码，已被移到 `/etc/shadow` 目录中
- UID
		- 0 代表“系统管理员”
		- 1～499 保留系统使用，1～99 保留系统默认帐号，另外 100～499 则保留给服务使用
		- 500～65535 一般用户使用，Linux 2.6.x 已经可以支持 2 的 32 次方减 1 UID
- GID
- 用户信息说明
- home dir
- shell

UID 是不能有冲突的，并且普通用户必须从 1000 开始，即使前面有空缺。

### /etc/shadow
加密的密码

9 个部分：

- 帐号名称
- 密码，加密过，如果为* 或 ! 则表示这个帐号并不会用来登陆
- 最近更改密码日期，1970 年 1 月 1 号作为 1
- 密码不可更改天数
- 密码需要重新更改天数
- 密码更改期限前的警告期限
- 密码过期的宽限时间
- 帐号失效日期
- 保留

### useradd
`useradd` 命令可以用来新增用户

	root@linux ~#  useradd username

可以通过 `id username` 来查看用户的具体资料。

#### /etc/default/useradd
新增用户模板

GROUP=100      #默认用户组
HOME=/home   #默认 Home 目录
INACTIVE=-1     # /etc/shadow 内第 7 栏
EXPIRE=             # /etc/shadow 内第 8 栏
SHELL=/bin/bash #默认 shell
SKEL=/etc/skel   #home 目录内容数据参考

#### /etc/skel/*
新增用户 home 目录参考

### passwd
设置密码，直接 `passwd` 则是修改自己密码

	root@Linux ~# passwd username

### usermod
调整用户帐户信息

比如将用户 einverne 加入 docker 组：

    sudo usermod -aG docker einverne

记住这里的 `-a` 是非常重要的，是 append 附加到最后的意思，如果不加则会把历史的全部清空。

### userdel
删除用户

	root@linux /# userdel [-r] username

`-r` 连同 home 目录一起删除

## Group
为了管理一组用户，Linux 系统中有组概念，通过用户组 GID, 来区别。

### /etc/group
类似

	root:x:0:root
	daemon:x:1:root,bin,daemon
	bin:x:2:root,bin,daemon
	sys:x:3:root,bin,adm

4 部分：

- 用户组名称
- 用户组密码 /etc/gshadow
- GID
- 支持的帐号名称

#### 有效用户组
查看以 einverne 用户身份登录，支持的用户组命令：

	pi@linux / $ groups
	pi adm dialout cdrom sudo audio video plugdev games users netdev gpio i2c spi input

使用命令 `newgrp groupname` 切换有效用户

#### 查看用户在哪些 groups 中

    groups einverne

### /etc/gshadow
类似：

	root:::root

4 个字段：

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

`/etc/sudoers` 文件，建议使用 `visudo` 编辑该文件

格式：用户帐号 登录主机 = （可变换的身份） 可执行的命令

```
用户
einverne ALL = (ALL) ALL
用户组内
%groupname ALL = (ALL) ALL
不需要密码
%groupname ALL = (ALL) NOPASSWD: ALL
```

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

+ 加入 - 除去 = 设置
u user  g group  o others  a all


## 列举当前系统组和用户
通过 Ubuntu 内置的 `compgen` 打印系统中所有的用户及组织。

    compgen -u
    compgen -g

