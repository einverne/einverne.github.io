---
layout: post
title: "OBS 配置多路推流 实现多平台同时直播"
aliases:
- "OBS 配置多路推流 实现多平台同时直播"
tagline: ""
description: ""
category: 经验总结
tags: [ obs, live, live-broadcast, youtube-live, bilibili-live, setup, multi-rtmp, rtmp, github, ]
create_time: 2025-02-24 17:31:34
last_updated: 2025-02-24 17:31:34
dg-home: false
dg-publish: false
---

[[Open Broadcaster Software(OBS)]] 是一个非常强大的开源的，直播推流工具。但是默认情况下 OBS 只能配置推送一个直播流。但是现在支持直播的平台越来越多，如果直接将直播流推送给多个平台，那么可以通过本文介绍的方法，借助多平台推流插件来实现。

## OBS 与 Multi-RTMP 插件

Open Broadcaster Software (OBS) 是一个广泛使用的开源软件，用于视频录制和直播推流。然而，默认的 OBS 设置仅支持推送单一直播流到一个平台。

### Multi-RTMP 插件

Multi-RTMP 是一个第三方插件，允许用户在 OBS 中同时向多个 RTMP 服务器推送直播流。该插件通过为每个目标平台创建单独的输出通道，使得多平台推流变得更加简单。

下文会使用到一个叫做 [Multi-RTMP](https://github.com/sorayuki/obs-multi-rtmp) 的插件。

到 GitHub 主页，在 Releases 中根据 OBS 的版本，以及自己的操作系统，下载对应的脚本。

## 使用

1. 下载插件: 访问 [Multi-RTMP GitHub 页面](https://github.com/sorayuki/obs-multi-rtmp)，在 Releases 部分找到适合你操作系统和 OBS 版本的安装包。

2. 安装插件:

   - 对于 macOS 用户，下载的是一个 `.pkg` 文件。双击安装，按照指引完成安装过程。
   - 对于 Windows 或 Linux 用户，请根据各自的系统要求进行相应的安装步骤。

3. 配置 OBS:
   - 打开 OBS 后，在菜单栏找到 `Docks`，然后选择 `Multiple output`。
   - 在弹出的界面中，你可以添加多个输出，每个输出对应一个不同的平台 RTMP 地址和密钥。

macOS 下是一个 Pkg 文件，安装之后，在 OBS 中 Docks 下可以看到「Multiple output」选项。

![pFp0xSih_R](https://pic.einverne.info/images/pFp0xSih_R.png)

1. 设置直播参数:
   - 为每个平台输入正确的 RTMP URL 和 Stream Key。
   - 确保所有参数设置正确无误后，你可以点击 `Start Streaming` 开始同时向多个平台进行直播。

### 注意

每一个根据分辨率、码率设置，每个平台都会消耗 3~5 Mbps 带宽，如果要支持多个平台直播，需要

- 确保网络带宽足够支持多路视频上传，以避免直播过程中的卡顿或延迟问题。
- 各个平台可能有不同的视频参数要求（如分辨率、比特率等），请根据具体需求调整每个输出流的设置。



对于使用 Open Broadcaster Software (OBS) 进行多平台直播，Multi-RTMP 插件无疑是一个强大的工具。以下是如何有效利用这个插件的简要指南：
