---
layout: post
title: "Arc 浏览器初印象"
aliases:
- "Arc 浏览器初印象"
tagline: ""
description: ""
category: 产品体验
tags: [ arc, browser, chrome, vivaldi,  ]
create_time: 2022-09-30 16:01:13
last_updated: 2022-09-30 16:01:13
---

很早之前就在 Twitter 上看到有人分享了 Arc 浏览器的使用体验，说是非常惊艳，我就稍微的浏览了一下官网，抱持怀疑的态度先注册了一下体验，一直好奇到了 2022 年能够在浏览器上做出什么样的创新，自 Chrome 横空出世以来，快，安全迅速抢占了浏览器市场。剩下的一点点份额被 Firefox，Safari，Edge，[[Vivaldi]] 等等占据，早两年的时候我也写过一篇标题略微耸动的文章 ---- [我可能要抛弃用了很多年的 Chrome 改用 Vivaldi](/post/2019/07/replace-google-chrome-with-vivaldi.html) ，但事实是 3年多过去了，我日常用的还是 Chrome，虽然 Google 在浏览器插件，隐私等等问题上这两年来一直被诟病，但至少还没有彻底地激怒我这个用户。

但可能也是 Google 作为一家广告公司，这个背景实在会让人产生一些敬畏。所以这些年 Chrome 也面临了越来越多的挑战，不管是大企业的 Edge，Safari，亦或是初创企业的，比如本文的主角 [Arc Browser](https://thebrowser.company/) ，或者注重隐私的 [Orion](https://browser.kagi.com/) ，或者在 UI 交互上做创新的 [Sidekick](https://www.meetsidekick.com/) ， [SigmaOS](https://sigmaos.com/) ，都给浏览器发展一些新的思路。这么多年过去 Chrome 还能克制能够抱持整体风格的简洁，并且让地址栏发展成为 [Omnibox](https://www.chromium.org/user-experience/omnibox) ，Chrome 几乎成为了我的 [开机应用](/post/2017/12/most-useful-chrome-shortcut.html) ，并且借助 Chrome Extension 的生态，以及这些年 Web 技术的发展，在浏览器中能做的事情越来越多，很多 Native 的应用也越来越多地被替换成 Web 应用。这一次体验 Arc 最让我惊艳的就是一些应用，比如 Notion 在 Arc 中的体验就像是 Notion 本地应用一样（虽然 Notion 发布的本地应用就能就是套了一层壳而已）。

## 初上手

- 非常亮眼的视觉设计
- 友好的提示，正是因为交互元素上做出了一些调整，所以即使是用惯了传统浏览器的用户也需要经过导览才能使用，传统的在上方的地址栏被调整到侧边

## 新特性

### Space
最开始让我想要了解的功能就是 Space，侧边栏通过双指滑动可以创建新的 Space， 也可以通过下方的 `+` 号来创建，但是使用之后体验上就感觉是分组的标签页。

### Easel
Arc 内建了一个画板，可以做笔记，剪切网页图片，这就相当于内嵌了一个素材收集工具。在地址栏边上的截图小工具的交互设计做的确实不错，可以根据页面内容动态调整要截取的内容。

Easel
![arc-easel](https://photo.einverne.info/images/2022/10/01/zBeD.png)

### Library
在侧边栏还有一个 Library 的概念，在 Library 中会展示下载，桌面等等文件夹，其中还包括了 Arc 独有的 存储 Easel 画板的地方，存储在 Arc 中抓取的网页截图。

Library
![arc-library](https://photo.einverne.info/images/2022/10/01/z04H.png)

### 分屏

## 一些快捷键
大部分的快捷键，和使用 Chrome 都是一致的，打开标签页 Cmd+T, 关闭标签页 Cmd+w，恢复关闭的标签页 Cmd+Shift+t， [更多]()

但 Arc 引入的新功能必然带来新的快捷键，这里就列举一些常见的，全部的快捷键还是查看其官网，或 Cmd+， 查看吧

- `⌘+s`  锁定或隐藏侧边栏
- `Ctrl+Tab` 切换标签页
- `Ctrl+Shift++` 创建垂直分屏

## 一些问题

### 注册问题

如果在注册的时候遇到 「Unknown server error」 的错误

![arc browser register unknown server error](https://photo.einverne.info/images/2022/10/01/zQD3.png)

那么可能是网络无法访问 Arc 的服务，这个问题我在之前体验 [Warp 终端](/post/2022/03/warp-terminal-usage.html) 的时候也遇到了，现在出现的这些产品都喜欢在开篇的时候让用户注册账号使用，但是在国内的这种网络环境下就会遇到各种奇葩的问题。解决办法也非常简单，直接开启 [系统全局代理](https://docs.gtk.pw/contents/macos/cfw.html) ，或者去一个没有 GFW 的地方。这里推荐使用 [Clash for Windows](https://docs.gtk.pw/contents/macos/cfw.html)

### 进度条问题
在 Chrome 中打开网页，我会看去 Tab 上状态，在加载的时候会有 Loading 的转圈，而在 Vivaldi 中则是更加明显的地址栏中会有色彩进度条，我会明确知道这个页面是正在加载的状态，而使用 Arc 第一个感到不适的就是当网络环境比较慢的时候，会有很长一段时间整个页面是空白状态，如果隐藏侧边栏最上方的地址栏就完全不知道是这个网站出错了还是网络有问题。虽然 Arc 刻意隐藏了所有「不必要」的内容，但却也带来了一些使用上的不便。

### 卡顿问题
相同的环境下，Chrome 从来没有发生过页面或交互中间出现卡顿的情况，但是 Arc 使用过程中隔一会儿就会出现。虽然看别人演示的时候都非常流畅，但是就我个人的使用来说这一点是无法忍受的，尤其是当我想打开标签页，快速输入一些内容进行查找时，这个延迟非常明显。

## 总结
今天花了一段时间体验了一下 Arc，总体来说视觉上，交互上确实带来了一些新鲜感，但似乎目前还不能被我设为默认浏览器，虽然分屏，Space 等等确实给浏览器交互带来了一些新的启发，但对于我而言这些功能并没有那么不可代替。所以短时间内我还是会继续用 Chrome，不过时常回来关心一下 Arc，看能不能带来一些划时代的革新。

如果你也想体验，可以去 [官网](https://thebrowser.company/) 申请。或者使用我的[邀请](https://arc.net/gift/ee1cf48a)。

