---
layout: post
title: "你的私人云操作系统：Neverinstall 使用体验"
aliases:
- "你的私人云操作系统：Neverinstall 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [ cloud, cloud-computer, saas, ]
create_time: 2023-11-18 13:31:53
last_updated: 2023-11-18 13:31:53
---

这两天在想如何让 Obsidian 的使用体验可以无处不在，虽然现在手机端 Android 和 iOS 都有了客户端，并且桌面版也都有，我大部分使用 Obsidian 的使用场景也能够满足，但是我个人不习惯在 iOS 上使用 Obsidian，我使用 [[Syncthing]] 来同步我的笔记库，但是 iOS 上一直没有找到一个比较合适的同步客户端，虽然之前也买过一年的 Obsidian Sync 服务，但是感觉其提供的服务目前还没有产生那么价值，所以之后就停止续费了。但这就带来一个问题，就是我在移动或者手机端的时候不是非常方便，虽然之前在手机端记录的需求还挺少的，但是有些时候想要随手查询自己的笔记还是挺麻烦。

就当我有这个麻烦的时候，有一点看 [[Reddit]] 的帖子，发现也有人问 Obsidian 是否提供了网页版，或者有没有 Self-hosted 的网页版本方案，虽然我浏览完所有的回复，没有看到几个比较符合的解决方案，有人说可以用 Visual Studio Code 打开自己的仓库，也有人说可以将笔记库提交到 GitHub，然后就有了一个在线的文件，但我在评论中看到了一个评论，那就是本文的主角---- [Neverinstall](https://neverinstall.com/)。

## Neverinstall

Neverinstall 是一个私人的云电脑，看他给自己起得标题就能看出来 ---- Your personal cloud computer powered by AI。这个宣传语中的 AI 具体体现在哪里呢？ 就是登录进其后台时，可以通过对话的形式，让 AI 自动给你构造一个工作环境，比如说你说想要一个网页应用的编程环境，那 Neverinstall 就可以根据你的需求，自动创建一个工作区，然后在工作区中安装必要的工具，比如浏览器，IDE 等等。

![](https://photo.einverne.info/images/2023/11/18/fMMI.png)

免费版本的环境，提供 6 个虚拟核 12 GB 内存， 以及 100 GB 磁盘空间，也是非常慷慨了。

![fyI4](https://photo.einverne.info/images/2023/11/18/fyI4.png)

不过免费版有一个限制就是，如果 3 分钟没有使用那么就会暂停（睡眠），并且每一次使用都有 30 分钟的限制，每一次使用（Session）之间需要等待 1 个半小时。
不过我个人体验来说，从暂停状态恢复过来的等待时间还能接受，基本上半分钟之内。但是每次使用有时长限制就会影响使用了。

如果有这个时长限制那就还不如我在 VPS 上安装一个 VNC 远程连接过去了。

## 使用体验

Neverinstall 将用户体验流程做得非常完善，在其网站中，只需要鼠标点点，选择需要的应用，然后选择安装在哪里（什么节点），然后短短几十秒的时间就构造了一个环境，然后可以直接在浏览器中打开这个虚拟桌面，在测试的过程中，我选择了 Chrome 和 Obsidian ，然后可以看到构建成功的桌面上自动就有这几个应用，直接点开应用也能直接使用，比如我用 Chrome 点开一个 YouTube 视频，然后右侧打开 Obsidian，这个过程虽然能看到在系统 UI 资源上做了一些精简和优化，但是整体使用流畅度还可以。

![fK5W](https://photo.einverne.info/images/2023/11/18/fK5W.png)

可以看到的是这个一个 Debian 的操作系统，并且安装了 Xfce 的桌面。

![fNfQ](https://photo.einverne.info/images/2023/11/18/fNfQ.png)

打开终端看看 htop

![fPHX](https://photo.einverne.info/images/2023/11/18/fPHX.png)

## 总结

Neverinstall 的整体体验还不错，但是毕竟还是有使用时长的限制，所以 Obsidian 的需求看来还是满足不了。但是如果有临时性的需求，比如在 Windows 电脑上，有一些命令想要用一个 Linux 环境执行一下，临时使用一下这个环境倒是也好不错，毕竟几分钟的时间内就可以马上 Boot 进去，开始使用。

## related

- [[Kasm Workspaces]]
