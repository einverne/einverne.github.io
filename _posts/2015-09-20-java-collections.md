---
layout: post
title: "Java collections"
tagline: ""
description: ""
category: 学习笔记
tags: [java, jdk, design-pattern, ]
last_updated:
---

Collection 是接口，包含 List 和 Set 。List 有序，Set 无序不允许重复元素。

- List 实现类有 LinkedList, ArrayList, Vector, Stack
- Set 的实现类 HashSet， TreeSet。HashSet 依赖 HashMap，TreeSet 依赖 TreeMap。

## List
List 接口下主要实现

### ArrayList
动态数组，继承 AbstractList 实现了 List，RandomAccess，Cloneable， Serializable 等接口。

线程不安全，多线程使用 Vector 或者 CopyOnWriterArrayList

源码解读 基于 jdk 1.8

- ArrayList 实际是通过数组来保存元素，构造时默认大小为 10，可设定
- 当 ArrayList 容量不足时，ArrayList 会重新设置容量 `int newCapacity = oldCapacity + (oldCapacity >> 1);`
- ArrayList 实现了 Cloneable 接口，意味着可以使用 `.clone()` 方法来创建全新 ArrayList
- modCount 用来记录 List 被修改的次数，被 Iterator 使用，可以用来实现 fail-fast 异常，ArrayList 在修改时都会改动 modCount 值，该异常会在多线程中在一个线程中访问数组，另一个线程修改数组时抛出异常

### LinkedList
LinkedList 双向链表，继承自 AbstractSequentialList，可以被当做堆栈，队列，双端队列，实现了 List，Deque，Cloneable，Serializable 等接口。

非线程安全

源码解读 jdk 1.8

- 内部 Node 类，包含着要保存的元素，prev 和 next 指针
- LinkedList 中重要的成员变量，first，last 和 size，first 和 last 分别表示链表的头和尾，size 是链表的长度
- LinkedList 既然是链表，所以顺序访问会高效，反而随机访问效率降低，LinkedList 的 get 等根据索引来获取的方法，通过比较 index 和链表长度的一半比较，如果一半前则从头开始找，而一半后则从尾巴开始找
- LinkedList 可以作为 FIFO，FILO 来使用

### Vector
Vector 继承 AbstractList，实现了 RandomAccess，Cloneable, Serializable 接口，是一个列表。

线程安全。

- 和 ArrayList 一样，默认的长度是 10
- 重要的成员变量 elementData， elementCount， capacityIncrement
- Vector 的线程安全使用过 synchronized 关键字来实现的，比如说

    public synchronized boolean add(E e) {
        modCount++;
        ensureCapacityHelper(elementCount + 1);
        elementData[elementCount++] = e;
        return true;
    }

### 总结

- 多线程中操作数组使用 Vector
- 如果要快速随机访问应该选择 ArrayList
- 如果要快速插入和删除 LinkedList

## Map
Map 是一个键值对映射接口，Map 不能包含重复键。

### HashMap
HashMap 继承自 AbstractMap 实现了 `Map<K,V>`, Cloneable, Serializable 接口。线程不安全。

HashMap 类有两个参数影响其性能：“初始容量” 和 “加载因子”。容量是哈希表中桶的数量，初始容量 只是哈希表在创建时的容量。加载因子是哈希表在其容量自动增加之前可以达到多满的一种尺度。
当哈希表中的条目数超出了加载因子与当前容量的乘积时，则要对该哈希表进行 rehash 操作（即重建内部数据结构），从而哈希表将具有大约两倍的桶数。
通常，默认加载因子是 0.75, 这是在时间和空间成本上寻求一种折衷。加载因子过高虽然减少了空间开销，但同时也增加了查询成本（在大多数 HashMap 类的操作中，包括 get 和 put 操作，都反映了这一点）。在设置初始容量时应该考虑到映射中所需的条目数及其加载因子，以便最大限度地减少 rehash 操作次数。如果初始容量大于最大条目数除以加载因子，则不会发生 rehash 操作。

重要的成员变量：

- table 是一个 `Entry[]` 数组，单向链表
- size 是 HashMap 大小，保存键值对数目
- threshold 是阈值，判断是否需要调整容量，threshold= 容量*加载因子，当存储容量达到阈值，需要将 HashMap 容量加倍
- loadFactor 加载因子
- modCount 用来实现 fail-fast 机制
- entrySet 键值对 Set


    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }


