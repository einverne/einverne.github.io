---
layout: post
title: "Gitbook 使用记录"
tagline: ""
description: ""
category: 学习笔记
tags: [gitbook, git, github, book, publish, ]
last_updated: 
---

Git 本来是一个版本控制工具，多人协作工具，但却爆发出无限的潜能，于是有人开始使用[Gitbook](https://github.com/GitbookIO/gitbook)来写书，设计师们用Git来[管理](https://www.webdesignerdepot.com/2009/03/intro-to-git-for-web-designers/)版本。这篇文章主要就是想要介绍一下 [[GitBook]] 的简单使用。

Gitbook 使用 Markdown 作为书写格式，Git 来做版本控制，结合两者来编排书籍。Gitbook 的安装非常方便，在本地有 Node.js 和 npm 的环境下

    npm install gitbook-cli -g
    gitbook -V  # 检查版本

就能够安装 gitbook 命令。

Gitbook.com 是一个发布 gitbook 编写书籍的在线网站，提供公开和私有的托管服务，和 GitHub 一样，私有的 Gitbook 是需要付费使用的。但是公开的书籍是无上限的，使用在线的 Gitbook 可以让未接触过 Git 和 Markdown 的作者轻松的创建书籍，并且在线的编辑器可以让作者安心的只关心内容，而不必在意排版，并且支持多人协作编写。

- GitBook项目官网：http://www.gitbook.io
- GitBook Github地址：https://github.com/GitbookIO/gitbook

## 使用
gitbook 的使用可以简单的归纳为如下两步：

- 使用 gitbook init 初始化书籍目录
- 使用 gitbook build 编译书籍到静态网站
- 使用 gitbook serve 本地访问书籍

在使用 `gitbook init` 之后本地会生成两个文件 `README.md` 和 `SUMMARY.md` ，这两个文件都是必须的，一个为本书介绍，一个为本书目录结构。

## gitbook 插件
Gitbook 拥有很多插件来扩展 Gitbook 的功能，比如支持数学公式，支持Google统计，评论等等。插件可以在 <https://plugins.gitbook.com/> 找到。

插件安装比较简单，在目录下添加 `book.json` 文件，填写下面格式

    {
        "plugins": ["plugins1", "plugins2"],
        "pluginsConfig": {
            "plugins1": {...}
        }
    }

注册完插件之后，安装插件 `gitbook install`。 插件开发可以参考[官方文章](https://developer.gitbook.com/plugins/index.html)

常用插件

- [editlink](https://plugins.gitbook.com/plugin/editlink) 顶部显示编辑此页
- [image captions](https://plugins.gitbook.com/plugin/image-captions) 抓取图片中 `alt` 或者 `title` 属性显示在图片下
- [anchors](https://plugins.gitbook.com/plugin/styles-sass) 标题带有锚点
- [disqus](https://plugins.gitbook.com/plugin/disqus) Disqus 评论插件
- [splitter](https://plugins.gitbook.com/plugin/splitter) 侧边栏可以调解宽度

如果不需要使用 Gitbook 自带的插件可以使用 `-` 来排除

    "plugins" : [ "-search" ]

如果想知道更多关于 Gitbook 的使用，以及各种插件，主题的使用，可以具体参考 <https://einverne.github.io/gitbook-tutorial>

## reference

- <https://toolchain.gitbook.com/setup.html>
