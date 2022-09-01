---
layout: post
title: "每天学习一个命令：ss socket 数据"
aliases: "每天学习一个命令：ss socket 数据"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, socket, ]
last_updated:
---

ss 命令可以用来获取 socket 信息，可以用来显示和 netstat 类似的信息，但 ss 能够显示更多 TCP 和状态的信息，包括 PACKET，TCP，UDP，DCCP，RAW，和 Unix domain sockes 等等。

通过 ss ，可以获取当前机器如何和外界通信非常详细的信息，包括网络连接信息，网络协议，Linux socket 连接状态等等。通过这些信息，可以非常轻松和方便的定位网络问题。当服务器 Socket 连接数量比较大时，netstat 可能就罢工了，这个时候 ss 还是能够应付的，ss 使用了 TCP 协议栈中的 `tcp_diag`，`tcp_diag` 是一个用于分析统计的模块。

## 命令格式

    ss [options] [ FILTER ]

当没有选项使用时，ss 会显示一组已经建立 open non-listening sockets (TCP/UNIX/UDP) 连接的 sockets。

选项

    -h, --help	帮助信息
    -V, --version	程序版本信息
    -n, --numeric	不解析服务名称
    -r, --resolve        解析主机名
    -a, --all	显示所有套接字（sockets）
    -l, --listening	显示监听状态的套接字（sockets）
    -o, --options        显示计时器信息
    -e, --extended       显示详细的套接字（sockets）信息
    -m, --memory         显示套接字（socket）的内存使用情况
    -p, --processes	显示使用套接字（socket）的进程
    -i, --info	显示 TCP 内部信息
    -s, --summary	显示套接字（socket）使用概况
    -4, --ipv4           仅显示 IPv4 的套接字（sockets）
    -6, --ipv6           仅显示 IPv6 的套接字（sockets）
    -0, --packet	        显示 PACKET 套接字（socket）
    -t, --tcp	仅显示 TCP 套接字（sockets）
    -u, --udp	仅显示 UCP 套接字（sockets）
    -d, --dccp	仅显示 DCCP 套接字（sockets）
    -w, --raw	仅显示 RAW 套接字（sockets）
    -x, --unix	仅显示 Unix 套接字（sockets）
    -f, --family=FAMILY  显示 FAMILY 类型的套接字（sockets），FAMILY 可选，支持  unix, inet, inet6, link, netlink
    -A, --query=QUERY, --socket=QUERY
          QUERY := {all|inet|tcp|udp|raw|unix|packet|netlink}[,QUERY]
    -D, --diag=FILE     将原始 TCP 套接字（sockets）信息转储到文件
     -F, --filter=FILE   从文件中都去过滤器信息
           FILTER := [ state TCP-STATE ] [ EXPRESSION ]

## 使用实例

### 显示 TCP 连接，UDP 连接，Unix Sockets

    ss -u -a
    ss -t
    ss -x

### 显示摘要信息

    ss -s

列出当前的 established, closed, orphaned and waiting TCP sockets

### 查看进程使用的 socket

命令

    ss -lp

说明：

- `-l` 参数显示当前正在监听的 socket

在结果中可以过滤出端口占用的进程

    ss -lp | grep 80


## 过滤 TCP 状态
ss 命令能够通过 TCP states 来过滤，状态列表

- established
- syn-sent
- syn-recv
- fin-wait-1
- fin-wait-2
- time-wait
- closed
- close-wait
- last-ack
- listening
- closing

`ss` 命令能够识别的其他状态

- all (all of the above states)
- connected (all the states with the exception of listen and closed)
- synchronized (all of the connected states with the exception of syn-sent)
- bucket (states which are maintained as minisockets, for example time-wait and
- syn-recv)
- big (Opposite to bucket state)

对于 tcp ipv4

    ss -4 state FILTER
    ss -4 state listening

对于 ipv6

    ss -6 state FILTER

显示所有状态为 established 的 SMTP 连接

    ss -o state established '( dport = :smtp or sport = :smtp )'

显示所有状态为 Established 的 HTTP 连接

    ss -o state established '( dport = :http or sport = :http )'

这里一定要注意引号中的写法，该有的空格一定要有。

## 显示特定目的地的连接
ss 另外一个非常便利的功能就是可以查看特定 IP 地址的连接情况，比如想要查看多少连接从 IP 192.168.1.130 连接到本机，则可以

    ss dst 192.168.1.130

对于本地连接同理

    ss src 192.168.1.200
    ss src 192.168.1.200:80
    ss src 192.168.1.200:http
    ss src 192.168.1.200:smtp


## reference

- <http://www.cnblogs.com/peida/archive/2013/03/11/2953420.html>
