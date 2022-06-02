---
layout: post
title: "威联通折腾篇二：使用 frp 内网穿透"
aliases: "威联通折腾篇二：使用 frp 内网穿透"
tagline: ""
description: ""
category: 经验总结
tags: [frp, qnap, qnap-tutorial, qnap-usage, qnap]
last_updated:
---

这是 QNAP NAS 折腾第二篇，使用 frp 来从外网访问 NAS。威联通自带的 qlink.to 实在是太慢几乎到了无法使用的地步，用 Zerotier 也依然很慢，所以无奈还是用回了 frp.

之前就写过一篇很简单的 [frp 使用](/post/2017/11/frp-config.html)，不过那是是在 PC 客户端和树莓派上，不过 NAS 就是一个 Linux 嘛，所以也很简单。不过需要注意的是，映射本地 8080 端口，如果需要其他端口，需要相应的添加配置：

    [common]
    server_addr = frp.server.com          # frp 服务端地址，可以为 IP 或者域名
    server_port = 7000                    # 服务端 端口

    [ssh-qnap]
    type = tcp
    local_ip = 127.0.0.1
    local_port = 22                       # qnap 22 端口
    remote_port = 6022                    # 映射到 6022 端口，这样就可以通过 6022 端口来访问 NAS 22 端口
    use_encryption = true
    use_compression = true

    [qnap-web]
    type = tcp
    local_ip = 127.0.0.1
    local_port = 8080                     # 同理 qnap 8080 管理页面
    remote_port = 6080                    # 通过服务端 6080 端口访问 NAS 8080 端口
    use_encryption = true
    use_compression = true

我现在把所有的 frp 配置放到一个 git 项目中配置，所以一般我也很少更新 frp 的二进制，如果你想要使用最新的 frp 二进制可以到 GitHub [页面](https://github.com/fatedier/frp/releases)。
