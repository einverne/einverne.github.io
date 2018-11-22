---
layout: post
title: "Google Guava 中本地缓存 LoadingCache 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [google, guava, cache, local-cache, java, ]
last_updated:
---

`Cache` 在实际场景中有着非常广泛的使用，通常情况下如果遇到需要大量时间计算或者获取值的场景，就应当将值保存到缓存中。`Cache` 和 `ConcurrentMap` 类似，但又不尽相同。最大的不同是 `ConcurrentMap` 会永久的存储所有的元素值直到他们被显示的移除，但是 `Cache` 会为了保持内存使用合理，而配置自动将一些值移除。

通常情况下，Guava caching 适用于以下场景：

- 花费一些内存来换取速度
- 期望一些 key 会被不止一次被调用
- 缓存内容不会缓存超过内存空间的值，Guava caches 不会存储内容到文件，或者到服务器外部，如果有此类需求考虑使用 Memcached 类似工具

`Cache` 通过 `CacheBuilder` 类的 Builder 模式获取：

    LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
           .maximumSize(1000)
           .expireAfterWrite(10, TimeUnit.MINUTES)
           .removalListener(MY_LISTENER)
           .build(
               new CacheLoader<Key, Graph>() {
                 public Graph load(Key key) throws AnyException {
                   return createExpensiveGraph(key);
                 }
               });

如果使用的场景中对应着 key 的值有默认的值，那么可以选择使用 `CacheLoader`，如果没有默认值，那么仍然可以原子的 `get-if-absent-compute` 方法，在 `get` 方法中提供一个 `Callable`，或者元素也可以通过 `Cache.put` 来直接插入到缓存中。

## LoadingCache
`LoadingCache` 是一个附加着 `CacheLoader` 的 Cache。`LoadingCache<K,V>` 在 Guava 中是一个 interface，通常是用来本地 Cache 缓存 k-v 数据，value 会一直保存在内存中直到被移除或者失效。实现这个接口的类期望是线程安全的，能够安全的在多线程程序中被访问。

当第一次调用 `get()` 方法时，如果 value 不存在则会触发 `load()` 方法，load 方法不能返回 null，否则会报错。

## get() vs getUnchecked()
最正统的查询 `LoadingCache` 的方法是调用 `get(k)` 方法，这个方法如果查询到已经缓存的值会立即返回，否则使用缓存的 `CacheLoader` 自动加载一个新值到缓存并返回。因为 `CacheLoader` 可能会抛出异常，那么如果有异常，则`LoadingCache.get(k)` 会抛出 `ExecutionException` 异常。而如果 CacheLoader 抛出 unchecked 未检查的异常，则 `get(k)` 方法会抛出 `UncheckedExecutionException` 异常。

此时可以选择使用 `getUnchecked(k)` 方法，这个方法会将所有的异常包装在 UncheckedExecutionException 异常中。需要注意的是，如果 CacheLoader 声明了检查异常，也就是 CacheLoader 显式的定义了异常，就不能调用 `getUnchecked(k)` 方法

## 定时回收
CacheBuilder 在构建 Cache 时提供了两种定时回收的方法

- expireAfterAccess(long, TimeUnit) 缓存项在给定时间内没有被读或写访问，则回收
- expireAfterWrite(long, TimeUnit)：缓存项在给定时间内没有被写访问（创建或覆盖），则回收

## reference

- <https://github.com/google/guava/wiki/CachesExplained>
