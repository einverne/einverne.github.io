---
layout: post
title: "Kafka 基础知识笔记"
aliases: "Kafka 基础知识笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [Kafka, linkedin, message, broker, ]
last_updated:
---

Kakfa 起初是由 LinkedIn 公司开发的一个分布式的消息系统，后成为 Apache 的一部分，它使用 Scala 编写，以可水平扩展和高吞吐率而被广泛使用。目前越来越多的开源分布式处理系统如 Cloudera、Apache Storm、Spark 等都支持与 Kafka 集成。

## 体系架构
生产者使用 push 向 broker 发送消息，消费者使用 pull 模式拉取并消费消息

- producer 可能是服务器日志，业务数据
- broker 消息中间件节点，支持水平扩展，一般 broker 数量越多，集群吞吐率越高
- consumer
- zookeeper 集群， Kafka 依赖 zookeeper 管理

## 存储策略
Kafka 中消息是以 topic 进行分类的，生产者通过 topic 向 Kafka broker 发送消息，消费者通过 topic 读取数据。topic 在物理层面以 partition 为分组，partition 还可以细分为 segment。

假设 Kafka 消息文件存储目录

    log.dirs=/tmp/Kafka-logs

假设 partition 数量为 4

    /bin/Kafka-topics.sh –create –zookeeper localhost:2181 –partitions 4 –topic mytopic –replication-factor 4

然后就能在 `/tmp/Kafka-logs` 目录中看到 4 个目录。

在 Kafka 文件存储中，同一个 topic 下有多个不同的 partition，每个 partiton 为一个目录，partition 的名称规则为：topic 名称 + 有序序号，第一个序号从 0 开始计，partition 是实际物理上的概念，而 topic 是逻辑上的概念。

每个 partition（目录）相当于一个巨型文件被平均分配到多个大小相等的 segment（段）数据文件中（每个 segment 文件中消息数量不一定相等）这种特性也方便 old segment 的删除，即方便已被消费的消息的清理，提高磁盘的利用率。每个 partition 只需要支持顺序读写就行，segment 的文件生命周期由服务端配置参数（log.segment.bytes，log.roll.{ms,hours}等若干参数）决定。

segment 文件由两部分组成，分别为`.index`文件和`.log`文件，分别表示为 segment 索引文件和数据文件。这两个文件的命令规则为：partition 全局的第一个 segment 从 0 开始，后续每个 segment 文件名为上一个 segment 文件最后一条消息的 offset 值，数值大小为 64 位，20 位数字字符长度，没有数字用 0 填充。`.index` 索引文件存储大量的元数据，`.log` 数据文件存储大量的消息，索引文件中的元数据指向对应数据文件中 message 的物理偏移地址。

每条消息都具有固定的物理结构，包括：offset（8 Bytes）、消息体的大小（4 Bytes）、crc32（4 Bytes）、magic（1 Byte）、attributes（1 Byte）、key length（4 Bytes）、key（K Bytes）、payload(N Bytes) 等等字段，

## topic vs partition

一类 topic 可以认为一类消息，每个 topic 会被分成多个 partition，每个 partition 使用 append log 文件存储。

在创建 topic 时可以在 `$Kafka_HOME/config/server.properties` 中指定 partition 的数量，也可以在 topic 创建之后去修改 partition 的数量。

```
# The default number of log partitions per topic. More partitions allow greater
# parallelism for consumption, but this will also result in more files across
# the brokers.
num.partitions=4
```

## broker 重要配置
Kafka 有非常多的参数可以控制其工作和运行，大部分情况下默认值就可以，但是要用到生产上，就需要自定义一些参数来适应不同的环境。broker 中有一些非常重要的参数，这里列举一些，关于 broker 所有其他的参数可以参考 Kafka 的官方文档。

### broker.id

每个 Kafka broker 都需要有一个整型的唯一标识，这个标识通过 `broker.id` 来设置。默认的情况下，这个数字是 0, 但是它可以设置成任何值。需要注意的是，需要保证集群中这个 id 是唯一的。这个值是可以任意填写的，并且可以在必要的时候从 broker 集群中删除。比较好的做法是使用主机名相关的标识来做为 id, 比如，你的主机名当中有数字相关的信息，如 hosts1.example.com,host2.example.com, 那么这个数字就可以用来作为 broker.id 的值。

### port

默认启动 Kafka 时，监听的是 TCP 的 9092 端口，端口号可以被任意修改。如果端口号设置为小于 1024, 那么 Kafka 需要以 root 身份启动。但是并不推荐以 root 身份启动。

### zookeeper.connect
这个参数指定了 Zookeeper 所在的地址，它存储了 broker 的元信息。在前一章节的例子中，Zookeeper 是运行在本机的 2181 端口上，因此这个值被设置成 localhost:2181。这个值可以通过分号设置多个值，每个值的格式都是 `hostname:port/path`, 其中每个部分的含义如下：

- hostname 是 zookeeper 服务器的主机名或者 ip 地址
- port 是服务器监听连接的端口号
- /path 是 Kafka 在 zookeeper 上的根目录。如果缺省，会使用根目录

### log.dirs
这个参数用于配置 Kafka 保存数据的位置，Kafka 中所有的消息都会存在这个目录下。可以通过逗号来指定多个目录，Kafka 会根据最少被使用的原则选择目录分配新的 parition。注意 Kafka 在分配 parition 的时候选择的规则不是按照磁盘的空间大小来定的，而是分配的 parition 的个数多小。

### num.recovery.thread.per.data.dir
Kafka 可以配置一个线程池，线程池的使用场景如下：

- 当正常启动的时候，开启每个 parition 的文档块 segment
- 当失败后重启时，检查 parition 的文档块
- 当关闭 Kafka 的时候，清除关闭文档块

默认，每个目录只有一个线程。最好是设置多个线程数，这样在服务器启动或者关闭的时候，都可以并行的进行操作。尤其是当非正常停机后，重启时，如果有大量的分区数，那么启动 broker 将会花费大量的时间。注意，这个参数是针对每个目录的。比如，num.recovery.threads.per.data.dir 设置为 8, 如果有 3 个 log.dirs 路径，那么一共会有 24 个线程。

### auto.create.topics.enable

在下面场景中，按照默认的配置，如果还没有创建 topic,Kafka 会在 broker 上自动创建 topic:

- 当 producer 向一个 topic 中写入消息时
- 当 cosumer 开始从某个 topic 中读取数据时
- 当任何的客户端请求某个 topic 的信息时

在很多场景下，这都会引发莫名其妙的问题。尤其是没有什么办法判断某个 topic 是否存在，因为任何请求都会创建该 topic。如果你想严格的控制 topic 的创建，那么可以设置 auto.create.topics.enable 为 false。

### num.partitions
这个参数用于配置新创建的 topic 有多少个分区，默认是 1 个。注意 partition 的个数只可以被增加，不能被减少。这就意味着如果想要减少主题的分区数，那么就需要重新创建 topic。

Kafka 通过分区来对 topic 进行扩展，因此需要使用分区的个数来做负载均衡，如果新增了 broker, 那么就会引发重新负载分配。这并不意味着所有的主题的分区数都需要大于 broker 的数量，因为 Kafka 是支持多个主题的，其他的主题会使用其余的 broker。需要注意的是，如果消息的吞吐量很高，那么可以通过设置一个比较大的分区数，来分摊压力。

### log.retention.ms
用于配置 Kafka 中消息保存的时间，也可以使用 log.retention.hours, 默认这个参数是 168 个小时，即一周。另外，还支持 log.retention.minutes 和 log.retention.ms。这三个参数都会控制删除过期数据的时间，推荐还是使用 log.retention.ms。如果多个同时设置，那么会选择最小的那个。

过期时间是通过每个 log 文件的最后修改时间来定的。在正常的集群操作中，这个时间其实就是 log 段文件关闭的时间，它代表了最后一条消息进入这个文件的时间。然而，如果通过管理员工具，在 brokers 之间移动了分区，那么这个时候会被刷新，就不准确了。这就会导致本该过期删除的文件，被继续保留了。

### log.retention.bytes
这个参数也是用来配置消息过期的，它会应用到每个分区，比如，你有一个主题，有 8 个分区，并且设置了 log.retention.bytes 为 1G, 那么这个主题总共可以保留 8G 的数据。注意，所有的过期配置都会应用到 patition 粒度，而不是主题粒度。这也意味着，如果增加了主题的分区数，那么主题所能保留的数据也就随之增加。

### log.segment.bytes
用来控制 log 段文件的大小，而不是消息的大小。在 Kafka 中，所有的消息都会进入 broker, 然后以追加的方式追加到分区当前最新的 segment 段文件中。一旦这个段文件到达了 log.segment.bytes 设置的大小，比如默认的 1G, 这个段文件就会被关闭，然后创建一个新的。一旦这个文件被关闭，就可以理
解成这个文件已经过期了。这个参数设置的越小，那么关闭文件创建文件的操作就会越频繁，这样也会造成大量的磁盘读写的开销。

### log.segment.ms
控制段文件关闭的时间，它定义了经过多长时间段文件会被关闭。

### message.max.bytes
这个参数用于限制生产者消息的大小，默认是 1000000, 也就是 1M。生产者在发送消息给 broker 的时候，如果出错，会尝试重发；但是如果是因为大小的原因，那生产者是不会重发的。另外，broker 上的消息可以进行压缩，这个参数可以使压缩后的大小，这样能多存储很多消息。需要注意的是，允许发送更大的消息会对性能有很大影响。更大的消息，就意味着 broker 在处理网络连接的时候需要更长的时间，它也会增加磁盘的写操作压力，影响 IO 吞吐量。

## Kafka 特点

- Kafka 也被设计为多个消费者去读取任意的单个消息流而不相互影响；同时多个 Kafka 消费者也可以选择作为一个组的一部分，来分担一个消息流，确保这整个组，这个消息只被消费一次
- 基于硬盘的消息保存，消息将按照持久化配置规则存储在硬盘上。这个可以根据每个 topic 进行设置，允许根据不同的消费者的需求不同设置不同消息流的保存时间不同，持久化保存意味着一旦消费者来不及消费或者突然出现流量高峰，而不会有丢失数据的风险。同样也意味着消息可以由 consumer 来负责管理，比如消费消息掉线了一段时间，不需要担心消息会在 producer 上累积或者消 息丢失，consumer 能够从上次停止的地方继续消费
- 水平扩展能力强，扩展可以在集群正常运行的时候进行，对于整个系统的运作没有影响，集群如果要同时容忍更多的故障的话，可以配置更高的 replication factors
- 高性能

## Kafka 的使用场景
关于该部分，Kafka 官方的入门教程中有非常详细的介绍，包括从最早在 LinkedIn 中为记录用户访问数据设计该系统，到后面日志，消息处理，到流处理等等，Kafka 有着非常广阔的使用场景。

更多关于如何使用命令行启动 Kafka，还有一些基础内容可以参考翻译的 Kafka [中文文档](https://einverne.gitbooks.io/kafka/content/)

## reference

- 《Kafka 权威指南》
- <https://einverne.gitbooks.io/kafka/content/>
