---
layout: post
title: "A400互联VPS简单测评及使用"
aliases: 
- A400互联VPS简单测评及使用
tagline: ""
description: ""
category: 经验总结
tags: [ vps, linux, docker, network, cn2, miniflux ]
last_updated:
---

昨天心血来潮，看到推送的主机优惠信息中有一条半价的优惠，[A400互联](https://portal.a400.net/aff/JTNBOUMX)(带AFF），查了一下是一家成立不久的国人主机服务提供商，顿时就失去了兴趣，不过后来看到其配置又有点心动。

洛杉矶 [[CN2 线路]]的 VPS:

- 1和1G 30M 带宽, 20G 存储 1T 月流量，36 RMB/三个月
- 1核2G 30M 带宽, 50G 存储 2T 月流量，17 RMB/month
- 2核2G 50M 带宽, 60G 存储 1T 月流量，29 RMB/month
- 2核4G 30M 带宽, 80G 存储 4T 月流量，33.5 RMB/month

都是 KVM 架构的。

随后我又找到两个测试的 IP：

- 洛杉矶CN2 GIA：103.150.215.12
- 香港cn2：45.195.69.36

最后让我订购的原因就是网络，虽然我对网络要求没有那么高，但是我之前的服务器要不就是在美国网络延迟超过 200ms，要不就是内存空间比较小，稍微吃一点资源的应用就没有办法用上。所以综上我就买了一个洛杉矶的 2核4G 配置，网络带宽 30M 我个人也差不多够用了。

因为是国人商家，还是对其抱有一点敬畏，所以重要的数据都不在上面保存，我计划就是用来作为数据中转，以及因为其网络比较满足我的需求，可能用来做一下 [frp 端口映射](/post/2017/11/frp-config.html)。

另外有一些自动化的服务，比如 [Syncthing 文件同步](/post/2019/10/syncthing.html)， RSS 抓取（[Miniflux](/post/2020/02/self-hosted-rss-reader.html)），自动化任务（[Huginn](/post/2019/01/huginn.html)）等等。

同时定时备份一下相关数据，因为 Syncthing 本身就是多节点的，挂掉一个也不会有影响，我只不过用它来提升同步速度；另外 RSS 阅读器我只需要定期备份一下订阅源即可（如果想保留数据的话，把 PostgreSQL 数据库数据也备份一下即可；Huginn 我只需要备份我的 Task 即可，在新的机器上 Docker 其服务导入即可。

## 测评
使用 [teddysun](https://github.com/teddysun/across/blob/master/bench.sh) 的 benchmark 简单的测试一下：

执行：

    wget -qO- bench.sh | bash

结果：

```
----------------------------------------------------------------------
 CPU Model             : Intel(R) Xeon(R) CPU E5-2630L v2 @ 2.40GHz
 CPU Cores             : 2
 CPU Frequency         : 2399.998 MHz
 CPU Cache             : 16384 KB
 Total Disk            : 109.4 GB (2.9 GB Used)
 Total Mem             : 3936 MB (146 MB Used)
 Total Swap            : 0 MB (0 MB Used)
 System uptime         : 0 days, 0 hour 3 min
 Load average          : 0.18, 0.35, 0.17
 OS                    : Ubuntu 20.04.1 LTS
 Arch                  : x86_64 (64 Bit)
 Kernel                : 5.4.0-42-generic
 TCP CC                : cubic
 Virtualization        : KVM
 Organization          : AS35251 Ziyin Lin trading as Netlab
 Location              : Los Angeles / US
 Region                : California
----------------------------------------------------------------------
 I/O Speed(1st run)    : 252 MB/s
 I/O Speed(2nd run)    : 248 MB/s
 I/O Speed(3rd run)    : 243 MB/s
 Average I/O speed     : 247.7 MB/s
----------------------------------------------------------------------
 Node Name        Upload Speed      Download Speed      Latency
 Speedtest.net    28.63 Mbps        27.18 Mbps          134.59 ms
 Shanghai   CT    13.73 Mbps        27.99 Mbps          125.49 ms
 Shanghai   CU    17.36 Mbps        28.36 Mbps          150.00 ms
 Guangzhou  CT    28.58 Mbps        1.33 Mbps           157.69 ms
 Guangzhou  CU    28.62 Mbps        19.46 Mbps          162.23 ms
 Shenzhen   CU    28.61 Mbps        25.36 Mbps          159.82 ms
 Hongkong   CN    27.79 Mbps        28.43 Mbps          253.90 ms
 Singapore  SG    28.59 Mbps        23.48 Mbps          198.68 ms
 Tokyo      JP    28.88 Mbps        15.75 Mbps          121.03 ms
----------------------------------------------------------------------
```

IO 性能一般，好一点的机器通常能到 700 MB/s，甚至超过 1GB/s，网络带宽除了一次广州的下载有点奇怪，还行，可以多跑几次看一下，没有虚标。


## 使用

- [在购买 VPS 之后首先要做的事情](/post/2015/12/things-to-do-after-buying-vps.html)

所有的应用都使用 Docker 安装

- [之前整理的常用的 Docker 镜像和使用方法](https://github.com/einverne/dockerfile)
- [可以自行架设的服务整理](/post/2020/02/self-hosted-services-collection.html)

如果看到这里，你也想购买可以在下单的时候使用优惠码 [0811](https://portal.a400.net/aff/JTNBOUMX)，会立即使用半价。

### nginx-proxy
在执行下的 `docker-compose` 之前需要先创建 `nginx-proxy` 名字的网络。可以参考[这里](https://github.com/einverne/dockerfile/tree/master/nginx-proxy)

    docker network create nginx-proxy

### miniflux
[[miniflux]] 是一款用 Go 写的开源 RSS 阅读器，比较轻量，但是功能都有。

```
version: '3'
services:
  miniflux:
    container_name: miniflux
    image: miniflux/miniflux:latest
    restart: always
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgres://YOUR_USERNAME:YOUR_PASSWORD@db/miniflux?sslmode=disable
      - RUN_MIGRATIONS=1
      - CREATE_ADMIN=1
      - ADMIN_USERNAME=MINIFLUX_USERNAME
      - ADMIN_PASSWORD=MINIFLUX_PASSWORD
      - VIRTUAL_HOST=YOUR_DOMAIN
      - VIRTUAL_PORT=8080
      - LETSENCRYPT_HOST=YOUR_DOMAIN
      - LETSENCRYPT_EMAIL=YOUR_EMAIL
  db:
    image: postgres:latest
    container_name: postgres
    restart: always
    environment:
      - POSTGRES_USER=YOUR_USERNAME
      - POSTGRES_PASSWORD=YOUR_PASSWORD
    volumes:
      - miniflux-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "miniflux"]
      interval: 10s
      start_period: 30s
volumes:
  miniflux-db:

networks:
  default:
    external:
      name: nginx-proxy
```

说明：

- MINIFLUX_USERNAME: miniflux 后台登录域名
- MINIFLUX_PASSWORD: miniflux 后台登录密码
- YOUR_USERNAME: PostgreSQL 数据库用户名
- YOUR_PASSWORD: PostgreSQL 数据库密码
- YOUR_DOMAIN: 子域名/域名
- YOUR_EMAIL: 申请 SSL 证书的邮箱

## 总结
a400 在我过去使用的两个月里面发生了近5次的服务中断问题，幸亏好我把大部分的服务已经迁移到了 [HostHatch](/post/2021/08/hosthatch-vps-review.html) 后买的 VPS 上了。所幸网络延迟略好，拿来做个代理，做一些不需要 99.99% 在线的应用吧。

## reference

- [[VPS 商家合集]]
