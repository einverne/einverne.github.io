---
layout: post
title: "管理我的音乐库"
aliases: "管理我的音乐库"
tagline: ""
description: ""
category: 经验总结
tags: [ music, netease, play-music, google-play, music-library, google-music, media-vault, media-server ]
last_updated:
---


自从2014年总结整理了当年所有流行的[音乐网站](/post/2014/07/music-website-thinking.html) 之后就一直使用网易云音乐到今天，然而这些年的发展过程中多多少少产生了一些变化，虾米没了，Google Play Music 也没有了。而如今网易云音乐也出现了各种各样的问题，虽然有些问题可以或多或少的被规避，但网易用起来就是没有那么舒服了。

我在原来的那篇文章中提到了互联网化，以及伴随着移动设备的发展，我个人偏好的几个产品特点：

- WEB 化
- 同步账号系统
- 跨平台
- UGC 用户贡献

这几点虽然现在网易云音乐依然做的非常不错，并且能推出 Linux 版本这件事情就是值得称赞的。而所有的音乐服务中，也只有网易能把「云村」这样的一个UGC社区运营得如此出彩。

但是在核心的音乐版权上却一而再的在退步，虽然偷偷摸摸地用音乐云盘的法律漏洞可以避免一些用户使用上的问题，但是我个人最无法忍受的事情，就是偷偷摸摸删除用户文件，这件事情让我再无法忍受。所以自从那件事情被暴露之后我就一直在思考有没有什么方案我可以迁移。相较于 Apple Music 或 Spotify 这样的音乐流媒体分发模式，我个人更偏向于购买或者能让我看到音乐文件的方式。所以我个人是不会去重度使用那些流媒体音乐服务的。

而由因为前段时间 Play Music 服务关闭，一下子下载了十几个GB的文件，造成了我对音乐文件的管理的困扰。所以一有时间我就会去想怎么离线管理起我的这些音乐文件。


## 我的音乐库管理方法
在寻找代替方案的过程中，我先整理了一下我的需求


- 一个整体的音乐库（良好的组织方式），能够让我对所有的歌曲文件一目了然
    - 我个人偏向于按照音乐家，专辑，单曲这样的形式去管理
- 可以让我对音乐文件的 metadata 进行编辑
- 可以让我快速通过，名字，音乐家，或标签进行搜索

### 良好的文件组织形式
离线的音乐文件不像那些在线的音乐服务，可以直接将音乐加入到不同的列表进行管理，我个人更加倾向于在本地通过目录组织进行管理。

所以目前我在 Music 这样的目录中建立了一个顶层的文件夹用来管理所有的文件。

#### 普通专辑
普通的专辑，我就以这样的层级进行管理：

Music > Artist > Album Name > Audio

#### Various Artist
对于合集，以这样的方式。

    Music > Various Artists > Movies > Soundtracks
    Music > Movies > Soundtracks > Hackers

### 找出重复文件
当需要管理成千上万个文件的时候，重复文件的查找就变得异常困难，幸好可以借助开源的命令行工具 [jdupes](/post/2019/12/find-and-delete-duplicate-files.html) 来快速找到重复文件并删除，节省了大量的空间。


### 管理音乐文件 metadata 和 ID3

一旦确定了音乐媒体库的文件结构，可以开始整理，但是整理的过程中，就会发现每个音乐文件都会带一个完整或不完整的 metadata 信息，这些信息会被一些音乐播放器获取在播放时用来显示封面或音乐家，专辑的信息。很多年前在使用 Play Music 的时候，为了让 Google 自动匹配上，使用 mp3tag 批量修改了一些文件，但是 mp3tag 只能在 Windows 上使用，所以又找到了一个叫做 [MusicBrainz](https://picard.musicbrainz.org)，这个软件是跨平台的，可以用来修改文件的 metadata。

> ID3 是一个位于 mp3 文件开头或结尾若干字节的附加信息，包含了该 mp3 歌手，标题，专辑，年代，风格等等信息。

[[ID3 tags]] 通常会被播放器用来展示其基本信息，包括封面，歌手，专辑等等。

#### MusicBrainz Picard

MusicBrainz Picard 是一个 Python 编写的、开源的（GPL 2.0）、跨平台的音乐文件元数据管理工具。很早之前在 Windows 上用过 一款叫做 Mp3tag 的软件，MusicBrainz Picard 就是类似的工具。

关于该软件的使用就不再多说，可以直接参考[图文教程](https://picard.musicbrainz.org/quick-start/)

在使用之前可以做一些调整

![screenshot-musicbrainz-options.png](/assets/screenshot-musicbrainz-options.png)

#### 利用 MusicBrainz 自动修改文件 metadata
使用 MusicBrainz 导入文件，然后点击菜单中的 Cluster，会自动根据专辑进行归类。

点击需要编辑的专辑，然后点击 Look Up，如果查找不到，可以点击 Scan，自动根据歌曲 metadata 匹配信息。匹配到的文件会自动到右边，在下方可以看到被编辑的内容，点击保存即可将内容保存到文件。

#### 利用 MusicBrainz 自动修正目录

在菜单栏 Options 中默认只选中了 `Save Tags`，可以将 `Move Files` 勾选上，这样每一次保存的时候会自动修正目录。

## reference

- <https://www.techhive.com/article/3201150/how-to-manage-your-digital-music-library.html>
- <https://homedjstudio.com/organize-music-library/>
