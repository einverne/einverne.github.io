---
layout: post
title: "解决 Clash for Windows 节点测速 timeout 问题"
aliases:
- "解决 Clash for Windows 节点测速 timeout 问题"
tagline: ""
description: ""
category: 经验总结
tags: [ clash, vpn, mac, linux, cfw, ]
create_time: 2022-09-30 10:01:56
last_updated: 2022-10-01 09:06:10
---

[[Clash for Windows]] 使用过程中一直没有什么问题，但是昨天心血来潮把 Clash for Windows 从 0.18.8 升级到了最新版本（0.20.5) ，然后发现节点全部 timeout。但可以排除的是这些节点肯定是可以用的，因为在手机上是完全没有问题的。

先是看 Logs 日志里面，timeout 的节点有大量的错误：

```
22:06:18 WRN [UDP] dial failed error=new vmess client error: dial xxxx:7830 error: 404 Not Found proxy=GLOBAL rAddr=114.114.114.114:53
```

查询了一通之后发现可能与 Clash Core 版本 [升级](https://github.com/Fndroid/clash_for_windows_pkg/issues/602) 有关系，

查看了一下 Clash 的 [Release Note](https://github.com/Dreamacro/clash/releases) ，在 [1.90.0](https://github.com/Dreamacro/clash/releases/tag/v1.9.0) 的 Change Logs 中有一行：

```
注意vmess下的 ws-headers 和 ws-path 选项已更新
```

原来 Clash Core 新版本中把配置文件的 `ws-headers` 和 `ws-path` 改了个名字

- `ws-path`
- `ws-headers`

这两个配置项变成了如下的结构：

```
  ws-opts:
    path: /path
    headers:
      Host: somehost.com
```

完整配置示例：

```
# VMess
- name: "v2ray"
  type: vmess
  server: xxx
  port: 443
  uuid: 8b0edc
  alterId: 0
  cipher: auto
  # udp: true
  tls: true
  # skip-cert-verify: true
  network: ws
  ws-opts:
    path: /xxx
    headers:
      Host: xxxx.com
```

JSON 格式：

```
proxies:
    - { name: '美国', type: vmess, server: some.pw, port: 6000, uuid: ccfb9fb3, alterId: 0, cipher: auto, udp: true, network: ws, ws-opts: { path: /, headers: { Host: some.com } }, ws-path: /, ws-headers: { Host: some.com } }
```

如果不想自己配置，那么可以注册使用这个[站点](https://board.gtk.pw/#/register?code=DNNPsQWD)。

## 其他 timeout 原因
另外一个可能引起 timeout 的原因可能是 Clash 的配置中开启了 DNS

```
dns:
    enable: true
    ipv6: false
```

开启了 DNS 之后，clash 会将域名解析发送给配置的 nameserver 解析，如果域名解析失败也会发生 timeout 情况。

其他原因：

- 节点配置错误
- 节点无法访问
- 配置的 url-test 中的 url 设置错误
- 系统时间不同步
