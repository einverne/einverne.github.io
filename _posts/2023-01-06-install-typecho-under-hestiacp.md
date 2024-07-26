---
layout: post
title: "在 HestiaCP 下安装 Typecho"
aliases:
- "在 HestiaCP 下安装 Typecho"
tagline: ""
description: ""
category: 学习笔记
tags: [hestia, hestiacp, typecho, cms, control-panel, web-control-panel, php, mysql]
create_time: 2023-01-18 22:05:11
last_updated: 2023-01-18 22:05:11
---

[[HestiaCP]] 是一个[服务端控制面板](/post/2022/07/web-server-control-panel-hestia-usage.html)，支持快速部署网站，可以作为邮件服务器，提供了 MySQL 等关系型数据库。[[Typecho]] 是一个使用 PHP 编写的轻量级的 CMS，内容管理平台，可以作为一个博客或者内容发布平台使用。本文就讲解一下如何在 HestiaCP 面板中安装 Typecho CMS。

- HestiaCP 安装和使用的文章，见[这里](/post/2022/07/web-server-control-panel-hestia-usage.html)

## HestiaCP 设置
我一般情况下不会直接使用 admin 账号来安装程序，所以一般会创建一个普通用户，然后登录普通用户账号，然后在账号中创建网站。

![f3q0](https://photo.einverne.info/images/2023/11/18/f3q0.png)
创建完用户，创建完网站之后，进入安装步骤。
## Typecho 安装

登录 [Typecho 官网](https://typecho.org/) 下载源码。然后将 zip 文件上传到创建的网站根目录中。在 HestiaCP 中一般是在 `web/your_site/public_html` 目录下。然后将 ZIP 文件解压到当前目录。

创建数据库，在 MySQL 数据下，新增数据库，新创建的数据会带上用户名，记住数据库名，数据库用户名，以及数据库密码。

然后在 Cloudflare 做好域名的 A 记录，域名指向服务器的 IP，然后可以通过域名访问，第一次就会跳转到安装目录 `你的域名/install.php`，输入数据库名，用户名和密码，完成安装。

## 安装主题



## Typecho 自定义鼠标样式


## Typecho 禁止鼠标右击

