---
layout: post
title: "Laravel Herd 本地 All in One 开发环境"
aliases:
- "Laravel Herd 本地 All in One 开发环境"
tagline: ""
description: ""
category: 经验总结
tags: [ php, laravel, herd,  ]
create_time: 2024-10-04 17:51:38
last_updated: 2024-10-04 17:51:38
dg-home: false
dg-publish: false
---

[Laravel Herd](https://herd.laravel.com/) 是一个为 [[Laravel]] 而开发的集成开发环境，原生支持 Laravel 和 PHP。Herd 包括了 PHP 运行环境，Node 运行环境，Nginx 配置等等功能。

Herd 支持 Windows 和 macOS，包含了 Laravel 开发所需的一切。Herd 没有使用容器，虚拟机等虚拟化方式，使用二进制加快开发部署速度。Herd Pro 附带数据库，缓存，队列，存储等必要组件，加快开发速度。

![NA0H](https://photo.einverne.info/images/2025/01/28/NA0H.png)

## 功能

- 管理多个版本的 PHP，自带 PHP 7.4 到 8.3
- 支持多个 Node.js 版本
- 支持本地开发环境，从数据库到存储系统
- 支持访问和搜索本地日志
- 集成 Xdebug
- 集成测试邮件

## Install

macOS 下 

```
brew install --cask held
```

## 使用
Herd 的使用非常简单，直接在设置中添加本地 PHP 项目所在的目录，Herd 会自动托管 PHP 项目。通过管理面板还可以切换不同的 PHP 版本。

- 打开 Herd 设置
- 点击 Add Site 按钮
- 添加本地文件夹

## related

- [[ServBay]]
- [[XAMPP]]