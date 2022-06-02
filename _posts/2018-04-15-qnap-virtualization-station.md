---
layout: post
title: "威联通折腾篇三：Virtualization Station 安装虚拟机"
aliases: "威联通折腾篇三：Virtualization Station 安装虚拟机"
tagline: ""
description: ""
category: 学习笔记
tags: [qnap, qnap-tutorial, nas, virtualization, hypervisor, vm, container, docker, virtualization-station, ]
last_updated:
---

这里主要是介绍威联通 NAS 上面的 Virtualization Station （虚拟机工作站），这个应用能够在 NAS 上运行虚拟机，支持 Windows， Linux，Android 等等系统。威联通的虚拟机功能可以让用户在一台机器上同时运行多个系统。

Virtualization Station 支持通过 .ova, ovf, .qvm 或者 .ios 文件来安装虚拟化系统。

## 安装

使用这个虚拟机非常容易，直接在应用中安装 Virtualization Station 即可，然后在桌面上点击打开，就能够见到基本的界面，如下图

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/39658196230/in/dateposted/" title="Screenshot from 2018-04-15 15-55-29"><img src="https://farm1.staticflickr.com/885/39658196230_82f80a534c_z.jpg" alt="Screenshot from 2018-04-15 15-55-29"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

安装虚拟系统的方法也很简单，只要有系统 ova, ovf, qvm, 或者 iso 镜像就可以。

## 虚拟机的使用
和绝大部分虚拟机的需求一样，你可以在 NAS 的虚拟机上做任何事情，包括测试，备份，恢复等等。对于一个 7*24 小时都开着的机器来说，比如可以安装一个 Windows 虚拟机，将百度网盘的文件拖下来，使用 BT 软件挂机等等功能都可以被开发出来。

下面放一张图，可以解释为什么威联通里面有三个类似功能的 APP(Virtualization Station, Container Station, Linus Station) 他们的区别

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/40573690695/in/dateposted/" title="虚拟 container vs vm"><img src="https://farm1.staticflickr.com/803/40573690695_3c1eba9521_z.jpg" alt="虚拟 container vs vm"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

总结来说 Virtualization Station 是一个虚拟机，在 NAS 上跑虚拟化的系统，虽然利用率，不错，但是可能比不上 Linus Station。而如果更加愿意使用单独的服务，比如跑 Docker ，那么 Container Station 其实更加适合。

因为威联通现在已经不支持百度云，所以在威联通上使用百度云非常的难受，只能够通过虚拟化 Windows 在 Windows 上跑百度云再将文件拉下来存到 NAS 上。

## reference

- <https://www.qnap.com/feature/virtualizationstation3/>
- <https://www.qnap.com/en/how-to/tutorial/article/how-to-use-virtualization-station>
