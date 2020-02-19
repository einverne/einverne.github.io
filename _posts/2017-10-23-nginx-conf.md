---
layout: post
title: "Nginx 配置详解"
tagline: ""
description: ""
category: 学习笔记
tags: [nginx, web, server, linux, proxy,]
last_updated:
---

Nginx 的相关介绍及安装可以参考之前的一篇[文章](/post/2017/06/ubuntu-debian-install-nginx.html)

Nginx 相关的配置， Nginx 中的配置有两种分类，一种为单纯的指令 (directive)，另一种为上下文配置块 (configuration context)。

指令 (directive)，包含**名称**和**参数名**，以分号结束，比如

    gzip on;

**上下文**通常声明一个作用域，比如 server 块

    server {
        listen 80;
    }

在上下文中使用相同的指令时需要小心，一般子级上下文中的指令会覆盖父级中定义的值。

## 全局块 {#global-conf}
Nginx 的全局配置是影响整个 WEB 服务器的配置。

主要有以下几个

Directive                 | Explanation
--------------------------|-----------------------------
user                      | worker process 在配置的 user and group 下运行
workr_processes           | 最多的 worker processes 数量，可支持并发数，通常的做法是指定和 CPU cores 数量一致
error_log                 | log
pid                       | file where the process ID of the main process is written
use                       | 连接方式
worker_connections        | 连接数

### 配置用户用户组

设置用户的配置

	user user [group];

- user, 可运行 Nginx 服务器的用户
- group, 指定可运行用户组

希望所有用户都可以启动 Nginx 进程，一种是直接注释该配置，或者

	user nobody nobody;

Nginx 配置文件中，每一条配置都必须以分号结束。

### 配置 worker process 数

worker process 是 Nginx 并发关键所在，理论上 worker process 值越大，可支持并发数也越多，但实际也受到软件，操作系统，硬件（CPU 和磁盘）等资源的制约。

	worker_processes number | auto;

- number, 指定 Nginx 进程最多可产生的 worker process 数
- auto Nginx 自动

### PID 存放路径
Nginx 进程作为系统守护进程运行，在文件中保存当前运行程序主进程号，支持配置 PID

	pid file_path;

- `file_path` 为存放路径和文件名

### 错误日志路径
全局块、http 块 和 server 块都可以对 Nginx 日志进行配置

	error_log file | stderr [debug | info | notice | warn | error |crit | alert | emerg];

Nginx 日志支持输出到文件 file, 或者标准错误输出 stderr.

日志级别可选，从低到高 debug, info, notice, warn, error, crit, alert, emerg ，需要注意的是 debug 需要编译时使用 `--with-debug` 开启。


### 引入其他配置

Nginx 提供 include 配置来引入其他文件

	include file;

- file 是要引入的配置文件，支持相对路径和正则匹配

### 最大连接数
设置每一个 worker process 同时开启的最大连接数

	worker_connections number;

只能在 events 块中配置


### 定义 MIME TYPE 类型

浏览器使用 MIME Type 来区分不同的媒体类型， Nginx 作为 Web 服务器，必须能够识别前端请求的资源类型。

默认的配置中，可以使用两种方式来配置

	include mime.types;
	default_type application/octet-stream

第一种方式引用外部文件。

`mime.types` 文件

	types {
		text/html                             html htm shtml;
		text/css                              css;
		text/xml                              xml;
		image/gif                             gif;
		image/jpeg                            jpeg jpg;
		application/javascript                js;
		application/atom+xml                  atom;
		application/rss+xml                   rss;

		text/mathml                           mml;
		text/plain                            txt;
		text/vnd.sun.j2me.app-descriptor      jad;
		text/vnd.wap.wml                      wml;
		text/x-component                      htc;

		image/png                             png;
		image/tiff                            tif tiff;
		image/vnd.wap.wbmp                    wbmp;
		image/x-icon                          ico;
		image/x-jng                           jng;
		image/x-ms-bmp                        bmp;
		image/svg+xml                         svg svgz;
		image/webp                            webp;

		application/font-woff                 woff;
		application/java-archive              jar war ear;
		application/json                      json;
		application/mac-binhex40              hqx;
		application/msword                    doc;
		application/pdf                       pdf;
		application/postscript                ps eps ai;
		application/rtf                       rtf;
		application/vnd.apple.mpegurl         m3u8;
		application/vnd.ms-excel              xls;
		application/vnd.ms-fontobject         eot;
		application/vnd.ms-powerpoint         ppt;
		application/vnd.wap.wmlc              wmlc;
		application/vnd.google-earth.kml+xml  kml;
		application/vnd.google-earth.kmz      kmz;
		application/x-7z-compressed           7z;
		application/x-cocoa                   cco;
		application/x-java-archive-diff       jardiff;
		application/x-java-jnlp-file          jnlp;
		application/x-makeself                run;
		application/x-perl                    pl pm;
		application/x-pilot                   prc pdb;
		application/x-rar-compressed          rar;
		application/x-redhat-package-manager  rpm;
		application/x-sea                     sea;
		application/x-shockwave-flash         swf;
		application/x-stuffit                 sit;
		application/x-tcl                     tcl tk;
		application/x-x509-ca-cert            der pem crt;
		application/x-xpinstall               xpi;
		application/xhtml+xml                 xhtml;
		application/xspf+xml                  xspf;
		application/zip                       zip;

		application/octet-stream              bin exe dll;
		application/octet-stream              deb;
		application/octet-stream              dmg;
		application/octet-stream              iso img;
		application/octet-stream              msi msp msm;

		application/vnd.openxmlformats-officedocument.wordprocessingml.document    docx;
		application/vnd.openxmlformats-officedocument.spreadsheetml.sheet          xlsx;
		application/vnd.openxmlformats-officedocument.presentationml.presentation  pptx;

		audio/midi                            mid midi kar;
		audio/mpeg                            mp3;
		audio/ogg                             ogg;
		audio/x-m4a                           m4a;
		audio/x-realaudio                     ra;

		video/3gpp                            3gpp 3gp;
		video/mp2t                            ts;
		video/mp4                             mp4;
		video/mpeg                            mpeg mpg;
		video/quicktime                       mov;
		video/webm                            webm;
		video/x-flv                           flv;
		video/x-m4v                           m4v;
		video/x-mng                           mng;
		video/x-ms-asf                        asx asf;
		video/x-ms-wmv                        wmv;
		video/x-msvideo                       avi;
	}

文件中包含了浏览器能够识别的 MIME 类型，以及对应的文件后缀名。

第二种方式使用 `default_type mime-type` 直接配置。

## Server section

### 自定义 Access 日志
与 `error_log` 不同的是，Nginx 进程运行时访问日志，由 Nginx 提供服务过程中应答前端请求的日志。

Nginx 服务器支持对服务日志的格式、大小、输出等进行配置，需要使用两个配置 `access_log` 和 `log_format`

	access_log path [format [buffer=size]];

- path, 配置服务日志的文件存放路径及名称
- format 可选，自定义日志格式，也可以通过 `log_format` 配置指定好，直接引用格式名
- size 临时存放日志的内存缓存区大小

如果要取消记录日志功能，使用

	access_log off;

自定义日志格式

	log_format name string ...;

- name 格式字符串的名字，默认为 combined
- string 自定义格式化字符串

示例，配置如下两行

	log_format exampleLog '$remote_addr - [$time_local] $request '
						  '$status $body_bytes_sent '
						  '$http_referer $http_user_agent';

	access_log /var/log/nginx/access.log exampleLog;

查看日志 `tailf /var/log/nginx/access.log`

	47.88.236.38 - [24/Oct/2017:10:25:30 +0800] GET /post/2017/10/things-to-do-after-install-wordpress.html?ajax_load=page HTTP/1.1 200 6961 https://www.einverne.info/ Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36

可以查看到上面格式的日志，`IP 本地时间 请求方法 请求路径 HTTP 状态 发送数据大小 以及 HTTP refer 和 User Agent`.


### 配置连接超时时间
用户连接会话连接后， Nginx 服务器可以保持打开一段时间

	keepalive_timeout timeout [header_timeout];

- timeout 对连接的保持时间
- `header_timeout` 可选，在 Response 头部 `Keep-Alive` 域设置超时时间

示例

	keepalive_timeout 120s 100s;

### 设置单连接请求数上限
限制用户通过某一个连接向 Nginx 发送请求次数

	keepalive_requests number;

## 虚拟主机配置

虚拟主机配置以 `server` 开头，server 内的配置都认为是 **虚拟主机** 配置。虚拟主机定义了一套由不同 `server_name` 配置区分的资源。虚拟主机一般由 `listen` 、`server_name` 等一组配置决定。


### 配置网络监听
监听配置方法主要有三种：

第一种配置监听 IP 地址

	listen address[:port] [default_server] [setfib=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [deferred] [accept_filter=filter] [bind] [ssl];

第二种配置监听端口

	listen port [default_server] [setfib=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on|off] [ssl];

第三种配置 UNIX Domain Socket

	listen unix:path [default_server] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ssl];

- 使用 `default_server` 将虚拟主机地址设置为 address:port 为默认
- setfib 不常用
- backlog 设置监听函数 listen() 最多运行多少网络连接同时处于挂起状态
- rcvbuf 监听 socket 接受缓存区大小
- sndbuf 监听 socket 发送缓存区大小
- ssl 会话使用 SSL 模式

### 配置虚拟主机名称

主机是指 server 块对外提供虚拟主机

	server_name name ...;

名字就是域名，用空格隔开

	server_name einverne.info www.einverne.info;

Nginx 规定第一个名称作为虚拟主机的主要名

name 中可以使用通配符 `*` ，但通配符只能放到首尾，name 中还能使用正则表达式，使用 `~` 开始

	server_name ~^ww\d+\.einverne\.info$;

匹配 `ww1.einverne.info` 但不匹配 `www.einverne.info`

对于不同的匹配方式，Nginx 按照如下优先级选择虚拟主机

- 准确匹配 `server_name`
- 通配符在开始时匹配 `server_name` 成功
- 通配符在结尾时匹配 `server_name` 成功
- 正则表达式匹配

在以上四种匹配方式中，如果 `server_name` 被处于同一优先级匹配方式匹配多次成功，则首次匹配成功的虚拟主机处理请求。

### 基于 IP 的虚拟主机配置

不是很常用，暂时略

### 配置 location 块
location 指令在 virtual server 部分使用，用来比欧式 URI 怎么处理。

语法

	location [ = | ~ | ~* | ^~ ] uri { ... }

其中，uri 变量是待匹配的请求字符串，可以是不含正则表达的字符串。

方括号中为可选项，不添加可选项时， Nginx 首先在 server 块多个 location 块中搜索是否有匹配，如果有多个匹配，就记录匹配度最高的一个。然后，Nginx 再用 location 块中的正则 uri 和请求匹配，当第一个正则匹配成功，结束搜索，并使用该 location 块处理请求，如果正则全部失败，则使用刚才记录的匹配度最高的 location 块处理该请求。

了解了 location 块匹配规则，再来看一下各个可选项的含义：

- `=` 用于非正则 uri 前，要求字符串与 uri 严格匹配，如果匹配成功，则停止向下搜索，并立即处理此请求
- `~` 表示该 uri 包含正则，并且区分大小写
- `~*` 表示 uri 包含正则，不区分大小写
- `^~` 用于非正则 uri 前，Nginx 服务器找到标示 uri 和请求字符串匹配程度最高的 location 后立即使用该 location 处理请求，不再匹配 location 块的正则 url

如果 uri 包含正则，则必须使用 `~` 和 `~*` 。 而对于 `^~` 会对 uri 中的 urlencode 内容解码， `%20` 会被理解为空格。


### 配置请求的根目录
Nginx 接受到请求之后，在服务器指定目录中寻求资源

	root path;

path 为 Nginx 接受到请求之后查找资源的根目录路径。 path 变量可以包含 Nginx 服务器预设的大多数变量，但要注意 `$document_root` 和 `$realpath_root` 不可用。

该配置可以再 http 块、 server 块或者 location 块中进行配置。


### 更改 location 的 URI
在 location 块中，除了使用 root 命令指明请求处理根目录，还可以使用 alias 配置来改变 location 接收到的 URI 请求

	alias path;

path 就是修改后的根路径。

示例

	location ~ ^/data/(.+\.(htm|html)) $ {
		alias /var/www/data/$1;
	}

当 location 块接收到 `/data/index.html` 请求时，匹配成功，根据 alias 配置， Nginx 在 `/var/www/data/` 目录下找到 `index.html` 并响应请求。

关于 root 和 alias 的[区别](/post/2018/11/nginx-location-root-alias.html) 可以参考这篇[文章](/post/2018/11/nginx-location-root-alias.html)

### 设置网站默认首页
在用户发出请求时，请求地址可以不填写首页完整路径

	index file ...;


### 设置错误页面
指定错误页面

	error_page code ... [=[response]] uri

- code 要处理的 HTTP 错误代码
- response 可选项，将 code 指定的错误转化为新的错误代码 response
- uri 错误页面的路径或者网站地址

示例

	error_page 404 /404.html


### 基于 IP 配置 Nginx 访问权限
Nginx 支持两种途径的基本访问控制，一种是由 HTTP 标准模块的 `ngx_http_access-modele` 支持，通过 IP 来判断客户端是否拥有对 Nginx 的访问权限

allow 配置用于设置 Nginx 客户端 IP 访问

	allow address | CIDR | all;

- address 允许访问的客户端 IP，不支持同时设置多个
- CIDR 允许访问的客户端 CIDR 地址， 202.112.18.23/25，前 32 位 IP 地址，后面 ”/25“ 表示前 25 位是网络，其余代表主机部分
- all 代表允许所有客户端访问

deny 配置，顾名思义

	deny address | CIDR | all;

参数含义同上

Nginx 对于访问控制权限是顺序匹配，如果匹配成功就不会继续向下解析。

### 配置密码设置 Nginx 访问权限

Nginx 支持 HTTP Basic Authentication 协议的认证，该协议是一种 HTTP 性质的认证办法，需要用户名和密码，认证失败的客户端不拥有访问 Nginx 服务器的权限。

开启或者关闭

	auth_basic string | off;

- string 开启该认证功能，并验证配置时显示的提示信息
- off 关闭该功能

	auth_basic_user_file file;

其中 file 为密码文件的绝对路径

使用如下命令创建用户名密码到文件

	printf "yourusername:$(openssl passwd -apr1)" > /etc/nginx/passwords

记住替换 `yourusername` ，该命令会在 `/etc/nginx` 目录下创建 passwords 文件，该文件的格式为

	yourusername:passwordencrypt

也可以使用 `htpasswd` 命令来生成，绝大部分语言提供 `crypt()` 函数来对加密密码

	htpasswd -c -d /etc/nginx/passwords yourusername

然后添加如下配置

	server {
		# ...
		auth_basic "Protected";
		auth_basic_user_file passwords;
		# ...
	}

## 反向代理配置
简单配置

	server
	{
		listen          80;
		server_name     g.einverne.info;
		location / {
			proxy_pass          http://www.google.com/;  #反代的域名
			proxy_redirect      off;
			proxy_set_header    X-Real-IP       $remote_addr;
			proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
		}
	}



## reference

- Nginx 高性能 Web 服务器详解
