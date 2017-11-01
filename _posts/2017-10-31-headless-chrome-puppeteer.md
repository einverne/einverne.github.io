---
layout: post
title: "headless chrome puppeteer"
tagline: ""
description: ""
category: 学习笔记
tags: [Chrome, Headless Chrome]
last_updated: 
---

Headless 最早的时候在 PhantomJS 听说过这个概念，后来在 GitHub 各种项目中总有人不断提起这个概念，而最新看到的新闻便是 Chrome 开始支持 Headless，也正激起了我了解的欲望。

## 什么是 Headless Chrome 

Headless Chrome 是一个没有前台界面，只在后台运行的浏览器。浏览器正常的所有解析，渲染都可以由其完成。而开发者可以通过 client 和这个浏览器建立连接，通过 Google 提供的 Chrome DevTools Protocol [协议](https://chromedevtools.github.io/devtools-protocol/) 来进行交互。总的来说 Headless 浏览器提供了可编程化的浏览器工具，一切通过人工在 Chrome 中完成的事情，都可以通过编程来在 Headless Chrome 中实现。

Headless Chrome 和 Chrome 59 一起发布，Headless Chrome 将 Chromium 和 Blink 渲染引擎提供的现代WEB平台的特性带到了命令行。

Headless 浏览器能够提供自动化测试环境，服务于不需要UI界面的服务端。比如说你想要测试一个网页在真实的浏览器中的显示，并保存成PDF。


## 使用
在 Linux 下，我的 Chrome 安装在 `/opt/google/chrome/` 目录下，创建一条 alias

	alias chrome='/opt/google/chrome/chrome'

### 打印 DOM 结构
使用 `--dump-dom` 将文件内容打印到标准输出

	chrome --headless --disable-gpu --dump-dom https://www.einverne.info/

### 将网页保存为 PDF
使用 `--print-to-pdf` flag 将网页文件保存成 pdf

	chrome --headless --disable-gpu --print-to-pdf https://www.einverne.info

### 保存截图
使用 `--screenshot` flag 保存截图

	chrome --headless --disable-gpu --screenshot https://www.einverne.info

使用 `--window-size` 来指定窗口大小

	chrome --headless --disable-gpu --screenshot --window-size=1280,1920 https://www.einverne.info

使用 `--screenshot` 会在当前目录下生成一个名为 `screenshot.png` 的图片文件。

## Debugging Chrome without UI
使用 `--remote-debugging-port=9222` flag 来启动 Chrome 时，Headless Chrome 会开启 [DevTools protocol](https://chromedevtools.github.io/devtools-protocol/) 。使用该协议可以用来和 Chrome 通信，并使用指令来操作 Headless Chrome。因为没有界面，可以使用另外的浏览器访问 `http://localhost:9222` 来查看 Headless Chrome 的状态。

## reference

- <https://developers.google.com/web/updates/2017/04/headless-chrome>
