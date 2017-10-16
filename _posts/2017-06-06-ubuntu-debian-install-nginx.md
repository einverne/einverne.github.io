---
layout: post
title: "Ubuntu/Debian 安装 nginx"
tagline: ""
description: ""
category: 经验总结
tags: [Linux, nginx, Ubuntu, Debian, web]
last_updated: 
---


## installation
Use following command to install:

	sudo apt-get install nginx
	nginx -v 

all config file is under `/etc/nginx/nginx.conf` 

all vhost is under `/etc/nginx/sites-available`

program file is under `/usr/sbin/nginx`

log file is under `/var/log/nginx` , name of log file is access.log and error.log

init script has been created under `/etc/init.d/`

start from nginx 1.4.1, the default vhost direcotory is under `/usr/share/nginx/html/`

`apt-get install nginx` the config file is under `/etc/nginx/site-available/default/`，

user data can be found in conf file.

`sudo nginx -t` to test and print log.

## manage nginx

start nginx

	sudo service nginx start

stop nginx

	sudo service nginx stop

other parameters:

	reload        restart       start         status        stop


## nginx files and path

### content

`/usr/share/nginx/html/`: actual web content, this path can be changed by altering Nginx configuration file.

默认 Ubuntu 16.04 会将 nginx 托管的地址指向 `/var/www/html/` 目录。

### server configuration

`/etc/nginx`: The nginx configuration directory. All of the configuration files reside here.

`/etc/nginx/sites-available/`: The directory where per-site "server blocks" can be stored. Nginx will not use the configuration files found in this directory unless they are linked to the sites-enabled directory (see below). Typically, all server block configuration is done in this directory, and then enabled by linking to the other directory.

`/etc/nginx/sites-enabled/`: The directory where enabled per-site "server blocks" are stored. Typically, these are created by linking to configuration files found in the sites-available directory.

### log
`/var/log/nginx/access.log`: Every request to your web server is recorded in this log file unless Nginx is configured to do otherwise.

`/var/log/nginx/error.log`: Any Nginx errors will be recorded in this log.

### nginx conf
nginx conf

	user www-data;
	worker_processes auto;
	pid /run/nginx.pid;

	events {
		worker_connections 768;
		# multi_accept on;
	}

**user**  
Defines which Linux user will own and run the nginx. Most Debian-based distributions use `www-data`.

**worker_process**  
Defines how many threads, or simultaneous instances, of nginx to run. Learn more [here](http://wiki.nginx.org/CoreModule#worker_processes)

**pid**  
Defines where nginx will write its master process ID, or PID.

## 设置 Nginx Server Blocks
Server Blocks 类似 Apache Virtual Hosts 概念，作用就是通过配置让同一台机器同时托管多个域名。

首先创建目录

	sudo mkdir -p /var/www/www.einverne.info/html
	sudo chmod -R 755 /var/www

如果组和用户不是 `www-data` ，可以用 `sudo chown -R www-data:www-data /var/www/www.einverne.info/html` 来改变

默认情况下 nginx 包含一个 server block ---- default , 创建其他 server block的时候可以以它作为模板

	sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/www.einverne.info

然后修改该配置

```
server {
	listen 80;
	listen [::]:80;

	root /var/www/www.einverne.info/html;
	index index.html index.htm index.nginx-debian.html;

	server_name www.einverne.info;

	location / {
			try_files $uri $uri/ =404;
	}
}
```

修改 `vim /etc/nginx/nginx.conf` 中

```
http {
    . . .

    server_names_hash_bucket_size 64;

    . . .
}
```

使用 `sudo nginx -t` 来测试配置。


## reference

- <https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04>
