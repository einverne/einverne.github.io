---
layout: post
title: "每天学习一个命令：wrk 单机性能测试工具"
aliases:
- "每天学习一个命令：wrk 单机性能测试工具"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [wrk, jmeter, load-testing, benchmark, vps-benchmark, benchmark-testing, ]
create_time: 2024-10-05 11:06:04
last_updated: 2024-10-05 11:06:04
dg-home: false
dg-publish: false
---

[wrk](https://github.com/wg/wrk) 是一个使用 C 编写的 HTTP 压力测试工具，性能基准测试工具。可以在单机多核 CPU 的条件下，充分利用系统的高性能 IO，epoll，kqueue 等，通过多线程和事件，对目标机产生大量的负载。

wrk 采用了和 Redis 一样的 ae 异步事件驱动框架。

## 优势

- 轻量
- 安装简单
- 使用手册简单
- 自带高性能 IO，通过很少线程即可产生很大的并发量

## 缺点

目前只支持单机压测，设计的目的不是为了代替专业的 [[Apache JMeter]] 以及 [[LoadRunner]] 等测试工具。

wrk 比较适合于后端对接口的性能测试。

wrk 只能被安装在类 Unix 系统上。Windows 则需要开启 Ubuntu 子系统。

## 安装

macOS

```
brew install wrk
wrk -v
```

## 使用

```
wrk -t12 -c400 -d30s http://127.0.0.1:8080/index.html
```

这一行命令会使用 12 线程，测试 30 秒，并且保持 400 HTTP 连接。

更多命令选项

```
Usage: wrk <options> <url>
  Options:
    -c, --connections <N>  Connections to keep open
    -d, --duration    <T>  Duration of test
    -t, --threads     <N>  Number of threads to use

    -s, --script      <S>  Load Lua script file
    -H, --header      <H>  Add header to request
        --latency          Print latency statistics
        --timeout     <T>  Socket/request timeout
    -v, --version          Print version details

  Numeric arguments may include a SI unit (1k, 1M, 1G)
  Time arguments may include a time unit (2s, 2m, 2h)
```

可以通过 Lua 脚本的方式来产生 POST，PUT 等请求。
