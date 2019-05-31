---
layout: post
title: "Google Guava 库学习笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [google, guava, java, java-lib, lib, utils,]
last_updated:
---

Guava 是 Google 开源的 Java 核心类库，包含了 Java 开发中众多的核心功能，其中最著名最好用的也就是合集和缓存相关的工具了。

Guava 有很多学习材料，比如官方 Wiki

- <https://github.com/google/guava/wiki>

源码包的简单说明：

　　com.google.common.annotations：普通注解类型。
　　com.google.common.base：基本工具类库和接口。
　　com.google.common.cache：缓存工具包，非常简单易用且功能强大的 JVM 内缓存。
　　com.google.common.collect：带泛型的集合接口扩展和实现，以及工具类，这里有很多好用的集合。
　　com.google.common.eventbus：发布订阅风格的事件总线
　　com.google.common.hash： 哈希工具包
　　com.google.common.io：I/O 工具包
　　com.google.common.math：原始算术类型和超大数的运算工具包
　　com.google.common.net：网络工具包
　　com.google.common.primitives：八种原始类型和无符号类型的静态工具包
　　com.google.common.reflect：反射工具包
　　com.google.common.util.concurrent：多线程工具包

## Optional
Optional 存在的意义就是为了替换 `null`，null 存在的大部分情况用户是无法知道方法想要返回的什么。null 多数情况下并不意味着返回值没有值，一些情况下可能表示 error，甚至也有人用 null 来表示成功，或者表示成功了但是没有返回值。因此 Optional 存在的意义并不是可读性，而是强迫使用他的人思考返回值应该是什么。

举个例子，当调用别人的 `other.method(a, b)` 方法时，可能经常忘记 method 返回值可能是 null，而当 method 返回值为 Optional 时，调用者几乎不可能忘记 null 的存在，因为调用者需要自己 unwrap 来获取结果。基于这个原因，Guava 通常建议将 Optional 作为返回值。[^1]

[^1]: 链接 <https://stackoverflow.com/a/9561334/1820217>

## 集合类
Guava 的集合类是对 JDK 集合类的扩展。

### Immutable Collections
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
Multiset 和 set 的区别就在于可以存放相同的元素超过一次，multisets {a, a, b} 和 {a, b, a} 是相同的。官方文档上说可以用两种眼光看 Multiset

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

Multiset 接口定义的接口主要有：

Method                  | 解释
------------------------|---------------------------
add(E element) | 向其中添加单个元素
add(E element,int occurrences) | 向其中添加指定个数的元素
count(Object element) | 返回给定参数元素的个数
remove(E element) | 移除一个元素，其 count 值 会响应减少
remove(E element,int occurrences)| 移除相应个数的元素
elementSet() | 将不同的元素放入一个 Set 中
entrySet()| 类似与 Map.entrySet 返回 `Set<Multiset.Entry>`。包含的 Entry 支持使用 getElement() 和 getCount()
setCount(E element ,int count)| 设定某一个元素的重复次数
setCount(E element,int oldCount,int newCount)| 将符合原有重复个数的元素修改为新的重复次数
retainAll(Collection c) | 保留出现在给定集合参数的所有的元素
removeAll(Collectionc) | 去除出现给给定集合参数的所有的元素

Multiset 的常用实现

Guava 提供了 Multiset 的多种实现，这些实现基本对应了 JDK 中 Map 的实现：
Map               | Corresponding Multiset  | Supports null elements
------------------|-------------------------|---------------------------
HashMap           | HashMultiset      | Yes
TreeMap           | TreeMultiset     | Yes (if the comparator does)
LinkedHashMap     | LinkedHashMultiset   | Yes
ConcurrentHashMap | ConcurrentHashMultiset  | No
ImmutableMap      | ImmutableMultiset    | No

### Multimap
Java 开发中可能经常会需要实现 `Map<K, List<V>>` or `Map<K, Set<V>>` 类似的数据结构，Multimap 就是为了解决此类时间而生。

有两种看待 Multimap 的方式，单独的 key 对应 value

```
a -> 1
a -> 2
a -> 4
b -> 3
c -> 5
```

或者是，唯一的 key 对应一个集合

```
a -> [1, 2, 4]
b -> [3]
c -> [5]
```

通常来说，以第一种方式思考即可，但是 Multimap 也提供了 `asMap()` 方式来返回一个 `Map<K, Collection<V>>`。重要的是，没有 key map 到一个空集合这样的方式。

通常来说不会直接使用 Multimap 接口，而是使用 `ListMultimap` 或者 `SetMultimap` ，对应将 key 映射到 List 或者 Set 。

最直接构建 Multimap 的方式是使用 MultimapBuilder，这种方式允许用户自定义 key 和 value 应该有的样式。

```java
// creates a ListMultimap with tree keys and array list values
ListMultimap<String, Integer> treeListMultimap =
    MultimapBuilder.treeKeys().arrayListValues().build();

// creates a SetMultimap with hash keys and enum set values
SetMultimap<Integer, MyEnum> hashEnumMultimap =
    MultimapBuilder.hashKeys().enumSetValues(MyEnum.class).build();
```

当然也可以直接使用 `create()` 方法。

### BiMap
BiMap 提供了一种新的集合类型，它提供了 key 和 value 的双向关联的数据结构。在使用 BiMap 时，会要求 Value 的唯一性。如果 value 重复了则会抛出错误：java.lang.IllegalArgumentException. 如果想要强制赋值，可以使用 `BiMap.forcePut(key, value)` 这样之前的可能存在的值会被覆盖。

```java
BiMap<String, Integer> userId = HashBiMap.create();
...

String userForId = userId.inverse().get(id);
```

## Cache
通过例子一目了然

```java
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
       .maximumSize(1000)
       .expireAfterWrite(10, TimeUnit.MINUTES)
       .build(
           new CacheLoader<Key, Graph>() {
             public Graph load(Key key) throws AnyException {
               return createExpensiveGraph(key);
             }
           });
```

## Functional idioms

## Files 文件操作

### Copy
复制文件，复制文件要求源地址和目的地址不一致。如果目的地址文件存在则会被**直接覆盖**。

    File original  = new File("path/to/original");
    File copy = new File("path/to/copy");
    Files.copy(original, copy);

查看方法签名，还支持

    public static void copy(File from, OutputStream to) {}
    public static void write(byte[] from, File to) {}

### Move/Rename
移动或者重命名文件

    File original = new File("src/main/resources/copy.txt");
    File newFile = new File("src/main/resources/newFile.txt");
    Files.move(original, newFile); // 移动或重命名文件，类似 Unix 中的 mv

### Read
将文件读取为字符串列表

    List<String> readLines = Files.readLines(file, Charsets.UTF_8);

### Write
写文件，或者附加内容到文件

    File file = new File("quote1.txt");
    String hamletQuoteStart = "To be, or not to be";
    Files.write(hamletQuoteStart,file, Charsets.UTF_8);// 写文件

    String hamletQuoteEnd = ",that is the question";
    Files.append(hamletQuoteEnd,file,Charsets.UTF_8); // 追加文件

    String overwrite = "Overwriting the file";
    Files.write(overwrite, file, Charsets.UTF_8); // 重写文件


### File Hash
为文件生成 Hash 值

    File file = new File("src/main/resources/sampleTextFileOne.txt");
    HashCode hashCode = Files.hash(file, Hashing.md5());
    System.out.println(hashCode);



## reference

- <https://github.com/google/guava/wiki>
