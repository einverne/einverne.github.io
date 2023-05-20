---
layout: post
title: "自建 IT tools 一系列常用工具集"
aliases:
- "自建 IT tools 一系列常用工具集"
tagline: ""
description: ""
category: 产品体验
tags: [it-tools, tools, it, vue, base64,]
create_time: 2023-05-06 17:04:22
last_updated: 2023-05-06 17:04:22
---

[it-tools](https://github.com/CorentinTh/it-tools) 是一个使用 [[Vue.js]] 和 TypeScript 编写的常用 IT 工具的集合。

## 集成工具

it-tools 项目中集成了如下的工具：

### 密码相关

- Token generator
- Hash text, 包括了 MD5，SHA256 在内的 8 种 Hash
- Bcrypt
- UUID
- Encrypt / decrypt text
- BIP39 passphrase generator
- Hmac generator
- RSA key pair generator

### 转换

- 日期时间转换
- 进制转换，二进制，八进制，十进制，十六进制
- 罗马数字转换
- Base64 转换
- Base64 文件转换
- 颜色表示转换，hex, rgb, hsl and css
- Case converter
- Text to NATO alphabet
- YAML to JSON
- JSON to YAML
- List converter

### 网页相关

- 编解码 URL
- Escape html entities
- URL parser
- Device Information
- Basic auth generator
- Open graph meta generator
- OTP code generator
- Mime types
- JWT parser
- keycode info
- Slugify string
- HTML WYSIWYG editor
- User-agent parser
- HTTP status codes
- JSON diff

### 图片和视频

- QR Code generator
- SVG placeholder
- Camera recorder

### 开发相关

- Git cheatsheet
- Random port generator
- Crontab generator
- 美化 GSON
- JSON 压缩
- 美化 SQL
- Chmod 计算
- Docker run 到 Docker Compose 转换

### 网络

- IPv4 子网计算
- IPv4 地址转换
- IPv4 地址范围
- Mac 地址查询
- IPv6 ULA 生成

### 数学相关

- Math evaluator
- ETA calculator

### 其他

- Chronometer
- Temperature converter
- Benchmark builder
- Lorem ipsum generator
- Text statistics
- Phone parser and formatter

## 安装

使用 Docker 镜像可以很快的安装上。更加具体的 `docker-compose.yml` 可以见[这里](https://github.com/einverne/dockerfile/tree/master/it-tools)

```
git clone https://github.com/einverne/dockerfile.git
cd dockerfile/it-tools
docker-compose up -d
```

## 学习

it-tools 也可以作为一个很好的学习 Vue 和 TypeScript 的项目，给这个项目贡献一个常用的工具库，用 Vue 绘制界面可以很好的上手 Vue 的使用。
