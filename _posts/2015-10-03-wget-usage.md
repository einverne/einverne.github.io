---
layout: post
title: "wget 常用命令"
tagline: ""
description: ""
category: 经验总结
tags: [wget, curl, linux, linux-command, backup,  ]
last_updated:
---

wget 是一个非常常用的下载命令，但其实 wget 非常强大，这里就列举一些很常用的选项。

## 下载整站
备份或者下载整站：

    wget -r -np http://www.mysite.com/Pictures/
    wget -r --no-parent --reject "index.html*" http://www.mysite.com/Pictures/

说明：

- `-r` 表示 recursively 递归下载
- `-np` 或者 `--no-parent` 表示不延伸到父目录，当想要下载特定目录下的文件时，记得加上这个选项

当然如果你的目的非常单纯只是想备份网站，之前也写过一篇 [Httrack 备份全站](/post/2017/03/mirror-one-site.html) 的文章。

## 下载特定文件或者忽略特定文件
使用 `-A` 或者 `-R`

    wget -A jpg,pdf http://site
    wget --accept jpg,pdf http://site

    wget -R "index.html" http://site

说明：

- `-A` 或者 `--accept` 后面接逗号分割的后缀或者模式，表示下载接受的文件格式，或者符合正则表达式的内容
- `-R` 或者 `--reject` 表示不下载匹配的

需要注意的是如果书写正则表达式，那么需要用双引号。

## 路径乱码
在使用 wget 备份网站目录时可能遇到网站路径编码下载到本地之后乱码的情况，这个时候需要使用 `--restrict-file-names=nocontrol`

## 镜像网站
有些时候可能要离线文档用来在本地浏览，这个时候需要用到 `-k`

    wget --mirror --convert-links --adjust-extension --page-requisites
    --no-parent http://example.org
    wget -mkEpnp http://example.org

说明：

- `-m` 或者 `--mirror` 镜像网站，这个选项会开启递归和时间戳，并且保持目录结构，等效于 `-r -N -l inf --no-remove-listing`
- `-k` 或者 `--convert-links` 表示将连接转成 localhost，方便本地浏览
- `-E` 或者 `--adjust-extension` 表示会根据文件的 MIME 类型，将一些文件调整为 HTML 等等后缀，方便在不同的 WEB 服务器中托管
- `-p` 或者 `--page-requisites` 会将任何 HTML 页面显示需要的资源都下载下来，包括 images，sounds，css，js 等等


## 限制网速

wget 使用选项 `--limit-rate` 来限制速度：

    wget --limit-rate=423k

单位是 bytes per second，如果要表示 kiloBytes，在结尾加上 `k` .

## 自定义重试次数

使用 `--tries=70` 来自定义重试次数，默认情况下 wget 会重试 20 次。
