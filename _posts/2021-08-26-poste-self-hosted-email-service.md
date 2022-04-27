---
layout: post
title: "使用 Poste 自行搭建邮件服务器"
aliases:
- 使用 Poste 自行搭建邮件服务器
tagline: ""
description: ""
category: 经验总结
tags: [ poste, linux, email, smtp, pop, email-host, email-server, mail-server ]
last_updated: 2022-04-24 02:54:00
create_time: 2021-09-27 06:58:28
---

自建邮件服务器一直是我想做的事情，之前因为写了一个发送电子书到 Kindle 的 [kindlepush bot](/post/2017/09/telegram-bot.html) ，要用到邮件服务器，当时为了不折腾，调研了 [一番](/post/2017/07/email-services-collection.html) 就直接用了 [[Mailgun]]，每个月 10000 封的邮件也足够了，但是云服务提供商就是那样不好，说改就改，直接把免费的发送额度取消了，虽然到现在为止量不大的情况下还可以继续用，但一旦量超就会发不出去，所以早之前想要 [自己](/post/2018/09/mail-server.html) 通过 [[Postfix]] 和 [[Dovecot]] 来搭建一个[[邮件服务器]]，但后来发现安装和维护成本太高了，所以就搁置了，但一直都想尝试搭建一个自己的邮件服务器，一来可以通过自己的域名邮箱发送邮件，而来也不会受到发送邮件数量的限制。一直在观察可用的可以 [自行搭建的邮件服务器](/post/2020/02/self-hosted-mail-server.html) ，发现了 [[Poste]]。

 [Poste](https://poste.io/) 是一个用 Go 语言实现的可以自行搭建的[[邮件服务器]]程序，提供了后台管理，可以实现邮件收发，容量控制，邮件过滤等等工具。还提供了统计分析，SSL，邮件转发，邮件别名，通过 ClamAV 支持邮件病毒扫描等等功能。

Poste 使用 [[Haraka]] + [[Dovecot]] + [[SQLite]] 的组合实现。Haraka 是一个高性能的 [[SMTP]] 服务器，Dovecot 是一个开源的 IMAP 和 POP3 服务器，SQLite 是一个单文件的高性能关系型数据库。

Poste 运行大概需要 800MB 左右空间，只支持 64 位操作系统。 Poste 可以支持 Docker 安装，但是提供了 Free、Pro 和 Pro+ 版本，都需要按年订阅。

Poste 支持以下特性。

- SPF、DKIM、DMARC、SRS 的原生实现，带有简单的向导
- 用于检测木马、病毒、恶意软件的防病毒引擎 ( ClamAV )
- 内置垃圾邮件过滤器( RSPAMD )
- HTTPS 上的 Webmail 客户端（Roundcube）
- 通过 Sieve 脚本进行电子邮件重定向、自动回复和其他过滤（电子邮件所有者管理，每个操作都可以编写脚本）
- 用于限制邮箱空间或电子邮件数量的配额
- 系统管理员、域管理员、电子邮件所有者具有不同权限的 Web 管理。
- 内置 Microsoft 产品的自动发现功能，Thunderbird...
- 帮助正确设置域和邮件服务器的诊断
- SMTP - 端口 25、465 (TLS)、587
- POP3 - 端口 110、995 (TLS)
- IMAP - 端口 143、993 (TLS)
- SSL TLS 无处不在,没有个人数据、电子邮件、登录信息通过互联网未加密。
- 默认情况下，所有密码都存储为加盐 SHA512 哈希（5000 轮）。攻击者将很难破解您的密码。
- 整个邮件服务器容器由 Docker 与其他应用程序隔离。

## Prerequisite
准备工作：

- 一台拥有独立 IP 的 VPS，IP 地址最好能够通过 [Poste 提供的黑名单检测](https://poste.io/dnsbl)
    - 内存建议在 2G 以上
    - IP 没有被拉入黑名单，可以通过 [链接1](https://multirbl.valli.org/)， [链接2](http://mailspike.org/iplookup.html) 来查看
    - 25 端口开放，可以通过 `telnet smtp.aol.com 25` 命令来查看，如果能连接上并返回一些值表示 25 端口是可用的
- VPS 服务提供商需要支持添加 rDNS，需要通过 IP 解析到邮件域名
- 一个可以管理 DNS 的域名
- Docker

### DNS 解析配置
检查所有 [Poste](https://poste.io/doc/configuring-dns) 需要的 DNS 配置。

以域名 `domain.com` 和 IP `1.1.1.1` 为例，修改 domain.com 的 DNS 记录

| 类型  | 名称                      | 内容                                                                                  | TTL       |
| ----- | ------------------------- | ------------------------------------------------------------------------------------- | --------- |
| A     | mx                        | 1.1.1.1                                                                               | Auto      |
| CNAME | mail                      | mx.domain.com                                                                         | Auto      |
| CNAME | smtp                      | mx.domain.com                                                                         | Auto      |
| CNAME | pop                       | mx.domain.com                                                                         | Auto      |
| CNAME | imap                      | mx.domain.com                                                                         | Auto      |
| MX    | @                         | mx.domain.com                                                                         | 优先级 10 |
| TXT   | @                         | `v=spf1 mx ~all`                                                                        | Auto      |
| TXT   | `_dmarc.domain.com`      | `v=DMARC1; p=none; pct=100; rua=mailto: admin@DOMAIN.com; ruf=mailto: admin@DOMAIN.com` | Auto      |
| TXT   | `s20220321670._domainkey` | 安装完成后设置                                                                        | AUTO          |

完成上面的配置之后可以通过 Poste 提供的检测服务检测：

- [SFP-Tester](https://poste.io/spf)
- [DMARC-Tester](https://poste.io/dmarc)

其中涉及的知识可以通过维基百科搜寻 [[SPF]]、[[DMARC]]、[[DKIM]]，或者参考这篇[电子邮件是如何工作的](/post/2022/03/how-email-send-and-receive.html)。

添加 SPF/DKIM/PTR 解析，可提高邮件可信度，从而降低邮件进入垃圾箱的几率。

DMARC 记录不是必须的，但是配置上会对于邮件送达有帮助。

### 设置 PTR 反向解析
PTR 全称 Pointer Record，是电子邮件系统中的一种数据类型，RFC 1035 定义。A 记录解析域名到 IP 地址，PTR 记录解析 IP 地址到域名。PTR 在 VPS 后台通常被称为 [[reverse DNS]]，反向域名解析。

> PTR 记录，是电子邮件系统中的邮件交换记录的一种；另一种邮件交换记录是 A 记录（在 IPv4 协议中）或 AAAA 记录（在 IPv6 协议中）。PTR 记录常被用于反向地址解析。

域名解析到 IP 被称为正向解析，而 IP 指向到域名，则被称为反向解析，反向解析需要在主机服务商处进行操作，具体请咨询主机服务商。

一般的 VPS 都可以直接在后台面板添加 PTR 反向解析，如果遇到问题可以直接开 ticket 咨询，配置将 IP 指向到邮件服务器域名，如 `mail.your-domain.com`

## 安装

使用 docker 命令：

```
docker run -d \
    -p 880:80 -p 8443:443 -p 25:25 -p 110:110 -p 143:143 -p 465:465 -p 587:587 -p 993:993 -p 995:995 -p 4190:4190 \
    -e TZ=Asia/Shanghai \
    -v /data/mail-data:/data \
    --name "mailserver" \
    -h "mail.your-domain.com" \
    --restart=always \
    -t analogic/poste.io
```

或者使用 docker-compose:

```
version: '3'
services:
  poste:
    image: analogic/poste.io
    hostname: mail.domain.com
    container_name: poste
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - ./data:/data
      - ./nginx/log:/var/log/nginx/
    restart: always
    ports:
      - "25:25"
      - "80:80"
      - "110:110"
      - "143:143"
      - "443:443"
      - "465:465"
      - "587:587"
      - "993:993"
      - "995:995"
      - "4190:4190"
    environment:
      - DISABLE_CLAMAV=TRUE
      - HTTPS=OFF
```

官方文档在此： [https://poste.io/doc/getting-started](https://poste.io/doc/getting-started)

如果你使用 [[traefik]] 来做反向代理，可以使用[我的配置](https://github.com/einverne/dockerfile/tree/master/poste)。

端口解释：

- 25，SMTP server for incoming emails
- 110, POP3 server (STARTTLS required)
- 143, IMAP server (STARTTLS required)
- 443，Administration and webmail HTTPS server
- 587, Submission server(STARTTLS SMTP server for clients)
- 993, IMAP server(implicit TLS)
- 995, POP3 server(implicit TLS)
- 4190，Sieve server(optional)

设置 DNS 说明：

- 设置 A 记录，`mail.domain.com` 指向服务器 IP
- 设置 CNAME，将 `smtp.domain.com`, `pop.domain.com`,  `imap.domain.com` 指向 `mail.domain.com`
- 配置 MX 记录，指向 `mail.domain.com`
- 配置 TXT 记录，`v=spf1 mx ~all`

等待一会儿 Poste 启动之后 `docker-compose logs -f` 查看日志。然后访问域名 `mail.domain.com`，可以看到初始化配置：

- Mailserver hostname
- Administrator email
- Password

提交成功之后就可以进入 Poste 的管理后台。


### 设置 TLS SSL
在侧边栏 System settings 中可以申请 Let's Encrypt 证书。

假如您的邮件域名为 `mail.domain.com`，需要对这个域名申请 SSL 证书，在其它服务商申请 SSL 证书。

获得 SSL 证书后，打开 poste 后台 - System settings - TLS Certificate - 选择证书文件进行上传。

SSL 提供商会自动将中级证书合并到了证书文件（比如腾讯云），因此中级证书那个选项可以和证书一致，然后点保存，保存后需要重启容器生效：`docker restart mailserver`


### 配置 DKIM
在 Virtual Domains 中点击域名获取 DKIM Key。然后将值配置到 DNS 解析。

### 登录与管理

启用 SSL 后，可通过域名进行访问：`https://mail.domain.com/`，默认是登录 webmail，可以在 webmail 发信、收信等操作。

如果需要登录系统管理，可将地址修改为 `https://mail.your-domain.com/admin/login`

注意这里默认安装的时候已经可以直接访问 https，如果你使用 Nginx ，或 [[traefik]] 等等方向代理，需要自行配置证书。

## 客户端
配置邮件客户端访问。

SMTP  25,465,587  smtp.domain.com.com 
IMAP  993,143  imap.domain.com.com
POP  995,110  pop.domain.com.com

邮件客户端可以根据上面的配置添加账号。

### 邮件发送测试

- <https://www.mail-tester.com/> 利用这个工具发送一封邮件，可以自动检测是邮箱的 [[SPF]]， [[DKIM]] 等等配置，还会给出一定的优化建议
- <https://www.mailgenius.com/>
- <https://glockapps.com/inbox-email-tester/>

### 个人建议

在准备自建邮件服务之前，有一些注意事项需要知晓，以下是一些个人经验总结：

- 使用可信度、流行度较高的域名后缀，如 `.com`/`.net`/`.org`，尽量避免使用不常用的后缀
- 使用英文字母的域名，尽量避免使用纯数字域名
- 域名注册时间越长越好，最低注册时间建议大于 7 天
- 使用一个干净的 IP，可通过 [https://poste.io/dnsbl](https://poste.io/dnsbl) 查询
- 找一个支持配置 PTR（rDNS）的主机托管商，VPS 后台配置 PTR 反向解析

## 进阶
在 Poste.io 的基础上扩展了一些功能 `dirtsimple/poste.io`:

- <https://github.com/dirtsimple/poste.io>

## 相关自建方案

- [[Mailu]]