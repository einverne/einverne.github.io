---
layout: post
title: "apt update 相关内容记录"
tagline: ""
description: ""
category: 学习笔记
tags: [apt, ubuntu, linux, package-management, ]
last_updated:
---

我们都知道 Ubuntu 系列的软件仓库可以通过 `/etc/apt/sources.list` 以及 `/etc/apt/sources.list.d/*.list` 来配置。

## sources.list 格式
sources.list 的格式大部分情况下都是

    deb http://site.example.com/debian distribution component1 component2 component3
    deb-src http://site.example.com/debian distribution component1 component2 component3

这几部分可以划分为这几类：

- 包类型 deb ， deb-src
- 仓库地址
- 发行版
- 软件包分类
-

## deb 和 deb-src 区别

- `deb` 表示二进制内容，会使用仓库中的二进制预编译软件包，可以直接通过 apt 来安装
- `deb-src` 表示源代码，在使用 apt 时会根据源代码来进行安装，通常可以使用 `apt source $pacakge` 来下载然后编译

## 仓库地址
在配置中的 url 一般为仓库的地址，世界各地会有不同的镜像，选择一个比较快的镜像即可。

## 发行版
不同版本的系统有着不同的代号，比如 Ubuntu

- Xenial  16.04
- Bionic  18.04

## 软件包分类
跟在发行版之后的就是软件包的具体分类了，可以有一个或多个

### Debian
- main 包含符合 DFSG 指导原则的自由软件包，而且这些软件包不依赖不符合该指导原则的软件包。这些软件包被视为 Debian 发型版的一部分
- contrib 包含符合 DFSG 指导原则的自由软件包，不过这些软件包依赖不在 main 分类中的软件包
- non-free 包含不符合 DFSG 指导原则的非自由软件包

### Ubuntu

- main 官方支持的[[自由软件]]
- restricted 官方支持的非完全自由的软件
- universe 社区维护的自由软件
- multiverse 非自由软件

## apt update 时最前面标识含义
在运行 `apt update` 时会发现在输出的没一行前面会有 GET, HIT 等等字符的出现，这几个字符有着其自身的含义：

- GET 表示在该源中有更新，并且新的内容已经被保存
- HIT 表示已经在该源中有最新的包
- IGN 表示包被忽略，要不然是没有更新，要不然就是该包已经被废弃，如果开发者改变了版本或者更换了仓库密钥也会这样

