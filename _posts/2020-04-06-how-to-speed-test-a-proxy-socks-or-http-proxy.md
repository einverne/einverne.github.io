---
layout: post
title: "在命令行下给 socks 或者 http 代理测速"
aliases: "在命令行下给 socks 或者 http 代理测速"
tagline: ""
description: ""
category: 经验总结
tags: [speedtest, socks, http_proxy, proxy, vps, v2ray]
last_updated:
---

在国内不可避免的要用到代理，这些年陆陆续续从 GAE 上的代理，到自己购买 VPS 搭建，从 Shadowsocks 到 V2ray，自己花费了不少的时间，而现在虽然手上也有两台 VPS，但是已经不拿他们作为主要的代理了，我一台 Directspace 的 VPS，线路没有优化过，到国内的延迟略高，而另一台 AWS 的 EC2，虽然地理位置在韩国，也只勉强到能用的阶段。所以这两年陆陆续续不再自己维护代理服务，之前有购买过因为 Ingress 结缘的 Shadowsocks 服务，一直用到现在，虽然有些情况下会发生断流，倒也一直没有放在心上。直到尝试了一周的 [V2ray 服务提供商](https://portal.wl-site3.com/#/register?code=pyHxQdJr)，我想是回不去 SS 了。

那么有什么方法来对一个代理服务的提供商的速度进行测试呢？这就是这篇文章的最主要的内容。

## YouTube
我知道很多的人拿 YouTube，右击查看 `Stats for nerds`.

![youtube stats for nerds](/assets/youtube-stats-for-nerds.png)

可以看到其中有一条 Connection Speed，这个图片中的速度大概在 15~18Mbps，转换一下大概在 2~3MB/s 的速度，这个速度看个 1080p，大概是可以了，如果要追求更高的画质那么还需要更高的比特率，不过对于我来说，这已经足够了，毕竟我的 MSI 显示屏也只有 1080p 而已。

## speedtest-cli
但 YouTube 毕竟只是一种方式，如果想要更加精确的测速，有一个网站叫做 [speedtest](https://www.speedtest.net/)，一般我用来测试都用这个，或者还有一个 Netflix 提供的 [fast.com](https://fast.com/).

![speedtest web](/assets/speedtest-web-running.png)

结果：

![speedtest web result](/assets/speedtest-web-result.png)

但其实 speedtest 可以在命令行下进行。

首先要先安装 pip, 然后在安装：

	pip install speedtest-cli

运行：

	➜ speedtest-cli
	Retrieving speedtest.net configuration...
	Testing from China Mobile Guangdong (xxx.xxx.xxx.13)...
	Retrieving speedtest.net server list...
	Selecting best server based on ping...
	Hosted by Beijing Broadband Network (Beijing) [1.67 km]: 11.141 ms
	Testing download speed................................................................................
	Download: 124.99 Mbit/s
	Testing upload speed......................................................................................................
	Upload: 4.17 Mbit/s

speedtest 的测速的时候会根据位置选择不同的节点，不同的节点会对结果有一定的影响。

## 对代理进行测试
既然有了上面的基础 speedtest-cli 命令，那么在 Linux 下，HTTP 代理也好，socks 代理也好都可以通过 speedtest-cli 来直接在终端下进行测试。

首先要知道本地的 socks 代理地址，Shadowsocks 一般的本地 socks 地址是：

	socks://127.0.0.1:1080

### 对 socks 代理进行测速
要对 socks 代理进行测试则先要安装 [proxychains](/post/2017/02/terminal-sock5-proxy.html)，然后通过

	sudo apt install proxychains4

	proxychains4 curl ip.gs

来验证已经走了代理。再通过如下命令进行测速：

	proxychains4 speedtest-cli

在输出的一大堆日志中可以查看到下载和上传的速度：

	Download: 18.65 Mbit/s
	Upload: 4.01 Mbit/s

### 对 HTTP 代理进行测速
对 HTTP 代理的测试相对要简单一些。开启 V2ray 代理，我用的 Linux 下 V2rayL 的客户端，在配置中可以看到 HTTP 的代理端口是 1081.

	export http_proxy=http://127.0.0.1:1081
	curl ip.gs
	# 确保自己的 IP 已经变成代理的 IP，然后运行
	speedtest-cli

老版本的 speedtest-cli 中对 http_proxy 支持可能有问题，确保自己的的是最新的版本：

	➜ speedtest-cli --version
	speedtest-cli 2.1.2


## 推广时刻

这里提供我测试用的一个是我以前用的 SSR 服务，一个便是新的 V2ray 的服务：

- [无界](https://portal.wallless.xyz/#/register?code=pyHxQdJr)

当然拿两者对比速度是没有意义的，服务器不同，协议也不同，只是提供一个方法让大家的选择服务商的时候能够对自己所用的服务有一个基本的了解。对于我的情况新的 [wujievpn](https://portal.wallless.xyz/#/register?code=pyHxQdJr) 几乎提供了我翻了一倍的下行速度。Download 从 18.65 Mbit/s 提高到了 34.5 Mbit/s。所以还是值得一提的。

如果有人想要尝试，欢迎使用我的邀请链接：

- <https://portal.wallless.xyz/#/register?code=pyHxQdJr>

## reference

- 感谢 @sivel 提供这么好用的命令行测速工具 [speedtest-cli](https://github.com/sivel/speedtest-cli)
