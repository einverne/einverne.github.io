---
layout: post
title: "使用 lux 下载哔哩哔哩视频"
aliases:
- "使用 lux 下载哔哩哔哩视频"
tagline: ""
description: ""
category: 经验总结
tags: [ lux, bilibili, annie, video, 视频下载 ,  ]
last_updated:
---

Lux 是一个使用 Go 语言编写的视频下载命令行工具，支持的平台很多，提供了包括 macOS、Windows、Linux 等等平台的命令行支持，安装和使用非常简单的。Lux 原来的名字是叫做 Annie（安妮），对标的是 macOS 上一款非常著名的视频下载软件叫做 [[Downie]]（唐尼）[荔枝数码正版授权](https://store.lizhi.io/site/products/id/280?cid=qosceb4f)。但后来改名成了 Lux。

Lux 支持非常多的视频网站：抖音、哔哩哔哩、半次元、pixivision、优酷、YouTube、爱奇艺、芒果 TV、Tumblr、Vimeo、Facebook、斗鱼视频、秒拍、新浪微博、Instagram、Twitter、腾讯视频、网易云音乐、音悦台

项目地址：<https://github.com/iawia002/lux>

## Installation
macOS 下：

    brew install ffmpeg
    brew install lux

或者从 [Release](https://github.com/iawia002/lux/releases) 页面下载，手动安装。

    curl "https://github.com/iawia002/lux/releases/download/v0.15.0/lux_0.15.0_macOS_64-bit.tar.gz"

### Ubuntu 下安装

    sudo apt install ffmpeg
    wget "https://github.com/iawia002/lux/releases/download/v0.15.0/lux_0.15.0_Linux_64-bit.tar.gz"
    tar zxvf lux_0.14.0_Linux_64-bit.tar.gz
    sudo mv lux /usr/local/bin
    lux --help

## 使用

### 直接下载

Lux 的使用很简单，在终端：

    lux "https://www.youtube.com/watch?v=QJXPS0gQ6Eg"
    lux "https://www.bilibili.com/video/BV1ZJ411h713"

视频链接给的是播放列表里的第二个视频。如果用 youtube-dl 下载会自作主张地下载播放列表的第一个视频。在对付 B 站播放列表方面，Annie 比较乖一点。

Annie 不仅可以下载视频，如果给的是图片的网址，它就下载图片。

给播放列表的链接就下载播放列表：

### 下载不同分辨率
首先使用 `-i` 参数查看可供下载的视频分辨率，`-i` 参数可以一次添加多个视频链接，空格分隔。

```
❯ lux -i "https://www.bilibili.com/video/BV1ZJ411h713"

 Site:      哔哩哔哩 bilibili.com
 Title:     【中字】金世正 talk演唱会 全场 非常治愈的谈话
 Type:      video
 Streams:   # All available quality
     [64-7]  -------------------
     Quality:         高清 720P avc1.640028
     Size:            122.36 MiB (128300684 Bytes)
     # download with: lux -f 64-7 ...

     [32-12]  -------------------
     Quality:         清晰 480P hev1.1.6.L120.90
     Size:            108.75 MiB (114028043 Bytes)
     # download with: lux -f 32-12 ...

     [64-12]  -------------------
     Quality:         高清 720P hev1.1.6.L120.90
     Size:            108.57 MiB (113847391 Bytes)
     # download with: lux -f 64-12 ...

     [16-7]  -------------------
     Quality:         流畅 360P avc1.64001E
     Size:            86.10 MiB (90287066 Bytes)
     # download with: lux -f 16-7 ...

     [32-7]  -------------------
     Quality:         清晰 480P avc1.64001F
     Size:            67.43 MiB (70708693 Bytes)
     # download with: lux -f 32-7 ...

     [16-12]  -------------------
     Quality:         流畅 360P hev1.1.6.L120.90
     Size:            67.40 MiB (70670783 Bytes)
     # download with: lux -f 16-12 ...
```

然后使用 `-f` 来指定要下载的分辨率：

    lux -f 64-7 https://www.bilibili.com/video/BV1ZJ411h713

### 下载列表
使用 `-p` 来下载视频列表。

如果要指定列表中的位置，可以使用如下几个选项：

- `-start` 从视频列表的第几个开始下
- `-end` 下载到几个
- `-items` 指定要下载哪几个，比如 1,5,6,8-10
- `-eto` B 站独有的参数，用于没有标题只有文件名的播放列表

举例：

    lux -p -start 1 -end 15 "https://www.bilibili.com/video/BV1no4y1C7oo"

### 从文件中读取下载链接
可以使用 `-F` 参数，从包含视频 URL 的文本文件中下载视频：

```
lux -F /path/to/links.txt
```

这里也可以用参数 `-start`、`-end` 和 `-items`。

按住 `ctrl+c` 可以中断下载，可以续传。

B 站上可以用 av 和 ep 加数字下载视频，比如：

    annie -i ep198381 av21877586

还有三个参数也很有用：

### 指定保存路径
可以使用 `-o` 参数后面接路径，来指定将视频保存到该路径下：

    lux -o ~/Videos/ URL

使用 `-O NAME` 来指定输出的名字。

### 输出 JSON
可以使用 `-j` 输出 JSON 格式结果。

## related

- 最出名的 [[youtube-dl]] 还有升级版的 [[yt-dlp]]
- 适配比较多国内的 [[视频下载工具 you-get]]
- Go 语言写的视频下载命令行工具 [[lux]]
- C# 编写的 B 站下载 [BBDown](https://github.com/nilaoda/BBDown)
