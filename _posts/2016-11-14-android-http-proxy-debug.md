---
layout: post
title: "Android Http 调试及抓包"
tagline: ""
description: "Android 开发过程中遇到的Http请求及抓包问题"
category: 学习笔记
tags: [android, androiddev, proxy]
last_updated: 
---

Android 开发中可能需要对网络请求进行调试，这时刻需要对程序发出的请求进行抓包。下面记录一下之前调试使用过的工具和使用方法，以便于未来快速查询。

## Charles 
Charles 是 Mac/Linux 下非常好用的抓包工具，不仅是对 Android，而 iOS，或者其他局域网能够使用本机http代理的任何设备都能够进行抓包的操作。

> Charles实现对 Https 进行抓包，使用的原理就是中间人技术（man-in-the-middle）。Charles会动态生成一个使用自己根证书签名的证书，Charles接收web服务器的证书，而客户端浏览器/客户端 接收Charles生成的证书，以此客户端和Charles之间建立Https连接，Charles和Web服务器之间建立Https连接，实现对Https传输信息的抓包。

具体原理就是，通过 HTTP 代理，将手机的流量转到 Charles ，在通过 Charles 分析。Charles是一个抓包工具，支持抓取 HTTP、HTTPS 协议的请求。


### 优缺点

优点：

- 实时抓包
- 纯界面，简单
- 设置一次，终生受益
- 手机不需要Root

缺点：

- 授权很贵

### 配置

- 安装包

官网地址： <http://www.charlesproxy.com/>

安装完成之后需要配置

- 菜单 Proxy >  Proxy Settings， 选择端口 8888， 勾选 “ Enable transparent HTTP proxying”
- 菜单 Proxy > SSL Proxy Settings... ，选择 “Enable SSL Proxying", 然后添加，在 HOST 中填入 `*.*` ， Port 中填 443 
- 在 Help 菜单中，选择 ” SSL Proxying”，分别安装 Mac 端证书，Mobile 端证书，需要在 KeyChain 钥匙串访问中始终信任 Charles 证书，而手机端也要通过 Charles 给出的网络地址来下载证书并安装，Android 相对容易，iOS 比较麻烦。

安装完桌面证书之后，在手机端配置

- 在 WIFI 面板中，长按 WIFI，打开高级设置，然后设置 HTTP 代理
- 选择 Manual， 代理地址为，本机局域网 IP，端口 8888 


> Configure your device to use Charles as its HTTP proxy on ip:8888, then browse to chls.pro/ssl to download and install the certificate.

然后在 Charles 中就能够检测到手机上的请求，在 Charles 界面中会有对话框弹出“A connection attempt to Charles has been made from the host xx.xx.xx.xx. You should allow .... " 等等，选择允许即可，Charles 会自动分析请求参数及返回。



### 界面

左侧为所有请求列表，右侧为具体请求数据，可以点击 Request 和 Response 来查看请求和回复的数据。

## tcpdump

使用 tcpdump 工具，需要准备：

- 手机 root
- tcpdump 二进制文件 可在 <http://www.androidtcpdump.com/> 下载

### 优缺点



- 操作简单，但是需要熟悉 adb 命令
- 手机数据包完整抓取



缺点：

- 只能针对 Android 手机
- 不能实时抓取
- 电脑端需要安装 Wireshark



### 步骤

检查手机连接

    adb devices

将 tcpdump 推到 Android 设备

    adb push /path/to/tcpdump /sdcard/

进入手机，将 tcpdum 移动位置

	adb shell

    su

    mv /sdcard/tcpdump /data/local/

修改权限

    chmod 777 /data/local/tcpdump

执行抓包

    /data/local/tcpdump -i any -p -s 0 -w /sdcard/capture.pcap
    # "-i any": listen on any network interface 
    # "-p": disable promiscuous mode (doesn't work anyway) 
    # "-s 0": capture the entire packet 
    # "-w": write packets to a file (rather than printing to stdout)   ... do whatever you want to capture, then ^C to stop it ...

使用 Ctrl + C 停止，然后将 pcap 文件拉取到本地

    adb pull /sdcard/capture.pcap ~/wiresharp/

然后使用本地安装的 wiresharp 应用来分析

Linux 下可以使用

    sudo apt-get install wireshark

然后使用

    wireshark capture.pcap

图片展示

![wireshark](https://lh4.googleusercontent.com/-9GvpqunYlR0/WCl_ge954yI/AAAAAAABGJw/-TEgTxr-GTkiNKBDdCj5cUbjkchmCve8QCJoC/w758-h590-no/%25E5%25B1%258F%25E5%25B9%2595%25E6%2588%25AA%25E5%259B%25BE%2B2016-09-29%2B14.21.16.png)

更加详细的参数及使用可以参考[^1]

[^1]: <https://wladimir-tm4pda.github.io/porting/tcpdump.html>

## 其他抓包工具

可以实现抓包的方式有很多，正如上面所讲可以直接在 设备中运行 tcpdump，也可以将流量通过 HTTP 代理转到Charles 抓包，当然如果有条件甚至可以在网卡上实时抓包。

| 工具名字  |   支持平台    |      授权      | 官方地址 |
|-------------|------------------|---------------|------- |
| Fiddler  |  只支持Windows  |       | https://www.telerik.com/download/fiddler
| Charles  | Win/Mac/Linux  三大平台 |   单用户授权$50， 免费使用30天 | https://www.charlesproxy.com/download/ 
| Wireshark  |  Win/Mac/Linux |   | https://www.wireshark.org/download.html
| mitmproxy  |  Mac/Linux  命令行工具  |  free  | https://mitmproxy.org/

## reference

- <http://www.cnblogs.com/findyou/p/3491035.html>
- <https://gadgetcat.wordpress.com/2011/09/11/tcpdump-on-android/>







