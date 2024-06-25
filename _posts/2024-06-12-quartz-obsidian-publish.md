---
layout: post
title: "使用 Quartz 发布 Obsidian 笔记库"
aliases:
- "使用 Quartz 发布 Obsidian 笔记库"
tagline: ""
description: ""
category: 产品体验
tags: [obsidian, obsidian-publish, obsidian-vault, ]
create_time: 2024-06-12 15:00:37
last_updated: 2024-06-12 15:00:37
dg-home: false
dg-publish: false
---

自从使用 [[Obsidian]] 以来就一直想要有一个开源版本的 [[Obsidian Publish]] 代替，过去这几年也尝试了不少方案，比如 Jekyll 静态网站生成，比如使用 [[Logseq]] 生成[网站](https://notes.einverne.info/)， 然后还想过从 Obsidian 同步到 Notion 里面，然后再使用 [[NotionNext]] 来生成网站。

下面是所有我尝试过的方案

- [[Nolebase]] 一款基于 VitePress 的在线知识库
- [[Obsidian Digital Garden Plugin]] 一款 Obsidian 插件，结合 GitHub 仓库可以实现快速分享笔记
- [[Digital Garden Gatsby Template]] 一款 Gatsby 模板
- [[Digital Garden Jekyll Template]] 一个 Jekyll 模板
- [[Gatsby Theme Primer Wiki]]
- [[MindStone]]
- [[Obsidian-mkdocs template]] 基于 [[mkdocs]] 的知识库
- [[Obsidian PKM]]
- [[Jekyll Garden Template]]
- [[Perlite]]
- [[Pubsidian]]
- [[flowershow]]

但是以上的方案我尝试之后都不是一个我认可的完善的方案，或多或少有一些问题，也不能和我自己的工作流程结合起来。

但是很多年前看到过一个静态网站分享的方案 Quartz，没想到发展了几年之后发布的 v4 版本，可以完美的融合到我的工作流中，并且可以非常方便地分享我的本地 Obsidian Vault。

## 什么 Quartz

[Quartz](https://github.com/jackyzha0/quartz) 是一个静态网站生成工具，可以用来发布 Markdown 的笔记，和 Obsidian 搭配使用绝佳。

Quartz 发布 4.x 版本之后可用度大大提高，并且可以直接作为 Obsidian Publish 的开源代替存在。

Quartz 需要 Node v18.14 以及 npm v9.3.1

## 功能

- 自动生成双向链接 Automatically generated backlinks
  - 支持 wikilinks，backlinks, Latex, 语法高亮
- 支持 Graph View
- 链接预览 Link Previews
- 本地关联图 Local graph
- 支持两种链接 Markdown and WikiLinks
- 支持 Table of Content
- Dark & light mode

**Cons:**

- No sidebar Navigation

![](https://miro.medium.com/v2/resize:fit:1400/1*xPrwTPvq5O8vjB0F6Al0BA.png)

界面

![vMM9](https://photo.einverne.info/images/2024/06/25/vMM9.png)

## 安装

通过克隆代码本地安装

```
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
npx quartz create
```

在执行了上面的命令之后，会在命令中选择是否要创建一个全新的仓库，还是直接使用 `ln -s` 来软链接一个既存的文件夹。

然后再运行

```
npx quartz build --serve
```

就可以直接启用一个本地的在线预览。

最后效果可以参考[这里](https://pt-wiki.gtk.pw)。

## reference

- [GitHub](https://github.com/jackyzha0/quartz)
