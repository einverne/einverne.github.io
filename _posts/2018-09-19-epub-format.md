---
layout: post
title: "epub 格式解析"
tagline: ""
description: ""
category: 学习笔记
tags: [epub, ebook, python-lib, parse, ]
last_updated:
---

epub 是一个电子书标准，最近在研究电子书解析，所以有了此文。


一个标准的未加密的 epub 电子书大致由以下三部分组成：

- META-INF 文件夹，其中包含 container.xml 文件
- OEBPS 文件夹，包含 images，xhtml 文件，css 样式和 content.opf 文件
- mimetype 文件，内容为 `application/epub+zip`

## META-INF 文件夹
META-INF 用于存放电子书信息，默认情况包含一个 `container.xml` 文件：

    <?xml version="1.0" encoding="UTF-8"?>
    <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
            <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
       </rootfiles>
    </container>

该文件告诉电子书阅读器，文件的根文件路径和格式。除去 container.xml 文件外，标准还规定了其他可选文件：

- manifest.xml 文件列表
- metadata.xml 元数据
- sigatures.xml 数字签名
- encryption.xml 加密
- rights.xml 权限管理

这些文件是可选的。

## OEBPS 文件夹
OEBPS 文件夹用于存放真正的图书内容，包括 `content.opf` 文件，`toc.ncx` 目录文件，正文内容，css 样式文件，字体文件，封面，图片等等资源。

### OPF 文件
opf 文件是 epub 最为重要的文件，是标准的 xml 文件，文件的根元素是 `<package>`

    <package version="2.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">

此文件的主要内容由下面组成：

第一部分，`<metadata>` 元数据，包含书籍的出版信息，主要由两个子元素组成

- `dc:metadata` 元素，使用 [Dublin Core](https://www.google.com/search?q=Dublin+Core)， 包含 15 项核心元素：

    - `dc:title`
    - `dc:creator` 责任者
    - `dc:subject` 主题关键词
    - `dc:description`
    - `dc:publisher`
    - `dc:contributor`
    - `dc:date`
    - `dc:type`
    - `dc:format`
    - `dc:identifier`
    - `dc:source` 来源
    - `dc:language`
    - `dc:relation`
    - `dc:coverage` 覆盖范围
    - `dc:rights` 权限描述

- `meta` 标签，扩展元素，如果有信息在上面标签中无法描述，则扩展到该 meta 中

举例

    <metadata xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:language>zh-CN</dc:language>
      <dc:title>圣殿春秋</dc:title>
      <dc:creator opf:role="aut" opf:file-as="雨浪飘零">『英』肯·福莱特</dc:creator>
      <dc:publisher>上海译文出版社</dc:publisher>
      <meta content="0.9.6" name="Sigil version" />
      <dc:date xmlns:opf="http://www.idpf.org/2007/opf" opf:event="modification">2016-07-16</dc:date>
      <dc:identifier opf:scheme="UUID" id="BookId">urn:uuid:97cabb7a-2ab9-4fe2-a56b-c075114f2187</dc:identifier>
      <meta name="cover" content="cover.jpg" />
    </metadata>

第二部分为 `<manifest>` 文件列表，该列表中包含出版物的所有文件，每一行由一个 item 构成

    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>

其中：

- id 为文件 id
- href 为文件相对路径
- media-type 为文件的媒体类型

举例，文件内容有删减

    <manifest>
      <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
      <item id="Preface03.xhtml" href="Text/Preface03.xhtml" media-type="application/xhtml+xml"/>
      <item id="Part00.xhtml" href="Text/Part00.xhtml" media-type="application/xhtml+xml"/>
      <item id="Part01.xhtml" href="Text/Part01.xhtml" media-type="application/xhtml+xml"/>
      <item id="Part02.xhtml" href="Text/Part02.xhtml" media-type="application/xhtml+xml"/>
      <item id="appendix.xhtml" href="Text/appendix.xhtml" media-type="application/xhtml+xml"/>
      <item id="main.css" href="Styles/main.css" media-type="text/css"/>
      <item id="Title.xhtml" href="Text/Title.xhtml" media-type="application/xhtml+xml"/>
      <item id="Intro1.xhtml" href="Text/Intro1.xhtml" media-type="application/xhtml+xml"/>
      <item id="Author.html" href="Text/Author.html" media-type="application/xhtml+xml"/>
      <item id="Preface01.xhtml" href="Text/Preface01.xhtml" media-type="application/xhtml+xml"/>
      <item id="cover.xhtml" href="Text/cover.xhtml" media-type="application/xhtml+xml"/>
      <item id="part01.jpg" href="Images/part01.jpg" media-type="image/jpeg"/>
      <item id="Part06_17.xhtml" href="Text/Part06_17.xhtml" media-type="application/xhtml+xml"/>
      <item id="chapter.png" href="Images/chapter.png" media-type="image/png"/>
      <item id="logo.png" href="Images/logo.png" media-type="image/png"/>
      <item id="cover.jpg" href="Images/cover.jpg" media-type="image/jpeg"/>
      <item id="cover_slim.jpg" href="Images/cover~slim.jpg" media-type="image/jpeg"/>
      <item id="Monarch.ttf" href="Fonts/Monarch.ttf" media-type="application/x-font-ttf"/>
      <item id="backcover.xhtml" href="Text/backcover.xhtml" media-type="application/xhtml+xml"/>
      <item id="backcover.jpg" href="Images/backcover.jpg" media-type="image/jpeg"/>
      <item id="backcover_slim.jpg" href="Images/backcover~slim.jpg" media-type="image/jpeg"/>
      <item id="Info.xhtml" href="Text/Info.xhtml" media-type="application/xhtml+xml"/>
    </manifest>

第三部分为 `<spine toc="ncx">` 提供图书线性阅读的次序，由子元素 itemref 组成

    <itemref idref="cover.xhtml">

其中 idref 为 manifest 中列出的 id

    <spine toc="ncx">
        <itemref idref="cover" />
        <itemref idref="copyright" />
    </spine>

第四部分为 `<guide>` ，列出了电子书的特定页面，比如封面，目录，序言等等，属性值指向文件地址。该部分可选。

    <guide>
      <reference type="cover" title="封面" href="Text/cover.xhtml"/>
    </guide>

第五部分，`<tour>` 导读，根据读者的不同水平，按照一定次序选择电子书部分页面组成导读，可选。

### NCX 文件
ncx 文件也是 epub 中非常重要的文件，该文件用于电子书的目录，文件命名通常为 `toc.ncx`，ncx 文件也是一个 xml 文件。ncx 全称为 Navigation Center eXtended。

ncx 文件中最主要的节点是 navMap，navMap 节点又由很多 navPoint 节点组成，navPoint 节点由 navLabel 和 content 节点组成。

    <navMap>
      <navPoint id="navPoint-1" playOrder="1">
        <navLabel>
          <text>圣殿春秋</text>
        </navLabel>
        <content src="Text/cover.xhtml"/>
        <navPoint id="navPoint-2" playOrder="2">
          <navLabel>
            <text>作品简介</text>
          </navLabel>
          <content src="Text/Intro1.xhtml"/>
        </navPoint>
      ...
        <navPoint id="navPoint-7" playOrder="7">
          <navLabel>
            <text>前言</text>
          </navLabel>
          <content src="Text/Preface03.xhtml"/>
        </navPoint>
      </navPoint>
    </navMap>


- navPoint 节点中，playOrder 属性定义当前项在目录中的次序，text 子节点则定义了目录的名字
- content 子节点 src 属性定义了章节文件的具体位置

navPoint 节点可以嵌套，形成了整本书的层级结构。

opf 文件定义了读者在顺序阅读时用到的章节和顺序，而 ncx 文件则定义了目录中用到的章节和顺序。如果存在附录形式的内容，希望在目录中出现，而不希望在正文中出现时，而已通过设置两个不同来达到目的。

在了解了这些标准内容之后，解析 epub 格式就比较简单了，python 可以使用 ebooklib 这个库。他的使用相对比较简单，也就一个 epub 类，具体使用可以参考 GitHub，不过需要注意的是很多 epub 格式的书并没有完全按照标准生成，所以有些地方还得自己 hack。

- [[epubcheck]]

## reference

- <http://idpf.org/epub/201>
- <https://vernlium.github.io/2015/06/10/epub%E6%A0%BC%E5%BC%8F%E8%A7%A3%E6%9E%90/>
- 使用 Python 通过 jinja2 模板生成 mobi 文件<https://www.cnblogs.com/buptzym/p/5249662.html>
