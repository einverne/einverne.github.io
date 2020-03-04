---
layout: post
title: "离线文档查看工具"
tagline: ""
description: "文档查看器"
category: 经验总结
tags: [document, 经验总结 , dash, zeal, linux]
last_updated:
---

在离线状态下看文档利器，速度非常迅速。最早知道是 Mac 下的 [Dash](https://kapeli.com/dash)，但是后来转 Linux，就想着要一个同类型的工具，没想到真的发现了更加好用的 [Zeal](https://zealdocs.org/)。但就离线看文档而言，Zeal 不仅轻量而且快速。

## Mac 下 Dash

去除快速查看文档之外，还有另一个非常实用的功能就是 Code snippets，并且和一些 IDE，编辑器结合，能够通过少量的快捷键到达非常快速的输入。从另外一方面想，作为本地代码片段管理似乎也是不错的选择。

Dash 比较突出的几大功能：

- 自动保存状态，每次关闭都会记录状态，下次打开时会自动定位
- 设备间同步，包括安装的文档，个人信息及收藏代码片段
- 开发人员可以给公开的或者私有的文档或者例子添加评论
- 对市面上常见的 IDE 都有插件支持

## Linux 下 Zeal
Zeal 有如下几个功能：

- 生成自己的技术文档
- 免费并且开源，文档内容源自 Dash
- 有 Vim，Emacs，Sublime Text 等插件

### Linux 下安装

详情可以查看官方[文档](https://zealdocs.org/download.html)。 推荐使用 PPA 安装，官方更新比较及时

    $ sudo add-apt-repository ppa:zeal-developers/ppa
    $ sudo apt-get update
    $ sudo apt-get install zeal

遇到 Bug 或者任何问题都可以到 GitHub 提出 issue：<https://github.com/zealdocs/zeal/issues>

Zeal 安安稳稳的做好文档查看就已经很好了。

### 配置
Linux 下默认配置地址在：`~/.config/Zeal/Zeal.conf` 。

离线文档地址：`~/.local/share/Zeal/Zeal/docsets`

## Chrome 下离线文档

在搜索过程中又发现了一个查看文档的网站 <http://devdocs.io/> , 也同样可以使用 Chrome 插件达到离线查看文档的效果，但是看了一眼似乎没有 Android 的文档，但是其他似乎挺全的。并且整个网站还是开源的。

- <https://github.com/Thibaut/devdocs>


## reference
- <https://bbvaopen4u.com/en/actualidad/dash-zeal-and-devdocs-way-organize-your-api-repository>
