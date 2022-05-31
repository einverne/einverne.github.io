---
layout: post
title: "Nginx 中数据 Buffer size 相关配置"
aliases: 
- "Nginx 中数据 Buffer size 相关配置"
tagline: ""
description: ""
category: 经验总结
tags: [ nginx, linux, web-server, buffer-size,  ]
last_updated:
---


`client_body_buffer_size`

Nginx 分配给请求数据的 Buffer 大小，如果请求的数据小于 `client_body_buffer_size` ，那么 Nginx 会在内存中存储数据，如果请求的内容大小大于 `client_body_buffer_size`，但是小于 `client_max_body_size`，会先将数据存储到临时文件中。

默认的情况下，这个缓存大小是等于两个 memory pages，也就是在 x86 机器上是 8K，在 64-bit 平台上是 16K。

这个空间只有当请求有上传的时候才会被用到，一旦数据被传输到后端服务，内存就会被清空。这意味着你需要足够的内存空间来保存并发的上传，否则服务器会开始 swapping。



`client_body_temp` 指定的路径，默认是 `/tmp/` 所配置的 client_body_temp 地址，一定让 Nginx 用户组有读写权限。否则当传输的数据大于 `client_body_buffer_size` 是写入临时文件会报错。

> open() /nginx/client_body_temp/0000000019" failed (13: Permission denied)

在接口层面的表现为接口请求返回 403 

`client_max_body_size` 默认大小是 1M，客户端请求服务器最大允许大小，如果请求正文数据大于 `client_max_body_size` 的值，那么 HTTP 协议会报错 413 Request Entity Too Large。 正文大于 `client_max_body_size` 一定是失败的，如果要上传大文件需要修改该值。



## client_max_body_size 优先级

- 可以选择在`http{ }`中设置：client_max_body_size   20m;
- 也可以选择在`server{ }`中设置：client_max_body_size   20m;
- 还可以选择在 `location{ }` 中设置：client_max_body_size   20m;

三者到区别是：http{} 中控制着所有nginx收到的请求。而报文大小限制设置在server｛｝中，则控制该server收到的请求报文大小，同理，如果配置在location中，则报文大小限制，只对匹配了location 路由规则的请求生效。


## reference

- <https://serverfault.com/a/952259/288331>