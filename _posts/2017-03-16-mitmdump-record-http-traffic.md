---
layout: post
title: "使用 mitmdump 记录 HTTP 流量"
tagline: ""
description: ""
category: 学习笔记
tags: [mitmproxy, mitmdump, mitmweb, mitm, charles, ]
last_updated:
---

之前一篇[文章](/post/2017/02/mitmproxy.html) 主要是使用 mitmproxy 进行抓包，但是其实 mitmproxy 自带的 feature 远远不止于抓包，使用 mitmdump 可以自定义脚本来修改 response 返回，或者将请求结果 dump 到本地以便于之后的分析。

之前的那篇文章在 mitmdump 的时候只是简单的介绍了一下功能，并没有展开，所以有了这篇文章。**mitmdump** 可以理解为 mitmproxy 的命令行版本，他提供了 tcpdump 类似的功能来查看，记录，甚至编程改写 HTTP 流量。

## 保存流量
开启代理模式，并将所有的请求写入文件

    mitmdump -w outfile

## 过滤保存的流量
`-n` 参数表示不开启代理， `-r` 表示读入 infile，然后将将所有 match `~m post` POST 流量写入 outfile 文件中。

    mitmdump -nr infile -w outfile "~m post"

关于过滤的规则，可以具体参考[这里](https://docs.mitmproxy.org/stable/concepts-filters/)

## 客户端重放请求
使用 `-n` 参数不开启代理，然后 `-c filename` 参数进行重放。

    mitmdump -nc outfile

甚至是可以重放请求，然后将结果保存到另外的文件中

    mitmdump -nc srcfile -w dstfile

## 添加脚本
可以在启动 mitmdump 时添加自定义的脚本用来改写请求。

    mitmdump -s examples/add_header.py

如果脚本文件带有参数，则需要在 `-s` 参数后面增加双引号，比如 `mitmdump -s "add_header.py custom_header"`

## 组合使用
将这些参数组合一起使用

    mitmdump -ns examples/add_header.py -r srcfile -w dstfile

从 srcfile 文件中加载流量，然后使用特定的脚本改写，然后将结果写入 dstfile 文件中。

## 实例

### 将请求结果保存到本地文件

```python
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import os
import sys

from mitmproxy import flowfilter, http, ctx


# events run ordr: start, request, responseheaders, response, error, done

class Filter:
    MOVIE_TOP250 = '/api/v2/subject_collection/movie_top250/items'

    def __init__(self, path):
        self.folder_path = path
        # 构造一个 HTTP response code
        self.http_code_ok = flowfilter.parse('~c 200')
        if not os.path.exists(self.folder_path):
            os.makedirs(self.folder_path)
        # 构造一个 URL 过滤器
        self.douban_path = flowfilter.parse(
            '~u frodo.douban.com/api/v2/subject_collection/movie_top250/items')

    # @concurrent  # Remove this and see what happens
    def request(self, flow: http.HTTPFlow):
        if flowfilter.match(self.douban_path, flow):
            if flow.request.host:
                ctx.log(
                    "handle request: %s%s" % (
                        flow.request.host, flow.request.path))

    def response(self, flow: http.HTTPFlow):
        if flowfilter.match(self.http_code_ok, flow):
            """只有 200 状态进入"""
            ctx.log('code %s' % flow.response.status_code)
            if flowfilter.match(self.MOVIE_TOP250, flow):
                if flow.response.content:
                    pretty_path = str(flow.request.path.rstrip())
                    pretty_path = pretty_path.replace('/', '_') \
                        .replace(':', '_') \
                        .replace('&', '_')
                    pretty_path = pretty_path[:250] + '.json'
                    res_content = flow.response.content.decode('utf-8')
                    path = os.path.join(self.folder_path, pretty_path)
                    with open(path, 'w+') as f:
                        f.write(res_content)


def start():
    if len(sys.argv) != 2:
        raise ValueError('Usage: -s "save_response.py path"')
    # 保存结果的 folder 路径
    return Filter(sys.argv[1])
```

将上面的脚本执行

    /usr/local/bin/mitmdump -s "save_response.py /tmp/response_result/"

然后在结果路径中就能得到请求的豆瓣 Top250 电影结果，然后再对电影结果进行解析即可。

或者可以将请求的 webp 或者 jpg 的图全都保存到另外的文件夹中

    pretty_url = flow.request.pretty_url
    if pretty_url.endswith(".webp") or pretty_url.endswith('.jpg'):
        # ctx.log('pretty url %s' % flow.request.pretty_url)
        filename = os.path.join(self.folder_path,
                                os.path.basename(pretty_url))
        with open(filename, 'wb') as f:
            f.write(flow.response.content)

然后只要浏览过的图片就全都保存在本地的文件夹中了。

### 按规则过滤请求
mitm 的过滤都是依靠 flowfilter.py 来实现的，可以匹配的规则有如下

```
    The following operators are understood:

        ~q          Request
        ~s          Response

    Headers:

        Patterns are matched against "name: value" strings. Field names are
        all-lowercase.

        ~a          Asset content-type in response. Asset content types are:
                        text/javascript
                        application/x-javascript
                        application/javascript
                        text/css
                        image/*
                        application/x-shockwave-flash
        ~h rex      Header line in either request or response
        ~hq rex     Header in request
        ~hs rex     Header in response

        ~b rex      Expression in the body of either request or response
        ~bq rex     Expression in the body of request
        ~bs rex     Expression in the body of response
        ~t rex      Shortcut for content-type header.

        ~d rex      Request domain
        ~m rex      Method
        ~u rex      URL
        ~c CODE     Response code.
        rex         Equivalent to ~u rex
```

从这些匹配规则就能看出来过滤规则可以非常精细，比如过滤结果为 500 的请求，比如过滤 header 中 content-type 为某种类型的请求，比如按照正则去匹配 URL 等等。

```
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import sys

from mitmproxy import flowfilter, http, ctx


# events run ordr: start, request, responseheaders, response, error, done

class Filter:
    MOVIE_TOP250 = '/api/v2/subject_collection/movie_top250/items'

    def __init__(self):
        # 构造一个 URL 过滤器
        self.douban_path = flowfilter.parse(
            '~u frodo.douban.com/api/v2/elendil/home_timeline')
        # 构造一个 HTTP response code
        self.http_code_ok = flowfilter.parse('~c 200')
        # Domain
        self.my_domain = flowfilter.parse('~d douban.com')
        # Method
        self.filter_mathod = flowfilter.parse('~m POST')
        # content-type header
        self.filter_content_type = flowfilter.parse('~t json')

    # @concurrent  # Remove this and see what happens
    def request(self, flow: http.HTTPFlow):
        if flowfilter.match(self.douban_path, flow):
            if flow.request.host:
                ctx.log(
                    "handle request: %s%s" % (
                        flow.request.host, flow.request.path))

    def response(self, flow: http.HTTPFlow):
        if flowfilter.match(self.http_code_ok, flow):
            """只有 200 状态进入"""
            ctx.log('code %s' % (flow.response.status_code))
        if flowfilter.match(self.my_domain, flow):
            """只有匹配域名"""
            ctx.log('domain %s' % flow.response.text)
        if flowfilter.match(self.douban_path, flow):
            """只有 特定 url 可以进入"""
            ctx.log('douban text' + flow.response.text)
            ctx.log('douban reason ' + flow.response.reason)
            ctx.log('douban http version ' + flow.response.http_version)
        pretty_url = flow.request.pretty_url
        if flowfilter.match(self.MOVIE_TOP250, flow):
            if flow.response.content:
                res_content = flow.response.content.decode('utf-8')
                ctx.log("content: " + res_content)


def start():
    if len(sys.argv) != 2:
        raise ValueError('Usage: -s "dump.py"')
    return Filter()

```


## reference

- <https://docs.mitmproxy.org/stable/tools-mitmdump/>
- 将请求保存到 Mongo <https://discourse.mitmproxy.org/t/har-mongo-dump-script/901>
