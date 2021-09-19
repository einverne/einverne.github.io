---
layout: post
title: "使用 Netdata Cloud 监控所有的机器"
aliases: 
- 使用 Netdata Cloud 监控所有的机器
tagline: ""
description: ""
category: 经验总结
tags: [ netdata, monitor, netdata-cloud, linux, cpu, memory, bandwidth]
last_updated:
---

很早就开始用 [Netdata](/post/2018/02/netdata.html)，新买来的 VPS 直接一行命令就可以安装，并且提供了一个非常不错的监控后台。但是因为没有办法在一个中心化的地方管理我所有的机器，所以之前都是用一个简单的 [nodequery](https://blog.einverne.info/post/2017/08/nodequery.html) 服务来监控服务器是否在线，CPU、内存、流量使用率，但 nodequery 已经很多年没有更新，而最近去看 Netdata 官网的时候发现其退出了一个 Netdata Cloud 的服务，体验下来确实直接可以代替 nodequery 了。

## 什么是 Netdata Cloud

[[Netdata]] 是一款非常漂亮并且非常强大的监控面板，由于 Netdata 并没有提供验证等等功能，所以一旦启动，所有人都可以通过 IP:19999 来访问监控面板，虽然 Netdata 做了充分的安全检查，后台面板对系统只读，黑客或破坏分子并不能通过监控面板来控制系统，但是有心人还是能够通过面板来看出系统运行的服务，从而进行破坏，所以一般会通过反向代理或放在防火墙后面来规避安全问题，但与此同时带来的管理上的困难。

在之前 Netdata 没有提供 Netdata Cloud 服务之前，需要自己配置防火墙，只允许特定 IP 访问；或者配置反向代理，通过密码进行保护[^1]。现在通过 Netdata Cloud 多了一种完美的解决方案，我们可以将 Netdata 数据添加到 Cloud，然后禁用本地暴露在 19999 端口的面板。

并且通过 Cloud 后台，可以在一个中心化的地方监控到所有机器的状况，并且 Netdata Cloud 还提供了免费的邮件报警服务。

[^1]: <https://learn.netdata.cloud/docs/configure/secure-nodes>

### 安全性

- Netdata 提供了他们的[数据隐私政策](https://learn.netdata.cloud/docs/agent/aclk/#data-privacy)
- 所有的数据在传输过程中都通过 TLS 加密过

## 基础概念
虽然 Netdata Cloud 服务并不复杂，但这里还是要提前把一些概念理清楚一下。

### Node
每一台机器都都相当于一个节点。

### War Rooms
War Rooms 组织节点，提供了跨节点的视图。可以认为 War Rooms 是一系列节点的合集。

几种方式管理 War Rooms：

- 根据服务（Nginx，MySQL，Pulsar 等等），目的（webserver， database, application），地点（服务器真实地址）等等来管理，比如可以根据
- 将整个后端基础架构放到 War Rooms 管理，可以是 Kubernetes cluster, proxies, databases, web servers, brokers 等等


### Spaces
Spaces 是一个高层级的抽象，用来管理团队成员和节点。Spaces 下面会有不同的 War Rooms。这也就意味着通过 Space 可以让成员和节点在一起。

这样也就可以将特定的后台分配给不同的成员。


## 将 Netdata Agent 添加到 Netdata Cloud

使用 docker exec 将已经在运行的节点添加到 Netdata

    docker exec -it netdata netdata-claim.sh -token=TOKEN -rooms=ROOM1,ROOM2 -url=https://app.netdata.cloud

其中：

- TOKEN 需要替换
- ROOM1,ROOM2 替换成自己的

### 禁用本地面板

编辑 `vi /etc/netdata/netdata.conf` 配置文件：

找到 bind to 这样行，修改为：

```
[web]
    bind to = 127.0.0.1 ::1
```

然后重启 `sudo systemctl restart netdata`

对于 Docker 安装的，直接在配置中将 19999 的端口映射移除即可。