---
layout: post
title: "每天学习一个命令：mysqlbinlog 命令使用"
aliases:
- "每天学习一个命令：mysqlbinlog 命令使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ mysql, mysqlbinlog, linux, database, cli, binary-log, ]
last_updated: 2022-07-30 09:44:51
create_time: 2021-12-07 06:38:14
---

MySQL 或 MariaDB 中，对数据库做的任何操作都会被记录到 Binary Log 日志文件中。

二进制日志文件在主从复制中非常重要。恢复 MySQL 时也会使用到二进制日志文件。

但是 Binary Log 而二进制文件，所以无法直接使用文本查看工具打开看，所以 MySQL 提供了 `mysqlbinlog` 命令。

`mysqlbinlog` 命令是一个以友好可读方式查看 MySQL Binary log 的命令行工具。也可以使用 `mysqlbinlog` 命令来读取内容并用管道传给其他 MySQL 工具集。

MySQL 的 binary log 文件包含了对数据库文件操作的事件。MySQL 服务器会以二进制文件写入。

## 举例

### 获取二进制文件列表
在 MySQL 中执行：

```
mysql> SHOW BINARY LOGS;
```

如果没有开启二进制文件，则会报错 `ERROR 1381 (HY000): You are not using binary logging`

二进制日志文件默认会存放在 /var/lib/mysql 目录下

### 使用 mysqlbinlog 命令
使用：

    mysqlbinlog log_file

`mysqlbinlog` 常用的参数有：

- `-d, --database=db_name` 指定数据库
- `-o, --offset=n` 忽略日志前 n 行
- `-v, -vv`，`-v` 从 binlog 中重建 SQL 语句，`-vv` 增加了注释
- `--start-datetime=datatime, --stop-datetime=datetime` 指定日期间隔内的所有日志
- `--start-position=position, --stop-position=position` 指定位置间隔内的所有日志

### 常用方法
通过 binlog 查看 delete 语句的执行：

    mysqlbinlog /data/mysql_data/bin.000008 --database EpointFrame --base64-output=decode-rows -vv --skip-gtids=true |grep -C 1 -i "delete from Audit_Orga_Specialtype" > /opt/sql.log

说明：

- `/data/mysql_data/bin.000008`：需要解析的 binlog 日志。
- `database`：只列出该数据库下的行数据，但无法过滤 Rows_query_event。
- `base64-output=decode-rows -vv`：显示具体 SQL 语句。
- `skip-gtids=true`：忽略 GTID 显示。
- `grep -C 1 -i "delete from dataex_trigger_record"`：通过管道命令筛选出所需 SQL 及执行时间。
- `/opt/sql.log`：将结果导入到日志文件，方便查看。

### 限定时间范围
设定范围

```
mysqlbinlog --start-datetime='2021-12-06 12:00:00' --stop-datetime='2021-12-06 16:00:00' mysql-bin.0043* |grep 'admin_user' -B 6 A6
```

### 设定位置

```
mysqlbinlog --start-position=120 --stop-position=330 /path/to/binlog.00001
```

### 查看特定数据的 log
可以使用 `-d` 参数来指定特定数据库上的日志：

```
mysqlbinlog -d gogs mysqld-bin.000001
mysqlbinlog --database gogs mysqld-bin.000001
```

## reference

- <https://dev.mysql.com/doc/refman/8.0/en/mysqlbinlog.html>
