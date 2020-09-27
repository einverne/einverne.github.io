---
layout: post
title: "Function 计算"
tagline: ""
description: ""
category: 学习笔记
tags: [function-compute, serverless, gcp, aws,  ]
last_updated:
---

函数计算，阿里云叫做 Function Compute，Aws 叫做 lambda 函数，GCP 叫做 Cloud Functions，各家都有各家的产品。就如同 AWS 页面介绍的那样，函数计算是一个无服务计算，可以用代码来响应事件并自动管理底层计算资源，比如通过 Amazon Gate API 发送 HTTP 请求，在 S3 桶中修改对象等等。


## Serverless
抽象的 Serverless 很难概括，不过 Serverless 也经常被人叫做 Function as a Server（FaaS)，这就比较好理解了，比如最常见的存储服务，原来的方式是用户租用云服务器，这种方式需要用户自行部署存储服务，磁盘上的数据也不能共享，于是后来发展出来对象存储，文件存储，消息服务等等，这些服务不再有机器的概念，用户可以轻松的扩容和负载均衡，通过平台提供的 API 进行数据的读写，共享。按照实际存储的数量和访问次数付费，这种就是所谓的 Serverless。

FaaS 的特征就是时间驱动，细粒度，弹性收缩，无需管理服务器等底层资源。

拆分微服务有三个考量，组织结构（参考康威定律），运维发布频率（比如将每周发布两次的服务与每两个月发布一次的服务进行拆分）和逻辑调用频度（将高频调用逻辑和低频调用逻辑分开，在 Serverless 架构下能够进一步降低成本）。

Serverless 适用的两大场景

- 应用负载有显著的波峰波谷
- 典型用例 - 基于事件的数据处理

## 函数计算的优势

- 不需要管理服务器等基础设施，开发者只需要关注于逻辑开发
- 事件驱动
- 可以快速扩容
- 按需付费
- 将监控，日志，报警等等繁琐的事务隔离开

## reference

- <https://cloud.google.com/functions/>
- <https://aws.amazon.com/cn/lambda/features/>
- <https://aws.amazon.com/cn/serverless/>
- <https://infoq.cn/article/2017/05/Serverless-Function-calculation>
