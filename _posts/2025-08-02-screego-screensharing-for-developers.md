---
layout: post
title: "为程序员而设计的屏幕共享服务：Screego"
aliases:
- "为程序员而设计的屏幕共享服务：Screego"
tagline: ""
description: ""
category: 产品体验
tags: [ screego， screen-sharing， teams， zoom， google-meet ]
create_time: 2025-08-03 17:28:21
last_updated: 2025-08-03 17:28:21
dg-home: false
dg-publish: false
---

或许你曾经有过这样的经历，你想要把自己的屏幕分享给自己的好友或者是工作伙伴，你会发现自己可能需要打开 Microsoft Teams 或者是 Google Meet，然后使用它内建的屏幕分享的功能来分享自己的屏幕。但是这些工具的话，他们要不就是需要你们共同拥有账号，并且打开可能会有几秒钟的延迟，要不就是他们分享的质量会很差，甚至都无法看清自己的屏幕上的文字或者代码。

这就是 Screego 的作者编写这样的一款屏幕分享工具的初衷，作者想要创建一个解决方案，让用户可以通过低延迟的方式轻松地分享自己的屏幕。并且这个工具也只仅仅做一件事情，可以不依赖于任何的其他应用。

## 什么是 screego

Scree Go 是一款使用 Go 语言和 TypeScript 语言编写的开源屏幕分享应用，兼顾高质量、低延迟和易部署，适用于远程协作、在线演示及代码评审等多种场景。

- **多用户共享**， 同一个房间内支持多个观众同时查看演示者的屏幕
- **WebRTC 安全传输**， 全程基于 WebRTC 加密协议保障了数据安全和隐私
- **低延迟、高分辨率**，采用 H.264 视频编码支持低延迟高达 1080p 以上的清晰度
- **一键部署**，可以通过 Docker 或者是单一的二进制文件来安装使用
- **集成了 TURN 服务器**，具体可以查看[官网](https://screego.net/#/nat-traversal)，无需额外的配置，优化不同网络环境下的连接稳定性。
- **可自定义房间 ID** ，随机生成自定义房间标识、支持简单口令模式与全量认证模式。

## 特性

Screego 主打“简单”、“高效”、“安全”三大核心理念：

- 简单易用：基于 WebRTC，无需注册或安装客户端，仅通过浏览器即可发起或加入屏幕共享房间。
- 低延迟高分辨率：采用 WebRTC 点对点传输，集成 TURN 服务器以优化 NAT 穿透，确保多方实时查看时画面流畅清晰。
- 开源免费：GPL-3.0 许可证，源码托管于 GitHub，社区活跃、持续迭代。

相比于企业级视频会议工具，Screego 专注于屏幕共享，不含多余功能，减小了运行体量，降低了部署与运维成本，非常适合技术场景下的轻量级协作。

## 安装

下面我们以 Docker 为例介绍一下最简单的部署流程。

可以参考我的 [docker compose](http://github.com/einverne/dockerfile) 配置文件。

```
cp env .env
docker compose up -d
```

等待服务启动访问本地的 5050 端口即可。

如需开启强制登录，可将 `SCREEGO_AUTH_MODE=all` 写入配置，并通过 `./screego hash -h` 生成用户凭据文件。

更多的配置选项可以参考官网的 [Config](https://screego.net/#/config)。

## 使用流程

- 创建房间：演示者点击“Create Room”，系统随机生成房间 ID（如 slim-tan-weasel），也可自定义；
- 分享链接：将房间 URL 发送给协作者，对方通过浏览器打开即可入场；
- 开始演示：单击“Start Presentation”按钮，选择屏幕或应用窗口，开始实时共享；
- 多视图切换：观众可通过画中画模式，灵活切换主屏与副屏视图提升交互体验；
- 结束会话：关闭浏览器窗口或点击“Leave Room”结束共享。

这种极简操作流程，免除繁琐注册及安装，大幅降低协作门槛，非常适合远程 Pair-Programming、在线 Code-Review 及技术培训场景。
