---
layout: post
title: "将 Evernote 笔记导入到 Obsidian"
aliases:
- "将 Evernote 笔记导入到 Obsidian"
tagline: ""
description: ""
category: 经验总结
tags: [ evernote, wiznote, obsidian, markdown, note-taking]
create_time: 2023-08-01 15:48:54
last_updated: 2023-08-06 15:48:54
---

不久之前看到 Obsidian 推出了一个官方的插件可以将 Evernote 的笔记导入到 Obsidian 中，于是就把「将 Evernote 笔记导入到 Obisidian」列为了一项我的待办事项，虽然已经很多年没有用 Evernote 了，但里面还有一些摘录，我一直认为笔记只有能被检索到才有价值，而 Obsidian 的检索速度也非常快，虽然没有 OCR，但纯文本的检索如果能被反复找到，那么可能那些笔记还有价值。

## 准备老版本的 Evernote

如果使用最新版本的 Evernote，那么登录的时候 Evernote 就会弹窗让你付费，或者试用 7 天，如果点击取消只能退出账户。所以这个时候可以下载一个老版本的，比如 7.10 版本的 Evernote。你可以从 [MacUpldate](https://www.macupdate.com/app/mac/27456/evernote/old-versions) 这个网站上下载到老版本的 Evernote。

登录 Evernote 之后等待同步下载笔记，

![Uwa2](https://photo.einverne.info/images/2023/08/06/Uwa2.png)

选中 All Notes，然后 Cmd + A 选中所有的笔记。然后右击，导出笔记，然后勾选「Include tags for each node」。接下来就是漫长的导出时间。

## 安装 Importer 插件

打开 Obsidian，然后在插件安装列表中搜索「Importer」，找到 Obsidian 官方出的插件，下载。之后在侧边栏会多出一个按钮，通过这个按钮调出导入的对话框。

![U79G](https://photo.einverne.info/images/2023/08/06/U79G.png)

在该对话框中设置刚刚导出的 `.enex` 文件，然后导出到的文件夹。点击 Import，之后就根据笔记的数量会有一段很长的时间等待。

导入完成之后就能在 Obsidian 的对应的文件夹中找到从 Evernote 中到处的笔记了。
