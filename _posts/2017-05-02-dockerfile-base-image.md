---
layout: post
title: "Dockerfile 基础镜像"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, docker, dockerfile, docker-image, ]
last_updated:
---


首先随便看看 [Python 的镜像](https://hub.docker.com/_/python/) 就能看到非常多的版本，这些版本怎么选择呢。

首先解释几个常见的名词，其实都是 Linux 的发行版本

- Stretch Debian 9
- Jessie , 指的是 Debian 8
- Wheezy Debian 7
- Alpine 轻型 Linux 发行版

其次基于不同版本系统制作的镜像自身大小都有区别，比较精简的 python:2.7-slim 可能也要比 python:2.7-alpine 来的大。
