---
layout: post
title: "使用 dnsmasq 转发 DNS 请求"
tagline: ""
description: ""
category:
tags: [dns, dnsmasq, domain, network, ]
last_updated:
---

什么是 `dnsmasq`，从官方页面，或者 Wikipedia 上能知道，dnsmasq 可以提供 DNS Forward, 也可以作为 DHCP, 它被设计在低功耗，小内存的路由器，防火墙等小型设备上使用。现在的大部分 Linux 发行版都内置了 dnsmasq 。 dnsmasq 也常常被用来缓存 DNS 请求，用来加速访问过的地址速度。

## Install
Debian/Ubuntu:

    sudo apt install dnsmasq

## DNS
使用 dnsmasq 很大一部分应用场景就是缓存 DNS 解析，dnsmasq 首先会检查 `/etc/hosts` 等本地静态的 hosts 文件，然后使用 `/etc/resolv.conf` 配置的 DNS 服务器地址。

## 配置 {#config}
通常 dnsmasq 的配置文件都在 `/etc/dnsmasq.conf` 文件中，该文件配置详细内容可以参考如下注释。

这里主要配置 dnsmasq 作为 DNS Cache 服务器来使用。
```
# 配置额外的上级 DNS 主机 (nameserver)
# 通常会在定义的文件中配置域名服务器地址 nameserver 127.0.0.53
# 如果访问没有被解析过的域名，那么就会尝试使用文件中定义的地址去解析
resolv-file=/etc/resolv.conf

# 默认情况下 dnsmasq 会发送查询到它的任何上游 Dns 服务器上，如果取消注释，则 dnsmasq 则会严格按照 /etc/resolv.conf 中定义的 Dns Server 顺序进行查询，直到成功为止
# strict-order

# 如果不想 dnsmasq 读取 /etc/resolv.conf 文件获得它的上级 servers。即不使用上级 Dns 主机配置文件 (/etc/resolv.conf 和 resolv-file）可以开启改选项
#no-resolv

# 不允许 dnsmasq 通过轮询 /etc/resolv.conf 或者其他文件来获取配置的改变，则取消注释。
#no-poll
# 向上游所有服务器查询
all-servers
# 启用转发循环检测
dns-loop-detect
# 重启后清空缓存
clear-on-reload
# 完整域名才向上游服务器查询，如果是主机名仅查找 hosts 文件
domain-needed

# 为特定的域名指定解析它专用的 nameserver。一般是内部 Dns name server
# server=/myserver.com/192.168.55.1

# 指定 dnsmasq 默认查询的上游服务器，此处以 Google Public Dns 为例。
server=8.8.8.8
server=8.8.4.4

# 比如把所有.cn 的域名全部通过 114.114.114.114 这台国内 Dns 服务器来解析
server=/cn/114.114.114.114
server=/taobao.com/114.114.114.114
server=/jd.com/114.114.114.114
server=/qq.com/114.114.114.114


# no-hosts, 默认情况下这是注释掉的，dnsmasq 会首先寻找本地的 hosts 文件，再去寻找缓存下来的域名，最后去上级 Dns 服务器中寻找；而 addn-hosts 可以使用额外的 hosts 文件。
# Dns 解析 hosts 时对应的 hosts 文件，对应 no-hosts
addn-hosts=/etc/hosts
# Dns 缓存大小，Dns 解析条数
cache-size=1024
# 不缓存未知域名缓存，默认情况下 dnsmasq 会缓存未知域名并直接返回客户端
no-negcache
# 指定 Dns 同时查询转发数量
Dns-forward-max=1000

# 增加一个域名，强制解析到所指定的地址上，强行指定 domain 的 IP 地址
address=/doubleclick.net/127.0.0.1
# 知道这个原理之后，比如说可以屏蔽广告，把地址解析到一个本地地址
address=/ad.youku.com/127.0.0.1
address=/ad.iqiyi.com/127.0.0.1


# 多个 IP 用逗号分隔，192.168.x.x 表示本机的 ip 地址，只有 127.0.0.1 的时候表示只有本机可以访问。
# 通过这个设置就可以实现同一局域网内的设备，通过把网络 Dns 设置为本机 IP 从而实现局域网范围内的 Dns 泛解析（注：无效 IP 有可能导至服务无法启动）
# 监听的服务器地址，通过该地址提供服务
listen-address=192.168.x.x,127.0.0.1

# 对于新添加的接口不进行绑定。仅 Linux 系统支持，其他系统等同于 bind-interfaces 选项。
# bind-dynamic

# hosts 中主机有多个 IP 地址，仅返回对应子网的 IP
localise-queries

# 如果反向查找的是私有地址例如  192.168.x.x，仅从 hosts 文件查找，不转发到上游服务器
bogus-priv

# 对于任何解析到该 IP 的域名，将响应 NXDOMAIN 使得其解析失效，可多次指定
# 禁止跳转运营商广告站点
#bogus-nxdomain=64.xx.xx.xx

# 如果你想在某个端口只提供 Dns 服务，则可以进行配置禁止 dhcp 服务
no-dhcp-interface=
```

配置完成后，可以使用如下语法来检查正确性

	dnsmasq --test

如果没有问题会输出 `dnsmasq: syntax check OK.`

## 管理 dnsmasq 服务
在 Debian/Ubuntu 系电脑上可以使用：

	sudo systemctl status dnsmasq.service
	# or
	sudo /etc/init.d/dnsmasq status


## 查询
使用 `nslookup` 或者 `dig` 来查询 Dns 解析结果。

比如向 Google 提供的 Dns 服务器请求查询 `einverne.info` 域名的解析结果：

	➜ dig einverne.info @8.8.8.8

	; <<>> DiG 9.11.3-1ubuntu1.9-Ubuntu <<>> einverne.info @8.8.8.8
	;; global options: +cmd
	;; Got answer:
	;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 53970
	;; flags: qr rd ra ad; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

	;; QUESTION SECTION:
	;einverne.info.                 IN      A

	;; ANSWER SECTION:
	einverne.info.          2398    IN      A       69.163.x.x

	;; Query time: 4 msec
	;; SERVER: 8.8.8.8#53(8.8.8.8)
	;; WHEN: Fri Sep 20 16:26:54 CST 2019
	;; MSG SIZE  rcvd: 47

在 dig 的结果中可以看到一个 Query time, 连续查询某一个域名两次，可以观察该时间是否从之前的几十或者几百毫秒，变成 0 毫秒，由此来判断 dnsmasq 有没有生效。

或者直接 nslookup

	➜ nslookup youtube.com
	Server:         127.0.0.53
	Address:        127.0.0.53#53

	Non-authoritative answer:
	Name:   youtube.com
	Address: 2.1.1.2

## dnsmasq 解析流程
dnsmasq 会先去 hosts 文件中查看配置，然后再解析 `/etc/dnsmasq.d/*.conf` 下的 conf 配置，这些文件配置优先级高于 dnsmasq.conf。


## DHCP

DHCP 配置

dnsmasq 配置文件 (/etc/dnsmasq.conf)，必要的配置如下：

```
# 选定需要侦听的网口
# Only listen to routers' LAN NIC.  Doing so opens up tcp/udp port 53 to
# localhost and udp port 67 to world:
interface=<LAN-NIC>

# dnsmasq will open tcp/udp port 53 and udp port 67 to world to help with
# dynamic interfaces (assigning dynamic ips). dnsmasq will discard world
# requests to them, but the paranoid might like to close them and let the
# kernel handle them:
bind-interfaces

#设定可分配的 ip 地址段和租约时间
# Dynamic range of IPs to make available to LAN pc
dhcp-range=192.168.1.50,192.168.1.100,12h

#绑定某些机器的 ip-mac 地址对，使其具有固定的 ip 地址
# If you’d like to have dnsmasq assign static IPs, bind the LAN computer's
# NIC MAC address:
dhcp-host=aa:bb:cc:dd:ee:ff,192.168.1.50
dhcp-host=00:0e:7b:ca:1c:6e,daunbook,192.168.0.12
#为 192.168.0.12 设置主机名：dannbook

# dhcp 动态分配的地址范围
dhcp-range=192.168.2.100,192.168.2.240,24h

# 同上，不过给出了掩码
#dhcp-range=192.168.2.100,192.168.2.240,255.255.255.0,12h

# dhcp 服务的静态绑定
# dhcp-host=08:00:27:D1:CF:E2,192.168.8.201,infinite 无限租期
dhcp-host=08:00:27:D1:CF:E2,192.168.2.201,db2
dhcp-host=08:00:27:D6:F0:9F,192.168.2.202,db3

# 设置默认租期
# Set the limit on DHCP leases, the default is 150
#dhcp-lease-max=150

# 租约保存文件路径
#dhcp-leasefile=/var/lib/dnsmasq/dnsmasq.leases

# 通过 /etc/hosts 来分配对应的 hostname
#dhcp-host=judge

# 忽略下面 MAC 地址的 DHCP 请求
#dhcp-host=11:22:33:44:55:66,ignore

# dhcp 所在的 domain
domain=freeoa.net

# 设置默认路由出口
# dhcp-option 遵循 RFC 2132（Options and BOOTP Vendor Extensions), 可以通过 dnsmasq --help dhcp 来查看具体的配置
# 很多高级的配置，如 iSCSI 连接配置等同样可以由 RFC 2132 定义的 dhcp-option 中给出。
# option 3 为 default route
dhcp-option=3,192.168.8.1

# 设置 NTP Server. 这是使用 option name 而非选项名来进行设置
#dhcp-option=option:ntp-server,192.168.8.4,10.10.0.5
```


## reference

- <http://www.thekelleys.org.uk/dnsmasq/doc.html>

