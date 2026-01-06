---
layout: post
title: "QM-MUSIC：打造属于你的私有云音乐服务器"
aliases:
  - "QM-MUSIC：打造属于你的私有云音乐服务器"
tagline: ""
description: ""
category: 产品体验
tags: [ music, server, self-hosted, docker, subsonic]
last_updated:
---

[QM-Music](https://github.com/chenqimiao/qm-music) 是一个基于 Subsonic 协议构建的开源私有云音乐服务器，专为音乐爱好者设计。它以轻量、高效、全平台兼容为核心特点，让用户能够轻松搭建属于自己的音乐流媒体服务。

之前总结过一篇文章[如何使用 Navidrome](https://blog.einverne.info/post/2023/12/navidrome.html) 搭建在线音乐库，我自己使用下来几年也非常稳定，但 Navidrome 的交互界面有一些老旧，并且我有一个挺常用的，网页随机播放功能支持不是很完善，今天刚好看到 QM Music，交互页面非常友好，所以安装用用。

我自己会在本地使用 [Musiver](https://blog.einverne.info/post/2024/07/stream-music-navidrom-subsonic.html) 原名音流来串流音乐。

### 核心亮点

1.  极致轻量与高性能：

    - 资源占用低：运行时仅需约 150MB 内存，非常适合部署在树莓派、轻量级 VPS 或家用 NAS 上。
    - 高效响应：优化的架构确保了快速的响应速度。

2.  全平台兼容 (Subsonic 协议)：

    - 完美兼容 Subsonic API，这意味着你可以直接使用现有的成熟客户端，无需等待专用 App。
    - 支持客户端：Audinaut, feishin, Amperfy, substreamer, music-assistant 等。

3.  智能转码与播放：

    - 智能转码：支持动态转码 (libmp3lame/acc)，在移动网络下自动降低码率以节省流量。
    - 格式支持：原生支持 MP3, FLAC, AAC, WAV 等主流音频格式。

4.  完善的管理功能：

    - 多用户管理：支持多用户权限控制，适合家庭或小团体分享。
    - 元数据管理：自动识别 ID3 标签、专辑封面；支持按专辑、艺术家、流派等结构化展示。
    - API 集成：支持集成 Spotify 和 Last.fm API 以获取更丰富的元数据。
    - 其他：歌词同步显示、播放历史记录、全局搜索、相似歌曲推荐。

5.  私有化与安全：
    - 音乐文件本地存储，完全掌控数据隐私。

### 快速部署

QM-Music 提供了完善的 Docker 支持，部署非常简单。

#### Docker CLI 一键启动

```bash
docker run -d \
  --name qm-music \
  -p 6688:6688 \
  -v /your/music:/data/qm-music/music_dir \
  -v /your/db:/data/qm-music/db \
  -v /your/cache:/data/qm-music/cache \
  -e QM_FFMPEG_ENABLE=true \
  -e TZ=Asia/Shanghai \
  --restart unless-stopped \
  qmmusic/qm-music:latest
```

_注意：请将 `/your/music` 等路径替换为你实际的本地路径。_

#### Docker Compose

```yaml
services:
  qm-music:
    image: qmmusic/qm-music:latest
    ports:
      - "6688:6688"
    volumes:
      - /your/music:/data/qm-music/music_dir
      - /your/db:/data/qm-music/db
      - /your/cache:/data/qm-music/cache
    environment:
      - QM_FFMPEG_ENABLE=true
      - TZ=Asia/Shanghai
    restart: unless-stopped
```

### 开始使用

1.  访问：浏览器访问 `http://[你的服务器IP]:6688`。
2.  登录：默认账号 `admin`，默认密码 `admin`。
3.  安全提示：登录后请务必立即修改默认密码。
