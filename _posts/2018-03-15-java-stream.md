---
layout: post
title: "Java 查漏补缺之 stream"
aliases: "Java 查漏补缺之 stream"
tagline: ""
description: ""
category: Java
tags: [java, java-stream, java-collections, guava, java8]
last_updated:
---

Java 8 中 stream 大大简化了 Collection 的操作，所以这篇文章就简单的了解下 stream 的基本用法，关于 collect，flatmap，map 等等更加高级的用法可能还需要[另开一篇](/post/2018/03/java-stream-collect-flatmap-reduce-usage.html) 总结。

Stream API 借助于同样新出现的 Lambda 表达式，极大的提高编程效率和程序可读性。同时它提供串行和并行两种模式进行汇聚操作，并发模式能够充分利用多核处理器的优势，使用 fork/join 并行方式来拆分任务和加速处理过程。

## 创建 stream
有很多种方法

1. 通过集合的 `stream()` 方法或者 `parallelStream()`，比如 `Arrays.asList(1,2,3).stream()`
2. 通过 `Arrays.stream(Object[])` 方法，比如 `Arrays.stream(new int[]{1,2,3})`
3. 使用流的静态方法，比如 `Stream.of(Object[])`, `IntStream.range(int, int)` 或者 Stream.iterate(Object, UnaryOperator)，如 Stream.iterate(0, n -> n * 2)，或者 `generate(Supplier<T> s)` 如 Stream.generate(Math::random)
4. BufferedReader.lines() 从文件中获得行的流
5. Files 类的操作路径的方法，如 list、find、walk 等
6. 随机数流 Random.ints()
7. 其它一些类提供了创建流的方法，如 BitSet.stream(), Pattern.splitAsStream(java.lang.CharSequence), 和 JarFile.stream()
8. 更底层的使用 StreamSupport，它提供了将 Spliterator 转换成流的方法

## intermediate operations
**中间操作**会返回一个新的流，并且操作是延迟执行的 (lazy)，它不会修改原始的数据源，而且是由在终点操作开始的时候才真正开始执行。 这个 Scala 集合的转换操作不同，Scala 集合转换操作会生成一个新的中间集合，显而易见 Java 的这种设计会减少中间对象的生成。

### distinct
distinct 保证输出的流中包含唯一的元素，它是通过 Object.equals(Object) 来检查是否包含相同的元素。

    List<String> list = Arrays.asList("a", "b", "a", "c").stream()
            .distinct()
            .collect(Collectors.toList());
    System.out.println(list); //[a, b, c]

### filter
filter 返回的流中只包含满足断言 (predicate) 的数据。

    List<Integer> list = IntStream.range(1, 10)
            .filter(i -> i % 2 == 0)
            .boxed()
            .collect(Collectors.toList());
    System.out.println(list); // [2, 4, 6, 8]

对于原始类型，stream 无法处理，需要调用 boxed 将其装换成对应的 wrapper class

    List<Integer> ints = IntStream.of(1,2,3,4,5)
                    .boxed()
                    .collect(Collectors.toList());

### map
map 方法将流中的元素映射成另外的值，新的值类型可以和原来的元素的类型不同。

    List<Integer> list = Stream.of("A", "B", "C")
            .map(c -> c.hashCode())
            .collect(Collectors.toList());
    System.out.println(list); // [65, 66, 67]

也可以有 mapToInt

    Stream.of("a1", "a2", "a3")
        .map(s -> s.substring(1))
        .mapToInt(Integer::parseInt)
        .max()
        .ifPresent(System.out::println);  // 3

### flatmap
`flatmap` 方法混合了 `map` + `flattern` 的功能，它将映射后的流的元素全部放入到一个新的流中。它的方法定义如下：

    <R> Stream<R> flatMap(Function<? super T,? extends Stream<? extends R>> mapper)

可以看到 mapper 函数会将每一个元素转换成一个流对象，而 `flatMap` 方法返回的流包含的元素为 mapper 生成的所有流中的元素。

    List<List<String>> lists = Arrays.asList(Arrays.asList("a", "b"), Arrays.asList("c", "d"));
    List<String> collect = lists.stream()
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
    System.out.println(collect); // [a, b, c, d]

### limit
limit 方法指定数量的元素的流。对于串行流，这个方法是有效的，这是因为它只需返回前 n 个元素即可，但是对于有序的并行流，它可能花费相对较长的时间，如果你不在意有序，可以将有序并行流转换为无序的，可以提高性能。

    List<Integer> l = IntStream.range(1,100).limit(5)
            .boxed()
            .collect(Collectors.toList());
    System.out.println(l);//[1, 2, 3, 4, 5]

### peek
peek 方法方法会使用一个 Consumer 消费流中的元素，但是返回的流还是包含原来的流中的元素。

    String[] arr = new String[]{"a","b","c","d"};
    Arrays.stream(arr)
            .peek(System.out::println) //a,b,c,d
            .count();

### sorted

`sorted()` 将流中的元素按照自然排序方式进行排序，如果元素没有实现 Comparable，则终点操作执行时会抛出 `java.lang.ClassCastException` 异常。 `sorted(Comparator<? super T> comparator)`可以指定排序的方式。

对于有序流，排序是稳定的。对于非有序流，不保证排序稳定。

    List<String> list = Arrays.asList("ac", "ab", "bc", "dc", "ad", "ea").stream()
            .sorted((a, b) -> {
                if (a.charAt(0) == b.charAt(0)) {
                    return a.substring(1).compareTo(b.substring(1));
                } else {
                    return b.charAt(0) - a.charAt(0);
                }
            }).collect(Collectors.toList());
    System.out.println(list);

### skip
skip 返回丢弃了前 n 个元素的流，如果流中的元素小于或者等于 n，则返回空的流。


## terminal operations
终点操作，这些操作都是返回 Void ，所以不能在调用之后再使用中间操作。

### match
这一组方法用来检查流中的元素是否满足断言。

- allMatch 只有在所有的元素都满足断言时才返回 true, 否则 false, 流为空时总是返回 true
- anyMatch 只有在任意一个元素满足断言时就返回 true, 否则 false,
- noneMatch 只有在所有的元素都不满足断言时才返回 true, 否则 false,

```
public boolean allMatch(Predicate<? super T> predicate)
public boolean anyMatch(Predicate<? super T> predicate)
public boolean noneMatch(Predicate<? super T> predicate)
```

举例

```
System.out.println(Stream.of(1, 2, 3, 4, 5).allMatch(i -> i > 0)); //true
System.out.println(Stream.of(1, 2, 3, 4, 5).anyMatch(i -> i > 0)); //true
System.out.println(Stream.of(1, 2, 3, 4, 5).noneMatch(i -> i > 0)); //false
System.out.println(Stream.<Integer>empty().allMatch(i -> i > 0)); //true
System.out.println(Stream.<Integer>empty().anyMatch(i -> i > 0)); //false
System.out.println(Stream.<Integer>empty().noneMatch(i -> i > 0)); //true
```

### count
count 返回流中的元素数量，返回类型 `long`

    long count = Stream.of(1, 2, 3, 4).count();
    System.out.println(count);

实现为

    mapToLong(e -> 1L).sum();

### collect
`collect` 方法是一个非常有用的终止操作，可以将 stream 转化成各种需要的结果，List，Set，Map 等等。`collect` 接受 Collector 作为参数，该参数支持四种操作：a supplier, an accumulator, a combiner and a finisher。听起来非常复杂，其实 Java 8 通过内建的 `Collectors` 类提供了绝大多数方法。

使用一个 collector 执行 mutable reduction 操作。辅助类 Collectors 提供了很多的 Collector，可以满足我们日常的需求，你也可以创建新的 Collector 实现特定的需求。它是一个值得关注的类，你需要熟悉这些特定的收集器，如聚合类 averagingInt、最大最小值 maxBy minBy、计数 counting、分组 groupingBy、字符串连接 joining、分区 partitioningBy、汇总 summarizingInt、化简 reducing、转换 toXXX 等。

    .collect(Collectors.toList());

### find
`findAny()` 返回任意一个元素，如果流为空，返回空的 Optional，对于并行流来说，它只需要返回任意一个元素即可，所以性能可能要好于 `findFirst()`，但是有可能多次执行的时候返回的结果不一样。
findFirst() 返回第一个元素，如果流为空，返回空的 Optional。

### forEach forEachOrdered
forEach 遍历流的每一个元素，执行指定的 action。它是一个终点操作，和 peek 方法不同。这个方法不担保按照流的 encounter order 顺序执行，如果对于有序流按照它的 encounter order 顺序执行，你可以使用 forEachOrdered 方法。

    Stream.of(1,2,3,4,5).forEach(System.out::println);

### max min
max 返回流中的最大值，min 返回流中的最小值。

### reduce
reduce 是常用的一个方法，事实上很多操作都是基于它实现的。在流上执行一个缩减操作，返回的结果是 `Optional` ，其中包含缩减的结果。

它有几个重载方法：

    pubic Optional<T> reduce(BinaryOperator<T> accumulator)
    pubic T reduce(T identity, BinaryOperator<T> accumulator)
    pubic <U> U	reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)

第一个方法使用流中的第一个值作为初始值，后面两个方法则使用一个提供的初始值。

    Optional<Integer> total = Stream.of(1,2,3,4,5).reduce( (x, y) -> x +y);
    Integer total2 = Stream.of(1,2,3,4,5).reduce(0, (x, y) -> x +y);

### toArray

将流中的元素放入到一个数组中。

## 重复使用流 {#reusing-stream}
Java 8 默认的流是不能被重用的，一旦使用 terminal operations 流就被关闭了。

    Stream<String> stream =
        Stream.of("d2", "a2", "b1", "b3", "c")
            .filter(s -> s.startsWith("a"));

    stream.anyMatch(s -> true);    // ok
    stream.noneMatch(s -> true);   // exception

重复调用同一个流时，比如上面的例子，就会抛出异常

    java.lang.IllegalStateException: stream has already been operated upon or closed
        at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:229)
        at java.util.stream.ReferencePipeline.noneMatch(ReferencePipeline.java:459)
        at com.winterbe.java8.Streams5.test7(Streams5.java:38)
        at com.winterbe.java8.Streams5.main(Streams5.java:28)

为了克服这种限制，就必须创建 stream supplier，然后在每一次 intermediate operations 时调用

    Supplier<Stream<String>> streamSupplier =
        () -> Stream.of("d2", "a2", "b1", "b3", "c")
                .filter(s -> s.startsWith("a"));

    streamSupplier.get().anyMatch(s -> true);   // ok
    streamSupplier.get().noneMatch(s -> true);  // ok

每一次调用 `get()` 方法都会创建一个新的 stream。


## reference

- <http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/>
