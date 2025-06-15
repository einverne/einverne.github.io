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

- 纯 Kotlin 实现，轻量级，模块化
- 类似 SQL 的静态类型化语言，可以轻松查询数据库
- 类型安全 SQL DSL，提供编译时类型检查，防止 SQL 注入
- 减少样板代码
- 支持非常多的数据库，H2，MySQL，MariaDB，Oracle，PostgreSQL，SQL Server，SQLite 等
- 双重 API 设计，DSL 和 DAO 两种访问方式

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

在 Gradle 项目中添加依赖，在 `build.gradle.kts` 添加 Exposed 依赖

```
dependencies {
    implementation("org.jetbrains.exposed:exposed-core:1.0.0-beta-2")
    implementation("org.jetbrains.exposed:exposed-dao:1.0.0-beta-2")
    implementation("org.jetbrains.exposed:exposed-jdbc:1.0.0-beta-2")
    
    // 可选模块
    implementation("org.jetbrains.exposed:exposed-java-time:1.0.0-beta-2")
    implementation("org.jetbrains.exposed:exposed-json:1.0.0-beta-2")
    implementation("org.jetbrains.exposed:exposed-crypt:1.0.0-beta-2")
    
    // 数据库驱动（以 H2 为例）
    implementation("com.h2database:h2:2.1.214")
}
```

数据库连接

```
// 基本连接方式
Database.connect(
    url = "jdbc:postgresql://localhost:5432/mydb",
    driver = "org.postgresql.Driver",
    user = "username",
    password = "password"
)

// 使用 DataSource 连接（推荐用于企业应用）
val hikariConfig = HikariConfig("db.properties")
val dataSource = HikariDataSource(hikariConfig)
Database.connect(dataSource)

// 内存数据库连接
Database.connect("jdbc:h2:mem:test", driver = "org.h2.Driver")
```

DSL 和 DAO 都需要在 transaction 中执行

```
transaction {
  // do
  commit()
}
```

## DSL

DSL 是领域特定语言，使用 Exposed 的 DSL 定义数据库表。

```
object Users : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50)
    val email = varchar("email", 255).index()
    val age = integer("age").nullable()
    
    override val primaryKey = PrimaryKey(id)
}

object Posts : Table() {
    val id = integer("id").autoIncrement()
    val title = varchar("title", 255)
    val content = text("content")
    val userId = integer("user_id") references Users.id
    
    override val primaryKey = PrimaryKey(id)
}
```

代码

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


## 基本 CRUD 操作

Exposed 中的所有数据库操作都需要在活动事务中执行。

```
transaction {
    // 创建表
    SchemaUtils.create(Users, Posts)
    
    // 插入数据
    val userId = Users.insert {
        it[name] = "张三"
        it[email] = "zhangsan@example.com"
        it[age] = 25
    } get Users.id
    
    // 批量插入
    Users.batchInsert(listOf(
        Triple("李四", "lisi@example.com", 30),
        Triple("王五", "wangwu@example.com", 28)
    )) { (name, email, age) ->
        this[Users.name] = name
        this[Users.email] = email
        this[Users.age] = age
    }
    
    // 查询数据
    Users.selectAll()
        .where { Users.age greater 20 }
        .orderBy(Users.name)
        .forEach { row ->
            println("姓名: ${row[Users.name]}, 邮箱: ${row[Users.email]}")
        }
    
    // 更新数据
    Users.update({ Users.id eq userId }) {
        it[age] = 26
    }
    
    // 删除数据
    Users.deleteWhere { Users.age less 18 }
}
```

复杂 SQL 查询

```
transaction {
    // 连接查询
    (Users innerJoin Posts)
        .select(Users.name, Posts.title)
        .where { Users.age greaterEq 25 }
        .forEach { row ->
            println("用户: ${row[Users.name]}, 文章: ${row[Posts.title]}")
        }
    
    // 聚合查询
    val avgAge = Users.select(Users.age.avg()).single()[Users.age.avg()]
    
    // 分组查询
    Users.select(Users.age, Users.id.count())
        .groupBy(Users.age)
        .having { Users.id.count() greater 1 }
        .forEach { row ->
            println("年龄: ${row[Users.age]}, 人数: ${row[Users.id.count()]}")
        }
}
```


## DAO
DAO API 提供了更面向对象的数据库访问方式。

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

DAO API 提供面向对象的数据库访问

```
// 定义实体类
class User(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<User>(Users)
    
    var name by Users.name
    var email by Users.email
    var age by Users.age
    val posts by Post referrersOn Posts.userId
}

class Post(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Post>(Posts)
    
    var title by Posts.title
    var content by Posts.content
    var user by User referencedOn Posts.userId
}

// 使用 DAO 进行操作
transaction {
    // 创建用户
    val user = User.new {
        name = "赵六"
        email = "zhaoliu@example.com"
        age = 32
    }
    
    // 创建文章
    val post = Post.new {
        title = "我的第一篇文章"
        content = "这是文章内容..."
        this.user = user
    }
    
    // 查询操作
    val users = User.find { Users.age greater 25 }
    users.forEach { user ->
        println("用户: ${user.name}, 文章数: ${user.posts.count()}")
    }
}
```

批量操作优化

批量插入和预加载关联数据可以提高性能。

```kotlin
transaction {
    // 批量插入
    Users.batchInsert(userList) { user ->
        this[Users.name] = user.name
        this[Users.email] = user.email
    }
    
    // 预加载关联数据
    User.all().with(User::posts)
}
```

关联数据预加载

使用 `preload` 和 `with` 方法可以预加载关联数据，减少 N+1 查询问题。

```kotlin
// 预加载关联数据
transaction {
    // 使用 with() 进行急切加载
    val users = User.all().with(User::posts)

    // 使用 preload() 预加载
    val usersWithPosts = User.find { Users.age greater 18 }
        .preload(User::posts)
}
```

## 索引定义
Exposed 支持在表中定义索引，以提高查询性能。

单列或者多列索引

```
object Members : IntIdTable("members") {
    val id = integer("id").autoIncrement()
    val email = varchar("email", 255).index() // 单列索引

    oveerride val primaryKey = PrimaryKey(id)
    val index = index("idx_name_other", true, name, other)
}
```

## 分页处理
对于大量数据查询，实施分页处理以避免内存溢出。

```kotlin
transaction {
    // 分页查询
    val pageSize = 100
    val offset = pageNumber * pageSize
    
    Users.selectAll()
        .limit(pageSize, offset.toLong())
        .forEach { row ->
            // 处理数据
        }
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

## 数据库连接池优化

使用 HikariCP 连接池，配置连接池参数。

```kotlin
val hikariConfig = HikariConfig().apply {
    jdbcUrl = "jdbc:mysql://localhost:3306/mydb"
    driverClassName = "com.mysql.cj.jdbc.Driver"
    username = "username"
    password = "password"
    
    maximumPoolSize = 10
    minimumIdle = 2
    idleTimeout = 60000
    connectionTimeout = 30000
    maxLifetime = 1800000
}

Database.connect(HikariDataSource(hikariConfig))
```


## related

- [[Ktorm]]，轻量，无依赖
- [[Komapper]]，编译时安全