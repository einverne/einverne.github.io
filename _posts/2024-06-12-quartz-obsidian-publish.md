---
layout: post
title: "开源替代 Obsidian Publish：用 Quartz 搭建个人知识库网站"
aliases:
- "开源替代 Obsidian Publish：用 Quartz 搭建个人知识库网站"
tagline: ""
description: "详细介绍如何使用 Quartz 4 作为 Obsidian Publish 的开源替代方案，实现笔记的优雅发布与分享"
category: 产品体验
tags: [obsidian, obsidian-publish, obsidian-vault, quartz, static-site-generator, knowledge-management]
create_time: 2024-06-12 15:00:37
last_updated: 2024-06-12 15:00:37
---

在知识管理的道路上，[[Obsidian]] 凭借其强大的双向链接和本地优先的理念赢得了众多用户的青睐。然而，当我们想要将积累的知识分享给更多人时，官方的 [[Obsidian Publish]] 服务虽然功能完善，但每月 8 美元的订阅费用和对数据的有限控制权让许多用户望而却步。

幸运的是，开源社区为我们提供了优秀的替代方案。本文将详细介绍 Quartz 4，一个功能强大、配置简单的开源静态网站生成工具，它能够完美支持 Obsidian 的核心特性，让你在保持完全数据控制权的同时，优雅地分享自己的知识库。

## 我的探索之路

自从使用 [[Obsidian]] 以来就一直想要有一个开源版本的 [[Obsidian Publish]] 代替。Obsidian Publish 虽然功能强大，但每月 8 美元的订阅费用对于个人用户来说并不便宜，而且作为一个注重数据掌控的用户，我更希望能够完全掌控自己的笔记发布流程。

过去这几年，我尝试了不少开源方案。最开始使用 Jekyll 静态网站生成器，但它需要手动转换 Obsidian 的 wiki-link 语法，维护成本较高。后来使用 [[Logseq]] 生成了[网站](https://notes.einverne.info/)，虽然能够很好地支持双向链接，但 Logseq 的大纲式笔记风格与我的 Obsidian 工作流并不完全契合。我还尝试过从 Obsidian 同步到 Notion，然后使用 [[NotionNext]] 来生成网站，这个方案虽然可行，但增加了一个中间环节，同步过程也不够流畅。

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
- [Obsidian Digital Garden](https://github.com/oleeskild/Obsidian-Digital-Garden) 开源项目

但是以上的方案我尝试之后都不是一个我认可的完善的方案，或多或少有一些问题，也不能和我自己的工作流程结合起来。

这些方案存在的主要问题包括：配置复杂度高、需要学习额外的工具链、与 Obsidian 的功能支持不完整、发布流程不够自动化等。每次想要分享笔记时，都需要经过繁琐的转换和调整过程，这大大降低了我分享知识的积极性。

但是很多年前我就看到过一个静态网站分享方案 Quartz，当时的版本还比较简陋，功能也不够完善。没想到经过几年的发展，Quartz 发布了 v4 版本，带来了翻天覆地的变化。这个新版本可以完美地融合到我的工作流中，不仅完整支持 Obsidian 的各种语法特性，而且配置简单、部署方便，让我可以非常轻松地分享本地 Obsidian Vault 中的内容。

## 什么是 Quartz

[Quartz](https://github.com/jackyzha0/quartz) 是一个专门为发布 Markdown 笔记而设计的静态网站生成工具，由 Jacky Zhao 开发和维护。它的设计理念是让知识分享变得简单而优雅，特别适合与 [[Obsidian]] 搭配使用。

Quartz 的最大特点是完整支持 Obsidian 的核心功能，包括 wiki-links、双向链接、图谱视图等。这意味着你可以直接将 Obsidian vault 作为 Quartz 的内容源，无需进行任何格式转换或特殊处理。你在 Obsidian 中的笔记组织方式、链接关系都会被原样保留并展示在发布的网站上。

Quartz 发布 4.x 版本之后，可用度和稳定性都得到了大幅提升。新版本采用了现代化的技术栈，性能更好，配置更加灵活，可以说是目前最接近官方 [[Obsidian Publish]] 体验的开源替代方案。相比其他同类工具，Quartz 4 的优势在于开箱即用的体验和对 Obsidian 特性的深度支持。

在开始使用 Quartz 之前，你需要确保系统中安装了 Node.js v18.14 或更高版本，以及 npm v9.3.1 或更高版本。这些是运行 Quartz 的基础环境要求。

## 核心功能特性

Quartz 4 提供了一系列强大的功能，让你的笔记网站既美观又实用：

### 双向链接与反向链接

Quartz 会自动生成双向链接（Backlinks），这是 Obsidian 的核心特性之一。当你在笔记 A 中链接到笔记 B 时，Quartz 会自动在笔记 B 的页面底部显示来自笔记 A 的反向链接。这种链接关系的可视化让你可以追溯知识的来源，发现笔记之间的隐藏联系。

此外，Quartz 完整支持 Obsidian 的 wiki-links 语法（如 `[[笔记名称]]`），也支持标准的 Markdown 链接语法。这种灵活性让你可以在不同的写作场景中选择最适合的链接方式。

### 数学公式与代码高亮

对于技术写作者来说，Quartz 内置了 LaTeX 数学公式支持和代码语法高亮功能。你可以直接在笔记中书写数学公式，Quartz 会使用 KaTeX 将其渲染成漂亮的数学表达式。代码块则支持多种编程语言的语法高亮，让代码片段更加清晰易读。

### 知识图谱视图

Quartz 提供了两种图谱视图：全局图谱（Graph View）和局部图谱（Local Graph）。全局图谱展示整个笔记库的链接关系，让你一览知识的整体结构。局部图谱则聚焦于当前笔记及其相关笔记的关系，帮助你理解当前主题在知识体系中的位置。这些图谱都是交互式的，你可以点击节点直接跳转到对应的笔记。

### 链接预览功能

当你将鼠标悬停在链接上时，Quartz 会显示目标笔记的预览窗口，让你无需跳转即可快速浏览链接内容。这个功能极大地提升了阅读体验，让知识的探索变得更加流畅。

### 目录与导航

Quartz 会自动为长文章生成目录（Table of Contents），方便读者快速定位到感兴趣的章节。目录会根据 Markdown 的标题层级自动生成，并支持点击跳转。

### 主题与外观

Quartz 内置了深色模式和浅色模式，会自动根据系统设置切换，用户也可以手动切换。整体设计简洁优雅，注重阅读体验。

### 当前的局限性

需要注意的是，目前 Quartz 4 还没有提供侧边栏导航功能。如果你的笔记库需要复杂的层级导航，可能需要通过其他方式（如在首页创建索引）来组织内容。

![](https://miro.medium.com/v2/resize:fit:1400/1*xPrwTPvq5O8vjB0F6Al0BA.png)

界面

![vMM9](https://photo.einverne.info/images/2024/06/25/vMM9.png)

## 快速开始

### 安装步骤

Quartz 的安装过程非常简单，只需要几个命令即可完成基础配置。

首先，克隆 Quartz 的代码仓库到本地：

```bash
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
npx quartz create
```

当你执行 `npx quartz create` 命令后，Quartz 会启动一个交互式配置向导，询问你如何组织内容。这里有两个选项：

1. 创建一个全新的内容文件夹：适合从零开始建立笔记网站的场景
2. 使用软链接（`ln -s`）链接到现有的 Obsidian vault：这是推荐的方式，可以直接复用你的 Obsidian 笔记库

如果你选择软链接方式，Quartz 会要求你提供 Obsidian vault 的路径。这样设置的好处是，你在 Obsidian 中的任何修改都会立即反映到 Quartz 网站中，无需手动同步。

### 本地预览

安装完成后，你可以启动本地开发服务器来预览网站效果：

```bash
npx quartz build --serve
```

这个命令会启动一个本地服务器，默认地址是 `http://localhost:8080`。服务器支持热重载（hot reload），当你修改笔记内容时，浏览器会自动刷新显示最新内容。这让你可以边写边看效果，大大提升了创作体验。

在预览过程中，你可以：

- 测试链接是否正常工作
- 检查图谱视图的显示效果
- 调整配置文件以自定义网站外观
- 验证数学公式和代码块的渲染效果

### 配置文件说明

Quartz 的主要配置文件是 `quartz.config.ts`，你可以在这里自定义网站的各种设置，包括：

- 网站标题和描述
- 启用或禁用特定功能
- 自定义主题颜色
- 配置图谱视图的行为
- 设置搜索功能

配置文件使用 TypeScript 编写，提供了很好的类型提示和文档注释，即使不熟悉编程也能轻松上手。

### 实际效果

你可以访问[这里](https://pt-wiki.gtk.pw)查看使用 Quartz 构建的实际网站效果。这个示例展示了 Quartz 的各种功能，包括知识图谱、双向链接、搜索等，可以作为你配置自己网站的参考。

## 部署到生产环境

### 构建静态网站

当你完成本地预览和配置后，可以构建静态网站文件用于部署：

```bash
npx quartz build
```

这个命令会生成优化过的静态 HTML、CSS 和 JavaScript 文件，存放在 `public` 目录中。这些文件可以部署到任何静态网站托管服务。

### 部署选项

Quartz 支持多种部署方式：

1. GitHub Pages：这是最常用的免费托管方案，Quartz 提供了内置的 GitHub Actions 配置
2. Vercel：提供全球 CDN 和自动部署，配置简单
3. Netlify：类似 Vercel，支持自定义域名和 HTTPS
4. Cloudflare Pages：速度快，免费额度充足
5. 任意支持静态网站的服务器或 CDN

官方推荐使用 GitHub Pages，因为 Quartz 已经包含了完整的部署脚本，你只需要将代码推送到 GitHub 仓库，就能自动完成部署。

### 部署到 Cloudflare Pages

[[Cloudflare Pages]] 是一个非常适合托管 Quartz 网站的平台，它提供免费的全球 CDN 加速、自动 HTTPS、无限带宽，并且每月有 500 次构建的免费额度，对于个人知识库来说完全够用。

部署步骤如下：

1. 将 Quartz 项目推送到 GitHub 仓库（如果还没有的话）
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 Workers & Pages 页面
3. 点击 Create application，然后选择 Pages 标签，点击 Connect to Git
4. 选择你的 GitHub 账户并授权访问 Quartz 所在的仓库
5. 配置构建设置：
   - Project name：填写你的项目名称（将作为默认域名的一部分，如 `project-name.pages.dev`）
   - Production branch：选择你的主分支，通常是 `v4` 或 `main`
   - Build command：`npx quartz build`
   - Build output directory：`public`
6. 在 Environment variables 中添加一个环境变量：
   - Variable name：`NODE_VERSION`
   - Value：`18`（或更高版本，确保与 Quartz 的要求一致）
7. 点击 Save and Deploy，等待首次构建完成

构建成功后，Cloudflare 会分配一个 `*.pages.dev` 的域名，你可以直接通过该域名访问网站。之后每次向仓库推送代码，Cloudflare Pages 都会自动触发构建和部署。

如果你想绑定自定义域名，可以在 Cloudflare Pages 项目的 Custom domains 页面中添加。如果域名已经托管在 Cloudflare DNS 上，绑定过程会自动完成；如果域名在其他服务商，需要手动添加 CNAME 记录指向 `project-name.pages.dev`。

### 自定义域名

如果你想使用自己的域名，大多数托管平台都支持自定义域名配置。通常只需要：

1. 在托管平台的设置中添加你的域名
2. 在域名服务商处添加 CNAME 记录或 A 记录
3. 等待 DNS 生效（通常需要几分钟到几小时）

## 使用技巧

### 内容组织建议

虽然 Quartz 支持发布整个 Obsidian vault，但建议使用标签或文件夹来精确控制要发布的内容。你可以：

- 创建一个专门用于发布的文件夹
- 使用特定的标签标记需要发布的笔记
- 在配置文件中设置过滤规则

### 优化搜索体验

Quartz 内置了全文搜索功能。为了提升搜索体验，建议：

- 为笔记添加清晰的标题
- 使用有意义的标签
- 在笔记开头添加摘要
- 合理使用标题层级

### 提升加载速度

对于大型笔记库，可以考虑以下优化措施：

- 压缩图片文件
- 避免在单个笔记中嵌入过多图片
- 合理使用懒加载
- 定期清理未使用的附件

## 常见问题

### 如何处理私密笔记

如果你的 vault 中包含不想公开的笔记，建议：

1. 使用独立的文件夹存放公开内容
2. 配置 `.gitignore` 排除私密文件
3. 或者使用 Quartz 的忽略配置排除特定文件或文件夹

### 图片和附件如何处理

Quartz 会自动处理笔记中引用的图片和附件。只需确保：

- 图片使用相对路径引用
- 附件文件在 Quartz 能访问的目录中
- 文件名不包含特殊字符

### 如何更新 Quartz

Quartz 会不断更新和改进。要更新到最新版本：

```bash
git pull origin v4
npm i
```

更新后建议重新构建和测试，确保新版本与你的配置兼容。

## 总结

Quartz 4 是目前最成熟的开源 Obsidian Publish 替代方案，它不仅完整支持 Obsidian 的核心特性，而且配置简单、部署方便。无论你是个人博客作者、知识工作者还是团队协作者，Quartz 都能帮助你优雅地分享知识。

相比官方的 Obsidian Publish，Quartz 的优势在于完全免费、可自定义程度高、可以部署在自己的服务器上。虽然在某些功能上可能不如官方方案完善，但对于大多数使用场景来说，Quartz 已经足够强大和易用。

如果你正在寻找一个开源的笔记发布方案，强烈推荐试试 Quartz 4。

## 参考资料

- [Quartz 官方文档](https://quartz.jzhao.xyz/)
- [Quartz GitHub 仓库](https://github.com/jackyzha0/quartz)
