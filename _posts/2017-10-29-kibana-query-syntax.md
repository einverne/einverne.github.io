---
layout: post
title: "kibana query 语法"
aliases: "kibana query 语法"
tagline: ""
description: ""
category: 学习笔记
tags: [kibana, lucene, ]
last_updated: 
---

Kibana 的查询语法基于 Lucene 的[查询语法](http://lucene.apache.org/core/3_5_0/queryparsersyntax.html)，他允许 boolean 值，通配符，过滤器等等操作。


## 字符串查询 {#string-queries}
通常一个查询会包含一个或者多个单词或者组合。一个简单的查询语句就是用引号包含的一组词，比如 "search demo".

如果不包含双引号，Kibana 会单独的去匹配每一个词。

## 正则表达式查询
大部分正则表达式是允许匹配部分字符的，然而在 Lucene 中，正则表达式用来匹配整个字符串，比如 `abcde` 这个字符串

- 使用 `ab.*` 能够匹配
- 但是使用 `abcd` 是不能匹配的

正则表达式中，有一些保留字符

	. ? + * | { } [ ] ( ) " \

这些字符如果出现在表达式中都需要进行转义，比如 `\*` ，或者 `\\`

这些符号的含义和正则表达式一致

- `.` 用来表示任意字符
- `?` 用来表示前面的字符重复一次或零次
- `+` 表示前面的字符重复一次或多次
- `*` 表示前面的字符重复零次或多次
- `{n}` 表示重复n次
- `{n,m}` 表示重复n到m次
- `()` 表示 group, 组合其他使用
- `|` 表示 OR 或者，`(http|https)` http 或者 https 匹配
- `[]` 表示括号中的任意一个

更多的关于正则表达式的内容可以参考任意一本关于正则的书。

补充，在 Kibana 中如下字符都需要转义

	+ - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /

比如查询 `(1+1)=2` 需要使用 `\(1\+1\)\=2`

### 可选表达式

Lucene 中还能够开启一些[扩展](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#_optional_operators)操作。

Complement 模式

比如 `ab~cd` 可以表示字符串以 ab 开始接着跟随一个任意长度非c字符，以d结尾的字符串。

Interval

使用 `<>` 来匹配数字范围， 比如 `foo<1-100>` 可以匹配string `foo90` 却不能匹配 `foo101`

Intersection

符号 `&` 用来连接两个 patterns 两个正则表达式都需要匹配

Any string

符号 `@` 用来匹配所有，和 Intersection 联合使用可以用来表示，匹配所有除了。

比如 `@&~(foo.*)` 用来匹配所有字符，除了以 `foo` 开头的字符

## 范围查询 {#range-queries}

范围查询用来查询一定范围的匹配，比如

	ResponseTime: [10 TO *]

用来查询请求时间大于等于 10 ms 的，或者使用 `ResponseTime: {10 TO *}` 来匹配大于 10 ms 的。

方括号可以表示包括，花括号不包括，所以 `[10 TO 50}` 表示 需要 `10<=value<50` 。

也可以简化写成

	age:(>=10 AND <50)

这样

## Boolean 查询
逻辑运算 AND、OR、NOT 可以用来组合查询语句，这三个运算符必须 **大写** ，更多内容可以查看 [Lucene](http://lucene.apache.org/core/3_5_0/queryparsersyntax.html) 语法。

- `+` 搜索结果中必须包含此项
- `-` 不能含有此项

## 字段名称搜索 {#field-queries}
比如需要查询 `status` 为 `active` 的内容，可以

	status:active

## 近似搜索
在短语后面加 `~` 可以搜到被隔开或者顺序不同的单词。

比如 "where select"~5, 表示 select 和 where 中间可以相隔5个单词。

## reference

- <https://www.elastic.co/guide/en/beats/packetbeat/current/kibana-queries-filters.html>
