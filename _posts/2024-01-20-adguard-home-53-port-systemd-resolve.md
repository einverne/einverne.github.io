---
layout: post
title: "AdGuard Home 53 端口占用问题解决"
aliases:
- "AdGuard Home 53 端口占用问题解决"
tagline: ""
description: ""
category: 经验总结
tags: [adguard, adguard-home, dns, adblock, youtube, systemd]
create_time: 2024-02-04 23:16:17
last_updated: 2024-02-04 23:16:17
---

之前写过一篇文章[如何搭建自己的 AdGuard Home 去广告](https://blog.einverne.info/post/2020/05/use-adguard-home-to-block-ads.html)，过去很久了，现在在一台新的 Ubuntu 设备上再次安装 [[AdGuard Home]]，再次记录一下如何解决 53 端口被占用的问题。

## 53 端口的服务

因为 AdGuard Home 要通过 53 端口提供 DNS 解析的功能，但是默认情况下 Ubuntu 的 systemd-resolved 会占用 53 端口来提供本地的 DNS 解析缓存服务。

使用 `sudo lsof -i :53` 或者 netstat 命令查看

![4ZBQ](https://photo.einverne.info/images/2024/02/04/4ZBQ.png)

编辑配置文件

```
sudo vim /etc/systemd/resolved.conf
```

修改文件

```
[Resolve]
DNS=1.1.1.1
#FallbackDNS=
#Domains=
#LLMNR=no
#MulticastDNS=no
#DNSSEC=no
#DNSOverTLS=no
#Cache=yes
DNSStubListener=no
#ReadEtcHosts=yes
```

将其中的 DNS 和 `DNSStubListener` 字段做如上修改。

然后重启服务

```
sudo systemctl restart systemd-resolved.service
```

再次查看 53 端口，没有被占用，之后就可以启动 AdGuard Home 了。

## /etc/resolv.conf 文件和 systemd-resolved 进程的关系

**systemd-resolved** 是 systemd 中提供的一个 DNS 解析器服务。它可以自动管理 /etc/resolv.conf 文件，并提供一些额外的功能，例如：

- **DNS 缓存**: 缓存 DNS 查询结果，以提高解析速度。
- **DNSSEC 支持**: 支持 DNSSEC 安全扩展，以提高 DNS 解析的安全性。
- **多 DNS 服务器**: 支持同时使用多个 DNS 服务器，以提高可靠性。

**systemd-resolved 默认情况下是启用的**。如果启用了 systemd-resolved，它会将 /etc/resolv.conf 文件配置为指向一个符号链接，该符号链接指向 systemd-resolved 管理的 stub-resolv.conf 文件。stub-resolv.conf 文件包含了 systemd-resolved 提供的 DNS 服务器信息。

如果您想要手动配置 /etc/resolv.conf 文件，需要先禁用 systemd-resolved 服务。您可以通过以下命令禁用 systemd-resolved 服务：

```
sudo systemctl disable systemd-resolved
```

禁用 systemd-resolved 服务后，/etc/resolv.conf 文件将不再被自动管理。您可以直接编辑 /etc/resolv.conf 文件，并重启网络服务使更改生效。
