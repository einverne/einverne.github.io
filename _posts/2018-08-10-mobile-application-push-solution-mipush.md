---
layout: post
title: "应用消息推送解决方案 MiPush"
tagline: ""
description: ""
category: 学习笔记
tags: [mipush, android, ios, push, notification, ]
last_updated:
---

Android 中实现消息推送的主流方案有下面几种。

方案                    | 原理        |  优点                                     | 缺点
------|------|----|----
Cloud to Device Messaging，云端推送，是 Android 系统级别的消息推送服务（Google 出品） | Push  | 简单的、轻量级的机制，允许服务器可以通知移动应用程序直接与服务器进行通信，以便于从服务器获取应用程序更新和用户数据 | 依赖于 Google 官方提供的 C2DM 服务器，需要用户手机安装 Google 服务
轮询   |  基于 Pull 方式 |  实时性好 |  成本大，需要自己实现与服务器之间的通信 ; 到达率不确定，考虑轮询的频率：太低可能导致消息的延迟；太高，更费资源
SMS 信令推送 | Push |   完全的实时操作 | 成本高
第三方平台 | Push 小米推送、华为推送 友盟推送、极光推送、云巴（基于 MQTT） 阿里云移动推送、腾讯信鸽推送、百度云推送 | 成本低，抵达率高 | 安全性低，服务会被杀


