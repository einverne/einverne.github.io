---
layout: post
title: "Scrapy 学习笔记及简单使用"
aliases: "Scrapy 学习笔记及简单使用"
tagline: ""
description: ""
category: 学习笔记
tags: [scrapy, python, crawler, spider, 学习笔记 ]
last_updated:
---

Scrapy 是纯 Python 实现的爬虫框架（scraping and crawling framework），可以非常轻松地提取网页结构信息。最初设计时 Scrapy 仅仅作为网页抓取工具，但因其功能强大，配置简单，逐渐的被扩大使用范围，也经常被用于以下方面：

- 数据挖掘 Data Mining
- 信息处理 information processing
- 历史信息存储 historical archival
- 检测及自动化测试 monitoring and automated testing

因为网上的教程已经非常详细了，这里就重点记录解决的几个问题。

- Scrapy 的官网地址：http://scrapy.org
- Scrapy 在 Github 上的项目地址：https://github.com/scrapy/scrapy.git
- Scrapy 的官方文档地址：http://doc.scrapy.org/

## 搭建环境

### 安装 python 2.7

一般 Ubuntu/Linux Mint 都会预装，查看一下即可

    python -V
    Python 2.7.12

如果没有安装 Python，可以使用之前推荐的 [pyenv](/post/2017/04/pyenv.html) 来安装。下面的步骤也同样可以放到 pyenv 中执行。

### 安装 virtualenv

在开发目录中虚拟化 python 环境，避免和系统依赖冲突

    sudo pip install virtualenv
    source ./bin/active # 开启
    # 此后再使用 pip install 时会安装在独立的目录下

具体用法可参考[官网](https://virtualenv.readthedocs.io/en/latest/userguide/ )


### 安装依赖

    sudo apt-get install libxml2-dev libxslt1-dev python-dev
    pip install scrapy

## 项目结构
安装完成之后使用如下命令生成初始项目

	scrapy startproject demo

初始目录结构如下：

    $ tree demo
    demo
    ├── demo
    │   ├── __init__.py
    │   ├── items.py
    │   ├── middlewares.py
    │   ├── pipelines.py
    │   ├── settings.py
    │   └── spiders
    │       └── __init__.py
    └── scrapy.cfg

    2 directories, 7 files

文件说明：

- scrapy.cfg 项目的配置信息，主要为 Scrapy 命令行工具提供一个基础的配置信息。（爬虫相关的配置信息在 settings.py 文件中）
- items.py 设置数据存储模板，用于结构化数据
- middlewares 中间件，全局处理请求
- pipelines 数据处理行为，如：一般结构化的数据持久化，存储数据库等操作
- settings.py 爬虫的配置文件，如：递归的层数、并发数，延迟下载等
- spiders 爬虫目录，如：创建文件，编写爬虫规则

进入目录

	cd demo
    scrapy genspider example example.com   # 使用该命令安装模板生成 Spider

更详细的入门见官网：<https://doc.scrapy.org/en/latest/intro/tutorial.html>

## 架构

Scrapy 使用了 Twisted 异步网络库来处理网络，可以对网站页面进行大量非阻塞的异步请求，能够对目标网站按照网站结构的层级次序逐级向下采集，并可以在已采集到的页面中提取其他符合要求的目标网页地址资源，从而实现从单个或多个入口进入，对目标网站进行全面扫描并获取所需的数据。结构如下：

Scrapy 的核心组件：

- Scrapy Engine
- Scheduler
- Downloader
- Spider
- Pipeline
- Item
- Middlewares
    - Downloader Middlewares
    - Spider Middlewares
    - Scheduler Middlewares

### 引擎（Scrapy Engine）
用来处理整个系统的数据流，触发事务（框架核心），负责控制和调度各个组件

### 调度器（Scheduler）
接受 Engine 发过来的请求，压入队列中，并在引擎再次请求的时候返回，如：要抓取的链接（URL）的优先队列，由它来决定下一个要抓取的 URL 是什么，并进行去重。

### 下载器（Downloader）
下载器负责对目标页面发出请求并获取页面反馈的数据，之后传递给 Scrapy 引擎，最终传递给爬虫进行数据提取。

### 爬虫（Spider）
爬虫是 Scrapy 的用户自行编写的一段数据提取程序，针对下载器返回的数据结构进行分析（一般为 HTML），并提取出其中的结构化数据，并可以指定其他需要跟进的 URL 和处理方法。每个爬虫负责处理一个或多个特定的网站。

### 项目管道（Pipline）
负责处理爬虫从网页中抽取的实体，主要的功能是持久化实体（Item）、验证实体的有效性、清除垃圾信息。当页面被爬虫解析后，解析后内容将会发送到项目管理通道，经过几个特定的次序处理。

### 数据 (Item)
Item 是爬虫针对网页数据做解析后返回的数据，需要在使用之前预先定义好 Item 的数据结构，爬虫的解析程序负责将提取到的数据填充到 Item 中，并将 Item 返回，传递给数据管道进行后续处理。

### 下载器中间件（Downloader Middlewares）
位于 Scrapy 引擎和下载器之间的框架，主要是处理 Scrapy 引擎和下载器之间的请求与响应。

### 爬虫中间件（Spider Middlewares）
介于 Scrapy 引擎和 Spider 之间的框架，处理爬虫的响应输入和请求输出。

### 调度中间件（Scheduler Middlewares）
介于 Scrapy 引擎和调度之间的中间件，从 Scrapy 引擎发送到调度的请求和响应。

图解见官网：<https://doc.scrapy.org/en/latest/topics/architecture.html>

## 使用 ImagesPipeline 下载图片
在 scrapy 中有实现的 ImagesPipeline ， 默认即可下载大量的图片，如果想要实现自己的下载图片 Pipeline，并且自定义输出图片的文件的名字，可以重写 `file_path()` 方法。

    import scrapy
    from scrapy.pipelines.images import ImagesPipeline

    class ImagePipeline(ImagesPipeline):
        default_headers = {
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
        }

        # 对各个图片 URL 返回一个 Request
        def get_media_requests(self, item, info):
            try:
                for image_url in item['image_urls']:
                    f = image_url.split('.')[-1]
                    yield scrapy.Request(image_url, meta={'image_name': item['image_name'], 'format': f}, headers=self.default_headers)
            except Exception as error:
                print error

        # 当一个单独项目中的所有图片请求完成时 (success, image_info_or_failure)
        def item_completed(self, results, item, info):
            image_paths = [x['path'] for ok, x in results if ok]
            if not image_paths:
                # raise DropItem("Item contains no images")
                print "Image path no exist"
            return item


        # Override the convert_image method to disable image conversion

        # scrapy convert image to jpg 重写此方法，可以下载自定的图片格式，不过可能需要特殊处理格式
        # def convert_image(self, image, size=None):
        #     buf = StringIO()
        #     try:
        #         image.save(buf, image.format)
        #     except Exception, ex:
        #         raise ImageException("Cannot process image. Error: %s" % ex)
        #
        #     return image, buf

        # 默认情况下，使用 ImagePipeline 组件下载图片的时候，图片名称是以图片 URL 的 SHA1 值进行保存的。
        # scrapy 0.12 可以覆盖 image_key 方法，在此后版本中 使用 file_path 来自定义下载图片名称
        # def image_key(self, url):
        #     image_guid = hashlib.sha1(url).hexdigest()
        #     return 'full/%s.jpg' % (image_guid)

        # http://stackoverflow.com/questions/6194041/scrapy-image-download-how-to-use-custom-filename/22263951#22263951
        def file_path(self, request, response=None, info=None):
            name = request.meta['image_name']
            f = request.meta['format']
            return 'full/%s.jpg' % name


## 定义 middlewares
middlewares 是 Scrapy 在请求时中间必须经过的步骤，在 settings 中有设置 `DOWNLOADER_MIDDLEWARES` 。

```
import random

from scrapy.downloadermiddlewares.useragent import UserAgentMiddleware

from scrapy.conf import settings


class RandomUserAgentMiddleware(UserAgentMiddleware):

    def __init__(self, user_agent=''):
        self.user_agent = user_agent

    # 每一请求都会走这个函数，在这里随机挑选 UA
    def process_request(self, request, spider):
        ua = random.choice(settings.get('USER_AGENT_LIST'))
        if ua:
            print "******Current UserAgent: %s **************" % ua

            request.headers.setdefault("User-Agent", ua)


class ProxyMiddleware(object):
    def process_request(self, request, spider):
        request.meta['proxy'] = random.choice(settings.get('HTTP_PROXY_LIST'))
```

## 多 pipeline 协同处理
Item 在 Spider 中构造之后会被传送到 Pipeline 中，按照一定的顺序执行。一般情况下 pipeline 会做一些数据处理或存储的事情，一般写数据库操作都放到 Pipeline 中。

当一个 Item 要被多个 pipeline 处理时，需要定义：

    ITEM_PIPELINES = {
        'imdb.pipelines.MoviePipeline': 300,
        'imdb.image_pipeline.ImagePipeline': 300
    }

此时，Item 就会被两个 pipeline 处理，如果某个 pipeline 处理某一类事件，比如上述例子中， MoviePipeline 处理数据的存储，而 ImagePipeline 处理图片的下载。

