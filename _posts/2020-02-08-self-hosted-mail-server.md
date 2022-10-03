---
layout: post
title: "自建邮件服务器可选项"
alias: "自建邮件服务器可选项"
tagline: ""
description: ""
category: 学习笔记
tags: [mail, linux, docker, smtp, mail-server, self-hosted ]
last_updated:
---

整理一些可以自行搭建邮件服务器的项目。


## Postal
[[postal]] 是一个使用 Rust 编写的邮件服务器，可以发送和接收邮件。这是一个可以代替 [[SendGrid]]、[[Mailgun]] 或者 Postmark 的开源工具，可以在自己的服务器上假设。

GitHub 地址：<https://github.com/postalserver/postal>


## Mail-in-a-Box

- <https://mailinabox.email/guide.html>

## mailu
[Mailu.io](https://mailu.io/) 是一款免费开源且性能强大、功能丰富的域名邮箱服务。它基于Docker, 具有部署简单，可移植性高，备份方便等多种优势。

搭建介绍：

- <https://www.youtube.com/watch?v=ScarlmgD0dU>

- [[2021-07-30-email-server-mailu]]

## mailcow
Open source email server

- <https://mailcow.email/>
- <https://mailcow.github.io/mailcow-dockerized-docs/>

mailcow 使用介绍：

- <https://www.youtube.com/watch?v=EFANAmqJzi0>

搭建视频教程：

- <https://www.youtube.com/watch?v=CcqGgQ2AlyE>

## Poste
[Poste](https://poste.io/) 是一个可以自己搭建的邮件服务器程序，提供了后台管理，可以实现邮件收发，容量控制，邮件过滤等等工具。还提供了统计分析，SSL，邮件转发，邮件别名，通过 ClamAV 支持邮件病毒扫描等等功能。

Poste 运行需要 800MB 左右空间，只支持 64 位操作系统。

Poste 可以支持 Docker 安装，但是提供了 Free、Pro 和 Pro+ 版本，都需要按年订阅。

## docker-mailserver
文档不是很全

- <https://github.com/tomav/docker-mailserver>

## salmon
一个 Python 写的 smtp 服务

- <https://github.com/moggers87/salmon>

## inbucket
Disposable webmail server (similar to Mailinator) with built in SMTP, POP3, RESTful servers; no DB required.

A great tool for email testing.

- <https://github.com/inbucket/inbucket>

## reference

- <https://medium.com/@stoyanov.veseline/self-hosting-a-mail-server-in-2019-6d29542dadd4>
