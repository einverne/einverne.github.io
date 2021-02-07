---
layout: post
title: "URL 短域名"
tagline: ""
description: ""
category: 整理合集
tags: [github, google, short-url, url, ]
last_updated:
---

逛博客看到别人在[讨论](https://www.zhihu.com/question/29270034) [[短 URL 的设计实现]]，然后偶然间发现了 GitHub 曾经推出 [^1] 过的短域名服务 [Git.io](https://git.io)

创建短域名

	curl -i https://git.io -F "url=https://github.com/einverne"
	HTTP/1.1 100 Continue

	HTTP/1.1 201 Created
	Server: Cowboy
	Connection: keep-alive
	Date: Sun, 14 May 2017 03:05:40 GMT
	Status: 201 Created
	Content-Type: text/html;charset=utf-8
	Location: https://git.io/v97cY
	Content-Length: 27
	X-Xss-Protection: 1; mode=block
	X-Content-Type-Options: nosniff
	X-Frame-Options: SAMEORIGIN
	X-Runtime: 0.312051
	X-Node: 09a65813-05e0-40a2-a9bf-6dd88da1cdbc
	X-Revision: 392798d237fc1aa5cd55cada10d2945773e741a8
	Strict-Transport-Security: max-age=31536000; includeSubDomains
	Via: 1.1 vegur

使用短域名 302 跳转

	curl -i https://git.io/v97cY

	HTTP/1.1 302 Found
	Server: Cowboy
	Connection: keep-alive
	Date: Sun, 14 May 2017 03:06:58 GMT
	Status: 302 Found
	Content-Type: text/html;charset=utf-8
	Location: https://github.com/einverne
	Content-Length: 0
	X-Xss-Protection: 1; mode=block
	X-Content-Type-Options: nosniff
	X-Frame-Options: SAMEORIGIN
	X-Runtime: 0.005605
	X-Node: d567f758-ba0e-4e8b-95ba-b6a80730cc20
	X-Revision: 392798d237fc1aa5cd55cada10d2945773e741a8
	Strict-Transport-Security: max-age=31536000; includeSubDomains
	Via: 1.1 vegur

还可以使用 `code` 参数来指定生成的短链接名字，比如

	curl -i https://git.io -F "url=https://github.com/...." -F "code=abcd"

git.io 缩短的域名必须是 github 站相关的域名，其他网站的地址它是不会缩短的。并且每个链接只能被缩短一次，如果第二次再请求会返回和上一次缩短一样的结果。

所以无奈啦，

- 我的 GitHub 主页 <https://git.io/v97cY>
- 博客地址 <https://git.io/v97cf>

## goo.gl

Google 的短域名服务其实已经用很久了 <https://goo.gl/> ，相比来说，有几个好处

- 在登录状态下生成的短域名能够统计跳转数量
- 在生成之后也与控制面板可以查看曾经生成的短链接
- 直接在生成的短域名后加上 `.qr` 可以查看二维码，比如 <https://goo.gl/xEeWKp> 添加 qr <https://goo.gl/xEeWKp.qr>

## 开源版本

YOURLS 项目，使用 PHP 实现短域名 <https://github.com/YOURLS/YOURLS> 项目到目前已经非常完善了。


更多的项目可以参考：<https://github.com/topics/url-shortener>

## 学习版本

PHP 版本 <https://github.com/takashiki/Ourls>


一个比较好玩的 JS 纯前端实现，将跳转信息保存到浏览器 Local Storage 中 [^2], 可以学习一下项目中对本地 Storage 操作的部分 [^3]，应该挺有意思。

[^1]: <https://github.com/blog/985-git-io-github-url-shortener>
[^2]: <http://dyygtfx.github.io/short-url/>
[^3]: <https://github.com/dyygtfx/short-url/blob/master/urlShort.js>

## 设计短域名服务
表结构设计

    create table links
    (
        shortLink not null
            unique,
        longLink,
        timestamp,
        ip,
        redirectMethod
    );


