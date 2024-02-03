---
layout: post
title: "利用 Koel 搭建在线音乐流"
aliases: "利用 Koel 搭建在线音乐流"
tagline: ""
description: ""
category: 产品体验
tags: [self-hosted, navidrome, music-server, music-library, music-player]
last_updated: 2024-02-01 09:39:16
create_time: 2022-03-08 02:01:50
---

[Koel](https://koel.dev/) 是著名的个人音乐在线播放与电台程序。

## Prerequisite

- 硬件要求：一台最低内存为 1G 的服务器
- 系统：Ubuntu20.04 LTS，或其他任何 Linux 发行版
- 数据库：MySQL，MariaDB，PostgreSQL，SQLite
- 一个域名

## 基础架构

Koel 后端使用 Laravel PHP 框架，前端使用 Vue，还使用了 SASS 的 CSS 框架。数据库使用 MariaDB（MySQL）。

## Docker 安装

使用 Docker compose:

```
version: '3'

services:
  koel:
    container_name: koel
    image: hyzual/koel
    restart: always
    ports:
      - 8081:80
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=${DB_HOST}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_DATABASE=${DB_DATABASE}
    volumes:
      - ${MUSIC_PATH}:/music:ro
      - ${COVERS_PATH}:/var/www/html/public/img/covers
      - ${SEARCH_INDEX_PATH}:/var/www/html/storage/search-indexes
```

安装完成后进行初始化：

    docker exec -it <container_name_for_koel> bash
    php artisan koel:init --no-assets

从 v5.1.0 开始 Koel 不会在安装的时候去设置 admin 账户，会使用一个默认的用户名：

```
email: admin@koel.dev
password: KoelIsCool
```

可以通过界面重置密码，或者执行命令：

    docker exec -it <container_name_for_koel> php artisan koel:admin:change-password

当前的 Koel 可识别这些音频扩展：.mp3，.ogg，.m4a（实验）和 .flac

## 快捷键

也有几个快捷键呀：

- F：移动到搜索框
- Enter：播放一首歌曲。如果有多首歌曲被选中，Enter 将它们添加到播放队列的底部，Shift+Enter 将它们排到顶部。在组合中加入 Cmd 或 Ctrl，可以立即播放第一首被选中的歌曲。
- Space：切换播放/停止
- J：播放队列中的下一首歌曲
- K：播放队列中的上一首歌曲
- Ctrl/Cmd+A：选择当前视图中的所有歌曲
- Delete：从当前队列/播放列表中删除所选歌曲

## reference

- [[online-music-stream]]
- <https://qing.su/article/personal-music-streaming-server-with-koel.html>
- <https://www.eluyee.com/koel/>
