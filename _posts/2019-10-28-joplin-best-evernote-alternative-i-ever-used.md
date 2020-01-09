---
layout: post
title: "Joplin 至今为止用过的最好的 Evernote 代替品"
tagline: ""
description: ""
category: 产品体验
tags: [evernote, notebook, joplin, note, note-taking, ]
last_updated:
---

Joplin 是一个开源的笔记应用，曾经在调查 [Evernote 代替品](/post/2016/07/evernote-alternative.html) 的时候简单的看到过，但是当时也只是观望的态度，因为当时发现 Joplin 的插件有些不完美，有些网页 HTML 格式无法保证。

> Joplin is a free, open source note taking and to-do application, which helps you write and organise your notes, and synchronise them between your devices.

但是时隔一些时间过来看，Joplin 发展已经超出我想象，不仅提供了各个平台的版本，还提供了命令行版本。虽然日常用 Vim，rg，fzf，git 来记录一些笔记，倒也还可以，但是毕竟有些管理上的问题，尤其是当笔记数量已经达到数百数千条的时候。

一些非常棒的特性：

- 跨平台，横跨所有桌面端，移动端，甚至提供了命令行版本
- 原生支持 markdown 格式
- 所有的笔记都可以搜索，加标签，所有内容都保存在本地
- Joplin 可以通过其他第三方同步工具 (Dropbox/NextCloud/OneDrive/WebDAV/etc) 进行备份以及同步
- Web clipper, 之前就是因为无法逃脱好用的 WizNote 插件才没有转，现在用 Joplin 的扩展，非常好用了，很快，很精确
- 纯文本文件保存支持方便导入导出

## Installation

各个客户端的安装直接参考官方网站：

- <https://joplinapp.org/>

## Client

桌面客户端没有什么可说的，从最早只支持 Markdown，到如今可以看网页原始 HTML，客户端也在进步。和大部分的笔记应用一样，左侧是笔记本，点开笔记本能查看笔记本中的内容，右侧主要部分就是笔记内容。

笔记本的层级关系支持树形结构，可以嵌套很多子目录，所以非常适合用来[归类](/post/2016/11/folder-vs-tag-lable.html) 。

更多内容可以查看[我的笔记整理法则](/post/2016/12/note-taking-style.html)

### Global Search
在桌面版中，可以按下 Ctrl + G 然后输入笔记的标题来快速跳转到该笔记。或者在按下 Ctrl + G 后可以使用 `#` 跟着 Tag 名或者使用 `@` 跟着笔记本标题来跳转。

### External Editor
使用快捷键 Ctrl + E 或者直接点击工具栏的 External Editor 可以打开外部编辑器。个人推荐 Haroopad.


## Chrome Extension
离不开 WizNote 和 Evernote 很重要的一点就是 Chrome 插件，在日常使用过程中，在 Chrome 下浏览咨询，工作的时间占用非常高，也经常需要收藏剪切一些资料。这个时候 WizNote 就成为了一个非常重要的资料保存箱。

在很早之前使用 Joplin 的时候，Chrome 插件不是完善，只能够将 HTML 剪切成 Markdown，并且很简陋，不能够满足我的日常使用。而这一次体验，发现 Chrome Extension 已经足够用，能够剪切选中内容，整个网页，截图保存，剪切网址等等，完全的覆盖了日常使用需求。不过有一点需要注意的是，Joplin 的 Chrome 插件是需要本地将 Joplin 开启一个服务的，并不是像 WizNote 先收藏到云端服务器，然后要使用时再从服务器中拉取的。

## Terminal
命令行版本的安装也非常简单，界面布局和 GUI 版本相差不大。但是需要注意的是命令行版本和桌面版并不是共用的一套数据集，他们相互是独立的，在桌面版修改，并没有在命令行版本中。

## Sync
关于同步是我最想说的，官方提供了 NextCloud，Dropbox，WebDav 等等同步方式，但是我个人推荐 [Syncthing](/post/2019/10/syncthing.html)，在不同机器上都安装上，在服务器上也安装上，就完美的实现了 Dropbox，NextCloud 单点的问题，即使中心服务器挂了，也能够有多个备份能同步。

## Conclusing
如今的 Joplin 已经能够满足日常使用了，所以我会渐渐的将 WizNote 笔记中的内容迁移到 Joplin 中。又将一个闭源产品迁移到开源工具，开心。
