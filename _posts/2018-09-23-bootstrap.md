---
layout: post
title: "《深入理解 Bootstrap》读书笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [bootstrap, css, twitter, web-design, html5 ]
last_updated:
---

bootstrap 是 Twitter 开源出来的 CSS 框架，因为用到了就简单的了解一下。

## CSS 选择器

每一条 CSS 样式的定义都由两部分组成，形式如下：选择器{样式}。在{}之前的部分就是“选择器”。“选择器”指明了应用这些“样式”的网页元素。

### 属性选择器
`[data-toggle^=button]`，属性选择器有很多种用法，`[attr=value]` 表示该属性有确定的值。

### 子选择器
CSS 子元素用 `>` 表示，`.table > thead > tr > th` 表示的是 table 样式，thead 元素内 tr 元素下 th 的样式。

### 兄弟选择器

兄弟元素分为两种，一种是临近兄弟，一种是普通兄弟。临近兄弟的选择符用“+”表示。比如导航条里要设置两个 li 之间的外边距，则需要如下定义：

    .nav-pills > li + li {
      margin-left: 2px;      /* 加大左外边距 */
    }

如果只想查找某一个指定元素后面的兄弟节点（而不限制于临近节点），可以使用普通兄弟节点的符号“～”。比如：

    .article h1 ~ p {
      font-size: 13px;
    }


