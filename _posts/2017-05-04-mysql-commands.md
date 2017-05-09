---
layout: post
title: "MySQL 命令记录"
tagline: ""
description: "记录常用的 MySQL 命令，防止遗忘"
category: 经验总结
tags: [mysql, database, linux]
last_updated: 
---

mysql 命令行操作相关内容，防止遗忘。mysql 常用命令记录，总结。

## install

Under Ubuntu

    sudo apt-get install mysql-server

## 启动停止 mysql 服务
可以使用如下命令启动，停止，重启 MySQL 服务

	sudo /etc/init.d/mysql {start | stop | status | restart}

	sudo service mysql {start | stop | status | restart}

Windows 下可以使用 net 命令

    net start mysql

同理，启动其他比如微软自己的 SQL Server 可以使用

	net start mssqlserver
	# 或者重启 tomcat
	net start tomcat6

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/a14En3" title="mysql_commands"><img src="https://c1.staticflickr.com/5/4167/34321082992_fc72ca0a7e_z.jpg" width="640" height="616" alt="mysql_commands"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## Access mysql shell

终端下输入

    mysql -u [root] -p

之后输入 root 的密码

需要注意：

- 所有的 mysql 命令以分号结束，如果没有分号结束，命令不会被执行
- 不是必须的，但是通常 MySQL 命令大写，数据库，表，用户名或者其他 text 小写。 MySQL 命令并不区分大小写。

## 常用命令

常用命令中也大致可以分成几类，一类是通用命令，包括查看 MySQL 数据库，及查看基本表结构的。还有就是创建修改表结构，最后最常用的就是增删改查数据的命令。

### 通用命令
查看数据库

    SHOW DATABASES;

输出

	mysql> show DATABASES;
	+--------------------+
	| Database           |
	+--------------------+
	| information_schema |
	| mysql              |
	| parker             |
	| performance_schema |
	| sys                |
	| test               |
	| youku              |
	+--------------------+
	7 rows in set (0.00 sec)

创建数据库

    CREATE DATABASE dbname;

删除数据库

    DROP DATABASE dbname;


使用数据库

    USE dbname;


显示数据库中表

    SHOW tables;

### 定义修改表结构
创建表

	CREATE TABLE table_name (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(20) , signup_date DATE);

查看表结构

	DESCRIBE table_name;

增加新列

	ALTER TABLE table_name ADD COLUMN [column] VARCHAR(40);

比如新增一列自增id

	ALTER TABLE [table] ADD COLUMN [column] int NOT NULL AUTO_INCREMENT PRIMARY KEY;

如果想要自定义新列的位置，可以使用 AFTER

	ALTER TABLE table_name ADD email VARCHAR(40) AFTER name;

删除列

	ALTER TABLE table_name DROP column

修改列

	ALTER TABLE tablename MODIFY COLUMN column_name VARCHAR(20);

修改表结构，添加组合 Primary Key，将两列数据作为 PK

如果 PRIMARY KEY 不存在

	ALTER TABLE [table]  ADD primary key(column1, column2);

如果 PRIMARY KEY 存在

	ALTER TABLE [table]  DROP PRIMARY KEY, ADD primary key(column1, column2);

### 增删改查
插入记录

	INSERT INTO `table_name` (`name`, `signup_date`) VALUES ("Verne", "2017-05-01");

更新记录

	UPDATE [table] SET [column] = 'Y' WHERE `potluck`.`name` ='Sandy';


删除一行记录

	DELETE from table_name where column_name = "value";

获取记录条数

	SELECT COUNT([column]) FROM [table];

模糊查询

	SELECT * FROM [table] WHERE [column] LIKE '%value%';

排序

	SELECT * FROM [table] WHERE [column] ORDER BY [column] ASC LIMIT [value];

Order 可以使用 `DESC`, `ASC`

删除表中所有记录

	TRUNCATE table [table]

### 其他命令
导出数据

	mysqldump -u [username] -p [database] > db_backup.sql


导入数据

	mysql -u [username] -p -h localhost [database] < db_backup.sql

查看数据库中所有用户

	SELECT User,Host FROM mysql.user;

创建新用户

	CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';

创建新用户时，如果密码选择太简单可能会导致密码安全检查无法过去，这时可以设置 MySQL 的 `validate_password_policy` 来使用简单密码：

	mysql> set global validate_password_policy=0;

在 0 或者 LOW 下，密码只验证长度。在 1 或者 MEDIUM 下，密码会验证长度，必须包含数字，大小写，特殊字符。在 2 或者 STRONG 下，还会验证是否在字典中。

其中

	mysql> select @@validate_password_length;

指定了使用密码的长度，默认为 8 位。

授予用户某个数据库全部权限

	GRANT ALL ON [database].* TO 'user'@'localhost';

修改密码

	mysqladmin -u root -p old_password password new_password

删除用户

	DROP USER ‘user1’@‘localhost';


## 远程连接
如果想要远程通过 root 连接 MySQL，先查看一下 MySQL 配置 `/etc/mysql.my.cnf`，需要注释其中

	#bind-address = 127.0.0.1

默认 3306 端口只允许本地访问，然后重启 `/etc/init.d/mysql restart`。

修改 MySQL 数据库中的 user 表，使得 root 能够远程登录

	mysql -u root –p
	mysql>use mysql;
	mysql>update user set host = '%' where user = 'root';
	mysql>select host, user from user;


## Python 连接操作MySQL
Python 2.x 中使用 MySQLdb 来连接 MySQL 数据库。在 Python 3.x 中使用 P有MySQL，使用方式 `import pymysql`，而其他操作几乎一致。

```
#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import MySQLdb

"""
pip install MySQL-python
MySQLdb 是用于Python链接Mysql数据库的接口，它实现了 Python 数据库 API 规范 V2.0，基于 MySQL C API 上建立的。

在使用 Python 连接之前确保已经有数据表建立

> mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 25
Server version: 5.7.18-0ubuntu0.16.04.1 (Ubuntu)

Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| spy                |
| sys                |
+--------------------+
5 rows in set (0.00 sec)

mysql> CREATE DATABASE testdb;
Query OK, 1 row affected (0.00 sec)

mysql> CREATE USER 'testuser'@'localhost' IDENTIFIED BY '12345678';
Query OK, 0 rows affected (0.01 sec)

mysql> USE testdb;
Database changed
mysql> GRANT ALL ON testdb.* TO 'testuser'@'localhost';
Query OK, 0 rows affected (0.00 sec)

"""

con = MySQLdb.connect('localhost', 'testuser', '12345678', 'testdb', charset='utf8')


def create_table():
    with con:
        cur = con.cursor()
        cur.execute("DROP TABLE IF EXISTS Users")
        cur.execute("CREATE TABLE Users(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50))")


def insert(name):
    with con:
        cur = con.cursor()
        cur.execute("INSERT INTO Users(name) VALUES('" + name + "')")


def get():
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM Users")

        rows = cur.fetchall()
        for row in rows:
            print row


def update(old_name, new_name):
    with con:
        cur = con.cursor()
        cur.execute("UPDATE Users SET name = %s WHERE name = %s", (new_name, old_name))


def transaction():
    try:
        con.cursor()
        insert("CC")
        insert("David")
        insert("Einstein")
        con.commit()
    except MySQLdb.Error, e:
        if con:
            con.rollback()
        print "Error %d: %s" % (e.args[0],e.args[1])


if __name__ == '__main__':

    try:

        cur = con.cursor()
        sql = "SELECT VERSION()"
        cur.execute(sql)

        version = cur.fetchone()
        print "MySQL version : %s " % version
    except MySQLdb.Error, e:
        print "Error %d: %s" % (e.args[0], e.args[1])
        if con:
            con.close()

    create_table()
    insert("Alex")
    insert("Verne")
    get()
    update("Alex", "Bob")
    get()
    transaction()
    get()
    if con:
        con.close()

```

## reference

一个更加详细的 Cheatsheet

<https://gist.github.com/einverne/0c256fe6351a89c7815b75f0d9964bfe>

## 推荐命令行
mysql 自带的命令行工具不会自动补全，这里推荐 `mycli` 可以实现 MySQL 命令行的自动补全和语法高亮。

### 安装

使用 pip 安装

	pip install mycli

### 使用

其基本使用和 mysql 命令行基本一致

```
mycli [OPTIONS] [DATABASE]

Options:
  -h, --host TEXT               Host address of the database.
  -P, --port INTEGER            Port number to use for connection. Honors
                                $MYSQL_TCP_PORT
  -u, --user TEXT               User name to connect to the database.
  -S, --socket TEXT             The socket file to use for connection.
  -p, --password TEXT           Password to connect to the database
  --pass TEXT                   Password to connect to the database
  --ssl-ca PATH                 CA file in PEM format
  --ssl-capath TEXT             CA directory
  --ssl-cert PATH               X509 cert in PEM format
  --ssl-key PATH                X509 key in PEM format
  --ssl-cipher TEXT             SSL cipher to use
  --ssl-verify-server-cert      Verify server's "Common Name" in its cert
                                against hostname used when connecting. This
                                option is disabled by default
  -v, --version                 Version of mycli.
  -D, --database TEXT           Database to use.
  -R, --prompt TEXT             Prompt format (Default: "\t \u@\h:\d> ")
  -l, --logfile FILENAME        Log every query and its results to a file.
  --defaults-group-suffix TEXT  Read config group with the specified suffix.
  --defaults-file PATH          Only read default options from the given file
  --myclirc PATH                Location of myclirc file.
  --auto-vertical-output        Automatically switch to vertical output mode
                                if the result is wider than the terminal
                                width.
  -t, --table                   Display batch output in table format.
  --csv                         Display batch output in CSV format.
  --warn / --no-warn            Warn before running a destructive query.
  --local-infile BOOLEAN        Enable/disable LOAD DATA LOCAL INFILE.
  --login-path TEXT             Read this path from the login file.
  -e, --execute TEXT            Execute query to the database.
  --help                        Show this message and exit.
```


### reference

- <http://zetcode.com/db/mysqlpython/>
- <http://mysql-python.sourceforge.net/MySQLdb.html>
- <http://mysql-python.sourceforge.net/>
- <http://mycli.net/>
