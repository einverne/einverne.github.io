---
layout: post
title: "Open Falcon 使用和介绍"
aliases: "Open Falcon 使用和介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [monitor, log, open-falcon, warning]
last_updated:
---

OpenFalcon 是一款企业级、高可用、可扩展的开源监控解决方案，提供实时报警、数据监控等功能，由小米公司开源。使用 Falcon 可以非常容易的监控整个服务器的状态，比如磁盘空间，端口存活，网络流量等等。

最近有些监控需求所以看了一下其中涉及到概念。

## 一些基础概念 {#concept}
Open-Falcon，采用和 OpenTSDB 相似的数据格式：metric、endpoint 加多组 key value 的 tags，举两个例子：

    {
        metric: load.1min,
        endpoint: open-falcon-host,
        tags: srv=falcon,idc=aws-sgp,group=az1,
        value: 1.5,
        timestamp: `date +%s`,
        counterType: GAUGE,
        step: 60
    }
    {
        metric: net.port.listen,
        endpoint: open-falcon-host,
        tags: port=3306,
        value: 1,
        timestamp: `date +%s`,
        counterType: GAUGE,
        step: 60
    }

下面是一段 Python 上报数据的代码，其中涉及到的参数都是必须传的。

```
#!-*- coding:utf8 -*-

import requests
import time
import json

ts = int(time.time())
payload = [
    {
        "endpoint": "test-endpoint",
        "metric": "test-metric",
        "timestamp": ts,
        "step": 60,
        "value": 1,
        "counterType": "GAUGE",
        "tags": "idc=lg,loc=beijing",
    },

    {
        "endpoint": "test-endpoint",
        "metric": "test-metric2",
        "timestamp": ts,
        "step": 60,
        "value": 2,
        "counterType": "GAUGE",
        "tags": "idc=lg,loc=beijing",
    },
]

r = requests.post("http://127.0.0.1:1988/v1/push", data=json.dumps(payload))

print r.text
```

说明：

- `metric`: 最核心的字段，监控指标名称（监控项），代表这个采集项具体度量的是什么，比如是 `cpu_idle` 呢，还是 `memory_free`, 还是 `qps`
- `endpoint`: 标明 metric 的主体（属主），比如 metric 是 cpu_idle，那么 endpoint 就表示这是哪台机器的 cpu_idle，一般使用机器的 hostname
- `timestamp`: 表示上报该数据时的 unix 时间戳，注意是整数，代表的是秒
- `value`: 代表该 metric 在当前时间点的值，float64
- `step`: 表示该数据采集项的上报周期，这对于后续的配置监控策略很重要，必须明确指定。
- `counterType`: 是 Open Falcon 定义的数据类型，取值只能是`COUNTER`或者`GAUGE`二选一，前者表示该数据采集项为计时器类型（累加值），后者表示其为原值 （注意大小写，这个值是一个波动的值）

        - GAUGE：即用户上传什么样的值，就原封不动的存储
        - COUNTER：指标在存储和展现的时候，会被计算为 speed，即（当前值 - 上次值）/ 时间间隔

- `tags`: 监控数据的属性标签，一组逗号分割的键值对，对 metric 进一步描述和细化，可以是空字符串。比如 idc=lg，比如 service=xbox 等，多个 tag 之间用逗号分割

说明：这 7 个字段都是必须指定


### Metric
Metric 监控指标，时序数据。

包括不同类型：

- counter 数值单调递增
- guage 数值每次更新

### endpoint
endpoint 通常来指服务器节点。


## Falcon 的接口概念
在 Falcon 中有这样几个不同的接口

### Meter
Meter 用来累加，可以输出累加和，变化率。

### Gauge
Gauge 用来记录瞬时值，支持 int 64, float 64 类型

### Histogram
Histogram 用来计算统计分布，输出最小值，最大值，平均值，75,95,99 百分比等等。

## 如何在上报中断时报警
最近遇到的需求就是如果一段时间内，OpenFalcon 没有收集到数据，也就是 agent 没有采集到数据，程序挂了，或者没有执行，那么就报警。在最开始的时候查看了一下 OpenFalcon 报警函数

    all(#3): 最新的 3 个点都满足阈值条件则报警
    max(#3): 对于最新的 3 个点，其最大值满足阈值条件则报警
    min(#3): 对于最新的 3 个点，其最小值满足阈值条件则报警
    sum(#3): 对于最新的 3 个点，其和满足阈值条件则报警
    avg(#3): 对于最新的 3 个点，其平均值满足阈值条件则报警
    diff(#3): 拿最新 push 上来的点（被减数），与历史最新的 3 个点（3 个减数）相减，得到 3 个差，只要有一个差满足阈值条件则报警
    pdiff(#3): 拿最新 push 上来的点，与历史最新的 3 个点相减，得到 3 个差，再将 3 个差值分别除以减数，得到 3 个商值，只要有一个商值满足阈值则报警
    lookup(#2,3): 最新的 3 个点中有 2 个满足条件则报警

这一下子就懵了，报警触发的条件都是根据最近上报的几个点的阈值来触发的，而我的需求可能是一段时间内根本没有上报数据。

然后仔细查看文档之后，发现 OpenFalcon 有一个 Nodata 配置，Nodata 的配置正好解决了上面的需求，当机器一段时间内中断上报时，Nodata 配置会上报一个指定的值，然后报警函数就能够根据 Nodata 上报的值来报警。

Nodata 的配置在 OpenFalcon 的后台，在 Nodata 页面添加 Nodata ，填写

- `name` nodata 的名字，标示什么中断了
- `endpoint` 选择 Endpoint ，机器列表，一行一个
- `metric` 指定 metric
- `tags` 指定 tags
- `type` 暂时只支持 GAUGE
- `周期` 秒，与原始监控指标一致
- `上报中断时补发值`

当自定义上报中断的时候 Nodata 就会补发，通过补发的值，比如正常的取值是 `>0` 的正数值，那么补发的值可以写上　`-1` ，然后通过最近连续的三个　`-1` 来触发报警。

## Histograms
在服务端接收到打点数据时，在报表中会有一些内置的指标，比如说 75-percentile, 95-percentile, 99-percentile, 999-percentile，CPS-1-min, CPS-5-min, CPS-15-min 等等指标。

对于 percentile 的指标，含义如下：

- 所有采样数据中，处于 75% 处的数值
- 所有采样数据中，处于 95% 处的数值
- 所有采样数据中，处于 99% 处的数值

对于这些指标，还有 min, max, mean 这些指标，这些都比较简单不再赘述。

而另外一种， falcon 中叫做 Meter, 有两种

- sum 是事件发生的总数
- rate 是 Falcon 上报周期（60s） 内，事件发生的频率，单位 CPS

## 项目的起源
最近看了一篇[文章](http://www.cnblogs.com/leoncfor/p/4936713.html) 介绍了 Open Falcon 项目的起由，这里面提到了 Open Falcon 为了解决 zabbix 的一些问题而被提出

- 性能瓶颈，数据量大，zabbix 使用的 MySQL 写入瓶颈
- 多套 zabbix 管理成本高
- 监控系统不统一


## reference

- <http://book.open-falcon.org/zh_0_2/>
- <http://open-falcon.org/>
