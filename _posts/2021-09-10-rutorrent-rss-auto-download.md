---
layout: post
title: "rTorrent 和 ruTorrent 中自动下载 RSS Feed"
aliases: 
- "rTorrent 和 ruTorrent 中自动下载 RSS Feed"
tagline: ""
description: ""
category: 经验总结
tags: [rtorrent, rutorrent, linux, docker, rss, feed, private-tracker, torrent, bt, ]
last_updated:
redirect_from:
  - /post/2021/09/rutorrent-RSS-auto-download.html
---

自从在 QNAP 上遇到 [ruTorrent](/post/2019/05/qnap-rtorrent-bt-pt.html) 之后就发现这是我用过的最好用的 BitTorrent 客户端了，[rTorrent 结合 ruTorrent 界面](/post/2020/03/rtorrent-and-rutorrent.html)

可以参考我的 [docker-compose.yml](https://github.com/einverne/dockerfile/tree/master/rtorrent-rutorrent) 进行安装。然后照之前的[文章](/post/2020/03/rtorrent-and-rutorrent.html) 启用 MaterialDesign，界面就非常漂亮。

![rutorrent-20210910210121.png](/assets/rutorrent-20210910210121.png)


## RSS
首先 RSS 就不用多说了，在互联网早期就存在的一个分享格式，可以用于内容的聚合，虽然 Google Reader 关闭多年，但我个人依然还在重度的使用，从 [InoReader](/post/2013/11/inoreader-using-feelings.html) 到自建 [Tiny Tiny RSS](/post/2020/02/self-hosted-rss-reader.html) 然后最终心属最简洁的 miniflux 可以说过去的 10 年里面一直都在使用 RSS。

这也使得在 Private Tracker 中使用 RSS 变得非常的容易，大部分的站点都是提供个人的 RSS feed 流的，我使用的 AvistaZ, PrivateHD，都是可以通过关键字订阅来生成自定义的 Feed 流的。

那就以 wishlist feed 流做一个例子，到对应的网站管理后台获取个人的 wishlist RSS feed, 一般是一个链接，当中包含了该 Feed 流的内容，比如说我的 Wishlist 就包含了我在网站中收藏的内容，这样只要我在浏览网站的时候将影片添加到 Wishlist，那么 Feed 中会自动添加该影片。

![](/assets/privatehd-rss-download-20210910211023.png)

一般在界面中找这样的图标即可。

## 添加 RSS 链接到 ruTorrent

右击 ruTorrent 中的 Feeds 板块：

![](/assets/rutorrent-feeds-20210910211224.png)

然后点击添加 RSS Feed，输入框中填入 Feed URL，以及 Custom Alias。

![[rutorrent-add-rss-feed-20210910211430.png]]

那新添加的 Feed 会自动出现在 Feeds 板块。在 Feed 板块中可以点击查看到 Feed 中的内容。但是这个时候 Feed 中的内容不会自动下载。如果需要配置自动下载需要使用下面的 RSS Manager（或者也被称为 Download Manager）。

## 配置 RSS Manager
然后右击 Feeds，打开 RSS Manager

![](/assets/rutorrent-rss-manager-20210910211557.png)

这个界面中有一些内容需要配置，可以新建一个 Filter，点击左边的 ADD

右边的配置分别是：

- Filter, 过滤器，可以使用正则表达式来过滤 Feed 中需要下载的内容，使用 `/^/` 就表示下载所有。
- Exclude，排除，包含那些关键字的内容不会下载，也可以使用正则。
- Check title field，上面配置的正则表达式，是否检查标题
- Check description field，检查描述
- Check link field，检查链接
- RSS，选项选择刚刚添加的 RSS URL
- Directory，下载目录
- Label，自动添加设置的 Label
- Min interval，最小间隔
- RatioGroup, 分享率设置
- Channel，通道

点击保存，过一会儿就能看到 RSS 中的种子自动开始下载了。

不过这里需要特别注意，千万不要把一个全站的 RSS Feed 添加到自动下载，并配置下载全部，除非你知道这样做的意义。

另外如果要更加详细的设置 RSS 的刷新频率，则需要修改 rTorrent 的配置，如果有需要再更新吧。

另外如果使用的是类似于 Transmission 这样的客户端，并没有自带 RSS 管理，那也可以使用 [Flexget](/post/2020/02/flexget.html) 来间接实现 RSS 自动下载。配合 crontab，也可以实现相同的效果。
