---
layout: post
title: "SQLAlchemy session 使用问题"
aliases: "SQLAlchemy session 使用问题"
tagline: ""
description: ""
category: 经验总结
tags: [python, sqlalchemy, mysql, orm, sql, session, flask, ]
last_updated:
---

在更改 SQLAlchemy Session 从每次请求都创建到共享同一个 Session 之后遇到了如下问题：

> StatementError: (sqlalchemy.exc.InvalidRequestError) Can't reconnect until invalid transaction is rolled back [SQL: ]

或者是

> raised unexpected: OperationalError("(_mysql_exceptions.OperationalError) (2006, 'MySQL server has gone away')",)


错误是 SQLAlchemy 抛出。原因是你从 pool 拿的 connection 没有以 session.commit 或 session.rollback 或者 session.close 放回 pool 里。这时 connection 的 transaction 没有完结（rollback or commit)。
而不知什么原因（recyle 了，timeout 了）你的 connection 又死掉了，你的 sqlalchemy 尝试重新连接。由于 transaction 还没完结，无法重连。

**正确用法**是**确保 session 在使用完成后用 session.close, session.commit 或者 session.rollback 把连接还回 pool**。

Session 是一个和数据库交互的会话。在 SQLAlchemy 中使用 Session 来创建和管理数据库连接的会话。

## SQLAlchemy 数据库连接池使用

[sessions 和 connections](http://docs.sqlalchemy.org/en/latest/orm/session_basics.html#what-does-the-session-do) 不是相同的东西， session 使用连接来操作数据库，一旦任务完成 session 会将数据库 connection 交还给 pool。

在使用 `create_engine` 创建引擎时，如果默认不指定连接池设置的话，一般情况下，SQLAlchemy 会使用一个 QueuePool 绑定在新创建的引擎上。并附上合适的连接池参数。

在以默认的方法 create_engine 时（如下），就会创建一个带连接池的引擎。

	engine = create_engine('mysql+mysqldb://root:password@127.0.0.1:3306/dbname')

在这种情况下，当你使用了 session 后就算显式地调用 session.close()，也不能把连接关闭。连接会由 QueuePool 连接池进行管理并复用。

这种特性在一般情况下并不会有问题，不过当数据库服务器因为一些原因进行了重启的话。最初保持的数据库连接就失效了。随后进行的 session.query() 等方法就会抛出异常导致程序出错。

如果想禁用 SQLAlchemy 提供的数据库连接池，只需要在调用 create_engine 是指定连接池为 NullPool，SQLAlchemy 就会在执行 session.close() 后立刻断开数据库连接。当然，如果 session 对象被析构但是没有被调用 session.close()，则数据库连接不会被断开，直到程序终止。

下面的代码就可以避免 SQLAlchemy 使用连接池：

```
#!/usr/bin/env python
#-*- coding: utf-8 -*-

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

engine = create_engine('mysql+mysqldb://root:password@127.0.0.1:3306/dbname', poolclass=NullPool)
Session = sessionmaker(bind=engine)
session = Session()
usr_obj_list = session.query(UsrObj).all()
print usr_obj_list[0].id
session.close()
```

`create_engine()` 函数和连接池相关的参数有：

* `-pool_recycle`, 默认为 -1, 推荐设置为 7200, 即如果 connection 空闲了 7200 秒，自动重新获取，以防止 connection 被 db server 关闭。
* `-pool_size=5`, 连接数大小，默认为 5，正式环境该数值太小，需根据实际情况调大
* -max_overflow=10, 超出 pool_size 后可允许的最大连接数，默认为 10, 这 10 个连接在使用过后，不放在 pool 中，而是被真正关闭的。
* `-pool_timeout=30`, 获取连接的超时阈值，默认为 30 秒

直接只用 `create_engine` 时，就会创建一个带连接池的引擎

    engine = create_engine('postgresql://postgres@127.0.0.1/dbname')

当使用 session 后就显示地调用 session.close()，也不能把连接关闭，连接由 QueuePool 连接池管理并复用。

引发问题

当数据库重启，最初保持的连接就会失败，随后进行 `session.query()` 就会失败抛出异常 mysql 数据 ，interactive_timeout 等参数处理连接的空闲时间超过（配置时间），断开

## 何时定义 session，何时提交，何时关闭
基本

- 通常来说，将 session 的生命周期和访问操作数据库的方法对象**隔离和独立**。
- 确保 transaction 有非常清晰的开始和结束，保持 transaction 简短，也就意味着让 transaction 能在一系列操作之后终止，而不是一直开放着。

    from contextlib import contextmanager

    @contextmanager
    def session_scope():
        """Provide a transactional scope around a series of operations."""
        session = Session()
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()


## 是否线程安全
Session 不是为了线程安全而设计的，因此确保只在同一个线程中使用。

如果实际上有多个线程参与同一任务，那么您考虑在这些线程之间共享 Session 及其对象；但是在这种极不寻常的情况下，应用程序需要确保实现正确的 locking scheme，以便不会同时访问 Session 或其状态。处理这种情况的一种更常见的方法是为每个并发线程维护一个 Session，而是将对象从一个 Session 复制到另一个 Session，通常使用 Session.merge() 方法将对象的状态复制到本地的新对象中。


## scoped session

想要线程安全时使用 `scoped_session()` ，文档解释

> the scoped_session() function is provided which produces a thread-managed registry of Session objects. It is commonly used in web applications so that a single global variable can be used to safely represent transactional sessions with sets of objects, localized to a single thread.


using `transactional=False` is one solution, but a better one is to simply rollback(), commit(), or close() the Session when operations are complete - transactional mode (which is called "autocommit=False"  in 0.5) has the advantage that a series of select operations will all share the same isolated transactional context..this can be more or less important depending on the isolation mode in effect and the kind of application.

DBAPI has no implicit "autocommit" mode so there is always a transaction implicitly in progress when queries are made.

This would be a fairly late answer. This is what happens: While using the session, a sqlalchemy Error is raised (anything which would also throw an error when be used as pure SQL: syntax errors, unique constraints, key collisions etc.).

You would have to find this error, wrap it into a try/except-block and perform a session.rollback().

After this you can reinstate your session.

## flush 和 commit 区别

- flush 预提交，等于提交到数据库内存，还未写入数据库文件；
- commit 就是把内存里面的东西直接写入，可以提供查询了；

## Session 的生命周期

- Session 被创建，没有和 model 绑定，无状态
- Session 接受查询语句，执行结果，关联对象到 Session
- Session 管理对象
- 一旦 Session 管理的对象有变化，commit 或者 rollback

## reference

- <http://docs.sqlalchemy.org/en/latest/orm/session_basics.html#session-faq-whentocreate>
- http://stackoverflow.com/questions/21738944/how-to-close-a-sqlalchemy-session
- https://groups.google.com/forum/#!topic/sqlalchemy/qAMe78TV0M0
- http://stackoverflow.com/questions/29224472/sqlalchemy-connection-pool-and-sessions
- http://docs.sqlalchemy.org/en/latest/orm/session_basics.html?highlight=session#basics-of-using-a-session
- <https://mofanim.wordpress.com/2013/01/02/sqlalchemy-mysql-has-gone-away/>

