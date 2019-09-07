---
layout: post
title: "从 MySQL 迁移到 PostgreSQL 方案调研"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, postgresql, database, sql, migration-tool, migration, rbdms, ]
last_updated:
---

之前的文章 [PostgreSQL 初识](/post/2019/08/postgresql-introduction.html) 和 [PostgreSQL 数据类型](/post/2019/08/postgresql-datatype.html) 大致的把 PostgreSQL 了解了一下，那么接下来就是真正地把它用起来。


## PGLoader
开源迁移工具，通过一行命令即可做到无缝迁移

- <https://github.com/dimitri/pgloader>

PGLoader 原本可以将不同数据源导入到 PostgreSQL 数据库，MySQL 只是它支持的一种。PGLoader 使用 PostgreSQL 的 COPY 命令将数据从源数据库或文件复制到目标 PostgreSQL 数据库中。

## 安装 {#installation}
Debian 系：

	sudo apt-get install pgloader

验证

	$ pgloader --version
	pgloader version "3.5.2"
	compiled with SBCL 1.4.5.debian

或者使用 Docker

	docker pull dimitri/pgloader
	docker run --rm --name pgloader dimitri/pgloader:latest pgloader --version
	docker run --rm --name pgloader dimitri/pgloader:latest pgloader --help

或者参考官方自行编译安装。[^1]

[^1]: <https://github.com/dimitri/pgloader>

## Usage
PGLoader 通过命令来复制，所以必须要配置一个 PGLoader 可以访问 PostgreSQL 的用户来方便执行命令。PostgreSQL 使用角色来管理数据库访问，需要配置该角色与 PGLoader 命令执行用户同一名称。之前提到过 PostgreSQL 普通数据不要轻易使用超级用户来管理，但是 PGLoader 需要使用非常多的权限来管理、访问、加载表中数据，因此需要授予 PGLoader 超级用户权限。

### PostgreSQL 用户
创建超级用户 `pgloader` 使用 `-P` 来为用户创建密码：

	sudo -u postgres createuser --superuser pgloader -P

创建数据库，准备导入该数据库：

	sudo -u postgres createdb quotes -O pgloader


### MySQL 准备
PostgreSQL 准备工作结束，假设 MySQL 的超级用户和密码都已经设置好，并且该用户拥有要迁移的数据库所有权限。本地执行验证：

	mysql -h localhost -u root -p


### 迁移
注意在任何会影响到数据库数据完整性的操作前，备份数据库，虽然 PGLoader 迁移时并不会修改或者删除数据，但是必要的备份一定不能掉以轻心。使用 `mysqldump` 来备份数据库。

在本地做一个简单的测试，本地 MySQL 数据库 quotes:

	mysql://root@localhost:3306/quotes

如果想要把这个数据库迁移到 PostgreSQL 中。

	postgresql://user:pass@localhost:5432/quotes

执行

	pgloader mysql://root:password@localhost:3306/quotes postgresql://pgloader:password@localhost:5432/quotes

pgloader 接受两个参数，一个是源数据库连接，一个是目标数据库连接。

	➜ build/bin/pgloader mysql://root:password@localhost:3306/quotes postgresql://postgres:password@localhost:5432/quotes
	2019-09-07T09:56:38.030000+08:00 LOG pgloader version "3.6.26cc9ca"
	2019-09-07T09:56:38.047000+08:00 LOG Migrating from #<MYSQL-CONNECTION mysql://root@localhost:3306/quotes {1005B1DE43}>
	2019-09-07T09:56:38.048000+08:00 LOG Migrating into #<PGSQL-CONNECTION pgsql://postgres@localhost:5432/quotes {1005D6D903}>
	2019-09-07T09:56:38.335000+08:00 LOG report summary reset
				 table name     errors       rows      bytes      total time
	-----------------------  ---------  ---------  ---------  --------------
			fetch meta data          0          1                     0.100s
			 Create Schemas          0          0                     0.004s
		   Create SQL Types          0          0                     0.005s
			  Create tables          0          2                     0.026s
			 Set Table OIDs          0          1                     0.004s
	-----------------------  ---------  ---------  ---------  --------------
			  quotes.quotes          0        100    15.9 kB          0.058s
	-----------------------  ---------  ---------  ---------  --------------
	COPY Threads Completion          0          4                     0.058s
	 Index Build Completion          0          0                     0.000s
			Reset Sequences          0          0                     0.015s
			   Primary Keys          0          0                     0.000s
		Create Foreign Keys          0          0                     0.000s
			Create Triggers          0          0                     0.001s
			Set Search Path          0          1                     0.001s
		   Install Comments          0          0                     0.000s
	-----------------------  ---------  ---------  ---------  --------------
		  Total import time          ✓        100    15.9 kB          0.075s

校验数据

	sudo -u postgres psql
	\c quotes
	select * from quotes.quotes limit 1;

这里就会发现，导入的数据没有默认到 public Schema 下，而是在自己的 Schema 下。在 PostgreSQL 中，每当我们创建一个数据库，都会自动产生一个 public Schema，当登录数据库查询时，如果没有加特定的 Schema，则会默认使用 public.

在使用的时候有几个问题，Debian 源中的 pgloader 有些老，3.5.2 的版本似乎有些 Bug，我在使用时报错

	2019-09-07T02:03:45.044000Z LOG Migrating from #<MYSQL-CONNECTION mysql://root@localhost:3306/imdb {1005805E43}>
	2019-09-07T02:03:45.047000Z LOG Migrating into #<PGSQL-CONNECTION pgsql://pgloader@localhost:5432/quotes {1005A56E73}>
	KABOOM!
	INFO: Control stack guard page unprotected
	Control stack guard page temporarily disabled: proceed with caution

	What I am doing here?

	Control stack exhausted (no more space for function call frames).
	This is probably due to heavily nested or infinitely recursive function
	calls, or a tail call that SBCL cannot or has not optimized away.

	PROCEED WITH CAUTION.

所以最后不得不直接使用源码编译使用最新版。

	➜ build/bin/pgloader --version
	pgloader version "3.6.26cc9ca"
	compiled with SBCL 1.4.5.debian

该版本没有任何问题。

同 pgloader 还有其他一些命令：

	pgloader./test/sqlite/sqlite.db postgresql:///newdb

### 其他使用方式
PGLoader 是一个可以高度配置的工具，除了上面提到的简单命令行迁移之外，PGLoader 还提供了强大的配置文件来帮助迁移。PGLoader 可以使用一个文件来配置告诉 PGLoader 如何迁移文件，该文件可以配置 PGLoader 的运行方式，并且可以执行更加复杂的迁移。

创建文件 `vi pgload.load`:

	LOAD DATABASE
		FROM mysql://root:einverne.@localhost:3306/wordpress
		INTO pgsql://pgloader:einverne.@localhost:5432/quotes

		WITH include drop, create tables, create indexes, workers = 8, concurrency = 1

	ALTER SCHEMA 'wordpress' RENAME TO 'public'
	;

注意最后的 `;` 一定要加。

解释：
- `LOAD DATABASE` 指定从数据库加载
- `FROM` 源数据库
- `INTO` 目标数据库
- `WITH` 指定 PGLoader 行为
	- `include drop`，迁移过程中，PGLoader 会删除目标 PostgreSQL 数据库中在源数据库中同名的任何表。注意备份。
	- `create tables`, 配置 PGLoader 根据源数据库数据在目标数据库中创建新表，如果使用 `create no tables`，则需要手动在目标数据库中创建好对应的表。
- `ALTER SCHEMA`, 在 WITH 语句之后，配置特定 SQL 来告诉 PGLoader 执行其他操作。

更多更加详细的配置可以参考[官方文档](https://pgloader.readthedocs.io/en/latest/ref/mysql.html)

创建完该文件后使用如下命令执行

	pgloader pgload.load

## 其他方案
下面也是可选的方案，不过没有仔细研究

- <https://pypi.org/project/pg_chameleon/>

## reference

- <https://pgloader.io>
- <https://pgloader.readthedocs.io/en/latest/>
- <https://www.postgresql.org/docs/current/app-createdb.html>
- <https://pgloader.readthedocs.io/en/latest/tutorial/tutorial.html#pgloader-quick-start>
- <https://wiki.postgresql.org/wiki/Converting_from_other_Databases_to_PostgreSQL#MySQL>
- <https://www.digitalocean.com/community/tutorials/how-to-migrate-mysql-database-to-postgres-using-pgloader>
- <https://tapoueh.org/blog/2017/07/from-mysql-to-postgresql/>
- <https://www.howtoing.com/how-to-migrate-mysql-database-to-postgres-using-pgloader>
