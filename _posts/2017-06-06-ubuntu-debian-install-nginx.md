---
layout: post
title: "Ubuntu/Debian 安装 nginx"
aliases: "Ubuntu/Debian 安装 nginx"
tagline: ""
description: ""
category: 经验总结
tags: [linux, nginx, ubuntu, debian, web]
last_updated:
---

Nginx 是非常流行的 HTTP/HTTPS 服务器软件，它也可以作为反向代理服务器，邮件代理服务器，可以用于负载均衡，缓存等等。

基本的 Nginx 由 master 进程和 worker 进程组成， master 读取配置文件，并维护 worker 进程，而 worker 会对请求进行处理。

Nginx 有两个主要的分支可供安装，stable 和 mainline 。这两个分支的主要区别可以从下图看出：

![nginx two branchs](https://i.stack.imgur.com/etScD.png)

stable 分支并不意味着比 mainline 更加稳定可靠，事实上 mainline 更加稳定，因为 Nginx 开发人员会把所有的 bugfixes 都提交到该分支，而只会把 major bugfixes 提交到 stable 分支。然而另一方面，在 stable 分支的提交很少会影响到第三方模块，而在 mainline 上面的开发可能更快所有的新特性，更新，bugs，都会可能对第三方模块造成影响。

Nginx [官方](https://www.nginx.com/blog/nginx-1-12-1-13-released/) 建议可以在任何时候使用 mainline 分支。而在生产环境使用 stable 分支。

## 安装 {#installation}
Use following command to install:

    sudo apt-get install nginx
    nginx -V

all config file is under `/etc/nginx/nginx.conf`

all vhost is under `/etc/nginx/sites-available`

program file is under `/usr/sbin/nginx`

log file is under `/var/log/nginx` , name of log file is access.log and error.log

init script has been created under `/etc/init.d/`

start from nginx 1.4.1, the default vhost direcotory is under `/usr/share/nginx/html/`

`apt-get install nginx` the config file is under `/etc/nginx/site-available/default/`，

user data can be found in conf file.

`sudo nginx -t` to test and print log.

## 管理 nginx {#manage-nginx}

start nginx

    sudo service nginx start

stop nginx

    sudo service nginx stop

other parameters:

    reload        restart       start         status        stop

## nginx 的配置文件及路径

### 托管网站内容 content

`/usr/share/nginx/html/`: actual web content, this path can be changed by altering Nginx configuration file.

默认 Ubuntu 16.04 会将 nginx 托管的地址指向 `/var/www/html/` 目录。

### 服务配置 server configuration
Nginx 的主要配置都集中在 `/etc/nginx` 目录下：

`/etc/nginx`: The nginx configuration directory. All of the configuration files reside here.

- `/etc/nginx/sites-available/`: The directory where per-site "server blocks" can be stored. Nginx will not use the configuration files found in this directory unless they are linked to the sites-enabled directory (see below). Typically, all server block configuration is done in this directory, and then enabled by linking to the other directory.

- `/etc/nginx/sites-enabled/`: The directory where enabled per-site "server blocks" are stored. Typically, these are created by linking to configuration files found in the sites-available directory.

### 日志文件 log
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
Server Blocks 类似 Apache Virtual Hosts（虚拟主机） 概念，作用就是通过配置让同一台机器同时托管多个域名。

首先创建目录

    sudo mkdir -p /var/www/www.einverne.info/html
    sudo chmod -R 755 /var/www/

如果组和用户不是 `www-data` ，可以用 `sudo chown -R www-data:www-data /var/www/www.einverne.info/html` 来改变

默认情况下 nginx 包含一个默认的 server block 叫做 default , 创建其他 server block 的时候可以以它作为模板：

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

最后需要 `ln` 启用新的虚拟主机

	sudo ln -s /etc/nginx/sites-available/www.einverne.info /etc/nginx/sites-enabled/

使用 `sudo nginx -t` 来测试配置。

重启 `sudo /etc/init.d/nginx reload` 启用新配置。

更多的 Nginx 配置相关内容可以查看新文章 [Nginx conf](/post/2017/10/nginx-conf.html)

## 从源代码编译 Nginx 安装

获取 Nginx 最新版本 <http://nginx.org/en/download.html> 使用最新 mainline 版本即可

下载最新源代码，解压

	wget http://nginx.org/download/nginx-1.13.6.tar.gz && tar zxvf nginx-1.13.6.tar.gz

### 下载安装依赖
以下内容都使用 root 安装 `su -`

	apt-get install -y gcc g++ make automake build-essential

安装 [PCRE](http://www.pcre.org/) 库，Nginx Core 和 Rewrite 模块提供正则支持

	apt-get install libpcre3 libpcre3-dev

[OpenSSL](https://www.openssl.org/)

	sudo apt-get install openssl libssl-dev libperl-dev

zlib 库，提供 Gzip 模块支持，压缩 headers

	apt-get install -y zlib1g zlib1g-dev

XML xslt

	apt-get install libxslt-dev

GD Library

	apt-get install libgd2-dev

GeoIP Library

	apt-get install libgeoip-dev


使用 APT 源安装 Nginx，并查看版本 `nginx -V`

	nginx -V
	nginx version: nginx/1.10.3 (Ubuntu)
	built with OpenSSL 1.0.2g  1 Mar 2016
	TLS SNI support enabled
	configure arguments: --with-cc-opt='-g -O2 -fPIE -fstack-protector-strong -Wformat -Werror=format-security -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -fPIE -pie -Wl,-z,relro -Wl,-z,now' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-pcre-jit --with-ipv6 --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_addition_module --with-http_dav_module --with-http_geoip_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module --with-http_v2_module --with-http_sub_module --with-http_xslt_module --with-stream --with-stream_ssl_module --with-mail --with-mail_ssl_module --with-threads

Configure 后面的参数在编译时会需要用到

在反向代理中替换原网页内容，需要在编译时加入第三方模块 substitution

	git clone https://github.com/yaoweibin/ngx_http_substitutions_filter_module

另一个方便快捷配置 Google 反代的模块

	git clone https://github.com/cuber/ngx_http_google_filter_module

然后进入 Nginx 源代码目录，注意参数中 `--add-module` 后面需要加入上面提及的两个 module 路径：

	cd nginx-1.13.6/
	./configure \
	--with-cc-opt='-g -O2 -fPIE -fstack-protector-strong -Wformat -Werror=format-security -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -fPIE -pie -Wl,-z,relro -Wl,-z,now' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-pcre-jit --with-ipv6 --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_addition_module --with-http_dav_module --with-http_geoip_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module --with-http_v2_module --with-http_sub_module --with-http_xslt_module --with-stream --with-stream_ssl_module --with-mail --with-mail_ssl_module --with-threads \
	--add-module=../ngx_http_substitutions_filter_module \
	--add-module=../ngx_http_google_filter_module

设置后，开始检查编译参数和环境，如果少了某些安装包，或者需要特定版本的 lib 就会报错，Google 一下需要的依赖包安装即可。安装之后再次 `./configure`

检查通过显示

	Configuration summary
	  + using threads
	  + using system PCRE library
	  + using system OpenSSL library
	  + using system zlib library

	  nginx path prefix: "/usr/share/nginx"
	  nginx binary file: "/usr/sbin/nginx"
	  nginx modules path: "/usr/share/nginx/modules"
	  nginx configuration prefix: "/etc/nginx"
	  nginx configuration file: "/etc/nginx/nginx.conf"
	  nginx pid file: "/run/nginx.pid"
	  nginx error log file: "/var/log/nginx/error.log"
	  nginx http access log file: "/var/log/nginx/access.log"
	  nginx http client request body temporary files: "/var/lib/nginx/body"
	  nginx http proxy temporary files: "/var/lib/nginx/proxy"
	  nginx http fastcgi temporary files: "/var/lib/nginx/fastcgi"
	  nginx http uwsgi temporary files: "/var/lib/nginx/uwsgi"
	  nginx http scgi temporary files: "/var/lib/nginx/scgi"

	./configure: warning: the "--with-ipv6" option is deprecated

然后编译

	make
	make install

然后将编译后的文件替换到发行版的安装目录

	cp -rf objs/nginx /usr/sbin/nginx

检查 `nginx -V` 即可看到新编译的版本。

### 常用配置

Options                  | Explanation
-------------------------|-------------------------
`--prefix=<path>`        | 安装的根目录，默认为 `/usr/local/nginx`
`--sbin-path=<path>`     | **nginx** 二进制文件路径，如果没有设定，则使用 prefix 作为相对路径
`--conf-path=<path>`     | 配置路径
`--error-log-path=<path>` | 错误 log
`--pid-path=<path>`      | nginx 写 pid 文件，通常在 `/var/run` 下
`--lock-path=<path>`   | 共享内存锁文件
`--user=<user>`        | 在哪个用户下运行 worker processes
`--group=<group>`      | 组
`--with-debug`          | 开启 debug log 生产环境不要启用
`--with-http_ssl_module` | 开启 HTTP SSL 模块，支持 HTTPS
`--with-http_realip_module` | 开启真实来源 IP
`--with-http_flv_module` | 开启 flash 视频流
`--with-http_mp4_module` | 开启 H.264/AAC 文件视频流
`--with-http_gzip_static_module` | 开启预压缩文件传前检查，防止文件被重复压缩
`--with-http_gunzip_module` | 开启为不支持 gzip 的客户端提前解压内容
`--with-http_stub_status_module` | 开启 nginx 运行状态
`--with_http_substitutions_filter_module`  | 开启替换原网页内容


## reference

- <https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04>
- <https://github.com/cuber/ngx_http_google_filter_module>
