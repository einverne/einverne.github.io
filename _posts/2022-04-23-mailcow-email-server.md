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

[[Mailcow]] 相较于 [[Mailu]] 整体比较完整，功能相对比较丰富。

- 支持二步验证，甚至支持 macOS 指纹验证
- Webmail 使用 SOGo
- 支持给每个域名增加管理员
- 有良好的日志查看系统
- Sync job 功能可以快速、简单地迁移到另外的提供商
- Web 界面上可以下载 profile，快速在 macOS 和 iOS 中配置使用

## 缺点

- 内存占用比较大，只是部署了 Mailcow 就占去了 3G 内存，如果禁用 Solr 和 ClamAV 可以节省内存，日常占用在 1G~2G，但就丧失了搜索和病毒扫描
- 用的组件比较多，Web 端整体使用体验比 Mailu 慢

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

### SPF 记录配置

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

然后使用配置好的域名 `mail.example.com` 登录，默认的用户名 `admin` 密码 `moohoo`。

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

几个常用的客户端连接端口：

| Service | Encryption | Port |
| ------- | ---------- | ---- |
| IMAP    | STARTTLS   | 143  |
| IMAPS   | SSL        | 993  |
| POP3    | STARTTLS   | 110  |
| POP3S   | SSL        | 995  |
| SMTP    | STARTTLS   | 587  |
| SMTPS   | SSL        | 465  |

## 升级

我的 Mailcow 是使用 Docker 安装的，所以升级也比较好升级，直接 `git pull origin master` 更新最新的代码，然后执行 `sudo ./update.sh` 即可。

但是我在升级的过程中遇到点问题，我本地的 Mailcow docker 项目存在一些无意中被修改的文件，并且我因为半年的时间没有更新，所以本地好多文件和远程的冲突了，`git pull origin master` 是无法拉取并合并到本地的，我自己的看了一下冲突的文件（如下）,我判断这些文件直接可以覆盖更新。

```
On branch master
Your branch is behind 'origin/master' by 717 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   update.sh

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   data/conf/postfix/main.cf

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .github/workflows/assets/
        data/Dockerfiles/backup/
        data/web/css/themes/
```

所以我就直接执行:

```
git fetch --all
git reset --hard origin/master
```

直接使用远程的分支重置覆盖本地的修改。

然后再执行 `sudo ./update.sh`，升级的过程中 update 脚本会处理很多问题。这个地方需要注意 `docker-compose` 的版本要保持最新，用 v1 版本的 docker-compose 可能会出问题。

```
sudo apt install docker-compose-plugin
```

或者自己手动安装

```
sudo curl -SL https://github.com/docker/compose/releases/download/v2.6.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

然后再执行 `sudo ./update.sh`，等脚本执行完成即升级完成。

## 特性梳理

### Alias 别名

Mailcow 的 alias 是指可以通过该功能，将收件人的电子邮件地址映射到其他多个电子邮件地址的设置。用户别名将一个或多个电子邮件地址映射到一个用户帐户。例如，如果您有一个名为 john@example.com 的用户，您可以创建一个用户别名 jdoe@example.com，将所有发送到 jdoe@example.com 的邮件都转发到 john@example.com 。

如果要配置 Catch-All，直接在 Alias 中将 @ 符号前的用户名省略，比如要所有发送到 `@example.com` 的邮件全部都发送给另一个邮箱， 直接配置 `@example.com` 即可。

### Domain aliases 域名别名

在 Mailcow 中，域名别名是指，将一个域名映射到另外一个域名。这在很多情况下都非常有用，比如当公司开设新品牌或更改其主要域名时，或者需要合并多个域名（例如“example.com”和“example.net”）时。

通过在 Mailcow 中设置域名别名，发送到备用域名的电子邮件将会被传递到与主要域名相同的邮箱中。这意味着用户可以继续收到发送到任何一个域名的电子邮件，而不必管理多个电子邮件帐户。

总的来说，Mailcow 域名别名是管理电子邮件域名和确保消息传递到正确收件人的功能。

![ObDH](https://photo.einverne.info/images/2023/03/28/ObDH.png)

### 手工配置

## reference

- <https://mailcow.github.io/mailcow-dockerized-docs/manual-guides/u_e-80_to_443/>
- <https://low.bi/p/r7VbxEKo3zA>
- <https://blog.ginshio.org/2020/mail_server/>
