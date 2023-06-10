---
layout: post
title: "macOS 上的清理工具整理合集"
aliases:
- "macOS 上的清理工具整理合集"
tagline: ""
description: ""
category: 整理合集
tags: [macos, cleanup, mac, gdu, linux, disk-space]
create_time: 2023-06-10 11:18:13
last_updated: 2023-06-10 11:18:13
---

最近 macOS 系统磁盘空间告急，之前就出现过因为磁盘空间不足导致系统卡顿还出现[突然黑屏](/post/2021/03/repair-macos-smc-nvram.html)的状态，所以这次就看到还剩余几十个 GB 的时候就开始清理工作了。清理的同时顺便就整理一下常用的几个清理工具。

## 如何发现大文件

在清理之前首先要对本地磁盘文件做一个整体的了解，虽然 macOS 自带一个存储管理的查看面板，但是实在是太简陋，也只能提供非常简单地查找大文件的工具。

![A14X](https://photo.einverne.info/images/2023/06/10/A14X.png)

比如说从系统提供的 Storage 预览中能看到 Documents 占用的空间最多，可以点开后面的圆形 i 图标，可以看到其中占用空间很大的几个文件。

![ACei](https://photo.einverne.info/images/2023/06/10/ACei.png)

比如说对于我，就是我安装的两个虚拟机占用了比较多的空间，但这也是预想之内的。

### gdu

上面的方式只能找出来系统中的大文件所在，如果我想知道每一个文件夹所占用的空间大小，我之前的文章中介绍过[gdu](/post/2021/07/gdu-fast-disk-usage-analyzer.html) ，这个时候就派上了用场。

```
brew install gdu
```

然后直接对想要统计的目录运行 `sudo gdu ~/`

![ARx8](https://photo.einverne.info/images/2023/06/10/ARx8.png)

## 几款 macOS 上的清理工具

- [[Clean My Mac]] 收费软件
- [[Pretty Clean]] 免费
- [[App Cleaner]] 免费，卸载应用
- [[Clean Me]] 清理磁盘

## Pretty Clean

[PrettyClean](https://www.prettyclean.cc/) 是一款 macOS 上的免费清理工具，界面非常简单。

![AW10](https://photo.einverne.info/images/2023/06/10/AW10.jpg)

## App Cleaner

[App Cleaner](https://freemacsoft.net/appcleaner/) 是一款可以用来快速卸载应用以及应用相关残留文件的应用，非常小巧，但是非常强大。

![AdJ6](https://photo.einverne.info/images/2023/06/10/AdJ6.png)
