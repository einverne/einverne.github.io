---
layout: post
title: "每天学习一个命令：curl 命令行下载工具"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, curl, command, network]
last_updated:
---

curl 命令是一个利用 URL 规则在命令行下工作的文件传输工具。它支持文件的上传和下载，所以是综合传输工具，但按传统，习惯称 curl 为下载工具。作为一款强力工具，curl 支持包括 HTTP、HTTPS、ftp 等众多协议，还支持 POST、cookies、认证、从指定偏移处下载部分文件、用户代理字符串、限速、文件大小、进度条等特征。

## 例子

### URL 访问

下载单个网址，默认将输出打印到标准输出

    curl www.google.com

### 保存到文件

如果需要将页面源码保存到本地，可以使用`-o`参数：

```
-o 将文件保存到 -o 指定的文件名
-O 将文件保存到默认文件名

curl -o google.html www.google.com

```

### 重定向

默认情况下 CURL 不会发送 HTTP Location headers（重定向）. 当一个被请求页面移动到另一个站点时，会发送一个 HTTP Loaction header 作为请求，然后将请求重定向到新的地址上。

    curl -L google.com


### 断点续传

通过使用`-C`选项可对大文件使用断点续传功能

### 下载脚本并执行

    curl -sSL http://to.sh | bash

### 查看 Header

使用 `-i` 或者 `--include` 参数查看返回 Header

    curl -i google.com

使用 `-i` 参数，页面相应头 header 和页面相应 body 一起返回，如果只想查看 header，可以使用 `-I` 或者 `--head`

### 表单提交
GET 提交直接将参数添加到 URL 后


POST 提交时

    curl -X POST --data 'keyword=value' https://httpbin.org/post

其他 HTTP 方法通过 `-X` 参数指定即可


    curl -X DELETE url

    curl -X PUT --data 'key=value' url

### 文件上传

    curl -T file.txt url

### HTTPS 支持

    curl -E mycert.pem https://url

### 添加请求头

    curl -H ‘Content-Type:application/json' -H 'Authorization: bearer valid_token' URL

### Cookie

`-c`参数保存请求返回 Cookie，本地存储文件

    curl -b cook_file.txt -c response_cookie.txt URL

### 上传 FTP
通过 `-T` 选项可指定本地文件上传到 FTP 服务器

    curl -u ftpuser:ftppassword -T file.txt ftp://ftp.server
    curl -u ftpuser:ftppassword -T "{file1, file2}" ftp://ftp.server

总的来说，curl 的用法比较普通，最常见的也就是用来下载文件，或者直接查看 Header，还有在命令行下发送 GET 或者 POST 请求，其他用法倒也是有，不过日常并没有经常使用到。

## 外延 wget
wget 是一个下载文件的工具，它用在命令行下。对于 Linux 用户是必不可少的工具，我们经常要下载一些软件或从远程服务器恢复备份到本地服务器。wget 支持 HTTP，HTTPS 和 FTP 协议，可以使用 HTTP 代理。

    wget https://www.google.com

## 外延 axel
Axel 是 Linux 下一款不错的 HTTP 或 FTP 高速下载工具。支持多线程下载、断点续传，且可以从多个地址或者从一个地址的多个连接来下载同一个文件，适合网速不给力时多线程下载以提高下载速度。

使用 10 个线程同时下载文件

    axel -n 10 url

## 外延 mwget
多线程版本 wget，同时使用 5 个线程下载

    mwget -n 5 url


## reference

- <http://man.linuxde.net/curl>
