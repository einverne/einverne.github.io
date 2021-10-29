---
layout: post
title: "HAProxy 转发 shadowsocks 流量"
aliases: "HAProxy 转发 shadowsocks 流量"
tagline: ""
description: ""
category: 经验总结
tags: [haproxy, shadowsocks, ss, tcp, load-balancer, proxy-server, proxy, ]
last_updated:
---

HAProxy is free, open source software that provides a high availability load balancer and proxy server for TCP and HTTP-based applications that spreads requests across multiple servers. It is written in C and has a reputation for being fast and efficient.

简单的来说 HAProxy 就是一个负载均衡，TCP 和 HTTP 的代理程序，开源，高可用，C 写成。他原本的作用是将前端的大量流量分发到后端的服务器中，用于负载特别大的 WEB 网站的，这里被大材小用了。

使用 HAProxy 中转 SS 流量至少需要两台 VPS，国内一台，国外一台，SS 客户端直接连国内的 VPS，而通过国内的 VPS 转发流量到国外的 VPS 上。

## 安装

    sudo apt install -y haproxy

## 配置
HAProxy 的配置文件在 `/etc/haproxy/haproxy.cfg` 下：

    global
        ulimit-n  51200

    defaults
        log global
        mode    tcp
        option  dontlognull
            timeout connect 5000
            timeout client  50000
            timeout server  50000

    frontend ss-in
        bind *:8888
        default_backend ss-out

    backend ss-out
		balance roundrobin
        server server1 [VPS-IP]:8888 maxconn 20480
        server server2 [VPS2-IP]:8888 maxconn 20480

主要的配置就是 `frontend` 和 `backend`，也很好理解，将入站的 8888 端口中的流量转发到 VPS 的 8888 端口。然后重启 HAProxy 即可

    sudo /etc/init.d/haproxy restart

启动之后，本地的 SS 客户端直接连国内的 IP 即可，需要注意的是配置用的是 ssserver 的配置。

## 监控页面
配置监控界面监控转发流量：

	listen stats    #定义监控页面 $
		bind *:1080                     #绑定端口 1080$
		mode http                       # http mode$
		stats refresh 30s               #每 30 秒更新监控数据 $
		stats uri /stats                #访问监控页面的 uri$
		stats realm HAProxy\ Stats      #监控页面的认证提示 $
		stats auth username:password    #监控页面的用户名和密码 $


## reference

- <https://github.com/shadowsocks/shadowsocks/wiki/Setup-a-Shadowsocks-relay>
