---
layout: post
title: "每天学习一个命令：用 ab 命令来进行 HTTP 服务压测"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, ab, apache, command , ]
last_updated:
---

ab 是针对 HTTP 服务进行性能压力测试的工具，它最初被设计用来测量 Apache 服务器的性能指标，主要用来测试 Apache 服务器每秒能够处理多少请求以及响应时间，但这个命令也可以用来测试通用的 HTTP 服务器性能，比如 Nginx，tomcat，resin 等等。

## 几个概念

### 吞吐量 Requests per second
吞吐量是系统每秒钟处理的请求数量，可以通过 总请求数量 / 请求花费时间 来计算。

### 服务器平均请求等待时间
服务器平均请求等待时间指的是服务器平均处理一个请求花费的时间，公式是 总花费时间 / 请求数量，这个指标是吞吐量的倒数。（Time per request）

### 并发连接数
指的是某一时刻服务器同时接受的连接数。

## 安装使用

### 安装

    sudo apt install apache2-utils

### 使用

    ab -c 10 -n 10000 -k -H "Accept-Encoding: gzip, deflate" http://localhost:8080/

解释

- `-c concurrency` 并发数
- `-n requests` 一次测试的请求数量
- `-k` 表示 keep alive，保持连接
- `-H headers` 自定义 Header

举例


    ab -k -c 10 -n 100 https://www.einverne.info/
    This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/

    Benchmarking www.einverne.info (be patient).....done


    Server Software:        nginx
    Server Hostname:        www.einverne.info
    Server Port:            443
    SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES128-GCM-SHA256,2048,128

    Document Path:          /
    Document Length:        53802 bytes

    Concurrency Level:      10
    Time taken for tests:   1.125 seconds
    Complete requests:      100
    Failed requests:        0
    Keep-Alive requests:    0
    Total transferred:      5400681 bytes
    HTML transferred:       5380200 bytes
    Requests per second:    88.91 [#/sec] (mean)
    Time per request:       112.470 [ms] (mean)
    Time per request:       11.247 [ms] (mean, across all concurrent requests)
    Transfer rate:          4689.35 [Kbytes/sec] received

    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        5   48  35.3     44     163
    Processing:     9   62  65.7     47     559
    Waiting:        7   59  64.7     45     543
    Total:         25  109  75.4     83     564

    Percentage of the requests served within a certain time (ms)
      50%     83
      66%    111
      75%    123
      80%    128
      90%    225
      95%    275
      98%    337
      99%    564
     100%    564 (longest request)

## 实际使用

### 登录问题
对于实际场景中经常需要用的登录问题，如果接口需要验证 Cookie ，那么使用 `-C` 写到 Cookie 内容

    ab －n 100 －C key＝value http://localhost

或者使用 `-H` 带 `Cookie` 自定义多个字段

    ab -n 100 -H "Cookie: Key1=Value1; Key2=Value2" http://localhost

## 总结
ab 只能测试简单的 RESTful 接口，只能应付简单的压测任务。如果需要更加专业的压测工具可以使用 jmeter。

## reference

- <http://httpd.apache.org/docs/current/programs/ab.html>
