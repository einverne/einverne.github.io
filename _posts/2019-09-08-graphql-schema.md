---
layout: post
title: "理解 GraphQL Schema 结构定义"
tagline: ""
description: ""
category: 学习笔记
tags: [graphql, schema, graphql-schema, datatype, ]
last_updated:
---

在上一篇 [GraphQL 使用](/post/2019/09/graphql-use.html) 中了解了 GraphQL 大致用法，如果要更加深入的了解 GraphQL ，那就不得不重新从 Schema 来认识 GraphQL，说到底 GraphQL 还是一个强类型定义，客户端可操作的类型都是需要提前定义好的，这个结构就是这篇文章的重点 Schema.

因为已经有很多的语言已经实现了 GraphQL，官方不能以某一个语言来具体表达，所以他们自定义了一套表示 GraphQL Schema 的简单表达。[^schema]

[^schema]: https://graphql.org/learn/schema/

## 内置类型 {#scalar-types}
GraphQL 自带一些默认类型

- Int, 32 位有符号整型
- Float，双精度有符号浮点类型。
- String， UTF-8 字符串
- Boolean，`true` or `false`
- ID， 表示唯一标识，通常用来作为主键来获取内容。ID type 和 String 类型使用相同方式序列化，但是如果定义为 `ID`，那么不可读。

不同的实现，可能会有自己的类型，比如 Date 类型，具体实现要看各个语言。

## Enumeration types
枚举类型，将输入固定为几个预定义的值。

## Lists and Non-Null
GraphQL 可以表达非空，使用 `!` 即可。

	type Character {
	  name: String!
	  appearsIn: [Episode]!
	}

或者使用如下来表达非空数组

	myField: [String]!

或者可以使用

	myField: [String!]

来表达数组可以为空，但是元素不能为 null

## Interfaces
GraphQL 支持 Interfaces，直面来看就是接口，GraphQL 可以定义接口，每个接口可以有不同的实现。 [^interface]

[^interface](https://graphql.org/learn/schema/#interfaces)

## reference

- <https://graphql.org/learn/schema/>
