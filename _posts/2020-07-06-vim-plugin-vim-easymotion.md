---
layout: post
title: "Vim 插件之 vim-easymotion"
tagline: ""
description: ""
category:
tags: [vim, vim-plugin, ]
last_updated:
---

Vim 中已经提供了非常多移动的**动作**，从简单的字符间移动 (jkhl)，到 word 间 (w/e/b)，句子间 (`(`/`)`)，段落间 ({/})，行首行尾 (0/^/$)，文档开始 (gg)，文档结尾 (G)，还有搜索 (`/`/`np`) 等等一系列的操作，但 easy-motion 将 Vim 中的移动又提升了一个高度。

继续往下阅读之前先确保阅读了 vim 文档中关于 [motion](http://vimdoc.sourceforge.net/htmldoc/motion.html) 的内容。

想象一个场景，想要跳转到当前行下一个段落中的第二个句子的第三个单词开头，使用上面提到的方法，可能需要按下不同的按键，并且可能还需要组合使用，那有没有什么方法能降低这个**移动**（或者说跳转）操作的复杂度呢？答案就是 easy-motion。不知道有多少人用过 Chrome 下的 Vimium 插件，在网页中按下 `f`，页面中每一个能点击的地方都会显示几个字符，然后按下字符就会相当于在页面上点击，easy-motion 也使用相同的方式实现这一功能。

easy-motion 插件提供了更强的移动操作，在 easymotion 的官方文档中是这样定义 easymotion 的，easymotion 可以将 `<number>w` 或者 `<number>f{char}` 简化为几个按键的操作，举一个简单的例子，在 easymotion 下，如果按下 `w`，那么 easymotion 会高亮所有 `w`（下一个词首） 的结果，然后只需要按下一个键，就可以跳转到任何 `w` 按键按下后的目标地址。

## Install

    Plug 'easymotion/vim-easymotion'

## Usage

	:help easymotion

Easymotion 的触发需要按下两次 `<leader><leader>`，当然推荐熟悉之后使用 vim 的 map 配置更改一下 leader.


    Default Mapping      | Details
    ---------------------|----------------------------------------------
    <Leader>f{char}      | Find {char} to the right. See |f|.
    <Leader>F{char}      | Find {char} to the left. See |F|.
    <Leader>t{char}      | Till before the {char} to the right. See |t|.
    <Leader>T{char}      | Till after the {char} to the left. See |T|.
    <Leader>w            | Beginning of word forward. See |w|.
    <Leader>W            | Beginning of WORD forward. See |W|.
    <Leader>b            | Beginning of word backward. See |b|.
    <Leader>B            | Beginning of WORD backward. See |B|.
    <Leader>e            | End of word forward. See |e|.
    <Leader>E            | End of WORD forward. See |E|.
    <Leader>ge           | End of word backward. See |ge|.
    <Leader>gE           | End of WORD backward. See |gE|.
    <Leader>j            | Line downward. See |j|.
    <Leader>k            | Line upward. See |k|.
    <Leader>n            | Jump to latest "/" or "?" forward. See |n|.
    <Leader>N            | Jump to latest "/" or "?" backward. See |N|.
    <Leader>s            | Find(Search) {char} forward and backward.
                         | See |f| and |F|.


下面将 `<leader><leader>` 简写成 `<ll>`

向后向前跳转

	<ll>w
	<ll>b

双向跳转

	<ll>s

向上向下跳转到行：

	<ll>j
	<ll>k


## reference

- <https://github.com/easymotion/vim-easymotion>
- <https://github.com/AlexPl292/IdeaVim-EasyMotion>
