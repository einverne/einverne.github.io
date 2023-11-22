---
layout: post
title: "ChatGPT 打字机显示效果的背后：Server-sent Events 介绍"
aliases:
- "ChatGPT 打字机显示效果的背后：Server-sent Events 介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [ chatgpt, server-sent-events, openai, http, websocket, client-polling ]
create_time: 2023-04-24 09:50:29
last_updated: 2023-04-24 09:50:29
---

在使用 [[ChatGPT]] 的时候总是对它一个字一个字的出结果感到焦急，虽然也知道 AI 生成内容的时候确实是一个字一个字计算出来的。OpenAI 使用这样的一个打字机效果也确实符合这个使用场景。但是当我想要自己去实现这样的效果的时候就突然遇到了我的知识盲区，观察 Chrome DevTools，我原本还以为是用 Web Socket 实现的，但是观察了一番发现并没有 Web Socket 的连接。再观察 `https://chat.openai.com/backend-api/conversation` 接口，发现 `content-type: text/event-stream; charset=utf-8`，于是就有了这篇文章。

## 什么是 Server-sent Events

Server-sent Events (SSE) 是一种服务器推送技术，利用该技术可以让服务器通过 HTTP 连接向客户端推送通知，消息，事件。SSE 通常用于向浏览器客户端发送消息更新或连续数据流，通过称为 EventSource 的 JavaScript API 来增强本机跨浏览器流媒体，客户端通过请求特定 URL 来接收 Event Stream。 SSE 的 media type 为 `text /event-stream`。

## 服务器推送内容

当我们开发需要数据实时更新的项目时，通常有一个问题，就是「如何从服务端向客户端发送消息/更新」，通常情况下有三种处理方式：

- Client Polling
- Web Socket
- Sever-Sent Events(SSE)

### Client Polling

客户端以固定间隔向服务端轮询查询更新。这个技术不是很新，实现比较简单。但这种技术只能算作准实时。

### Web Socket

Websocket 是一个流行的技术，用来提供客户端和服务端的双向数据传输。

Websocket 不是基于 HTTP 协议的，所以需要额外的安装和集成，开发和实现难度稍微比 Client Polling 复杂一些。

### Server-Sent Events

Server-Sent Events 是一个最新的技术，基于 HTTP，提供从服务端到客户端的异步消息通讯。几乎所有的浏览器都支持 SSE，除了 Internet Explorer。

SEE 使得服务器可以不依赖任何 polling 或 long-polling 的机制来发送消息给客户端。

```
GET /api/v1/live-stream
Accept: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

`text/event-stream` 表示客户端会从服务端等待事件流。`no-cache` 表示禁止缓存。

这个请求会开启一个长连接，服务端可以将实时的内容发送给客户端。Events 发送的内容是 UTF-8 编码的文本内容。

### 优点

- 简单，EventSource API 非常简单
- 服务器推送，适用于服务器向客户端推送数据，客户端只能接收
- EventSource 会自动处理断开和重连

### 缺点

- Server-Sent Events 的一大缺点就是数据的格式只支持 UTF-8，二进制数据是不支持的。
- 当没有使用 HTTP/2 的时候，另一个限制就是同一个浏览器最多只能有 6 个并发连接。当使用多个标签页的时候可能成为瓶颈。

![Ya7w](https://photo.einverne.info/images/2023/04/24/Ya7w.jpg)

## more

Microsoft 提供了 [fetch-event-source](https://github.com/Azure/fetch-event-source) 这个库来实现了 POST 请求的 EventSource。


## reference

- <https://medium.com/yemeksepeti-teknoloji/what-is-server-sent-events-sse-and-how-to-implement-it-904938bffd73>
