---
layout: post
title: "威联通折腾篇二十：自带 Apache Web 服务器及 SSL 配置"
aliases: "威联通折腾篇二十：自带 Apache Web 服务器及 SSL 配置"
tagline: ""
description: ""
category: 学习笔记
tags: [qnap, qnap-tutorial, linux, apache, web-server,]
last_updated:
---

折腾一下威联通自带的 Web 服务器。

## vhost
在界面上修改虚拟主机配置，比如 `Create New Virtual Host`:

- Host name: blog.nas.com
- folder: /share/Web/wp
- protocol: HTTP
- port number: 80

对应的修改会保存到如下文件：

	/etc/config/apache/extra/httpd-vhosts-user.conf

点击应用，QNAP 会应用修改，然后因为我是局域网用，所以修改了我本地 `/etc/hosts`，把域名 `blog.nas.com` 指到 QNAP 的局域网地址。

	/etc/init.d/Qthttpd.sh reload

然后在自己机器上就能通过域名 (blog.nas.com) 访问 NAS 中 `/share/Web/wp` 目录。

### vhost 配置解析
在 QNAP 上查看 vhost 配置文件 `/etc/config/apache/extra/httpd-vhosts-user.conf`，可以看到：

	NameVirtualHost *:80
	<VirtualHost _default_:80>
			DocumentRoot "/share/Web"
	</VirtualHost>
	<VirtualHost *:80>
	<Directory "/share/Web/wp">
			Options FollowSymLinks MultiViews
			AllowOverride All
			Require all granted
	</Directory>
			ServerName blog.nas.com
			DocumentRoot "/share/Web/wp"
	</VirtualHost>

解释：

- `DocumentRoot` 配置了服务器根目录
- `Options` MultiViews 使用"MultiViews"搜索，即服务器执行一个隐含的文件名模式匹配，并在其结果中选择。
- `ServerName` 主机名字

## SSL 配置

- <https://github.com/Yannik/qnap-letsencrypt>

## reference

- <https://forum.qnap.com/viewtopic.php?t=144890>
