---
layout: post
title: "iOS 发布 Bundle ID 不可用问题"
aliases:
- "iOS 发布 Bundle ID 不可用问题"
tagline: ""
description: ""
category: 经验总结
tags: [ios, bundle-id, ios-development, flutter, apple-developer]
create_time: 2025-06-18 23:12:20
last_updated: 2025-06-18 23:12:20
dg-home: false
dg-publish: false
---

这两天在发布 iOS 应用到 App Store 的时候，在第一步创建 Bundle ID 的地方就卡住了，这是 iOS 开发过程中的一大坑，所以本文记录一下。

## 什么是 Bundle ID

Bundle ID 是苹果用于标识应用的唯一字符。每一个 iOS 应用都有一个唯一的 Bundle ID，有字符串组成，通常是反向域名的形式，比如 com.domain.appname。

Bundle ID 的作用非常关键，不仅用于区分应用，还用于应用的各种资源，比如推送通知，iCloud，SDK 验证等等。

所以本文下方就展开讲讲我是怎么调入 Bundle ID 重复的坑里面的。

## Bundle ID 重复问题

我开发完成 Flutter 的应用，然后使用 iPhone 真机测试，在 Xcode 中配置并完成了测试之后，想要发布应用，所以想在 Developer 网站创建 Certificates, Identifiers & Profiles 中创建 Bundle ID，然后官方给出了如下的错误：

```
An attribute in the provided entity has invalid value
An App ID with Identifier 'com.domain.xxx' is not available. Please enter a different string.
```

在网上查了一圈，也发邮件问了官方客服，得到的解答都是说 Bundle ID 重复（被占用了），所以无法创建。但是让我疑惑的是我是用我自己的域名反向作为 Bundle ID 的，这个 ID 理论上没有任何会使用。再后来我查到说，如果开发的时候使用过真机做调试，那么 Xcode 会自动生成一个通配符的 Bundle ID，忽略我下面的错误（下面的错误是因为我手动在后台删除了通配符）

![hDMQ1us5XC](https://pic.einverne.info/images/hDMQ1us5XC.png)

而恰恰是这个问题，苹果会将应用的 Bundle ID 给注册上。所以在我们正式发布的时候要去申请 Bundle ID 就申请不下来。所以就两个办法

- 更换 Bundle ID
- 在 Developer 账号中删除测试的账号

客服和网上的解决方法都建议直接更换 Bundle ID，但是我不想更换 Bundle，因为 Play Store 中的应用已经发布了使用了相同的 ID 也好便于管理。所以现在就想能不能联系客服将测试占用的 ID 删除。

网上有人建议直接拨打客服，但是我先尝试了一下通过邮件联系，回复的很快，但是客服说并没有在我的账号下找到被占用的 Bundle ID，所以还是建议我更换 Bundle ID。

## 原因分析

对于我这种情况，大概率是因为我本地调试的时候，Xcode 给我自动注册了一个 Bundle ID。

但是网上还有一些朋友，因为在 Xcode 中同时使用了免费的和付费的帐号，但是在测试的时候无意之间使用免费账户申请了 Bundle ID，那么上架的时候也挺麻烦的。


## 建议
经历了上述的大坑之后，给未来想要开发 iOS 应用的人避坑指南，那就是如果已经确定了当前应用的 Bundle ID，请第一时间到 Apple 开发者页面注册该 Bundle ID。

基于上面的调查，现在我的解决方案要不就是更换 Bundle ID，要不就是等待现在的 Provision Profile 过期，然后重新注册，但是官方没有任何信息说过期多久可以注册。根据一些博主的分享，说如果临时被注册，大约 1 周左右临时的 Profile 会过期。
