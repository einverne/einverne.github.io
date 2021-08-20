---
layout: post
title: "Nginx 配置详解"
aliases: "Nginx 配置详解"
tagline: ""
description: ""
category: 学习笔记
tags: [nginx, web, server, linux, proxy, web-server, apache,]
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

### 配置用户和用户组
配置 Nginx 运行的用户和用户组：

	user user [group];

- user, 可运行 Nginx 服务器的用户
- group, 指定可运行用户组

希望所有用户都可以启动 Nginx 进程，一种是直接注释该配置，或者

	user nobody nobody;

Nginx 配置文件中，每一条配置都必须以分号结束。

### 配置 worker process 数

worker process 是 Nginx 并发关键所在，设置的是 Nginx 的进程数，理论上 worker process 值越大，可支持并发数也越多，但实际也受到软件，操作系统，硬件（CPU 和磁盘）等资源的制约。建议设置为 CPU 核心数。

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
    include server/*

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

## 一个具体的例子

```
######Nginx配置文件nginx.conf中文详解#####

#定义Nginx运行的用户和用户组
user www www;

#nginx进程数，建议设置为等于CPU总核心数。
worker_processes 8;

#全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
error_log /usr/local/nginx/logs/error.log info;

#进程pid文件
pid /usr/local/nginx/logs/nginx.pid;

#指定进程可以打开的最大描述符：数目
#工作模式与连接数上限
#这个指令是指当一个nginx进程打开的最多文件描述符数目，理论值应该是最多打开文件数（ulimit -n）与nginx进程数相除，但是nginx分配请求并不是那么均匀，所以最好与ulimit -n 的值保持一致。
#现在在linux 2.6内核下开启文件打开数为65535，worker_rlimit_nofile就相应应该填写65535。
#这是因为nginx调度时分配请求到进程并不是那么的均衡，所以假如填写10240，总并发量达到3-4万时就有进程可能超过10240了，这时会返回502错误。
worker_rlimit_nofile 65535;

events
{
    #参考事件模型，use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll模型
    #是Linux 2.6以上版本内核中的高性能网络I/O模型，linux建议epoll，如果跑在FreeBSD上面，就用kqueue模型。
    #补充说明：
    #与apache相类，nginx针对不同的操作系统，有不同的事件模型
    #A）标准事件模型
    #Select、poll属于标准事件模型，如果当前系统不存在更有效的方法，nginx会选择select或poll
    #B）高效事件模型
    #Kqueue：使用于FreeBSD 4.1+, OpenBSD 2.9+, NetBSD 2.0 和 MacOS X.使用双处理器的MacOS X系统使用kqueue可能会造成内核崩溃。
    #Epoll：使用于Linux内核2.6版本及以后的系统。
    #/dev/poll：使用于Solaris 7 11/99+，HP/UX 11.22+ (eventport)，IRIX 6.5.15+ 和 Tru64 UNIX 5.1A+。
    #Eventport：使用于Solaris 10。 为了防止出现内核崩溃的问题， 有必要安装安全补丁。
    use epoll;

    #单个进程最大连接数（最大连接数=连接数*进程数）
    #根据硬件调整，和前面工作进程配合起来用，尽量大，但是别把cpu跑到100%就行。每个进程允许的最多连接数，理论上每台nginx服务器的最大连接数为。
    worker_connections 65535;

    #keepalive超时时间。
    keepalive_timeout 60;

    #客户端请求头部的缓冲区大小。这个可以根据你的系统分页大小来设置，一般一个请求头的大小不会超过1k，不过由于一般系统分页都要大于1k，所以这里设置为分页大小。
    #分页大小可以用命令getconf PAGESIZE 取得。
    #[root@web001 ~]# getconf PAGESIZE
    #4096
    #但也有client_header_buffer_size超过4k的情况，但是client_header_buffer_size该值必须设置为“系统分页大小”的整倍数。
    client_header_buffer_size 4k;

    #这个将为打开文件指定缓存，默认是没有启用的，max指定缓存数量，建议和打开文件数一致，inactive是指经过多长时间文件没被请求后删除缓存。
    open_file_cache max=65535 inactive=60s;

    #这个是指多长时间检查一次缓存的有效信息。
    #语法:open_file_cache_valid time 默认值:open_file_cache_valid 60 使用字段:http, server, location 这个指令指定了何时需要检查open_file_cache中缓存项目的有效信息.
    open_file_cache_valid 80s;

    #open_file_cache指令中的inactive参数时间内文件的最少使用次数，如果超过这个数字，文件描述符一直是在缓存中打开的，如上例，如果有一个文件在inactive时间内一次没被使用，它将被移除。
    #语法:open_file_cache_min_uses number 默认值:open_file_cache_min_uses 1 使用字段:http, server, location  这个指令指定了在open_file_cache指令无效的参数中一定的时间范围内可以使用的最小文件数,如果使用更大的值,文件描述符在cache中总是打开状态.
    open_file_cache_min_uses 1;

    #语法:open_file_cache_errors on | off 默认值:open_file_cache_errors off 使用字段:http, server, location 这个指令指定是否在搜索一个文件时记录cache错误.
    open_file_cache_errors on;
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http
{
    #文件扩展名与文件类型映射表
    include mime.types;

    #默认文件类型
    default_type application/octet-stream;

    #默认编码
    #charset utf-8;

    #服务器名字的hash表大小
    #保存服务器名字的hash表是由指令server_names_hash_max_size 和server_names_hash_bucket_size所控制的。参数hash bucket size总是等于hash表的大小，并且是一路处理器缓存大小的倍数。在减少了在内存中的存取次数后，使在处理器中加速查找hash表键值成为可能。如果hash bucket size等于一路处理器缓存的大小，那么在查找键的时候，最坏的情况下在内存中查找的次数为2。第一次是确定存储单元的地址，第二次是在存储单元中查找键 值。因此，如果Nginx给出需要增大hash max size 或 hash bucket size的提示，那么首要的是增大前一个参数的大小.
    server_names_hash_bucket_size 128;

    #客户端请求头部的缓冲区大小。这个可以根据你的系统分页大小来设置，一般一个请求的头部大小不会超过1k，不过由于一般系统分页都要大于1k，所以这里设置为分页大小。分页大小可以用命令getconf PAGESIZE取得。
    client_header_buffer_size 32k;

    #客户请求头缓冲大小。nginx默认会用client_header_buffer_size这个buffer来读取header值，如果header过大，它会使用large_client_header_buffers来读取。
    large_client_header_buffers 4 64k;

    #设定通过nginx上传文件的大小
    client_max_body_size 8m;

    #开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
    #sendfile指令指定 nginx 是否调用sendfile 函数（zero copy 方式）来输出文件，对于普通应用，必须设为on。如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络IO处理速度，降低系统uptime。
    sendfile on;

    #开启目录列表访问，合适下载服务器，默认关闭。
    autoindex on;

    #此选项允许或禁止使用socke的TCP_CORK的选项，此选项仅在使用sendfile的时候使用
    tcp_nopush on;

    tcp_nodelay on;

    #长连接超时时间，单位是秒
    keepalive_timeout 120;

    #FastCGI相关参数是为了改善网站的性能：减少资源占用，提高访问速度。下面参数看字面意思都能理解。
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;

    #gzip模块设置
    gzip on; #开启gzip压缩输出
    gzip_min_length 1k;    #最小压缩文件大小
    gzip_buffers 4 16k;    #压缩缓冲区
    gzip_http_version 1.0;    #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_comp_level 2;    #压缩等级
    gzip_types text/plain application/x-javascript text/css application/xml;    #压缩类型，默认就已经包含textml，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
    gzip_vary on;

    #开启限制IP连接数的时候需要使用
    #limit_zone crawler $binary_remote_addr 10m;

    #负载均衡配置
    upstream jh.w3cschool.cn {

        #upstream的负载均衡，weight是权重，可以根据机器配置定义权重。weigth参数表示权值，权值越高被分配到的几率越大。
        server 192.168.80.121:80 weight=3;
        server 192.168.80.122:80 weight=2;
        server 192.168.80.123:80 weight=3;

        #nginx的upstream目前支持4种方式的分配
        #1、轮询（默认）
        #每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。
        #2、weight
        #指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。
        #例如：
        #upstream bakend {
        #    server 192.168.0.14 weight=10;
        #    server 192.168.0.15 weight=10;
        #}
        #2、ip_hash
        #每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。
        #例如：
        #upstream bakend {
        #    ip_hash;
        #    server 192.168.0.14:88;
        #    server 192.168.0.15:80;
        #}
        #3、fair（第三方）
        #按后端服务器的响应时间来分配请求，响应时间短的优先分配。
        #upstream backend {
        #    server server1;
        #    server server2;
        #    fair;
        #}
        #4、url_hash（第三方）
        #按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。
        #例：在upstream中加入hash语句，server语句中不能写入weight等其他的参数，hash_method是使用的hash算法
        #upstream backend {
        #    server squid1:3128;
        #    server squid2:3128;
        #    hash $request_uri;
        #    hash_method crc32;
        #}

        #tips:
        #upstream bakend{#定义负载均衡设备的Ip及设备状态}{
        #    ip_hash;
        #    server 127.0.0.1:9090 down;
        #    server 127.0.0.1:8080 weight=2;
        #    server 127.0.0.1:6060;
        #    server 127.0.0.1:7070 backup;
        #}
        #在需要使用负载均衡的server中增加 proxy_pass http://bakend/;

        #每个设备的状态设置为:
        #1.down表示单前的server暂时不参与负载
        #2.weight为weight越大，负载的权重就越大。
        #3.max_fails：允许请求失败的次数默认为1.当超过最大次数时，返回proxy_next_upstream模块定义的错误
        #4.fail_timeout:max_fails次失败后，暂停的时间。
        #5.backup： 其它所有的非backup机器down或者忙的时候，请求backup机器。所以这台机器压力会最轻。

        #nginx支持同时设置多组的负载均衡，用来给不用的server来使用。
        #client_body_in_file_only设置为On 可以讲client post过来的数据记录到文件中用来做debug
        #client_body_temp_path设置记录文件的目录 可以设置最多3层目录
        #location对URL进行匹配.可以进行重定向或者进行新的代理 负载均衡
    }

    #虚拟主机的配置
    server
    {
        #监听端口
        listen 80;

        #域名可以有多个，用空格隔开
        server_name www.w3cschool.cn w3cschool.cn;
        index index.html index.htm index.php;
        root /data/www/w3cschool;

        #对******进行负载均衡
        location ~ .*.(php|php5)?$
        {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            include fastcgi.conf;
        }

        #图片缓存时间设置
        location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires 10d;
        }

        #JS和CSS缓存时间设置
        location ~ .*.(js|css)?$
        {
            expires 1h;
        }

        #日志格式设定
        #$remote_addr与$http_x_forwarded_for用以记录客户端的ip地址；
        #$remote_user：用来记录客户端用户名称；
        #$time_local： 用来记录访问时间与时区；
        #$request： 用来记录请求的url与http协议；
        #$status： 用来记录请求状态；成功是200，
        #$body_bytes_sent ：记录发送给客户端文件主体内容大小；
        #$http_referer：用来记录从那个页面链接访问过来的；
        #$http_user_agent：记录客户浏览器的相关信息；
        #通常web服务器放在反向代理的后面，这样就不能获取到客户的IP地址了，通过$remote_add拿到的IP地址是反向代理服务器的iP地址。反向代理服务器在转发请求的http头信息中，可以增加x_forwarded_for信息，用以记录原有客户端的IP地址和原来客户端的请求的服务器地址。
        log_format access '$remote_addr - $remote_user [$time_local] "$request" '
        '$status $body_bytes_sent "$http_referer" '
        '"$http_user_agent" $http_x_forwarded_for';

        #定义本虚拟主机的访问日志
        access_log  /usr/local/nginx/logs/host.access.log  main;
        access_log  /usr/local/nginx/logs/host.access.404.log  log404;

        #对 "/" 启用反向代理
        location / {
            proxy_pass http://127.0.0.1:88;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;

            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            #以下是一些反向代理的配置，可选。
            proxy_set_header Host $host;

            #允许客户端请求的最大单文件字节数
            client_max_body_size 10m;

            #缓冲区代理缓冲用户端请求的最大字节数，
            #如果把它设置为比较大的数值，例如256k，那么，无论使用firefox还是IE浏览器，来提交任意小于256k的图片，都很正常。如果注释该指令，使用默认的client_body_buffer_size设置，也就是操作系统页面大小的两倍，8k或者16k，问题就出现了。
            #无论使用firefox4.0还是IE8.0，提交一个比较大，200k左右的图片，都返回500 Internal Server Error错误
            client_body_buffer_size 128k;

            #表示使nginx阻止HTTP应答代码为400或者更高的应答。
            proxy_intercept_errors on;

            #后端服务器连接的超时时间_发起握手等候响应超时时间
            #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_connect_timeout 90;

            #后端服务器数据回传时间(代理发送超时)
            #后端服务器数据回传时间_就是在规定时间之内后端服务器必须传完所有的数据
            proxy_send_timeout 90;

            #连接成功后，后端服务器响应时间(代理接收超时)
            #连接成功后_等候后端服务器响应时间_其实已经进入后端的排队之中等候处理（也可以说是后端服务器处理请求的时间）
            proxy_read_timeout 90;

            #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            #设置从被代理服务器读取的第一部分应答的缓冲区大小，通常情况下这部分应答中包含一个小的应答头，默认情况下这个值的大小为指令proxy_buffers中指定的一个缓冲区的大小，不过可以将其设置为更小
            proxy_buffer_size 4k;

            #proxy_buffers缓冲区，网页平均在32k以下的设置
            #设置用于读取应答（来自被代理服务器）的缓冲区数目和大小，默认情况也为分页大小，根据操作系统的不同可能是4k或者8k
            proxy_buffers 4 32k;

            #高负荷下缓冲大小（proxy_buffers*2）
            proxy_busy_buffers_size 64k;

            #设置在写入proxy_temp_path时数据的大小，预防一个工作进程在传递文件时阻塞太长
            #设定缓存文件夹大小，大于这个值，将从upstream服务器传
            proxy_temp_file_write_size 64k;
        }

        #设定查看Nginx状态的地址
        location /NginxStatus {
            stub_status on;
            access_log on;
            auth_basic "NginxStatus";
            auth_basic_user_file confpasswd;
            #htpasswd文件的内容可以用apache提供的htpasswd工具来产生。
        }

        #本地动静分离反向代理配置
        #所有jsp的页面均交由tomcat或resin处理
        location ~ .(jsp|jspx|do)?$ {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:8080;
        }

        #所有静态文件由nginx直接读取不经过tomcat或resin
        location ~ .*.(htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|
        pdf|xls|mp3|wma)$
        {
            expires 15d; 
        }

        location ~ .*.(js|css)?$
        {
            expires 1h;
        }
    }
}
```


## reference

- Nginx 高性能 Web 服务器详解
