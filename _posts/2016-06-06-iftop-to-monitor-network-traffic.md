---
layout: post
title: "每天学习一个命令：iftop 流量监控"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, iftop, network, monitor]
last_updated:
---

在类 Unix 系统中可以使用 top/htop 查看系统资源、进程、内存占用等信息。查看网络状态可以使用 `netstat`、`nmap` 等工具。若要查看实时的网络流量，监控 TCP/IP 连接等，则可以使用 iftop。

`iftop` 是类似于 top 的实时流量监控工具。

官方网站：<http://www.ex-parrot.com/~pdw/iftop/>

`iftop` 可以用来监控网卡的实时流量（可以指定网段）、反向解析 IP、显示端口信息等。

## 安装

    apt-get install iftop

或者使用源码编译安装

Debian 上安装所需依赖包：

    apt-get install flex byacc  libpcap0.8 libncurses5

下载 `iftop`

    wget http://www.ex-parrot.com/pdw/iftop/download/iftop-0.17.tar.gz

    tar zxvf iftop-0.17.tar.gz
    cd iftop-0.17
    ./configure
    make && make install

常用的参数：

    -i      设定监测的网卡，如：# iftop -i eth1
    -B      以 bytes 为单位显示流量（默认是 bits)，如：# iftop -B
    -n      使 host 信息默认直接都显示 IP，如：# iftop -n
    -N      使端口信息默认直接都显示端口号，如：# iftop -N
    -F      显示特定网段的进出流量，如# iftop -F 10.10.1.0/24 或# iftop -F 10.10.1.0/255.255.255.0
    -h（display this message），帮助，显示参数信息
    -p      使用这个参数后，中间的列表显示的本地主机信息，出现了本机以外的 IP 信息；
    -b      使流量图形条默认就显示；
    -f      这个暂时还不太会用，过滤计算包用的；
    -P      使 host 信息及端口信息默认就都显示；
    -m      设置界面最上边的刻度的最大值，刻度分五个大段显示，例：# iftop -m 100M

交互快捷键，进入 `iftop` 画面后的一些操作命令（注意大小写）

    按 h 切换是否显示帮助；
    按 n 切换显示本机的 IP 或主机名；
    按 s 切换是否显示本机的 host 信息；
    按 d 切换是否显示远端目标主机的 host 信息；
    按 t 切换显示格式为 2 行 /1 行 / 只显示发送流量 / 只显示接收流量；
    按 N 切换显示端口号或端口服务名称；
    按 S 切换是否显示本机的端口信息；
    按 D 切换是否显示远端目标主机的端口信息；
    按 p 切换是否显示端口信息；
    按 P 切换暂停 / 继续显示；
    按 b 切换是否显示平均流量图形条；
    按 B 切换计算 2 秒或 10 秒或 40 秒内的平均流量；
    按 T 切换是否显示每个连接的总流量；
    按 l 打开屏幕过滤功能，输入要过滤的字符，比如 ip, 按回车后，屏幕就只显示这个 IP 相关的流量信息；
    按 L 切换显示画面上边的刻度；刻度不同，流量图形条会有变化；
    按 j 或按 k 可以向上或向下滚动屏幕显示的连接记录；
    按 1 或 2 或 3 可以根据右侧显示的三列流量数据进行排序；
    按 `<` 根据左边的本机名或 IP 排序；
    按 `>` 根据远端目标主机的主机名或 IP 排序；
    按 o 切换是否固定只显示当前的连接；
    按 f 可以编辑过滤代码
    按！可以使用 shell 命令
    按 q 退出监控。

## 使用实例

直接运行：

    sudo iftop

界面上面显示的是类似刻度尺的刻度范围，为显示流量图形的长条作标尺用的。

中间的`<= =>`这两个左右箭头，表示的是流量的方向。需要注意的是默认情况下显示的单位是 bit/s

- TX：发送流量 Transmit
- RX：接收流量 Receive
- TOTAL：总流量
- Cum：运行 `iftop` 到目前时间的总流量
- peak：流量峰值
- rates：分别表示过去 2s 10s 40s 的平均流量

### 监控指定网卡
先使用 `ifconfig` 查看当前机器网卡，然后使用 `-i` 参数

    iftop -i eth0

### 以 MB 显示流量
为了可读性，可以使用 `-B` 来以 `MB` mega byte 字节来显示流量：

    sudo iftop -B

## reference

- <https://www.vpser.net/manage/iftop.html>
