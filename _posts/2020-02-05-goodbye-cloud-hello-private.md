---
layout: post
title: "再见公有云"
tagline: ""
description: ""
category: 经验总结
tags: [cloud, nextcloud, qnap, dropbox, notebook, ]
last_updated:
---

2019 年一整年都在履行着一件事情，那就是把以前所有用过的云服务替换成自己部署的私有云服务。

## 文件同步
我是[很多年](/post/2015/07/dropbox-tips.html) 的 Dropbox 用户，至今为止所有的设备上也都安装着 Dropbox, 很多经常性使用的文件，配置也都在同步着，除了有些时候的网络问题，绝大部分使用完全没有问题。但之后陆续接触了一些其他文件同步工具，比如 [pCloud](/post/2019/04/pcloud.html)，知道了原来可以端到端同步让文件同步更加安全；知道了 [NextCloud](/post/2018/04/nextcloud.html)，原来可以把数据交付给自己，让自己的数据更加安全；之后又知道了 [Syncthing](/post/2019/10/sync-tools.html)，原来可以让数据交换不像 NextCloud 那样走中心节点，可以自己实现一套分布式的文件同步系统，甚至这套系统部署节点越多，同步速度越快，并且不用互联网也能用。

所以最后的结果就是我彻底放弃了中心化的同步工具 (Dropbox, Google Drive)，转而使用分布式的 Syncthing，并且让 Syncthing 同步原来的 Dropbox 文件夹，无痛迁移。

## 代码托管
代码托管倒是没太多可谈的，毫无疑问 GitHub，最多在配置一下 mirror, 定期从 GitHub repository 中备份到 GitLab 或者自建的 [Gogs](/post/2018/03/gogs.html) 中。

另外 Gogs 的社区 fork 版本 Gitea 也不错。

## 笔记
笔记是另一个重头，之前从 Evernote [叛逃](/post/2016/07/evernote-alternative.html) 到 WizNote，陆陆续续也续了三年会员，但一直也非常担心 WizNote 做不下去，所以一直[留着一手](/post/2018/11/wiznote-export-and-backup.html)，方便快速导出走人。

不过前不久再次发现 [Joplin](/post/2019/10/joplin-best-evernote-alternative-i-ever-used.html)，作为一款本地笔记应用非常完美，唯独缺少同步功能，不过 Joplin 依赖本地文件，那么用上面提到的文件同步工具就完美地解决了同步问题。

另外 [leanote](https://leanote.com/) 似乎也是一个自建不错的选择，不过目前我没尝试。


## reference

- 受[此篇文章](https://zhuanlan.zhihu.com/p/50335990) 启发，整理目前我的方案
