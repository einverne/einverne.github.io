---
layout: post
title: "Java collections"
aliases: "Java collections"
tagline: ""
description: ""
category: 学习笔记
tags: [java, jdk, design-pattern, collection, ]
last_updated:
---

Java 容器是 JDK 为 Java 使用者设计好的一套基础的数据结构。

Collection 是接口，包含 List 、Set  和 Queue。List 有序，Set 无序不允许重复元素。

- List 实现类有 [[LinkedList]], [[ArrayList]], Vector, Stack
- Set 的实现类 HashSet， [[TreeSet]]。HashSet 依赖 HashMap，TreeSet 依赖 TreeMap。
- Queue 有 LinkedList，PriorityQueue， ArrayDeque

其中 LinkedList 实现了 List 和 Queue 接口。

另外一个重要的接口是 Map，实现有 HashMap，TreeMap。

## List
List 接口下主要实现

### ArrayList
动态数组实现，继承 AbstractList 实现了 List，RandomAccess，Cloneable， Serializable 等接口。

线程不安全，多线程使用 Vector 或者 CopyOnWriterArrayList

源码解读 基于 jdk 1.8

- ArrayList 实际是通过数组来保存元素，构造时默认大小为 10，可设定
- 当 ArrayList 容量不足时，ArrayList 会重新设置容量 `int newCapacity = oldCapacity + (oldCapacity >> 1);`
- ArrayList 实现了 Cloneable 接口，意味着可以使用 `.clone()` 方法来创建全新 ArrayList
- modCount 用来记录 List 被修改的次数，被 Iterator 使用，可以用来实现 fail-fast 异常，ArrayList 在修改时都会改动 modCount 值，该异常会在多线程中在一个线程中访问数组，另一个线程修改数组时抛出异常

### LinkedList
LinkedList 双向链表，继承自 `AbstractSequentialList`，可以被当做堆栈，队列，双端队列，实现了 List，Deque，Cloneable，Serializable 等接口。

非线程安全

源码解读 jdk 1.8

- 内部 Node 类，包含着要保存的元素，prev 和 next 指针
- LinkedList 中重要的成员变量，first，last 和 size，first 和 last 分别表示链表的头和尾，size 是链表的长度
- LinkedList 既然是链表，所以顺序访问会高效，反而随机访问效率降低，LinkedList 的 get 等根据索引来获取的方法，通过比较 index 和链表长度的一半比较，如果一半前则从头开始找，而一半后则从尾巴开始找
- LinkedList 可以作为 FIFO，FILO 来使用

### Vector
Vector 继承 AbstractList，实现了 RandomAccess，Cloneable, Serializable 接口，是一个列表。

线程安全。效率较低。

- 和 ArrayList 一样，默认的长度是 10
- 重要的成员变量 elementData， elementCount， capacityIncrement
- Vector 的线程安全使用过 synchronized 关键字来实现的，比如说

    public synchronized boolean add(E e) {
        modCount++;
        ensureCapacityHelper(elementCount + 1);
        elementData[elementCount++] = e;
        return true;
    }

### Queue
队列「先进先出」

- offer
- peek
- poll


### 总结

- 多线程中操作数组使用 Vector
- 如果要快速随机访问应该选择 ArrayList
- 如果要快速插入和删除 LinkedList

## Map
Map 是一个键值对映射接口，Map 不能包含重复键。

### HashMap
HashMap 继承自 AbstractMap 实现了 `Map<K,V>`, Cloneable, Serializable 接口。线程不安全。

HashMap 类有两个参数影响其性能：“初始容量” 和 “加载因子”。容量是哈希表中桶的数量，初始容量 只是哈希表在创建时的容量。加载因子是哈希表在其容量自动增加之前可以达到多满的一种尺度。

HashMap 中 key-value 的值都存在 Entry 的数组中 (Java 8 中 Node 结构）。

    transient Node<K,V>[] table;

说到 HashMap，都知道 Java 中每一个 Object 都有一个 hashCode() 方法，该方法返回一个 int 值，相同的对象必须返回相同的 hash Code（**不同的对象不一定要求返回不同的值**). 在 HashMap 中 hashCode() 方法首先被用来计算 bucket 然后计算 index。

#### Buckets
Buckets 是 HashMap 中的一个数组元素，它用来保存节点，节点可能有相同的 bucket。Buckets 的容量是不同的，bucket 的容量大致：

    capacity = number of buckets * load factor

单一的一个 bucket 可以拥有超过一个 nodes，hashCode() 方法越好，那么 bucket 会利用的更好。

#### HashMap 中的 Index 计算
HashCode 会产生一组 int 数值，如果我们创建一个这个范围的数组，极有可能造成 outOfMemoryException。所以需要知道产生数组的一个最小大小：

    index = hashCode(key) & (n-1)

n 是 bucket 的数值。

重要的成员变量：

- table 是一个 `Entry[]` 数组，单向链表
- size 是 HashMap 大小，保存键值对数目
- threshold 是阈值，判断是否需要调整容量，threshold= 容量*加载因子，当存储容量达到阈值，需要将 HashMap 容量加倍
- loadFactor 加载因子
- modCount 用来实现 fail-fast 机制
- entrySet 键值对 Set

在上面的描述中，我们知道如果发生 hash 冲突，所有的节点都保存在一个 linked-list 中，那么最坏的时间复杂度可能是 O(n).

为了解决这个问题，Java 8 中 hash 元素当达到一个阈值之后使用了 balanced trees 而不是 linked list. 这意味着 HashMap 在达到一定数量之后将 Entry 对象转而存储到 balanced tree 中，而最坏的时间复杂度从 O(n) 降至 O(log n)

#### 注意点

- 直到 rehash 之前 put 和 get 的复杂度都是稳定的
- 假设产生冲突，第二个节点会用 linked list 串起来
- key 为 null 时 hash code 为 0

Java 8 中的 hash() 方法：

    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }

为了解决哈希碰撞，将 put 到 HashMap 的 key 的 hashCode() 高位和地位综合考虑，在计算时亦或一下高低位（高 16 位异或低 16 位）。

### Hashtable
Hashtable 继承 Dictionary，实现 Map, Cloneable, Serializable 接口。Hashtable 函数都是**同步的**，**线程安全的**，key 和 value 都不能为 null。

Hashtable 和 HashMap 一样，也是通过“拉链法”来实现的。

### TreeMap

TreeMap 是一个有序的 key-value 集合，顺序通过 key 排列，通过红黑树实现

    public class TreeMap<K,V>
        extends AbstractMap<K,V>
        implements NavigableMap<K,V>, Cloneable, java.io.Serializable

内部根据 key 的自然顺序排序，或者根据创建时提供的 Comparator 排序。基本操作包括 containsKey, get, put, remove 的时间复杂度是 log(n).

TreeMap 不是线程安全的。

内部 Entry 结构包含红黑树节点的 6 个组成部分

    static final class Entry<K,V> implements Map.Entry<K,V> {
        K key;
        V value;
        Entry<K,V> left;
        Entry<K,V> right;
        Entry<K,V> parent;
        boolean color = BLACK;

### WeakHashMap

[[WeakHashMap]] 是弱键，当某个键不再正常使用时会被从 WeakHashMap 中自动移除。准确的来说，对于一个给定的键，并不能阻止垃圾回收器对该键的回收。

WeakHashMap 的 key 是弱键，通过 WeakReference 类型实现。

ReferenceQueue 是一个队列，保存被 GC 回收的弱键。

WeakHashMap 是不同步的，可以使用 Collections.synchronizedMap 来构造同步的 WeakHashMap。

#### Java 中的引用方式
在理解 WeakHashMap 之前首先要知道 Java 中的几种引用，Strong，Soft，和 Weak 引用。

强引用

    Integer one = 1;

GC 不会随意回收强引用

软引用

    Integer prime = 1;
    SoftReference<Integer> soft = new SoftReference<Integer>(prime);
    prime = null;

GC 只有在 JVM 及需内存时才会回收软引用

弱引用

    Integer prime = 1;
    WeakReference<Integer> soft = new WeakReference<Integer>(prime);
    prime = null;

GC 会频繁的回收弱引用内存，即使不是极其需要内存也会进行回收。

WeakHashMap 中就是用了 WeakReference 类型。

#### 使用场景
比如某些情况下需要在 value 中保存极大的内容，比如图片内容，那么会消耗极大的内存，而如果使用普通 HashMap 那么这些图片的内容不会轻易释放，这个时候就使用 WeakHashMap 比较合适。

#### hash 函数
hash 函数的目的是为了让 key 的 hash 尽量均匀的分布到 bucket 中

    final int hash(Object k) {
      int h = k.hashCode();

      h ^= (h >>> 20) ^ (h >>> 12);
      return h ^ (h >>> 7) ^ (h >>> 4);
    }

## Set
Set 的实现类基于 Map 实现

- HashSet 通过 HashMap 实现，不保证顺序
- TreeSet 通过 TreeMap 实现，有序


### HashSet
没有重复元素的集合，由 HashMap 实现，不保证顺序，允许使用 null。非同步。

    public class HashSet<E>
        extends AbstractSet<E>
        implements Set<E>, Cloneable, java.io.Serializable

### TreeSet
有序 Set 集合，基于 TreeMap 实现，二叉树实现，非同步的

    public class TreeSet<E> extends AbstractSet<E>
        implements NavigableSet<E>, Cloneable, java.io.Serializable {

## Enumeration Vs Iterator
枚举类和迭代器，都能用来变量集合，他们都是接口

    public interface Enumeration<E> {
        boolean hasMoreElements();
        E nextElement();
    }

    public interface Iterator<E> {
        boolean hasNext();
        E next();
        void remove();
    }

Enumeration 只能够读取集合数据，不能修改；而 Iterator 能够删除

Iterator 支持 fail-fast 机制（多个线程对集合内容操作），而 Enumeration 不支持。

## Comparable Vs Comparator
Comparable 是排序接口，一个类如果实现了 Comparable 接口，意味着该类支持排序。

    public interface Comparable<T> {
        public int compareTo(T o);
    }

通过 x.compareTo(y) 函数比较 x, y 大小，返回负数则 `x < y`， 返回 0 则 `x=y`，返回正数则 `x>y`

Comparator 是比较接口，如果要控制某个类的次序，而类本身不支持排序（没有实现 Comparable 接口）那么可以建立一个类比较器。

    public interface Comparator<T> {
        int compare(T o1, T o2);
        boolean equals(Object obj);
    }

Comparable 相当于“内部比较器”，而 Comparator 相当于“外部比较器”。如果你无法修改某个类来改变其实现，而又想要让他实现排序，那么只能够使用外部比较器了。

## equals Vs ==
`==` 作用是判断两个对象地址是否相等，即判断两个对象是不是同一个对象。

equals 作用也是判断两个对象是否相等，但有两种情况：

- 类没有覆盖 equals 方法，等价于 ==
- 类覆盖了 equals 方法，若相同，则返回 true



## reference

- <http://www.javamex.com/tutorials/collections/hash_function_guidelines.shtml>
