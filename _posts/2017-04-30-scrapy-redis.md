---
layout: post
title: "借助 scrapy-redis 实现 scrapy 分布式爬虫"
tagline: ""
description: ""
category: 学习笔记
tags: [scrapy, scrapy-redis, redis, spider, distributed ]
last_updated:
---

最原始的 Scrapy 项目是只能将爬虫部署到单机上，如果要实现分布式爬虫就需要手动去维护一个待抓取的列表，那么 scrapy-redis 项目就是这样一个存在。

特性：

- 分布式抓取，可以部署多个 spider 实例，共享同一个 redis 队列
- 分布式后处理，抓取的内容会放到一个队列中，这样就意味可以开启足够多的实例来处理结果
- 提供了即插即用的组件，包括定时，去重，等等

## 安装

    pip install scrapy-redis

## 使用
先要在 settings 中配置，具体参考官方文档，代码集成如下：

    from scrapy_redis.spiders import RedisSpider

    class MySpider(RedisSpider):
        name = 'myspider'

        def parse(self, response):
            # do stuff
            pass


## reference

- <https://scrapy-redis.readthedocs.io/en/stable/>
