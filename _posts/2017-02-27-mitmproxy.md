---
layout: post
title: "mitmproxy 抓包"
tagline: ""
description: ""
category: 
tags: [mitmproxy, android, proxy, linux, http, debug, reverse]
last_updated: 
---

在之前的文章[Android 抓包](/post/2016/11/android-http-proxy-debug.html) 中介绍过 Mac 下 Charles 进行客户端的抓包，那篇文章中最后介绍其他工具的时候提到了 mitmproxy 这样一款命令行工具，最近使用来看，也是非常强大的工具。这里就简单记录一下。

mitmproxy 是用 Python 和C 开发的一款支持 HTTP(S) 的中间人代理软件（man-in-the-middle proxy），不同于Fiddler2，burpsuite等类似功能工具，mitmproxy可在终端下运行并且可以用来拦截、修改、重放和保存HTTP/HTTPS 请求。mitmproxy 可以辅助 WEB 及客户端调试、开发和测试，是一个渗透测试的工具。


## 安装

    sudo apt-get install python3-pip python3-dev libffi-dev libssl-dev libtiff5-dev libjpeg8-dev zlib1g-dev libwebp-dev
    sudo pip3 install mitmproxy  # or pip3 install --user mitmproxy

或者从源里面拉，但是可能不是最新版本

    sudo apt install mitmproxy

我从源里面拉的版本为 0.15 版，而 pip3 安装的为 1.02 版本，相差版本足有一年。


## 工作原理
mitmproxy 实现原理：

1. 客户端发起一个到 mitmproxy 的连接，并且发出HTTP CONNECT请求，
2. mitmproxy 作出响应(200)，模拟已经建立了CONNECT通信管道，
3. 客户端确信它正在和远端服务器会话，然后启动SSL连接。在SSL连接中指明了它正在连接的主机名(SNI)，
4. mitmproxy 连接服务器，然后使用客户端发出的 SNI 指示的主机名建立SSL连接，
5. 服务器以匹配的 SSL 证书作出响应，这个 SSL 证书里包含生成的拦截证书所必须的通用名(CN)和服务器备用名(SAN)，
6. mitmproxy 生成拦截证书，然后继续进行与第３步暂停的客户端SSL握手，
7. 客户端通过已经建立的SSL连接发送请求，
8. mitmproxy 通过第４步建立的SSL连接传递这个请求给服务器。

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/33103496396/in/album-72157677227076474/" title="how-mitmproxy-works-transparent-https"><img src="https://c1.staticflickr.com/3/2868/33103496396_253be91392_z.jpg" width="572" height="326" alt="how-mitmproxy-works-transparent-https"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

mitmproxy 工作步骤：

1. 设置系统\浏览器\终端等的代理地址和端口为同一局域网中 mitmproxy 所在电脑的 IP 地址，比如我的PC 开启 mitmproxy 之后，设置 8080 端口，本地IP 为 192.168.1.130，那么设置 Android HTTP 代理为 192.168.1.130:8080
2. 浏览器或移动端访问 mitm.it 来安装 mitmproxy 提供的证书
3. 在 mitmproxy 提供的命令行下，或者 mitmweb 提供的浏览器界面中就能看到 Android 端发出的请求。

如果遇到 iOS 11 以上，访问网页时出现 `This Connection is Not private`

![mitmproxy error](https://i.stack.imgur.com/U9KM9.png)

在确保证书安装的前提下，需要到 Settings > General > About > Certificate Trust Setting 开启[证书信任](https://support.apple.com/en-us/HT208125)。

官方提供的安装方式：<http://mitmproxy.org/doc/certinstall.html>

## 三个命令

在完成 mitmproxy 的安装之后，mitm 提供的三个命令

- mitmproxy 会提供一个在终端下的图形界面，具有修改请求和响应，流量重放等功能，具体操作方式有点vim的风格
- mitmdump可设定规则保存或重放请求和响应，mitmdump的特点是支持inline脚本，由于拥有可以修改request和response 中每一个细节的能力，批量测试，劫持等都可以轻松实现
- mitmweb 提供的一个简单 web 界面，简单实用，初学者或者对终端命令行不熟悉的可以用 mitmweb 界面


### mitmproxy 基本使用
可以使用 `mitmproxy -h` 来查看 mitmproxy 的参数及使用方法。常用的几个命令参数：

1. `-p PORT, --port PORT` 设置 mitmproxy 的代理端口
2. `-T, --transparent` 设置透明代理
3. `--socks` 设置 SOCKS5 代理
4. `-s "script.py --bar", --script "script.py --bar"` 来执行脚本，通过双引号来添加参数
5. `-t FILTER` 过滤参数

在 mitmproxy 命令模式下，在终端显示请求流，可以通过 <kbd>Shift</kbd> + <kbd>?</kbd> 来开启帮助查看当前页面可用的命令。

```
基本快捷键

b  保存请求/返回头
C  将请求内容导出到粘贴板，按 C 之后会有选择导出哪一部分
d  删除flow 请求
E  将 flow 导出到文件
w  保存所有 flow 或者该 flow
W  保存该 flow
L  加载保存的 Flow
m  添加/取消 Mark 标记，会在请求列表该请求前添加红色圆圈
z  清空flow list 和 eventlog
/  在详情界面，可以使用 / 来搜索，大小写敏感
i  开启 interception pattern 拦截请求

移动

j, k       上下
h, l        左右
g, G   go to beginning, end
space    下一页
pg up/down   上一页/下一页
ctrl+b/ctrl+f    上一页/下一页
arrows 箭头     上下左右


全局快捷键
q   退出，或者后退
Q  不提示直接退出

```

同样在 mitmproxy 中不同界面中使用 <kbd>?</kbd> 可以获取不同的帮助，在请求详细信息中 m 快捷键的作用就完全不同 m 在响应结果中，输入m可以选择body的呈现方式，比如json，xml等 e 编辑请求、响应 a 发送编辑后的请求、响应。
因此在熟悉使用 `?` 之后，多次使用并熟悉快捷键即可。就如同在 Linux 下要熟悉使用 man 命令一样，在不懂地方请教 Google 一样，应该是习惯性动作。多次反复之后就会变得非常数量。


### 使用脚本
使用 s 参数制定 inline 脚本

    mitmproxy -s script.py

比如将指定 url 的请求指向新的地址

用于调试Android 或者 iOS 客户端，打包比较复杂的时候，强行将客户端请求从线上地址指向本地调试地址。可以使用 `mitmproxy scripting API` mitmproxy 提供的事件驱动接口。

加上将线上地址，指向本地 8085 端口，文件为 `redirect_request.py`

    #!/usr/bin/env python
    # -*- coding: UTF-8 -*-
    def request(flow):
        if flow.request.pretty_host == 'api.github.com':
            flow.request.host = '127.0.0.1'
            flow.request.port = 8085

则使用 `mitmweb -s redirect_request.py` 来调用此脚本，则通过 mitm 的请求都会指向本地。

更多的脚本可以参考：<https://github.com/mitmproxy/mitmproxy/tree/master/examples/simple>

一个完整的HTTP flow 会依次触发 `requestheaders`, `request`, `responseheaders` 和 `response`。

### 启用 SOCKS5 代理

添加参数 `--socks` 可以使用 mitmproxy 的 SOCK5代理

### 透明代理

透明代理是指将网络流量直接重定向到网络端口，不需要客户端做任何设置。这个特性使得透明代理非常适合不能对客户端进行配置的时候，比如说 Android 应用等等。

## 几个问题

对于 Openwrt 的路由器，在无线接口配置中一定要注意查看，“禁止客户端之间的通信”这个选项不启用。或者在 `/etc/config/wireless` 配置中， `wifi-iface` 配置中

    option isolate 0

为关闭状态，否则无法让无线局域网中的设备之间通信。

## reference

- 代码地址: <https://github.com/mitmproxy/mitmproxy>
- 官网地址: <https://mitmproxy.org/>
- 文档地址: <https://readthedocs.org/projects/mitmproxy/>
- <http://docs.mitmproxy.org/en/stable/install.html>
- <https://blog.heckel.xyz/2013/07/01/how-to-use-mitmproxy-to-read-and-modify-https-traffic-of-your-phone/>
- <http://liuxiang.logdown.com/posts/192057-use-mitmproxy-to-monitor-http-requests>
- <https://stackoverflow.com/a/46378145/1820217>
