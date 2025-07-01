---
layout: post
title: "Exposed 学习笔记：表定义以及模式创建"
aliases:
  - "Exposed 学习笔记：表定义以及模式创建"
tagline: ""
description: ""
category: 学习笔记
tags: [ exposed, kotlin, orm, kotlin-orm, jetbrains, ]
create_time: 2025-07-01 11:48:03
last_updated: 2025-07-01 11:48:03
dg-home: false
dg-publish: false
---

之前的[文章](https://blog.einverne.info/post/2025/03/jetbrains-exposed-orm-framework.html)已经带领大家学习了解了 Exposed 是什么，有什么用途，本文将重点学习 Exposed 中如何定义数据表结构，并进行数据库 Schema 的创建和迁移。

文本将重点放在继承 Table 类来定义表，定义各种类型的列，以及相关的约束 primaryKey, unique, nullable 等，如何定义复合主键。

如何使用 `SchemaUtils.create` 来创建表，了解 `SchemaUtils.drop` 方法。

在生产环境，通常和 [[Flyway]] 或 [[Liquibase]] 等数据库迁移工具结合使用。

## 定义表

在 Exposed 中提供了多种表定义的方式，我们先来看看最基本的表定义方法。

```kotlin
object Users : Table("users") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50)
    val createdAt = datetime("created_at")

    override val primaryKey = PrimaryKey(id)
}
```

常用修饰：primaryKey, uniqueIndex, nullable()，支持复合主键（PrimaryKey(col1, col2)）。

如果是继承自 Table 表，那么开发者需要自己手动创建和管理所有的约束。但是在绝大部分的场景下，我们可能会为表创建一个自增的 ID
作为主键，所以我们来总结一下 Exposed 中的其他几个定义。

| 表类型           | 场景                 | 特点                                     |
| ---------------- | -------------------- | ---------------------------------------- |
| Table            | 标准表定义，自主管理 | 最灵活，需要手动定义所有约束             |
| IntIdTable       | 整数自增主键         | 自动生成 id: Int 作为主键                |
| LongIdTable      | 长整数自增主键       | 自动生成 id: Long 作为主键               |
| UUIDTable        | UUID 主键            | 自动生成 id: UUID 作为主键               |
| CompositeIdTable | 复合主键表           | 支持多列联合主键，需要使用 `.entityId()` |

基于上面的定义，我们可以定义出如下的表结构。

```kotlin
object Authors : Table("authors") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50)
    override val primaryKey = PrimaryKey(id)
}

// LongIdTable 简化写法
object Articles : LongIdTable("articles") {
    // id 列自动生成
    val title = varchar("title", 100)
    val authorId = reference("author_id", Users.id)
}

// 复合主键表
object UserRoles : CompositeIdTable("user_roles") {
    val userId = reference("user_id", Users.id).entityId()
    val roleId = reference("role_id", Roles.id).entityId()
    val assignedAt = datetime("assigned_at")
}
```

## 列类型支持

### 数值类型

| 函数                      | 数据库类型        | Kotlin 类型 | 范围/说明                    |
| ------------------------- | ----------------- | ----------- | ---------------------------- |
| byte()                    | TINYINT           | Byte        | -128, 127                    |
| ubyte()                   | TINYINT UNSIGNED  | UByte       | 0, 255                       |
| short()                   | SMALLINT          | Short       | -32768, 32767                |
| ushort()                  | SMALLINT UNSIGNED | UShort      | 0, 65535                     |
| integer()                 | INT               | Int         | -2^31, 2^31-1                |
| uinteger()                | INT UNSIGNED      | UInt        | 0, 2^32-1                    |
| long()                    | BIGINT            | Long        | -2^63, 2^63-1                |
| ulong()                   | BIGINT UNSIGNED   | ULong       | 0, 2^64-1                    |
| float()                   | FLOAT/REAL        | Float       | 单精度浮点数                 |
| double()                  | DOUBLE            | Double      | 双精度浮点数                 |
| decimal(precision, scale) | DECIMAL           | BigDecimal  | 精确小数，指定精度和小数位数 |

比如金融经常下使用高精度的类型。

```kotlin
object FinancialData : Table("financial_data") {
    val amount = decimal("amount", 15, 2)  // 精度15，小数点后2位
    val taxRate = float("tax_rate")
    val count = uinteger("count")  // 无符号整数
}
```

### 字符串类型

| 函数                  | 数据库类型 | 用途                         |
| --------------------- | ---------- | ---------------------------- |
| char(length)          | CHAR(n)    | 固定长度字符串               |
| varchar(name, length) | VARCHAR(n) | 可变长度字符串，最大长度限制 |
| text()                | TEXT       | 大文本数据，无长度限制       |
| mediumText()          | MEDIUMTEXT | 中等长度文本（MySQL）        |
| largeText()           | LONGTEXT   | 超长文本（MySQL）            |

### 布尔类型

```kotlin
val active = bool("active")
```

不同的数据库会映射到不同的类型，Oracle CHAR(1)，SQL Server（BIT），其他数据库 BOOLEAN。

### 二进制类型

| 函数                 | 数据库类型   | 用途                   |
| -------------------- | ------------ | ---------------------- |
| binary(name)         | VARBINARY    | 可变长度二进制数据     |
| binary(name, length) | VARBINARY(n) | 固定最大长度二进制数据 |
| blob()               | BLOB         | 大二进制对象           |

通常情况下不建议直接将图片等大文件存储到数据库，可以使用外部的对象存储，但是如果有小于 1KB 的内容，也不妨考虑放入数据库中。

### 时间类型

对于时间类型，需要添加依赖

```
implementation("org.jetbrains.exposed:exposed-java-time:0.50.1")
```

| 函数                    | 数据库类型     | 用途               |
| ----------------------- | -------------- | ------------------ |
| date()                  | LocalDate      | 日期，年月日       |
| time()                  | LocalTime      | 仅时间，时分秒     |
| datetime()              | LocalDateTime  | 日期，时间，无时区 |
| timestamp()             | Instant        | UTC 时间戳         |
| timestampWithTimeZone() | OffsetDateTime | 带时区的时间戳     |

Example

```kotlin
object Events : Table("events") {
    val eventDate = date("event_date")                    // 2023-12-25
    val startTime = time("start_time")                    // 14:30:00
    val createdAt = datetime("created_at")                // 2023-12-25 14:30:00
    val occurredAt = timestamp("occurred_at")             // UTC 时间戳
    val scheduledAt = timestampWithTimeZone("scheduled_at") // 带时区
}
```

### UUID

使用随机的 UUID

```kotlin
val id = uuid("id")
val clientId = uuid("client_id").clientDefault { UUID.randomUUID() }
```

### JSON

添加依赖

```
implementation("org.jetbrains.exposed:exposed-json:0.50.1")
```

| 函数    | 数据库类型 | 用途                          |
| ------- | ---------- | ----------------------------- |
| json()  | JSON/TEXT  | JSON 文本格式存储             |
| jsonb() | JSONB      | JSON 二进制格式（PostgreSQL） |

例子

```kotlin
@Serializable
data class Address(val street: String, val city: String, val zipCode: String)

object Customers : Table("customers") {
    val name = varchar("name", 100)
    val address = json<Address>("address")        // 使用 kotlinx.serialization
    val metadata = jsonb<Map<String, Any>>("metadata")  // PostgreSQL JSONB
}
```

### 数组类型

数组类型主要支持 PostgreSQL

```kotlin
fun <T> Table.array(name: String, columnType: ColumnType<T>): Column<Array<T>> =
    registerColumn(name, ArrayColumnType(columnType))

object Projects : Table("projects") {
    val tags = array("tags", VarCharColumnType(50))  // varchar[]
    val priorities = array("priorities", IntegerColumnType())  // int[]
}
```

## 表约束

### 单列主键

将某一列设置为主键

```kotlin
object SimpleTable : Table("simple_table") {
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "simple_table_pkey")
}
```

### 复合主键

```kotlin
object OrderItems : Table("order_items") {
    val orderId = reference("order_id", Orders.id)
    val productId = reference("product_id", Products.id)
    val quantity = integer("quantity")

    override val primaryKey = PrimaryKey(orderId, productId, name = "order_items_pkey")
}
```

### 唯一约束

```kotlin
object Users : Table("users") {
    val email = varchar("email", 100).uniqueIndex()      // 单列唯一
    val firstName = varchar("first_name", 50)
    val lastName = varchar("last_name", 50)

    init {
        uniqueIndex("users_name_unique", firstName, lastName)  // 复合唯一约束
    }
}
```

### 外键约束

```kotlin
object Orders : Table("orders") {
    val customerId = reference(
        "customer_id",
        Customers.id,
        onDelete = ReferenceOption.CASCADE,    // 级联删除
        onUpdate = ReferenceOption.RESTRICT,   // 限制更新
        fkName = "fk_orders_customer"          // 外键名称
    )
}

// 可选外键（允许 NULL）
val categoryId = optReference("category_id", Categories.id)
```

ReferenceOption 选项

- RESTRICT 限制操作
- CASCADE 级联操作
- SET_NULL，设置为 NULL
- SET_DEFAULT，设置为默认值
- NO_ACTION 无操作

### 复杂索引

```kotlin
object Products : Table("products") {
    val name = varchar("name", 100)
    val category = varchar("category", 50)
    val price = decimal("price", 10, 2)
    val isActive = bool("is_active")

    init {
        // 复合索引
        index("idx_category_price", false, category, price)

        // 唯一复合索引
        uniqueIndex("idx_name_category", name, category)

        // 带条件的部分索引
        index("idx_active_products", false, name, price) {
            isActive eq true
        }

        // Hash 索引
        index("idx_name_hash", false, name, indexType = "HASH")
    }
}
```

### Check 约束

```kotlin
object Products : Table("products") {
    val price = decimal("price", 10, 2).check { it greater BigDecimal.ZERO }
    val name = varchar("name", 100).check { it.regexp("^[A-Za-z0-9 ]+$") }
    val status = enumerationByName("status", 10, Status::class)
        .check { it inList listOf("ACTIVE", "INACTIVE", "PENDING") }
}
```

### 默认值设置

```kotlin
object Users : Table("users") {
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime())
    val isActive = bool("is_active").default(true)
    val role = varchar("role", 20).clientDefault { "USER" }
    val uuid = uuid("uuid").clientDefault { UUID.randomUUID() }
}
```

## 利用代码创建表

`SchemaUtils.create(Users)` 创建表

```kotlin
Database.connect("jdbc:h2:mem:test", driver = "org.h2.Driver")

transaction {
    SchemaUtils.create(Users, Orders, OrderItems)  // 创建多张表

    // 检查表是否存在
    if (!Users.exists()) {
        SchemaUtils.create(Users)
    }
}
```

批量表管理

```kotlin
val allTables = arrayOf(Users, Products, Orders, OrderItems, Categories)

transaction {
    // 创建所有表
    SchemaUtils.create(*allTables)

    // 删除所有表（注意顺序，先删除有外键依赖的表）
    SchemaUtils.drop(*allTables.reversedArray())

    // 创建缺失的表
    SchemaUtils.createMissingTablesAndColumns(*allTables)
}
```

Exposed 自身不再维护自动迁移，可以结合 Flyway/Liquibase 等一起使用。

### Flyway 集成

添加依赖

```kotlin
dependencies {
    implementation("org.flywaydb:flyway-core:9.22.3")
    implementation("org.jetbrains.exposed:exposed-migration:0.50.1")
}
```

配置 Flyway

```kotlin
class DatabaseMigration {
    fun setupDatabase(dataSource: DataSource) {
        // 先运行 Flyway 迁移
        val flyway = Flyway.configure()
            .dataSource(dataSource)
            .locations("db/migration")
            .load()

        flyway.migrate()

        // 再使用 Exposed 检查表结构差异
        Database.connect(dataSource)

        transaction {
            val tables = arrayOf(Users, Orders, Products)
            val statements = SchemaUtils.statementsRequiredToActualizeScheme(*tables)

            if (statements.isNotEmpty()) {
                logger.warn("数据库结构需要更新：\n${statements.joinToString("\n")}")
            }
        }
    }
}
```

创建迁移文件

```mysql
-- db/migration/V1__Create_initial_tables.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
