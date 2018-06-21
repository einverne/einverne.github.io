---
layout: post
title: "Kafka 资料收集整理"
tagline: ""
description: ""
category: 经验总结
tags: [kafka, message, ]
last_updated:
---

学 Kafka 的时候找到了一些非常友好的资料，这里整理下。

## 教程

不得不说的官方教程，另外我正在翻译官方[教程](https://einverne.gitbooks.io/kafka/content/)

- <https://kafka.apache.org/intro>

cloudurable 这个网站提供了非常详细的 Kafka 教程，从入门 [Kafka 是什么](http://cloudurable.com/blog/what-is-kafka/index.html)，到写 [Java 代码](http://cloudurable.com/blog/kafka-tutorial-kafka-producer/index.html)，到 Kafka 项目各个部分[架构](http://cloudurable.com/blog/kafka-architecture/index.html) 都有着非常详细的介绍。

- <http://cloudurable.com/kafka-training/index.html>

第三个要推荐的就是一本 [Gitbook](https://zqhxuyuan1.gitbooks.io/kafka/content/chapter2-unix.html) ，尤其是第二章使用 Unix 管道类比来解释 Kafka 的工作流，非常的生动。

## 常用 Shell 命令

Kafka 提供了一些命令行工具，用于管理集群的变更。这些工具使用 Java 类实现，Kafka 提供了一些脚本来调用这些 Java 类。不过，它们只提供了一些基本的功能，无怯完成那些复杂的操作 。

### 创建主题
主题名字可以包含字母、数字、下划线以及英文状态下的破折号和句号。

    bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 3 --partitions 3 --topic my-example-topic

主题名字的开头部分包含两个下划线是合法的，但不建议这么做。具有这种格式的主题一般是集群的内部主题（比如 `__consumer_offsets` 主题用于保存消费者群组的偏移量）。也不建议在单个集群里使用英文状态下的句号和下划线来命名，因为主题的名字会被用在度量指标上，句号会被替换成下划线 （比如 `topic.1` 会变成`topic_1` )。

### 描述主题
查看某个 Topic 详情

    bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic my-example-topic

### 列出主题

    bin/kafka-topics.sh --list --zookeeper localhost:2181

### 删除主题

    bin/kafka-topics.sh --zookeeper localhost:2181 --delete --topic my-example-topic

### 增加分区

    bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic my-example-topic --partitions 16

Kafka 目前是暂时不支持减少主题分区数量的。

无顺序，一行一个

### 修改分区

    bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic my_topic_name  --partitions 40

Partition 个数只能增加，不能减少。对于采用默认 Partitioner 的 Producer，Message 是按照 Key 的哈希值“规律”分布的（hash(key) % number_of_partitions），如果增加 Partition 个数，会打破现有分布规律。如果业务依赖于此哈希分布，请谨慎操作。

### 增加或修改 Config

    bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic my_topic_name --config x=y

可配置的 config 可以参考[官网](http://kafka.apache.org/documentation.html#topic-config)

### 删除 Config

    bin/kafka-topics.sh --zookeeper localhost:2181 --alter --topic my_topic_name --deleteConfig x


### 启动生产者发送消息

    bin/kafka-console-producer.sh --broker-list localhost:9092 --topic my-example-topic

### 启动消费者接受消息

    bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginning

指定 from-beginning 则从“最老”（最早、最开始）的数据开始读；否则从“最新”的数据开始读（启动后等待新数据的写入并读取）。

## Kafka 管理

yahoo 开源了一个 kafka-manager [GitHub](https://github.com/yahoo/kafka-manager)


