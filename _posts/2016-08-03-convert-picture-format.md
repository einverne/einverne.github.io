---
layout: post
title: "转换图片格式"
tagline: ""
description: ""
category: 经验总结
tags: [format, jpg, png, convert, linux, command,]
last_updated:
---

安装 imagemagick 用到的工具在这个包中。

    sudo apt install imagemagick

首先检查图片格式

    identify temp.jpg


将一张图片转换格式

    convert image.jpg image.png


批量转换图片

    mogrify -format png /tmp/*.jpg

将目录下所有的 png 图片转换成 png 格式，并保存在同目录

