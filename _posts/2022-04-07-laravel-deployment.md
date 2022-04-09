---
layout: post
title: "Laravel 学习笔记：部署到生产环境"
aliases: 
- "Laravel 学习笔记：部署到生产环境"
tagline: ""
description: ""
category: laravel
tags: [ laravel, php, laravel-deploy, ]
last_updated:
---


在本地开发调试的时候使用了 Laravel 提供的 Sail 依赖本地的 Docker 环境，Sail 提供了 Nginx，MySQL，Redis，等等容器，还提供了一个用于测试的 SMTP mailhog，但是生产环境可以使用更加稳定的组件。

## Requirements
Laravel 应用需要一些基础的系统依赖，需要确保Web 服务器有如下的最低要求：

- PHP >= 8.0
- BCMath PHP Extension
- Ctype PHP Extension
- cURL PHP Extension
- DOM PHP Extension
- Fileinfo PHP Extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PCRE PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension


## Nginx
Web 服务器就用 Nginx。

记住 Web 服务器所有的请求都会先到 `public/index.php` 文件，千万不要将此文件放到项目的根目录，或者 Web 服务器的根目录，如果 Web 服务器可以访问项目根目录会造成带有敏感信息的配置文件泄漏。


```
server {
    listen 80;
    server_name example.com;
    root /srv/example.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 部署过程
这里使用 [[aapanel]] 来新建一个站点。

然后将代码 push 到 GitHub，然后到机器上 push 来下。

```
cp .env.example .env
```

根据自己的配置，修改数据库、Redis、SMTP 相关的配置。

执行：

```
sudo composer install
```

注意将站点的所有者修改为 `www`:

    sudo chown -R www:www .
    
然后执行：

```
sudo php artisan key:generate
sudo php artisan migrate
```

禁用 php 方法：

- `proc_open`
- `symlink`
- `pcntl_signal`
- `pcntl_alarm`


## Composer
安装 Composer：

```
wget https://getcomposer.org/download/1.8.0/composer.phar
mv composer.phar /usr/local/bin/composer
chmod u+x /usr/local/bin/composer
composer -V
```



自动加载优化：

```
composer install --optimize-autoloader --no-dev
```

优化配置加载，将配置文件压缩到一个缓存中

```
php artisan config:cache
```

优化路由加载：

```
php artisan route:cache
```

优化视图加载


```
php artisan view:cache
```


## 问题
如果遇到如下问题：

```
PHP Fatal error:  Uncaught Error: Call to undefined function Composer\XdebugHandler\putenv() in phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/Process.php:101
Stack trace:
#0 phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/Status.php(59): Composer\XdebugHandler\Process::setEnv()
#1 phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/XdebugHandler.php(99): Composer\XdebugHandler\Status->__construct()
#2 phar:///usr/local/bin/composer/bin/composer(18): Composer\XdebugHandler\XdebugHandler->__construct()
#3 /usr/local/bin/composer(29): require('...')
#4 {main}
  thrown in phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/Process.php on line 101

Fatal error: Uncaught Error: Call to undefined function Composer\XdebugHandler\putenv() in phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/Process.php:101
Stack trace:
#0 phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/Status.php(59): Composer\XdebugHandler\Process::setEnv()
#1 phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/XdebugHandler.php(99): Composer\XdebugHandler\Status->__construct()
#2 phar:///usr/local/bin/composer/bin/composer(18): Composer\XdebugHandler\XdebugHandler->__construct()
#3 /usr/local/bin/composer(29): require('...')
#4 {main}
  thrown in phar:///usr/local/bin/composer/vendor/composer/xdebug-handler/src/Process.php on line 101

```

需要禁用 php 的 `putenv` 方法。

