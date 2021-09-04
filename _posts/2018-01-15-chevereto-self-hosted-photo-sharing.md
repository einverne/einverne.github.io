---
layout: post
title: "使用 Chevereto 自建照片分享"
tagline: ""
description: ""
category: 产品体验
tags: [php, photo, google, flickr, chevereto, self-hosted, ]
last_updated: 
---

Chevereto 是一款分享照片的程序，可以非常轻松得在自己的服务器上搭建照片分享程序，功能强大，外观精美。Chevereto 本身是收费使用的，一次性付费，终身使用，但是其开源版本可以免费使用。

目前 Chevereto 的价格是 $39，可以免费升级到 V4 版本。作者已经发生声明，在 2021 年底将终止 Free 版本的维护。

## Docker 安装
推荐使用 Docker 安装 Chevereto:

- <https://github.com/einverne/dockerfile>

## 安装 {#install}
在安装之前请先检查需要的系统[配置](https://chevereto.com/docs/requirements)，至少保证 VPS 安装有

- nginx 或者 Apache web server
- MySQL
- PHP

安装依赖

    apt-get install nginx mysql-server php7.0 php7.0-common php7.0-curl php7.0-mysql php7.0-gd php7.0-xml php7.0-mbstring

从官网下载[最新版本](https://github.com/Chevereto/Chevereto-Free/releases/latest) 压缩包

    wget https://github.com/Chevereto/Chevereto-Free/archive/1.0.9.tar.gz

### Nginx 配置
新建虚拟主机，修改域名 A 记录指向 VPS，然后配置对应的 `vim /etc/nginx/sites-enabled/photo.einverne.info`

由于 chevereto 默认提供基于 Apache 环境的伪静态规则，故 nginx 的配置是不能用的，需要自己添加规则

    server {
        listen 80;
        listen [::]:80;

        root /var/www/photo.einverne.info/html;
        index index.php index.html index.htm;

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

nginx 配置中还要注意一个 `vim /etc/nginx/nginx.conf` 配置中增加：

   server {
        client_max_body_size 20M;
        //other lines...
   } 

修改完重新加载 Nginx 配置 `/etc/init.d/nginx reload` 。

### 配置 MySQL
安装完 MySQL 之后需要为 Chevereto 新建一个数据库：

    mysql -u root -p          # 登录mysql
    create database photo;    # 创建 photo 数据库


### 修改 PHP 配置
默认的PHP上传大小在配置中略有不同，如果想要增大每张照片上传的大小，不仅上面 Nginx 中需要配置，同理 PHP 配置中也需要修改如下 `vim /etc/php/7.0/fpm/php.ini` ：

    max_execution_time
    max_input_time
    memory_limit
    post_max_size
    upload_max_filesize

修改完重新加载PHP配置 `/etc/init.d/php7.0-fpm reload` 。

在做完这一系列配置之后，将之前下载的压缩包，在 `/var/www/photo.einverne.info/html/` 目录下解压，然后使用域名访问。如果一切都没有问题，那么 Chevereto 会显示要求数据配置。要求填写：数据库名、数据库用户名、数据库用户密码，还有数据库表头。

这几项在前面安装时都已经完成，新建的数据库名，还有 MySQL 的用户名和密码，最后的数据表头名可以不变。然后下一步会填写管理员的一些信息，最后完成就好。

## 使用
设置中文，网上很多说需要修改密码，其实，在设置管理员面板中能够直接修改语言为中文。

修改图片存储路径：默认是在/images文件夹内，修改方法为在config.php修改`define(‘DIR_IM’,’images/‘);` ，这一步其实现在也能够在设置中直接修改。

## Error
如果上传遇到问题，界面上显示

    Server error (Internal server error)

一般的情况就是 Nginx 或者 PHP 的上传大小设置不对，上传的图片大于了 Nginx 或者 PHP 能够处理的大小，这是时候调整上传的大小就可以。调试方法如下；

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
