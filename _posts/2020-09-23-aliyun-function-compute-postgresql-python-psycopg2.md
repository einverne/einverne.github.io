---
layout: post
title: "阿里云函数计算中使用 Python psycopg2 访问 PostgreSQL"
tagline: ""
description: ""
category:
tags: [function-compute, ]
last_updated:
---


在之前的文章中提到过 [函数计算](/post/2019/03/function-compute.html) 但一直没有正式的用起来，现在正好通过在阿里云函数计算中连接访问 PostgreSQL 来系统性的学习一下阿里云的函数计算。
首先要了解的几个概念：

- Fun，Fun 命令是阿里提供的一个用于本地编译，部署函数计算的命令行工具，通过编写本地的 `template.yml` 配置文件可以对函数计算的**服务**, **方法**, **网关** 进行管理。更多内容可以参考官方提供的[文档](https://github.com/alibaba/funcraft)


## Fun 命令简单使用
fun 命令的安装可以参考[官方的文档](https://github.com/alibaba/funcraft/blob/master/docs/usage/installation-zh.md).

配置 fun:

	fun config

这里需要填写账号相关的信息。执行后会将账号相关的信息保存到：

	`~/.fcli/config.yaml`

初始化项目模板：

	fun init -n demo

fun 命令的执行依赖于 `template.yml` 配置文件。

本地调试：

	fun local invoke

部署函数：

	fun deploy

## 上传应用
上传应用方式：

- 控制台
- [fun](https://help.aliyun.com/document_detail/64204.html) 工具

## 连接 PostgreSQL 数据库
项目依赖 `template.yml` 配置，配置函数计算的服务名，函数名，触发方式等等。

创建 Funfile 文件，安装依赖：

	RUNTIME python3
	RUN fun-install pip install psycopg2

然后执行 `fun install`


## reference

- <https://github.com/alibaba/funcraft>
- <https://help.aliyun.com/document_detail/164218.html>

