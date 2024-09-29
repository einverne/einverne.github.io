---
layout: post
title: "利用 Navidrome 搭建自己的在线音乐库"
aliases:
- "利用 Navidrom 搭建自己的在线音乐库"
tagline: ""
description: ""
category: 经验总结
tags: [navidrome, plexamp, plex, subsonic, open-source, music-server, music-management, music, music-library, self-hosted]
create_time: 2024-01-31 08:38:00
last_updated: 2024-01-31 08:38:00
---

我从[2013，14 年左右](https://blog.einverne.info/post/2014/07/music-website-thinking.html)开始使用网易云音乐来听音乐的，因为后来只有网易云音乐拥有 Linux 客户端，所以在 Linux Mint 下也用了很久的网易云，但是用着用着网易云的歌曲就变灰了，下架了，再找不到了。

![kqcf9MmOh6](https://pic.einverne.info/images/kqcf9MmOh6.png)

虽然我可以使用网易云音乐的云盘来间接的实现部分歌曲的点亮，但是还是需要将歌曲传给网易，并且有些时候还会出错，因为版权问题或者敏感问题无法上传。

![z-hVQi9zu5](https://pic.einverne.info/images/z-hVQi9zu5.png)

所以有段时间我都是在本地使用 [[Swinsian]] 来听音乐，并且 Swinsian 自带非常强大的 Meta 信息编辑工具，看到不正确的歌曲信息就可以随手修改了。

![BCN3waS_UL](https://pic.einverne.info/images/BCN3waS_UL.png)

后来为了在多设备上串流听音乐，因为我买了终身的 Plex， 又看到 Plex 官方推出了一款音乐播放器 [[Plexamp]]，但是经过了几个月的试用，Plexamp 在曲库匹配和识别上出现了一些我无法解决的问题，所以一气之下就换成了 Navidrome。

[Navidrome](https://www.navidrome.org/) 是一个现代的音乐服务器，我们可以直接自己托管我们自己的音乐库，然后使用任何客户端来串流收听自己的音乐。

Navidrome 兼容所有的 Subsonic/Airsonic 客户端。

Navidrome 后端使用 Go 语言编写，前端基于 React，界面风格采用 Material UI，串流音乐的接口兼容 [[Subsonic]]，所以支持 Subsonic 的客户端都可以使用。

## Navidrome 是什么

Navidrome 是什么呢，引用官网的原话：

> **Navidrome is a self-hosted, open source music server and streamer. It gives you freedom to listen to your music collection from any browser or mobile device.**
>
> Navidrome 是一个自托管的开源音乐服务器和流媒体。它让您可以自由地从任何浏览器或移动设备收听您的音乐收藏。

特点：

- 支持几乎所有音频格式，流式传输几乎任何可用的音频格式
- 读取并使用元数据
- 对合辑（各种艺术家专辑）和盒装（多碟专辑）的支持
- 独立用户系统，每个用户都有自己的播放次数、播放列表、收藏夹
- 系统资源占用极低，即使想我这样 80GB 几千首歌依然非常流畅
- 开源，多平台，可在 macOS、Linux 和 Windows 上运行。还提供了 Docker 镜像
- 可用于所有主要平台的二进制文件，包括 Raspberry Pi
- 自动监控您的音乐库的更改、导入新文件和重新加载新元数据
- 基于 Material UI 的主题化、现代和响应式 Web 界面
- 与所有 Subsonic/Madsonic/Airsonic 客户端兼容，甚至还有 [[Kodi]] 的插件
- 自带即时转码，可以为每个用户单独设置。支持 Opus 编码。
- 界面集成各种语言

缺点：

- 不支持在页面上传歌曲文件以及修改文件 Metadata
- 不支持歌曲分享
- 只支持内嵌的歌词显示

## 为什么要选用 Navidrome

我从 [2014 开始使用网易云音乐](https://blog.einverne.info/post/2014/07/music-website-thinking.html)，几乎很长时间没有变过，但是大家也知道网易云音乐前几年的「变化」，我歌单中的内容就一天天变得不可用（变灰），直接导致产品体验直线下降，虽然还可以使用网易提供的 2T 云盘来解决一部分版权问题，但是还是一些不方便。

于是之后买入了 Plex Pass 之后就将我的音乐库迁移到了 [[Plexamp]]，在 Plexamp 下也用了很长一段时间，虽然中间也接触了 [Funkwhale](https://blog.einverne.info/post/2020/02/music-manager-nas-funkwhale.html) 等等，但简单的尝试之后还是停留在了 Plexamp 中，但是最近发现 Plexamp 存在了一些致命的问题让我不得不考虑切换，就是我使用 Syncthing 同步我的音乐库，但是 Plex 扫描的时候经常无法发现我新添加的歌曲，虽然我按照官方的文档无数遍修改文件目录，但依然无法添加到 Plex 中，这个问题困扰了我很久，我不清楚是 Plex 支持的文件格式有限，还是哪个地方设置不对，反正就是添加不了，于是我发现了 [[Navidrome]]，大致地看了一下官方网站的介绍，支持的文件格式非常齐全，扫描速度非常快，并且还提供了一个 Web UI，即使不安装客户端也可以在线听歌，兼容 Subsonic 客户端，这就使得我可以有非常多的音乐客户端选择。

## 安装

官方文档提供了非常多的安装方式，个人还是比较喜欢 Docker Compose 来安装启动，配置可以参考我的 [dockerfile](https://github.com/einverne/dockerfile/tree/master/navidrome)。

```
git clone https://github.com/einverne/dockerfile.git
cd navidrome
# create and modify .env
docker-compose up -d
# check log
docker-compose logs -f
```

因为我个人使用 [[Nginx Proxy Manager]] 来反向代理 Navidrome 实例，所以里面多配了一些 Nginx 代理的选项，可以根据自己的需要配置。如果不配置 Nginx 代理，可以直接使用端口来访问。

> panic: chi: routing pattern must begin with '/' in '""/auth'

如果安装的过程中遇到这个报错，那么查看一下 docker-compose.yml 文件中的 `ND_BASEURL`，如果留空就会抛出上面的错误。

比如，安装完成之后访问 [http://your-vpsip:4533/](http://your-vpsip:4533/)，首次登录会要求创建管理员账户，和密码。

一旦完成安装，就会发现 Navidrome 在扫描音乐库了。登录后台，进行个性化的配置，比如修改语言，对接 Last.fm，ListenBrainz 等等。至此，Navidrome 音乐服务端已经安装完成。

![4pWL](https://photo.einverne.info/images/2024/01/31/4pWL.png)

### 配置 Last.fm

等路自己的 Last.fm 帐号

访问 <https://www.last.fm/api/account/create> 创建一个 API 账户，填写应用程序名称。获取 API Key 和 Shared Secret。

然后将值分别放到 Docker

```
ND_LASTFM_ENABLED=true
ND_LASTFM_APIKEY
ND_LASTFM_SECRET
ND_LASTFM_LANGUAGE
```

配置好重启容器之后，在后台记得开启 Scrobble to Last.fm 。

### 配置 Spotify

首先创建一个免费的 Spotify 账户，然后访问[开发者面板](https://developer.spotify.com/dashboard/applications) 填写表单，创建。获取 Client ID 和 Client Secret。

添加 Spotify 有一个好处就是可以显示歌手艺术家的照片，图像从 Spotify 获取。

```
ND_SPOTIFY_SECRET
```

## 文件上传

- [[miniserver]]
- [[FileBrowser]]

## 客户端

官方文档上提供了非常多的 [客户端](https://www.navidrome.org/docs/overview/#apps) 选择。

客户端

- iOS
  - play:Sub（付费 38 RMB）
  - [[substreamer]] 免费，[substreamer](https://substreamerapp.com/) 支持随机播放曲库，算法推荐
  - [[Amperfy]] 初始化过程比较长，界面一般
  - iSub
  - 开源的 [SubPetalApp](https://github.com/alexiscn/SubPetalApp) 已经归档不再更新，界面非常不错
  - 音流，Flutter 开发，跨平台
- Android
  - DSub
  - Subtracks [subtracks](https://github.com/austinried/subtracks#readme) ：开源，支持中文，多音乐服地址，但是 UI 比较简洁，随机播放音乐只支持以专辑维度。
  - [[substreamer]]
  - [[Symfonium]]
  - Ultrasonic
  - Audinaut
- 网页端
  - Subplayer
  - Airsonic Refix
  - Aurial
  - Jamstash
  - Subfire
- 桌面
  - [[Sonixd]] 跨平台（Windows/macOS/Linux）
  - [Tauon Music Box](https://github.com/Taiko2k/TauonMusicBox)
  - [Supersonic](https://github.com/dweymouth/supersonic) 开源，Go 语言
  - Sublime Music(Linux)
- macOS
  - [Submariner](http://submarinerapp.com/)
- CLI
  - Jellycli (Windows/Linux)
  - STMP (Linux/macOS)

个人推荐

- iOS，Substreamer
- Android，Symfonium(付费)，Ultrasonic
- 桌面端，[[Sonixd]]
  - `brew install --cask sonixd`

macOS 下的 Sonixd

![4aYN](https://photo.einverne.info/images/2024/02/02/4aYN.png)

## 歌词

- [[LyricApi]]
- music_tag_web

## 总结

Navidrome 的安装教程就到这里，如果你只是想要开箱即用的 ，如果想要了解 Navidrome 的进阶设置，可以收藏订阅本网站。

## related

- [[Music Tag Web]]
- [[OpenSubsonic]]
- MusicFree https://github.com/maotoumao/MusicFree

## reference

- [安装文档](https://www.navidrome.org/docs/installation/)
