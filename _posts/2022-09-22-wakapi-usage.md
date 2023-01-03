---
layout: post
title: "使用开源 Wakapi 代替 WakaTime 统计编码时间"
aliases:
- "使用开源 Wakapi 代替 WakaTime 统计编码时间"
tagline: ""
description: ""
category: 经验总结
tags: [ wakatime, wakapi, code, programming, self-hosted, linux, docker ]
create_time: 2022-09-20 01:44:36
last_updated: 2022-09-22 02:55:22
---

之前折腾 GitHub Profile 的时候发现了 [[WakaTime]] 这样一款统计编码时间的工具，之后在读 [waka-readme](https://github.com/athul/waka-readme) 项目的时候发现，还有两个完全开源的后端兼容版本，一个是 Golang 编写的 [[wakapi]] ，一个是 Huskell 编写的 [hakatime](https://github.com/mujx/hakatime) 。这篇就来总结一下我使用 wakapi 的过程。

wakapi 是一个兼容 [[WakaTime]] 的可自行架设的后端程序，和 WakaTime 一样可以用来统计代码。

- GitHub: <https://github.com/muety/wakapi>

## Installation

使用 [docker-compose](https://github.com/einverne/dockerfile/tree/master/wakapi) 安装。

直接 clone 项目，修改环境变量，然后启动即可。

```
git clone https://github.com/einverne/dockerfile.git
cd dockerfile/wakapi/
cp env .env
# edit .env setup SALT and WAKAPI_DATA
# SALT 可以执行命令 cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w ${1:-32} | head -n 1
# WAKAPI_DATA 配置一个本地可读写的路径
docker-compose up -d
```

我的配置中没有暴露 3000 端口，我是和 [Nginx Proxy Manager](/post/2022/02/nginx-proxy-manager.html) 一起使用的，在 Nginx Proxy Manager 后台，配置一个 HOST，设置 `wakapi:3000` ，然后去 [[Cloudflare]] 后台将域名 `wakapi.einverne.info` 设置一个 A 记录指向 Nginx 所在的服务器。等待 DNS 生效，访问后台 `wakapi.einverne.info` 后台即可。

我个人会一直使用 <https://wakapi.einverne.info> 服务，所以如果你感兴趣，也可以直接使用这个服务。

服务启动之后，注册登录，然后就可以配置编辑器插件，把 IntelliJ IEDA，[[VSCode]]，[[Vim]] 先配置上。这部分可以直接查看 WakaTime 的官方文档。

编辑客户端配置 `~/.wakatime.cfg` ，因为使用 Self-hosted 的后端，所以需要设置 `api_url` 。`api_key` 则从后台获取即可。

```
[settings]
api_url=https://wakapi.einverne.info/api
api_key=b5b0xxx
proxy=
debug=false
status_bar_enabled=true
```

## 在 Obsidian 中使用 WakaTime

今天偶然在浏览 Obsidian 插件库的时候发现了 [WakaTime](https://github.com/wakatime/obsidian-wakatime) 的插件，安装之后就和编程 IDE 一样，会直接使用 HOME 目录下的配置。所有的数据都可以完美的上传到 Wakapi 的后台。

## GitHub Actions

- [waka-readme](https://github.com/athul/waka-readme)
- [waka-readme-stats](https://github.com/anmol098/waka-readme-stats)
