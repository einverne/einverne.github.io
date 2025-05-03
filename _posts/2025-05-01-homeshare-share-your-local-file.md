---
layout: post
title: "HomeShare 让本地电脑文件夹成为文件分享服务器"
aliases:
- "HomeShare 让本地电脑文件夹成为文件分享服务器"
tagline: ""
description: ""
category: 经验总结
tags: [homeshare, self-hosted, golang, file-sharing, dockerfile]
create_time: 2025-05-01 17:43:20
last_updated: 2025-05-01 17:43:20
dg-home: false
dg-publish: false
---

前些天出门拍了很多照片，回来从 SD 卡导出之后就想有一个可以快速一键分享出去的方法，通过微信传，虽然可以通过笔记[一次发送超过 9 张图片](https://blog.einverne.info/post/2024/05/wechat-send-over-nine-photos.html)，但是还是需要将照片上传到微信的笔记里面，虽然我之前也有使用自己的[在线图库](https://photo.einverne.info)，但依然避免不了上传等待的过程，并且如果照片比较大时，等待的时间会很长。所以这几天我一直再想能不能有一个方法可以直接将本地的文件夹共享出来，或者直接让别人将图片一次性发送到我本地。

刚好今天就发现了这样一款使用 Go 语言编写的文件服务器 HomeShare，可以直接将本地文件夹共享出来作为一个私人存储空间。

## HomeShare

[HomeShare](https://github.com/jugeekuz/HomeShare) 是一个使用 Go 语言 TypeScript 编写的家用文件服务器，可以直接在本地电脑上运行起来，并通过 Cloudflare 提供的 DDNS，暴露一个域名，即使没有公网 IP，也可以直接通过域名来访问自己的磁盘空间。HomeShare 还支持用户名和密码，来确保数据安全。还可以为文件或者文件夹设置临时分享链接，方便和朋友家人共享。

## 部署

推荐使用 Docker Compose 来一键部署。

### 前提条件

- 一台可以运行 docker 以及执行 Docker compose 的机器
- Cloudflare 帐号以及一个可用的域名，用于 DNS 管理和 SSL 证书发行

### 配置 Cloudflare DNS

- 首先登录 Cloudflare，找到域名，然后记录 Zone ID 和 Account ID。
- 然后创建 DNS 记录
  - A 记录，指向任意占位 IP，比如 192.0.0.1
  - CNAME 记录，api 指向 @
- 确保云朵图表已经开启
- 获取 Cloudflare API Token
  - 进入 Cloudflare 个人资料，API Token，创建 Token
  - 使用 Edit DNS 模板，或者自定义权限，勾选 Zone.Zone: Read, Zone.DNS: Edit ，仅限选择的域名
  - 保存生成的 Token
- 如果路由器支持配置静态 IP，以及端口转发，可以配置将公网 443 端口转发到主机的 443 端口

获取项目源码

```
git clone https://github.com/jugeekuz/HomeShare.git
cd HomeShare
```

在根目录创建 `.env` 文件，然后配置 Cloudflare，数据库，存储路径，管理员信息等。

然后打开 `traefik/traefik.yml` 文件，将邮箱修改为自己的邮箱。

然后构建并运行服务

```
docker compose up -d --build
```

等待服务启动，之后就可以在浏览器输入域名进行访问。
