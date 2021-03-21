---
layout: post
title: "PostgreSQL 数据库支持的数据类型"
tagline: ""
description: ""
category: 学习笔记
tags: [postgresql, database, db, mysql, data-type, ]
last_updated:
---

在之前一篇 [PostgreSQL 初识](/post/2019/08/postgresql-introduction.html) 中就简单的总结了几个常见的数据类型，但是这几个常见的数据类型并不能显示 PostgreSQL 数据库的强大，所以这里再详细学习一下。

## 数值类型
对于数值类型，之前的[内容](/post/2019/08/postgresql-introduction.html) 也已经提到过，整型有

- smallint
- integer
- bigint

这三个类型分别占用 2,4,8 个字节，可表示范围逐渐扩大。

对应着三个自增类型

- smallserial
- serial
- bigserial

分别是 2,4, 8 字节，从 1 开始，不能表示负值，自增属性。

定长的浮点数有

- real, 4 字节
- double precision , 双精度，8 字节

这两种精度是不精确的，如果需要指定精度，那么可以使用

- decimal，存储空间不定，需要指定精度
- numeric，等同于 decimal，二者在 PostgreSQL 中几乎可以等价

## 字符类型

PostgreSQL 支持的字符类型比较简单直白

- varchar(n) 变长，有长度限制
- char(n) 固定长度，不足补空白
- text 可变长度，无长度限制

## 布尔值

PostgreSQL 支持布尔，true/false/null，1 字节长，


## 日期和时间
表示日期和时间，用 date 来表示日期，用 time 来表示一日内时间。date 占用 4 字节。精度为 天。

如果要表示日期加上时间，则需要使用到 timestamp。

PostgreSQL 中有两个 `timestamp`, 带时区和不带时区的，都是占用 8 个字节。精确到毫秒，14 位。

PostgreSQL 还支持时间间隔 interval，可以表示的时间间隔可以从 -178000000 年到 178000000 年。

`inerval` 占用 12 字节，精度为毫秒。

## 几何类型
从下面开始就是发挥 PostgreSQL 巨大潜能的地方了。

PostgreSQL 支持定义几何的点，线，面，图形。

类型  | 占用空间 | 说明 | 表现
-----|---------|------|-------
point | 16 字节 | 平面点 | (x,y)
line | 32 字节 | 直线 | ((x1,y1).(x2,y2))
lseg | 32 字节 | 线段 | ((x1,y1).(x2,y2))
box | 32 字节 | Box 矩形 | ((x1,y1).(x2,y2))
path | 16n + 16n 字节 | 闭合路径，多边形 | ((x1,y1),...)
path | 16n + 16n 字节 | 开放路径 | [(x1,y1),...]
polygon | 40+16n 字节 | 多边形 | ((x1,y1)...)
circle | 24 字节 | 圆 | <(x,y),r>

## 网络地址
神奇地原生支持网络上常用的 IP 或者 Mac 地址类型

- cider, IPv4 或者 IPv6 地址
- Inet, IPv4 地址
- macaddr， MAC 地址

## 枚举类型
枚举类型不同于其他类型，需要事先定义

    CREATE TYPE hair_color AS ENUM
    ('brown','black','red','grey','blond')

## UUID 类型
uuid 数据类型用来存储 RFC 4122，ISO/IEF 9834-8:2005 以及相关标准定义的通用唯一标识符（UUID）。由算法产生的 128 位标识符，使它不可能在已知使用相同算法的模块中和其他方式产生的标识符相同。对分布式系统而言，UUID 标识符比序列能更好的提供唯一性保证，因为序列只能在单一数据库中保证唯一。

UUID 被写成一个小写十六进制数字的序列，由短横线分字符分成几组， 8 位数字 +3 组 4 位数字 + 一组 12 位数字，总共 32 个 16 进制数字代表 128 位， 一个这种标准的 UUID 例子如下：

	b03e4c89-9a0b-5eb8-ba7d-6ac6bd340b21

## XML 类型
XML 类型是 text 类型的扩展，不过 XML 类型相较于 text，增加了 XML 合法性校验。

## JSON 类型
PostgreSQL 提供两种类型的 JSON 类型。

- JSON
- JSONB

二者的区别

json       | jsonb
-----------|-----------------
text 类型扩展，增加 JSON 格式校验 | JSON 数据二进制表示
插入快，但是查询慢 | 插入慢，查询快
保存时原样保存，可能包含空白 | 支持索引，可能优化空白以优化查询
会在查询时重新解析 | 在查询时不需要解析

大部分的使用场景都会使用 JSONB 类型，除非你明确知道为什么要使用 JSON 类型。

    CREATE TABLE employee (
      id serial NOT NULL PRIMARY KEY,
      age integer NOT NULL,
      data jsonb
    );

在 JSONB 上新建索引

	CREATE INDEX idx_name ON user_info((data->>'name'));

插入

	INSERT INTO employee VALUES (1, 35, '{"name": "Tom Price", "tags": ["Motivated", "SelfLearner"], "items": {"phone": "iphone7", "camera": "canon"}, "onboareded": true}');
	INSERT INTO employee VALUES (2, 35, '{"name": "Alex Watt", "tags": ["Physicist", "Photographer"], "items": {"phone": "Pixel", "camera": "sony a7m3"}, "onboareded": true}');

可以使用 `->` 来通过 key 获取 json 内容对应 key 的值：

	select data -> 'name' AS name from employee;

通过

    select data->'items'->>'phone' as items from employee;

`->` 和 `->>` 的区别在于， `->` 获取的结果是 JSON Object，而 `->>` 会将结果转为 text。在 where 语句中使用

	select * from employee where data->'items'->>'phone' = 'iphone7';
	# or
	select * from employee where data@>'{"name":"Alex Watt"}';

操作符 `@>` 用来表示包含。

获取数组中的第一个

	select data->'tags'->>0 from employee;

注意这里的 `->>0` 两个 `>>` 都是表示最后取出来的值为 text.

JSON 还支持一种复杂语法 `#>` 和 `#>>`

	select data#>>'{tags,0}' from employee;

等效于上面的获取数组中第一个元素。

如果结果是 List，PostgreSQL 支持展开数组中的内容。

	select jsonb_array_elements_text(data->'tags') from employee where id = 1;

这个结果就是 List 内容。

其他更多 [PostgreSQL JSON Function](https://www.postgresql.org/docs/current/functions-json.html)

当然使用 JSONB 也还有缺点，比如上面提到的插入慢，因为需要解析存储，聚合查询也会比较慢。最好的解决办法就是把经常需要聚合操作的列设计到普通列中。
更多的文章可以参考这篇，[何时避免使用 JSONB](https://heap.io/blog/engineering/when-to-avoid-jsonb-in-a-postgresql-schema)

## 最佳实践
在 guru99 上给出了一些建议，还是值得提一下：

- 除非想要限制输入长度，否则所有情况优先选择 text
- 不要使用 char
- 除非要存储超大整型，否则使用 int 即可
- 总是选择使用 numeric
- 只有当存在 IEEE 754 data source 数据时再使用 float 类型


## reference

- <https://www.postgresql.org/docs/current/datatype-json.html>
- <https://www.guru99.com/postgresql-data-types.html>
