---
layout: post
title: "Nginx location 匹配规则"
aliases: "Nginx location 匹配规则"
tagline: ""
description: ""
category: 学习笔记
tags: [nginx, location, regex, web-server, server, ]
last_updated:
---

之前的关于 [Nginx Config](/post/2017/10/nginx-conf.html) 的文章是当时看 Nginx 书记录下来的笔记，很大略，没有实际操作，等终究用到 location 的时候发现还是有很多需要注意的问题，比如匹配的优先顺序，比如 root 和 alias 的区别等等，所以单独拿一篇文章来记录一下目前遇到的问题，并来解决一下。

## location 匹配顺序

之前的[文章](/post/2017/10/nginx-conf.html) 也简单的提到了 Nginx 配置中 location 块，这个配置能够是的针对 URL 中不同的路径分别可以配置不同的处理路径。

我当前遇到的问题就是提供 API 接口的项目和静态文件的项目是两个单独的项目，我需要 `/` 处理 `proxy_pass` 到本地一个端口，而 `/resources` 到本地另外一个静态资源文件的路径。

location 的语法在很多的文档教程中都被描述为：

    location [ = | ~ | ~* | ^~ ] uri { ... }

- `=` 用于非正则精确匹配 uri ，要求字符串与 uri 严格匹配，如果匹配成功，则停止向下搜索，并立即处理此请求
- `^~` 用于非正则 uri 前，Nginx 服务器找到标示 uri 和请求字符串匹配程度最高的 location 后立即使用该 location 处理请求，不再匹配 location 块的正则 url
- `~` 表示该 uri 包含正则，并且区分大小写
- `~*` 表示 uri 包含正则，不区分大小写

从四个类别中就能看出来，location 使用两种表示方法，一种为不带 `~` 的前缀字符，一种是带有 `~` 的正则。

需要注意的是：

- 如果使用正则，那么 location 定义的顺序很重要，第一个匹配的正则就立即执行
- 使用精确匹配可以提高查询速度，比如经常请求的路径可以精确匹配 `=`

一个具体的请求 path 过来之后，Nginx 的具体匹配过程可以分为这么几步：

- 检查前缀字符定义的 location，记录最长的匹配项
- 如果找到了精确匹配 `=` 的 location，结束查找，只用该配置
- 按顺序查找正则定义的 location，如果匹配则停止查找
- 如果没有匹配的正则，则使用之前记录的最长匹配 location

那么针对特定的问题：

    location ^~ /resources {
        alias /home/einverne/project/static/;
        # autoindex on;
    }
	location ~ / {
        proxy_pass http://localhost:9000;
    }

首先对于静态文件，我们要让匹配到的第一时间就命中，所以使用了 `^~`


### 关于 location 匹配结尾的斜杠
在 location 后面接的表达式中的 slash 斜杠，可有可无，并没有影响。而对于 URL 中的尾部 `/` 则是，当有 `/` 时表示目录，没有时表示文件。当有 `/` 是服务器会自动去对应目录下找默认文件，而如果没有`/` 则会优先去匹配文件，如果找不到文件才会重定向到目录，查默认文件。

## root 和 alias 的区别
在 Location 或者其他 Nginx 配置中会经常看到 `root` 和 `alias` ，开始我以为这两者是能够混用的，但其实两者有着很大的区别。`root` 指令会将 location 中的部分附加到 root 定义的末尾形成一个完整的路径；而 `alias` 则不会包含 location 中定义的部分。

比如：

    location /static {
        root /var/www/app/static/;
        autoindex off;
    }

那么当 Nginx 寻找路径时会是：

    /var/www/app/static/static/

如果这个在 static 目录的 `static` 目录不存在则显而易见会产生 404 错误。这是因为 location 中的 `static` 部分被附加到了 root 指定的路径后面，因此正确的做法是：

    location /static {
        root /var/www/app/;
        autoindex off;
    }

而对于 `alias` 正确的做法则是：

    location /static {
        alias /var/www/app/static/;
        autoindex off;
    }

## reference

- https://segmentfault.com/a/1190000013267839
- <https://stackoverflow.com/a/10647080/1820217>
