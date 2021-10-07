---
layout: post
title: "爬虫相关技术整理"
tagline: ""
description: ""
category: 学习笔记
tags: [crawler, spider, python, mitm, linux, ]
last_updated:
---

部分内容从 Python 3 网络爬虫开发实战 [书](https://germey.gitbooks.io/python3webspider/content/) 中整理。

## Python 模块

主要依赖 Python 模块

- requests
- BeautifulSoup [doc](https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/)
- celery [介绍](/post/2017/04/celery-introduction.html) [实践](/post/2017/05/celery-best-practice.html)
- PyMySQL [doc](https://pypi.org/project/PyMySQL/) 或者 MySQL-python [doc](https://pypi.org/project/MySQL-python/)
- SQLAlchemy [doc](https://www.sqlalchemy.org/)

## 数据库

- MySQL
- Redis

## 抓包

- Charles [介绍](/post/2017/11/charles-installation-under-linux.html)
- MitmProxy [介绍](/post/2017/02/mitmproxy.html)
- Fiddler
- wireshare [介绍](/post/2018/01/wireshark.html)

## 工具依赖

- Selenium 自动化测试框架
- Appium 移动端自动化测试框架

## 爬虫框架

- [PySpider](https://github.com/binux/pyspider)
- [Scrapy](https://github.com/scrapy/scrapy) [介绍](/post/2017/04/scrapy-introduction.html)

