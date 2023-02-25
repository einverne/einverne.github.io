---
layout: post
title: "GitHub Blocks 使用体验"
aliases:
- "GitHub Blocks 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [ github, github-blocks, visul]
create_time: 2023-02-25 16:29:59
last_updated: 2023-02-25 16:29:59
---

前两天邮箱里面突然收到 GitHub 发来的邮件，欢迎使用 GitHub Blocks，当时比较忙就没怎么注意，今天正好闲下来，就把邮件重新看了一下。

## 什么是 GitHub Blocks

GitHub Blocks 是一个实验性质的 UI 界面，在这个界面里面可以使用自定义的组件让用户的 repositories 更加丰富。你可以创建展示的组件，共享给社区，也可以直接使用社区创建的展示组件。

简单的来说，GitHub Block 就是仓库的一种展现形式，在 GitHub Blocks 的显示页面中，用户看到的不再是枯燥无味的代码，而是可以根据不同的类型（excalidraw，json，css，mermaid，etc）展示出不同的样式。

GitHub Blocks 的诞生是为了回答如下的问题：「如果开发者不仅可以展示在 GitHub 展示代码和数据，而且可以自定义 GitHub 界面，那么会创造一个什么样的平台」？

有没有想过一个问题，如果设计师可以直接通过 CSS 文件来查看其样式，而不需要等开发者将其渲染出来；如果代码审阅者在查看某个分支的时候可以不需要克隆到本地设置本地的开发环境，而可以直接在线查看；如果记者或科学家可以直接将 GitHub 上的数据渲染成可视化的结果，那么会多么有趣。

## 如何使用

注册了 Technical Preview 之后，直接访问下面的地址就可以看到新的仓库的展示界面。

```
blocks.githubnext.com/{owner}/{repo}
```

可以直接点击这两个官方的 Demo：

- <https://blocks.githubnext.com/githubnext/blocks>
- <https://blocks.githubnext.com/githubnext/blocks-tutorial>

## Blocks 的分类

### File blocks

File blocks 指的是文件类的 Block，可以渲染单个文件。

- 比如将 CSV 文件渲染成表格，柱状图等等
- 将 CSS 渲染成可视化的字体，颜色等
- 将 mermaid 文件直接渲染在网页
- 等等

### Folder blocks

Folder blocks 可以对整个文件夹创建一个预览，比如将整个文件夹中的内容渲染成图形

![github block folder blocks](https://photo.einverne.info/images/2023/02/25/k5rM.png)

## 如何创建 Blocks

查看官方仓库中提供的[教程](https://github.com/githubnext/blocks/tree/main/docs/Developing%20blocks)。

GitHub 创建了一个模板仓库 [blocks-template](https://github.com/githubnext/blocks-template)，用户可以基于此来创建自己的 Block。

## reference

- <https://blocks.githubnext.com/>
