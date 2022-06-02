---
layout: post
title: "威联通折腾篇八：重启服务"
aliases: "威联通折腾篇八：重启服务"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, services]
last_updated:
---

家里遇到一次断电，然后 NAS 就这样异常关机了，重启之后提示磁盘有些碎片需要整理，整理的时候 Qnap 会停止 NAS 上所有的服务，包括 Container Station 中的内容，而 Qnap 说了会在检查完磁盘之后重新启动的，然而并没有，所以只能手动来重启这些服务。

幸亏 Qnap 的绝大部分服务都是用启动脚本来启动的，执行下面的命令可以把 NAS 当前运行的所有服务重启。

    /etc/init.d/services.sh restart

当然如果要重启单独的比如说 Container Station 也可以使用

    /etc/init.d/container-station.sh restart

重启 samba

    /etc/init.d/smb.sh restart

同样的方式，在 `/etc/init.d/` 目录下有很多的启动脚本，对应着名字找到要重启的内容即可。

## 解决特定问题

当遇到打开应用出现

> This site can’t be reached”（无法访问此站点）或“<server> refused to connect”（《服务器》 拒绝连接）

基本上重启一下对应的服务即可。


