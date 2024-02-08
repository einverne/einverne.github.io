---
layout: post
title: "Datadog 日志搜索语法总结"
aliases:
- "Datadog 日志搜索语法总结"
tagline: ""
description: ""
category: 经验总结
tags: [datadog, log, logstash, saas, logback ]
create_time: 2024-02-06 17:31:34
last_updated: 2024-02-06 17:31:34
---

[Datadog](https://datadoghq.com) 成立于 2010 年，是一家面向开发者、IT 运维团队及业务人员的云监控平台公司，致力于为企业客户提供底层系统和上层应用的实时监控、分析能力。

日志管理产品，可观测数据 log, metric, trace 集一身的方案。Datadog 的日志查询有一套自己的语法，但是都比较好了解，所以这里也整理一下。

## 概述 Overview

查询过滤器由两部分组成 terms (术语) 和 operators(运算符)。

两种类型的术语:

- single term 是一个单词，比如 `test`
- sequence 是一组通过双引号包围的短语，比如 `hello world`

将多个术语通过如下的操作符组成形成复杂的查询语句。

- AND，满足所有条件
- OR，任意术语包含
- -，术语不包含

## Escape special characters and spaces

下面这一些是特殊字符

```
+ - = && || > < ! ( ) { } [ ] ^ " “ ” ~ * ? : \
```

如果要查询这些特殊字符需要使用 `\` 来转义。

## 属性搜索

按照特定的属性进行搜索，可以使用 `@` 指定。

比如想要查询 url 是 `example.com` 的记录

```
@url:example.com
```

更多例子

- `@http.url_details.path:"/api/v1/test"` 搜索 http.url_details.path 中与 `/api/v1/test` 匹配的所有日志
- `@http.url:\/api\/v1\/*` 搜索包含以 `/api/v1` 开头的 `http.url` 属性中的值的所有日志
- `@http.status_code:[200 TO 299] @http.url_details.path:\/api\/v1\/*` 包含范围 code 和以 `/api/v1` 开头的属性的日志
- `-@http.status_code:*` 搜索不包含属性的日志

## 通配符

- `?` 匹配单个字符
- `*` 通配

## 数值

比如所有的接口请求都有延迟

```
@http.response_time:>1000
```

或者搜索特定的范围

```
@http.status_code:[400 TO 499]
```

## 标签 Tags

匹配带有标签 `env:prod` 或标签 `env:test` 的所有日志

```
env:(prod OR test)
```

匹配包含标签 `env:prod` 且不包含标签 `version:beta` 的日志

```
(env:prod AND -version:beta)
```
