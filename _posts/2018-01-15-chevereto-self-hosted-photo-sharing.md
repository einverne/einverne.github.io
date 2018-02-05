---
layout: post
title: "使用 Chevereto 自建照片分享"
tagline: ""
description: ""
category: 产品体验
tags: [php, photo, google, flickr, ]
last_updated: 
---

Chevereto 是一款分享照片的程序，可以非常轻松得在自己的服务器上搭建照片分享程序，功能强大，外观精美。Chevereto 本身是收费使用的，一次性付费，终身使用，但是其开源版本可以免费使用。

## 安装 {#install}
在安装之前请先检查需要的系统[配置](https://chevereto.com/docs/requirements)，至少保证 VPS 安装有

- nginx 或者 Apache web server
- MySQL
- PHP

安装依赖

    apt-get install nginx mysql-server php7.0 php7.0-common php7.0-curl php7.0-mysql php7.0-gd php7.0-xml php7.0-mbstring

从官网下载[最新版本](https://github.com/Chevereto/Chevereto-Free/releases/latest) 压缩包

    wget https://github.com/Chevereto/Chevereto-Free/archive/1.0.9.tar.gz

由于 chevereto 默认提供基于 Apache 环境的伪静态规则，故 nginx 的配置是不能用的，需要自己添加规则

    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;
        index index.php index.html index.htm index.nginx-debian.html;

        server_name server_domain_or_IP;

        location / {
            try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        }

        location ~ /\.ht {
            deny all;
        }
    }



配置 MySQL

    mysql -u root -p          # 登录mysql
    create database photo;    # 创建 photo 数据库



数据库名、数据库用户名、数据库用户密码，最后的数据表头名可以不变


max_execution_time
max_input_time
memory_limit
post_max_size
upload_max_filesize



设置中文：Chevereto默认是英文，但鉴于功能十分简单，是否修改中文也无所谓。修改方法为在config.php修改define(‘LANG’, ‘cn’);

修改图片存储路径：默认是在/images文件夹内，修改方法为在config.php修改define(‘DIR_IM’,’images/‘);



## Error
界面上显示

    Server error (Internal server error)

没有给出任何信息，查看 nginx 错误日志

    tailf /var/log/nginx/error.log

发现如下错误

    2018/02/05 19:21:12 [error] 2693#2693: *8 client intended to send too large body: 1318270 bytes, client: 172.xxx.xxx.xxx, server: photo.einverne.info, request: "POST /json HTTP/1.1", host: "photo.einverne.info", referrer: "http://photo.einverne.info/dashboard/settings/system"

解决办法

    vi /etc/nginx/nginx.conf

添加

    client_max_body_size 20M;

然后 `/etc/init.d/nginx reload` 重新加载 nginx 服务配置。

## reference

- <https://github.com/Chevereto/Chevereto-Free>
- <https://hluglk.top/archives/1489335900/>
