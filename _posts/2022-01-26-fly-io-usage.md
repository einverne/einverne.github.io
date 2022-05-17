---
layout: post
title: "Fly.io 使用体验"
aliases: 
- "Fly.io 使用体验"
tagline: ""
description: ""
category: 学习笔记
tags: [ flyio, netlify, vercel, deploy,  ]
last_updated:
---

Fly.io 是一个应用部署平台，和 [[Netlify]]、[[Vercel]] 不同之处在于 Fly.io 提供了数据库，这就使得在线托管一个小型动态网站成为了可能。Fly.io 是一个 [[Y combinator]] 孵化的[项目](https://www.ycombinator.com/companies/fly-io)。

## 关于收费
Fly.io 是提供一定限额的免费使用额度的，他们的目标就是让小型的应用可以免费运行，而在需要扩展的时候支付一定的费用，而这笔费用也不会太昂贵。Fly.io 的应用会根据使用情况单独计费。

Fly.io 会根据单个用户或者组织计费，官方也说了，如果想要更多免费的应用，那么你可以创建多个组织。

### 免费限额

| 分类           | 限额                                   | 说明                                            |
| -------------- | -------------------------------------- | ----------------------------------------------- |
| VM: shared-cpu | 每个月 2340 小时                       | 可以全天候运行 3 个 256 MB 内存的共享 CPU 的 VM |
| Volumes        | 3GB                                    | 提供 3GB 永久存储                               |
| Bandwidth      | 160 GB/每月                            | 根据各个地方不同分别计算 outbound 流量          |
| Anycast IPs    | 无限的 IPv6, 每一个活跃的应用一个 IPv4 | 每一个额外的 IPv4 地址需要额外每个月 $2         |
| Certificates   | 10 个活跃的证书                        | 最多 10 个证书       |

亚洲和印度免费流量是 30G，美国和欧洲是 100G。

更加具体的价格可以参考[官网](https://fly.io/docs/about/pricing/)。

需要注意的是 Fly.io 需要绑定信用卡之后才能使用。


## 原理
Fly 根据其官网的简介可以看到其也是借助了 Docker，用户编写代码，并用其提供的工具打包成 Docker 镜像，然后部署到 Fly 的平台上，之后就是 Fly 平台处理的事情了。本质上来说 Fly 就是提供了一个平台化的容器运行时环境。

这个服务有点像是之前那篇文章介绍的 [PikaPods](/post/2022/01/pikapods-docker-container-as-service.html)，区别在于 Fly.io 允许用户自己编写代码部署，而 PikaPods 则是提供了现成的服务，简化了用户用命令行部署的过程。

具体的上手过程可以完全参考[这篇官方的文档](https://fly.io/docs/hands-on/start/)。


### 几个重要的命令

每一个 Fly 应用都需要一个 `fly.toml` 来告诉系统如何部署这个服务。`fly.toml` 会通过 `flyctl launch` 自动生成。

然后可以通过 `flyctl deploy` 来部署。

#### 查看部署的应用
通过 `status` 命令查看详情：

    flyctl status

```
❯ flyctl status
App
  Name     = evhellofly          
  Owner    = personal            
  Version  = 0                   
  Status   = running             
  Hostname = evhellofly.fly.dev  

Deployment Status
  ID          = 7b99844a-c4be-5193-eac3-e5aaxxxxx3f3         
  Version     = v0                                           
  Status      = successful                                   
  Description = Deployment completed successfully            
  Instances   = 1 desired, 1 placed, 1 healthy, 0 unhealthy  

Instances
ID      	PROCESS	VERSION	REGION	DESIRED	STATUS 	HEALTH CHECKS     	RESTARTS	CREATED    
b164cc3d	app    	0      	nrt   	run    	running	1 total, 1 passing	0       	11m57s ago	
```

#### 打开应用

    flyctl open


## reference

- <https://fly.io/docs/getting-started/static/>