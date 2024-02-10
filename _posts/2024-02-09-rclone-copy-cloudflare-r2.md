---
layout: post
title: "使用 rclone 批量备份及备份到 Cloudflare R2"
aliases:
- "使用 rclone 批量备份及备份到 Cloudflare R2"
tagline: ""
description: ""
category: 学习笔记
tags: [rclone, cloudflare-r2, cloudflare, object-storage, linux, cli]
create_time: 2024-02-10 16:23:04
last_updated: 2024-02-10 16:23:04
---

今天在了解 [[Hono]] 的时候直接使用了 Cloudflare Worker，然后快速实现了一个上传图片到 R2 的代码，回想之前我一直都是使用 [[Chevereto]] 来管理的我博客的配图，Chevereto 的图片都是存放在新加坡的一台机器上，这台机器虽然在国外访问没啥问题，但是在国内延迟略高，所以一想怎么不直接用 [[Cloudflare R2]] 免费的 10 GB 存储了，我自己用 Chevereto 近五年的数据才用了 700MB+，10 GB 已经完全足够我再用 20 多年了。

所以有了这个想法之后，我又不想让我的博客图片迁移完成之后立即挂掉，那么最好的办法就是保持访问的路径之前是类似 https://HOST/images/2023/09/08/IMAGE.png 这样的访问路径，而幸好 Chevereto 本地保存的路径也是类似的结构，存放在了相似的文件夹结构路径下。

那么我的需求就变得非常简单，直接将本地的文件拷贝到对应的 R2 bucket 中 `/images` 路径下即可。于是了解了一下，发现官方的 CLI 并不支持直接上传。但是官方提供了一个思路就是利用 rclone 工具。

这个工具我之前也[介绍过](https://blog.einverne.info/post/2023/02/rclone-mount-remote-storage-vps.html) ，但是当时那篇文章重点在于使用 rclone 挂载磁盘，但是原理也是一样的，只是在这里我会使用 `copy` 命令，创建一个 remote (兼容 S3) ，然后将本地的文件夹所有的内容直接拷贝远端。

基础的 rclone 设置过程就不再赘述，直接运行 `rclone config` 进行初始化，并创建兼容 S3 的 remote，比如这里起个名字叫做 r2。

在交互式命令行中，需要访问密钥，访问 Cloudflare 后台，[创建 API Token](https://dash.cloudflare.com/?to=/:account/r2/api-tokens) [^1]

[^1]: <https://developers.cloudflare.com/r2/api/s3/tokens/>

执行 config 命令之后，会写到本地配置文件中，如果交互式命令行有问题的时候，可以直接修改这个配置，或者自己可以直接编辑此配置来完成初始化。

```
❯ cat ~/.config/rclone/rclone.conf
[r2]
type = s3
provider = Cloudflare
endpoint = https://3f----------.r2.cloudflarestorage.com
access_key_id = db----------------------------b3
secret_access_key = bf------------------------------------------------------------1a
acl = private
```

完成配置之后，可以使用 `rclone` 命令来完成本地和 R2 之间的文件复制。

首先使用 `rclone tree r2:` 来列出 r2 中的所有内容，来验证配置没有问题。

然后可以指定 bucket 名字 `rclone tree r2:bucket_name`。

然后就是正式开始我的任务，大致看一眼 rclone 的帮助文档，然后执行：

```
rclone copy -P -v /path/to/image r2:bucket_name/images
```

执行的过程中会显示当前的进度，然后完成之后，所有的文件都会在 bucket_name 的 images 路径下。

## reference

- <https://developers.cloudflare.com/r2/examples/rclone/>
