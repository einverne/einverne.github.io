---
layout: post
title: "Laravel 学习笔记：开发环境搭建"
aliases:
- "Laravel 学习笔记：开发环境搭建"
tagline: ""
description: ""
category: laravel
tags: [ laravel, php, dev, ide, phpstorm, jetbrains ]
last_updated:
---

Laravel 提供了多种安装方式：

- 可以通过官方提供的 [[Laravel Sail]] 初始化环境，Laravel Sail 是一个轻量的命令行工具可以和 Docker 开发环境交互。这意味着如果要使用 Sail 本地需要安装 Docker 环境。
- 通过 Composer 安装，Composer 是一个 PHP 环境下的依赖管理器工具
- Laravel Installer

## Laravel Sail
Sail 的核心是项目中的 `docker-compose.yml` 文件。

```
curl -s "https://laravel.build/example-app" | bash

cd example-app
 
./vendor/bin/sail up
```

设置 `alias`:

    alias sail="bash vendor/bin/sail"

之后就可以直接使用 `sail up` 命令。

一旦应用启动之后，可以访问本地：http://localhost .

不过这里我不清楚为什么我本地的 80 端口始终无法访问，所以我只能按照 `docker-compose.yml` 中的配置，将 `APP_PORT` 修改成 8080 端口，才能正常访问到。

Laravel Sail 启动之后会自动拉取如下组件：

- [[MySQL]]
- [[Redis]]
- [[mailhog]]，mailhog 是一个本地开发测试的邮件服务器，非常方便在本地测试 SMTP
- [[meilisearch]]
- [[selenium]]
- Laravel 应用本身

### 邮件
Laravel Sail 中包含的还包含一个邮件测试服务器 [MailHog](https://github.com/mailhog/MailHog) ，该服务用于在本地开发期间拦截应用发送的所有邮件并提供一个 Web 界面在浏览器中预览这些邮件信息，方便测试和调试。

```
    mailhog:
        image: 'mailhog/mailhog:latest'
        ports:
            - '${FORWARD_MAILHOG_PORT:-1025}:1025'
            - '${FORWARD_MAILHOG_DASHBOARD_PORT:-8025}:8025'
        networks:
            - sail
```

MailHog 的 SMTP 服务器的默认端口是 1025。

Sail 运行时可以通过 http://localhost:8025 访问 MailHog Web 界面。

### Sail 相关命令

启动

    sail up

重新构建：

    sail build --no-cache

执行 php 命令：

    sail php --version

## Composer
如果本地电脑已经安装了 PHP 和 Composer，可以直接通过 Composer 来初始化 Laravel 项目。一旦项目创建了，可以使用 Artisan CLI 的 `serve` 命令启动 Laravel 本地开发服务器。

```
composer create-project laravel/laravel example-app
 
cd example-app
 
php artisan serve
```

## Installer
还可以通过 Laravel 安装器来初始化项目：

```
composer global require laravel/installer
 
laravel new example-app
 
cd example-app
 
php artisan serve
```

注意，这里需要将 `laravel` 加入系统的环境变量。

- macOS: `$HOME/.composer/vendor/bin`
- Windows: `%USERPROFILE%\AppData\Roaming\Composer\vendor\bin`
- GNU / Linux Distributions: `$HOME/.config/composer/vendor/bin` or `$HOME/.composer/vendor/bin`

## 开发环境
当 Laravel 安装好之后，我本地使用 JetBrains 提供的 PhpStorm，然后安装了 [Laravel Idea](https://laravel-idea.com/) 插件，可以按照官网提供的方式来申请开源许可。
