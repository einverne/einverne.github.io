---
layout: post
title: "Python 标准库网关接口 wsgiref"
tagline: ""
description: ""
category: 学习笔记
tags: [wsgi, python, wsgiref, ]
last_updated:
---

The Web Server Gateway Interface(WSGI) 是网络服务器软件和网络应用程序之前的标准接口。通过共同的网关标准接口可以让同一个应用支持不同的服务器。只有网络服务器或者编程框架的作者需要熟悉 WSGI 设计，如果使用现存的框架则不太需要关心更底层的网关接口。

wsgiref 是 Python 的 WSGI 标准实现，可以用来帮助实现网络服务器和应用框架。他提供了一系列工具用来操作 WSGI 环境变量和响应头，也提供了基础的类来实现 WSGI 服务器，提供了简单的 HTTP 服务来给 WSGI 应用提供服务器，提供了一个符合 WSGI 标准（[PEP 3333](https://www.python.org/dev/peps/pep-3333)) 的验证工具来验证 WSGI 服务器和应用。

文档

- <https://wsgi.readthedocs.org/>

## 几个部分

### wsgiref.util

wsgiref.util 这个模块提供了一系列工具用来操作 WSGI environments。

### wsgiref.headers
该模块提供了一个简单的类 `Headers` 用来操纵 WSGI 相应头。

### wsgiref.simple_server
该模块基于 http.server 实现了一个简单的 HTTP 服务器，这个服务器能够给 WSGI 应用提供服务。每一个服务器实例在特定的 host 和 port 上提供一个 WSGI 应用服务。如果要在听一个 host 和 port 上给不同应用程序提供服务，那么你需要创建一个 WSGI 应用，并且传入 `PATH_INFO` 来选择哪一个应用程序来来被每一次请求调用。

### wsgiref.validate
验证模块。

### wsgiref.handlers
该模块提供了实现 WSGI 服务器和网关的基础类。这些基础类能够处理和 WSGI 应用的大部分通信。

## Example
简单的例子

    from wsgiref.simple_server import make_server

    # Every WSGI application must have an application object - a callable
    # object that accepts two arguments. For that purpose, we're going to
    # use a function (note that you're not limited to a function, you can
    # use a class for example). The first argument passed to the function
    # is a dictionary containing CGI-style environment variables and the
    # second variable is the callable object (see PEP 333).
    def hello_world_app(environ, start_response):
        status = '200 OK'  # HTTP Status
        headers = [('Content-type', 'text/plain; charset=utf-8')]  # HTTP Headers
        start_response(status, headers)

        # The returned object is going to be printed
        return [b"Hello World"]

    httpd = make_server('', 8000, hello_world_app)
    print("Serving on port 8000...")

    # Serve until process is killed
    httpd.serve_forever()


## reference

- <https://docs.python.org/3.5/library/wsgiref.html>
