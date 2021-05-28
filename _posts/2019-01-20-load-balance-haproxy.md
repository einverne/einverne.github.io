---
layout: post
title: "开源软负载均衡 HAProxy 使用及配置"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, load-balance, haproxy, proxy, tcp, http, ]
last_updated:
---

HAProxy is free, open source software that provides a high availability load balancer and proxy server for TCP and HTTP-based applications that spreads requests across multiple servers. It is written in C and has a reputation for being fast and efficient.

Features:

- Layer 4 (TCP) and Layer 7 (HTTP) load balancing
- URL rewriting
- Rate limiting
- SSL/TLS termination
- Gzip compression
- Proxy Protocol support
- Health checking
- Connection and HTTP message logging
- HTTP/2
- Multithreading
- Hitless Reloads

Performance:

- <http://www.haproxy.org/10g.html>

Similiar:

- LVS
- Nginx

HAProxy 的负载均衡算法：

- roundrobin，表示简单的轮询
- static-rr，表示根据权重
- leastconn，表示最少连接者先处理
- source，表示根据请求源 IP，和 Nginx IP_hash 类似
- uri，请求 URI
- url_param，请求的 URI 参数
- hdr(name), name 指定的 HTTP 首部
- rdp-cookie(cookie), 根据 cookie(name) 哈希请求


## HAProxy 关键配置 {#haproxy-config}
HAProxy 的配置文件共有 5 个域

- global：用于配置全局参数
- default：用于配置所有 frontend 和 backend 的默认属性
- frontend：用于配置前端服务（即 HAProxy 自身提供的服务）实例
- backend：用于配置后端服务（即 HAProxy 后面接的服务）实例组
- listen：frontend+backend 的组合配置，可以理解成更简洁的配置方法

### 配置举例

HTTP

    global
        daemon
        maxconn 256

    defaults
        mode http
        timeout connect 5000ms
        timeout client 50000ms
        timeout server 50000ms

    frontend http-in
        bind *:80
        default_backend servers

    backend servers
        server server1 127.0.0.1:8000 maxconn 32

### 定义监控
在配置文件中增加

    listen stats    #定义监控页面
        bind *:1080                     # 绑定端口 1080
        mode http                       # http mode
        stats hide-version              # Hide HAProxy version
        stats refresh 30s               # 每 30 秒更新监控数据
        stats uri /stats                # 访问监控页面的 uri
        stats realm HAProxy\ Stats      # 监控页面的认证提示
        stats auth admin:admin          # 监控页面的用户名和密码

然后通过 http://ip:1080/stats 即可访问

## HAProxy 主备
现在个人代理需求不强烈，等折腾到了再搞。

## reference

- <http://www.haproxy.org/>
- <https://cbonte.github.io/haproxy-dconv/>
- <https://cloud.google.com/load-balancing/docs/https/>
