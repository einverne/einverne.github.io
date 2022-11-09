---
layout: post
title: "使用 PikaPods 一键搭建属于自己的在线服务"
aliases: 
- "使用 PikaPods 一键搭建属于自己的在线服务"
tagline: ""
description: ""
category: 产品体验
tags: [ self-hosted, pikapods, docker, container, freshrss,  ]
last_updated:
---

在逛 [LET](https://lowendtalk.com/) 的时候偶然间发现了一款叫做 [PikaPods](https://www.pikapods.com/) 的在线服务，看到作者将 Docker 容器作为一个服务出售给用户，并且当前注册用户可以免费享有一年的使用时间于是就试用了一下。[[PikaPods]] 是一个将容器平台化的网站，可以非常方便的一键搭建开源的服务。我只花了不到一分钟的时间就在 PikaPods 中搭建了一个 [[FreshRSS]] 服务，并且导入我的 1000 多条阅读源抓取效果也非常不错。

- <https://www.pikapods.com/>

PikaPods 现在注册免费提供 3 个 Pods 以及 50GB 空间的存储。目前支持一些非常常用的服务：[^1]

[^1]: <https://www.pikapods.com/apps>

- [[ArchiveBox]] 我之前也自己用 docker 搭建了一个
- [[Changedetection.io]] 网页服务变动检测
- [[Gitea]] 一个代码托管服务，这个是我之前自己用的 Gogs 的升级版
- [[FreshRSS]] 一个 PHP 编写的在线 RSS 阅读器
- [[Homer]] 一个可配置的在线静态导航页面
- [[Jupyter]] 基于网页的 Python 交互式开发环境，笔记
- [[NextCloud]] 文件同步工具
- [[Navidrome]] 音乐文件在线串流服务
- [[PhotoPrism]] 基于 AI 的在线照片工具
- [[Umami]] 一个 [[Google Analytics]] 的代替方案
- [[uptime-kuma]] 服务在线情况检测 

PikaPods 的背后团队 [peakford](https://www.peakford.com/) 之前就推出过 [[BorgBase]] 的备份存储服务，并且一直在贡献 Borg 的开源客户端 [[Vorta]]。

![pikapods dashboard](/assets/pikapods-dashboard-20220130205323.png)

关于收费情况，在当前测试环境是注册用户拥有一年的免费使用。之后的收费需要看具体的使用场景，另外 PikaPods 明确提到了相关的收入最后会回馈给这些开源服务的作者，分成比例大概在 10%~20% 左右。我觉的这个是我目前能想到的最好的开源社区回馈作者的方式了，像是 Amazon 那样直接将开源项目拿走的方式可能并不适合目前这类需要一定云服务基础设施的项目。如果 PikaPods 进入一个良性循环，那么我想大部分的 self-hosted 项目都可以被纳入进来。

## 为什么推荐 PikaPods
买一台 VPS 自己用 docker 和 [docker-compose](https://github.com/einverne/dockerfile) 来搭建和管理这些服务其实也非常简单，但唯一需要让我顾虑的就是安全性和数据备份。

### 安全性
如果完全由自己维护和更新，那么比如 log4j 这类型的大型漏洞我个人可能还会关注到，但是如果遇到没有那么严重的漏洞，极有可能造成我的 VPS 安全性问题。如果有专业的人员去管理这些服务，以及可能出现的异常，那么可能会比我个人管理强一些，毕竟我个人的精力是有限的

### 数据安全性
如果是我个人使用 VPS 搭建，那我所做的就是将 Docker 容器的数据 mount 到一个目录，然后定时使用 crontab 执行备份脚本，压缩并 rsync 到我的备份数据服务器上。

在 PikaPods 中，同样可以使用 SFTP，将 mount 的文件夹备份到其他服务器，不会锁定在这个平台上，使用起来也不会有后顾之忧。即使未来某一天 PikaPods 不再运维，那么也可以将数据 dump 到自己的服务器上使用 Docker 完全恢复一份一样的服务。

## 数据备份和存储

PikaPods 可以使用 [[SFTP]] 将数据备份出来，即使以后不再使用 PikaPods 那也只需要将数据挂载在 Docker 容器上直接使用即可。

中途遇到一点 SFTP 连接的问题，给作者反馈之后也非常快速的得到了响应，原来是我本地 SSH 配置的问题。 一定记得如果本地配置了 SSH，那么一定要记住记得使用密码，否则 SSH 会使用本地的 KEY 去尝试登录，多次错误之后可能会被服务端拒绝。

Linux 下可以使用命令登录 SFPT：

    sftp -o PreferredAuthentications=password -o PubkeyAuthentication=no username@xxx.pikapod.net


## 简单使用总结
注册账后之后，我直接使用了我常用的 FreshRSS，在后台查看数据，我使用了 2 CPUs，2G Memory，10GB 空间，实际运行的时候只占用 2~3% CPU，内存使用在 7% 左右，空间不到 100 MB。


## 目前存在的问题
目前 PikaPods 只提供欧洲和美国的服务，也就是这个服务会部署到这两地的服务器上，这也就意味着当前某些地方的连接速度可能不是非常可靠。但就我个人的使用情况来看，加上[代理](https://board.gtk.pw) 阅读 RSS，上传照片连接速度也还是非常不错的。平均延迟在 150ms 左右。


