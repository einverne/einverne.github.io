---
layout: post
title: "MyBatis 自动生成的 Java client 方法区别"
tagline: ""
description: ""
category: 学习笔记
tags: [java, mybatis, mysql, ]
last_updated:
---

MyBatis 自动生成的 Java client generator 会产生如下的方法；

- countByExample
- deleteByPrimaryKey
- deleteByExample
- insert
- insertSelective
- selectByPrimaryKey
- selectByExample
- selectByExampleWithBLOBs
- updateByPrimaryKey (with an override to specify whether or not to update BLOB columns)
- updateByPrimaryKeySelective (will only update non-null fields in the parameter class)
- updateByExample (with an override to specify whether or not to update BLOB columns)
- updateByExampleSelective (will only update non-null fields in the parameter class)

前面一些方法看名字都能知道其用法，但是有些还是有些模棱两可。比如 withBLOBs 和 没有 BLOB 方法的区别。

## selectByExample 和 selectByExampleWithBLOBs 区别

如需检索的字段中包含大字段类型时，必须用 selectByExampleWithBLOBs，不检索大字段时，用 selectByExample 就足够了。update 同样如此。


## MyBatis Generator

generatorConfiguration 配置，文档地址[这里](http://www.mybatis.org/generator/configreference/generatorConfiguration.html)，每个子元素文档都存在。


