---
layout: post
title: "aiohttp 使用笔记"
aliases:
- "aiohttp 使用笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [ http, aiohttp, python, aio, async ]
last_updated:
---

最近想找一个 [[Wallabag]] 的 Python 客户端，在 GitHub 简单搜寻了一下之后发现了 [wallbag_api](https://github.com/foxmask/wallabag_api) 这个仓库，看了一下 Python 代码之后发现库中的代码是用 aiohttp 编写的，所以就来学习一下这个 Python 的异步 HTTP 库 aiohttp。

aiohttp 官方简洁明了，`Asynchronous HTTP Client/Server for asyncio and Python.` aiohttp 是一个基于 asyncio 模块的异步 HTTP 客户端/服务端框架。

可以 [看到](https://docs.aiohttp.org/en/stable/) aiohttp 不仅是一个 HTTP 客户端，也可以作为服务端。同时支持服务端的 WebSockets 和客户端 WebSockets。

我们知道 Python 下还有一个比较著名的 HTTP Client 库叫做 requests，这是一个同步的 HTTP 调用客户端，使用 requests 发起 HTTP 调用之后需要同步等待返回结果，而在 aiohttp 可以在发起请求之后将将程序的控制权暂时给别人，等待响应返回结果回来了之后再进行处理，这就可以提升系统的性能。

aiohttp 内部使用了 [[python-asyncio]] 来实现，而 Python 下 asyncio 的核心就是 [[Coroutine|协程]]

## Coroutine 协程
Coroutine（协程）是一个更通用的 subroutine(子程序)。

`async` 方法中使用 `await` 关键字来表示 coroutine。当使用 `await` 关键字的时候，coroutine 会将当前程序的控制释放给 Event loop。

```
import asyncio
async def async_func():
    print('start ...')
    await asyncio.sleep(1)
    print('... end!')

async def main():
    async_func()#this will do nothing because coroutine object is created but not awaited
    await async_func()

asyncio.run(main())
```

如果直接调用 `async_func()` 不会有任何作用，需要在前面添加 `await`

协程适合 IO 密集型任务：

- 网络请求，比如爬虫 [[aiohttp]]
- 文件读写，[[aiofile]]
- Web 框架，[[aiohttp]], [[fastapi]]
- 数据库查询，[[asyncpg]], [[databases]], [[aiomysql]]

## Installation
安装使用：

    pip install aiohttp

## 作为客户端
aiohttp 作为客户端。

这里可以和 requests 做一个简单的对比，在 requests 中发起同步请求：

```
import requests 
def hello()    
     return requests.get("http://httpbin.org/get")     

print(hello())
```

程序在 `requests.get` 方法调用时会同步等待请求返回。

而如果使用 `aiohttp`:

```
#!/usr/local/bin/python3.6
import asyncio 
from aiohttp import ClientSession 

async def hello():     
    async with ClientSession() as session:         
        async with session.get("http://httpbin.org/headers") as response:                
            response = await response.read()                         
            print(response) 
  
loop = asyncio.get_event_loop() 
loop.run_until_complete(hello())
```

在这个异步代码中我们可以看到很多的异步关键字，`async` 以及 `await` 关键字定义函数为异步。

这里使用 `ClientSession()` 获取一个 Session，session 可以在多个请求之间保留 cookie 和相关信息。因为 session 关闭是一个异步操作，所以需要使用 `async with`。

`session.get` 发起调用，也是一个异步操作，所以也需要使用 `async`，而 with 语句保证 response 可以正确关闭。

最后为了让这个异步方法可以执行，需要将其放入一个事件循环。

## 作为服务端
[[用 aiohttp 写服务器]] 不是本文的重点，所以简单了解一下，先略过。

```
from aiohttp import web

routes = web.RouteTableDef()

@routes.get('/')
async def hello(request):
    return web.Response(text="Hello, world")

app = web.Application()
app.add_routes(routes)
web.run_app(app)
```

## 控制并发

### 使用 Semaphore 控制
Semaphore 是一个线程计数器，核心是 `acquire()` 和 `release()` 方法。

执行 `acquire()` 方法时，先判断内部值是否小于 0，如果大于 0，获得锁，内部值减一，如果小于 0，阻塞，直到 `release()` 方法释放锁，内部值加一。

```
async def fetch(url, semaphore):
    async with semaphore:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.text()
                print('data', data + " " + time.ctime())
                return data

async def run():
    url = 'http://127.0.0.1:5000'
    semaphore = asyncio.Semaphore(2)  # 限制并发量为2
    to_get = [fetch(url, semaphore) for _ in range(10)]
    await asyncio.wait(to_get)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.close()
```

### 使用 TCPConnector 控制

```
async def fetch(session, url):
    async with session.get(url) as resp:
        if resp.status != 200:
            resp.raise_for_status()
        data = await resp.text()
        print('data', data + " " + time.ctime())
        return data

async def fetch_multi(session, urls):
    tasks = []
    for url in urls:
        task = asyncio.create_task(fetch(session, url))
        tasks.append(task)
    # gather: 搜集所有future对象，并等待返回
    results = await asyncio.gather(*tasks)
    return results

async def main():
    urls = ["http://127.0.0.1:5000/" for _ in range(10)]
    conn = aiohttp.TCPConnector(limit=3)
    async with aiohttp.ClientSession(connector=conn) as session:
        datas = await fetch_multi(session, urls)
        print(datas)

if __name__ == '__main__':
    asyncio.run(main())

```
