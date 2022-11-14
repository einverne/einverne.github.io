---
layout: post
title: "Obsidian 中的日语学习工具"
aliases:
- "Obsidian 中的日语学习工具"
tagline: ""
description: ""
category: 学习笔记
tags: [ obsidian, japanese, obsidian-plugins, hiragana, furigana, html-ruby, html, w3c, ]
create_time: 2022-11-06 10:28:55
last_updated: 2022-11-06 10:28:55
---

介绍一下在 Obsidian 中学习，记录日语笔记相关的插件。

## Furigana
Furigana，注音假名，{振り仮名|ふりがな}，日语中为了表示汉字读音而在其上方或周围附注假名表音符号。印刷时内文以 7 号格大小的文字和五号格大小的振假名为标准。其别名为 ルビー，来自英语的 ruby，英国对 5.5 号字体的传统称呼，因此印刷物的振假名也被称为 ルビ。

## 网页 ruby 元素

W3C 为网页提供了 `<ruby>` 元素，虽然这个概念在 2001 年就被提出，但是一直没有被正式写入标准。

如果在网页中使用：

```
<ruby>漢字<rt>かんじ</rt></ruby>
```

那么浏览器在渲染的时候就会将日语假名显示在汉字上方。

## Markdown furigana

Markdown furigana 沿用了 markdown-it-ruby 的语法

- <https://github.com/steven-kraft/obsidian-markdown-furigana>

在 markdown 中使用如下的语法时

```
{漢字|かんじ}
```

就会渲染成：

```
<ruby>漢字<rt>かんじ</rt></ruby>
```

在显示的时候就会将假名显示在汉字上方。

![obsidian furigana](https://photo.einverne.info/images/2022/11/14/ZLfD.png)

同样这个插件不仅支持假名，注音，拼音都可以使用相同的语法进行标注。

## Word Splitting for Japanese in Edit mode
Word Splitting for Japanese in Edit mode 是一个在编辑模式下强化日语分词的 CodeMirror 编辑器的 Patch，就和之前用的中文分词插件一样，使得在 Obsidian 下选择单词更加智能，因为中文，日文都不是像英文那样使用空格来区分单词的，所以在选择的时候极有可能不是想选择的部分，这个插件可以让选择单词变得更加简单。

- <https://github.com/sonarAIT/cm-japanese-patch>
