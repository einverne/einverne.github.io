---
layout: post
title: "通过 IFTTT 自动下载 Instagram 图片到 Google Drive"
tagline: ""
description: ""
category: 经验总结
tags: [经验总结, Instagram, Google Drive, RSS, IFTTT]
last_updated: 
---

在 Instagram 关闭 API 之前可以通过 IFTTT 获取别人的更新 Photos， 但是 Instagram 收紧了 API 政策。既拿不到别人更新的信息流，同样也自己Like 别人照片的信息也拿不到了，原来 IFTTT 有两个 Recipes:

- 一个为自动下载个人 Liked 别人的 Photo 到 Dropbox
- 另一个为自动下载其他 ID 的更新 Photo

然而这两个 Recipes 都被 IFTTT 删去了，我甚至在 [StackOverflow](http://webapps.stackexchange.com/questions/93412/how-can-i-auto-save-instagram-images-to-google-drive) 上问过这件事情，只是几个月过去了，也没有任何实质性的方案。


直到这些天，突然脑袋一道闪光，再此之前，我了解了方法可以导出 Instagram 到 RSS，然后看到了别人自动将 [Imgur 中的图片上传到 Google Drive](https://www.reddit.com/r/ifttt/comments/3t55uh/images_from_rss_feed_to_tumblr_having_quality_loss/) ，使用的是 RSS 导出图片，有人写了一脚本传入 URL，就可以提取 URL 中的图片链接。

正是基于这两个方案，我想到了使用 Instagram to RSS to IFTTT to Google Drive 的方案，然后经过尝试，不需要一行代码的情况下，我实现了自动转存的方案。省去了自己写脚本的时间，同样这个方案也自动适配的Instagram 的网页，并不会因为网页结构的变化而导致失败。只要 RSS 有效，那么就会一直生效。

## Instagram to RSS

要做到这个事情，就需要借助 [RSS bridge](https://github.com/RSS-Bridge/rss-bridge) 这个项目，这个项目也是当时我在寻找 InoReader RSS 的时候发现的，关于导出微博、知乎、微信的订阅到 RSS 可以以后在展开详谈。回到 RSS bridge ，这个项目本身就是利用爬虫将网站更新内容生成 RSS，本身支持的网站还是很多的，Flickr、GooglePlus、Twitter、Youtube、Pinterest 等等，当然包括 Instagram。

而我使用了 <https://bridge.suumitsu.eu/> 这个网站提供的服务，这个网站架设了 RSS bridge 的服务，当然如果有条件的话自己架设也是很不错的选择，只要一直维护就可以。在网页上选择 Instagram 然后填入 Instagram 的用户 ID ，然后获取 Atom 的源即可。拿到这个 Feed URL，在下一步使用。


## if RSS to Google Drive

拿到 Feed URL 之后，到 IFTTT，使用 [这个](https://ifttt.com/recipes/469597-auto-save-others-instagram-photo-to-google-drive) 新建一个 Recipe


分析一下刚刚拿到的 URL

    https://bridge.suumitsu.eu/?action=display&bridge=Instagram&u=instagram&format=Atom

其中 u 参数后面跟随着的就是 Instagram 的用户 ID，改变 u 后面的参数为需要自动保存的 ID，然后 Save 即可。

