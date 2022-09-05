---
layout: post
title: "SQLAlchemy 使用记录"
tagline: ""
description: ""
category: 学习笔记
tags: [python, mysql, sqlalchemy, orm, sql, ]
last_updated:
---

什么是 SQLAlchemy ?

The Python SQL Toolkit and Object Relational Mapper

## create engine
[首先](http://docs.sqlalchemy.org/en/latest/core/engines.html#sqlalchemy.create_engine) 要创建 `Engine` 实例

    sqlalchemy.create_engine(*args, **kwargs)

创建 mysql 连接

    # driver mysql-python
    DB_PATH = "mysql+mysqldb://root:password@host:port/dbname?charset=utf8mb4"
    xchat_engine = create_engine(
        DB_PATH,
        echo =False,
        pool_size=40,
        pool_recycle=3600
    )

连接的字符串 URL 格式 `dialect[+driver]://user:password@host/dbname[?key=value..]` ，其中

- `dialect` 是使用的数据库 mysql, oracle, postgresql 等等
- `driver` 是连接数据库需要的驱动 DBAPI，比如 psycopg2, pyodbc, cx_oracle 等等

另外这个字符串也可以使用 [sqlalchemy.engine.url.URL](http://docs.sqlalchemy.org/en/latest/core/engines.html#sqlalchemy.engine.url.URL) 实例。

对于 MySQL 而言，driver 可以有如下选择

```
# default
engine = create_engine('mysql://scott:tiger@localhost/foo')

# mysql-python
engine = create_engine('mysql+mysqldb://scott:tiger@localhost/foo')
# sudo apt-get install libmysqlclient-dev
# pip install mysqlclient

# MySQL-connector-python
engine = create_engine('mysql+mysqlconnector://scott:tiger@localhost/foo')

# OurSQL
engine = create_engine('mysql+oursql://scott:tiger@localhost/foo')

# pymysql
engine = create_engine('mysql+pymysql://user:pass@localhost/foo')
```

PyMySQL 是使用纯 Python 实现的。

## Declare a Mapping
定义和数据库 Map 的实体

    from sqlalchemy import Column, Integer, String
    from sqlalchemy.ext.declarative import declarative_base

    Base = declarative_base()

    class SomeClass(Base):
        __tablename__ = 'some_table'
        id = Column(Integer, primary_key=True)
        name =  Column(String(50))

`declarative_base()` 方法会返回一个 base class，所有自己定义的 class 都要从此继承。关于定义类（表）中数据类型的选择，可以参考文末的对应关系。定义好之后 [sqlalchemy.schema.Table](http://docs.sqlalchemy.org/en/latest/core/metadata.html#sqlalchemy.schema.Table) 和 [sqlalchemy.orm.mapper](http://docs.sqlalchemy.org/en/latest/orm/mapping_api.html#sqlalchemy.orm.mapper) 会产生。结果可以从类变量获取

    # access the mapped Table
    SomeClass.__table__

    # access the Mapper
    SomeClass.__mapper__

如果想要自己定义的字段和数据库中字段相区别，可以在 Column 中定义 `some_table_id`

    id = Column("some_table_id", Integer, primary_key=True)

通过 base class 定义的类包含一个 [MetaData](http://docs.sqlalchemy.org/en/latest/core/metadata.html#sqlalchemy.schema.MetaData) 通过这个 MetaData 可以定义 [Table](http://docs.sqlalchemy.org/en/latest/core/metadata.html#sqlalchemy.schema.Table) ，然后通过如下语句就可以直接在数据库中生成定义好的表。

    engine = create_engine('sqlite://')
    Base.metadata.create_all(engine)

## 创建 Map 类实例
加入定义了 User 类，创造一个实例

    ed_user = User(name='ed', fullname='Ed Jones', password='edspassword')

## 创建 Session
做好了一切准备，可以和数据库进行交互，ORM 和数据库打交道的是 [Session](http://docs.sqlalchemy.org/en/latest/orm/session_api.html#sqlalchemy.orm.session.Session) ，从之前定义的 engine 中创建 sessionmake

    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=engine)

这个 `Session` 实例，是一个 session 创造的工厂，之后所有的 session 都可以由他创建

    session = Session()

这里创建的 session 实例还不会开启任何连接，当第一次被用到，session 会从 Engine 维护的连接池中获得一个连接，一直持有该连接知道 commit 所有的提交或者显式的关闭 session 对象。

> Session 的生命周期模式，记住，Session 只是特定对象的一个工作区，限定到特定的数据库连接，

关于 Session 使用更多的[问题](/post/2017/05/sqlalchemy-session.html) 可以参考之前的[文章](/post/2017/05/sqlalchemy-session.html)。当然官网也有很多[使用说明](http://docs.sqlalchemy.org/en/latest/orm/session_basics.html#session-faq-whentocreate)。

## Adding and Updating Objects
当有了 Session 之后，就可以通过 session 来操作数据库。比如

    session.add(ed_user)

当把实例对象 add 到 session 之后，其实不会直接提交给数据库，这个时候只有 flush 操作，这个时候

    our_user = session.query(User).filter_by(name='ed').first()

也能够将刚刚 add 的实例检索出来，真正的提交只有执行 `session.commit()` 之后。

如果发现单一插入数据库比较费时，那么在 SQLAlchemy 1.0.0 之后，可以使用新引入的特性批量操作。

在 Session 中有

- Session.bulk_save_objects()
- Session.bulk_insert_mappings()
- and Session.bulk_update_mappings()

简单的例子：

    s = Session()
    objects = [
        User(name="u1"),
        User(name="u2"),
        User(name="u3")
    ]
    s.bulk_save_objects(objects)
    s.commit()

详情见[官网 bulk operations](http://docs.sqlalchemy.org/en/rel_1_0/orm/persistence_techniques.html#bulk-operations)

## Querying

查询

    # User objects
    for instance in session.query(User).order_by(User.id):
        print(instance.name, instance.fullname)

    # tuples
    for name, fullname in session.query(User.name, User.fullname):
        print(name, fullname)

    # named tuples, supplied by the KeyedTuple class can be treated much like an ordinary Python object
    for row in session.query(User, User.name).all():
        print(row.User, row.name)
    > <User(name='wendy', fullname='Wendy Williams', password='foobar')> wendy

    # 控制返回字段
    for row in session.query(User.name.label('name_label')).all():
        print(row.name_label)

    from sqlalchemy.orm import aliased
    user_alias = aliased(User, name='user_alias')
    for row in session.query(user_alias, user_alias.name).all():
        print(row.user_alias)

    for u in session.query(User).order_by(User.id)[1:3]:
        print(u)

    for name, in session.query(User.name).\
        filter_by(fullname='Ed Jones'):
        print(name)

    for name, in session.query(User.name).\
        filter(User.fullname=='Ed Jones'):
        print(name)

其他跟多的 filter 操作可以参考[这里](http://docs.sqlalchemy.org/en/latest/orm/tutorial.html#common-filter-operators)

## Returning Lists and Scalars
在查询时可以通过这些方法来选择返回的数量

    query = session.query(User).filter(User.name.like('%ed')).order_by(User.id)
    query.all()         # return list
    query.first()       # return first
    query.one()         # multiple rows found raise an MultipleResultsFound, or no row found raise NoResultFound
    query.one_or_none() #  if no results are found, it doesn’t raise an error just return None, however, it does raise an error if multiple results are found.
    query.scalar()      # 调用 one() 方法，一旦成功，返回行的第一列

SQLAlchemy 同样也支持直接使用 Text 来写 sql 语句，具体可以参考[官网](http://docs.sqlalchemy.org/en/latest/orm/tutorial.html#using-textual-sql)

计数可以使用 count

    session.query(User).filter(User.name.like('%ed')).count()

    from sqlalchemy import func
    session.query(func.count(User.name), User.name).group_by(User.name).all()

    session.query(func.count(User.id)).scalar()

更多关于外键等等，可以查看官网：<http://docs.sqlalchemy.org/en/latest/orm/tutorial.html>

## SQLAlchemy vs Python vs SQL 数据结构对应表

SQLAlchemy              | Python                    | SQL
------------------------|---------------------------|---------------------------
BigInteger              | int                       | BIGINT
Integer                 | int                       | INTEGER
Boolean                 | bool                      | BOOLEAN or SMALLINT
Date                    | datetime.date             | DATE (SQLite: STRING )
DateTime                | datetime.datetime         | DATETIME (SQLite: STRING )
Enum                    | str                       | ENUM or VARCHAR
Float                   | float or Decimal          | FLOAT or REAL
Interval                | datetime.timedelta        | INTERVAL or DATE from epoch
LargeBinary             | byte                      | BLOB or BYTEA
Numeric                 | decimal.Decimal           | NUMERIC or DECIMAL
Unicode                 | unicode                   | UNICODE or VARCHAR
Text                    | str                       | CLOB or TEXT
Time                    | datetime.time             | DATETIME

## 其他重要内容

### 在定义 Model 时定义表引擎和编码
在 model 中使用 `__table_args__` 来定义

    class User(BaseModel):
        __tablename__ = 'users'
        __table_args__ = {
            "mysql_engine": "InnoDB",    # 引擎
            "mysql_charset": "utf8"         # 编码
        }

        ...

### 模型属性名和表字段名不一样
在定义 Column 时指定

    id = Column('id', Integer, primary_key=True, autoincrement=True)

### 定义多列组合唯一索引
有些时候定义表时需要多列组合唯一，比如

    class User(Base):
        field1 = Column(Integer, primary_key=True)
        field2 = Column(Integer, primary_key=True)

那么可以

    class User(Base):
        field1 = Column(Integer)
        field2 = Column(Integer)
        __table_args__ = (
            UniqueConstraint('field2', 'field1'),
            {},
        )

From: [StackOverflow](https://stackoverflow.com/a/9036128/1820217)


## 编码问题
在使用 mysqldb 这个 driver 的时候莫名其妙遇到编码的问题，数据库，表，都是 utf8mb4，在 CentOS6 下面死活用不了 utf8mb4 作为连接编码

    can't initialize character set utf8mb4 (path /usr/share/mysql/charsets/)

一直都是这个错误，但在我本地一切 OK，这时候我想是不是机器 driver 的问题，换成 [pymysql](https://github.com/PyMySQL/PyMySQL) 之后就 OK 了。

    http://docs.sqlalchemy.org/en/latest/dialects/mysql.html#charset-selection

也是醉了。

## 数据库表没有主键
SQLAlchemy 在映射数据库时会寻找数据的 Primary Key，如果没有会报错。[^from]

	sqlalchemy.exc.ArgumentError: Mapper mapped class PicSearchword->pic_searchword could not assemble any primary key columns for mapped table 'pic_searchword'

SQLAlchemy ORM 会必须要求表拥有 Primary Key，而如果代码是建立在 Alchemy Core 之上，使用 Table 和 select() 则没有这个要求。

[^from]: <https://docs.sqlalchemy.org/en/13/faq/ormconfiguration.html#how-do-i-map-a-table-that-has-no-primary-key>

## reference

- 《Essential SQLAlchemy 2nd Edition 2015》
