---
layout: post
title: "在 HestiaCP 面板中禁用 open_basedir 配置"
aliases:
- "在 HestiaCP 面板中禁用 open_basedir 配置"
tagline: ""
description: ""
category: 经验总结
tags: [ php, hestia, hestiacp, web-control-panel ]
create_time: 2023-05-02 18:21:37
last_updated: 2023-05-02 18:21:37
---

Hestia Control Panel ([[HestiaCP]]) 是一个免费开源的 Web 服务器控制面板，它提供了一个易于使用的 Web 界面来管理 Web 服务器和网站。Hestia CP 支持多种 Linux 发行版，包括 Ubuntu、Debian、CentOS 等，可以安装和配置 Apache 或 Nginx、PHP、MySQL 等常见的 Web 服务器和数据库软件。Hestia CP 还提供了一些额外的功能，如邮件服务器、防火墙、文件备份和恢复等。

`open_basedir` 是 PHP 的一个安全特性，用于限制 PHP 脚本能够访问的文件系统路径。它指定了一个或多个目录的列表，PHP 将只允许访问这些目录中的文件。这可以帮助防止恶意脚本访问系统中的敏感文件。

`open_basedir` 最主要的功能就是隔离站点能访问的内容，而从不至于让站点之间相互影响。

如果要禁用这个功能，需要修改 PHP 的配置，访问

```
cd /usr/local/hestia/data/templates/web/php-fpm/
```

文件夹下有安装的 PHP 版本不同的配置。比如说 PHP 8.0 的配置模板文件，就是 `PHP-8_0.tpl`

打开该文件，然后找到下面一行

```
php_admin_value[open_basedir]
```

然后在这一行前面加上 `;` 注释。

```
;php_admin_value[open_basedir]
```

或者如果熟悉命令行的话，可以直接使用 `sed -i` 行内替换

```
sed -i 's/php_admin_value\[open_basedir\]/;php_admin_value\[open_basedir\]/g' /usr/local/hestia/data/templates/web/php-fpm/PHP-8_0.tpl
```

修改文件之后需要重启 PHP 8.0 的服务

```
/etc/init.d/php8.0-fpm restart
```

完成设置之后，就可以使用 `phpinfo.php` 来查看 `open_basedir` 的设置，应该会看到 `no value` 的字样。
