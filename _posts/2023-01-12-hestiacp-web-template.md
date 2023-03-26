---
layout: post
title: "HestiaCP 面板中的模板文件"
aliases:
- "HestiaCP 面板中的模板文件"
tagline: ""
description: ""
category: 学习笔记
tags: [ hestiacp, control-panel, linux, nginx,  ]
create_time: 2023-01-27 04:57:42
last_updated: 2023-01-27 04:58:19
---

之前的一篇文章介绍过 [HestiaCP](/post/2022/07/web-server-control-panel-hestia-usage.html) 的简单使用，在 HestiaCP 中是通过模板配置文件来配置网站。修改网站的模板可能会造成服务器错误，修改之前请小心。

HestiaCP 的模板文件存放在 `/data/templates/` 目录中，对于 Web 服务器，包括了一个初始化脚本 `.sh` 文件，一个默认的模板 `.tpl` 和一个 ssl 模板 `.stpl`。

模板的位置：

| Service                     | Location                                                |
| --------------------------- | ------------------------------------------------------- |
| Nginx(Proxy)                | `/usr/local/hestia/data/templates/web/nginx/`           |
| Nginx - PHP FPM             | `/usr/local/hestia/data/templates/web/nginx/php-fpm/`   |
| Apache2 (Legacy / mod-php ) | `/usr/local/hestia/data/templates/web/apache2/`         |
| Apache2 - PHP FPM           | `/usr/local/hestia/data/templates/web/apache2/php-fpm/` |
| PHP-FPM                     | `/usr/local/hestia/data/templates/web/php-fpm/`         |

创建新模板的方法最好是从原来的模板中复制。

```
cp original.tpl new.tpl
cp original.stpl new.stpl
cp original.sh new.sh
```

当完成模板编辑之后，需要在界面中启用。

在修改现成的模板之后，需要重新构建用户配置，可以通过 `v-rebuild-user` 命令或者在网页管理端操作。

## 模板中可用的变量

| Name               | Example                                  | Description                                           |
| ------------------ | ---------------------------------------- | ----------------------------------------------------- |
| %ip%               | 123.123.123.123                          | IP Address of Server                                  |
| %proxy_port%       | 80                                       | Port of Proxy                                         |
| %proxy_port_ssl%   | 443                                      | Port of Proxy (SSL)                                   |
| %web_port%         | 80 or 8080                               | Port of Webserver                                     |
| %web_ssl_port%     | 443 or 8443                              | Port of Webserver (SSL)                               |
| %domain%           | domain.tld                               | Domain                                                |
| %domain_idn%       | domain.tld                               | Domain (Internationalised)                            |
| %alias_idn%        | alias.domain.tld                         | Alias Domain (Internationalised)                      |
| %docroot%          | /home/username/web/public_html/          | Document root of domain                               |
| %sdocroot%         | /home/username/web/public_shtml/         | Private root of domain                                |
| %ssl_pem%          | /usr/local/hestia/data/user/username/ssl | Location of SSL Certificate                           |
| %ssl_key%          | /usr/local/hestia/data/user/username/ssl | Location of SSL Key                                   |
| %web_system%       | Nginx / Apache                           | Software used as Webserver                            |
| %home%             | /home                                    | Default home directory                                |
| %user%             | username                                 | Username of user                                      |
| %backend_lsnr%     | proxy:fcgi://127.0.0.1:9000              | Your default FPM Server                               |
| %proxy_extentions% | List of extensions                       | Extensions that should be handled by the proxy server |
