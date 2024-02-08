---
layout: post
title: "Music Tag Web 基于网页修改音乐的元数据"
aliases:
- "Music Tag Web 基于网页修改音乐的元数据"
tagline: ""
description: ""
category: 经验总结
tags: [music, mp3tag, swinsian, navidrome, music-management, music-stream]
create_time: 2023-10-12 13:18:52
last_updated: 2023-10-12 13:18:52
---

[Music Tag Web](https://github.com/xhongc/music-tag-web) 是一个基于网页的歌曲元数据编辑工具，支持编辑标题，专辑，艺术家，歌词，封面等信息。之前在 Windows 上用过一个叫做 [[mp3tag]] 的应用，后来在 macOS 上用的是 [MusicBrainz Picard](https://blog.einverne.info/post/2020/11/manage-your-digital-music-library.html)，后来发现一款非常不错的音乐播放器 [[Swinsian]]，用了很久。我本地的所有音乐文件都会放在一个文件夹中然后使用 [Syncthing](https://blog.einverne.info/post/2019/10/syncthing.html) 来同步。

正因为我的音乐库被同步到了 VPS 中，虽然本地也有一份备份，但是如果恰好电脑不在身边，那就不太好立即操作。

再回到今天的主题 Music Tag Web，它的特点是:

- 支持 FLAC，APE，WAV，AIFF，WV，TTA，MP3，M4A，OGG，MPC，OPUS，WMA，DSF，DFF 等音频格式。
- 支持音乐标签来源 网易云音乐，QQ 音乐，咪咕音乐, 酷狗音乐, 酷我音乐
- 支持批量自动修改音乐标签

## 什么是歌曲的元数据

如果有人想要研究一下什么歌曲的元数据，那就避不开 [[MP3 ID3]] 这样一个名次，对于 MP3 ID3 的格式，可以参考[这篇文章](https://blog.einverne.info/post/2022/10/mp3-id3.html)。

![4sl9](https://photo.einverne.info/images/2024/02/08/4sl9.png)

## 安装

Music Tab Web 的安装非常简单，直接通过 Docker 启动即可。

直接使用命令启动（不推荐）：

```
docker run -d -p 8001:8001 -v PATH_TO_MUSIC:/app/media -v PATH_TO_CONFIG:/app/data --restart=always xhongc/music_tag_web:latest
```

推荐使用 docker compose 启动，具体的配置可以参考我的[仓库](https://github.com/einverne/dockerfile)

```
version: '3'

services:
  music-tag:
    image: xhongc/music_tag_web:latest
    container_name: music-tag-web
    restart: always
    ports:
      - "8001:8001"
    volumes:
      - ${PATH_TO_MUSIC}:/app/media:rw
      - ${CONFIG}:/app/data
    command: /start
```

等待启动，使用 `docker-compose logs -f` 查看日志，没有出现问题即可，之后访问 IP + 端口 http://ip:8001 访问主页面，在路径后面加一个 admin 就可以看到管理界面，默认账号密码 admin/admin。

## 使用

Music Web Tag 的界面非常直观，支持手动修改，或者根据匹配的信息自动修改，也支持整理文件夹以及简体转繁体，繁体转简体等操作。

和软件的本地版差距不大，除了界面上有所变化功能上并没有变化太大，能够根据平台来索引歌曲文件，可以进行手动的歌曲信息修改，包括了歌手、专辑、风格以及歌词等等信息都可以修改。支持的文件夹整理是一大亮点，可以针对专辑或者歌手，将其歌曲放在一个文件夹中。

自动修改完成之后就可以看到文件的信息被修改，同时也能在操作记录中看到是否有失败项。而针对自动修改错误的，也可以直接在界面进行手动修改。

## related

- [[MusicBrainz]]
- [[mp3tag]]
- [[Music Tag]]
