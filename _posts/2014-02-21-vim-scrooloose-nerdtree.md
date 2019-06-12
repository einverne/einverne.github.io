---
layout: post
title: "Vim 插件介绍：Nerdtree"
tagline: ""
description: ""
category: Vim
tags: [vim, nerdtree, vim-tips, vim-plugin, ]
last_updated:
---

地址

- <https://github.com/scrooloose/nerdtree> by Martin Grenfell

## 介绍 {#intro}

    :help NERDTree

## Config

通常情况下会设置一个 map

    nmap <F2> :NERDTreeToggle<cr>

然后设置

    " nerd comment
    " Add spaces after comment delimiters by default
    let g:NERDSpaceDelims = 1

    " Use compact syntax for prettified multi-line comments
    let g:NERDCompactSexyComs = 1

    " Align line-wise comment delimiters flush left instead of following code indentation
    let g:NERDDefaultAlign = 'left'

    " Set a language to use its alternate delimiters by default
    let g:NERDAltDelims_java = 1

    " Add your own custom formats or override the defaults
    let g:NERDCustomDelimiters = { 'c': { 'left': '/**','right': '*/' } }

    " Allow commenting and inverting empty lines (useful when commenting a region)
    let g:NERDCommentEmptyLines = 1

    " Enable trimming of trailing whitespace when uncommenting
    let g:NERDTrimTrailingWhitespace = 1

    " Highlight Cursor line
    let g:NERDTreeHighlightCursorline = 1
    " Show hidden files
    let NERDTreeShowHidden=1
    " NERDTree will recursively open dirs with only one child
    let NERDTreeCascadeOpenSingleChildDir=1

## Keyboard Mappings

使用 `:help NERDTreeMappings` 来查看插件所有的绑定，这一些是日常中使用频率比较高的：

- `Enter` 在窗口打开文件
- `i` 水平分割线分割，如果有一个打开的窗口，那么会分成上下两个窗口
- `s` 垂直分割线分割，左右两个窗口
- `I` 显示或者隐藏 hidden file
- `m` 菜单，m 是一个非常强大的命令，可以支持新增，删除，重命名，复制等等操作
- `r` 递归刷新当前目录
- `R` 递归刷新 root 目录
- `?`


