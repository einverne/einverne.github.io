---
layout: post
title: "Vim 插件之 markdown : vim markdown"
aliases: "Vim 插件之 markdown : vim markdown"
tagline: ""
description: ""
category: vim-plugin
tags: [vim, vim-plugin, markdown, ]
last_updated:
---

直接上官网

- <https://github.com/plasticboy/vim-markdown>

## installation
在 vim 配置文件

    Plug 'godlygeek/tabular'
    Plug 'plasticboy/vim-markdown'

## usage

安装插件之后会自动高亮语法。该插件有很多配置选项，建议 `:help vim-markdown`

而我个人比较常用的一些功能是打开文档中链接，将光标放到链接的任何位置使用如下命令

    gx

打开 markdown 中相对链接进行编辑

    ge

### Navigation
跳转到下一个标题

    ]]

同理跳转到上一个标题

    [[

上面两个方法不管标题的级别都会直接跳转，如果只想要在同一级别的标题中跳转可以使用

    []          # 前一个
    ][          # 后一个

跳转到当前标题

    ]c

跳转到父标题

    ]u

### commands

增加或者减少标题级别

    :HeaderDecrease
    :HeaderIncrease

显示 Toc(Table of Content) 目录：

    :Toc
    :Toch          " 水平打开 horizontal
    :Tocv          " 垂直窗口打开 vertical
    :Toct          " 新 tab 中打开

### 表格相关
格式化表格

    :TableFormat

## configuration

    " disable folding
    let g:vim_markdown_folding_disabled=1
    " Highlight YAML frontmatter as used by Jekyll
    let g:vim_markdown_frontmatter=1


## reference

- `:help vim-markdown`
