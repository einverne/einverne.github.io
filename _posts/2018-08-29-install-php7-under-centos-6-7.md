---
layout: post
title: "Centos 6/7 下安装 PHP7"
tagline: ""
description: ""
category: 经验总结
tags: [centos, php7, php, apache, yum, ]
last_updated:
---


下面记录下 Centos 6/ 7 下通过 yum 安装 php7 环境。

2015 年 12 月初 PHP7 正式版发布，迎来自 2004 年以来最大的版本更新。PHP7 最显著的变化就是性能的极大提升，已接近 Facebook 开发的 PHP 执行引擎 HHVM。在 WordPress 基准性能测试中，速度比 5.6 版本要快 2~3 倍，大大减少了内存占用。PHP7 在语言上也有一些变化，比如添加返回类型声明、增加了一些新的保留关键字等。在安全方面，去除了 PHP 安全模式，添加魔术引号等。不仅如此，新版还支持 64 位，而且包含最新版 Zend 引擎。

查看 centos 版本

    cat /etc/centos-release

删除之前的 php 版本

    yum remove php* php-common


rpm 安装 Php7 相应的 yum 源

CentOS/RHEL 7.x:

    rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm


CentOS/RHEL 6.x:

    rpm -Uvh https://mirror.webtatic.com/yum/el6/latest.rpm

yum 安装 php7

    yum install php70w php70w-opcache

安装其他插件（选装）

    php70w
    php70w-bcmath
    php70w-cli
    php70w-common
    php70w-dba
    php70w-devel
    php70w-embedded
    php70w-enchant
    php70w-fpm
    php70w-gd
    php70w-imap
    php70w-interbase
    php70w-intl
    php70w-ldap
    php70w-mbstring
    php70w-mcrypt
    php70w-mysql
    php70w-mysqlnd
    php70w-odbc
    php70w-opcache
    php70w-pdo
    php70w-pdo_dblib
    php70w-pear
    php70w-pecl-apcu
    php70w-pecl-imagick
    php70w-pecl-xdebug
    php70w-pgsql
    php70w-phpdbg
    php70w-process
    php70w-pspell
    php70w-recode
    php70w-snmp
    php70w-soap
    php70w-tidy
    php70w-xml
    php70w-xmlrpc

重启 Apache

    service httpd restart

如果是 Apache + PHP 的话必须使用 PHPIniDir 指定 php5 的配置文件 php.ini 的路径

PHPINIDir /etc/php.ini

## reference

- <https://webtatic.com/packages/php70/>
