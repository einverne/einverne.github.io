---
layout: post
title: "ClientExec 安装及入门使用"
aliases:
- "ClientExec 安装及入门使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ clientexec, vps, shared-web-hosting ]
create_time: 2023-04-23 16:16:23
last_updated: 2023-04-23 16:16:23
---

**ClientExec** 是一套为主机商开发的客户管理 [[Web Hosting Billing]]，支持，财务系统。借助 ClientExec 主机服务器商可以快速开始自己的业务，在线售卖虚拟主机，共享主机，域名等等服务。

> ClientExec's online business administration software is an innovative solution for automating daily business administration tasks. This software provides solutions for the most common tasks of administration, and can be accessed online from any web browser.

- 开发语言：PHP
- 安装环境：PHP+MySQL
- 授权协议：商业授权，需付费使用，如果购买了 [[RackNerd]] 的 VPS，可以申请一个免费的授权。
- 官方网站：<http://www.clientexec.com/>

ClientExec 的特性：

- 支持主机控制面板
- cPanel/WHM
- License Defender
- 可以和 [[Plesk]] 等面板联动
- Teamspeak
- DirectAdmin
- ISPManager
- TCAdmin (beta)
- InterWorx-CP

## Preview

![clientexec](https://photo.einverne.info/images/2022/11/29/ZkhI.jpg)

## 安装 ClientExec

安装 Clientexec 之前首先查看[系统最低要求](https://www.clientexec.com/members/knowledge-base/getting-started~81/system-requirements~497)

- PHP 7.2.5~7.4.x, 8.1.x 注意因为 8.0 没有 ionCube 支持所以不行
- PHP Memory Limit 128M
- PHP Extensions 开启如下扩展
  - GD
  - cURL
  - Multibyte String
  - PDO
  - SOAP
  - MySQLi
  - imap
  - iconv
- ionCube Loader 12.0 及以上

安装 Nginx，PHP，MySQL 环境，可以使用 [[CloudPanel]], [[aapanel]]，HestiaCP 这样的界面，也可以使用 [[lnmp]] 这样没有 Web 界面的一键配置脚本。

因为我是使用 [LNMP](https://lnmp.org/) 一键脚本进行地安装，有两个 Addon 需要安装一下

```
./addons install ionCube
./addons install imap
```

然后创建 vhost

```
lnmp vhost add
```

根据自己的域名填写内容。

将要安装的内容拷贝到 `/home/wwwroot/domain/` 下，然后访问域名。

遇到如下问题，手工添加一下 crontab

```
FAILED - couldn't use the system's shell binary. Please continue with this installation and when you're done, please manually create the following crontab entry through your hosting control panel:

* * * * *  -q /home/wwwroot/xxx.einverne.info/cron.php
```

## 升级 Clientexec

点击页面下方的版本升级，自动升级，需要开启在 php.ini 中开启 `shell_exec`

我使用 LNMP，所以找到 `/usr/local/php/etc/php.ini`，然后找到 `shell_exec` 将其从禁用函数中移除。

```
/etc/init.d/php-fpm restart
```

## 使用

### add server 可以售卖服务器上的资源

[cPanel 初始化](https://www.clientexec.com/members/knowledge-base/getting-started~81/cpanel-initial-setup~351)

### package 套餐

创建售卖的套餐

- Basic
- Standard
- Pro
- Bronze
- Silver
- Gold

## 最后

最后的最后，欢迎访问 [EV Hosting](https://client.einverne.info) 订购使用。

## related

- [[WHMCS]]
- [[Web Hosting Billing]]

## reference

- [[如何创建 ClientExec 售卖的套餐]]
- [[2023-04-01-clientexec-language-chinese|Clientexec 汉化]]
- [[如何修改 ClientExec 的 Logo]]
- [[2023-04-04-clientexec-smtp-config|记录一下 Clientexec 中配置 SMTP 时的一些问题]]
