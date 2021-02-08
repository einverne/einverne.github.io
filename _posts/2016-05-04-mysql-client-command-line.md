---
layout: post
title: "MySQL 客户端命令行使用技巧"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, cli, mysql-cli, linux, ]
last_updated:
---

本文会列举一些 MySQL 常用的客户端命令，已经一些使用经验。MySQL 客户端命令会知道 SQL 语句以分号 `;`，或者 `\g` 或者 `\G` 结尾。

## 使用 \G
通常 mysql client 都是以表格的形式显示结果，通常情况排版会有一些问题，这时可以使用 `\G`，比如说

    SHOW DATABASES \G

此时的输出结果会用 `*` 号来优化显示，

## 使用 \P 设置 pager

在 Linux 系统下，可以使用 **pager** 程序来显示超长的输出结果， pager 提供了在结果中导航的功能，可以使用键盘，鼠标，或者其他方法来在结果中快速导航。一些好的 pager 可以使 `less`, `more` `lv` 等等。

首先使用 `\P` 来查看

    MariaDB [(none)]> \P

然后使用 `\P less` 来设置。

有些结果可能只关心其中列，比如

    SHOW ENGINE InnoDB STATUS \G

如果只关心 IO 可以设置 `\P grep 'I/O thread'` 那么再次运行上面的命令，结果就是过滤后的了。

另一个比较有意思的 pager 是 md5sum，将 md5sum 设置为 pager ，那么结果是每一个查询输出都会显示 MD5 hash，通常可以用来比较两个结果是否一样。

    \P md5sum
    SELECT * from XXXX

## 存储引擎
InnoDB 成为了 MariaDB 5.5 和 MySQL 5.5 的默认存储引擎。Percona 维护一个 InnoDB 的 fork 分支。

TokuDb 引擎由 Tokutek 开发，从 5.5 起包含在 MariaDB 中，需要安装并单独开启。支持 transactions with savepoints, XA transactions , 但是不支持外键全文索引。和 InnoDb 非常不同，只要是使用了一个新的数据结果用来索引：the fractal trees. 和 B 树相似，但是每个节点都有缓存。另一个 TokuDb 的特征是数据压缩，数据压缩不能禁用。

MyISAM 历史的存储引擎，MySQL 和 MariaDB 在 5.5 版本以下的默认。

## reference

- 《Mastering MariaDB》
- [[MySQL]]


