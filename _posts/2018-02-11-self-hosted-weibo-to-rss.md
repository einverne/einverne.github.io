---
layout: post
title: "搭建自己的 Weibo 转 RSS 服务"
tagline: ""
description: ""
category: 经验总结
tags: [linux, docker, weibo, rss, inoreader,]
last_updated:
---

认识我的人都是知道我一直使用 RSS 订阅信息，但是互联网越来越闭塞的现在，每一家公司都在自建后花园，把所有的信息封闭在内部，几乎现在没有任何内容型平台提供 RSS 输出了，所以也才有了这篇文章。以前我使用的微博转 RSS 的服务大都已经挂掉，唯一一家微博档案最近也似乎有些危险。不过幸好查到下面两个项目，让微博定义 RSS 不在困难。

- https://github.com/DIYgod/Weibo2RSS
- https://github.com/zgq354/weibo-rss

我使用了第二个项目，安装过程可以参考下文，都是使用 nodejs 实现，如果手动安装需要手动配置一下环境。

## 使用 Docker 安装
安装 Docker 的文章可以查看之前的[文章](/post/2017/07/docker-introduction.html)

    git clone https://github.com/zgq354/weibo-rss.git
    cd weibo-rss
    docker build -t <tag> .
    docker run -p 3000:3000 -d --name weibo-rss --restart=always <tag>

默认程序会监听服务器的 3000 端口，可以通过 Nginx 的 proxy_pass 指令配置请求转发。

## reference

- <https://blog.liuwm.work/posts/6a3c/>


