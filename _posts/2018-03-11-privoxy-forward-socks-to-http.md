---
layout: post
title: "privoxy forward socks to http"
tagline: ""
description: ""
category: 
tags: []
last_updated: 
---

Privoxy 是一款不进行网页缓存且自带过滤功能的代理服务器，本文主要使用其 socks 转 http 代理的功能。因为 shadowsocks，v2ray 都是将代理转为本地 socks5 代理，所以如果需要使用 http 代理，就需要借助 Privoxy 。如果只需要在本地启用 http 代理，也可以使用 [proxychains](/post/2017/02/terminal-sock5-proxy.html)。

## 安装及配置

在 Linux 下安装非常简单

    sudo apt install privoxy

默认的配置文件地址在 `/etc/privoxy/config` 目录下。假设本地 1080 端口已经启动（不管是本地 sslocal 还是 v2ray 本地都需要启动）然后要将本地 1080 socks5 代理转成 http 代理，重要的配置只有两行

    # 把本地HTTP流量转发到本地1080 SOCKS5代理
    forward-socks5t / 127.0.0.1:1080 .
    # 可选，默认监听本地连接
    listen-address 127.0.0.1:8118

如果想要将 http 代理非常到局域网中，可以使用 `listen-address 0.0.0.0:8118`。 Privoxy 默认的端口为 8118，可以自行修改。修改完成保存之后使用如下命令启动

    sudo /etc/init.d/privoxy start
    sudo /etc/init.d/privoxy reload   # 不重启服务的情况下重新加载配置

可以在终端进行测试 `export http_proxy=http://127.0.0.1:8118 && curl ip.gs` 应该显示代理的IP地址。如果监听 `0.0.0.0:8118` ，那么局域网中，使用 ip:8118 也能够使用该 HTTP 代理，并且所有的流量都经由 HTTP 转发到 SOCKS5 代理，并走 shadowsocks 或者 v2ray 到墙外。

### 无法启动或启动错误
当启动 `sudo /etc/init.d/privoxy start` 时出现如下错误：

    systemctl status privoxy.service
    ● privoxy.service - Privacy enhancing HTTP Proxy
    Loaded: loaded (/lib/systemd/system/privoxy.service; enabled; vendor preset: enabled)
    Active: failed (Result: exit-code) since Sun 2018-03-11 17:49:40 CST; 4s ago
    Process: 23666 ExecStopPost=/bin/rm -f $PIDFILE (code=exited, status=0/SUCCESS)
    Process: 23668 ExecStart=/usr/sbin/privoxy --pidfile $PIDFILE --user $OWNER $CONFIGFILE (code=exited, status=1/FAILURE)
    Main PID: 21029 (code=exited, status=15)

    Mar 11 17:49:39 VM-145-149-ubuntu systemd[1]: Stopped Privacy enhancing HTTP Proxy.
    Mar 11 17:49:39 VM-145-149-ubuntu systemd[1]: Starting Privacy enhancing HTTP Proxy...
    Mar 11 17:49:40 VM-145-149-ubuntu systemd[1]: privoxy.service: Control process exited, code=exited status=1
    Mar 11 17:49:40 VM-145-149-ubuntu systemd[1]: Failed to start Privacy enhancing HTTP Proxy.
    Mar 11 17:49:40 VM-145-149-ubuntu systemd[1]: privoxy.service: Unit entered failed state.
    Mar 11 17:49:40 VM-145-149-ubuntu systemd[1]: privoxy.service: Failed with result 'exit-code'.
            
绝大部分情况下是配置文件错误，仔细检查 `/etc/privoxy/config` 文件，是否有重复配置，或者输入错误。
