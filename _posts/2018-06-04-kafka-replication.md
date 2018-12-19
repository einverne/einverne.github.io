---
layout: post
title: "Kafka 副本备份机制"
tagline: ""
description: ""
category: 学习笔记
tags: [kafka, message, broker, replication,]
last_updated:
---

leader 维护了 ISR（能完全赶得上 leader 的副本集）, 每个 Partition 当前的 leader 和 ISR 信息会记录在 ZooKeeper 中。leader 会跟踪与其保持同步的 Replica 列表，该列表称为 ISR。如果一个 follower 宕机，或者落后太多，leader 将把它从 ISR 中移除。只有 leader 才能知道哪些 Replica 能够及时完全赶得上。所有 follower 都会和 leader 通信获取最新的消息。但是 follower 之间并不互相知道彼此的信息。所以由 leader 来管理 ISR 最合适了。leader 还可以决定移除落后太多的 Replicas.

每个 Replica 都在自己的 local log 中存储消息，并在日志中维护了重要的 offset 位置信息。**LEO** 代表了日志的最新的偏移量，**HW** 是最近提交消息的偏移量。

每个日志都会定时地同步到磁盘。在 flushed offset 之前的数据一定能保存成功持久化到磁盘上。flush offset 可以在 HW 之前或者之后（因为 follower 只是先写到内存中然后返回 ack 给 leader,hw 增加时， follower 在内存中的消息不一定什么时候写到磁盘上，即可能在 hw 增加前就写到磁盘，或者等 hw 增加后才写到磁盘）。

leader 也会定时地将 HW **广播**给所有的 followers. 广播消息可以附加在从 follower 过来的 fetch 请求的结果中。同时，每个副本（不管是 leader 还是 follower) 也会定时地将 HW 持久化到自己的磁盘上。当 follower 向 leader 提交 fetch 请求时，leader 也会告诉所有的 follower 说，我现在的 hw 是多少了。这是一种保护机制。 假设只有 leader 一个人保护了 hw 这个重要的信息，一旦 leader 不幸挂掉了，就没有人知道 hw 现在到底是多少了。所以只要一有 follower 过来获取消息时，leader 就不厌其烦地像个老太婆不断地唠叨说我这一次的 hw 更新到了哪里。每个 follower 也就都会知道 leader 的最新 hw. 这样即使 leader 挂掉了，hw 仍然在其他 follower 上都备份有这个重要信息。几个 follower 在一阵商量后，选举出了新的 leader, 这些人都知道上一个 leader 最新的 hw, 因此 hw 会继续传承下去。

为了简单起见，只有 leader 可以提供读消息的服务。并且最多只到 hw 位置的消息才会暴露给客户端。

Producer 在发布消息到某个 Partition 时会经过如下的步骤：

- 先通过 Zookeeper 找到该 Partition 的 leader， 然后无论该 Topic 的 Replication Factor 为多少（也即该 Partition 有多少个 Replica），Producer 只将该消息发送到该 Partition 的 leader。
- leader 会将该消息写入其本地 Log, 每个 follower 都从 leader pull 数据。这种方式上，follower 存储的数据顺序与 leader 保持一致。follower 在收到该消息并写入其 Log 后，向 leader 发送 ACK。
- 一旦 leader 收到了 ISR 中的**所有 Replica 的 ACK**，该消息就被认为已经 commit 了，leader 将增加 HW 并且向 Producer 发送 ACK。为了提高性能，每个 follower 在接收到数据后就立马向 leader 发送 ACK，而非等到数据写入 Log 中。

因此，对于**已经 commit** 的消息，Kafka **只能保证它被存于多个 Replica 的内存中**，而**不能保证**它们被持久化到磁盘中， 也就不能完全保证异常发生后该条消息一定能被 Consumer 消费。但考虑到这种场景非常少见，可以认为这种方式在性能和数据持久化上做了一个比较好的平衡。在将来的版本中，Kafka 会考虑提供更高的持久性。Consumer 读消息也是从 leader 读取，只有被 commit 过的消息（offset 低于 HW 的消息）才会暴露给 Consumer。 Kafka 的复制机制既不是完全的同步复制，也不是单纯的异步复制。事实上，同步复制要求所有能工作的 follower 都复制完，这条消息才会被认为 commit，这种复制方式极大的影响了吞吐率。而异步复制方式下，follower 异步的从 leader 复制数据，数据只要被 leader 写入 log 就被认为已经 commit，这种情况下如果 follower 都复制完都落后于 leader，而如果 leader 突然宕机，则会丢失数据。而 Kafka 的这种使用 ISR 的方式则很好的**均衡**了确保**数据不丢失**以及**吞吐率**。follower 可以批量的从 leader 复制数据，这样极大的提高复制性能（批量写磁盘），极大减少了 follower 与 leader 的差距。

如果 follower 失败了，在超过一定时间后，leader 会将这个失败的 follower (follower 没有发送 fetch 请求）从 ISR 中**移除**。由于 ISR 保存的是所有全部赶得上 leader 的 follower replicas, 失败的 follower 肯定是赶不上了。虽然 ISR 现在少了一个，但是并不会引起的数据的丢失，ISR 中剩余的 replicas 会继续同步数据（只要 ISR 中有一个 follower, 就不会丢失数据）（注意：这里讨论的是一个 Partition 的 follower 副本，而不是节点，如果是一个节点，它不止存储一个 Partition, 而且不都是 follower)

如果失败的 follower 恢复过来，它首先将自己的日志截断到上次 checkpointed 时刻的 HW. 因为 checkpoint 记录的是所有 Partition 的 hw offset. 当 follower 失败时，checkpoint 中关于这个 Partition 的 HW 就不会再更新了。而这个时候存储的 HW 信息和 follower partition replica 的 offset 并不一定是一致的。比如这个 follower 获取消息比较快， 但是 ISR 中有其他 follower 复制消息比较慢，这样 leader 并不会很快地更新 HW, 这个快的 follower 的 hw 也不会更新 (leader 广播 hw 给 follower) 这种情况下，这个 follower 日志的 offset 是比 hw 要大的。

所以在它恢复之后，要将比 hw 多的部分截掉，然后继续从 leader 拉取消息（跟平时一样）. 实际上，ISR 中的每个 follower 日志的 offset 一定是比 hw 大的。因为只有 ISR 中所有 follower 都复制完消息，leader 才会增加 hw。也就是说有可能有些 follower 复制完了，而有些 follower 还没有复制完，那么 hw 是不会增加的，复制完的 follower 的 offset 就比 hw 要大。

一个消费者组可以有多个消费者，Kafka 中的一个 Partition 只会被消费者组中的一个消费者消费，但可以被多个消费组同时消费。

对于多个 partition 和多个 consumer 有以下这样的限制条件：

- 如果 consumer 比 partition 多，是浪费，因为 kafka 的设计是在一个 partition 上是不允许并发的，所以 consumer 数不要大于 partition 数
- 如果 consumer 比 partition 少，一个 consumer 会对应于多个 partitions，这里主要合理分配 consumer 数和 partition 数，否则会导致 partition 里面的数据被取的不均匀。最好 partiton 数目是 consumer 数目的整数倍，所以 partition 数目很重要，比如取 24，就很容易设定 consumer 数目
- 如果 consumer 从多个 partition 读到数据，不保证数据间的顺序性，kafka 只保证在一个 partition 上数据是有序的，但多个 partition，根据你读的顺序会有不同

增减 consumer，broker，partition 会导致 rebalance，所以 rebalance 后 consumer 对应的 partition 会发生变化。High-level 接口中获取不到数据的时候是会 block 住消费者线程的

