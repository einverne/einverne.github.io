---
layout: post
title: "Python logging 模块使用"
aliases: "Python logging 模块使用"
tagline: ""
description: ""
category: 学习笔记
tags: [python, logging, logger, ]
last_updated:
---

日志是每一个编程语言必备的模块，借助日志不仅可以监控在线服务的状态，也可以在出问题之后迅速的定位问题。
 

## 基本使用

```
# -*- coding: utf-8 -*-

import logging
import sys

# 获取 logger 实例，如果参数为空则返回 root logger
# 最基本的入口，该方法参数可以为空，默认的 logger 名称是 root，如果在同一个程序中一直都使用同名的 logger，其实会拿到同一个实例，使用这个技巧就可以跨模块调用同样的 logger 来记录日志
logger = logging.getLogger("AppName")

# 指定 logger 输出格式
formatter = logging.Formatter('%(asctime)s %(levelname)-8s: %(message)s')

# 文件日志
file_handler = logging.FileHandler("test.log")
file_handler.setFormatter(formatter)  # 可以通过 setFormatter 指定输出格式

# 控制台日志
console_handler = logging.StreamHandler(sys.stdout)
console_handler.formatter = formatter  # 也可以直接给 formatter 赋值

# 为 logger 添加的日志处理器
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# 指定日志的最低输出级别，默认为 WARN 级别
logger.setLevel(logging.INFO)

# 输出不同级别的 log
logger.debug('this is debug info')
logger.info('this is information')
logger.warn('this is warning message')
logger.error('this is error message')
logger.fatal('this is fatal message, it is same as logger.critical')
logger.critical('this is critical message')

# 2016-10-08 21:59:19,493 INFO    : this is information
# 2016-10-08 21:59:19,493 WARNING : this is warning message
# 2016-10-08 21:59:19,493 ERROR   : this is error message
# 2016-10-08 21:59:19,493 CRITICAL: this is fatal message, it is same as logger.critical
# 2016-10-08 21:59:19,493 CRITICAL: this is critical message

# 移除一些日志处理器
logger.removeHandler(file_handler)
```

## 格式化输出

```python
# 格式化输出

service_name = "Booking"
logger.error('%s service is down!' % service_name)  # 使用 python 自带的字符串格式化，不推荐
logger.error('%s service is down!', service_name)  # 使用 logger 的格式化，推荐
logger.error('%s service is %s!', service_name, 'down')  # 多参数格式化
logger.error('{} service is {}'.format(service_name, 'down')) # 使用 format 函数，推荐

# 2016-10-08 21:59:19,493 ERROR   : Booking service is down!
```

## 异常

当你使用 logging 模块记录异常信息时，不需要传入该异常对象，只要你直接调用 logger.error() 或者 logger.exception() 就可以将当前异常记录下来。

```python
# 记录异常信息

try:
    1 / 0
except:
    # 等同于 error 级别，但是会额外记录当前抛出的异常堆栈信息
    logger.exception('this is an exception message')

# 2016-10-08 21:59:19,493 ERROR   : this is an exception message
# Traceback (most recent call last):
#   File "D:/Git/py_labs/demo/use_logging.py", line 45, in <module>
#     1 / 0
# ZeroDivisionError: integer division or modulo by zero
```

## 常见配置

通过日志名称来区分同一程序的不同模块

    logger = logging.getLogger("App.UI")
    logger = logging.getLogger("App.Service")
    
    import logging
    import time

    logging.basicConfig(format="%(asctime)s %(levelname)s %(message)s",
                            datefmt="%Y %b %d %H:%M:%S",
                            filename="./log.log",
                            filemode="w",               # default is "a"
                            level=logging.INFO)

    while True:
        for i in range(6):
            logging.log(i*10, "a log")                  # logging.log(level, msg)
            time.sleep(1)


fmt 中允许使用的变量可以参考下表

- %(name)s Logger 的名字
- %(levelno)s 数字形式的日志级别
- %(levelname)s 文本形式的日志级别
- %(pathname)s 调用日志输出函数的模块的完整路径名，可能没有
- %(filename)s 调用日志输出函数的模块的文件名
- %(module)s 调用日志输出函数的模块名|
- %(funcName)s 调用日志输出函数的函数名|
- %(lineno)d 调用日志输出函数的语句所在的代码行
- %(created)f 当前时间，用 UNIX 标准的表示时间的浮点数表示|
- %(relativeCreated)d 输出日志信息时的，自 Logger 创建以来的毫秒数|
- %(asctime)s 字符串形式的当前时间。默认格式是“2003-07-08 16:49:45,896”。逗号后面的是毫秒
- %(thread)d 线程 ID。可能没有
- %(threadName)s 线程名。可能没有
- %(process)d 进程 ID。可能没有
- %(message)s 用户输出的消息

## Handler 日志处理器

最常用的是 StreamHandler 和 FileHandler, Handler 用于向不同的输出端打 log，比如可以将一份日志分别输出到文件和终端。

    console = logging.StreamHandler(stream=sys.stdout)                    # 默认流为sys.stderr
    console.setLevel(logging.INFO)
    formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')
    console.setFormatter(formatter)
    logging.getLogger().addHandler(console)

    files = logging.FileHandler("log2.log", mode="a", encoding="utf-8")   # 设置文件流
    files.setLevel(logging.WARNING)
    formatter = logging.Formatter("%(levelname)s %(message)s")
    files.setFormatter(formatter)
    logging.getLogger().addHandler(files)


说明：

- StreamHandler instances send error messages to streams (file-like objects).
- FileHandler instances send error messages to disk files.
- RotatingFileHandler instances send error messages to disk files, with support for maximum log file sizes and log file rotation.
- TimedRotatingFileHandler instances send error messages to disk files, rotating the log file at certain timed intervals.
- SocketHandler instances send error messages to TCP/IP sockets.
- DatagramHandler instances send error messages to UDP sockets.
- SMTPHandler instances send error messages to a designated email address.

## 日志格式配置的方式
logging 的配置大致有下面几种方式。

- 通过代码进行完整配置，参考开头的例子，主要是通过 getLogger 方法实现。
- 通过代码进行简单配置，下面有例子，主要是通过 basicConfig 方法实现。
- 通过配置文件，下面有例子，主要是通过 logging.config.fileConfig(filepath)

通过 basicConfig 配置 logger ： <https://docs.python.org/2/library/logging.html#logging.basicConfig>

## 日志重复输出的坑
可能的原因有很多，但总结下来无非就一个，日志中使用了重复的 handler

切记添加 handler 时不要重复。
