---
layout: post
title: "gnome do 技巧"
tagline: ""
description: ""
category: 经验总结
tags: [Linux, gnome-do,]
last_updated: 
---

自 Mint 开始才接触到 `Gnome-do` 这样一个神器，一句话介绍他的功能就是启动器，完全键盘操作的启动器。当然在启动应用之外还有很多扩展的功能，自开始使用 `Gnome-do` 开始几乎已经很少使用菜单开应用了。正如[这篇](http://ubuntuforums.org/showthread.php?t=1371312) 文章所讲使用了 `Gnome-do` 之后就会让 Windows 和 OS X 下的用户嫉妒不已。 不过 OS X 下貌似也有 Alfred 这样的神器。

## 安装与启动

Mint 下直接从软件管理里面搜索安装吧，如果想使用命令行，下面的也可以：

	sudo apt-get install gnome-do

忘记了初始设置的启动快捷键是什么了，我自己一直使用 Alt + Space .

## 启动应用

最基本的功能就是启动应用， Alt + Space 之后，输入 “Chrome” ，找到 Chrome 之后回车就直接开启 Chrome。当然与此同时 `Gnome-do` 也回去搜索本地，查找相关的目录寻找与 Chrome 相关的内容，不关心跳过就行。用同样的方法可以开启本地的任何应用，当然要保证这些应用都在 `Gnome-do` 的搜索路径下。`Gnome-do` 会自动学习使用习惯，现在基本我输入 `c` 就能够找到 Chrome。

## 开启URL

打开 `Gnome-do`，输入网址 `google.com` 然后第一次可能需要使用 Tab 选择 Action： Open URL。然后回车， `Gnome-do` 会自动开启默认浏览器加载网页。

## Plugin
以下插件都可以在 Preference 中找到，并启用，一些插件默认已经启用。

### Alias

给应用程序或者其他命令重命名

### Files and Folders
搜索本地文件及目录

### GNOME Session Management
重启或者关机

### Twitter
并不怎么用 Twitter ，不过可以实现 Twitter 发消息。

## 总结

大部分的情况都是启动应用，URL 或者搜索打开文件，其他的一些功能并不常用。