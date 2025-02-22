---
layout: post
title: "Jigsaw Outline 部署和使用"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, docker, socks, google, vpn,]
last_updated: 
---

Outline 是一个自带服务端客户端的代理软件。

官方主页: <https://getoutline.org/en/home>
项目地址: <https://github.com/Jigsaw-Code>

Outline 细分有三部分，分别是 Outline Manager, Outline Server 和 Outline Client。 

- Outline Manager：方便用户管理所有的 Outline Server，可以使用图形化界面快捷部署 Outline Server ，然后为每一位用户生成连接秘钥，使得用户可以安全连接 Outline Server 。
- Outline Server：用来提供安全代理的服务，响应、验证 Outline Client 的所有请求，仅此而已。
- Outline Client：用来向 Outline Server 发起请求，或接受其返回的数据，仅此而已。

## 部署服务端
在安装 Docker 之后安装

    wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh | bash

在脚本安装结束后会生成一段配置，复制并保存该配置，在客户端配置中需要使用。

## 客户端使用
先下载 Outline Manager，地址

    https://github.com/Jigsaw-Code/outline-releases

下载其中的 Outline-Manager.AppImage ，这是 Linux 下的客户端，不同系统中下载不同客户端。然后在 Manager 中粘贴上面服务端配置，完成 Manager 配置。然后在 Manager 中点击 ADD KEY 生成可用的 KEY。点击分享将生成一个托管在 Amazon S3 上的静态网页，其中有 Shadowsocks 客户端的配置，将该字符串发送给客户端即可。

然后再下载 client 客户端，目前暂时 Jigsaw 还没提供 iOS 和 Mac 版本，但是 Windows 和 Android 客户端可以在 GitHub 和 Play Store [链接](https://play.google.com/store/apps/details?id=org.outline.android.client) 找到。

在手机上输入上面 Manager 生成的 SS 配置即可连接。安装配置过程将 Shadowsocks 的部署配置流程完全简化了。期待Google Jigsaw 能够将这个项目继续维护下去吧。
