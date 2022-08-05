---
layout: post
title: "MyBatis 中 insert 和 insertSeletive 区别"
aliases: "MyBatis 中 insert 和 insertSeletive 区别"
tagline: ""
description: ""
category: 学习笔记
tags: [mybatis, mysql, orm, java, ]
last_updated:
---

MyBatis generator 自动生成的 mapper 文件中有两个 insert 方法，`insert` 和 `insertSelective`，这两个方法都可以插入一条数据

对于 insert:

    int insert(T record);

对于 insertSelective

    int insertSelective(T record);

`insertSelective` 对应的 SQL 语句加入了 NULL 检验，**只会插入数据不为 null 的字段**，而 `insert` 会插入所有字段，会插入 null 数据。

也就意味着如果定义了表 default 字段，使用 insert 还是会插入 null 而忽略 default

insertSelective 当字段为 null 时会用 default 自动填充。

## 扩展
同理，更新 update 的操作也有对应的两个方法

- `updateByPrimaryKey` 对你注入的字段全部更新（不判断是否为 Null）
- `updateByPrimaryKeySelective` 会对字段进行判断再更新（如果为 Null 就忽略更新）

和 insert , insertSelective 类似，带有 `selective` 的方法会检查对象的值是否 null，如果为 null 则不会更新。



