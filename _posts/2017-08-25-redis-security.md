---
layout: post
title: "Redis 安全性检查"
aliases: "Redis 安全性检查"
tagline: ""
description: ""
category: 学习笔记
tags: [redis,database, nosql, security, key-value, db, ]
last_updated:
---

Redis 在设计上，是用来被可信客户端访问的，也就意味着不适合暴露给外部环境非可信客户端访问。

最佳的实践方法是在 Redis 前增加一个访问控制层，用于校验用户请求。

## 基本配置
Redis 本身提供了一些简单的配置以满足基本的安全控制。

- IP 绑定。如果不需要直接对外提供服务，bind 127.0.0.1 就行了，**切忌 bind 0.0.0.0**
- 端口设置。修改默认的 6379，一定程度上避免被扫描。
- 设置密码。Redis 的密码是通过 `requirepass` 以明文的形式配置在 conf 文件里的，所以要尽可能得长和复杂，降低被破解的风险。因为 redis 非常快，外部环境可以在一秒内 150k 次暴力破解，所以配置密码一定要复杂。
- 重命名或禁用某些高危操作命令。向 config、flushall、flushdb 这些操作都是很关键的，不小心就会导致数据库不可用。可以在配置文件中通过 rename-command 重命名或禁用这些命令。

## 网络配置
对于直接暴露在互联网的 Redis，应该使用防火墙阻止外部访问 Redis 端口。客户端应该只通过回环接口访问 Redis。

在 redis.conf 文件添加

	bind 127.0.0.1

由于 Redis 设计的初衷，如果不能成功阻止外部访问 Redis 端口，会有很大的安全影响。外部攻击者使用一个 FLUSHALL 命令就可以删除整个数据集。

## 使用密码
虽然 Redis 没有实现访问控制，但是提供了一个简单的身份验证功能。

在配置文件中修改：

	requirepass mypassword

重启 redis

	sudo service redis-server restart

登录验证

	./redis-cli -h 127.0.0.1 -p 6379 -a mypassword
	127.0.0.1:6379> config get requirepass
	1) "requirepass"
	2) "mypassword"

如上输出，配置正确。也可以在连接之后使用 `auth` 验证

	./redis-cli -h 127.0.0.1 -p 6379
	127.0.0.1:6379> auth mypassword
	OK
	127.0.0.1:6379> config get requirepass
	1) "requirepass"
	2) "mypassword"

通过修改 server 的 conf 文件方式需要重启 server， 也可以通过客户端来修改密码

	127.0.0.1:6379> config set requirepass mypassword
	OK

使用客户端设置的密码，Redis 重启之后还会使用 redis.conf 配置文件中的密码。

设置密码之后 Redis 集群中 slave 中也需要配置 和 master 一样的密码

	masterauth master-password

身份验证是一个可选的冗余层，如果防火墙或者其他保护 Redis 安全的系统被攻破，对于不知道授权密码的情况，攻击者依然不能访问 Redis。

`auth` 命令是明文传输的，所以依然不能阻止那些获得网络访问权限的攻击者嗅探。

## reference

- <http://ifeve.com/redis-securit/>
