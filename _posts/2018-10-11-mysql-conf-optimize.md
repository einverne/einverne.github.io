---
layout: post
title: "MySQL 配置优化"
tagline: ""
description: ""
category:
tags: [mysql, sql, ]
last_updated:
---

## 开启慢查询日志

查看慢查询日志

    show variables like '%slow_query_log%';
    set global slow_query_log=1;

使用上述方式修改，重启 MySQL 后修改丢失，如果要永久生效，需要修改 `my.cnf` 文件

    slow_query_log = 1
    slow_query_log_file = /tmp/mysql_slow.log


