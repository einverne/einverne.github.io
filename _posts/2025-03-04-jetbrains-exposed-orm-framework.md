---
layout: post
title: "开源 Kotlin ORM 框架 Exposed 使用说明"
aliases:
- "开源 Kotlin ORM 框架 Exposed 使用说明"
tagline: ""
description: ""
category: 经验总结
tags: [open-source, kotlin, java, orm, spring, spring-boot,]
create_time: 2025-03-05 09:49:37
last_updated: 2025-03-05 09:49:37
dg-home: false
dg-publish: false
---

Exposed 是 [[JetBrains]] 在数年前推出的轻量级 [[ORM]] 框架，Kotlin 编写，已经在 JetBrains 内部多个关键产品使用。

Exposed 是基于 JDBC 实现，屏蔽了底层建立数据库连接，编写 SQL，操作数据，关闭数据库连接的操作，只需要关心数据操作。

Exposed 提供了两种形式 API，面向 DSL 的 API 和面向对象的 API。

## 特点

- 纯 Kotlin 实现
- 类似 SQL 的静态类型化语言，可以轻松查询数据库
- 减少样板代码
- 支持非常多的数据库，H2，MySQL，MariaDB，Oracle，PostgreSQL，SQL Server，SQLite 等

## 使用

首先需要添加依赖

```
<dependency>
    <groupId>org.jetbrains.exposed</groupId>
    <artifactId>exposed-core</artifactId>
    <version>0.37.3</version>
</dependency>
<dependency>
    <groupId>org.jetbrains.exposed</groupId>
    <artifactId>exposed-dao</artifactId>
    <version>0.37.3</version>
</dependency>
<dependency>
    <groupId>org.jetbrains.exposed</groupId>
    <artifactId>exposed-jdbc</artifactId>
    <version>0.37.3</version>
</dependency>
```

数据库连接

```
Database.connect("", driver = "")
```

DSL 和 DAO 都需要在 transaction 中执行

```
transaction {
  // do
  commit()
}
```

## DSL

DSL 是领域特定语言。

```
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

object Member : Table("member") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 32)
    val createdAt = timestamp("created_at")
}

fun main() {
    Database.connect(
        url = "jdbc:mysql://127.0.0.1:3306/exposed_example",
        driver = "com.mysql.cj.jdbc.Driver",
        user = "root",
        password = "mysql"
    )
    transaction {
        addLogger(StdOutSqlLogger)

        val id = Member.insert {
            it[name] = "Kotlin"
            it[createdAt] = Instant.now()
        } get Member.id
        println("Inserted id: $id")

        val member: ResultRow = Member.select(Member.id eq id).single()
        println("id: ${member[Member.id]}")
        println("name: ${member[Member.name]}")

        Member.update {
            it[createdAt] = Instant.now()
        }
        Member.deleteWhere { Member.id eq id }
    }
}
```

## DAO
数据表和实体类定义。

```
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction

// 创建名为 member 的表，添加 name 字段
object MemberTable : IntIdTable("member") {
    val name = varchar("name", 32)
    val createdAt = timestamp("created_at)
}

// 创建实体类
class MemberEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<MemberEntity>(MemberTable)

    var name by MemberTable.name
    var createdAt by MemberTable.createdAt
}

fun main() {
    Database.connect(
        url = "jdbc:mysql://127.0.0.1:3306/exposed_example",
        driver = "com.mysql.cj.jdbc.Driver",
        user = "root",
        password = "mysql"
    )
    transaction {
        addLogger(StdOutSqlLogger)

        val member = MemberEntity.new {
            name = "Kotlin"
            createdAt = Instant.now()
        }
        println("Inserted id: ${member.id}")

        MemberEntity.findById(member.id)?.let {
            println("id: ${it.id}")
            println("name: ${it.name}")
        }

        val result = MemberEntity.findById(member.id)

        result?.createAt = Instant.now()
        result?.delete()
    }
}
```

## 索引定义

单列或者多列索引

```
object Members : IntIdTable("members") {

    val index = index("idx_name_other", true, name, other)
}
```

## Spring Boot 集成

```
<dependencies>
  <dependency>
    <groupId>org.jetbrains.exposed</groupId>
    <artifactId>exposed-spring-boot-starter</artifactId>
    <version>0.37.3</version>
  </dependency>
</dependencies>
```

