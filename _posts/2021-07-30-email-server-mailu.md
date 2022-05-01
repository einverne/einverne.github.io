---
layout: post
title: "使用 Mailu 搭建邮件服务器"
aliases:
- "使用 Mailu 搭建邮件服务器"
tagline: ""
description: ""
category: 经验总结
tags: [ mailu, email, email-host, linux, dkim, mail-server, 域名邮箱 , ]
last_updated:
---

[Mailu](https://mailu.io/1.9/) 是一个开源的邮件服务器，可以使用 Docker 部署安装，后台界面使用 Python & Flask 开发。

## 个人总结的优点

- Mailu 非常轻量，相较于 Mailcow 非常轻量简洁
- 自带域名昵称，转发等等常用功能
- 支持两个 Webmail 分别是 roundcube/rainloop
- 自动生成 DKIM/DMARC/SPF 记录
- 可以使用官网的配置，使用 Docker 一键完成安装

建议在开始自建之前先阅读：

- [电子邮件是如何工作的](/post/2022/03/how-email-send-and-receive.html)

了解常用的 [[SPF]]，[[DKIM]]，[[DMARC]] 记录的作用。

## Prerequisite
系统环境要求：

- 一台 2GB 具有独立 IP 的 VPS，25 端口开放，可以通过 `telnet smtp.gmail.com 25` 来测试，返回 220 表示可以。
    - VPS 服务提供商可以设置 rDNS
    - VPS 的 IP 最好要比较干净，没有被拉入黑名单
- 一个可以进行配置 DNS 的域名

本文在 Ubuntu 20.04 LTS 上进行。

### 确保 25 端口开放
可以使用如下命令测试 25 端口是否开放：

    telnet smtp.gmail.com 25

如果返回超时需要向主机提供商申请开通 25 端口。

确保如下的端口可用：

    netstat -tulpn | grep -E -w '25|80|110|143|443|465|587|993|995'


### 设置 hostname
以 `example.com` 为例：

    sudo hostnamectl set-hostname mx.example.com

重启之后使用如下命令检查：

    hostname
    # 应该显示 mx
    hostname -f
    # 应该显示 mx.example.com

### DNS 设置
假设 VPS 的域名是 `1.1.1.1`，以 `example.com` 为例：

- 设置 A 记录， `mx.example.com` 到 1.1.1.1
- 设置 SPF，TXT 记录，值为 `v=spf1 mx ~all`
- DMARC，`_dmarc.example.com` TXT 记录，值为 `v=DMARC1;p=none;pct100;rua=mailto: admin@example.com;ruf=mailto: admin@example.com`

记得修改其中的 `admin@example.com` 为自己的域名。

### 设置 PTR 反向域名解析
这一步需要在 VPS 提供商后台进行设置，有一些服务器商不支持用户自行修改，那么需要用户 open ticket 来咨询，并设置 IP 到域名的解析记录。

设置完成之后可以通过 `dig -x IP` 来查看是否生效。

### 安装 Docker 和 docker-compose 命令
可以参考 Docker 官网安装。

```
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get install docker-ce docker-ce-cli containerd.io -y
systemctl start docker
systemctl enable docker
```

安装 Docker Compose

```
curl -fsSL https://get.docker.com | bash -s docker
curl -L "https://github.com/docker/compose/releases/download/1.26.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Mailu 配置

- 文档：<https://mailu.io/master/general.html>

Mailu 官方提供了一个自动配置生成网页

- <https://setup.mailu.io/1.9/>

可以选择两种 Webmail

- [roundcube](https://roundcube.net/)
- [rainloop](https://www.rainloop.net/)

将配置下载之后查看配置，然后使用 Docker Compose 安装

    docker-compose up -d

安装成功后：

- 后台地址： http://example.com/admin
- Webmail 地址： http://example.com/webmail

等待服务启动之后，登录后台，然后进行一定初始化配置。然后在界面中添加域名。

### 添加域名
在后台添加域名：

![add domain](https://photo.einverne.info/images/2022/04/28/dg5l.jpg)

### 配置 DNS 解析

登录后台之后，点击 Mail Domains，然后在列表也点击最前面的按钮，进入域名详情之后点击右上角的 `Regenerate Keys` 生成 [[DKIM]] 和 [[DMARC]] 记录。

然后按照界面显示的内容，将 DNS 记录更新到域名的 DNS 中，等待一段时间生效即可。

![mailu dkim](https://photo.einverne.info/images/2022/04/28/dkfy.jpg)

#### 设置 DKIM

添加域名后在后台找到 DKIM，将其值拷贝出来，到 Cloudflare，或者任何 DNS 服务提供商添加 DKIM

### 添加信箱
在域名界面添加用户邮箱，这个用户邮箱之后就可以通过 [[webmail]] 来登录，发信或者收信。

![email user](https://photo.einverne.info/images/2022/04/28/d2Hg.jpg)

### 发信测试

最后可以使用 <https://www.mail-tester.com/> 来发信测试。
