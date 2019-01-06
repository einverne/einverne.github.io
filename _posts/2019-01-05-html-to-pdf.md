---
layout: post
title: "html 转 pdf 命令行工具 wkhtmltopdf"
tagline: ""
description: ""
category: 经验总结
tags: [html, pdf, linux, command,]
last_updated:
---

最近因为用 HTML 写了一个文档，当想要输出时保存为 PDF，而 Chrome 自带的打印功能，本来就能够快速的保存为 PDF，但是却保留不了页面中的链接，所以找到了这个 wkhtmltopdf.

官网地址：<https://wkhtmltopdf.org/>

> wkhtmltopdf and wkhtmltoimage are open source (LGPLv3) command line tools to render HTML into PDF and various image formats using the Qt WebKit rendering engine. These run entirely "headless" and do not require a display or display service.

简而言之，wkhtmltopdf 是一个能够把 HTML 文档，或者在线 url 转换为 pdf 文档或者 image 图片的命令行工具。跨平台，支持 Linux，Windows，Mac。

## 安装
有两种方法，一种是直接使用编译好的版本，[下载](https://wkhtmltopdf.org/downloads.html) 安装即可，一种是用[源码](https://github.com/wkhtmltopdf/wkhtmltopdf) 编译安装。

验证

    wkhtmltopdf -V

查看版本。注意只有 qt 版本才能保留页面中链接。


## 命令格式
命令用法

    wkhtmltopdf [GLOBAL OPTION]... [OBJECT]... <output file>

## 实例
将 HTML 文件转换成 PDF

    wkhtmltopdf a.html a.pdf

将 URL 保存为 PDF

    wkhtmltopdf https://douban.com douban.pdf

把网页转换为图片同理

    wkhtmltoimage a.html a.jpg
    wkhtmltoimage https://douban.com douban.jpg

全局参数解析

    --collate             当输出多个副本时进行校验（这是默认设置）
        --no-collate          当输出多个副本时不进行校验
        --cookie-jar <path>   从提供的 JAR 文件中读写 cookie 数据
        --copies <number>     设置输出副本的数量（默认主 1)，其实为 1 就够了
    -d, --dpi <dpi>           指定一个要分辨率（这在 X11 系统中并没有什么卵用）
    -H, --extended-help       相对 -h 参数，显示更详细的说明文档
    -g, --grayscale           指定以灰度图生成 PDF 文档。占用的空间更小
    -h, --help                显示帮助信息
        --htmldoc             输出程序的 html 帮助文档
        --image-dpi <integer> 当页面中有内嵌的图片时，
                              会下载此命令行参数指定尺寸的图片（默认值是 600)
        --image-quality <interger> 当使用 jpeg 算法压缩图片时使用这个参数指定的质量（默认为 94)
        --license             输出授权信息并退出
    -l, --lowquality          生成低质量的 PDF/PS , 能够很好的节约最终生成文档所占存储空间
        --manpage             输出程序的手册页
    -B, --margin-bottom <unitreal> 设置页面的 底边距
    -L, --margin-left <unitreal>   设置页面的 左边距 （默认是 10mm)
    -R, --margin-right <unitreal>  设置页面的 右边距 （默认是 10mm)
    -T, --margin-top <unitreal>    设置页面的 上边距
    -O, --orientation <orientation> 设置为“风景 (Landscape)”或“肖像 (Portrait)”模式，
                                    默认是肖像模块 (Portrait)
        --page-height <unitreal>   页面高度
    -s, --page-size <Size>         设置页面的尺寸，如：A4,Letter 等，默认是：A4
        --page-width <unitreal>    页面宽度
        --no-pdf-compression       不对 PDF 对象使用丢失少量信息的压缩算法，不建议使用些参数，
                                   因为生成的 PDF 文件会非常大。
    -q, --quiet                    静态模式，不在标准输出中打印任何信息
        --read-args-from-stdin     从标准输入中读取命令行参数，后续会有针对此指令的详细介绍，
                                   请参见 **从标准输入获取参数**
        --readme                   输出程序的 readme 文档
        --title <text>             生成的 PDF 文档的标题，如果不指定则使用第一个文档的标题
    -V, --version                  输出版本信息后退出

## reference

- <https://superuser.com/q/1064579/298782>
