---
layout: post
title: "搭建临时 socks5 代理"
aliases: "搭建临时 socks5 代理"
tagline: ""
description: ""
category: 经验总结
tags: [linux, socks5, proxy-server, vps, docker]
last_updated: 
dg-home: false
dg-publish: false
create_time: 2021-12-12 04:01:39
last_updated: 2024-03-31 04:18:00
---

这篇文章简要的介绍一下如何在 VPS 快速使用 Docker 安装一个 socks 代理来满足临时需要 socks 代理的情况，适合直接在 VPS 上安装，然后用完立即删除。

然后搭配 Chrome 下的浏览器插件直接实现快速代理。

或者可以搭配 [[proxychains-ng]] 来实现终端下的代理。

## 搭建临时 socks5 代理

```
docker run -d --name socks5 -p 1090:1080 -e PROXY_USER=<USER> -e PROXY_PASSWORD=<PASSWD> --restart=always serjs/go-socks5-proxy
```

docker compose 安装可以参考[这里](https://github.com/einverne/dockerfile)。

说明：

- Docker 映射端口，比如 `1090:1080` 将外部端口 1090 映射到容器内 1080 端口

测试服务是否正常，如果有设置密码：

```
curl -x socks5://[user:password@]proxyhost[:port]/ url
    curl --socks5 --user <PROXY_USER>:<PROXY_PASSWORD> <docker host ip>:1080 http://ifcfg.co
```

如果没有密码：

```
curl --socks5 server.ip:port https://example.com
```

## Proxychains

socks proxy + proxychains-ng

## reference

- <https://hub.docker.com/r/serjs/go-socks5-proxy/>
- [终端下使用 socks5 代理](https://blog.einverne.info/post/2017/02/terminal-sock5-proxy.html)
