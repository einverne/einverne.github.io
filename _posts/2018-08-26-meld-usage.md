---
layout: post
title: "使用 Meld 对比文件及文件夹区别"
tagline: ""
description: ""
category: 学习笔记
tags: [meld, linux, git, merge, conflict, ]
last_updated:
---

在之前总结 Nemo file browser 的时候接触到了 meld，作为一个 nemo-compare 插件可以用来轻松的比较两个文件夹，两个文件，甚至多个文件。在了解之后发现 meld 其实更加强大，结合 git 使用可以非常轻松地解决 git 的合并冲突问题。

虽然大部分情况我都是用 smartGit 来解决的，smartGit 的三路合并和 meld 能够达到的效果非常相似。

## 安装

    sudo apt install meld

## 使用

打开 meld 从主界面就能看到应用的分工主要分为三块

- 文件内容的比较
- 文件夹内容的比较
- 版本控制的比较

前两个比较工具都可以选择两个或者三个输入源，后面的版本控制只需要一个版本控制的路径。meld 会自动对选中的内容进行比较。

