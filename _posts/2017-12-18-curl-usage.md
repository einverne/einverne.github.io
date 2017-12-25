---
layout: post
title: "每天学习一个命令：curl 命令行下载工具"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, curl, command]
last_updated: 
---

curl 命令是一个利用URL规则在命令行下工作的文件传输工具。它支持文件的上传和下载，所以是综合传输工具，但按传统，习惯称curl为下载工具。作为一款强力工具，curl支持包括HTTP、HTTPS、ftp等众多协议，还支持POST、cookies、认证、从指定偏移处下载部分文件、用户代理字符串、限速、文件大小、进度条等特征。

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

默认情况下CURL不会发送HTTP Location headers(重定向).当一个被请求页面移动到另一个站点时，会发送一个HTTP Loaction header作为请求，然后将请求重定向到新的地址上。

    curl -L google.com


### 断点续传

通过使用`-C`选项可对大文件使用断点续传功能

### 查看Header

使用 `-i` 或者 `--include` 参数查看返回Header

    curl -i google.com

使用 `-i` 参数，页面相应头header和页面相应body 一起返回，如果只想查看 header，可以使用 `-I` 或者 `--head`

### 表单提交
GET 提交直接将参数添加到 URL后


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

### 上传FTP
通过 `-T` 选项可指定本地文件上传到FTP服务器

    curl -u ftpuser:ftppassword -T file.txt ftp://ftp.server
    curl -u ftpuser:ftppassword -T "{file1, file2}" ftp://ftp.server

总的来说，curl 的用法比较普通，最常见的也就是用来下载文件，或者直接查看Header，还有在命令行下发送 GET或者 POST 请求，其他用法倒也是有，不过日常并没有经常使用到。


## reference

- <http://man.linuxde.net/curl>
