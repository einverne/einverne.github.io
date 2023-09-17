---
layout: post
title: "对象存储服务提供商提供的免费存储容量"
aliases:
- "对象存储服务提供商提供的免费存储容量"
tagline: ""
description: ""
category: 产品体验
tags: [object-storage, s3, aws-s3, oos, storj, backblaze]
create_time: 2023-09-10 14:40:20
last_updated: 2023-09-16 14:40:20
---

[[对象存储]] 的英文是 Object-based Storage System，是一种将数据以对象的形式存储在分布式系统中的服务，而不是传统的文件系统或者块存储。

对象存储服务提供商通常提供以下功能和服务：

1. 可扩展性：它们能够处理大规模的数据，并自动扩展以适应数据量的增长。
2. 冗余备份：它们使用分布式系统来复制和备份数据，以确保数据的安全性和可靠性。
3. 数据访问控制：它们提供各种访问控制机制，以确保只有经过授权的用户才能访问和修改数据。
4. 数据管理：它们提供各种管理工具，使用户能够有效地管理和组织他们的数据。
5. 数据传输：它们通常提供高速的网络传输机制，以便用户可以快速地上传和下载他们的数据。

一些知名的对象存储服务提供商包括亚马逊 S3（Amazon S3）、微软 Azure Blob Storage、谷歌云存储（Google Cloud Storage）等。这些服务可以根据用户的需求来选择，并根据使用量进行付费。

那么除了上面提到的这些云服务商，还有哪些服务商提供免费的对象存储服务呢。

## Oracle Cloud

Oracle Cloud Object Storage 包含了 20 GB 的免费存储空间。

## Backblaze B2 Cloud Storage

[[Backblaze]] 是一个云存储解决方案提供商，其提供了类似 [[AWS S3]] 的在线块存储服务。 [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) 价格要便宜一些。并且前 10GB 存储是完全免费的。和 AWS S3 一样，需要为带宽付费，但是通过 [Bandwidth Alliance](https://www.cloudflare.com/bandwidth-alliance/)，在 Backblaze 和 Cloudflare 之间的带宽是完全免费的，这也就意味这如果通过 Cloudflare ，那么使用 Backblaze 也就不再需要考虑流量的问题。

- 存储每 GB 每个月 $0.005
- 流量，每 GB 下载 $0.01

## Storj

[Storj](https://www.storj.io/) 提供的分布式存储可以创建三个项目，每个项目都有 50GB 存储，以及 50GB 流量可以免费使用。 也就是达到了免费的 150G 存储。[^1]

[^1]：<https://docs.storj.io/dcs/pricing>

免费的对象存储，特点：

- ~~免费 150 G 永久~~ 25 GB
- 去中心化储存
- 可免费创建三个 project
- 流量和储存一样都免费配额
- 可选 AP(亚太)/US(美国)/EU(欧洲)三个地区
- 多终端客户端/支持 S3 协议/可使用 rclone 传输挂载

### 缺点

Storj 目前只有 AP/US/EU 三个地区有服务器，访问速度可能会受到一定影响。并且目前 Storj 在初创时期，其商业模式是否能为继续也是需要继续考量的。

## Contabo Object Storage

Contabo 发布的 Object Storage 对象存储，起步价 250GB，2.99$ （2.49 欧元）一个月。不限流，提供 DDOS 防护，兼容 S3 。

目前有欧洲，美国和亚洲三个地理位置。

在刚推出该项目的时候还提供了 20% 的额外优惠，只需要 1.99 欧元（2.49 美元）。[^1]

[^1]: <https://lowendtalk.com/discussion/177643/contabo-launches-new-all-inclusive-object-storage/p1>

## Scaleway

注册 Scaleway 帐号之后可以获得 75 GB 的免费存储空间。
