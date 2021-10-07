---
layout: post
title: "使用 alembic 迁移数据库结构"
tagline: ""
description: ""
category: 学习笔记
tags: [python, mysql, sql, migration, db, database, alembic, flask, sqlalchemy, ]
last_updated:
---

Alembic 是一个处理数据库更改的工具，它利用 SQLAlchemy 来实现形成迁移。因为 SQLAlchemy 只会在我们使用时根据 metadata create_all 方法来创建缺少的表 ，它不会根据我们对代码的修改而更新数据库表中的列。它也不会自动帮助我们删除表。 Alembic 提供了一种更新 / 删除表，更改列名和添加新约束的方法。因为 Alembic 使用 SQLAlchemy 执行迁移，它们可用于各种后端数据库。

## 安装

    pip install alembic

## 使用
初始化，使用如下命令会创建环境到 `migrations` 文件夹下，通常情况下使用 `migrations` 文件夹来存储 alembic 环境，如果想使用别的名字，相应替换为别的名字即可。**注意下面命令中的 migrations 将会是存储所有迁移脚本的目录名字**

    alembic init migrations

初始化过程会创建迁移环境和 `alembic.ini` 文件。创建成功后可以看到如下结构：

    alembic
    ├── README
    ├── env.py
    ├── script.py.mako
    └── versions
    alembic.ini

在这个环境中可以找到 `env.py` 和 `script.py.mako` 模板还有 versions 文件夹。`versions/` 目录会存储之后的所有迁移脚本。 `env.py` 文件用来定义和实例化 SQLAlchemy 引擎，连接引擎并进行事务，保证当 Alembic 执行命令时被合理的调用。 `script.py.mako` 模板在创建迁移时被使用，他定义了迁移的基本模板。

## 配置
在 `init` 生成之后需要修改 `env.py` 如下的两个配置，才能生效。改变 `sqlalchemy.url` 值，配置数据库连接。

    sqlalchemy.url = driver://user:pass@localhost/dbname

为了让 Alembic 追踪到数据模型的变化，需要将 `target_metadata` 赋值为数据库的 metadata

    from flask import current_app
    config.set_main_option('sqlalchemy.url',
                           current_app.config.get('SQLALCHEMY_DATABASE_URI'))
    target_metadata = current_app.extensions['migrate'].db.metadata


## 自动创建版本

使用`alembic revision -m "comment"` 来创建数据库版本。命令会产生一个数据库迁移脚本。

## 更新数据库
升级数据库使用 `alembic upgrade`，降级使用 `alembic downgrade`，更新到最新版则使用 `alembic upgrade head`。

查看数据库就会发现 alembic 会自动产生一个 `alembic_version` 的表，只有一个字段和值 `version_num`，记录当前数据库版本。


## reference

- 《Essential SQLAlchemy 2nd Edition 2015》
