---
layout: post
title: "我的 Obsidian 笔记跨设备同步方案"
tagline: ""
description: ""
category: 检验总结
tags: [obsidian, markdown, git, syncthing, note, note-taking,]
last_updated:
---

自从半年前发现了 [Obsidian](/post/2020/05/obsidian-note-taking.html) 这款笔记软件，我就开始大量的使用该应用做笔记，有人说过：「工具是开发者方法论的固化」。这么多年了我一直有一种工具控的倾向，往往同一个需求会对比可能的所有方案，最后再决定一个，但是近些年来我越来越倾向于「简单就是好」，并且数据要由自己掌控的「工具选择逻辑」。

## Do one thing and do it well
基于上面的选择逻辑，我的 Obsidian 跨平台同步工具，我选择了：

- [Syncthing](/post/2019/10/syncthing.html)，作为文件同步工具
- Markor，作为 Android 上的 Markdown 编辑器，我提交了一段模板可以来创建 Zettelkasten 笔记
- Git，版本同步（配合[git subtree](/post/2020/04/git-subtree-usage.html)）
- Bash/Cron/[Hammerspoon](https://github.com/einverne/dotfiles/blob/master/hammerspoon/autoscript.lua)，定时脚本提交备份到 Git，然后自动推送到远端备份。

每一个工具都只专注做一件事情，搭配起来工作非常完美。

2021 年 9 月更新

这一年来 Obsidian 的生态发生了很多变化，Obsidian 已经发布了 Android/iOS 版本，虽然现在我依然使用 Markor 来查看笔记，但最近已经慢慢的转向 Obsidian 官方的应用，Obsidian 官方的应用在搜索方面做的要比 Markor 好。

而之前使用 Syncthing，现在也一如既往的使用 Syncthing，但是最近购入了 Obsidian Sync 一方面支持一下开发者，另一方面也想慢慢地将移动端使用官方的同步工具来同步笔记。

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">用了一年多 <a href="https://twitter.com/hashtag/obsidian?src=hash&amp;ref_src=twsrc%5Etfw">#obsidian</a> ，虽然平时都用 Syncthing 来同步，但还是买了一年 Sync，支持一下开发者。 <a href="https://t.co/YPvNXMDhyI">pic.twitter.com/YPvNXMDhyI</a></p>&mdash; Ein Verne (@einverne) <a href="https://twitter.com/einverne/status/1440676136460046351?ref_src=twsrc%5Etfw">September 22, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


## 我的需求
我最基本的需求，就是当我有什么想法的时候，可以随时随地地记录到一个地方，这个地方以前是 wiznote，但是我迁移到了 Obsidian 之后，缺乏两个机制：

- 一个是多平台的同步
- 一个是版本管理

为了解决第一个问题，引入了 Syncthing， 这个是我已经使用很久了的文件同步工具，代替了 Dropbox，NextCloud，正好 Obisidian 本身管理的就是本地的纯文件，直接添加到同步目录即可。

为了解决第二个问题，纯文本自然地就想到了使用 Git 作为版本管理。

但是问题在于 Zettelkasten 的其中一条原则便是「最好在一个地方管理所有的笔记」，而我曾经有很多笔记已经记录到了 Jekyll 的博客里面，也正好是 Markdown 的文本文件。所以我在一个中心的 Git 仓库中存放了 Obisidian 中的所有笔记，然后使用 `git subtree` 将我的 [Blog](https://blog.einverne.info/) 作为其中的一个子目录 `Blog` 添加进来，这样我就可以在一个 Obsidian 的 Vault 中搜寻，连接我所有的笔记。

利用上面的 Syncthing，Git，我可以做到多地（本地，VPS，Android 手机）的备份，然后将仓库同步到 GitHub 再有一份备份。另外通过 Git 的提交历史可以看到所有的笔记修改记录。这时候我就想通过一个自动提交的脚本，每隔半小时提交一次，这样最多也就丢失半小时的笔记，对我个人而言我也能接受。所以当时直接用 Hammerspoon 的特性写了一个脚本自动同步。

```bash
#!/bin/bash

now=$(date +"%m.%d.%Y_%T")

cd /Users/einverne/Sync/wiki
git add --all && git commit -m "Auto commit at $now"
git push origin master
```

## 发布我部分的笔记

在知识管理的概念中，我了解到了 [[Digital Garden]] 概念[^1]，Digital Garden 是一个开放分享的数字花园，这个概念中有两个重点：

[^1]: <https://salman.io/notes/digital-gardens/>

- 有选择地将一部分笔记和想法公开
- 游客可以在笔记之间来回浏览

在这个概念上实现最好的就是 [Andy Matuschak](https://notes.andymatuschak.org/About_these_notes) 的在线笔记。

我也想通过从我的 Obsidian 笔记中选择一部分整理好的内容分享出，但我又不想有额外的操作。所以正好通过上面提及的 `git subtree`，我日常的笔记会存放在其他的目录，当我准备发布的时候，将笔记移动到 Blog 中的 `_posts` 目录，在提交，之后将修改推送到 Blog 的远端时就自动完成了发布的过程。现在唯一不太满意的部分就是现在博客上进行页内跳转的时候还依赖于超链接，在编写文章的时候也需要跳出去选择相应的页面链接，而不能依赖与 Obisidian 提供的双向连接。

但总是上面一套流程是我如何实现在多平台上同步笔记的方案，虽然可能对非编程工作者会有一些障碍，但只要熟悉了这个流程之后，用起来真的非常方便。另外就是我身边并没有 iOS 的设备，在 iOS 上可能需要依赖其他的工具，比如可以使用 iCloud 或其他商业的同步工具来同步笔记，然后使用 1Writer 来作为编辑器。

总之这就是我实现跨设备的方案，具体我是如何做笔记，以及笔记的内容，如何对笔记内容进行连接，我会在[另外一篇文章](/post/2021/01/my-method-to-take-notes-using-zettelkasten-and-obsidian.html)中再进行阐述。
