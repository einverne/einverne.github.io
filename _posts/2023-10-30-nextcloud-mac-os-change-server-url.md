---
layout: post
title: ""
aliases:
- "NextCloud macOS 客户端修改服务端地址"
tagline: ""
description: ""
category: 经验总结
tags: [nextcloud, macos, config]
create_time: 2022-07-20 03:43:51
last_updated: 2023-10-30 10:18:00
---

起因是因为我因为搬家把 NAS 放在了家里，然后使用了 [ZeroTier](/post/2018/06/zerotier.html) 做内网穿透，于是原来搭建在 NAS 上的 NextCloud 局域网地址，变成了 ZeroTier 的地址。那么我所有的同步客户端就没有办法直接再连接上了，所以得想办法。

最初想到的最笨的办法就是登出，然后再用新的 NextCloud 地址登录。但是这样就需要重新关联本地的同步文件，极有可能会让 NextCloud 将同一份文件同步两次（这种蠢事我之前也干过）。

于是我就找能不能只修改本地的配置，让原来的 192.168.2.xxx 变成 ZeroTier 的局域网地址 192.168.192.xxx。那么我只需要将客户端退出，然后修改本地配置，然后重启 NextCloud 客户端就可以完成切换。

搜索之后果然可以，可以通过修改配置 `nextcloud.cfg` 来实现这个效果。

在 macOS 上，NextCloud 的配置文件地址是：

```
~/Library/Preferences/NextCloud/nextcloud.cfg
```

在 Windows 上是：

```
C:\Users\Username\AppData\Roaming\Nextcloud\nextcloud.cfg
```

那么就特别简单了，本地 vi 打开这个配置文件，修改服务器地址，保存就完成了。
