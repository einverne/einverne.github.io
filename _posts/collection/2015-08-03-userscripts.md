---
aliases:
layout: post
title: "我使用的 Userscript"
description: "我使用的 Userscript"
category: 整理合集
tags: [userscript, tampermonkey, greasemonkey, script, greasyfork, ]
create_time: 2021-07-03 10:32:45
last_updated: 2021-07-03 10:31:53
---

在使用 [[Userscript]] 之前针对使用的浏览器安装如下的插件

![Userscripts](https://lh3.googleusercontent.com/-X8VcfS3BJ_A/VcC4uFGFI9I/AAAAAAAAyk8/ui5CcL9eU2g/s640-Ic42/chrome%252520firefox%252520userscripts.png)

## 浏览器插件

如果想要在浏览器中快捷方便的管理和安装脚本，可以使用如下的插件：

- Chrome install Tampermonkey [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Firefox install Greasemonkey [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
- Opera install [https://addons.opera.com/en/extensions/details/violent-monkey/](https://addons.opera.com/en/extensions/details/violent-monkey/)
- safari install [http://ss-o.net/safari/extension/NinjaKit.safariextz](http://ss-o.net/safari/extension/NinjaKit.safariextz)

## userscripts 网站汇总

userscripts.org 已挂 原因参见： [ghacks.net](http://www.ghacks.net/2014/05/09/userscripts-org-good-alternatives/) 对于已挂的 userscripts.org 链接，例如

    http://userscripts.org/scripts/show/175005

在网址中间添加-mirror 即可访问，如下:

    http://userscripts-mirror.org/scripts/show/175005

新兴诞生的 Userscripts 网站列表

### Greasyfork
 [GreasyFork](https://greasyfork.org/) 或许是最受欢迎的后起之秀了。它由 Jason Barnabe 创建,Jason Barnabe 同时也是 [Stylish](https://userstyles.org/) 网站的创办者,在其储存库中有大量的脚本资源。

- 拥有大量的活跃脚本
- 拥有从 GitHub 同步脚本的功能
- 非常活跃的开放源码 [GitHub](https://github.com/JasonBarnabe/greasyfork)

### OpenUserJs
 [OpenUserJS](https://openuserjs.org/) 继 GreasyFork 之后开始创办。它由 Sizzle McTwizzle 创建,同样地,在其储存库中也拥有大量的脚本资源。

- 大量的脚本
- 可以从 GitHub 中进行同步
- 开放源代码 <https://github.com/OpenUserJs/OpenUserJS.org>

### GitHub/Gist
可以在 GitHub 或者 gist 中 [搜索](https://gist.github.com/search?l=javascript&q=%22user.js%22) 以 `.user.js` 后缀的文件。

## 脚本推荐

### AutoPager
[AutoPager](https://greasyfork.org/en/scripts/419215) 是一个自动翻页的脚本，将下一页的内容附加到当前页面，模拟瀑布流，支持 Discuz, Flarum, phpBB, Xiuno, XenForo, NexusPHP 论坛，支持 Google，百度，Bing，搜狗，微信，Yahoo，Yandex 等搜索引擎，支持贴吧，豆瓣，知乎，Bilibili 等等超多网站。


### Download YouTube videos as MP4

这个脚本最初也是在 userscripts.org 上面更新的，可能后来网站不维护了，作者就在 [GitHub](https://github.com/gantt/downloadyoutube) 更新了。同样在 [Greasyfork](https://greasyfork.org/en/scripts/1317-download-youtube-videos-as-mp4) 也能找到下载链接。

### Ingress Intel Total Conversion

简称 IITC ，Ingress 玩家的神器，IITC 有一系列的脚本，都能在网站上找到链接，这里推荐我使用的一些桌面版脚本：

- IITC Plugin draw tools
- IITC plugin player tracker
- IITC plugin sync
- IITC plugin Zaprange
- IITC plugin show linked portals

如果发现好用的 IITC Plugin 欢迎交换使用体验。

下载地址： [http://iitc.jonatkins.com/?page=desktop](http://iitc.jonatkins.com/?page=desktop)

### 百度网盘助手

获取百度网盘直链

下载地址： [Greasyfork](https://greasyfork.org/en/scripts/986-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B)

### 豆瓣电影自定义搜索

调用 Google Custom Search Engine 的脚本，在豆瓣电影页面显示下载链接

下载地址： [Greasyfork](https://greasyfork.org/zh-CN/scripts/7915-movie-cse-for-douban)

### 知乎免登录
看名字就能看出来，知乎隐藏完整的答案，只有登录才能查看全部的答案。用这个脚本可以破除这个限制。

下载地址： [Greasyfork](https://greasyfork.org/zh-CN/scripts/6489-zhihu-visitor)

### verydou

该脚本在豆瓣上显示 veryCD 内容，我将此脚本转移到 greasyfork

下载地址： [Greasyfork](https://greasyfork.org/en/scripts/7916-verydou)

### vipVideos_skipAd

优酷、土豆 VIP 免费看，去 iqiyi、PPS、sohu、56.com 视频广告

下载地址： [Greasyfork](https://greasyfork.org/scripts/8561)

### 最后

好吧，放弃了，脚本好多失效了，等再发现好用的再更新吧，可以经常到上面提到的两个网站上逛一逛，会有惊喜，昨天就发现了优酷土豆爱奇艺等等国内视频网站的去广告脚本。

## reference

- <https://tampermonkey.net/scripts.php>
