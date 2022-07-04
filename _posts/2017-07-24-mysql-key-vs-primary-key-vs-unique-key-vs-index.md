---
layout: post
title: "MySQL 中 KEY vs PRIMARY KEY vs UNIQUE KEY vs INDEX 的区别"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, linux, key, index,]
last_updated:
---

对于标题中提出的问题，可以拆分来一步步解决。先来区分 MySQL 中的 `KEY` 和 `INDEX` ，之后问题就可以简化为 PRIMARY KEY，UNIQUE KEY 和 INDEX 的区别。而这三者也正好是索引的划分，主键索引，唯一索引和普通索引（INDEX）。

INDEX 可以用来提高数据库中查询数据的速度。INDEX 通常加在那些 JOIN， WHERE，和 ORDER BY 子句的列上。创建索引时，需要确保该索引是应用在 SQL 查询语句的条件（一般作为 WHERE 子句的条件）。实际上，索引也是一张表，该表保存了主键与索引字段，并指向实体表的记录。

索引也有它的缺点：虽然索引提高了查询速度，却会降低更新表的速度，如对表进行 INSERT、UPDATE 和 DELETE。因为更新表时，MySQL 不仅要保存数据，还要保存一下索引文件。

## MySQL 中 KEY 与 INDEX 区别
KEY 通常是 INDEX 同义词，但实际上还是有区别的。如果关键字属性 PRIMARY KEY 在列定义中已给定，则 PRIMARY KEY 也可以只指定为 KEY。这么做的目的是与其它数据库系统兼容。PRIMARY KEY 是一个唯一 KEY，此时，所有的关键字列必须定义为 NOT NULL。如果这些列没有被明确地定义为 NOT NULL，MySQL 应隐含地定义这些列。

KEY 即键值，是关系模型理论中的一部份，比如有主键（PRIMARY KEY)，外键（Foreign KEY）等，用于数据完整性检验和唯一性约束等。而 INDEX 则处于实现层面，可以对表的任意列建立索引，那么当建立索引的列处于 SQL 语句中的 Where 条件中时，就可以得到快速的数据定位，从而提高检索效率。至于 UNIQUE INDEX，则只是属于 INDEX 中的一种而已，建立了 UNIQUE INDEX 表示此列数据不可重复。

于是，在设计表的时候，KEY 只是要处于模型层面的，而当需要进行查询优化，则对相关列建立索引即可。

### KEY

KEY 是数据库的物理结构，一般理解为**键**，包含两层含义，一是约束，偏重于约束和规范数据库的结构完整性，二是索引，辅助查询。

- primary key 有两个作用，一是约束作用（constraint），用来规范一个存储主键和唯一性，但同时也在此 key 上建立了一个 index；
- unique key 也有两个作用，一是约束作用（constraint），规范数据的唯一性，但同时也在这个 key 上建立了一个 index；
- foreign key 也有两个作用，一是约束作用（constraint），规范数据的引用完整性，但同时也在这个 key 上建立了一个 index；

可见，key 是同时具有 constraint 和 index 的意义。

### INDEX
INDEX 是数据库的物理结构，一般翻译为**索引**，但只辅助查询，会在创建时占用另外的空间。索引分为前缀索引、全文索引等。索引只是索引，不会去约束索引字段的行为。

## PRIMARY KEY 和 UNIQUE KEY 的区别

PRIMARY KEYs（主键） 和 UNIQUE KEYs（唯一键约束） 是类似的， PRIMARY KEY 通常是一列，也有可能多列，通常由他来决定一行数据 (row)。 一张表只能有一个 PRIMARY KEY，但可以有很多 UNIQUE KEY。 当给一列设置为 UNIQUE KEY 之后，不能有两行在该列上有相同的数据。 PRIMARY KEY 不允许有 NULL 值，但是 UNIQUE KEY 可以。

修改表 `ALTER TABLE table_name ADD PRIMARY KEY(column_name, ...)`

总结，相同点：

- PRIMARY KEY 和 UNIQUE KEY 都是用来保证列上数据的为原型
- 都可以在一列或者多列上加


差异点：

- 同一张表 PRIMARY KEY 只能有一个， UNIQUE KEY 可以有多个
- PRIMARY KEY 不能有空值， UNIQUE KEY 可以有。如果 PRIMARY KEY 的 1 个或多个列为 NULL，在增加 PRIMARY KEY 时，列自动更改为 NOT NULL 。而 UNIQUE KEY 对列没有要求是通过参考索引实施的，如果插入的值均为 NULL，则根据索引的原理，全 NULL 值不被记录在索引上，所以插入全 NULL 值时，可以有重复的，而其他的则不能插入重复值。

	alter table t add constraint uk_t_1 UNIQUE (a,b);
	insert into t (a ,b ) values (null,1);    # 不能重复
	insert into t (a ,b ) values (null,null);#可以重复

在 MySQL 中，对于一个 PRIMARY KEY 的列，MySQL 已经自动对其建立了 UNIQUE INDEX，无需重复再在上面建立索引了。

网上关于 PRIMARY KEY 和 UNIQUE INDEX 的一段解释：

    Note that “PRIMARY” is called PRIMARY KEY not INDEX.
    KEY is something on the logical level, describes your table and database design (i.e. enforces referential integrity …)
    INDEX is something on the physical level, helps improve access time for table operations.
    Behind every PK there is (usually) UNIQUE INDEX created (automatically).

## 操作索引 SQL

建立索引会占用磁盘空间的索引文件。

	CREATE INDEX IndexName ON mytable(username(length));

如果是 CHAR，VARCHAR 类型，length 可以小于字段实际长度；如果是 BLOB 和 TEXT 类型，必须指定 length。

在创建表时创建索引：

	CREATE TABLE mytable(
		ID INT NOT NULL,
		username VARCHAR(15) NOT NULL,
		INDEX [INDEXName] (username(length))
	);

删除索引

	DROP INDEX [INDEXName] ON mytable;


