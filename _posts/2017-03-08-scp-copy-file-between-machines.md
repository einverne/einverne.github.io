---
layout: post
title: "每天学习一个命令：scp 命令行下远程主机之间拷贝文件"
aliases: "每天学习一个命令：scp 命令行下远程主机之间拷贝文件"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, scp, file, vps, command ]
last_updated:
---

昨天刷 Openwrt，需要在本机和路由器之间传输文件，本来在 Windows 上知道有一个 WinSCP 可以来 GUI 上传输，其实 Linux 下更加简单，使用 scp 命令一行就能解决，scp 的语法也非常简单。

`scp` 是 secure copy 的简写，用于在 Linux 下进行远程拷贝文件的命令，和它类似的命令有 cp，不过 cp 只是在本机进行拷贝不能跨服务器，而且 scp 传输是加密的。可能会稍微影响一下速度。当你服务器硬盘变为只读 read only system 时，用 scp 可以帮你把文件移出来。另外，scp 还不占资源，不会提高多少系统负荷，在这一点上，rsync 就远远不及它。虽然 rsync 比 scp 会快一点，但当小文件众多的情况下，rsync 会导致硬盘 I/O 非常高，而 scp 基本不影响系统正常使用。

## 命令格式

    scp 参数 原路径 目标路径

## 命令功能

scp 是 Linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。Linux 的 scp 命令可以在 Linux 服务器之间复制文件和目录。

## 命令参数

其他的命令参数

    -1  强制 scp 命令使用协议 ssh1
    -2  强制 scp 命令使用协议 ssh2
    -4  强制 scp 命令只使用 IPv4 寻址
    -6  强制 scp 命令只使用 IPv6 寻址
    -B  使用批处理模式（传输过程中不询问传输口令或短语）
    -C  允许压缩。（将 -C 标志传递给 ssh，从而打开压缩功能）
    -p 保留原文件的修改时间，访问时间和访问权限。
    -q  不显示传输进度条。
    -r  递归复制整个目录。
    -v 详细方式显示输出。scp 和 ssh(1) 会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。
    -c cipher  以 cipher 将数据传输进行加密，这个选项将直接传递给 ssh。
    -F ssh_config  指定一个替代的 ssh 配置文件，此参数直接传递给 ssh。
    -i identity_file  从指定文件中读取传输时使用的密钥文件，此参数直接传递给 ssh。
    -l limit  限定用户所能使用的带宽，以 Kbit/s 为单位。
    -o ssh_option  如果习惯于使用 ssh_config(5) 中的参数传递方式，
    -P port  注意是大写的 P, port 是指定数据传输用到的端口号
    -S program  指定加密传输时所使用的程序。此程序必须能够理解 ssh(1) 的选项。

其中 `-r` 和 `-P` 是经常用到的两个选项，一个用来配置传输整个目录，一个用来指定端口

## 使用实例

scp 命令的实际应用

### 从本地复制文件到远程服务器

命令格式：

    scp local_file remote_username@remote_ip:remote_folder    # 文件拷贝到远程目录中

或者

    scp local_file remote_username@remote_ip:remote_file # 拷贝到远程文件，并重命名

或者

    scp local_file remote_ip:remote_folder

或者

    scp local_file remote_ip:remote_file


### 从本地复制整个文件夹到远程服务器
主要使用 `-r` 参数，linux 下很多命令都是 `-r` 来指定文件夹，或者记住 `recursive`。

命令格式：

    scp -r local_folder remote_username@remote_ip:remote_folder

或者

    scp -r local_folder remote_ip:remote_folder


### 从远程服务器复制到本地

从远程复制到本地的 scp 命令与上面的命令类似，只要将从本地复制到远程的命令后面 2 个参数互换顺序就行了。

命令：

    scp root@<remote_ip>:/path/to/file.tar.gz /local/path/


同理，从远程服务器拉取整个文件夹

    scp -r root@<remote_ip>:/path/folder/ /local/folder

### 远程服务器使用非标准端口
如果远程服务器使用非标准端口，那么可以用 `-P port` 选项指定端口。

	scp -P some_port root@ip:/path/to/file /local/

## 外延

- [rsync](/post/2017/07/rsync-introduction.html) 使用。

## reference

