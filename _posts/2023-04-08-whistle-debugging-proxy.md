---
layout: post
title: "强大的网络调试和抓包工具 Whistle"
aliases:
- "强大的网络调试和抓包工具 Whistle"
tagline: ""
description: ""
category: 经验总结
tags: [ whistle, debug, http-debug, proxy, mitmproxy, nodejs, charles ]
create_time: 2025-03-04 11:04:41
last_updated: 2025-03-04 11:04:41
dg-home: false
dg-publish: false
---

在我之前的文章中介绍过不少的本地抓包和代理工具，比如非常常见的 [Charles](https://blog.einverne.info/post/2016/11/android-http-proxy-debug.html)，以及开源的 [mitmproxy](https://blog.einverne.info/post/2017/02/mitmproxy.html)，还有能抓更底层的 [wireshark](https://blog.einverne.info/post/2018/01/wireshark.html)，Fiddler 等等。今天想要介绍的这一款 whistle 是另一款基于 Node.JS 实现的功能强大的跨平台抓包调试工具，可以作为 HTTP（默认），HTTPS 代理，Socks 代理，反向代理等。

## 功能

[whistle](https://github.com/avwo/whistle) 是一个 NodeJS 实现的 Debug 代理工具。

- 支持 macOS，Windows，提供 Windows 和 macOS 客户端
- 可以作为 HTTP，HTTPS，WebSocket 代理和反向代理
- 内置 Weinre，Log，Composer 等工具可以查看远程页面的 DOM 接口
- 支持抓包和修改 HTTP，HTTPS，HTTP2，WebSocket，TCP 请求
- 支持重放及构造
- 支持设置上游代理，PAC 脚本，Hosts，延迟，限速
- 支持查看远程 console 日志

## 安装

如果是 Windows 和 macOS 用户可以直接使用官方用 Electron 包装的[客户端](https://github.com/avwo/whistle-client)。

如果不想安装客户端，还可以直接运行命令安装

```
npm i -g whistle && w2 start --init
```

安装完成之后。这里以客户端为例。

可以打开菜单，然后安装 Root CA 证书，输入电脑的密码。

![NuTY](https://photo.einverne.info/images/2025/03/04/NuTY.png)

然后配置 Proxy Settings，可以将本地一些不需要代理的地址跳过。

![N4gp](https://photo.einverne.info/images/2025/03/04/N4gp.png)

比如，iCloud 等等

```
*.cdn-apple.com *.icloud.com .icloud.com.cn *.office.com *.office.com.cn *.office365.cn *.apple.com *.mzstatic.com *.tencent.com *.icloud.com.cn
```

我们可以看到默认的 Whistle 的端口是 8888，在 Chrome 下，我们可以安装 SwithyOmega 插件将代理指向 8888 端口。或者也可以直接使用系统代理，指向本地的 8888 端口，那么本地所有的请求都会经过 whistle 。

![NScN](https://photo.einverne.info/images/2025/03/04/NScN.png)

## 配置

配置规则

比如我们想要将对 www.einverne.info/api 的所有请求都指向本地的 `localhost:8080/api` ，可以这样配置

```
www.einverne.info/api localhost:8080/api
```

whistle 默认有三种配置方式

默认方式，匹配表达式放在左边，操作的 URI 右边

```
pattern uri
```

传统方式，类似 hosts 配置方式

```
uri pattern
```

但是如果 pattern 是路径或者域名，uri 为域名或者路径的时候，无法区分，所以会使用默认方式

组合方式

```
127.0.0.1 www.example.com www.example1.com
```

whistle 完全兼容 hosts 配置方式，并且支持更多的组合

```
pattern uri1 uri2 uriN

# 如果 pattern 为路径或者域名，uri 为域名或路径
# 也可以使用
uri pattern1 pattern2 patternN
```

whistle 的规则配置支持非常多的方式，可以参考官方文档进行[配置](https://wproxy.org/whistle/mode.html)。

关于 whistle 的匹配方式可以参考[官网](https://wproxy.org/whistle/pattern.html)。

## related

