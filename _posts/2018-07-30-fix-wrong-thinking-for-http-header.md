---
layout: post
title: "修正关于 HTTP Header 的错误认识"
tagline: ""
description: ""
category: 经验总结
tags: [http, header, web, java-web, spring]
last_updated:
---

**HTTP 请求的 Header 是不区分大小写的！**，一直以为 HTTP 请求的请求头是有区分大小的，知道今天调试发现 Spring 将 header 全部处理成小写，然后有人提了 [Bug 58464](https://bz.apache.org/bugzilla/show_bug.cgi?id=58464) 然后看到 [Stackoverflow](https://stackoverflow.com/questions/5258977/are-http-headers-case-sensitive) 上面有人回答。

HTTP/1.1 和 HTTP/2 都是 `case-insensitivt` 都是不区分大小写的。


