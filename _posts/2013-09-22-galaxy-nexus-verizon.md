---
layout: post
title: Gelaxy Nexus Verizon 折腾
tagline:
description:
category: 经验总结
tags: [nexus, galaxy, google]
redirect_from: "/post/2013/09/Galaxy-Nexus-Verizon.html"
---

这两天入手一电信版 Galaxy Nexus(i515,Galaxy Nexus Verizon), 买的时候就是叫商家刷的 CM 的系统，回来一看还算满意，CM10.2 8 月份的版本，Android 4.3 很新，唯一让我不爽的就是 3G 有问题，一方面上不去 ingress, 一方面在开启 3G 情况同时开启 WIFI, 关闭 WIFI 之后 3G 就再也连接不上去了。于是我根据商家给的 ROM, 找论坛，Google, 折腾一下午才算有点眉目。

商家给的刷机包名称 (cm-10.2-20130803.1043-SKANK-toro.zip), 这一看就不是原生的 CM 系统，肯定针对 Verizon 版做过一定修改。于是我找到了论坛上这则帖子 [Android ROM]( http://galaxynexus.diypda.com/thread-1116882-1-1.html) 完美 3g cm10.2 非官方版 4.3 8 月 6 号更新

根据这个帖子，我继续找到了修改这个 ROM 的作者的[官网](http://fitsnugly.euroskank.com/?rom=cm10&device=toro) , 我自己下载了最新版的刷入了，可我发现 3G 出问题了，怎么都连接不上。

ROM 作者在 XDA 上的 Thread http://forum.xda-developers.com/showthread.php?t=1771032

不过我自己整的这么个下午还不如 Google+ 郭极和郑科 两位给我的信息有用。在这则[帖子](https://plus.google.com/u/0/104618270243020984362/posts/VJCPQKJgqv1) 里

郑科留言中提到的 最新基带 http://forum.xda-developers.com/showpost.php?p=30942870&postcount=400
而商家给我刷的是**toroplus_for_toro_cdma_radio_FG01.zip**

郭极 Reply

如果你以后要写号可能会遇到类似问题，参考帖子
http://www.diypda.com/thread-815189-1-1.html
http://www.diypda.com/thread-802263-1-1.html

刷下面 3 个东东解决 3G 等问题

- 最新 3G 补丁
	http://pan.baidu.com/share/link?shareid=350920&uk=3054546283
- GA02 基带
	http://pan.baidu.com/share/link?shareid=350904&uk=3054546283
- 还有推荐刷这个内核，省电 稳定
	http://pan.baidu.com/share/link?shareid=349529&uk=3054546283

先刷完 AOKP ROM 然后 GAPPS
然后刷内核，再然后 GA02 基带，最后 3G 补丁

另外一个问题就是 Play Store 上不去的问题

『教程』 (12 月 17 号重新编辑）全民 3G，首发三星 I515 完美 3G 教程，下载地址已更新
http://www.diypda.com/thread-812093-1-1.html

[GNCDMA 写号教程重制版.pdf](https://app.box.com/s/6ft23b8vnyg6g49r3smd9izyx28n6q3j)

参考：
- C 网玩家 GN 专区 [http://galaxynexus.diypda.com](http://galaxynexus.diypda.com)
- XDA [http://forum.xda-developers.com/forumdisplay.php?f=1455](http://forum.xda-developers.com/forumdisplay.php?f=1455)

