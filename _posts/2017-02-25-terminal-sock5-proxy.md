---
layout: post
title: "终端使用 sock5 代理"
tagline: "终端 terminal socks5 shadowsocks 代理 proxy"
description: ""
category: 经验总结
tags: [Socks5, Linux, Proxy, Ternimal]
last_updated: 
---

为了解决 Linux Mint/Ubuntu 下安装 Dropbox 的问题，而认识了 proxychains。proxychains 是 Linux 下的代理工具，他允许其他程序通过其代理上网，支持 HTTP， SOCKS4 和 SOCKS5 类型的代理服务器，并可配置多个代理方式。

一直使用的 Dropbox 因为其被屏蔽，所以安装及使用必须通过代理，而 Shadowsocks 作为天然的 socks5 代理成为了最佳选择，在安装 Dropbox(Linux) 之后，设置中可以设置 Socks5 代理。于是剩下的问题便是，如何安装 Dropbox 了。在 Dropbox 官网下载的安装程序会自动下载相关组件，但是因为没有走代理，几乎在直连的情况下无法成功。所以在解决这个问题的时候知道了 proxychains。在了解其作用之后，发现也可以利用其特性来达到在 Linux 终端下让任何命令走代理的目的。

## 安装 Proxychains

安装 proxychains 可以有很多方法，最简单的方式就是使用 apt

	sudo apt install proxychains

如果想要使用最新版，也可以自己手动编译源码

    # 安装
    git clone https://github.com/rofl0r/proxychains-ng.git
    ./configure --prefix=/usr --sysconfdir=/etc
    make
    sudo make install
    sudo make install-config

## 配置

在安装完成之后，一般在 `/etc/proxychains.conf` 处会有默认配置文件，编辑该文件

	sudo vim /etc/proxychains.conf
    
  	# 然后将如下内容添加到文件末
    socks5 127.0.0.1 1080
    
    # 开启本地 socks5 代理

然后使用

	proxychains dropbox start -i
    
就可以启动 Dropbox 安装程序。安装成功之后使用设置中内置的代理即可。

或者使用

	proxychains wget https://www.google.com

使用 `curl ip.gs` 来验证是否成功

    $ curl ip.gs 
    当前 IP：124.xxx.xxx.xxx 来自：中国北京北京 电信
    
    $ proxychains curl ip.gs
    ProxyChains-3.1 (http://proxychains.sf.net)
    |DNS-request| ip.gs 
    |S-chain|-<>-127.0.0.1:1080-<><>-4.2.2.2:53-<><>-OK
    |DNS-response| ip.gs is 45.116.12.10
    |S-chain|-<>-127.0.0.1:1080-<><>-45.116.12.10:80-<><>-OK
    当前 IP：106.xxx.xxx.xxx 来自：日本东京都东京linode.com kddi.com

来现在任何内容

## 延伸

在配置完 proxychains 之后，在终端如果任何命令无法连接成功时，在其前加上 `proxychains` 就可以走代理方式来执行该命令。

在网上查阅的时候同样发现还有其他类似的工具，比如 polipo，这是一个 socks5 转 http 的代理，设置之后可以使用 `export http_proxy=http://localhost:port` 来让终端走代理。

polipo 的使用也非常简单

	sudo apt-get install polipo

然后再修改其配置

	sudo vim /etc/polipo/config

放置以下配置：

	logSyslog = true
	logFile = /var/log/polipo/polipo.log

	proxy:socksParentProxy = "localhost:1080"
	socksProxyType = socks5

启用 polipo 

	sudo /etc/init.d/polipo start

默认端口为 8123 使用即可。

不过需要注意的是 Polipo 作者已经在 [GitHub](https://github.com/jech/polipo) 宣布项目不再更新。推荐还是使用 proxychains。

## reference

- <https://wizardforcel.gitbooks.io/daxueba-kali-linux-tutorial/content/11.html>
- <http://www.jakehu.me/2015/Ubuntu-Dropbox/>
