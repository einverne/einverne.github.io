---
layout: post
title: "利用 AdGuard Home 自建 DNS 服务器过滤广告"
aliases: "利用 AdGuard Home 自建 DNS 服务器过滤广告"
tagline: ""
description: ""
category: 学习笔记
tags: [adguard, adguard-home, adblock, browser, dns,]
last_updated:
---

AdGuard Home 是 AdGuard 发布的一款借助于 DNS 来实现广告过滤的服务。

过滤广告的方式有非常多的方式，比如加本地 Host，比如浏览器中的 Adblock 插件，或者之前在 OpenWrt 或者其他固件上添加的广告过滤插件，甚至在 Android 上也用过通过在本地设定一个代理，所有的流量走代理，然后在代理中将广告过滤掉的应用，那么这个 AdGuard Home 有什么优势呢？在我看来，吸引我使用它的几个优势是：

- 只需要架设一次，所有局域网中的设备都可以享用，而不需要各个设备单独配置
- 可视化，最早是在 Twitter 上看到有人分享 AdGuard 后台，大部分情况下，广告过滤插件或者应用都是默默在后台工作，AdGuard 让一切变得可见，那这样就可以分析哪些网站在后面偷偷地做坏事
- 占用资源小，一个树莓派即可，并且[源代码是开放的](https://github.com/AdguardTeam/AdGuardHome)
- 支持安全的 DNS 解析

AdGuard 官方的文章也总结了 AdGuard Home 的几大优势：[^home]

- Ad Blocking, 最基础的服务，可以减少网页的体积，加快速度
- Browsing Security
- Parent Control
- Safe Search，可以过滤成人内容
- Custom upstream servers, 可以自定义上游的 DNS 服务器
- Filter lists, 可以自定义过滤列表
- Query Log，也就是我提到的可视化的访问日志


## AdGuard vs AdGuard Home
开始之前要先声明一下，这篇文章后面提到的 AdGuard Home 都会是 AdGuard 这个公司提供的一个产品 ---- AdGuard Home.[^home]

[^home]: <https://adguard.com/en/blog/introducing-adguard-home.html>


## AdGuard Home 的原理
上面提到过很多不同的广告过滤方式，但是 AdGuard Home 采用完全不同的方式。首先来介绍一下什么是 AdGuard Home，AdGuard Home 是一个过滤全网范围的广告和追踪代码的 DNS Server，它的设计目的是让用户来全权掌握整个网络环境，它不依赖于任何客户端。所以从本质上来讲 AdGuard Home 是一个 DNS 服务器，通过屏蔽掉黑名单的域名来达到过滤广告的目的。

## 在 Raspberry Pi 中安装使用 AdGuard Home
在树莓派上安装 AdGuard Home 非常简单，安装 [wiki](https://github.com/AdguardTeam/AdGuardHome/wiki/Raspberry-Pi) 上执行即可。

### 给 Raspberry Pi 设定静态 IP 地址

Raspberry Pi 的网络配置 `/etc/dhcpcd.conf`，在下方添加

	interface eth0
	static ip_address=192.168.2.3/24
	static routers=192.168.2.1
	static domain_name_servers=192.168.2.1

注意我这里是使用的 `eth0` 接口，也就是网线连接的，如果使用 WiFi，那么需要设定 `wlan0`。

然后 `sudo reboot` 重启树莓派。

之后我的树莓派静态 IP 地址就是 `192.168.2.3`

### 验证安装
上面提到过保证树莓派静态地址，然后执行安装向导，设定后台管理页面的端口（一般为 80，可以自行修改），以及 DNS 服务端口（一般为 53)。这样 53 端口就对外提供了 DNS 服务，可以通过

	nslookup douban.com 192.168.2.3

来验证 DNS 服务器正常工作，如果正常工作返回

	Server:         192.168.2.3
	Address:        192.168.2.3#53

	Non-authoritative answer:
	Name:   douban.com
	Address: 154.8.131.171
	Name:   douban.com
	Address: 154.8.131.172
	Name:   douban.com
	Address: 154.8.131.165

验证拦截

	nslookup doubleclick.net 192.168.2.3
	Server:         192.168.2.3
	Address:        192.168.2.3#53

	** server can't find doubleclick.net: NXDOMAIN

### 设置路由器和其他设备
如果能够设置路由器，直接去路由器管理后台，将网络的 DNS，改为树莓派的地址，比如我的 192.168.2.3 即可。其他设备直接就生效了。如果改不了路由器就只能每一个设备改了。

### 其他管理命令
AdGuardHome 安装的命令：

	sudo ./AdGuardHome -s install

其他管理命令：

- AdGuardHome -s uninstall - uninstalls the AdGuard Home service.
- AdGuardHome -s start - starts the service.
- AdGuardHome -s stop - stops the service.
- AdGuardHome -s restart - restarts the service.
- AdGuardHome -s status - shows the current service status.


## Docker 安装
因为 AdGuardHome 是使用 Go 所写，所以跨平台天然支持，Docker 安装自然也非常容易。

	docker pull adguard/adguardhome

```
docker run --name adguardhome \
-v ~/adguardhome/workdir:/opt/adguardhome/work \
-v ~/adguardhome/confdir:/opt/adguardhome/conf \
-p 53:53/tcp -p 53:53/udp \
-p 67:67/udp -p 68:68/tcp -p 68:68/udp \
-p 8080:80/tcp -p 443:443/tcp \
-p 853:853/tcp -p 3000:3000/tcp \
--restart=always -d adguard/adguardhome
```

说明：

- `-p 67:67/udp -p 68:68/tcp -p 68:68/udp` 用来将 AdGuard Home 作为 DHCP 服务，可不映射
- `-p 443:443/tcp` 如果要使用 AdGuard Home 作为 HTTPS/DNS-over-HTTPS 服务器
- `-p 853:853/tcp` 作为 DNS-over-TLS 服务器
- `-p 784:784/udp` 作为 DNS-over-QUIC 服务器
- `-p 5443:5443/tcp -p 5443:5443/udp` 作为 DNSCrypt 服务器


参数可以参数官方网站：

- <https://hub.docker.com/r/adguard/adguardhome>


## 设置

所有安装完成之后就可以进入后台进行一番初始化设置，AdGuardHome 默认的设置就已经足够使用了，但假如想更加精细化地设置，比如说上游 DNS，DNS-over-HTTPS，DNS-over-TLS 等等，都可以在后台看到。

AdGuard Home 所有的配置参数都保存在一个名为 AdGuardHome.yaml 的配置文件中。这个配置文件默认路径通常为 AdGuard Home 二进制文件 AdGuardHome 所在的目录。

### 已知的 DNS 提供商

AdGuard 提供了一份非常详细的 DNS 服务提供商的列表：

- <https://kb.adguard.com/en/general/dns-providers>

进入后台可以看到 AdGuard 默认使用的是

	https://dns10.quad9.net/dns-query

不过在国内可能在测试上游 DNS 服务器的时候

> 服务器 "https://dns10.quad9.net/dns-query"：无法使用，请检查你输入的是否正确

不过问题也不大，勾选“并行请求”，同时用下方的 DNS 提供商的

```
tls://8.8.8.8
tls://8.8.4.4
tls://dns.google
tls://dns.adguard.com
119.29.29.29
1.2.4.8
tls://1.1.1.1
tls://1.0.0.1
https://dns10.quad9.net/dns-query
8.8.8.8
114.114.114.114
119.29.29.29
223.5.5.5
```

其他一些

- [114 DNS](http://www.114dns.com/), `114.114.114.114`,`114.114.115.115`
- [腾讯](https://www.dnspod.cn/Products/Public.DNS) `119.29.29.29`
- [阿里](https://alidns.com/) `223.5.5.5`, `223.6.6.6`
- [百度](https://dudns.baidu.com/intro/publicdns/) `180.76.76.76`

不过这些国内公共 DNS 暂时不支持 DNS over TLS。

Bootstrap DNS 服务器

```
1.1.1.1:53
1.0.0.1:53
9.9.9.10
149.112.112.10
114.114.114.114:53
2620:fe::10
2620:fe::fe:10
```


### 过滤器

AdGuard Home 自身已经内置了一些过滤规则，并且 AdGuard Home 兼容 Adblock 的过滤规则。

- [EasyList China](https://easylist.to/pages/other-supplementary-filter-lists-and-easylist-variants.html) 国内网站广告过滤的主规则 `https://easylist-downloads.adblockplus.org/easylistchina.txt`
- [Anti Ad](https://github.com/privacy-protection-tools/anti-AD) 国内过滤规则 `https://gitee.com/privacy-protection-tools/anti-ad/raw/master/easylist.txt`
- neohosts `https://cdn.jsdelivr.net/gh/neoFelhz/neohosts@gh-pages/basic/hosts.txt`
- EasyPrivacy `https://easylist-downloads.adblockplus.org/easyprivacy.txt`
- AdGuard Simplified Domain Names filt https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt
- AdAway https://adaway.org/hosts.txt
- CJX's Annoyance List https://raw.githubusercontent.com/cjx82630/cjxlist/master/cjx-annoyance.txt

## 外延

### .in-addr.arpa

在运行 AdGuard Home 一天后，观察请求域名排行榜，有一些奇怪的域名请求频率异常高，显示着一个 IP 地址，后面接着 `.in-addr.arpa`. 这就引起了我的好奇，查询之后发现这一类的地址叫做 [Reverse DNS lookup](https://en.wikipedia.org/wiki/Reverse_DNS_lookup)，反向 DNS 查询。都知道 DNS 是将域名转换成 IP 地址，那么反过来查询 IP 地址关联的域名就是反向 DNS 查询。

如果想要反解析一个给定的 IP 地址，需要反转 IP 地址，然后在后面添加一个特殊的域名，比如 `in-addr.arpa`，比如想要反解析 8.8.4.4 对应的域名，需要构造这样的地址：

	4.4.8.8.in-addr.arpa

然后可以使用 `dig -x 4.4.8.8.in-addr.arpa @8.8.8.8` 来进行反向解析查看结果。

### SERVFAIL
观察查询日志，在我的内网里面能看到不少的 `SERVFAIL`，这里就顺带复习一下 DNS RCODE[^rcode]，DNS 请求的返回码：

- NOERROR(0)，成功响应，解析成功
- SERVFAIL(2), 服务器失败，域名的权威服务器拒绝响应或者响应 REFUSE，递归服务器返回 Rcode 值为 2 给 CLIENT
- NXDOMAIN(3), 不存在的记录，域名在权威服务器不存在
- REFUSE(5)，请求的 IP 不在该 DNS 服务器服务的范围

其他更多的码可以参考[这里](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-6).

[^rcode]: <https://en.wikipedia.org/wiki/Domain_Name_System>

## AdGuard Home 相较于 Pi-Hole 的优势

AdGuard Home 和 Pi-Hole 利用相似的原理可以达到基本一致的效果，但是 AdGuard Home 相较于 Pi-Hole 有如下几方面的优势：

- AdGuard Home 支持加密的 DNS 上游服务器 Encrypted DNS upstream servers (DNS-over-HTTPS, DNS-over-TLS, DNSCrypt)
- 更加完整的过滤系统，和家长控制
- 安全搜索结果
- 访问控制，可以实现精确的谁能访问 DNS 服务器

## Configuration
AdGuard Home 的配置文件是 yaml 格式，格式非常易读。

### DNS TTL
在设置里面有一个 DNS TTL 的设置，这里 TTL 是 `Time to Live` 缩写，指的是 DNS 需要缓存多久然后才去刷新新的解析结果。

当改变 DNS 配置的时候，需要花费一些时间来通知互联网这个修改，比如修改一个域名对应的 IP 地址，修改 MX 记录等等，TTL 配置就是告诉互联网需要缓存这一次的结果多久才需要再来请求信息。

那么在家用环境里面可以根据自己的情况设置一个合理的值，我个人觉得大部分网站设置一个 10 分钟的缓存就可以了。


```
bind_host: 0.0.0.0
bind_port: 80
users:
- name: admin
  password: b2a
http_proxy: ""
language: ""
rlimit_nofile: 0
debug_pprof: false
web_session_ttl: 720
dns:
  bind_host: 0.0.0.0
  port: 53
  statistics_interval: 1
  querylog_enabled: true
  querylog_interval: 90
  querylog_size_memory: 1000
  anonymize_client_ip: false
  protection_enabled: true
  blocking_mode: default
  blocking_ipv4: ""
  blocking_ipv6: ""
  blocked_response_ttl: 10
  parental_block_host: family-block.dns.adguard.com
  safebrowsing_block_host: standard-block.dns.adguard.com
  ratelimit: 100
  ratelimit_whitelist: []
  refuse_any: true
  upstream_dns:
  - tls://8.8.8.8
  - tls://8.8.4.4
  - 119.29.29.29
  - 1.2.4.8
  - 114.114.114.114
  - 223.5.5.5
  bootstrap_dns:
  - 9.9.9.10
  - 149.112.112.10
  - 2620:fe::10
  - 2620:fe::fe:10
  all_servers: true
  fastest_addr: false
  allowed_clients: []
  disallowed_clients: []
  blocked_hosts: []
  cache_size: 4194304
  cache_ttl_min: 600
  cache_ttl_max: 0
  bogus_nxdomain: []
  aaaa_disabled: false
  enable_dnssec: false
  edns_client_subnet: false
  filtering_enabled: true
  filters_update_interval: 24
  parental_enabled: false
  safesearch_enabled: false
  safebrowsing_enabled: false
  safebrowsing_cache_size: 1048576
  safesearch_cache_size: 1048576
  parental_cache_size: 1048576
  cache_time: 30
  rewrites: []
  blocked_services: []
tls:
  enabled: false
  server_name: ""
  force_https: false
  port_https: 443
  port_dns_over_tls: 853
  allow_unencrypted_doh: false
  strict_sni_check: false
  certificate_chain: ""
  private_key: ""
  certificate_path: ""
  private_key_path: ""
filters:
- enabled: true
  url: https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt
  name: AdGuard DNS filter
  id: 1
- enabled: true
  url: https://adaway.org/hosts.txt
  name: AdAway
  id: 2
- enabled: false
  url: https://www.malwaredomainlist.com/hostslist/hosts.txt
  name: MalwareDomainList.com Hosts List
  id: 4
- enabled: true
  url: https://easylist-downloads.adblockplus.org/easylistchina.txt
  name: EasyList China
  id: 1593851523
- enabled: true
  url: https://www.i-dont-care-about-cookies.eu/abp/
  name: I don't care about cookies
  id: 1593851524
- enabled: false
  url: https://gitee.com/privacy-protection-tools/anti-ad/raw/master/easylist.txt
  name: anti ads
  id: 1593851525
- enabled: true
  url: https://filters.adtidy.org/extension/chromium/filters/224.txt
  name: AdGuard Chinese filter
  id: 1594425715
whitelist_filters: []
user_rules:
- '||open.trackerlist.xyz^$important'
- ""
dhcp:
  enabled: false
  interface_name: ""
  gateway_ip: ""
  subnet_mask: ""
  range_start: ""
  range_end: ""
  lease_duration: 86400
  icmp_timeout_msec: 1000
clients: []
log_file: ""
verbose: false
schema_version: 6
```


更加具体的配置选项可以参考：

- <https://github.com/AdguardTeam/AdGuardHome/wiki/Configuration>

## 延伸阅读

- [adguard-sync](https://github.com/atoy3731/adguard-sync) 是一个同步配置的工具。


## reference

- <https://github.com/AdguardTeam/AdguardHome>
- <https://github.com/Mosney/anti-anti-AD>
