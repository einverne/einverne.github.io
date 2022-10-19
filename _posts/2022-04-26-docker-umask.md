---
layout: post
title: "每天学习一个命令：umask 命令简单介绍"
aliases: 
- "每天学习一个命令：umask 命令简单介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, umask, permission, ]
last_updated: 2022-04-27 03:00:55
create_time: 2022-04-27 02:25:24
---

在使用 LinuxServer 的 Docker 镜像的时候经常会需要设置 umask 值，这个值的具体作用一直不太清楚，正好整理一下。

## 什么是 umask
在 Linux 或 Unix 操作系统中，所有的新文件都有**默认权限**的。`umask` 命令行允许用户设置文件的 creation mask, 这决定了新创建的文件或目录的权限。

预设的文件夹权限是：

```
0755 drwxr-xr-x
```

预设的文件权限是：

```
0644 -rw-r--r--
```

在 Linux 下创建目录或文件时有一个默认值，这个权限减去 umask 的权限就是新建的目录或文件的实际权限了。

这个配置会被 `mkdir`, `touch`, `tee` 等等一些命令使用。

## Linux 权限模型
在深入了解 umask 之前，首先再来解释一下 Linux 的权限模型。在 Linux 中，每一个文件都三个类别用户组：

- file owner
- Group members
- Everyone else

每一个类别都有三个权限：

- read
- write
- execute

这使用用户可以决定哪些用户允许读、写、执行这个文件。

使用 `ls -l dirname` 来查看：

```
drwxr-xr-x 12 einverne users 4.0K Apr  8 20:51 dirname
|[-][-][-]    [------] [---]
| |  |  |        |       |       
| |  |  |        |       +-----------> Group
| |  |  |        +-------------------> Owner
| |  |  +----------------------------> Others Permissions
| |  +-------------------------------> Group Permissions
| +----------------------------------> Owner Permissions
+------------------------------------> File Type
```

第一个字幕表示文件的类型：

- `d` 表示目录
- `-` 文件
- `l` symbolic link

之后的九位，每三位一组：

- 第一组，是拥有者的权限
- 第二组是组权限
- 第三组是所有人的权限

权限有两种表示方法：

- Symbolic
- Numeric

### Symbolic annotation

字母 `rwx` 分别表示读(read)，写(write)，执行(execute)，而 `-` 表示没有权限。

### Numeric
权限还可以使用数字来表示，r 可以使用 4 来表示, w 是 2，x 是 1。

比如 `rwxr-xr-x` 使用数字表示则是 755.

再回到 umask，在 Linux 系统中，默认的创建文件权限是 666，默认给 user, group, others 读和写的权限。目录的权限是 777。

`umask` 可以用来查看或改变新文件或目录的权限。`umask` 只会影响当前 shell 环境。在大部分的 Linux 发行版中，默认的系统级别的 umask value 一般在 `pam_umask.so` 或者 `/etc/profile` 中。

直接执行 `umask` 来查看输出，在我本机输出是 `002`。

`umask` 值包含了新创建的文件或目录不拥有的权限。

上面提到过，默认的新文件的权限是 `666`，如果 umask 值是 `002` 则，新创建的文件权限就是 `666-002` 结果是 `664`。

用户也可以使用 `umask -S` 来查看 symbolic notation:

```
❯ umask -S
u=rwx,g=rwx,o=rx
```

## 设置 umask
在 `/etc/profile` 中可以设置 umask 值。比如不想要其他用户有任何权限，umask 就要设置为 027.

```
umask 027
```


## reference

- <https://linuxize.com/post/umask-command-in-linux/>