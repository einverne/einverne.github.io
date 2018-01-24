---
layout: post
title: "Nginx 反向代理 Google 配置"
tagline: ""
description: ""
category: 学习笔记
tags: [Linux, Nginx, Web, Proxy, Google]
last_updated: 
---

使用[编译安装](/post/2017/06/ubuntu-debian-install-nginx.html) Nginx，将 `ngx_http_substitutions_filter_module` 和 `ngx_http_google_filter_module` 两个模块编译进 Nginx。具体内容可以参考安装篇。

对于 Nginx 基本设置可以参考 [配置篇](/post/2017/10/nginx-conf.html) .

这篇主要演示 Nginx 作为一个反向代理服务器的基本设置。

Nginx 反向代理最重要的一个配置就是 `proxy_pass` ，该配置接受一个参数， URL ，也就是 Nginx 转发的目的地。Nginx 会自动将请求的 URI 替换为 `proxy_pass` 配置的 URI。

	location /uri {
        proxy_pass http://localhost:8083/newUri;
	}

## 常用配置

### 反代相关配置

反向代理的常用配置选项

Directive                       | Explanation
--------------------------------|----------------------------------
`proxy_connect_timeout` 		| 向上游服务器请求超时时间
`proxy_cookie_domain`    		| 将请求头中 `Set-Cookie` 头内容替换成新域名
`proxy_cookie_path` 	        | 替换 `Set-Cookie` 中路径
`proxy_headers_hash_bucket_size` | 请求头名最大size
`proxy_headers_hash_max_size`   | 从上游服务器接收到的所有 headers 总量
`proxy_hide_header`             | 一组不会被传给 client 的 headers
`proxy_http_version`            | 和上游服务器通信使用的 HTTP 协议版本
`proxy_ignore_client_abort`     | 如果设置为 on， Nginx 在client 停止请求时不会停止向上游服务器请求
`proxy_ignore_headers`          | 处理上游服务器返回时设置一组不处理 headers
`proxy_intercept_errors`        | 设置开启， Nginx 将显示 `error_page` 配置的错误而不会向上游服务器请求
`proxy_max_temp_file_size`      | The maximum size of the overflow file, written when the response doesn't fit into memory buffers.
`proxy_pass`                    | 上游服务器 URL
`proxy_pass_header`             | 覆盖被 `proxy_hide_header` 配置禁用的 headers，允许他们发送给客户端
`proxy_pass_request_body`       | off 时阻止向上游服务器发送请求body
`proxy_pass_request_headers`    | off 时阻止向上游服务器发送 headers
`proxy_read_timeout`            | 连接关闭前，向上游服务器两次读成功耗时
`proxy_redirect`                | Rewrites the Location and Refresh headers received from the upstream servers; useful for working around assumptions made by an application framework.
`proxy_send_timeout`            | 连接关闭前，向上游服务器两次写成功耗时
`proxy_set_body`                | 修改请求body
`proxy_set_header`              | 修改请求 headers
`proxy_temp_file_write_size`    | 限制单个请求的临时文件大小， Nginx 不会在一个请求上被 block
`proxy_temp_path`               | 临时文件地址

### upstream 选项中的配置

Directive                       | Explanation
--------------------------------|--------------------------------
`ip_hash`     | 使得客户端的请求能够均匀的分布
`keepalive`   | 每一个 worker process 向上游服务器请求缓存的连接数，`proxy_http_version` 需要设置为 `1.1` 并且 `proxy_set_header` 设置为空
`least_conn`  | 负载均衡算法，根据 active 连接数来选择下一个连接
`server`      | 设置地址，域名或者 IP，或者 Unix-domain socket  一些选项 weight: 设置 server 的权重，`max_fails`: 重试最大次数，`fail_timeout`: 服务器超过该时间会被标记为 Down ，`backup`: 只有其他机器都 Down 情况下才会使用该服务器，`down`: 标记为 down 不会处理请求

## 示例

### keep alive 
以如下配置示例

	upstream apache {
		server 127.0.0.1:8080;
		keepalive 32;
	}
	location / {
		proxy_http_version 1.1;
		proxy_set_header Connection "";
		proxy_pass http://apache;
	}

假设定义了 apache upstream ，使用 Nginx 转发到本地 8080 端口， 设置了 keepalive 为 32。每一个 Nginx worker 只会在最初始化时TCP握手建立32个连接，Nginx 会保存连接，不会发送 `close` 。

如果需要超过 32 个连接， Nginx 会再新建连接满足需求，如果需求降低， Nginx 会自动将超过 32 个连接的请求，按照最近使用的连接关闭，直到将连接数降到 32 。

### 负载均衡算法
upstream 模块会使用三种算法来选择向哪一台上游服务器建立连接---- round-robin, IP hash, 或者是 least connections.

**round-robin** 算法是默认值，算法根据上一次选择的服务器决定下一次选择哪一条连接，算法公平的根据 turn by turn 的方式来保持平衡。

**IP hash** 算法，需要通过 `ip_hash` 指令开启
Nginx 使用 IPv4 地址的前三个字节或者是整个 IPv6 地址作为 hashing key 。因此一组IP地址永远被map到特定的上游服务器。因此这个机制不是设计为均匀分发请求，而是被设计成将客户端和上游服务器映射到一起。

第三种负载均衡算法叫做 **least connections** ， 通过 `least_conn` 开启。该算法设计成将负载均匀的打到上游服务器中，通过选择活跃连接数最小的服务器。如果上游服务器不是具有相同的处理能力，可以通过指定 `weight` 来人为处理。算法会将不同 weight 的服务器纳入计算活跃连接数的考虑范畴。

### 创建 Google 的反向代理
创建一个 Ngixn 虚拟主机，我使用 `https://g.einverne.info` 来演示：

    # 配置 google ip 地址，使用 nslookup google.com 来获取 Google 服务器地址，避免 Google 机器人检测
    upstream www.google.com {
        server XXX.XXX.XXX.XXX:443 weight=1; #把XXX替换成可用 IP
        server XXX.XXX.XXX.XXX:443 weight=1;
        server XXX.XXX.XXX.XXX:443 weight=1;
        server XXX.XXX.XXX.XXX:443 weight=1;
        server XXX.XXX.XXX.XXX:443 weight=1;
        server XXX.XXX.XXX.XXX:443 weight=1;
        server 216.58.216.163:443 weight=1; #hk
    }

    server {
        listen 80;
        listen [::]:80;
        server_name g.einverne.info;

        listen 443 ssl;
		ssl_certificate path_to_ssl_crt; # 证书
		ssl_certificate_key path_key; # key

		# 自动 http 转 https
        if ($scheme != "https") {
            return 301 https://$host$request_uri;
        }

        if ($http_user_agent ~* (baiduspider|360spider|haosouspider|googlebot|soso|bing|sogou|yahoo|sohu-search|yodao|YoudaoBot|robozilla|msnbot|MJ12bot|NHN|Twiceler)) {
            return  403;
        }

		# 编译时加入 ngx_http_google_filter_module 模块，location 如下设置
        location / {
            google on;
        }

        access_log /var/log/nginx/g.einverne.info.access.log;
		error_log /var/log/nginx/g.einverne.info.error.log;
    }

如果编译时没有加入 `ngx_http_google_filter_module` 模块，则需要设置 location

	location / {
		proxy_redirect off;
		proxy_cookie_domain google.com <domain.name>; 
		proxy_pass https://www.google.com;
		proxy_connect_timeout 60s;
		proxy_read_timeout 5400s;
		proxy_send_timeout 5400s;

		proxy_set_header Host "www.google.com";
		proxy_set_header User-Agent $http_user_agent;
		proxy_set_header Referer https://www.google.com;
		proxy_set_header Accept-Encoding "";
		proxy_set_header X-Real-IP $remote_addr; 
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
		proxy_set_header X-Forwarded-Proto https;
		proxy_set_header Accept-Language "zh-CN";
		proxy_set_header Cookie "PREF=ID=047808f19f6de346:U=0f62f33dd8549d11:FF=2:LD=en-US:NW=1:TM=1325338577:LM=1332142444:GM=1:SG=2:S=rE0SyJh2W1IQ-Maw";

		subs_filter https://www.google.com.hk <domain.name>;
		subs_filter https://www.google.com <domain.name>;
		#subs_filter_types text/css text/xml text/javascript;

		sub_filter_once off; 
	}

- `proxy_redirect` 设置为 off ，不需要重写 Location 的 header
- `proxy-cookie-domain google <domain.name>;` 将cookie作用域替换成自己的域名
- `proxy_pass https://www.google.com;` 反向代理到 upstream www.google.com
- `proxy_set_header Accept-Encoding "";` 防止谷歌返回压缩的内容，否则内容无法替换
- `proxy_set_header Cookie` 这一行 禁止即时搜索，设置为新窗口打开网站
- `subs_filter https://www.google.com <domain.name>;` 把Google域名替换，需要编译时加上 `--with-http_sub_module` 参数

## reference 

- <https://zhgcao.github.io/2016/06/09/nginx-reverse-proxy-google/>
