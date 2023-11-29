---
layout: post
title: "时隔 5 年再安装 NextCloud"
aliases:
- "时隔 5 年再安装 NextCloud"
tagline: ""
description: ""
category: 经验总结
tags: [docker, nextcloud, cloud, owncloud, cloudreve, cloud-drive, webdav]
create_time: 2023-11-29 14:40:01
last_updated: 2023-11-29 14:40:01
---

时隔多年，我再安装了一次 [[NextCloud]]，很早[之前](https://blog.einverne.info/post/2018/04/nextcloud.html) 就在我的 [QNAP TS 453B mini](https://blog.einverne.info/post/2018/04/qnap-ts453bmini.html) 上安装并使用了多年，这两年也一直在跟随着官方的版本[升级](https://blog.einverne.info/post/2020/01/qnap-nextcloud-docker-upgrade-and-backup.html) ，但是 QNAP 毕竟在局域网内，虽然可以使用 [Tailscale](https://blog.einverne.info/post/2022/04/tailscale-usage.html)，[ZeroTier](https://blog.einverne.info/post/2018/06/zerotier.html) 等等工具来组件局域网，但毕竟还是不方便，最近入手一台还不错的 VPS，所以想着再搭建一个公有 IP 的 NextCloud，一方面备份一下自己的相册，另一方面也补足一下我自己使用 [Syncthing](https://blog.einverne.info/post/2019/10/syncthing.html)时没有在线预览的页面，导致常常有些时候想访问自己的笔记而找不到。

## Nextcloud Docker 镜像的区别
在调研的时候发现 NextCloud 现在有两个比较常用的镜像，一个是我之前一直使用的 nextcloud 镜像，调查了一下才发现原来这个镜像是社区维护的，官方还推出了一个 All-in-One 的镜像，集成了 NextCloud 所依赖的组件，包括数据，Web 服务器等等。因为我个人还是对原来的那个 nextcloud 镜像比较熟悉，所以还是用来原来的那个镜像，一来镜像比较小，而来比较轻量，可以自己选择需要的组件，搭配 MySQL （Maria） 还是比较好维护的。

NextCloud 的 Docker 镜像有两个:

- nextcloud
- All-in-One

一个是社区维护的，一个是包含了其他依赖组件的多合一镜像。如果非要说区别，就是 nextcloud 镜像比较小，只包含了 Nextcloud 自身，需要用户自己准备数据库，Web 服务器等。而 All-in-One 镜像则包含了数据库，Web 服务器等等，但是镜像的提及也比较大。All-in-One 的镜像中包含了 Apache，Database，Nextcloud，Notify Push，Redis，Collabora，Talk，Imaginary 等等组件。

## 配置
通过环境变量来配置 SMTP

### SMTP

- `SMTP_HOST` (not set by default): The hostname of the SMTP server.
- `SMTP_SECURE` (empty by default): Set to `ssl` to use SSL, or `tls` to use STARTTLS.
- `SMTP_PORT` (default: `465` for SSL and `25` for non-secure connections): Optional port for the SMTP connection. Use `587` for an alternative port for STARTTLS.
- `SMTP_AUTHTYPE` (default: `LOGIN`): The method used for authentication. Use `PLAIN` if no authentication is required.
- `SMTP_NAME` (empty by default): The username for the authentication.
- `SMTP_PASSWORD` (empty by default): The password for the authentication.
- `MAIL_FROM_ADDRESS` (not set by default): Use this address for the 'from' field in the emails sent by Nextcloud.
- `MAIL_DOMAIN` (not set by default): Set a different domain for the emails than the domain where Nextcloud is installed.

### Redis 配置
搭建之后使用系统的检查，建议使用 Redis 来做缓存，所以又加上了 Redis。

- `REDIS_HOST` (not set by default) Name of Redis container
- `REDIS_HOST_PORT` (default: `6379`) Optional port for Redis, only use for external Redis servers that run on non-standard ports.
- `REDIS_HOST_PASSWORD` (not set by default) Redis password

## WebDAV 登录使用

### Linux 下

Nautilus File Manager

```
davs://example.com/nextcloud/remote.php/dav/files/USERNAME/
```

KDE Dolphin File Manager 中

```
webdav://example.com/nextcloud/remote.php/dav/files/USERNAME/
```

### macOS

```
https://cloud.YOURDOMAIN.com/remote.php/dav/files/USERNAME/
```

### Windows

```
https://example.com/nextcloud/remote.php/dav/files/USERNAME/
```

## 问题

### 上传 500 MB 大文件

可以通过 <https://data.einverne.info/settings/admin/serverinfo> 来查看当前 PHP 支持的最大上传大小。

默认情况下是 512MB 大小。

修改 Docker 的环境变量

```
PHP_MEMORY_LIMIT=2048M
PHP_UPLOAD_LIMIT=2048M
```

然后就可以得到

![hDb8](https://photo.einverne.info/images/2023/11/29/hDb8.png)

当然如果你使用 [All-in-One](https://github.com/nextcloud/all-in-one#nextcloud-all-in-one) 的 NextCloud 镜像，那就不用担心这个问题了，默认就是 10GB，应该能满足 99%的需求了。

### HSTS

检查的时候遇到如下的问题:

> The "Strict-Transport-Security" HTTP header is not set to at least "15552000" seconds. For enhanced security, it is recommended to enable HSTS as described in the security tips ↗.

直接在 [[Nginx Proxy Manager]] 中启用 HSTS 即可。

### The database is used for transactional file locking

如果遇到如下的问题

> The database is used for transactional file locking. To enhance performance, please configure memcache, if available. See the [documentation ↗](https://docs.nextcloud.com/server/27/go.php?to=admin-transactional-locking) for more information.

然后安装 Redis，然后配置 Redis 即可。

### Your installation has no default phone region set

> Your installation has no default phone region set. This is required to validate phone numbers in the profile settings without a country code. To allow numbers without a country code, please add "default_phone_region" with the respective [ISO 3166-1 code ↗](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) of the region to your config file.

对应此问题，在 NextCloud 的 config 配置中添加 `sudo vi ~/nextcloud_data/config/config.php`

```
'default_phone_region' => 'JP',
```

然后重启容器即可。

### NextCloud iOS 客户端登录时遇到「不允许 HTTP 重定向」问题

需要修改 `sudo vi ~/nextcloud_data/config/config.php`，然后添加

```
  'overwriteprotocol' => 'https',
```

最终：

```
  'dbtype' => 'mysql',
  'version' => '27.1.3.2',
  'overwriteprotocol' => 'https',
```
