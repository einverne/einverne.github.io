---
layout: post
title: "转换图片格式，png, jpg, webp"
tagline: ""
description: ""
category: 经验总结
tags: [format, jpg, png, convert, linux, command,]
last_updated:
---

总结一下目前常用的图片格式转换命令，以及如何在这些常见的格式之间转换，包括 png, jpeg, webp 。

## png 和 jpg 格式相互转换
安装 imagemagick 用到的工具在这个包中。

    sudo apt install imagemagick

首先检查图片格式

    identify temp.jpg


将一张图片转换格式

    convert image.jpg image.png


批量转换图片

    mogrify -format png /tmp/*.jpg

给图片添加边框

	convert path/to/demo.jpg -border 30x30 -bordercolor white bordered.png

更改图片的分辨率

	convert path/to/demo.jpg -resize 1920x1080 after-resize.tiff

将目录下所有的 jpg 图片转换成 png 格式，并保存在同目录

	for file in *.jpg; do convert $file -resize 50% small-$file.png; done

## webp 格式转换
Google 已经将 webp 的解码工具放到了 `libwebp` 包中

	sudo apt install webp

然后能够使用

	dwebp input.webp -o output.png

如果要将 png 文件转换成 webp，可以使用 cwebp

	cwebp input.png -o output.webp

### ffmpeg

或者也可以使用 ffmpeg 来转换格式：

	ffmpeg -i file.webp out.png


## reference

- <https://github.com/mozilla/mozjpeg>
- <https://imagecompressor.io/blog/mozjpeg-guide/>
- <https://github.com/google/guetzli>
- <https://developers.google.com/speed/webp/>
