---
layout: post
title: "Vim 插件之：vim-abolish"
tagline: ""
description: ""
category: Vim
tags: [vim, vim-plugin, tim-pope, ]
last_updated:
---

vim-abolish 又一款 Tim Pope 大神所制作的插件，这款插件扩展了一条名为 `:Subvert` 的自定义命令，作用类似于 Vim 内置命令 `:substitute` 的扩展。

- <https://github.com/tpope/vim-abolish>

比如说想要将整个文档中的 man 和 dog 两个单词交换，如果用 Vim 原生的替换比较麻烦，而使用该插件则只需要
	:%S/{man,dog}/{dog,man}/g

在 GitHub 页面上也有大量的使用方式介绍，这里再提一个官方页面上的用例，比如想要把所有的 facility 替换成 building，那么 facility 有复数， building 也有复数，怎么办

	:%S/facilit{y, ies}/building{,s}/g

这个比较好理解，但是 Abolish 还有一个非常贴心的转换，在编程中有驼峰命名，小写字母加下划线命令，假如要将一些变量从小写下划线变成驼峰命名，这个插件提供了一个方法 `crc`

	compute_vm_current_status

将光标移动到该变量名，然后按下 `crc` 就可以快速将变量命名修改成 camelCase (crc).

同样的

- crs 变成 snake_case , 小写下划线
- crm MixedCase
- crc camelCase
- crs snake_case
- cru UPPER_CASE
- cr- dash-case
- cr. dot.case
- cr<space> space case
- crt Title Case

更加详细内容 `:help abolish`
