---
layout: post
title: "使用 mdBook 生成在线文档"
aliases: 
- 使用 mdBook 生成在线文档
tagline: ""
description: ""
category: 学习笔记
tags: [ gitbook, online-document, rust, wiki, markdown, notes, ]
last_updated:
---

很早以前就用过 [[GitBook]] 来将 Markdown 生成网页[^1]，但是后来 GitBook 命令行工具不再持续的更新，开发团队转向了维护商业版本的 GitBook 之后就用的少了。

[^1]: <https://einverne.github.io/gitbook-tutorial/>

但随后就发现了使用 [[Rust]] 编写的 [[mdBook]]，体验和 GitBook 一致，基本上可以完美的代替 GitBook。有趣的是官方的介绍也是对标 GitBook 的：

> Create book from markdown files. Like Gitbook but implemented in Rust.

官方网站：

- <https://github.com/rust-lang/mdBook/>

## 安装 {#installation}

因为 mdBook 依赖与 Rust 所以需要安装 Rust 环境。

然后执行如下命令即可：

	cargo install mdbook

## 用例

初始化：

	mdbook init
    
构建：

	mdbook build
    
监控更改：

	mdbook watch
    
启动一个本地服务：

	mdbook serve
    
清理：

	mdbook clean

## 插件

### 如何生成 TOC
要生成页内目录可以使用 [toc](https://github.com/badboy/mdbook-toc)

    cargo install mdbook-toc

## 相关

Python 的文档工具 [[mkdocs]] ：

- <https://www.mkdocs.org/>


tag: #GitBook #wiki #Book #Markdown #note #writing #个人知识管理