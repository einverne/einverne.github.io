---
layout: post
title: "HTTP协议学习笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [http, web, tcp-ip,]
last_updated: 
---

HTTP 协议全称 Hyper Text Transfer Protocol 超文本传输协议，基于 TCP/IP 协议用来传递数据。HTTP 面向应用层，HTTP协议是万维网的基石。

## HTTP 请求
HTTP请求由以下部分组成

- 请求行(Request line)，用来说明请求类型,要访问的资源以及所使用的HTTP版本
- 请求头部(Request Headers)，紧接着请求行（即第一行）之后的部分，用来说明服务器要使用的附加信息
- 空行(Blank line)，请求头部后面的空行是必须的
- 请求数据也叫主体(Request Body)，可以添加任意的其他数据。

### HTTP请求方法

根据HTTP标准，HTTP请求可以使用多种请求方法。

- HTTP1.0定义了三种请求方法： GET, POST 和 HEAD方法。
- HTTP1.1新增了五种请求方法：OPTIONS, PUT, DELETE, TRACE 和 CONNECT 方法。

### Request Headers

#### Referer

Referer 头允许客户端指定请求的URI的源地址，服务端通过检查该头信息可以知道客户端请求的资源的原始来源。

#### Connection

HTTP 1.1 中请求和应答头都可能出现 Connection ，表示 client 和 server 通信时对于长连接如何处理。


## HTTP 响应

HTTP响应也由四个部分组成，分别是：状态行、消息报头、空行和响应正文。

- 状态行(Status line)，由HTTP协议版本号， 状态码， 状态消息 三部分组成。
- 消息报头(Response Headers)，用来说明客户端要使用的一些附加信息
- 空行(Blank line)，消息报头后面的空行是必须的
- 响应正文(Response Body)，服务器返回给客户端的文本信息。

### HTTP 状态码

- 1xx：指示信息--表示请求已接收，继续处理
- 2xx：成功--表示请求已被成功接收、理解、接受
- 3xx：重定向--要完成请求必须进行更进一步的操作
- 4xx：客户端错误--请求有语法错误或请求无法实现
- 5xx：服务器端错误--服务器未能实现合法的请求


## 理解 HTTPS
看到一篇使用[信鸽来解释HTTPS](http://www.oschina.net/translate/https-explained-with-carrier-pigeons)的文章，信息量足够，也很生动的解释了非对称加密以及产生的问题和解法。

通过信鸽传递盒子，解释了HTTPS的非对称加密公私钥的问题

- 鲍勃向爱丽丝送一只没有携带任何信息的鸽子。
- 爱丽丝给鲍勃送回鸽子，并且这只鸽子带有一个有开着的锁的盒子，爱丽丝保管着锁的钥匙。
- 鲍勃把信放进盒子中，把锁锁上然后把盒子送给爱丽丝。
- 爱丽丝收到盒子，用钥匙打开然后阅读信息。

盒子是公钥，而爱丽丝手上的钥匙是私钥

如何信任盒子一节引入泰德这个第三方签名，在HTTPS中是认证机构。而沉重的盒子这一个小节，总结了HTTPS存在的问题，虽然加密的HTTPS要慢，但未来的趋势已经不可避免了。

### 长连接 VS 短连接
长连接，也叫持久连接，在TCP层握手成功后，不立即断开连接，并在此连接的基础上进行多次消息（包括心跳）交互，直至连接的任意一方（客户端OR服务端）主动断开连接，此过程称为一次完整的长连接。HTTP 1.1 相对于1.0 最重要的新特性就是引入了长连接。

短连接，顾名思义，与长连接的区别就是，客户端收到服务端的响应后，立刻发送FIN消息，主动释放连接。也有服务端主动断连的情况，凡是在一次消息交互（发请求-收响应）之后立刻断开连接的情况都称为短连接。

注：短连接是建立在TCP协议上的，有完整的握手挥手流程，区别于UDP协议。

需要频繁交互的场景使用长连接，如即时通信工具（微信/QQ，QQ也有UDP），相反则使用短连接，比如普通的web网站，只有当浏览器发起请求时才会建立连接，服务器返回相应后，连接立即断开。

维持长连接会有一定的系统开销，用户量少不容易看出系统瓶颈，一旦用户量上去了，就很有可能把服务器资源（内存/CPU/网卡）耗尽，所以使用需谨慎。

## 301 vs 302
HTTP 协议 redirect 有两个状态码 301 和 302，对于这两个状态码协议上是这么写的

- 301 Permanently Moved
- 302 Temporarily Moved

浏览器在处理这两个状态码时行为不一样，对于 Chrome / Firefox 会永久的缓存 301 跳转[^1]，浏览器会尽可能的永久保存该跳转，除非手动清除浏览器缓存，或者浏览器缓存将满为新内容腾出空间。如果不想跳转被浏览器缓存，可以使用 `Cache-Control` 和 `Expires` 两个头。

- Cache-Control: max-age=3600
- Expires: Thu, 01 Dec 2014 16:00:00 GMT
- Cache-Control: no-cache
- Cache-Control: no-store


关于Chrome中如何清除永久的301跳转可以参考[这篇文章](/post/2018/04/clear-chrome-cache-redirection.html)

[^1]: https://stackoverflow.com/a/21396547/1820217


## reference

- wikipedia
