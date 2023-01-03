---
layout: post
title: "发布和制作 torrent 文件"
aliases:
- "发布和制作 torrent 文件"
tagline: ""
description: ""
category: 经验总结
tags: [torrent, mktorrent, tracker, private-tracker, transmission, rtorrent ]
create_time: 2022-09-02 09:59:16
last_updated: 2023-01-02 09:59:16
---

本文主要总结和记录一下制作和发布 torrent 的过程。

## 制作种子文件

制作一个种子文件的方式有很多，熟悉命令行的朋友可以直接使用命令行制作，如果在 Windows，或 macOS 下的朋友也可以使用 UI 界面，或相关的工具来制作。

种子文件是用来维护和协调文件下载和分享的一种文件格式。这种文件通常包含了文件的哈希值（即校验和）、文件名和文件大小等信息，以及用于协调文件下载的若干个服务器的地址。这些服务器的地址被称为 trackers。

在 BitTorrent 协议中，trackers 用于协调客户端之间的文件分享。当一个用户想要下载文件时，他可以打开种子文件并把其中的 tracker 服务器地址提交给客户端。客户端会向这些 tracker 服务器发送请求，然后 tracker 服务器会返回一组已经下载了文件的客户端地址。客户端可以通过这些地址找到其他已经下载了文件的用户，并从他们那里获取文件。

在制作种子文件的过程中有几个概念需要提前了解一下：

- Trackers，协调客户端之间的文件分享
- Private，种子文件中有一个 Private 标志，文件 Private 设置为 True 则表示文件的下载和分享只能在特定的 tracker 服务器或客户端之间进行

### 命令行制作种子

通过命令行制作种子，可以参考 [这篇文章](https://einverne.github.io/post/2020/03/make-torrent-from-command-line.html)

主要借助的命令行工具是：

- mktorrent
- transmission-cli 中的 transmission-create

### 通过界面制作种子

通过 UI 界面制作种子一般需要本地安装一个 [客户端](https://blog.einverne.info/post/2018/04/bittorrent-client.html#utorrent) ，比如常用的 Transmission，或 qBittorrent，等等。

这里以 Transmission 客户端为例，来演示如何制作种子文件。首先准备需要分享的文件内容，记住其所在的位置。

首先打开 Transmission，点击左上角的 `+` 号，创建一个 torrent 文件。

![create torrent in transmission](https://photo.einverne.info/images/2023/01/02/glAW.png)

这个时候 Transmission 会要求你选择一个文件，或者选择一个文件夹，此时选择需要分享的文件（或文件夹）。

然后 Transmission 会弹出如下的弹窗。

![transmission torrent](https://photo.einverne.info/images/2023/01/02/gojQ.png)

- Trackers 中填入服务器提供的地址。
- Comment 中可以任意填写
- 勾选 Private
- 选择 Torrent File 的位置

最后点击 Create 创建。

对于另外一些客户端，可能会要求用户选择区块的大小，如果文件大小比较适中，选择 4M 或 8M 即可，如果分享的文件内容超过 TB 级别，可以适当选择 16M 或更多。

## 上传种子文件

制作好种子文件，下一步就是将种子文件分享出去。登录一个 PT 站点， 比如 [GTK](https://pt.gtk.pw/) ，然后访问 [发布](https://pt.gtk.pw/upload.php) 页面。

### 编写标题

按照要求，一般在标题中填写资源的英文名称。

副标题中填写中文译名。

![pt title rule](https://photo.einverne.info/images/2023/01/02/g6Oi.jpg)

### 获取简介

#### PT-Gen

![pt introduction](https://photo.einverne.info/images/2023/01/02/gxpX.png)

#### 油猴脚本：豆瓣资源下载大师

可以通过在浏览器中安装 [油猴脚本：豆瓣资源下载大师](https://greasyfork.org/zh-CN/scripts/329484) ，然后在设置中开启「电影简介生成」。

![douban userscript pt gen](https://photo.einverne.info/images/2023/01/02/gFb0.png)

刷新页面，就能在词条页面中看到 movieinfo

![douban movie info](https://photo.einverne.info/images/2023/01/02/gaw9.png)

复制该信息即可。

如果怕豆瓣图片的防盗链机制，可以将海报封面重新上传到稳定的图床。[[电影海报网站]]

#### MovieInfoGen

[电影信息查询脚本](https://github.com/N3xusHD/MovieInfoGen) 是一个专注与通过豆瓣页面生成 PT 简介信息的用户脚本。

#### 其他

- ** [Rhilip/pt-gen-cfworker](https://github.com/Rhilip/pt-gen-cfworker) **：构建在 Cloudflare Worker 上的 Pt-Gen 分支
- ** [BFDZ/Pt-Gen](https://github.com/BFDZ/PT-Gen) ** : [https://www.bfdz.ink/tools/ptgen](https://www.bfdz.ink/tools/ptgen) , 公开维护的 Pt-Gen 独立分支
- 豆瓣： [电影信息查询脚本](https://greasyfork.org/en/scripts/38878) 或 [豆瓣资源下载大师](https://greasyfork.org/scripts/329484)
- Bangumi： Bangumi Info Export [脚本](https://git.io/fjm3l) ， [应用平台](https://bgm.tv/dev/app/103)

### 获取 mediainfo

mediainfo 的内容一般会用 `quote` 代码框起来，比较美观

- 使用 [ffprobe](https://blog.einverne.info/post/2015/02/ffprobe-show-media-info.html) 查看 Media Info
- 使用 [MediaInfo](https://mediaarea.net/en/MediaInfo) 软件生成
- 一般在你源文件所在的 pt 站的种子页面会有
- 可以用 ruTorrent 获取
- PotPlayer 仅限 Windows

#### 使用 ruTorrent 获取 mediainfo

- 可以用 ruTorrent 获取
  - 点击种子，然后选择文件（Files）
  - 在文件上右击获取媒体信息（Media Info）

![rutorrent media info](https://photo.einverne.info/images/2023/01/02/giz6.png)

#### 本地 PotPlayer 获取

仅限于 Windows。本地用 PotPlayer 打开媒体文件，右击，选择属性（Ctrl+F1），然后在文件信息中，将信息复制到粘贴板。

如果发布的是原盘，可以使用 bdinfo 软件获取。

```
[quote] Mediainfo/BDinfo [/quote]
```

### 发布种子

完成所有信息的填写，之后，点击发布。PT 站会自动重新下载一个新的种子，该种子包含了用户的个人信息，然后重载在客户端添加此种子，即可开始做种。

## 种子信息编辑

- [[BEncode Editor]] Windows only
- [[Torrent File Editor]] Windows, macOS
