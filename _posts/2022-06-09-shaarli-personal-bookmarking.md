---
layout: post
title: "利用 Shaarli 搭建个人的在线书签管理"
aliases:
- "利用 Shaarli 搭建个人的在线书签管理"
tagline: ""
description: ""
category: 学习笔记
tags: [ shaarli, docker, bookmarking, selfhosted  ]
create_time: 2022-07-09 13:57:14
last_updated: 2022-07-09 04:39:25
---

Shaarli 是一个使用 PHP 编写的，开源的，可自行搭建的书签服务，无需数据库依赖。在很早几年曾经出现过一款叫做 Delicious 的在线书签收藏和分享的网站，但今天一查也早已经在 7 年前关闭了。这些年兜兜转转发现还是当只有自己掌握了软件、数据才是最安全的，不管是本地的应用还是在线的服务，越来越觉得 [[Richard Stallman]] 所提及的自由软件之珍贵。

这篇文章就简单的介绍一下 Shaarli 搭建的过程。

## Installation
使用 Docker 安装

```
version: '3.3'

services:
  shaarli:
    image: shaarli/shaarli:latest
    container_name: shaarli
    restart: always
    ports:
      - '${PORT}:80'
    volumes:
      - '${SHAARLI_DATA}:/var/www/shaarli/data'
      - '${SHAARLI_CACHE}:/var/www/shaarli/cache'
```

后续的更新维护在 [dockerfile](https://github.com/einverne/dockerfile) 。

安装完成之后，因为我使用外部的文件夹挂载，可能存在问题，使用 `docker-compose logs -f` 查看日志，发现错误：

```
shaarli  | 2022/07/09 08:00:46 [error] 10#10: *1 FastCGI sent in stderr: "PHP message: PHP Fatal error:  Uncaught RuntimeException: The file could not be opened. Check permissions. in /var/www/shaarli/vendor/katzgrau/klogger/src/Logger.php:134
shaarli  | Stack trace:
shaarli  | #0 /var/www/shaarli/index.php(59): Katzgrau\KLogger\Logger->__construct()
shaarli  | #1 {main}
shaarli  |   thrown in /var/www/shaarli/vendor/katzgrau/klogger/src/Logger.php on line 134" while reading response header from upstream, client: 11.22.33.44, server: , request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/var/run/php-fpm.sock:", host: ":8080"
shaarli  | 11.22.33.44 - - [09/Jul/2022:08:00:46 +0000] "GET / HTTP/1.1" 500 5 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36"
````

需要调整文件夹的权限。[^1]

```
docker exec -it shaarli chown -R nginx: nginx /var/www/shaarli/data
docker exec -it shaarli chown -R nginx: nginx /var/www/shaarli/cache
```

[^1]: <https://github.com/shaarli/Shaarli/issues/1031#issuecomment-348713433>

或者改写，直接使用 Docker volumes，避免权限的问题。

## 和 Nginx Proxy Manager 一起使用
假设已经使用了 [Nginx Proxy Manager 反向代理](/post/2022/02/nginx-proxy-manager.html)了，那么在 Nginx Proxy Manager 中创建一个 Host，然后填入

![nginx proxy manager shaarli](https://img.gtk.pw/i/2022/07/09/62c93ea0e650f.png)

## 浏览器书签栏按钮
将下面的 `shaarli.your_domain.com` 替换为自己的域名：

```
javascript:(          function()%7B            var url %3D location.href%3B            var title %3D document.title %7C%7C url%3B            var desc%3Ddocument.getSelection().toString()%3B            if(desc.length>4000)%7B              desc%3Ddesc.substr(0,4000)%2B%27...%27%3B              alert(%27 所选文本太长，将会被截断。%27)%3B            %7D            window.open(              %27https:///shaarli.your_domain.com/admin/shaare%3Fpost%3D%27%2B encodeURIComponent(url)%2B              %27%26title%3D%27%2B encodeURIComponent(title)%2B              %27%26description%3D%27%2B encodeURIComponent(desc)%2B              %27%26source%3Dbookmarklet%27,%27_blank%27,%27menubar%3Dno,height%3D800,width%3D600,toolbar%3Dno,scrollbars%3Dyes,status%3Dno,dialog%3D1%27            )%3B          %7D        )()%3B
```

然后就可以在浏览器中点击这个书签栏上的按钮一键添加当前 URL 到 Shaarli。

## related

- [[Wallabag]]
- [[onenav]]
- [[Shiori]]
