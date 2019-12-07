---
layout: post
title: "Java 查漏补缺之 stream 中的 collect flatmap reduce 使用"
tagline: ""
description: ""
category: Java
tags: [java, stream, java8, collector,]
last_updated:
---

之前一篇[文章](/post/2018/03/java-stream.html) 介绍了 Java 8 中 stream 基本用法，这里主要说 collect，flatmap，map 这三个比较重要的方法使用。

基础数据结构

	class Person {

		String name;
		int age;

		Person(String name, int age) {
			this.name = name;
			this.age = age;
		}

		@Override
		public String toString() {
			return name;
		}
	}

## collect
下面的例子覆盖了 collect 绝大部分的使用案例。

	@Test
	public void testCollectAdvance() {
		List<Person> persons =
			Arrays.asList(
				new Person("Max", 18),
				new Person("Peter", 23),
				new Person("Pamela", 23),
				new Person("David", 12));

		Supplier<Stream<Person>> supplier = () -> persons.stream();

		Set<Person> nameWithP = supplier.get()
			.filter(p -> p.name.startsWith("P"))
			.collect(Collectors.toSet());
		System.out.println(nameWithP);  // [Pamela, Peter]

		Map<Integer, List<Person>> groupByAge = supplier.get()
			.collect(Collectors.groupingBy(p -> p.age));
		System.out.println(groupByAge);

		Double averageAge = supplier.get()
			.collect(Collectors.averagingInt(p -> p.age));
		System.out.println(averageAge);

		IntSummaryStatistics ageSummary = supplier.get()
			.collect(Collectors.summarizingInt(p -> p.age));
		System.out.println(ageSummary);

		String phrase = supplier.get()
			.filter(p -> p.age >= 18)
			.map(p -> p.name)
			.collect(Collectors.joining(" and ", "In Germany ", " are of legal age."));
		System.out.println(phrase);

		Map<Integer, String> map = supplier.get()
			.collect(Collectors.toMap(
				p -> p.age,
				p -> p.name,
				(name1, name2) -> name1 + ";" + name2
			));
		System.out.println(map);

		// 如果要实现自己的 collector
		Collector<Person, StringJoiner, String> personStringJoinerStringCollector = Collector.of(
			() -> new StringJoiner(" | ", "[ ", " ]"),          // supplier
			(j, p) -> j.add(p.name.toUpperCase()),  // accumulator
			(j1, j2) -> j1.merge(j2),               // combiner
			StringJoiner::toString                  // finisher
		);
		String personStr = supplier.get().collect(personStringJoinerStringCollector);
		System.out.println(personStr);
	}

JDK 为我们实现了大部分常用的 Collector，都可以在 `Collectors` 类中查看。而如果我们要想实现自己的 Collector ，则需要提供四个实现，supplier，accumulator，combiner，finisher。

首先使用 `Collector.of` 这个静态方法来创建自定义 collector，这个静态方法需要上面提到的四个参数。

### supplier 提供结果的容器
supplier 需要提供一个存放结果的容器，accumulator 的内容会存放在 supplier 中，比如上面例子中

    () -> new StringJoiner(" | ")

### accumulator 定义累加器
accumulator 将累加结果添加到 supplier 创建的结果容器中，该方法有两个参数，第一个参数为 supplier 提供的结果，另一个为流中的数据

    (joiner, person) -> joiner.add(person.name.toUpperCase())

### combiner 合并两个局部结果
在 sequential reduction 中上面两步已经足够，但是为了支持 parallel 需要提供 combiner, combiner 是定义两个结果如何合并的方法，在 parallel 的场景下，流会被分为多个部分计算，最后结果需要按照 combiner 中定义的方法来合并。

    (j1, j2) -> j1.merge(j2)

### finisher 结果处理
虽然之前定义了 StringJoiner 来存放结果，但其实我们需要的并不是 StringJoiner，而是一个 String，所以在结果返回的时候，我们可以将 StringJoiner map 到 String 来作为返回。

`Collector.of` 最后有一个可变参数 `Characteristics` ，这个参数有三个取值：

- `CONCURRENT` 表明一个 result container 可以同时被多个 accumulator 使用
- `IDENTITY_FINISH` 表明 finisher 方法是 identity function ，可以被省略
- `UNORDERED` 表明 colletor 不依赖于元素的排序

更多关于 Collector 的内容可以参考 [Java doc](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collector.html)

## FlatMap
之前的[文章](/post/2018/03/java-stream.html) 已经讨论过将流中的对象通过 map 转成另外一种对象，但是 map 有一个限制每一个对象只能被 map 到另外一个对象，如果要将一个对象转变为多个对象，或者变成 none 呢？所以 `FlatMap` 就是做这个用途的。

引入基本数据结构

	class Foo {

		String name;
		List<Bar> bars = new ArrayList<>();

		Foo(String name) {
			this.name = name;
		}

		@Override
		public String toString() {
			return "Foo{" +
				"name='" + name + '\'' +
				", bars=" + bars +
				'}';
		}
	}

	class Bar {

		String name;

		Bar(String name) {
			this.name = name;
		}

		@Override
		public String toString() {
			return "Bar{" +
				"name='" + name + '\'' +
				'}';
		}
	}

然后填充一些数据

	@Test
	public void testFlatMapAdvanced() {
		List<Foo> foos = Lists.newArrayList();

		IntStream.range(1, 4).forEach(i -> foos.add(new Foo("Foo" + i)));
		foos.forEach(f -> IntStream.range(1, 4)
			.forEach(i -> f.bars.add(new Bar("Bar" + i + " <- " + f.name))));

		Supplier<Stream<Foo>> supplier = foos::stream;
		supplier.get()
			.flatMap(f -> f.bars.stream())
			.forEach(b -> System.out.println(b.name));

		List<Bar> list = supplier.get()
			.flatMap(f -> f.bars.stream())
			.collect(Collectors.toList());
		System.out.println(list);
	}

FlatMap 将这个双层的数据结构拍扁，生成一个 `List<Bar>`

## Reduce
Reduction 操作将流中的所有元素缩减到一个结果， Java 8 中支持三种方式的 `reduce` 操作。

    reduce(BinaryOperator<T>)
    reduce(T, BinaryOperator<T>)
    reduce(U, BiFunction<U, ? super T, U>, BinaryOperator<U>)

第一种方法接受一个 BinaryOperator accumulator 方法，其实是一个两边类型相同的 BiFunction。BiFunction 和 Function 类似，但是接受两个参数。

    List<Person> persons =
        Arrays.asList(
            new Person("Max", 18),
            new Person("Peter", 23),
            new Person("Pamela", 23),
            new Person("David", 12));

    Supplier<Stream<Person>> supplier = persons::stream;
    supplier.get().reduce((p1, p2) -> p1.age > p2.age ? p1 : p2)
        .ifPresent(System.out::println);

第二种方法接受两个参数一个 T，一个 BinaryOperator，比如说可以汇总四个 Person 到一个新的 Person

		Person finalPerson = supplier.get()
        .reduce(new Person("", 0), (p1, p2) -> {
            p1.age += p2.age;
            p1.name = p1.name.concat(p2.name);
            return p1;
        });
    System.out.println(finalPerson);

第三种方法接受三个参数，一个 T，一个 BiFunction (accumulator)，一个 BinaryOperator (combiner function)，如果我们只想要所有 Person 的年龄总和，其实上面的例子中并不需要 name 的值，所以可以添加一个 BiFunction （累加器）

    Integer totalAge = supplier.get()
        .reduce(
            0,
            (sum, p) -> {
                System.out.format("accumulator: sum=%s; person=%s\n", sum, p);
                return sum += p.age;
            },
            (sum1, sum2) -> {
                System.out.format("combiner: sum1=%s; sum2=%s", sum1, sum2);
                return sum1 + sum2;
            }
        );
    System.out.println(totalAge);

打印内容

    accumulator: sum=0; person=Person{name='Max', age=18}
    accumulator: sum=18; person=Person{name='Peter', age=23}
    accumulator: sum=41; person=Person{name='Pamela', age=23}
    accumulator: sum=64; person=Person{name='David', age=12}
    76

通过打印的内容可以看到 accumulator 打印出了所有内容，sum 一直在累加，但是观察发现 combiner 根本没有做任何操作。这是因为我们创建的这个 stream 是一个串行的，而不是 parallelStream()，所以没有调用到 combiner。如果换成下面这种方式就能看到区别了。

    Integer ageSum = persons
        .parallelStream()
        .reduce(0,
            (sum, p) -> {
                System.out.format("accumulator: sum=%s; person=%s\n", sum, p);
                return sum += p.age;
            },
            (sum1, sum2) -> {
                System.out.format("combiner: sum1=%s; sum2=%s\n", sum1, sum2);
                return sum1 + sum2;
            });

    // accumulator: sum=0; person=Pamela
    // accumulator: sum=0; person=David
    // accumulator: sum=0; person=Max
    // accumulator: sum=0; person=Peter
    // combiner: sum1=18; sum2=23
    // combiner: sum1=23; sum2=12
    // combiner: sum1=41; sum2=35

## reference

- <http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/>
