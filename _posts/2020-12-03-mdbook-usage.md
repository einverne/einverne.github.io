---
layout: post
title: "使用 mdBook 生成在线文档"
aliases: 
- 使用 mdBook 生成在线文档
tagline: ""
description: ""
category: 学习笔记
tags: [gitbook, online-document, rust, wiki, markdown, notes, static-site]
last_updated:
---

很早以前就用过 [[GitBook]] 来将 Markdown 文件生成静态网页[^1]，但是后来 GitBook 命令行工具不再持续的更新，开发团队转向了维护商业版本的 GitBook 之后就用的少了。

[^1]: <https://einverne.github.io/gitbook-tutorial/>

但随后就发现了使用 [[Rust]] 编写的 [[mdBook]]，体验和 GitBook 一致，基本上可以完美的代替 GitBook。有趣的是官方的介绍也是对标 GitBook 的：

> Create book from markdown files. Like Gitbook but implemented in Rust.

mdBooK 的官方 GitHub [仓库](https://github.com/rust-lang/mdBook/)。

## 安装 {#installation}

因为 mdBook 依赖与 Rust 所以需要安装 Rust 环境。

然后执行如下命令即可：

```
cargo install mdbook
```

## 用例

初始化，创建指定名字的项目：

	mdbook init <name>

初始化完成之后会生成如下的目录:

```
├── book/           # 构建输出目录
├── src/            # 源文件目录
│   ├── SUMMARY.md  # 目录文件
│   └── chapter_1.md # 章节文件
├── book.toml       # 配置文件
└── .gitignore      # Git忽略文件（可选）
```

SUMMARY.md 是最重要的文件，它定义了书籍的目录结构。


然后进入刚刚初始化好的 mdbook 目录，运行如下的命令构建：

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

## 持续集成中部署 mdBook



## 相关

Python 的文档工具 [[mkdocs]] ：

- <https://www.mkdocs.org/>


tag: #GitBook #wiki #Book #Markdown #note #writing #个人知识管理