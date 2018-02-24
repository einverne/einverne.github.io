---
layout: post
title: "Squid http 代理"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, ubuntu, squid, proxy, webproxy, http, https]
last_updated: 
---

Squid 是一个Web代理软件，可以轻松的实现 HTTP，HTTPS，FTP 代理，通过缓存常用请求，Squid 能够减少带宽使用，提高响应速度。

    sudo apt-get update
    sudo apt-get install squid

Squid 的默认配置文件存放在 `/etc/squid/squid.conf` 下

    sudo vim /etc/squid/squid.conf

Squid 的默认端口是 3128，配置文件中可以 `http_port 3128` 来设置

Squid 默认是不允许任何客户端连接的，通过修改配置允许所有客户端连接

    http_access allow all

修改完成后重启代理服务

    sudo service squid restart


## reference

- 官方网站: <http://www.squid-cache.org/>
