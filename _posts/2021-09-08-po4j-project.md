---
layout: post
title: "po4j 项目简介"
aliases:
- "po4j 项目简介"
tagline: ""
description: ""
category: 经验总结
tags: [ po, po4j, po4j-project, poedit, weblate ]
create_time: 2024-08-02 15:46:35
last_updated: 2024-08-02 15:46:35
dg-home: false
dg-publish: false
---

po4j 项目的存在就是为了简化文档翻译的维护工作。po4a 将内容的翻译从文档的结构中拆解出来。

当执行 po4a 的时候，你只需要提供一个配置和一个待翻译的文档（称为 master documents)，之后会产生一个 POT 文件（又被称为 translation template) 这个文件中包含了所有可以翻译的字符串，po4a 会生成一个特殊的格式来方便翻译人员进行翻译。

这些 POT 文件可以被特定的编辑器进行编辑，比如 GNOME Translation Editor，KDE 的 [Lokalize](https://apps.kde.org/lokalize/) 或者 [Poedit](https://poedit.net/) ，也可以非常容易地整合到在线的文档本地化平台上，比如 [[Weblate]] 或 [[pootle]]。翻译的结果是一系列的 PO 文件，每一种语言一个。

当你在执行 po4a 命令的时候同时提供了 master documents 和 PO 文件，它会将文档的翻译（在 PO 文件中）根据文档的格式插入到原始的文档中。

如果 master documents 改变了，那么 po4a 会相应的更新 PO 和 POT 文件，这样翻译人员可以轻易的检查到修改，跟更新其工作。

## 概念

### PO 文件

根据原始文件得到的各种语言版本的待翻译文件，包含原始语言和被翻译的目标语言。

PO 文件是纯文本文件，可以用任何编辑器打开，也可以用专用的编辑器比如 Poedit 打开

### PO 文件格式详解

PO 文件的正文内容由 `msgid` 和 `msgstr` 成对组成，前者是原文，后者是译文。

## 使用举例

```
po4a-gettextize --format <format> --master <master.doc> --po <translation.pot>
po4a-updatepo --format <format> --master <new_master.doc> --po <old_doc.XX.po>
po4a-translate --format <format> --master <master.doc> --po <doc.XX.po> --localized <XX.doc>
```

说明：

- po4a-gettextize 命令负责将原始文档拆分到 PO 文件中
- po4a-updatepo 命令负责更新 PO 文件，使得 PO 文件可以跟随原始文件的修改而修改。
- po4a-translate 命令负责将翻译完成的 PO 文件合并到翻译后的文件中

更加详细的使用可以参考[这个提交](https://github.com/tldr-pages/tldr/pull/6493)

## 在线的翻译平台

- [[Weblate]]
- [[Transifex]]
- [[Crowdin]]

## reference

- <https://po4a.org/index.php.en>
