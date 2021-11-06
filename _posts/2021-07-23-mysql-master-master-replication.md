---
layout: post
title: "配置 MySQL master-master 双主同步"
aliases: 
- "配置 MySQL master-master 双主同步"
tagline: ""
description: ""
category: 学习笔记
tags: [ mysql, database, replication,  ]
last_updated:
---

最近正好买了两台配置一样的 VPS，整理学习一下 MySQL 的双主同步配置。

假设有两台服务器，分别安装了 MariaDB。

Install MariaDB on Ubuntu 18.04

    sudo apt update
    sudo apt install mariadb-server
    sudo mysql_secure_installation

两台机器的IP分别是：

- 10.10.10.1
- 10.10.10.2

## 首先配置第一台

修改 MySQL 配置 `vi /etc/mysql/mariadb.conf.d/50-server.cnf`：

```
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = demo
# bind-address = 127.0.0.1
```

- server-id, 服务ID
- log_bin, binlog 位置
- binlog_do_db，后面配置需要同步的数据库，如果需要同步多个数据，那么需要配置多行
- 然后注释 `bind-address` 允许 MySQL 与外部通信，如果清楚自己需要从外网连接，可以设置 `0.0.0.0`，不过要清楚如果允许 MySQL 从外部访问，可能带来数据安全问题

然后需要重启 MySQL：

    sudo /etc/init.d/mysql restart

### create login user
然后使用 `sudo mysql -u root -p` 登录，创建登录用户：

    CREATE USER 'your_name'@'%' IDENTIFIED BY 'password';
    grant all on *.* to 'your_name'@'%';
    grant all privileges on *.* to 'your_name'@'%' with grant option;

这样可以在其他机器上通过 your_name 来访问 MySQL，而不是用 root。

### create slave user
创建同步数据的账户，并授予复制权限：

    create user 'slave_user'@'%' identified by 'password';
    grant replication slave on *.* to 'demouser'@'%';
    flush privileges;
    
最后执行：

    show master status;
    
显示：

```
+------------------+----------+--------------+------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+------------------+----------+--------------+------------------+
| mysql-bin.000002 |      741 | demo         |                  |
+------------------+----------+--------------+------------------+
```

记住该信息，接下来在另外一台机器中需要使用。

## 配置另一台机器

同样，安装，修改配置，重启，然后登录。

不过需要注意的是在第二台机器中，需要将服务 ID 改成 2：

    server-id = 2

然后执行：

```
stop slave;
CHANGE MASTER TO MASTER_HOST = '10.10.10.1', MASTER_USER = 'slave_user', MASTER_PASSWORD = 'password', MASTER_LOG_FILE = 'mysql-bin.000002', MASTER_LOG_POS = 741;
start slave;
```

然后在第二台机器，创建 `slave_user` 账号。

执行：

    show master status;
    
```
MariaDB [(none)]> show master status;
+------------------+----------+--------------+------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+------------------+----------+--------------+------------------+
| mysql-bin.000002 |      866 | demo         |                  |
+------------------+----------+--------------+------------------+
```

同理，回到 10.10.10.1 第一台机器。

执行：

```
stop slave;
CHANGE MASTER TO MASTER_HOST = '10.10.10.2', MASTER_USER = 'slave_user', MASTER_PASSWORD = 'password', MASTER_LOG_FILE = 'mysql-bin.000002', MASTER_LOG_POS = 866;
start slave;
```


## 测试
因为上面的配置是同步了 demo 数据库，所以可以在 demo 数据库中创建表，然后分别在两台机器中查看。

```
use demo;
create table dummy(`id` varchar(10));
```

然后分别在两台机器中查看：

    show tables;

然后删除表 `drop table dummy`。

可以通过如下命令查看 slave 状态：

    show slave status\G;

Slave_IO_Running 及Slave_SQL_Running 进程必须正常运行，即 Yes 状态，否则说明同步失败
若失败查看 MySQL 错误日志中具体报错详情来进行问题定位。


## 配置解释

```
# 主数据库端ID号
server_id = 1           
# 开启 binlog                 
log-bin = /var/log/mysql/mysql-bin.log    
# 需要复制的数据库名，如果复制多个数据库，重复设置这个选项即可                  
binlog-do-db = demo       
# 将从服务器从主服务器收到的更新记入到从服务器自己的二进制日志文件中                 
log-slave-updates                     

# 控制binlog的写入频率。每执行多少次事务写入一次(这个参数性能消耗很大，但可减小MySQL崩溃造成的损失) 
sync_binlog = 1                    
# 这个参数一般用在主主同步中，用来错开自增值, 防止键值冲突
auto_increment_offset = 1           
# 这个参数一般用在主主同步中，用来错开自增值, 防止键值冲突
auto_increment_increment = 1            
# 二进制日志自动删除的天数，默认值为0,表示“没有自动删除”，启动时和二进制日志循环时可能删除 
expire_logs_days = 7                   
# 将函数复制到slave  
log_bin_trust_function_creators = 1      
```


`binlog-ignore-db` 是 master 侧的设置，告诉 Master 不要记录列出的 DB 修改。

`replicate-ignore-db` 是一个 slave 侧的设置，告诉 Slave 忽略列出的 DB。

## 设置同步多个数据库

```
binlog-do-db=DATABASE_NAME1
binlog-do-db=DATABASE_NAME2
```

或者像这样忽略系统的，然后同步所有的

```
binlog_ignore_db        = mysql
binlog_ignore_db        = information_schema
binlog_ignore_db        = performance_schema
```


## bin log 管理
MySQL 会产生很多 `mysql-bin.[index]` 这样的 log 在系统中。不建议直接删除，可以使用 MySQL 内建的机制定期清理。

    SET GLOBAL expire_logs_days = 3;

然后编辑配置 `vi /etc/mysql/my.cnf`:

```sql
[mysqld]
expire_logs_days=3
```


## reference 

- [[MySQL Replication 主从同步原理]]
- <https://hevodata.com/learn/mysql-master-master-replication/>
- <https://www.lexiconn.com/blog/2014/04/how-to-set-up-selective-master-slave-replication-in-mysql/>
- <https://www.ryadel.com/en/mysql-master-master-replication-setup-in-5-easy-steps/>
