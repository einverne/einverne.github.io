---
layout: post
title: "Go 语言编写的网络穿透工具 chisel"
aliases:
- "Go 语言编写的网络穿透工具 chisel"
tagline: ""
description: ""
category: 经验总结
tags: [chisel, golang, frp, tailscale, zerotier, networking, virtual-networks]
create_time: 2024-03-21 18:25:42
last_updated: 2024-03-21 19:25:42
dg-home: false
dg-publish: false
---

[chisel](https://github.com/jpillora/chisel) 是一个在 HTTP 协议上的 TCP/UDP 隧道，使用 Go 语言编写，10.9 K 星星。

工具采用 HTTP 进行数据传输，将 TCP 和 UDP 封装在 HTTP 隧道中。可以用来做 [[内网穿透工具]]。

chisel 只有一个二进制可执行文件，客户端和服务端都包含在内。

在之前的文章中，介绍过不少内网穿透的工具，比如 [[frp]]，[[nps]]，还有一些已经非常成熟的商业化工具 [[Tailscale]] ，[[ZeroTier]] 等等，感兴趣可以查看历史的文章。

## 作用

chisel 这一类的工具可以有很多种用途，比如常见的端口转发，内网穿透等。

- 也可以用来绕过防火墙，比如通常防火墙会禁用掉一些非常用的 TCP 协议，通过 chisel over HTTP 的特性就可以绕过此防火墙

## 安装

直接通过 GitHub release 获取二进制

或者通过 Docker

```
docker run --rm -it jpillora/chisel --help
```

或者 Go

```
go install github.com/jpillora/chisel@latest
```

macOS 下也可以

```
brew install chisel
```


## 端口转发

比如一台内网的服务器 10.0.0.1 上有一个本地端口 8000 的服务，目前没有暴露给外部访问。如果要在另外一台机器上能访问该服务。可以执行如下的操作。

在这一台服务器上执行 chisel 服务端，暴露 12000 端口

```
./chisel server -p 12000
```

在另外一台服务器 10.0.0.2 上，保证可以访问 10.0.0.1，然后执行

```
./chisel client 10.0.0.1:12000 28000:127.0.0.1:8000
```

这样就将 10.0.0.1 的本地 8000 端口，转发到了 10.0.0.2 机器的 28000 端口，此事在 10.0.0.2 机器上到 28000 的访问，就会通过 chisel 转发到 10.0.0.1 机器的 8000 端口。

比如可以用 Python 直接起一个测试的服务 `python3 -m http.server --bind 127.0.0.1 8000`

## 反向连接

刚刚上面的操作是通过在 10.0.0.2 机器作为 chisel 的 client。

同样也可以将 10.0.0.2 作为 chisel 的 server，比如在 10.0.0.2 服务器上

```
./chisel server -p 12000 --reverse
```

开启 reverse 之后，表示服务器端使用反向模式，流量转发到哪一个端口由 client 端指定。

然后在 10.0.0.1 服务器上执行

```
./chisel client 10.0.0.2:12000 R:28000:127.0.0.1:8000
```

此时 10.0.0.2 机器上也可以通过 28000 端口来访问 10.0.0.1 的 8000 端口。

## socks 代理

除了直接转发 HTTP ，chisel 也可以设置 socks 代理。

比如在服务器中执行

```
./chisel server -p 12000
```

客户端可以

```
./chisel client server_ip:12000 socks
```

这个时候就默认开启了一个 1080 端口的 socks 代理，当然这个端口可以自己设置，结合 Socks 代理工具，或者 [Proxychains](https://einverne.github.io/post/2017/02/terminal-sock5-proxy.html) 等工具就可以直接利用这个 socks。

经过上面的说明，既然 chisel 可以作为 Socks5 代理，那么其实用来作为穿透 GFW 的工具也是可以的

在公网的服务器上

```
chisel server -p 3000 --socks5
```

然后在本地执行

```
chisel client server_ip:3000 socks
```