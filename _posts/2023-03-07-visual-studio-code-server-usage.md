---
layout: post
title: "Visual Studio Code Server 搭建：构建一个属于自己的基于网页的开发环境"
aliases:
- "Visual Studio Code Server 搭建：构建一个属于自己的基于网页的开发环境"
tagline: ""
description: ""
category: 学习笔记
tags: [ linux, docker, code-server, nginx ]
create_time: 2023-03-07 15:19:22
last_updated: 2023-03-17 15:19:22
---

Code Server 是一个在 Web 浏览器中运行的开源代码编辑器。它是 Visual Studio Code 的开源版本，可以提供基本的代码编辑、语法高亮、智能感知、自动补全等功能，同时支持多人协作、远程开发等特性。

能够在浏览器运行的集成开发环境通常也被称为 Cloud IDE。

Code Server 可以在本地计算机或云服务器上运行，用户可以通过浏览器访问并使用其中的编辑器功能，不需要在本地安装 Visual Studio Code 等本地编辑器。这样可以方便地进行远程开发、多人协作、快速搭建开发环境等操作。同时，Code Server 也支持自定义插件和扩展，可以满足不同用户的需求。

- <https://github.com/coder/code-server>

## Prerequisites

- 一台运行 Ubuntu 22.04 的服务器，至少有 2 core CPU， 2 GB 内存，拥有 root 权限或者能执行 sudo
- 一个域名
- 我个人是通过 [[HestiaCP]] 面板自带的 Nginx 配置域名转发的，直接使用 Nginx 也是可以的

## 安装

推荐通过 Docker 来安装，我使用的是 LinuxServer 提供的[镜像](https://hub.docker.com/r/linuxserver/code-server) ，转成 `docker-compose.yml` 来使用。

具体见 [docker-compose](https://github.com/einverne/dockerfile)

## 使用

### 配置访问密码

创建 password hashed

```
echo -n "thisismypassword" | npx argon2-cli -e
$argon2i$v=19$m=4096,t=3,p=1$wst5qhbgk2lu1ih4dmuxvg$ls1alrvdiwtvzhwnzcm1dugg+5dto3dt1d5v9xtlws4
```

### 配置 HTTPS

[官方文档](https://github.com/coder/code-server/blob/main/docs/guide.md#using-lets-encrypt-with-nginx) 中已经有了如何使用 [[Nginx]] 和 Let's Encrypt 的相关配置

```
server {
    listen 80;
    listen [::]:80;
    server_name mydomain.com;

    location / {
      proxy_pass http://localhost:8080/;
      proxy_set_header Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection upgrade;
      proxy_set_header Accept-Encoding gzip;
    }
}
```

但是因为我使用的是 [[HestiaCP]]，这个面板自带了一个 Nginx 模板，可以参考我之前的[文章](/post/2023/01/hestiacp-web-template.html) 创建新的 `code-server.tpl` 和 `code-server.stpl` 然后修改相应的配置。

但是我在配置的过程中，访问 Code Server 遇到了如下的问题。

> An unexpected error occurred that requires a reload of this page.
>
> The workbench failed to connect to the server (Error: WebSocket close with status code 1006)

![O7QC](https://photo.einverne.info/images/2023/03/17/O7QC.png)

仔细的看了一下 Nginx 配置，才发现在 HestiaCP 默认的模板中后面有一个多余的配置

```
proxy_hide_header Upgrade;
```

把这个配置注释掉，然后在 HestiaCP 中重新关闭和启用该网站即可生效。

### code server 配置同步

code server 下暂时还没有像 Visual Studio Code 一样内置的同步功能，但是 Shan Khan 的 [Stttings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync&ssr=false#overview) 可以作为一个不错的代替。

## reference

- <https://hub.docker.com/r/linuxserver/code-server>
- <https://forum.hestiacp.com/t/how-to-reverse-proxy-code-server-on-hestia/5811/2>
