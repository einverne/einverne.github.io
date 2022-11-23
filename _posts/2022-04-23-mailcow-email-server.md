---
layout: post
title: "使用 Mailcow 自建邮件服务器"
aliases:
- "使用 Mailcow 自建邮件服务器"
tagline: ""
description: ""
category: 学习笔记
tags: [ mailcow, mail, email, email-server, linux, docker, smtp, spf,  ]
last_updated: 2022-04-28 10:08:20
create_time: 2022-04-28 10:07:20
---

[Mailcow](https://mailcow.email/) 是一个可以使用 Docker 容器化部署的邮件服务器。

GitHub： <https://github.com/mailcow/mailcow-dockerized>

## Mailcow 的优点
Mailcow 相较于 Mailu 整体比较完整，功能相对比较丰富。

- 支持二步验证，甚至支持 macOS 指纹验证
- Webmail 使用 SOGo
- 支持给每个域名增加管理员
- 有良好的日志查看系统
- Sync job 功能可以快速、简单地迁移到另外的提供商
- Web 界面上可以下载 profile，快速在 macOS 和 iOS 中配置使用

## 缺点

- 内存占用比较大，只是部署了 Mailcow 就占去了 3G 内存，如果禁用 Solr 和 ClamAV 可以节省内存，日常占用在 1G~2G，但就丧失了搜索和病毒扫描
- 用的组件比较多，整体使用体验比 Mailu 慢

## 安装
Mailcow 整体的搭建过程比较简单，如果之前搭建过 Mailu，实际上，参考官网的教程，并没有太多需要再强调的，甚至如果在同一台机器上，从 Mailu 上迁移过来，只需要修改 [[DKIM]] 记录即可。

提前的 DNS 设置可以参考[官网](https://mailcow.github.io/mailcow-dockerized-docs/prerequisite/prerequisite-dns/)。主要需要配置一些 A 记录，CNAME，[[DKIM]]， [[SPF]]，[[DMARC]] 等等。

配置 DNS

```
# Name              Type       Value
mail                IN A       1.2.3.4
autodiscover        IN CNAME   mail.example.org. (your ${MAILCOW_HOSTNAME})
autoconfig          IN CNAME   mail.example.org. (your ${MAILCOW_HOSTNAME})
@                   IN MX 10   mail.example.org. (your ${MAILCOW_HOSTNAME})
```

### SPF

```
# Name              Type       Value
@                   IN TXT     v=spf1 mx a -all
```

安装：

    git clone https://github.com/mailcow/mailcow-dockerized
    cd mailcow-dockerized

然后执行：

    ./generate_config.sh

交互命令中输入自己的 `MAILCOW_HOSTNAME`，比如 `mail.example.com`。

然后启动：

    docker-compose pull
    docker-compose up -d

然后使用配置好的域名 `mail.example.com` 登录，用户名 `admin` 密码 `moohoo`。

### 配置 SSL
编辑 `mailcow.conf` 然后配置 `HTTP_BIND=`

编辑 `data/conf/nginx/redirect.conf`:

```
server {
  root /web;
  listen 80 default_server;
  listen [::]:80 default_server;
  include /etc/nginx/conf.d/server_name.active;
  if ( $request_uri ~* "%0A|%0D" ) { return 403; }
  location ^~ /.well-known/acme-challenge/ {
    allow all;
    default_type "text/plain";
  }
  location / {
    return 301 https://$host$uri$is_args$args;
  }
}
```

重启：

    docker-compose up -d
    docker-compose restart nginx-mailcow

## 使用

进入后台之后，在 Configuration->Domains -> 添加域名。

添加域名之后需要修改域名的对应 DNS 记录。在界面会有显示。

添加完域名之后可以点击页面中的 Mailboxes 来添加域名邮箱来收发邮件。

Mailcow 使用 [[SOGo]] 作为默认的 Webmail 客户端。

## 客户端设置

几个常用的端口：

| Service | Encryption | Port |
| ------- | ---------- | ---- |
| IMAP    | STARTTLS   | 143  |
| IMAPS   | SSL        | 993  |
| POP3    | STARTTLS   | 110  |
| POP3S   | SSL        | 995  |
| SMTP    | STARTTLS   | 587  |
| SMTPS   | SSL        | 465  |



### 手工配置



## reference

- <https://mailcow.github.io/mailcow-dockerized-docs/manual-guides/u_e-80_to_443/>
- <https://low.bi/p/r7VbxEKo3zA>
- <https://blog.ginshio.org/2020/mail_server/>
