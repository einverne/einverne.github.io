---
layout: post
title: "又一个网页文件管理：filebrowser"
tagline: ""
description: ""
category: 经验总结
tags: [web, filemanager, h5ai, filebrowser, ]
last_updated:
---

之前一直使用的是 h5ai，平时也够用，不过 h5ai 是不能上传文件编写文件的，这算是一个问题吧，今天正好看到了 [filebrowser](https://github.com/filebrowser/filebrowser)，以前叫做 file manager。

File Browser 是一个用 Go 和 Vue 编写的基于 Web 的文件管理器。

去官网看来一眼，发现支持 docker， 所以就比较方便了。

具体 docker compose 的文件见 [这里](https://github.com/einverne/dockerfile/tree/master/filebrowser)

只要配置好，几乎就是一键安装了。以后转战 filebrowser 了。

![filebrowser-20210827181233.png](/assets/filebrowser-20210827181233.png)

默认的用户名和密码是 admin/admin，记得登录进去第一件事情就是修改密码。

