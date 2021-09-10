---
layout: post
title: "整站备份工具 Httrack"
tagline: ""
description: ""
category: 经验总结
tags: [Linux, Httrack, backup, ]
last_updated: 
---

根据官方的介绍[^intro]，HTTrack 是一个易用的离线浏览工具，他允许用户从万维网中离线备份某一个网站，包括建立层叠的目录，HTML，图片，以及其他文件。工具在 [GPL](http://www.gnu.org/licenses/gpl.txt) 协议下开源。

最近主要是因为想要备份 http://www.runningman2015.com/guidang/ 这个网站，突然想到了这个工具。在此之前曾经想要自己用 scrapy 提取网站结构，然后存到数据库，想了一下，直接一个命令可以实现的事情，完全可以不用 scrapy 了。


## 安装
在許多Unix-like系統下，只需要用包管理工具安裝httrack即可。例如Debian使用

    sudo apt-get install httrack webhttrack

该工具集包含一个命令行 `httrack` 和 一个WEB界面的 `webhttrack`。如果想要直观的运行 HTTrack，可以直接使用 `webhttrack`。 HTTrack 官方提供 Windows 版本，可以直接去官网[^intro]下载。

## 例子

一個使用例子：

	httrack "http://www.runningman2015.com/" -O "/home/einverne/rm/" "+*.runningman2015.com/*" -v

它的意思是：以http://www.runningman2015.com/ 为起始URL，输出到 /home/einverne/rm/ 文件夹，范围是 runningman2015.com 域名下的所有文件，并显示所有错误信息（verbose）。

其他参数

O	镜像后本地路径 -O path/to/local 

w	镜像网站 (--mirror)
W	mirror web sites, semi-automatic (asks questions) (--mirror-wizard) 更加自动化的备份

更多参考官网手册[^guide]。

当然新手也可以直接运行 `httrack` 命令，该命令会自动产生一个向导，选择123 即可。

## 其他工具

名称  |  网址  |   平台  |  优缺点 
-----------|---------------|---------------|----------------|
Teleport Pro | <http://www.tenmax.com/teleport/pro/index.htm>  | Windows | 整站备份，网站结构清晰，只支持单一平台，收费
Cyotek WebCopy | <https://www.cyotek.com/cyotek-webcopy> | Windows with .NET 4.6 | 整站备份，免费

## 其他命令行

    wget -r --no-parent -e robots=off http://www.example.com
    wget -m -p -E -k www.example.com


## 缺点
镜像站点功能很强大，但是下载离线的数据非结构化数据，镜像功能对与纯静态HTML站点非常有效，但是对于目前互联网上的大部分 JS 动态网站却无能为力，镜像后容易都是内容。



[^intro]: 官方网站 <http://www.httrack.com/>
[^guide]: 手册 <http://www.httrack.com/html/fcguide.html>