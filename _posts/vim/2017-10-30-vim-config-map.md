---
layout: post
title: "Vim 键映射"
tagline: ""
description: ""
category: vim
tags: [Vim, Linux, ]
last_updated: 
---

Vim 本身有很多快捷键，vimrc 也可以配置很多快捷键，当然 Vim 也支持将不同的键映射到不同的键或者命令上。

最常见的键映射就是

- nmap
- vmap
- imap

分别对应着修改普通模式(Normal) ，选择模式(Visual)，和插入模式(Insert) 下的键映射。

对于这几种模式，可以参考 [Vim 模式](/post/2015/05/vim-mode.html)

## Map 命令
其实对于 map 命令的种类远不止于此 

- noremap  非递归映射
- nmap
- vmap
- imap
- cmap 在命令模式下生效

递归映射，就是如果当快捷键 a 被映射成 b, b 又被映射成 c ,那么他们是递归的，那么 a 就是被映射成 c

	map b a
	map c b

效果等同于

	map c a

默认的 map 是递归的，除了 noremap 

unmap 解除映射

unmap 和 map 类似也可以添加很多前缀，表示影响的模式

mapclear 命令

mapclear 直接清除相关模式下所有的映射，也可以添加很多前缀，表示影响的模式

所以总结一下大概有如下命令:

	:map   :noremap   :unmap   :mapclear 
	:nmap  :nnoremap  :nunmap  :nmapclear
	:vmap  :vnoremap  :vunmap  :vmapclear
	:imap  :inoremap  :iunmap  :imapclear
	:cmap  :cnoremap  :cunmap  :cmapclear

## 查看当前 Vim 配置的键绑定

通过在 vimrc 中配置不同的快捷键，影响不同模式下 Vim 的快捷键，那么可以在普通模式下使用 `:map` 来查看当前 Vim 配置的快捷键。


## 如何测试 map 生效

Vi stackoverflow 上有一篇[文章](https://vi.stackexchange.com/questions/7722/how-to-debug-a-mapping) 讲述的很详细。

解决的具体步骤：

- 明确 map 的命令
- 想要定义的快捷键具体做什么
- 然后使用 `:map` 来检查定义的 map 是否已经被 Vim 识别
- 如果还是不行，在那篇文章中检查是否遇到了常见的一些错误
- 再不行的话就去 vi stackoverflow 等等论坛求助大神吧


