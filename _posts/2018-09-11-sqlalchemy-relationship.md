---
layout: post
title: "SQLAlchemy 中处理 relationship"
tagline: ""
description: ""
category: 学习笔记
tags: [sqlalchemy, sql, flask, python, ]
last_updated:
---

本文主要关注在 SQLAlchemy 中实现基本的[关系模型](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html)，一对多，多对一，多对多等等。


## 一对多关系
通常一对多的关系，使用外键，用最常见的用户，地址来举例，每个地址只有一个住户，但是一个住户可以拥有多个地产。所以在 Address 中有一个外键指向 user.id 的主键。而 User 表则是使用一个 `relationship` 来表示多个地址。

    from sqlalchemy import Integer, ForeignKey, String, Column
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import relationship

    Base = declarative_base()

    class User(Base):
        __tablename__ = 'user'
        id = Column(Integer, primary_key=True)
        name = Column(String)

        addresses = relationship("Address", backref="user", lazy='dynamic')

    class Address(Base):
        __tablename__ = 'address'
        id = Column(Integer, primary_key=True)
        email = Column(String)
        user_id = Column(Integer, ForeignKey('user.id'))

上面这段代码会使得 User 拥有一个 `.addresses` 的属性，包含一系列的地址，同时，注意这个使用场景下的 `backref`，这个关键字会使得 Address 实例拥有一个 `.user` 的指向 User 的对象，可以通过 `address.user` 来引用。

而事实上，`backref` 关键字只是为了省略写两个 `relationship()` 而引入的缩写方式。其实下面的写法和上面是一致的。

    from sqlalchemy import Integer, ForeignKey, String, Column
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import relationship

    Base = declarative_base()

    class User(Base):
        __tablename__ = 'user'
        id = Column(Integer, primary_key=True)
        name = Column(String)

        addresses = relationship("Address", back_populates="user")

    class Address(Base):
        __tablename__ = 'address'
        id = Column(Integer, primary_key=True)
        email = Column(String)
        user_id = Column(Integer, ForeignKey('user.id'))

        user = relationship("User", back_populates="addresses")

只是这种写法需要使用两个 relationship，并且使用了 `back_populates` 。

以上两种方式建立了两个对象之间的关联，在 SQLAlchemy 中使用时，SQLAlchemy 会自动填充字段。一旦用户增加了 address

    u1 = User()
    a1 = Address()
    u1.addresses.append(a1)

那么此时，a1 中的 `a1.user` 同样也被填充了 u1 实例。 backref/back_populates 方法使得所有的 SQL 操作对使用者都隐藏了，调用者不需要关注 SQL 的具体实现，只需要关注 Python 对象的逻辑即可。

记住，使用 backref 单向 ref，和使用 back_populates 双向实现，是完全一致的。

### relationship 方法使用
relationship，第一个参数是类名，backref 参数是添加一个属性，第一个用户地址的例子中，就是给地址增加一个 user 属性。

relationship 中 lazy 是加载方式，默认是 select，在查询时自动查询所有数据。lazy 属性根据需求决定，如果每次查询 User 都需要获取 Address，那么 select 可以使用。如果两个表互相有外键指向对方，则 relationship 中 lazy 不能为默认值，需要 dynamic 动态加载。


## 多对一关系
多对一，其实和一对多本质上是一样的，参考上面，一对多，一个用户可以有多个地址，而多对一其实就是多个地址对应于一个用户

## 一对一关系
在一对一的双向关系中，使用 uselist 来表示，比如“计划生育”下，父母只能有一个小孩，孩子也只能有一对父母，所以使用 `uselist=False`

    class Parent(Base):
        __tablename__ = 'parent'
        id = Column(Integer, primary_key=True)
        child = relationship("Child", uselist=False, back_populates="parent")

    class Child(Base):
        __tablename__ = 'child'
        id = Column(Integer, primary_key=True)
        parent_id = Column(Integer, ForeignKey('parent.id'))
        parent = relationship("Parent", back_populates="child")

## 多对多关系
多对多关系会在两个类之间增加一个关联的表，使用 relationship() 方法中的 `secondary` 参数。

实现多对多主要可以分为三个步骤：

1. 定义关联表，保存两个表主键
2. 定义多对多表模型
3. 给每个模型添加一个访问对方属性

比如：

    association_table = Table('association', Base.metadata,
        Column('left_id', Integer, ForeignKey('left.id')),
        Column('right_id', Integer, ForeignKey('right.id'))
    )

    class Parent(Base):
        __tablename__ = 'left'
        id = Column(Integer, primary_key=True)
        children = relationship("Child",
                        secondary=association_table,
                        backref="parents")      # 注意这里使用的是 backref，如果使用的是 back_populates 则需要写两份

    class Child(Base):
        __tablename__ = 'right'
        id = Column(Integer, primary_key=True)

或者使用 Association Object

    class Association(Base):
        __tablename__ = 'association'
        left_id = Column(Integer, ForeignKey('left.id'), primary_key=True)
        right_id = Column(Integer, ForeignKey('right.id'), primary_key=True)
        extra_data = Column(String(50))
        child = relationship("Child", back_populates="parents")
        parent = relationship("Parent", back_populates="children")

    class Parent(Base):
        __tablename__ = 'left'
        id = Column(Integer, primary_key=True)
        children = relationship("Association", back_populates="parent")

    class Child(Base):
        __tablename__ = 'right'
        id = Column(Integer, primary_key=True)
        parents = relationship("Association", back_populates="child")



## reference

- <http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html>
- <http://docs.sqlalchemy.org/en/latest/orm/backref.html>
