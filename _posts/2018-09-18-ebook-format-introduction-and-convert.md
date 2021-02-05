---
layout: post
title: "电子书常见格式及格式转换"
tagline: ""
description: ""
category: 经验总结
tags: [ebook, epub, mobi, pdf, convert, kindlegen, calibre, python, python-lib, azw, azw3, ]
last_updated:
---

最近因为写 kindle 推书的服务，所以不得不接触到了不同的电子书格式，mobi，epub， azw3，都比较常见，kindle 只支持 mobi 格式，所以亚马逊[提供](https://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000765211) 了 KendleGen 这个工具来将 epub 转换为 mobi 格式。

也正是因为这个结果，所以现在基本上也只有 python 读写 epub 的库，mobi 的读写目前做的也不是很好。如果单纯的只是想要转格式 Calibre 已经做的很好了，UI 也有。这里只是谈论编程方式读写 epub 格式。


## 格式
最近几年因为 Kindle 的介入，图书电子化的趋势越来越明显，虽然各大厂都在推自己的协议，但通常流行的也无非就那几个，epub， mobi，azw3 等等

### epub
epub 的全称是 Electronic Publication 是一个开放的标准化电子书格式，这个标注的格式针对阅读设备优化了字体显示，epub 文件能够被不同的设备打开。

需要注意的是，虽然 ePub 格式是一个开放的格式，但是不是所有的图书都按照标准的 epub 格式来生成。[^epub]

[^epub]: http://sourcefabric.booktype.pro/booktype-23-for-authors-and-publishers/importing-a-book/

一个典型的 epub 格式资源包含如下：

    .
    ├── chapter001.html
    ├── chapter002.html
    ├── chapter003.html
    ├── chapter004.html
    ├── content.opf
    ├── cover.jpeg
    ├── index.html
    ├── META-INF
    │   ├── calibre_bookmarks.txt
    │   └── container.xml
    ├── mimetype
    ├── postscript.html
    ├── preface.html
    ├── stylesheet.css
    ├── titlepage.xhtml
    └── toc.ncx

解释：

- `content.opf` 该文件包含书籍的 meta 信息，包括书名，介绍，作者，ISBN 等等，dc 是 `Dublin Core metadata` 的缩写，最小的 epub 要求 `DC:identifier`，`DC:title`，`DC:language` 这三项

        <dc:title>失控：机器、社会与经济的新生物学</dc:title>
        <dc:publisher>新星出版社</dc:publisher>
        <dc:rights>2010, 新星出版社</dc:rights>
        <dc:identifier id="uuid_id" opf:scheme="uuid">6ae9aa9a-8077-4a21-9658-d3656c96810d</dc:identifier>

- `toc.ncx` 就不说了 toc 很熟悉，目录
- `mimetype` mimetype 文件
- `*.html` 文件就是书的文本内容，不同的书可能命名不一样，但是总体都是 html 文件
- `*.css` 样式文件
- `cover.jpg` 封面图片

详细的 epub 结构可以参考[这里](https://github.com/krisztianmukli/epub-boilerplate/wiki/EPUB-Structure)

### mobi 格式
mobi 格式最早是由法国 Mobipocket 公司为个人掌上设备推出的电子书格式，后来该公司被 Amazon 收购，所以 mobi 格式也成为了 Kindle 的默认支持格式。[^mobi]

[^mobi]: https://en.wikipedia.org/wiki/Mobipocket

### azw, azw3
看名字就知道这是 Amazon kindle 的私有格式了。

## 格式转换 {#convert}

### 使用 Calibre
如果不熟悉命令行，可以使用 Calibre 这个强大的电子书管理软件，epub 到 mobi，mobi 到 epub，pdf 到 mobi 多种格式任意切换，还能一键发送到 kindle

### Calibre ebook-convert
如果熟悉 `ebook-convert` 可以直接使用命令行来转换

    ebook-convert book_name.epub book_name.mobi

关于命令使用详情，可以参考 [Calibre 官网](https://manual.calibre-ebook.com/conversion.html)

ebook-convert 支持非常多的格式转换，具体的格式可以参考[官网](https://manual.calibre-ebook.com/generated/en/ebook-convert.html)

Python 代码

    def epub2mobi(book_path):
        import subprocess
        filename = os.path.basename(book_path)
        dirname = os.path.dirname(book_path)
        name, ext = os.path.splitext(filename)
        if ext != '.epub':
            return
        try:
            subprocess.call(['ebook-convert', book_path, os.path.join(dirname, name + '.mobi')])
        except Exception as e:
            logger.exception('convert error')


### KindleGen
使用 Amazon 提供的二进制命令将 epub 转化为 mobi

    *************************************************************
     Amazon kindlegen(Linux) V2.9 build 1028-0897292
     A command line e-book compiler
     Copyright Amazon.com and its Affiliates 2014
    *************************************************************

    Usage : kindlegen [filename.opf/.htm/.html/.epub/.zip or directory] [-c0 or -c1 or c2] [-verbose] [-western] [-o <file name>]
    Note:
       zip formats are supported for XMDF and FB2 sources
       directory formats are supported for XMDF sources
    Options:
       -c0: no compression
       -c1: standard DOC compression
       -c2: Kindle huffdic compression
       -o <file name>: Specifies the output file name. Output file will be created in the same directory as that of input file. <file name> should not contain directory path.
       -verbose: provides more information during ebook conversion
       -western: force build of Windows-1252 book
       -releasenotes: display release notes
       -gif: images are converted to GIF format (no JPEG in the book)
       -locale <locale option> : To display messages in selected language
          en: English
          de: German
          fr: French
          it: Italian
          es: Spanish
          zh: Chinese
          ja: Japanese
          pt: Portuguese
          ru: Russian
          nl: Dutch

## 工具库


### Unpack mobi 库
下面的工具可以将 mobi 文件拆包，提取 azw3、mobi 的 epub。

    https://github.com/kevinhendricks/KindleUnpack

Kindle 相关工具集

    https://github.com/ywzhaiqi/MyKindleTools

Calibre 的 ebook-meta 工具

    https://manual.calibre-ebook.com/generated/en/ebook-meta.html

利用该工具能够快速的获取各种格式电子书的 mata 信息，包括封面信息。[^s]

[^s]: <https://stackoverflow.com/a/35501566/1820217>


## reference

- [Sigil](https://sigil-ebook.com/) a multi-platform EPUB ebook editor
- <https://github.com/aerkalov/ebooklib>
- <https://github.com/krisztianmukli/epub-boilerplate>
- <http://sourcefabric.booktype.pro/booktype-23-for-authors-and-publishers/importing-a-book/>
- <https://www.pythoncircle.com/post/212/python-script-1-convert-ebooks-from-epub-to-mobi-format/>
- <https://github.com/kimvais/kiehinen>
