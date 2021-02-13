---
layout: post
title: "使用 tinyMediaManager 整理影视资源"
tagline: ""
description: ""
category: 经验总结
tags: [media, movie, poster, emby, qnap, tv-serial, ]
last_updated:
---

tinyMediaManager （后文简写成 tmm) 可以用来批量处理本地的影视资源，处理后就可以非常漂亮用海报墙的方式展示出来。

## 下载安装
tinyMediaManager 是 Java 编写的，所以天然的具有跨平台的属性，三大桌面平台全都支持，并且还是开源的。

- <https://www.tinymediamanager.org/download/>

Mac 下可以使用：

    brew install --cask tinymediamanager

### 功能
特色功能 [^1]：

- 支持从 themoviedb.org, imdb.com, ofdb.de, moviemeter.nl 等等站点抓取电影元信息，海报，图片等等
- 支持从 opensubtitles.org 自动获取字幕，当然这个站中文的比较少
- 支持批量重命名

[^1]: <https://www.tinymediamanager.org/features/>

## 使用

使用过程是比较简单的，添加媒体库，然后 tmm 就能通过文件名在左侧边栏展示出来，然后指定元数据从 themoviedb.org 获取，如果媒体文件命名足够清晰的话，可以直接一键自动匹配所有的影片。

## 媒体文件的管理
绝大部分影片用 bt 下载后可能的文件名是这样的：

	利刃出鞘（中英双字幕）.Knives.Out.2019.WEB-1080p.X264.AAC.CHS.ENG-UUMp4.mp4

对于这样的文件名本身就已经告诉了我们很多信息，比如中文片名，英文片名，发行日期，文件格式，编码格式，音频编码格式，中英文字幕情况，以及出处，如果想要在 [[Kodi]]，Emby，[[Plex]], 或者 Jellyfin 这些媒体播放器中展示出海报，剧情介绍，演员表等等 metadata，还缺少两样东西：

- xxx-poster.jpg
- xxx.nfo

`poster.jpg` 顾名思义就是电影的海报，而 `nfo` 文件就是存放该媒体文件 metadata 信息的地方，用 less 或者直接用 vi 查看的话就一目了然了。其中包含着这部电影需要展示的完整的信息，有了这两个文件，不管在那个媒体管理软件中打开存放的目录就能比较漂亮的显示媒体海报墙了。

## Extended
安装 tinymediamanager 过程中发现 [themoviedb](https://www.themoviedb.org/) 这个非常棒的网站，不仅完美的代替了豆瓣，界面美观，而且还提供了 [API 接口](https://www.themoviedb.org/documentation/api?language=zh-CN)，豆瓣恶心的把 API 关闭后，又频繁删贴，早有点看不下去了。

等那天有空，把我的豆瓣评分[同步](https://github.com/einverne/userscripts/tree/master/douban_export) 过去。[^rate]

[^rate]: <https://developers.themoviedb.org/3/account/get-rated-movies>
