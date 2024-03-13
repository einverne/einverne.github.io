---
layout: post
title: "记录一次令人无语的文件上传限制调试"
aliases:
- "记录一次令人无语的文件上传限制调试"
tagline: ""
description: ""
category: 经验总结
tags: [hestiacp, nginx, php, wordpress, cloudflare, file-upload, file-manage]
create_time: 2024-03-10 09:32:52
last_updated: 2024-03-11 09:32:52
dg-home: false
dg-publish: false
---

本文记录一次令我非常无语的文件上传大小限制的问题。之前也提到过我开了一档《暮色时光》的[播客](https://twilight-time.einverne.info)，那为了方便，我就直接使用 WordPress 的 Media 来管理我自己的音频文件了，但是最近一期聊《台湾》相关的内容，时长超过了 1 个小时，所以导出的文件有点大（102MB），稍微超过了我预期的 100MB ，这导致我需要调整 WordPress 文件上传的限制。那我一想这个也简单，之前也调整过，无非就是调整一下 Nginx 和 PHP 的配置，重启一下服务就行，谁知道我在这么个简单的事情上竟然又浪费了几个小时。

按照我之前的经验，无非就是调整一下 PHP 的配置文件。

## PHP 配置

因为我直接使用的 [HestiaCP](https://blog.einverne.info/post/2022/07/web-server-control-panel-hestia-usage.html) ，登录后台之后，点击右上角的齿轮，进入系统设置，然后在其中找到，我使用的 PHP 版本，点击编辑配置，立即就可以看到 PHP 相关的配置，HestiaCP 也非常人性化的将常用的配置列了出来。

![4H2G](https://photo.einverne.info/images/2024/03/11/4H2G.png)

那这个地方只需要修改

```
post_max_size
upload_max_filesize
memory_limit
max_execution_time
max_input_time
```

这几个值。然后点击保存之后， PHP 会自动重启。

这个时候我去后台看，WordPress 已经将文件上传的限制放宽到了 256 MB 大小，我尝试上传，发现上传接口 Pending。

![YdcANSWTDK](https://pic.einverne.info/images/YdcANSWTDK.png)

## Nginx

于是我想是不是 Nginx 配置里面 `client_max_body_size` 配置有限制，于是直接看 HestiaCP 后台的 Nginx 配置，但发现这不是问题啊，现在的大小就已经足够。

![4mMM](https://photo.einverne.info/images/2024/03/11/4mMM.png)

于是我想难道是配置没有生效，在 HestiaCP 后台，通过 SSH 登录服务器，直接重启了 PHP，Nginx。

然后在 PHP 目录里面创建了文件 test.php ，直接放入

```
<?php phpinfo(); ?>
```

访问，发现 PHP 已经生效了上传限制。

重新尝试，接口还是 pending。

## WordPress

于是我想难道是 WordPress 自身做了什么限制？但之前也没有遇到过类似的事情？但网上查的时候有人说还需要加上一些配置，那么我也不管了，先加上再说。

```
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_UPLOAD_SIZE', '256M');
```

重新尝试上传，接口还是 pending。

这个时候我就不知道问题出现在那里了，然后我就尝试换用 `async-upload.php` 为关键字，终于在一个 StackOverflow 的帖子里面看到了一个让我震惊的[回答](https://stackoverflow.com/a/60128885/1820217)，说 Cloudflare 的基础套餐有 100 MB 的限制！

![4eVR](https://photo.einverne.info/images/2024/03/11/4eVR.png)

我突然意识到，确实我的站点前面确实增加了一个 Cloudflare CDN，而我的文件刚刚好超过 100MB。于是立即去 Cloudflare 后台关闭了云朵，然后我发现问题解决了！

后来仔细的研究了一下 Cloudflare，发现 Free 和 Pro 的套餐，上传文件大小限制都是 100MB。[^1] 而 Business 是 200MB 限制，Enterprise 是 500MB 限制。

如果文件大小超过 100MB，会直接返回 413 错误，文件上传也不会到自己的服务器，我就说为什么我上面几次修改，在 PHP 和 Nginx Error 日志里面什么错误信息都没有看到！

[^1]: <https://community.cloudflare.com/t/maximum-upload-size-is-limit/418490/2>

至此文件上传的问题就得到了解决。
