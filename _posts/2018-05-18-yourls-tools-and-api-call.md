---
layout: post
title: "yourls 相关工具和API调用"
tagline: ""
description: ""
category: 学习笔记
tags: [yourls, url-shorten, api, domain, linux]
last_updated: 
---

自己的 yourls 已经[搭建完毕](/post/2018/04/yourls.html) ，重要的就是如何高效的用起来了， yourls 自身提供了很不错的快速访问工具，安装完毕之后直接浏览

    https://域名/admin/tools.php

可以得到书签栏中的快速访问工具，直接拖拽到浏览器的地址栏就可以快速的将当前的页面地址缩短。这个工具也就不多介绍了，这篇文章主要摸索一下 yourls 的API调用，以及如何在PC，和移动端快速的使用短链接服务。

## API 访问

yourls 提供了丰富的API，使用自身的API可以实现

- 产生或者获取短链接
- 获取短链接的统计信息，包括点击最高的链接，最后一次点击的链接，或者新产生的链接等等
- 可以以 JSON, XML 或者纯文本输出
- 通过用户名密码或者安全的无密码token机制授权

请求的地址

    https://域名/yourls-api.php

通过 GET 或者 POST 请求（GET请求需要URL Encode）

### 参数

两种方式获得授权，一种是使用 `username` / `password` 对发送请求，但是这种方式不安全，可能导致用户名密码在传输过程中被截取泄露；另一种方式是使用不需要密码的 token 机制，在 admin/tools.php 页面会产生当前用户的验证 token。

动作 `action` 参数有很多个选项

- `shorturl` 获取链接的短链接

    在使用了值之后，另外两个参数

        - `url` 用来缩短的原始链接
        - `keyword` 或者 `title` 可选参数，用来自定义短链接
        
- `expand` 获取短链接的原始长链接

    将短链接展开

        - `shorturl` 值可以为 `abc` 或者完整的短链接
        
- `url-stats` 获取短链接的信息

    短链接的统计信息

        - `shorturl` 值可以为 `abc` 或者完整的短链接

- `stats` 获取链接的信息

    获取链接的信息

        - `filter` 值可以为 `top`, `bottom`, `rand`, `last`
        - `limit` 返回的数量
       
- `db-stats` 获取全局的链接和点击数

输出格式 `format` 参数用来指定API输出的格式，有如下值

- jsonp
- json
- xml
- simple

### 举例

请求缩短链接

    curl -X POST \
      https://gtk.pw/yourls-api.php \
      -F signature=xxxxxx \
      -F action=shorturl \
      -F url=https://gtk.pw/readme.html \
      -F format=json

返回结果

因为之前已经请求过，所以报了fail，不过结果依然能够从 `shorturl` 中拿到

    {
        "status": "fail",
        "code": "error:url",
        "url": {
            "keyword": "OStH3",
            "url": "https://gtk.pw/readme.html",
            "title": "YOURLS: Your Own URL Shortener",
            "date": "2018-05-18 03:27:36",
            "ip": "123.123.123.7",
            "clicks": "0"
        },
        "message": "https://gtk.pw/readme.html already exists in database",
        "title": "YOURLS: Your Own URL Shortener",
        "shorturl": "https://gtk.pw/OStH3",
        "statusCode": 200
    }

其他几个API同理，返回结果结构稍有差异不过都类似。

## iOS 移动平台快速获取短链接

iOS 上可以借助 Workflow 快速实现，主要的步骤

- Get Clipboard
- Get URLs from Input
- URL -> API地址 https://域名/yourls-api.php
- Get Contents of URL -> 构造参数
- Get Dictionart Value -> shorturl
- Copy to Clipboard

然后每一次将链接复制到粘贴板，然后运行该 workflow ，短链接就在 Clipboard 中了。

第二中方法，是直接在浏览器中，在链接前面加上，yourls 的域名，比如

    https://blog.einverne.info

加入yourls 的域名是 https://gtk.pw

那么在链接前加上 gtk.pw，yourls 会跳转到 admin 页面并添加该链接

    gtk.pw/https://blog.einverne.info
 
其他平台同理，不过需要登录 admin 略麻烦。


