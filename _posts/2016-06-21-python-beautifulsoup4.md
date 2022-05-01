---
layout: post
title: "使用 Python BeautifulSoup4 快速获取网页内容"
tagline: ""
description: ""
category: 学习笔记
tags: [python, beautifulsoup4, crawler, html, parser, ]
last_updated:
---

BeautifulSoup4 能够帮助我们从 HTML 或 XML 文件中提取数据

## 安装

    pip install beautifulsoup4

| 解析器           | 使用方法                             | 优势                                                      | 劣势                                             |
| ---------------- | ------------------------------------ | --------------------------------------------------------- | ------------------------------------------------ |
| Python 标准库    | BeautifulSoup(markup, "html.parser") | Python 的内置标准库 执行速度适中 文档容错能力强           | Python 2.7.3 or 3.2.2) 前 的版本中文档容错能力差 |
| lxml HTML 解析器 | BeautifulSoup(markup, “lxml”)        | 速度快 文档容错能力强                                     | 需要安装 C 语言库                                |
| lxml XML 解析器  | BeautifulSoup(markup, “xml”)         | 速度快                                                    | 需要安装 C 语言库                                |
| html5lib         | BeautifulSoup(markup, “html5lib”)    | 最好的容错性 以浏览器的方式解析文档 生成 HTML5 格式的文档 | 速度慢 不依赖外部扩展                            |

## 使用
加载

    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html)

Beautiful Soup 将复杂 HTML 文档转换成一个复杂的树形结构，每个节点都是 Python 对象，所有对象可以归纳为 4 种：

- Tag，HTML 中的一个个标签，有 name 和 attr
- NavigableString，标签中内容
- BeautifulSoup， 文档全部内容
- Comment，一个特殊类型的 NavigableString 对象

`find_all()` 方法和 `select()` 方法各有各的优劣，find_all 方法能支持正则，而 select 方法可以使用 CSS 属性选择器。

## .string 和 .text 区别

在 `Tag` 对象上调用 `.string` 会返回 `NavigableString` 类型对象，而 `.text` 会获取所有子节点内容的组合，`.text` 返回的是 Unicode 对象。

对于

    <td>Some Table Data</td>
    <td></td>

在第二个 `<td>` 标签中 `.string` 会返回 None，而 `.text` 会返回空的 unicode 对象

对于 `.string`

- 如果标签只包含文本，则直接返回文本
- 如果标签包含一个单一的子标签，则返回子标签内容
- 如果标签不包含标签，或者包含多个标签，则返回 None
- 如果标签既包含文本，也包含子标签，并且二者文本内容不一致，则返回 None

而对于 `.text` 则简单很多，会返回子标签及所有文本的级联。

比如

    <td>some text</td>
    <td></td>
    <td><p>more text</p></td>
    <td>even <p>more text</p></td>

`.string` 会返回

    some text
    None
    more text
    None

`.text` 会返回

    some text

    more text
    even more text

## BeautifulSoup 不同解析器比较
BeautifulSoup 支持很多种 HTML 解析器，包括 Python 自带标准库，还有其他 lxml 等等第三方模块。

解析器      | 使用方法  | 优点          | 缺点
------------|-----------|---------------|---------
html.parser | BeautifulSoup(markup,"html.parser") | Python 标准库，速度快，兼容性好（2.7.x 和 3.2.x) | 无法在 2.7.3 之前和 3.2.2 之前版本使用
lxml    | BeautifulSoup(markup, "lxml") | 速度快，兼容性好 | 外部依赖
lxml's XML | BeautifulSoup(markup, 'lxml-xml') 或者 'xml' | 速度快，支持 XML  | 外部依赖
html5lib    | BeautifulSoup(markup, 'html5lib')     | 兼容性好，HTML5 合法 | 速度慢，外部依赖

个人一般使用 `html.parser` 但是如果遇到不兼容版本，那也只能 `pip install lxml` 然后使用了。

## related

- [[etree]]

## reference

- <https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/index.html>
