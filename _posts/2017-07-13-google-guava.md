---
layout: post
title: "Google Guava 库"
tagline: ""
description: ""
category: 学习笔记
tags: [google, guava, java, java-lib, lib, utils,]
last_updated:
---

Guava 有很多学习材料

- <https://github.com/google/guava/wiki>

## Optional
Optional 存在的意义就是为了替换 `null`，null 存在的大部分情况用户是无法知道方法想要返回的什么。null 多数情况下并不意味着返回值没有值，一些情况下可能表示 error，甚至也有人用 null 来表示成功，或者表示成功了但是没有返回值。因此 Optional 存在的意义并不是可读性，而是强迫使用他的人思考返回值应该是什么。

举个例子，当调用别人的 `other.method(a, b)` 方法时，可能经常忘记 method 返回值可能是 null，而当 method 返回值为 Optional 时，调用者几乎不可能忘记 null 的存在，因为调用者需要自己 unwrap 来获取结果。基于这个原因，Guava 通常建议将 Optional 作为返回值。[^1]

[^1]: 链接 <https://stackoverflow.com/a/9561334/1820217>

## Immutable Collections
不可变对象有很多好处：

- 不受信任的库可以安全使用
- 线程安全
- Doesn't need to support mutation, and can make time and space savings with that assumption. All immutable collection implementations are more memory-efficient than their mutable siblings. ([analysis](https://github.com/DimitrisAndreou/memory-measurer/blob/master/ElementCostInDataStructures.txt))
- 可以当做常量使用

Guava 提供了简单，易于使用的不可变 Collection 类型的版本， JDK 提供了 `Collections.unmodifiableXXX` 方法，但有些缺陷

- unwieldy and verbose; unpleasant to use everywhere you want to make defensive copies
- unsafe: the returned collections are only truly immutable if nobody holds a reference to the original collection
- inefficient: the data structures still have all the overhead of mutable collections, including concurrent modification checks, extra space in hash tables, etc.

创建 ImmutableXXX 可以有以下方式：

- 使用 `copyOf` 方法，比如 `ImmutableSet.copyOf(set)`
- 使用 `of` 方法，`ImmutableSet.of("a", "b", "c")`
- 使用 `Builder` 方式

        public static final ImmutableSet<Color> GOOGLE_COLORS =
           ImmutableSet.<Color>builder()
           .addAll(WEBSAFE_COLORS)
           .add(new Color(0, 191, 255))
           .build();

### Multiset
可以存放相同的元素超过一次，multisets {a, a, b} 和 {a, b, a} 是相同的。官方文档上说可以用两种眼光看 Multiset

- `ArrayList<E>` 没有排序的约束，顺序是不关心的
- `Map<E, Integer>` 包含元素和计数

Multiset API 在设计的时候也充分的包含了着两种想法：

- 当看成通常的 Collection 时， Multiset 表现和无序的 ArrayList 相似

    - 调用 `add(E)` 添加元素
    - 调用 `iterator()` 遍历
    - `size()` 是集合中所有元素的数量

- 而其他查询操作，性能表现，和 `Map<E, Integer>` 类似

    - `count(Object)` 返回元素的计数，HashMultiset 的时间复杂度 O(1)，而 `TreeMultiset` 是 O(log n)
    - `entrySet()` 返回 `Set<Multiset.Entry<E>>` 表现和 `keySet()` 类似
    - Multiset 的内存消耗在不同元素上是线性的


