---
layout: post
title: "h5ai 目录列表程序"
tagline: ""
description: ""
category: 经验总结
tags: [linux, php, nginx, h5ai, file]
last_updated: 
---


h5ai 自己的介绍说自己的是为HTTP WEB服务设计的一款现代化的文件索引，主要面向文件，提供了现代化的可视化界面。他是一款功能强大的文件目录列表程序，由德国开发者 Lars Jung 主导开发，提供多种文件列表呈现方式，支持多种主流WEB服务器，可以在线预览文本，图片，音频，视频。

依赖：PHP 5.5+ and works fine with Apache httpd, lighttpd, nginx and Cherokee

在没有 h5ai 之前，我都使用 nginx 的自带的显示文件列表配置

    location / {
        audoindex on;
    }

不过不管是 Apache 还是 Nginx 提供的文件列表都是非常简易的，只会显示当前文件夹下的文件，如果都是压缩文件还好，遇到一些多媒体，图片，音频，视频等等就会有一些不便。

## 安装
h5ai 的安装非常方便，下载，解压，配置 Nginx，配置 DNS，访问即可，如果需要高级功能，可以再配置，主要的配置修改

- 安装php7.0， `sudo apt install php7.0`
- 修改 index 添加 h5ai 的地址， `index index.html index.htm /_h5ai/public/index.php;`
- 增加 php 的配置

配置 Nginx，在 `/etc/nginx/sites-available/` 下创建 `drive.einverne.info` 

```
server {
	listen 80;
	listen [::]:80;

	# SSL configuration
	#
	# listen 443 ssl default_server;
	# listen [::]:443 ssl default_server;

	# Add index.php to the list if you are using PHP

	root /var/www/drive.einverne.info/html;
	index index.html index.htm /_h5ai/public/index.php;
	server_name drive.einverne.info;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		# autoindex on;
		try_files $uri $uri/ =404;
	}

	# deny access to .htaccess files, if Apache's document root
	# concurs with nginx's one
	#
	#location ~ /\.ht {
	#	deny all;
	#}
	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_pass unix:/run/php/php7.0-fpm.sock;
	}
}


# Virtual Host configuration for example.com
#
# You can move that to a different file under sites-available/ and symlink that
# to sites-enabled/ to enable it.
#
#server {
#	listen 80;
#	listen [::]:80;
#
#	server_name example.com;
#
#	root /var/www/example.com;
#	index index.html;
#
#	location / {
#		try_files $uri $uri/ =404;
#	}
#}
```

再将域名的 DNS 配置 A 记录解析到 VPS

在配置的 root 目录 `/var/www/drive.einverne.info/html` 下

    wget https://release.larsjung.de/h5ai/h5ai-0.29.0.zip
    unzip h5ai-0.29.0.zip

然后刷新浏览器即可。 哦对了要确保安装了 PHP 7.0 的哈。

## 配置
h5ai 安装完成之后，可以到 `domain/_h5ai/public/index.php` 查看 h5ai 的相关信息，默认密码为空。页面中可以查看当前 h5ai 开启的选项。

Ubuntu 16.04 以上

    apt-get -y install zip
    apt-get -y install ffmpeg   # 视频缩略图
    apt-get -y install imagemagick   # PDF 缩略图

## 增加密码保护
编辑文件 `/_h5ai/public/index.php` ，在底部增加：

    function auth ()
    {
        $valid_passwords = array ("账号" => "密码");
        $valid_users = array_keys($valid_passwords);

        $user = $_SERVER['PHP_AUTH_USER'];
        $pass = $_SERVER['PHP_AUTH_PW'];

        $validated = (in_array($user, $valid_users)) && ($pass == $valid_passwords[$user]);

        if (!$validated) {
          header('WWW-Authenticate: Basic realm="My Realm"');
          header('HTTP/1.0 401 Unauthorized');
          die ("Not authorized");
        }
    }

在头部 `<?php` 的下一行，增加

    auth();

## options.json 开启更多功能
位于 `_h5ai/private/conf` 目录下。

打包下载：
搜索 "download"
127 行，enabled 由 false 改为 true。

文件信息及二维码：
搜索 "info"
185 行，enabled 由 false 改为 true。

默认简体中文：
搜索 "l10n"
202 行，enabled 由 false 改为 true。

文件及文件夹多选：
搜索 "select"
323 行，enabled 由 false 改为 true。

还有二维码等等功能，看一眼配置基本就能明白。

修改 `domain/_h5ai/public/index.php` 页面的默认密码：

首先生成自定义 sha512 密码：<http://md5hashing.net/hashing/sha512> 然后搜索 “passhash”，大概第 10 行，将其密码改成自己生成的。

## 注意
如果使用 LNMP 一键安装的环境，可能需要修改 php 配置，`vim /usr/local/php/etc/php.ini` 搜索 scandir、exec、passthru，将其从被禁用的函数中删除。

