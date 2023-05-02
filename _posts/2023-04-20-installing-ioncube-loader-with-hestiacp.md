---
layout: post
title: "在 Hestia CP 的 VPS 上安装 ionCube Loader"
aliases:
- "在 Hestia CP 的 VPS 上安装 ionCube Loader"
tagline: ""
description: ""
category: 经验总结
tags: [hestiacp, php, hestia, linux, vps]
create_time: 2023-05-02 18:47:54
last_updated: 2023-05-02 18:47:54
---

Hestia Control Panel ([[HestiaCP]]) 是一个免费开源的 Web 服务器控制面板，它提供了一个易于使用的 Web 界面来管理 Web 服务器和网站。Hestia CP 支持多种 Linux 发行版，包括 Ubuntu、Debian、CentOS 等，可以安装和配置 Apache 或 Nginx、PHP、MySQL 等常见的 Web 服务器和数据库软件。Hestia CP 还提供了一些额外的功能，如邮件服务器、防火墙、文件备份和恢复等。

ionCube Loader 是一个 PHP 扩展程序，用于解密和执行使用 ionCube 编码技术加密的 PHP 脚本。它通常用于保护商业 PHP 应用程序的源代码，以防止未经授权的访问和复制。我之前在安装 [Clientexec](/post/2023/03/clientexec-installation.html) 的时候短暂地接触过。之前在 lnmp 和 [[aapanel]] 上都是手动安装的，基本步骤也相差不错，下载 ionCube，然后修改 PHP 配置，在配置里面将 ionCube 扩展的本地路径配置上。

首先访问 [ionCube Loader](https://www.ioncube.com/loaders.php) 官网，然后根据自己的系统下载对应版本的二进制。

解压之后可以得到很多 `.so` 文件。

```
cp ioncube_loader_lin_7.4.so /usr/lib/php/20190902
echo zend_extension=ioncube_loader_lin_7.4.so > /etc/php/7.4/fpm/conf.d/00-ioncube.ini
echo zend_extension=ioncube_loader_lin_7.4.so > /etc/php/7.4/cli/conf.d/00-ioncube.ini
```

配置 8.1

```
echo zend_extension=ioncube_loader_lin_8.1.so > /etc/php/8.1/fpm/conf.d/00-ioncube.ini
echo zend_extension=ioncube_loader_lin_8.1.so > /etc/php/8.1/cli/conf.d/00-ioncube.ini
```

重启

```
service php7.4-fpm restart
```

验证

```
php7.4 -v
```

![YmCr](https://photo.einverne.info/images/2023/05/02/YmCr.png)

可以在 `/usr/lib/php` 目录下看到三个日期的目录，上面提到了一个 20190902 的目录。如果要配置其他 PHP 的版本，就需要用到其他的目录。

这三个数字分别代表 PHP 的版本号。20190902 代表 PHP 7.4，20200930 代表 PHP 8.0，而 20220829 代表 PHP 8.1。这些数字用于指定 PHP 扩展或应用程序所需的最低 PHP 版本。如果一个应用程序需要 PHP 7.4 或更高版本，则可以使用 20190902，如果需要 PHP 8.0 或更高版本，则可以使用 20200930，如果需要 PHP 8.1 或更高版本，则可以使用 20220829。

要注意的是 ionCube 是不提供 8.0 版本的，所以如果要求 8.0 以上，那么就需要配置 8.1 的。
