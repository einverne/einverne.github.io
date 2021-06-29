---
layout: post
title: "ssh-copy-id 复制本地公钥命令详解 免密码登录远程主机"
tagline: ""
description: ""
category: 学习笔记
tags: [ssh, password, linux, ssh-copy-id,]
last_updated:
---

## 背景

`ssh-copy-id` 命令可以把本地主机的公钥复制到远程主机的 `authorized_keys` 文件上。`authorized_keys` 文件用来验证 client 。使用 `ssh-copy-id` 命令将本地公钥复制到远程主机之后可以实现免密登录远程主机。

## 简介

`ssh-copy-id` 用来将本地公钥复制到远程主机。如果不传入 -i 参数，`ssh-copy-id` 使用默认 ~/.ssh/identity.pub 作为默认公钥。如果多次运行 `ssh-copy-id` ，**该命令不会检查重复，会在远程主机中多次写入 `authorized_keys`** 。

使用 `ssh-copy-id` 的主要功能就是免密码登录远程主机。成功运行该命令之后，就可以免去密码登录远程主机。

注意本地 `~/.ssh/id_rsa` 的权限，`chmod 400 ~/.ssh/id_rsa` ，该文件包含用于授权的私钥，如果该文件可以被其他用户访问，ssh 会忽略该私钥。

## 语法

    ssh-copy-id [-i [identity_file]] [user@]machine

选项

    -i：指定公钥文件

## 基本使用

把本地的 ssh 公钥文件安装到远程主机对应的账户下：

    ssh-copy-id user@server
    ssh-copy-id -i ~/.ssh/id_rsa.pub user@server

    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys

## 高级使用

Mac OS X 下使用 ssh-copy-id 可以使用[这个](https://github.com/beautifulcode/ssh-copy-id-for-OSX) 脚本。


## 参考

- <http://stackoverflow.com/a/9270753/1820217>

