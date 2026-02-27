---
layout: post
title: "DEVONthink 使用体验"
aliases:
- "DEVONthink 使用体验"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, devonthink, mac-application , personal-knowledge-management ,  ]
last_updated: 2026-02-24
create_time: 2022-05-20 07:06:28
---

在接触到 [[Obsidian]] 的时候有人推荐了 [[DEVONthink]]，但是因为是 macOS 独占的，所以并没有全心全意地使用它，但是初次体验的时候被其 PDF OCR 的精确程度以及搜索体验震撼到了，在我导入的庞大数据库和 PDF 文件中，可以非常精确的找到我想要的内容，并且以非常好的结构展示出来，这个体验是我在其他软件中都没有感受过的。

但是因为重度使用 Linux，所以其实还是 Obsidian 用的居多，但是 DEVONthink 强大的搜索功能让我再一次拾起了它。

在使用了几年之后，我逐渐形成了一套以 DEVONthink 为资料库、Obsidian 为笔记本的工作流。DEVONthink 负责存储和检索各种格式的原始资料，而 Obsidian 负责日常笔记和写作。两者配合，几乎覆盖了我所有的知识管理需求。

## DEVONthink 是什么

DEVONthink 是 macOS 和 iOS 上的一个老牌资料管理工具，集编辑、分析、组织、搜索、存档为一身。由德国公司 DEVONtechnologies 开发，自 2001 年发布以来已经走过了二十多年的历程。

> Get your personal assistant for your documents, notes, bookmarks, scans etc

DEVONthink 本质上是一个数据库，可以存储或索引非常多格式的文件，从纯文本到 PDF，到 WORD/PPT/XLS 等专有文档，到媒体文件，基本上日常所见都能放进去。支持的格式包括 Markdown、PDF、EPUB、网页归档、图片、视频、音频、邮件等等，几乎涵盖了日常工作中会遇到的所有文件类型（mobi 格式暂不支持）。

核心特性：

- 大部分文件可以直接预览，无需打开外部应用
- 数据库在本地，数据完全由自己掌控
- 剪藏功能，可以将网页内容以多种格式保存
- 内置 AI 驱动的智能搜索，搜索速度和精确度极高
- Replicate 功能，一份文件可以同时属于多个文件夹
- 自动导入订阅的 RSS，并可以离线所有内容
- See Also 和 Classify 自动分类功能
- 支持 AppleScript、JavaScript for Automation 和 Shortcuts 自动化

## 购买方式和价格

DEVONthink 采用买断制，个人使用不限制设备数量，这在当今订阅制泛滥的时代显得尤为难得。

DEVONthink 3 分为以下几个版本：

- DEVONthink Standard 99$，核心功能齐全
- DEVONthink Pro 199$，在 Standard 基础上增加了更多数据库支持、自动分组、RSS 订阅、电子邮件归档，同时支持 AppleScript 和 Automator
- DEVONthink Server 499$，在 Pro 基础上增加了 Web 界面，可以将数据库分享给局域网中的其他人使用[^edition]
- DEVONthink To Go 15$，iOS 移动版，有 8 美元的应用内购买可解锁选择性同步、PDF 注释等功能

[^edition]: <https://www.devontechnologies.com/apps/devonthink/editions>

DEVONthink 偶尔会推出折扣活动，比如 20 周年时推出过 25% 折扣码。[^discount]

[^discount]: <https://www.devontechnologies.com/blog/20220429-devonthink-20-years-discount-promotion>

值得关注的是，DEVONthink 4 目前已经进入公测阶段，带来了全新的用户界面、AI 聊天助手、审计安全数据库、自动版本管理等重大更新。公测期间可以免费使用所有功能，购买后从正式版发布开始计算一年的更新周期。

## DEVONthink 中的概念

### Database

Database 数据库，本质上和 Obsidian 的 Vault 类似，可以根据自己的需求建立不同的 Database。但 [[Zettelkasten]] 的笔记法告诉我只用一个仓库来存储我所有的笔记，所以对 Database 的理解我也是用一个数据库存储我不同的文件。

不过在实际使用中，按照用途拆分数据库也是一种常见的做法，比如：

- Inbox：DEVONthink 默认必须存在的基础库，类似邮箱的收件箱，所有新文件默认都放在这里
- Personal：个人证件、旅行资料等
- Study：学习资料、软件测评和知识笔记
- Web：网页 RSS 抓取的内容
- Email：通过 AppleScript 同步过来的邮件归档

根据 [[MECE 分析法]] 划分不同文件夹，确保分类之间互不重叠且完整覆盖。

### Group 和 Tag

DEVONthink 是一个多维度的文档管理方式，可以使用 Group 和 Tag 配合来组织文档。

> Folders show what is inside.
> Tags are attached to something.

Group 就像文件夹，展示的是包含关系；Tag 是附加在文档上的标签，展示的是属性关系。两者配合使用可以让同一份文档从不同的维度被检索到。之前也写过一篇文章解释我理解的[文件夹和标签](/post/2016/11/folder-vs-tag-lable.html)。

### Import 和 Indexing

有两种方式可以将文档添加到 DEVONthink 中，Import（导入）和 Indexing（建立索引）。

- Import 是将文件拷贝到数据库中，文件会占用数据库的空间，但好处是可以将数据库直接备份到其他硬盘，在其他设备上直接使用这一个文件
- Index 则是将文件添加到数据库索引中，而文件还保留在原来的位置，不会增加数据库大小。如果移动原始文件可能导致数据库索引失败[^1]

![devonthink import vs index](https://photo.einverne.info/images/2022/05/20/z1uD.png)

选择「导入」还是「索引」，可以针对不同的场景进行选择。对于我个人而言，因为使用 [[Syncthing]] 等同步工具同步文件系统，所以我偏向使用 Index 导入一个文件目录，这个文件目录会通过同步工具实时同步到其他设备。DEVONthink 还可以对 [[nvALT]]、[[Scrivener]] 的工作目录、[[MailMate]] 的 Application Support 文件夹等进行索引。

[^1]: <https://www.devontechnologies.com/blog/20211130-relocate-indexed-files>

## 搜索功能

DEVONthink 的搜索是让我深入使用它的一个重要因素。只要使用过一次，就再不能忘记 DEVONthink 搜索功能的强大和迅速。DEVONthink 支持搜索的内容非常广，数据库中的内容几乎都可以索引出来，包括文件标题、正文、PDF 内文等。

搜索结果可以根据相关性对结果进行排序，相关性由内容和标签等衍生得出。

几个有用的搜索选项：

- Scope，搜索的范围，可以限定在某个数据库或文件夹
- Ignore Diacritics，使用这个选项的时候，会同样搜索变音符号，比如搜索「dejavu」也能搜到「deja vu」

### 模糊搜索和搜索语法

DEVONthink 中的搜索默认不区分大小写，搜索框中还可以使用高级语法进行精确搜索：

- 通配符：`?` 代表一个字符，`*` 表示多个字符
- 布尔运算：`AND`（`&`, `&&`, `+`）、`OR`（`|`, `||`）、`XOR`（`^`, `^^`）
- `A NEAR B`，A 词与 B 词之间距离 10 个字符以内
- `A AFTER B`，A 词在 B 词后，并相互紧挨
- `A BEFORE B`，A 词在 B 词前，并相互紧挨

这些搜索语法在处理大量文档时极其有用，特别是在学术研究或法律文书管理的场景下，可以快速定位到需要的内容。

## AI 和智能功能

DEVONthink 从 1.0 版本开始就内置了自研的人工智能引擎，这并不是当下流行的生成式 AI 聊天机器人，而是一个本地机器学习引擎，用于发现和利用文档之间的关系。

### See Also 和 Classify

See Also 是 DEVONthink 最具特色的功能之一。当你查看一个文档的时候，See Also 面板会自动列出数据库中与当前文档内容相关的其他文档，帮助你发现那些自己可能忽略的联系。

Classify 则会根据文档内容自动推荐应该归类到哪个 Group，这在整理大量新导入的文件时非常实用。

### Smart Rules

Smart Rules 是 DEVONthink 的自动化核心功能。你可以定义条件和动作，让 DEVONthink 自动对匹配条件的文档执行操作，比如：

- 自动将新导入的 PDF 进行 OCR 处理
- 根据文件名或标签自动归类到不同的 Group
- 自动添加或移除标签
- 自动重命名文档

### DEVONthink 4 中的生成式 AI

在 DEVONthink 4 中，你可以将生成式 AI 模型（比如 [[Zettelkasten/Claude]]、[[ChatGPT]]、[[Mistral AI]] 等）集成到工作流中，用于文本处理、自动化决策，甚至可以对文档提问。比如在 Smart Rules 和批处理中加入 AI 判断：

- 「这是一张发票吗？」→ 移动到「Invoices」分组
- 「这是垃圾邮件吗？」→ 添加「Spam」标签

值得强调的是，生成式 AI 在 DEVONthink 中完全是可选的（opt-in），不使用不会影响任何已有功能。

## 自动化和脚本支持

DEVONthink 广泛支持 [[AppleScript]]、JavaScript for Automation（JXA）以及 [[Apple Shortcuts]] 进行自动化操作。你可以设计复杂的工作流，在 DEVONthink 和其他 macOS 应用之间交换信息。

批处理功能可以一次性对大量文档进行批量操作，比如批量重命名、批量添加标签、批量 OCR 等，无需逐个打开文档。

配合 [[Alfred]] 使用时，可以直接在 Alfred 搜索框中搜索 DEVONthink 数据库中的内容，实现快速定位。

## 同步方式

DEVONthink 提供了多种同步方式，确保数据在不同设备之间保持一致：

- iCloud（CloudKit）
- Bonjour，局域网内直接同步
- WebDAV，支持自建服务器
- Dropbox
- 本地同步点（Local Sync Store）

同步是端到端加密的，数据安全性有保障。配合 DEVONthink To Go 可以在 iPhone 和 iPad 上随时访问数据库内容。

## 作为知识管理工具

知识管理的三个阶段：

- 收集
- 分类
- 组织输出

### 收集

DEVONthink 在信息收集方面非常全面。你可以通过以下方式将信息汇聚到数据库中：

- 浏览器扩展（Clip to DEVONthink），支持保存为纯文本、富文本、Markdown、PDF、Web Archive 等格式
- 拖拽文件直接导入
- 通过 Share 扩展从任意应用分享内容
- RSS 订阅，自动抓取并离线保存全文
- 通过 AppleScript 归档邮件
- 扫描纸质文档并自动 OCR
- 在应用内直接创建各种格式的笔记

### 分类

收集之后的分类整理是知识管理的关键环节。DEVONthink 提供了多种方式：

- 手动使用 Group 和 Tag 进行分类
- 使用 Classify 功能让 AI 自动推荐分类
- 通过 Smart Rules 自动化分类流程
- 使用 Replicate 让一个文件出现在多个 Group 中（不同于复制，Replicate 只是同一个文件的不同引用）

### 组织输出

知识管理的最终目的是输出。DEVONthink 可以将整理好的资料导出为各种格式，也可以直接在应用内编辑 Markdown 或富文本。配合 Obsidian 使用时，可以将 DEVONthink 当作资料仓库，将需要深度思考和写作的内容转移到 Obsidian 中进行加工。

## DEVONthink 和 Obsidian 的关系

很多人会问 DEVONthink 和 Obsidian 是否冲突。在我看来，两者解决的是不同层面的问题：

- DEVONthink 是一个资料管理工具，擅长存储、索引和检索各种格式的文件，它的 AI 搜索和 OCR 能力是 Obsidian 无法替代的
- [[Obsidian]] 是一个笔记工具，擅长纯文本写作、双向链接和知识网络的构建，它的跨平台特性和丰富的插件生态是 DEVONthink 不具备的

两者完全可以配合使用。比如通过 [DEVONlink](https://github.com/ryanjamurphy/DEVONlink-obsidian) 插件，可以在 Obsidian 笔记中链接到 DEVONthink 数据库中的具体文档。我的工作流是将 PDF、网页归档、邮件等原始资料存储在 DEVONthink 中，而读书笔记、思考和写作则在 Obsidian 中完成。

DEVONthink 是 macOS 平台上最强大的个人知识管理工具之一。它的核心价值在于：

- 对各种文件格式的统一管理和全文检索
- 内置 AI 引擎带来的智能分类和关联发现
- 丰富的自动化能力
- 本地优先的数据存储策略，确保隐私和安全
- 买断制的价格策略

如果你是一个重度 macOS 用户，经常需要处理大量的 PDF、文献、网页资料或邮件，DEVONthink 值得认真尝试。它不会让你失望。

## related

- [DEVONthink 官网](https://www.devontechnologies.com/apps/devonthink)
- [DEVONthink 社区论坛](https://discourse.devontechnologies.com/)
- [DEVONthink 与 Obsidian 配合使用的讨论](https://discourse.devontechnologies.com/t/devonthink-obsidian/73208)
- [Take Control of DEVONthink 3](https://www.takecontrolbooks.com/devonthink/) 一本非常详尽的 DEVONthink 使用指南
