---
layout: post
title: "PostgreSQL 初识"
aliases: "PostgreSQL 初识"
tagline: ""
description: ""
category: 学习笔记
tags: [postgresql, sql, mysql, db, database, ]
last_updated:
---

要介绍 PostgreSQL 通过几个关键词就可以，开源，对象关系型数据库。本文主要是学习过程中的一些笔记，都是基础内容，大部分都是看得基础入门书籍和官方的文档内容，老手请直接跳过。

## History
PostgreSQL 发展历程可以追溯到 1986 年，加州伯克利分校开发了一个名叫 Postgres 的关系型数据库服务器，这份代码被 Illustra 公司发展成为了一个商业化产品。到 1994 年， Andrew Yu 和 Jolly Chen 向 Postgres 中增加了 SQL 语言解释器 ---- Postgres95，随后公布了其源码，成为一个开放源码数据库。

到 1996 年，Postgres95 被改名 PostgreSQL，支持查询语言标准，同时版本号从 6.0 开始迭代。

2011 年 9 月 12 日，PostgreSQL 9.1 发布，提供了强大的更新，同步复制，最近相邻索引，外部数据封装等功能。

[这张图](https://db-engines.com/en/ranking_trend/system/PostgreSQL) 充分的可以说明 PostgreSQL 的发展及流行程度。

## Installation
在 Linux Mint 19，或者其他 Debian/Ubuntu 系列上安装：

	sudo apt install postgresql postgresql-contrib

### Mac

	brew install postgresql

	To migrate existing data from a previous major version of PostgreSQL run:
	  brew postgresql-upgrade-database

	This formula has created a default database cluster with:
	  initdb --locale=C -E UTF-8 /usr/local/var/postgres
	For more details, read:
	  https://www.postgresql.org/docs/12/app-initdb.html

	To have launchd start postgresql now and restart at login:
	  brew services start postgresql
	Or, if you don't want/need a background service you can just run:
	  pg_ctl -D /usr/local/var/postgres start


PostgreSQL 安装之后会在系统上新增一个 postgres 用户，通过该用户来运行服务。

检查版本

	sudo -u postgres psql -c "SELECT version();"

会输出 PostgreSQL 的版本

	PostgreSQL 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 7.4.0-1ubuntu1~18.04.1) 7.4.0, 64-bit

PostgreSQL 默认端口是 5432，可以通过 `sudo netstat -tupln` 来查看服务是否启动。

PostgreSQL 默认用户名是 postgres，默认数据库也是 postgres，没有默认密码。

## Configuration
PostgreSQL 的配置文件在 `/etc/postgresql/10/main/postgresql.conf`

### 允许远程访问 PostgreSQL 服务
打开配置文件 `sudo vi /etc/postgresql/10/main/postgresql.conf` , 然后找到如下一行，并配置

	listen_addresses = '*'

然后重启服务

	sudo systemctl restart postgresql

检查服务启动

	ss -nlt | grep 5432

然后修改 `sudo vi /etc/postgresql/10/main/pg_hba.conf` 文件

    # TYPE  DATABASE        USER            ADDRESS                 METHOD
    # The user test_user will be able access all databases from all locations using a md5 password
    host    all             test_user            0.0.0.0/0                md5

    # The user test_user will be able access only the test_db from all locations using a md5 password
    host    test_db          test_user            0.0.0.0/0                md5

    # The user test_user will be able access all databases from a trusted location (192.168.43.106) without a password
    host    all             test_user            192.168.1.134            trust


## 登录和管理服务器
管理 PostgreSQL 可以通过命令行，也可以通过 GUI 工具，市场上现在 GUI 工具已经非常成熟，有开源方案，也有商业方案。这里就介绍一下 pgAdmin，其他工具可以自行了解。

### GUI 管理工具 pgAdmin

详情见官网： <https://www.pgadmin.org/download/>

安装方式也都特别简单，略过。

### 命令行方式
PostgreSQL 只能在 postgres 用户下管理，所以可以切换到该用户操作

	sudo su - postgres

然后使用 psql 命令登录 PostgreSQL 控制台

	psql

此时相当于用 postgres 用户以同名身份登录了数据库，默认没有密码，系统提示符会变成 `postgres=#`.

为用户设置密码 `\password` .

	\password postgres

然后输入密码。

创建其他用户，并为这些用户设定密码

	CREATE USER your_username WITH PASSWORD 'your_password';

创建用户数据库

	CREATE DATABASE sample_db OWNER your_username;

赋予用户所有权限，读写操作

	GRANT ALL PRIVILEGES ON DATABASE sample_db to your_username;

退出控制台

	\q

如果不想在控制台也可以直接从 shell 中设定

	sudo -u postgres createuser --superuser your_username
	sudo -u postgres psql
	\password your_username
	\q
	sudo -u postgres createdb -O your_username sample_db



    /usr/lib/postgresql/10/bin/pg_ctl -D /var/lib/postgresql/10/main -l logfile start

在 PostgreSQL 中，超级用户角色连接到数据库允许绕过所有数据库权限检查，登录权限除外。因此不要轻易使用超级用户权限，PostgreSQL 文档建议将大多数数据库作为非超级用户角色管理。

## Usage

### 登录数据库
上面演示了如何创建用户及数据库，那么在 shell 中可以以如下方式来登录数据库

	psql -U your_username -d sample_db -h 127.0.0.1 -p 5432

然后输入 your_username 的密码即可登录控制台。注意这里的 `-d` 参数是必须的。


### 修改数据库
对数据库的基本操作，和 MySQL 类似，只要懂得 SQL 基本就可以略过下面大部分的内容。

创建

	CREATE DATABASE sample_db;
	CREATE DATABASE sample_db OWNER username;

修改数据库

	ALTER DATABASE sample_db RENAME TO new_sample_db;
	ALTER DATABASE new_sample_db OWNER TO postgres;
	ALTER DATABASE new_sample_db WITH CONNECTION LIMIT = 10;

删除数据库

	DROP DATABASE sample_db[, ...n];

### 表相关操作

大部分都是 SQL 相关的内容，这里就做过引子，具体还是去学习 SQL

创建表

	create table tb_demo1 (
		id int PRIMARY KEY,
		name varchar(25),
		age int,
		salary float
	);

	create table tb_demo2 (
		id int,
		name varchar(25) NOT NULL,
		age int,
		salary float,
		PRIMARY KEY(id, name)
	);

	CREATE TABLE dep (
		id INT,
		name VARCHAR(25)
	)

创建外键关联，在表 demo5 中添加外键约束 `fk_dep` 将表 depId 列关联到 dep 表 id。

	CREATE TABLE demo5 (
		id INT PRIMARY KEY,
		name VARCHAR(25) NOT NULL,
		age int,
		depId INT,
		CONSTRAINT fk_dep FOREIGN KEY(depId) REFERENCES dep(id)
	)

修改表结构

	ALTER TABLE old_table_name RENAME TO new_table_name;
	ALTER TABLE table_name ALTER COLUMN column_name TYPE VARCHAR(30);
	ALTER TABLE table_name RENAME old_column_name TO new_column_name new_type;
	ALTER TABLE table_name ADD COLUMN new_column new_type;
	ALTER TABLE table_name ADD COLUMN new_column new_type NOT NULL;
	ALTER TABLE table_name DROP column_name;
	ALTER TABLE table_name DROP CONSTRAINT constraint_name;

删除表

	DROP TABLE [IF EXISTS] table1, table2 ...;

### 恢复外部数据

	psql -U your_username -d sample_db -h 127.0.0.1 -p 5432 < backup_external.sql


## 其他控制台命令

	\h            	explain sql, such as \h select
	\?				help
	\l 				list all db
	\c [database_name] 		connect to db
	\d 				list all tables of current db
	\d [table_name] 	show table structure, like describe table in mysql
	\du 			list all user
	\e 				open text editor
	\conninfo 		print database and connection infomation

## 数据类型

### 整数类型

类型 		| 字节数 		| 说明　| 取值范围
----------|-------------|-------|---------------
SMALLINT  | 2　字节　|　小整数 | -32768 ~ 32767
INT 	| 4　字节　|　整数       | -2147483648 ~ 2147483647
BIGINT 	| 8　字节　|　大整数     | -92233720368547758089 ~ 9223372036854774807

### 浮点数

类型 		| 字节数 		|说明　| 取值范围
-------------|-------|-------|---------------
REAL 		| 4 | 6 位十进制数字精度　|　1E-37 ~ 1E+37
DOUBLE PRECISION | 8 | 15 位十进制数字精度　| 1E-307 ~ 1E+308

PostgreSQL 支持 SQL 标准表示，float 和 float(p) 声明非精确的数值类型。p 声明以二进制表示的最低可接受精度。

- REAL - float(1) 到 float(24)
- DOUBLE PRECISION - float(25) 到 float(35)

范围之外的 p 值将导致错误，没有声明精度的 float 将被当作 DOUBLE PRECISION。

### 任意精度类型
NUMERIC 表示数值是任意精度，使用 `NUMERIC(M, N)` 表示，M 称为精度，总位数，N 表示标度，表示小数的位数。比如 123.456 ，精度是 6, 标度是 3

超出精度则四舍五入处理。

### 日期与时间
TIME, DATE, TIMESTAMP 和 INTERVAl，每一个类型都有合法取值范围，当不合法时会以零值插入到数据库。


类型 		| 字节数 		| 说明　| 取值范围
-------------|-------|-------|---------------
TIME 	| 8 字节 | 一天内时间 | 00:00:00 - 24:00:00 插入 HHMMSS 字符串会自动转成时间 HH:MM:SS
DATE 	| 4 字节 | 日期 | YYYY-MM-DD
TIMESTAMP | 8 字节 | 日期和时间 | YYYY-MM-DD HH:MM:SS

### 字符串类型
字符串类型

类型 		| 字节数 		|说明　| 取值范围
-------------|-------|-------|---------------
CHAR(n)/CHARACTER(n) |  | 固定长度非二进制，不足补空白 | 由 n 决定
VARCHAR(n)/CHARACTER VARYING(n) | | 变长非二进制，有长度限制 | n 决定
TEXT | | 变长非二进制，无长度限制 | 由字符串决定


### 二进制类型
PostgreSQL 提供 BYTEA 类型，用来存储二进制字符串，BYTEA 类型存储空间位 4 字节加上实际的二进制字符串。

	CREATE TABLE tmp ( b BYTEA );
	INSERT INTO tmp VALUES (E'\\000');
	SELECT * from tmp;

### 布尔类型
PostgreSQL 提供 BOOLEAN 布尔类型，用一个字节来存储，有 TRUE，FALSE 两个值。

其他有效文本，可以代替 TRUE 或者 False。比如 't', 'true', 'y', 'yes', '1', 或者 'f', 'false', 'n', 'no', '0'

### 数组类型
PostgreSQL 允许将字段定义成变长或者变长的一维或者多维数组，数组类型可以是基本类型或者是用户定义类型。

声明数组

	numbs INT[],
	zz TEXT[4][4]

对于一维数组也可以

	arr_column INT ARRAY[5]

插入数组

	CREATE TABLE tmp (bt int[]);
	INSERT INTO tmp VALUES('\{\{1,1,1\}, \{2,2,2\}, \{3,3,3\}\}');
	SELECT * FROM tmp;

除开这些基础类型，PostgreSQL 还支持非常多的复杂类型，比如 json, xml 等等，具体可以参考[官网](https://www.postgresql.org/docs/9.5/datatype.html) , 这些复杂类型的使用可以单开一篇文章来讲了，初识篇就到此。

## reference

- 《PostgreSQL9 从零开始学》
- <https://github.com/dhamaniasad/awesome-postgres>
- <https://linux4one.com/how-to-install-postgresql-on-linux-mint-19/>
