---
layout: post
title: "Vim 插件之全局搜索：ack.vim"
tagline: ""
description: ""
category: [ 学习笔记 , vim-plugin ]
tags: [vim, vim-plugin, ack, ack-grep, ag, search, grep, ]
last_updated:
---

这篇文章看开始陆陆续续记录一下用过的 Vim Plugin，虽然有些一直也在用但从没有好好整理过，正好这篇开一个计划吧。

Ack.vim 在 vim 中使用 ack 或者 ag 来搜索，通过 [Quickfix](http://vimdoc.sourceforge.net/htmldoc/quickfix.html#quickfix) 来提供所搜结果

首先放上链接

- <https://github.com/mileszs/ack.vim>

我使用 Vundle 管理，安装更新就不展开，这里重点介绍一下该插件。这里需要注意 ack.vim 需要依赖 ack >= 2.0 及以上版本。

## Installation

    brew install the_silver_searcher
    sudo apt install silversearcher-ag

在 `~/.vimrc` 中 Vundle 安装

    Plugin 'mileszs/ack.vim'
    let g:ackprg = 'ag --nogroup --nocolor --column'


## Introduction

ack.vim 的功能是给 Vim 提供 [ack](http://beyondgrep.com/) 的功能，可以在编辑器中调用 ack 工具来进行搜索，并友好的展示。

## Usage
在 Vim 中直接

    :Ack [options] {pattern} [{directories}]

说明：

- 默认情况下会递归搜索当前目录
- pattern 支持正则

搜索的结果会显示在窗口中，显示的格式是文件名，内容在文件中的行数以及内容。在该窗口中回车 `Enter` 会直接跳到该文件中。

    ?    a quick summary of these keys, repeat to close
    o    to open (same as Enter)
    O    to open and close the quickfix window
    go   to preview file, open but maintain focus on ack.vim results
    t    to open in new tab
    T    to open in new tab without moving to it
    h    to open in horizontal split
    H    to open in horizontal split, keeping focus on the results
    v    to open in vertical split
    gv   to open in vertical split, keeping focus on the results
    q    to close the quickfix window

## Config

    " ack.vim
    " 使用 leader + a search
    cnoreabbrev Ack Ack!
    nnoremap <Leader>a :Ack!<Space>

    if executable('ag')
      let g:ackprg = 'ag --vimgrep --nogroup --column'
    endif

    " 高亮搜索关键词
    let g:ackhighlight = 1

更多可以使用 `:help ack` 来查看

更多可以参考我的 [dotfiles](https://github.com/einverne/dotfiles)

## reference

- <https://vim.fandom.com/wiki/Easier_buffer_switching>
