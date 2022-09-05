---
layout: post
title: "PlanetScale 云端 MySQL 数据库使用记录"
aliases:
- "PlanetScale 云端 MySQL 数据库使用记录"
tagline: ""
description: ""
category: 产品体验
tags: [ mysql, planetscale, vitess, acid, sql, scale, ]
create_time: 2022-08-17 09:39:31
last_updated: 2022-08-17 04:51:35
---

[[PlanetScale]] 构建在 [Vitess](https://vitess.io/) 之上。[[Vitess]] 是一个可以扩展的 MySQL 集群，集合了很多MySQL特性和NoSQL 的扩展能力。
Vitess 创建于 2010 年，主用用于解决 YouTube 团队面临的 MySQL 扩容问题。

Vitess 是一个分片的非 ACID SQL 数据库（ACID 是原子性、一致性、隔离性和持久性的缩写）。

在 MySQL 中，FOREIGN KEY 约束的实现方式会 [影响在线 DDL](https://vitess.io/blog/2021-06-15-online-ddl-why-no-fk/) 。

Vitess 通过分片方式扩展 MySQL 数据库，数据在水平方向分区，Vitess 根据分片将查询路由到适当的 MySQL 实例上。Vitess 的连接比 MySQL 轻，可以轻松支持数千个连接。

PlanetScale 就是一个运行在云上的 MySQL，有一个 Web 管理界面，还有一个 CLI 工具。

## 价格
PlanetScale 对于入门的使用是免费的，它的免费套餐提供

- 5 GB 存储
- 1 billion row reads/mo
- 10 million row writes/mo
- 1 production branch
- 1 development branch
- Community support

超出此套餐的存储每 GB 收费 $2.50/mo ，1 billion row read 收费 $1/mo，而 1 million row written 收费 $1.5/mo。

如果有更多的资源使用，也可以 [升级套餐](https://planetscale.com/pricing) 。

## 使用
PlanetScale 令人心动的一个功能就是可以给数据库 [拉分支](https://planetscale.com/docs/concepts/branching) ，PlanetScale 允许用户像代码一样从主库中拉出一个一模一样结构的 development 或 staging 的数据库环境，可以在这个环境中开发，测试。所有的数据都是隔离的。

当完成开发之后，可以创建 deploy request，PlanetScale 会自动对比创建出差异的 Schema diff，然后开发者可以 review 需要部署生效的内容。同意通过之后 deploy 到线上库中。整个部署变更的过程不会产生停机时间。

不过需要注意的是，PlanetScale 为了实现扩容，舍弃了一些 MySQL 的特性，比如 PlanetScale 不支持 FOREIGN KEY[^1]，并且也要求每一个表都有一个唯一且不为空的主键[^2]。

[^1]: <https://planetscale.com/docs/learn/operating-without-foreign-key-constraints>
[^2]: <https://planetscale.com/docs/learn/change-single-unique-key>

## 监控

- 可以使用 [[Checkly]] 监控数据库延迟
- 可以使用 [[Datadog]] 更详细的记录分析数据库的状态

当然 PlanetScale 后台也提供了简单的监控，包括每秒读写。


## 导入数据
因为 PlanetScale 可以直接使用 MySQL 命令行连接，所以可以直接命令行导入：

```
sudo mysql -h xxx.ap-northeast-2.psdb.cloud -u inxxxxxxx -ppscale_xxxxxx --ssl-mode=VERIFY_IDENTITY --ssl-ca=/etc/ssl/cert.pem < ~/database.sql
```

注意这里的证书位置，我是在 macOS 下执行，所以证书在 `/etc/ssl/cert.pem`，如果是 Linux，证书在 `/etc/ssl/certs/ca-certificates.crt`。[^1]

[^1]: <https://planetscale.com/docs/concepts/secure-connections>



导入数据包包含 `0000-00-00 00:00:00` 数据

```
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1292 (22007) at line 383: vttablet: rpc error: code = InvalidArgument desc = Incorrect datetime value: '0000-00-00 00:00:00' for column 'update_time' at row 1 (errno 1292) (sqlstate 22007) (CallerID: planetscale-admin): Sql: "insert into tb_dy_resource values (:vtg1, :vtg2, :vtg3, :vtg4, :vtg5, :vtg6, :vtg7, :vtg8, :vtg9, :vtg10, :vtg11, :vtg12, :vtg13, :vtg14, :vtg15, :vtg16, :vtg17, :vtg18, :vtg19, :vtg20, :vtg21, :vtg22, :vtg23, :vtg24, :vtg25, :vtg26, :vtg27, :vtg28, :vtg29, :vtg30, :vtg31, :vtg32, :vtg33, :vtg34, :vtg35, :vtg3
```

查了一下 PlanetScale 似乎无法修改 `sql_mode` 字段，那就只能手动修改 SQL 了。

```
sed -i 's/0000-00-00 00:00:00/2022-01-01 00:00:01/g' gagays.sql
```

## Client
因为 PlanetScale 是兼容 MySQL 的，所以任何 [[MySQL客户端]] 都可以使用。

这里推荐 JetBrains 的 [[DataGrip]]。

在调研的过程中还发现了一款新型的 SQL 客户端，叫做 [[Arctype SQL Client]]，主打同步，感兴趣也可以试试。


## related

- [[Bytebase]] 是一个面向 DBA 和研发工程师的数据库 Schema change/migration 和版本控制工具。
- [[MySQL InnoDB 存储引擎提供的在线 DDL]]

## reference

- <https://dev.to/harshhhdev/planetscale-vitess-legacy-sharded-databases-and-referential-integrity-ikp>
