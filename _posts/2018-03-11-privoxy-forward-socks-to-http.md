---
layout: post
title: "使用 privoxy 转发 socks 到 http"
tagline: ""
description: ""
category: 经验总结
tags: [linux, proxy, socks, http, proxychains, ]
last_updated:
---

Privoxy 是一款不进行网页缓存且自带过滤功能的代理服务器，本文主要使用其 socks 转 http 代理的功能。Privoxy 也能够过滤网页内容，管理 Cookie，控制访问，去广告、横幅、弹窗等等，因此可以作为广告过滤。

> Privoxy is a non-caching web proxy with advanced filtering capabilities for enhancing privacy, modifying web page data and HTTP headers, controlling access, and removing ads and other obnoxious Internet junk.
> GNU GPLv2 开源

因为 shadowsocks，v2ray 都是将代理转为本地 socks5 代理，所以如果需要使用 http 代理，就需要借助 Privoxy 。如果只需要在本地启用 http 代理，也可以使用 [proxychains](/post/2017/02/terminal-sock5-proxy.html)。

## 安装及配置

在 Linux 下安装非常简单

    sudo apt install privoxy

默认的配置文件地址在 `/etc/privoxy/config` 目录下。假设本地 1080 端口已经启动（不管是本地 sslocal 还是 v2ray 本地都需要启动）然后要将本地 1080 socks5 代理转成 http 代理，重要的配置只有两行

    # 把本地 HTTP 流量转发到本地 1080 SOCKS5 代理
    forward-socks5t / 127.0.0.1:1080 .
    # 可选，默认监听本地连接
    listen-address 127.0.0.1:8118

如果想要将 http 代理非常到局域网中，可以使用 `listen-address 0.0.0.0:8118`。 Privoxy 默认的端口为 8118，可以自行修改。修改完成保存之后使用如下命令启动

    sudo /etc/init.d/privoxy start
    sudo /etc/init.d/privoxy reload   # 不重启服务的情况下重新加载配置

可以在终端进行测试 `export http_proxy=http://127.0.0.1:8118 && curl ip.gs` 应该显示代理的 IP 地址。如果监听 `0.0.0.0:8118` ，那么局域网中，使用 ip:8118 也能够使用该 HTTP 代理，并且所有的流量都经由 HTTP 转发到 SOCKS5 代理，并走 shadowsocks 或者 v2ray 到墙外。

使用浏览器配置 HTTP 代理，然后访问 http://p.p 如果看到 Privoxy 启动成功表示一切 OK。

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

## Privoxy 配置
其核心配置文件在 `/etc/privoxy/config` 文件中，之前配置过转发 socks 流量就在该文件中，不过通常情况下会需要修改另外两类文件：

- action 文件，其中又包括 `match-all.action`，`default.action`，`user.action`
- filter 文件，其中包括 `default.filter`， `user.filter`

`match-all.action`，`default.action`，`default.filter` 建议不要修改， Privoxy 升级时会覆盖掉，自定义内容可以放入 `user.action` 和 `user.filter` 文件中。

action 文件定义 Privoxy 动作，比如

    {+block{禁止访问垃圾百度}}
    .baidu.com

`{+block}` 是一个动作，block 后面的 `{}` 注释，可省略； `.baidu.com` 是上述动作对象，分为两个部分，host 和 path， host 部分支持通配符，path 部分指的是 `/` 后部分网址，支持 [POSIX 1003.2](http://en.wikipedia.org/wiki/Regular_expressions) 正则表达式。更加具体的可以参考[官网文档](http://www.privoxy.org/user-manual/actions-file.html#AF-PATTERNS)。上述配置生效之后 `baidu.com` 的任何请求都会返回 403 。

filter 文件定义过滤响应的规则，比如

    FILTER: replaceText 替换文本
    s|网易|Google|g

`FILTER` 大写表示定义过滤规则， `replaceText` 表示规则名称，后面接注释；第二行定义具体规则，如果使用过 vi 或者 [sed](/post/2015/01/linux-command-sed.html) 工具，那么一定很熟悉这个 `s` 替换命令。

定义了 `user.filter` 过滤规则之后，需要在 `user.action` 文件中应用规则

    {+filter{replaceText}}
    .163.com

这样访问 163.com 网站中任何带有“网易”的字都会被替换为 Google，当然如果网页启用了 HTTPS，那么 Privoxy 也[无能为力](https://www.privoxy.org/faq/misc.html#SSL)。Privoxy 唯一能够对 HTTPS 网站做的就是 block 了。这也就意味着屏蔽 HTTPS 网站页面内广告的能力下降了。

当前 Privoxy 配置的 action 和 filter 文件可以在代理情况下访问 <http://config.privoxy.org/show-status> 这个网址查看到。

### 广告屏蔽
前面也提到过 Privoxy 的广告过滤，不过需要注意的是使用去广告功能可能丢失一定的匿名性 [^refer]。

下载 [user.action](https://siderite.github.io/BlogHostedFiles/Privoxy/user.action) 和 [user.filter](https://siderite.github.io/BlogHostedFiles/Privoxy/user.filter) 两个文件分别替换 `/etc/privoxy/` 目录下的默认文件，重启 Privoxy 。


## reference

- <http://www.privoxy.org/>
- 广告屏蔽 <https://siderite.blogspot.com/2013/05/adblock-easylist-filter-and-action.html>

[^refer]: <https://wiki.archlinux.org/index.php/Privoxy_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)>
