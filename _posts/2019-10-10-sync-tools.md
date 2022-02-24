---
aliases: 
layout: post
title: "同步工具整理总结"
aliases: "同步工具整理总结"
tagline: ""
description: ""
category: 整理合集
tags: [sync, tools, linux, rsync, btsync, syncthing,]
last_updated: 2022-02-22 01:01:01
create_time: 2021-07-03 10:32:42
---

陆陆续续用过不少同步工具，资料备份，各个设备间同步文件，从商业化的工具到命令行工具，但总还是一直在寻找一款足于满足我所有需求的工具。这里就整理一下，顺便整理一下我自己的思路。不久前就一直在思考一个问题，数字文件的生命有多长，以前看到过一句话，几十年前父母写下的日记如今依然能从旧书柜中翻出，数十年前的胶卷照片依然还很清晰，但往往几年前的网络文章，或者数字照片可能如今随着网络服务的关闭，物理硬盘的损坏而无法恢复。有人尝试使用多地备份，有人尝试云服务备份，却都无法从根本上解决这个问题，当然现在的我依然没有办法完全的解决这个问题。

目前我从两个方面来规避这个问题，一方面物理备份一份，一方面网络存储一份。虽然可以从大部分情况下解决一些问题，不过并不能保证 100 % 数据安全。

## 中心化的同步工具
中心化的同步工具就像是那个时候的 SVN，使用体验完全依赖于中心服务器，网速，磁盘大小都决定了最后的使用体验。

### Dropbox vs pCloud vs NextCloud
最早接触到同步工具应该就是 Dropbox 了，PC 上，手机上都是使用 Dropbox 来同步的，并且我的 Dropbox 利用率一直都还是很高。但是 Dropbox 因为网络问题原因，有些时候可能会比较慢。所以一直作为保留项目。

在 Dropbox 之后，也用过 [pCloud](/post/2019/04/pcloud.html) 不过也并没有深度使用。

之后就是尝试在 VPS 上建了 NextCloud，然后买了 NAS 之后把内容备份到了 NAS 上，并且开始[深度使用 NextCloud](/post/2018/04/nextcloud.html)

不过以上这些工具都有一些问题，比如我都只用来同步一些相对比较小的文件，比如文件，图片，文档等等内容。因为受到同步服务器容量的限制，所以有些文件我会有意识的不同步。

## 去中心化的同步服务
去中心化的服务有很多，这些年陆陆续续也都用过很多。就我个人而言，如果使用命令行，我会用 rsync, 如果要有一个比较友好的界面，我会用 Syncthing。

### Rsync
rsync 之前的[文章](/post/2017/07/rsync-introduction.html) 已经提到过，很多使用方法那篇文章中也有提及，这里就不赘述了。

### unison
unison 没怎么用过，但是 unison 经常被用来和 rsync, syncthing 一起比较，想必也有他的过人之处。

- <https://github.com/bcpierce00/unison>

### Resilio Sync
曾经用过很长一段时间，说是去中心化的，但是国内把中心服务的节点屏蔽之后就很难连接上其他地址了，所以后来就放弃了。不过 NAS 上还一直留着，使用起来也非常不错。

- <http://einverne.github.io/post/2016/04/btsync-review.html>

如果想要分享只读大文件给很多人，不妨体验一下。

### VerySync

之前也有写过一篇文章 [威联通上使用 verySync](/post/2019/04/qnap-verysync.html)，但是这个同步工具毕竟还是用的人少，并且还是国产闭源应用，可信度不高。作为 Resilio Sync 的国产代替品使用。

### Syncthing
开源，跨平台，Go 语言编写，其他就不用多说了。这可能是这一次整理收获最大的一个工具。

- <https://syncthing.net/>

添加 Linux 启动项，可以参考官方的文档，非常详细

- <https://docs.syncthing.net/users/autostart.html#linux>

这个工具足以代替 Dropbox 完成同步任务，支持增量备份，支持版本管理，各个平台都有完美的解决了同步的问题。


## Other
insync 是一个可以将本地文件夹和 Google Drive 同步的工具，收费

- <https://www.insynchq.com/>

GoodSync 又一款同步工具，支持很多平台，不过有些功能需要收费。

- <https://www.goodsync.com>

## reference

- <https://danie1.me/2019/01/29/my-journey-to-syncthing/>
