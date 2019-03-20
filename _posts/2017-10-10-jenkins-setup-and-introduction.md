---
layout: post
title: "jenkins setup and introduction"
tagline: ""
description: ""
category: 学习笔记
tags: [jenkins, ci-cd, ci, ]
last_updated:
---

## Jenkins 是什么
Jenkins 是一个独立的开源自动化服务器，可用于自动化各种任务，如构建，测试和部署软件。Jenkins 可以通过本机系统包 Docker 安装，甚至可以通过安装 Java Runtime Environment 的任何机器独立运行。

## Jenkins 有什么作用
用于持续、自动构建，测试项目，监控外部任务运行等。

## 模板类型
新建模板类型

- Freestyle project 基础功能，执行构建任务
- Pipeline，真实工作环境可能会包含，代码检查，编译，单元测试，部署等等任务，这个模板就是串行执行任务
- Multi-configuration project job 跑在不同的机器上



## 问题

### master/slave 节点配置

- https://www.howtoforge.com/tutorial/ubuntu-jenkins-master-slave/
