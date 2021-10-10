---
layout: post
title: "使用 Remark42 替换博客的 Disqus 评论系统"
aliases: 
- 使用 Remark42 替换博客的 Disqus 评论系统
tagline: ""
description: ""
category: 经验总结
tags: [ comment, disqus, isso, python, jekyll, static-website ]
last_updated:
---

前两天用隐身窗口打开自己的博客的时候突然发现 Disqus 评论框上一大片广告，没想到现在 Disqus 已经这样了，并且之前还暴露出过隐私问题。所以就想着什么时候替换掉它。

虽然之前也调研过[静态博客的评论系统](/post/2018/05/blog-comment-system.html)，但说实话那个时候还没有让我有替换掉 Disqus 的动力，毕竟有一些评论系统是基于 GitHub issue 的，也有一些现在来看比 Disqus 存活的时间都要短，连官网都不存在了。

## 问题
整理一下 Disqus 目前让我不舒服的一些地方：

- 在评论框上方插入了大片广告
- 正常留言被错误标记，我去 Disqus 后台看有不少正常的留言都被标记为了垃圾留言，而实际上完全没有问题，并且附加的链接也都是合理的，并且 Disqus 没有任何通知。所以也得对过去留了言没有得到回复的读者说声抱歉。
- Disqus 拖慢网页加载速度，用 [GTmetrix](https://gtmetrix.com/reports/blog.einverne.info/5uKGmDP3/) 跑一下，可以看到一大半是因为 Disqus。

![](/assets/gtmetrix-disqus-js-20211008200015.png)

替换了 Disqus 至少可以提升一下访问速度，访客也不会被广告追踪。

## Disqus 代替品
所以接下来就研究了一下 Disqus 的代替品，我大致把他们分成了一下几个部分：

- 类似于 Disqus 以中心化的云服务方式提供评论服务，并且兼顾用户隐私，所以基本上都按照访问量来收费，最少的也需要 5$ 一个月，这一类的服务有 
    - [Valine](https://valine.js.org/)
    - [talkyard](https://github.com/debiki/talkyard)
- 第二类是以 GitHub issue 作为评论系统的后端，借助 GitHub 开放 API 的能力，使用 issue 来保存博客的评论，这一类评论系统必须要求用户有 GitHub 账户，并且我并不乐意「滥用」GitHub issue 的功能，我认为一个功能就有一个功能设计的目的和意义，GitHub issue 的功能是为项目上报问题或围绕项目展开的讨论而非针对内容本身所以这一类的也就不采用了。这一类的服务有：
    - [utterances](https://utteranc.es/)
    - [gitalk](https://github.com/gitalk/gitalk)
    - [gitment](https://github.com/imsun/gitment)
    - [Vssue](https://vssue.js.org/)
- 另外剩下来的一大类是提供自建的方案，需要自己在云服务，Heroku，或者 VPS 上自建的，需要依赖 PostgreSQL 或 SQLite 这类数据库，这一类的评论系统往往实现了评论接口。
    - [Commento](https://commento.io/) 需要 PostgreSQL 
    - [Remark42](https://remark42.com/)，[[Remark42]] 可以自行搭建，Go 实现，非常简洁轻便，可以嵌在任何需要评论的地方。支持常用的社交账号登录，匿名留言，多级留言。可以从 Disqus 或 WordPress 导入数据，支持邮件，Telegram 等通知。
    - [Isso](https://github.com/posativ/isso)，支持匿名，有简单的管理后台，支持导入 Disqus 评论， Python 实现
- 最后剩下一个比较特殊的，就是 [Staticman](https://staticman.net/) 它将评论系统的评论部分拆成纯文本的数据，提交到静态博客的项目中，当用户发起评论后会自动提交一个 comment，或者发起一个 Pull Request 将内容保存下来。

综合比较下来因为已经排除了第一、二两类，在自建的服务中 Isso 和 Remark42 看着非常轻便，即使自建，使用 Docker 也非常快。并且 Remark42 更加强大一些，所以就选 Remark42 了。

## Remark42 搭建

Remark42 是使用 Go 编写，并且提供了 Docker 部署方式，一个 docker-compose 文件搞定：

```
version: "3"

services:
  remark42:
    image: umputun/remark42:latest
    container_name: "remark42"
    restart: always

    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
    environment:
      - REMARK_URL=${URL}
      - SITE=${SITE}
      - SECRET=${SECRET}
      - STORE_TYPE=bolt
      - STORE_BOLT_PATH=/srv/var/db
      - BACKUP_PATH=/srv/var/backup
      - CACHE_TYPE=mem
      - DEBUG=true
      - AUTH_TELEGRAM=${AUTH_TELEGRAM}
      - TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
      - AUTH_ANON=true
      - ADMIN_PASSWD=${ADMIN_PASSWD}
      - VIRTUAL_HOST=${YOUR_DOMAIN}
      - VIRTUAL_PORT=8080
      - LETSENCRYPT_HOST=${YOUR_DOMAIN}
      - LETSENCRYPT_EMAIL=${YOUR_EMAIL}
    volumes:
      - ${STORAGE_PATH}:/srv/var

networks:
  default:
    external:
      name: nginx-proxy
```

我使用 nginx-proxy 做域名转发，以及 SSL 证书自动生成。

## 导入 Disqus 数据
Disqus 提供导出评论到一个压缩包的工具，可以在 Disqus Admin > Setup > [Export](http://disqus.com/admin/discussions/export/) 找到 [^1]。

    docker exec -it remark42 import -p disqus -f /srv/var/xxxx-2021-10-08T12_57_49.488908-all.xml -s site_id

通过以上命令导入。


[^1]: <https://help.disqus.com/en/articles/1717164-comments-export>

## reference

- <https://darekkay.com/blog/static-site-comments/>