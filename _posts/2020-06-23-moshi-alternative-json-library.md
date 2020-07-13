---
layout: post
title: "Moshi : 新一代的 Java 解析 JSON 工具"
tagline: ""
description: "解析 JSON 的另外一个选择"
category:
tags: [java, json, gson, moshi]
last_updated:
---

最近 FastJson 安全问题频发，所以 JSON 解析又被拉到台面上，而正好不久前看 Reddit 看到 Gson 的作者在推荐一个叫 Moshi 的库，这就花点时间看一下。[^1]

[^1]: <https://www.reddit.com/r/androiddev/comments/684flw/why_use_moshi_over_gson/>

## Gson 存在的问题

序列化 Date 的时候不包含时区的信息

	Date epoch = new Date(0);
	String epochJson = new Gson().toJson(epoch);
	// "Dec 31, 1969 7:00:00 PM"

[RFC 3339 标准](https://www.ietf.org/rfc/rfc3339.txt) 里面规定的日期表示法：

	2020-06-12T07:20:50.52Z

其中 `T` 用来分割前面的日期和后面的时间，而最后的 `Z` 表示这个时间是 `UTC+0`，其他人看到这个时间就可以根据自己的时区进行转换。[^rfc]

[^rfc]: <https://medium.com/easyread/understanding-about-rfc-3339-for-datetime-formatting-in-software-engineering-940aa5d5f68a>

Gson 在序列化 HTML 标签时，会进行 HTML escaping 成：

	private String e = "12 & 5";
	private String f = "12 > 6"

	"e":"12 \u0026 5"
	"f":"12 \u003e 6"

### Moshi 优势

- Moshi 库特别小，对于 Android 来说自然可以减小 APK 大小
- Moshi 自带的 Adapter 可以满足大部分的需求，如果需要扩充也非常方便
- 可以使用 `@Json` 来自定义 Field 名
- Kotlin Support
- 使用类似于 `@HexColor int` 的限定符可以让多个 JSON 映射到同一个 Java Type

### Moshi 潜在的问题和 Gson 的差别

- Moshi 只有少量的内置 Adapter，Moshi 不会去序列化平台相关的类型，比如 `java.*`, `javax.*`, `android.*` 等等，以防止被 Lock 在某一个特殊 JDK 或者 Android 版本
- Moshi 只有少量的配置选项，没有 field naming strapegy, versioning, instance creator, long serialization policy.
- Moshi 没有 `JsonElement` 模型
- No HTML-safe escaping

## 使用 {#usage}
更加具体的使用方法可以参考源代码中的实现。

最基本的使用，序列化一个 Java Object 到 JSON，或者将 JSON 映射到 Java Object 里面。

将 JSON 字符串解析成 Java 对象

    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<BlackjackHand> jsonAdapter = moshi.adapter(BlackjackHand.class);

    BlackjackHand blackjackHand = jsonAdapter.fromJson(json);
    System.out.println(blackjackHand);


如果是 JsonArray:

    Moshi moshi = new Moshi.Builder().build();

    Type listOfCardsType = Types.newParameterizedType(List.class, Card.class);
    JsonAdapter<List<Card>> jsonAdapter = moshi.adapter(listOfCardsType);

    List<Card> cards = jsonAdapter.fromJson(json);

序列化 Java Object：

    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<BlackjackHand> jsonAdapter = moshi.adapter(BlackjackHand.class);

    String json = jsonAdapter.toJson(blackjackHand);
    System.out.println(json);


### 自定义 Field
比如有一个 JSON 字符串：

    String json = ""
        + "{"
        + "  \"username\": \"jesse\","
        + "  \"lucky number\": 32"
        + "}\n";

其中的 `lucky number` 是带空格的，假如要解析到 Java Object

	public final class Player {
	  public final String username;
	  public final @Json(name = "lucky number") int luckyNumber;
	}

可以看到使用 `@Json` 注解即可。

## 源码解析

### Moshi

Moshi 只能使用 Builder 模式创建，看其源码会发现，构造函数并不是 public 的。唯一一个带参数的

	  Moshi(Builder builder) {
		List<JsonAdapter.Factory> factories = new ArrayList<>(
			builder.factories.size() + BUILT_IN_FACTORIES.size());
		factories.addAll(builder.factories);
		factories.addAll(BUILT_IN_FACTORIES);
		this.factories = Collections.unmodifiableList(factories);
	  }

可以看到 Moshi 有一系列 adapter() 公开方法，通过 adapter() 方法可以返回一个 `JsonAdapter<>` 对象，之后的操作都在该 `adapter` 之上进行。

成员变量

    private final List<JsonAdapter.Factory> factories;
    private final ThreadLocal<LookupChain> lookupChainThreadLocal = new ThreadLocal<>();
    private final Map<Object, JsonAdapter<?>> adapterCache = new LinkedHashMap<>();

说明：

- `factories`: 是 JsonAdapter.Factory 数组，工厂模式产生 JsonAdapter
- lookupChainThreadLocal 是一个 ThreadLocal 内部存放了 `LookupChain`
- `adapterCache` 是一个 `LinkedHashMap` 用来保存 Object 到 JsonAdapter 的映射关系


Moshi 类中初始化的时候有 5 个内置的 Adapter Factory.

	  static final List<JsonAdapter.Factory> BUILT_IN_FACTORIES = new ArrayList<>(5);

	  static {
		BUILT_IN_FACTORIES.add(StandardJsonAdapters.FACTORY);
		BUILT_IN_FACTORIES.add(CollectionJsonAdapter.FACTORY);
		BUILT_IN_FACTORIES.add(MapJsonAdapter.FACTORY);
		BUILT_IN_FACTORIES.add(ArrayJsonAdapter.FACTORY);
		BUILT_IN_FACTORIES.add(ClassJsonAdapter.FACTORY);
	  }

- StandardJsonAdapters.FACTORY 包含了基本类型，包装类型，还有运行时才能决定的 ObjectJsonAdapter
- CollectionJsonAdapter.FACTORY 包含 List, Collection, Set 类型
- MapJsonAdapter.FACTORY 包含将 Map(Key 是 String) 的 JSON 转换成 Object 的 Adapter
- ArrayJsonAdapter.FACTORY 处理包含了原始值或 Object 的 JSON Array
- ClassJsonAdapter.FACTORY

### Moshi.Builder
Moshi.Builder 是 Moshi 内部的一个类，用来创建 Moshi，它有一系列方法：

	com.squareup.moshi.Moshi.Builder#add(java.lang.reflect.Type, com.squareup.moshi.JsonAdapter<T>)
	com.squareup.moshi.Moshi.Builder#add(java.lang.reflect.Type, java.lang.Class<? extends java.lang.annotation.Annotation>, com.squareup.moshi.JsonAdapter<T>)
	com.squareup.moshi.Moshi.Builder#add(com.squareup.moshi.JsonAdapter.Factory)
	com.squareup.moshi.Moshi.Builder#add(java.lang.Object)
	com.squareup.moshi.Moshi.Builder#addAll
	com.squareup.moshi.Moshi.Builder#build

可以看到除了 overload 重载的 `add()` 方法外，就是 `build` 方法，而 `add()` 方法可以添加一系列类型。


### JsonAdapter 抽象类

JsonAdapter 的公开方法：

	com.squareup.moshi.JsonAdapter#fromJson(com.squareup.moshi.JsonReader)
	com.squareup.moshi.JsonAdapter#fromJson(okio.BufferedSource)
	com.squareup.moshi.JsonAdapter#fromJson(java.lang.String)
	com.squareup.moshi.JsonAdapter#toJson(com.squareup.moshi.JsonWriter, T)
	com.squareup.moshi.JsonAdapter#toJson(okio.BufferedSink, T)
	com.squareup.moshi.JsonAdapter#toJson(T)
	com.squareup.moshi.JsonAdapter#toJsonValue
	com.squareup.moshi.JsonAdapter#fromJsonValue
	com.squareup.moshi.JsonAdapter#serializeNulls
	com.squareup.moshi.JsonAdapter#nullSafe
	com.squareup.moshi.JsonAdapter#nonNull
	com.squareup.moshi.JsonAdapter#lenient
	com.squareup.moshi.JsonAdapter#failOnUnknown
	com.squareup.moshi.JsonAdapter#indent

JsonAdapter 有两个抽象方法需要实现 `fromJson` 和 `toJson`。

大致就能看出 JsonAdapter 的主要功能：

- 一方面提供 `fromJson` to `toJson`的转换
- 另一方面提供转换过程中的一些选项

	- `serializeNulls` serializes nulls when encoding JSON
	- `nullSafe` support for reading and writing
    - 比如 `nonNull` 调用时会返回一个不允许 null 值的 JsonAdapter
	- `lenient` 宽容处理 JSON
	- `failOnUnknown` 在遇到未知的 name 或 value 时抛出 `JsonDataException` 异常
	- `indent` 输出的 JSON 是格式化好的

JsonAdapter 主要去处理各个类型的转换，需要实现如下三个方法：

	  static final JsonAdapter<Boolean> BOOLEAN_JSON_ADAPTER = new JsonAdapter<Boolean>() {
		@Override public Boolean fromJson(JsonReader reader) throws IOException {
		  return reader.nextBoolean();
		}

		@Override public void toJson(JsonWriter writer, Boolean value) throws IOException {
		  writer.value(value.booleanValue());
		}

		@Override public String toString() {
		  return "JsonAdapter(Boolean)";
		}
	  };


### JsonAdapter.Factory 接口

这个接口定义在抽象类 JsonAdapter 中，Factory 只需要实现一个方法：

	  public interface Factory {
		@CheckReturnValue
		@Nullable JsonAdapter<?> create(Type type, Set<? extends Annotation> annotations, Moshi moshi);
	  }

Factory 看名字也能猜到这是一个工厂方法，用来创造给定 Type 给定 Annotation 类型的 Adapter，如果无法创建则返回 null.

在 Factory 的实现中，可能会使用 moshi.adapter 来构建 Adapter.


### Mosh.Builder

再看 Moshi.Builder 类成员

	final List<JsonAdapter.Factory> factories = new ArrayList<>();



在源代码的基础上加了一些注释

- <https://github.com/einverne/moshi/tree/annotation>

## reference

- <https://medium.com/square-corner-blog/moshi-another-json-processor-624f8741f703>
- <https://www.reddit.com/r/androiddev/comments/684flw/why_use_moshi_over_gson/>
