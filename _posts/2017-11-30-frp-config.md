---
layout: post
title: "frp 使用笔记"
aliases: "frp 使用笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [frp, ssh, linux, ]
last_updated:
---

 [frp](https://github.com/fatedier/frp) 是 [fatedier](http://blog.fatedier.com/) 的开源项目，frp 是一个高性能的反向代理应用，可以轻松地进行内网穿透，对外网提供服务，支持 TCP, UDP, http, https 等协议类型，并且 web 服务支持根据域名进行路由转发。

frp 用法和 ngrok 相似，但是 frp 比 ngrok 更加优秀。 配置过程很简单，但是也遇到一些问题，所以把过程记录下来。

## frp 作用

- 利用处于内网或防火墙后的机器，对外网环境提供 http 或 https 服务。
- 对于 http, https 服务支持基于域名的虚拟主机，支持自定义域名绑定，使多个域名可以共用一个 80 端口。
- 利用处于内网或防火墙后的机器，对外网环境提供 TCP 和 UDP 服务，例如在家里通过 ssh 访问处于公司内网环境内的主机。

## frp 配置

`frps.ini` 服务端配置：

    [common]
    bind_port = 7000

`frpc.ini` 客户端配置

    [common]
    server_addr = x.x.x.x   # 填写公网服务器 IP 地址
    server_port = 7000

    [ssh-computer-name]
    type = tcp
    local_ip = 127.0.0.1
    local_port = 22
    remote_port = 6000 #配置服务器端口

然后使用 `ssh user@x.x.x.x -p 6000` 或者 `ssh -o Port=6000 user@x.x.x.x` 来连接内网的机器。

再配置完之后可以使用 supervisor 来管理，实现进程死掉后自动重启。

## reference

- <https://github.com/fatedier/frp/blob/master/README_zh.md>
