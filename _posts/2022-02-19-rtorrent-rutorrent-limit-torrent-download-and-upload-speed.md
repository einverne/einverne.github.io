---
layout: post
title: "利用 ruTorrent 与 rTorrent 限制单独种子的速度"
aliases: 
- "利用 ruTorrent 与 rTorrent 限制单独种子的速度"
tagline: ""
description: ""
category: 经验总结
tags: [rtorrent, rutorrent, bittorrent, bt, private-tracker, tracker, bittorrent, ]
last_updated:
---

之前的几篇文章就提到过 rTorrent 和 ruTorrent 是我[最喜欢的 BT 客户端](/post/2019/05/qnap-rtorrent-bt-pt.html)。之前几篇文章：

- [根据用户标签移动完成的下载文件](/post/2022/02/rtorrent-move-finished-file-based-on-labels.html)
- [自动通过 RSS Feed 订阅下载](/post/2021/09/rutorrent-rss-auto-download.html)

今天就再来分享一个非常简单的小技巧，那就是针对个别种子单独进行限速。通常情况下整体的限速，上传和下载，其他的客户端基本上都做得非常完善，基本上是任何一个客户端的基本功能，但是非常少的客户端可以针对个别的种子可以进行限速，而借助 rTorrent 和 ruTorrent 客户端，可以完美的实现。

众所周知有一些私有的 tracker 是会对上传速度做要求的，如果一直以非常高的速度上传可能会被误判，所以非常有必要对个别的种子进行上传的限速。而有些时候可能不希望下载过快以至于占满全部的带宽，尤其是在国内有限的下载带宽的情况下。

## Channel

在 rTorrent 和 ruTorrent 的组合中可以通过 Channel 来实现。在 ruTorrent 的设置中，有 Channel 这样一个设定：

![rutorrent setting channel](https://photo.einverne.info/images/2022/03/16/5CGC.png)

可以看到默认情况下有 10 个不同级别的速度限制，这里以第一条 `up16` 举例，表示的就是限制上传速度 `16Kib/s` 而下载不限制。同样 `down` 的也是类似。

然后在主界面中，右击单个种子就可以看到其中可以对 Channel 设置，比如设置上传不能超过 50MB/s，就可以选择 `up50000`

![rutorrent right click menu](https://photo.einverne.info/images/2022/03/16/5ERH.png)


## Ratio Rules
如果觉得上面的手动方式比较笨拙的话，ruTorrent 还可以通过 Ratio Rules 来自动设置限速。在菜单栏点击 Plugins，然后选择 Ratio Rules，会展示如下界面。 

![rutorrent ratio rules](https://photo.einverne.info/images/2022/03/16/5WSD.png)

在这个对话框中就可以根据自己的需要设定，如下的条件：

- Torrent 的标签包含
- Torrent 的 Tracker URL 包含
- Tracker 是公开的
- Tracker 是私有的

当满足这些条件的时候，设置 ratio 以及限速，其中 `Set throttle to` 就可以选择之前设置的 Channel 中的内容。

当然如果你使用的是 rTorrent 没有使用 ruTorrent 界面，也可以通过配置的方式来实现，这里就不再具体展开。可以参考我之前的文章，以及官网的内容自行设置。

## reference

- <https://github.com/Novik/ruTorrent/wiki/PluginThrottle>