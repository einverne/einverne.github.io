---
layout: post
title: "每天学习一个命令：使用 jpegoptim 和 optipng 优化压缩图片"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [compress, optimize, linux, command, jpeg, png,]
last_updated:
---

今天突然遇到一个问题，使用手机拍摄的照片 5+M 体积巨大，但是网易要求的图片大小需要小于 1M，所以就有了压缩图片的需求。记得很久以前使用过 [TinyPNG](https://tinypng.com/) 这个服务，但是唯一一点不好的就是无法脱离他在线的服务，需要把照片上传到他的网站上才能进行压缩。虽然有 [tinypng-cli](https://www.npmjs.com/package/tinypng-cli) 这个命令行的工具，但其实也是依赖在线服务的。所以就找了一下，然后发现了 `jpegoptim` 和 `optipng` 这两个工具。

## jpegoptim

安装

    apt-get install jpegoptim

使用

    jpegoptim file.jpg

然后使用 `du -h file.jpg` 查看文件大小。使用这种方式 jpegoptim 会尽量使用无损失的压缩方式，所以几乎看不出区别。而如果想要指定大小，比如想要压缩到 500k 大小，可以

    jpegoptim --size=500k file.jpg

而如果要批量压缩，在目录中 `jpegoptim *.jpg` 即可。

如果要将 EXIF 信息移走可以添加参数

    jpegoptim --strip-exif file.jpg

结合 find

    find images_folder/ *.{jpeg,jpg} -exec jpegoptim {} \;


## optipng
安装

    apt-get install optipng

使用

    optipng file.png

结合 find

    find images_folder/ *.png -exec optipng {} \;

## mozjpeg
优化 jpeg 压缩算法

- <https://github.com/mozilla/mozjpeg>

命令行版本

- <https://github.com/imagemin/mozjpeg-bin>

安装方式：

	npm install -g mozjpeg

	mozjpeg --help

## 在 macOS 下优化压缩图片
macOS 下有一个不错的工具叫做 `imageOptim`

安装：

    brew install imageoptim-cli

优化当前目录中的 PNG：

    imageoptim --imagealpha '**/*.png'
    
优化 JPG：
 
    imageoptim --jpegmini '**/*.jpg' '**/*.jpeg'

## reference

- [Tecmint](https://gtk.pw/ayO4t)
