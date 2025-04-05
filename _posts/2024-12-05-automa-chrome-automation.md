---
layout: post
title: "Automa Chrome 下的自动化工具"
aliases:
- "Automa Chrome 下的自动化工具"
tagline: ""
description: ""
category: 产品体验
tags: [ automa, chrome, chrome-extension, open-source ]
create_time: 2025-03-29 22:53:47
last_updated: 2025-03-29 22:53:47
dg-home: false
dg-publish: false
---

我之前介绍过不少的自动化工具，比如 macOS 上的自动化工具 [Hammerspoon](https://blog.einverne.info/post/2020/11/mac-application-hammerspoon-automation-tool.html)，开源的自动化工作流 [n8n](https://blog.einverne.info/post/2021/08/n8n-personal-automation.html)，还有非常多的编程自动化的工具，当然编程天然的适合自动化，[运维自动化 Puppet](https://blog.einverne.info/post/2025/03/puppet.html)，应用自动化发布 [Fastlane](https://blog.einverne.info/post/2025/02/fastlane-flutter-project-release.html)，还有很多 CI/CD 的工具，但是今天想要介绍一款使用简单，安装方便的基于浏览器的自动化应用 [Automa](https://www.automa.site/)。

Automa 是一款免费的浏览器扩展程序，专为简化和自动化网页操作而设计。它支持在 Chrome 和 Firefox 浏览器中运行，通过直观的拖放式界面，用户可以创建自定义工作流来完成各种任务，例如表单自动填写、数据抓取、网页交互等。

在没有 Automa 之前，还有很多基于网页的自动化工具，比如 [[Selenium]]，[[Puppeteer]]，[[Playwright]]，[[Helium]]，[[Cypress]]，但是这些框架和工具基本上都依赖于编程，面向的应用场景大部分也都是编程开发，网页自动化测试等等，必须会安装依赖，有一定的编码基础才能真正跑起来。但是 Automa 则只需要通过鼠标点击，拖拽就可以快速实现一个基于网页的自动化工作流。

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=114249854620167&bvid=BV1j2ZqYJEWh&cid=25778134416&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

[Bilibili](https://www.bilibili.com/video/BV1j2ZqYJEWh/) | [YouTube](https://www.youtube.com/watch?v=uD6uGl5WNsU)

## 安装

可以直接在[应用商店安装](https://chromewebstore.google.com/detail/automa/infppggnoaenmfagbfknfkancpbljcca)，也可以通过[源代码](https://github.com/AutomaApp/automa)编译安装。

```
git clone https://github.com/AutomaApp/automa.git && cd automa

# 安装依赖
yarn install

# 构建插件
yarn build

yarn build:zip
```

## 使用

Automa 官方市场中默认也提供了很多官方和用户分享的工作流，可以直接在页面导入使用。

![Jia1NDhLDo](https://pic.einverne.info/images/Jia1NDhLDo.png)

在开始之前想先介绍一下什么是工作流，在 Automa 中工作流指的是由 Block 以及连接组成的一系列的自动化流。

> Workflow is a collection of connected blocks to automate a process.

![DmsZRVCt-7](https://pic.einverne.info/images/DmsZRVCt-7.png)

## 用例

- 自动进行 Google 搜索
- 签到打卡
- 下载 TikTok
- 给当前活动页截图
