---
layout: post
title: "Obsidian 未来的笔记应用"
tagline: ""
description: ""
category: 产品体验
tags: [obsidian, note-taking, evernote, linux,]
last_updated:
---

看过我过去文章的人都知道在此之前我都使用 WizNote 来作为本地笔记应用，但是这两年在记笔记这件事情上出现了非常多的可能性，虽然我本人一直在关注着不同类型的笔记应用，从传统的 Evernote，OneNote 到 Notion 等等模块化的笔记应用，多多少少也尝试了一下，但是一直没有深入的去用，因为就我目前的需求，WizNote + 本地的 markdown + vim + git 基本就满足了，直到昨天晚上我在豆瓣上阅读了[笔记类软件的双向链新浪潮](https://www.douban.com/note/762552900/) 这篇文章，然后我发现原来我在记笔记的时候遇到的一些问题原来还有这样一种解决方式。

## 问题
我在用纯手工方式管理笔记的时候遇到的这些问题，中间我也曾想使用 wiki 来代替笔记，尝试了 gitbook, BookStack, TiddlyWiki 等等，都或多或少的有些问题。

### 多媒体管理
我用原来 markdown + vim + git 的方式存在的一些问题是，如果我只简单的记录文本，没有那么多的媒体（图片，音视频） 需要管理，还是能够非常方便的进行管理的，而一旦图片等等媒体文件成倍增长时，这个时候我就陷入了管理困境，这也是我的博客鲜少有图片的原因之一。

而 Obsidian 将媒体文件和 markdown 文件存放到一起，并且可以简单的使用名字相互进行关联，这使得管理变的轻松。内建的录音器甚至可以直接录音后在文件中插入音频内容。

### 链接
关于内链，可能我的思路还停留在上个世纪的“超链接”，我文章的大部分链接都是通过超链接相互关联的，而在 WizNote 中，将不同的笔记内容进行关联，我就只能使用 tag，或者手工进行分类来实现。

而在 Obsidian 中，只需要 `[[topic]]` 就可以非常方便的实现链接到名为 topic 的文章，而这一切都是 Obsidian 做的，并且 topic 的这篇笔记甚至可以不存在，在写的时候写下，然后 Obsidian 会生成链接，只需要点击就可以快速的创建这个 topic. 到这里我才发现原来我那种手工管理内部链接的方式简直太愚蠢了。

在 Obsidian 中通过 internal link 和 graph view 完美的解决了笔记之间关联的问题。

## What is Obsidian?
Obsidian 这样介绍自己：

> Obsidian is a both a Markdown editor and a knowledge base app.

直接献上官网地址：

- <https://obsidian.md/>

再来看看预览图：

![obsidian note taking](/assets/obsidian-note-taking-screenshot.png)


## 特性
Obsidian 这些功能是吸引我让我尝试的理由。

### 本地化数据
所有数据都以本地文本形式保存。其他一些软件使用私有的格式保存用户数据是让我避而远之的原因之一。

Obsidian 管理的所有数据都在本地，那也就意味着用户可以选用自己喜欢的任何同步工具进行数据加密，同步等等。现成的同步方案 Dropbox 等等，或者 Git ，而我选择使用另一款 [分布式同步工具 Syncthing](/post/2019/10/syncthing.html)

![obsidian note taking create notes](/assets/obsidian-note-taking-create-notes.png)

### Links 是一等公民

如果上手使用 Obsidian，那么第一感受就是可以在笔记的任何地方非常快速的创建内链，通过内链的方式，系统里面的笔记就形成了网状的结构，这也是 bi-directional linking 双向内链的精髓之处。

Obsidian 在官方的 Demo 中引述了 John Locke 在 1690 年发表的 《An Essay Concerning Human Understanding》

> The acts of the mind, wherein it exerts its power over simple ideas, are chiefly these three:
> > 1. Combining several simple ideas into one compound one, and thus all complex ideas are made.
> > 2. The second is bringing two ideas, whether simple or complex, together, and setting them by one another so as to take a view of them at once, without uniting them into one, by which it gets all its ideas of relations.
> > 3. The third is separating them from all other ideas that accompany them in their real existence: this is called abstraction, and thus all its general ideas are made.

简单的翻译：

- 将几个简单的想法组合成一个复杂的想法，从而完成所有复杂的想法：
- 第二，是将简单或复杂的两个想法放到一起，相互设置关联，方便查看它们，而同时又不将它们融合到一起，从而可以一眼查看所有想法之间的关联。
- 第三，是将这些想法与实际存在的所有其他思想分开：这称为抽象，所有一般的思想都如此形成。

笔记的层级关系 (Hierarchy) 实现了第一点，而内部链接 (linking) 正是第二点，而第三点如何在笔记中应用， Obsidian 的作者也没有想清楚，但他也说了，这可能是更高阶的抽象 ---- **but it might have something to do with programming or macros.**

### 用户拥有所有工具链
记笔记是一件非常个人化的事情，这也就意味着不可能有一个包容一切的解决方案适用于所有人。

> Note-taking is an incredibly personal thing

所以 Obsidian 并不会武断地尝试去提供一个完整的产品，而是提供一个基础，以及很多的功能模块，用户可以自己创造并实现自己的需求。

最基础的功能包括，查看文件，编辑文件，搜索文件，而这对于一般的需求也已经完全足够。在此之上，你可以构建独立的功能模块来增加笔记的体验，比如：

- 如果是记录上课的笔记，那么可以使用 audio recorder 和 LaTex math
- 如果是记录工作笔记，可以使用 slides 和手写支持
- 而如果你是研究工作者，backlinks（反向链接）和字数统计就很重要

Obsidian 不期望有一个插件可以解决所有的问题，但 Obsidian 提供了足够的自由度，在能够实现不同需求的时候，也不会搞乱界面。


## Zettelkasten method
卡片标签式笔记法，Obsidian 也可以兼容。


## reference

- <https://github.com/joekroese/tiddlyroam>
