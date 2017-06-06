---
layout: post
title: "Ubuntu/Debian install nginx"
tagline: ""
description: ""
category: 经验总结
tags: [Linux, nginx, Ubuntu, Debian, web]
last_updated: 
---


## installation
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




## reference

- <https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04>
