---
layout: post
title: "修复 NextCloud 消失的托盘图标"
tagline: ""
description: ""
category: 经验总结
tags: [nextcloud, dropbox, ubuntu, linux, ]
last_updated:
---

NextCloud 算是很[重度](/post/2018/04/nextcloud.html) 的使用起来了，VPS 上安了，NAS 上也有。各个平台使用体验非常不错，不过唯一一点缺憾是有些时候 Ubuntu/Mint 上 NextCloud 随机启动之后托盘消失，导致看不到同步进度，老是让我感觉没有启动。

所以为了修复这个问题，需要完成以下两个步骤。第一个步骤就是在 startup applications 中将 NextCloud 设定延迟 10s 启动。

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/42214606824/in/dateposted/" title="nextcloud-startup-applications"><img src="https://farm2.staticflickr.com/1801/42214606824_3b91bde007_o.png" alt="nextcloud-startup-applications"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

第二步就是需要卸载 `appmenu-qt5` 这个 bug 可以参考这个 [issue](https://github.com/owncloud/client/issues/4693)

    sudo apt remove appmenu-qt5
