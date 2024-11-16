---
layout: post
title: "反查一个域名的所有子域名"
aliases:
- "反查一个域名的所有子域名"
tagline: ""
description: ""
category: 学习笔记
tags: [ domain, subdomain, dns, subdomain-scanner, information-gathering, dns-query ]
create_time: 2023-09-06 08:18:40
last_updated: 2023-09-16 09:19:48
---

前段时间看到一篇文章说因为 Nginx 的一个「特性」，在直接访问 IP ，并且没有配置默认证书的情况下 Nginx 就会返回一个 SSL 证书从而倒置域名的泄露，进而泄露了网站的源 IP，使得一些扫描网站，比如 [[censys]] 可以直接查询到域名背后的网站 IP，从而导致网站即使用了 CDN 也会遭受到攻击。在这个契机下，我又开始了衍生，因为在 censys，[[fofa]]，[[Shodan]] 等等网站上你只需要输入一个域名就可以获得所有这个站点相关的信息，那么有没有办法可以在只知道一个网站域名的情况下知道所有的二级域名呢。

于是抱着这个新想法，进行了一番调查，果然还是有办法可以知道的。我最最朴素的想法就是写一个遍历，直接通过随机的字符串，`[a-z0-9\-]` 等等字符的组合，然后进行这些域名检查，ping，dig 的结果，如果有返回，可以认为这个子域名被启用了。但是很显然这个想法的效率太低了，并且遍历这么多无效的域名前缀很显然没有办法最快的找到所有的。

然后我就找到了 [[MassDNS]]，一款使用 C 语言编写的高性能子域名扫描工具。它通过使用自定义的 DNS 解析器和并发查询来加快子域名的发现速度。MassDNS 支持使用字典文件进行子域名爆破，并提供了丰富的配置选项来优化扫描过程。 MassDNS 还支持自定义的 DNS 服务器，并可以通过设置最大查询时间和最大重试次数等参数来控制扫描过程中的超时和重试行为。此外，它还提供了多种输出格式，包括文本、JSON 和 CSV，以便用户根据需要对扫描结果进行分析和处理。 使用 MassDNS 进行子域名扫描非常简单，只需指定目标域名和字典文件即可开始扫描。它还提供了多线程支持，可以根据系统资源情况调整并发线程数量，以实现更快的扫描速度。

然后我又循着脉络找到了 [OneForAll](https://github.com/shmilylty/OneForAll) 这样一个开源的工具，它是一个功能强大的子域名收集工具，集成了非常多的工具，从它的官方介绍上也可以看出来它收集子域名的思路和方法。

- 利用成熟第三方的情报收集
  - 利用证书收集子域名情报，比如通过 `censys_api`，`certspotter`，`crtsh` 等等
  - 常规检查收集子域
    - 域传送漏洞利用`axfr`
    - 检查跨域策略文件`cdx`
    - 检查 HTTPS 证书`cert`
    - 检查内容安全策略`csp`
    - 检查 robots 文件`robots`
    - 检查 sitemap 文件`sitemap`
    - 利用 NSEC 记录遍历 DNS 域`dnssec`
    - NSEC3 记录
  - 网络爬虫存档记录，`archivecrawl`，`commoncrawl`
  - 通过第三方 DNS 数据集收集子域
  - 直接通过 DNS 查询收集，SRV记录，MX,NS,SOA,TXT记录
  - 利用威胁情报平台数据收集子域
  - 搜索引擎发现子域
- 通过字典，或者遍历来查询子域名
- 通过 [[MassDNS]] 来多线程查询子域名

## OneForAll 使用
首先获取 OneForAll 的代码

```
git clone git@github.com:shmilylty/OneForAll.git
```

通过 [pyenv](/post/2017/04/pyenv.html) 或者其他熟悉的工具，安装 Python 依赖，然后执行

```
python3 oneforall.py --target douban.com run
```

很快就能获得一个 CSV 的结果。

## Other

- [[Findomain]]
- [[subfinder]] Go 语言编写的子域名查询工具