---
layout: post
title: "VPS 性能测试"
aliases: 
- VPS 性能测试
tagline: ""
description: ""
category: 经验总结
tags: [ vps, benchmark, bench, cpu, io, net-speed, cli, vps-benchmark, vps-test ]
last_updated:
---

VPS 性能测试的几个方面：

- 综合性能测试
- IO 性能测试
- 网速
- 路由

## 综合类测试
在运行这类测试脚本之前，最好先将脚本下载下来之后打开看一眼，以防止安装执行一些不可信的文件。

## IPASN AIO Benchmark by mastervnc
相较于其他 benchmark 的优势在于可以测试全球不同地区的网络延迟情况。

```
sudo curl -sL -k https://ipasn.com/bench.sh | sudo bash
```

来自：[LET](https://lowendtalk.com/discussion/180666/ipasn-2022-new-aio-benchmark-script#latest)

### bench.sh

[teddysun](https://github.com/teddysun/across/blob/master/bench.sh) 提供的综合脚本，检测 CPU，内存，负载，磁盘 IO，带宽：

	wget -qO- bench.sh | bash
    curl -Lso- bench.sh | bash


UnixBench 测试，UnixBench 跑分不一定代表真实性能，但可以提供一定参考。

	wget --no-check-certificate https://github.com/teddysun/across/raw/master/unixbench.sh
	chmod +x unixbench.sh
	./unixbench.sh

### Yet-Another-Bench-Script
[GitHub 页面](https://github.com/masonr/yet-another-bench-script)

    curl -sL yabs.sh | bash

默认情况下脚本会测试：

- 磁盘读写
- 网络带宽
- Geekbench 5 Benchmark

可以通过如下参数来禁用一些检测。

格式：

```
curl -sL yabs.sh | bash -s -- -flags
```

将其中的 `flags` 替换：

- `-f/-d` 禁用 fio 磁盘
- `-i` 禁用 iperf 网络带宽检测
- `-g` 禁用 Geekbench

比如只想检测磁盘读写：

```
curl -sL yabs.sh | bash -s -- -i -g
```


### nench
[Nench](https://github.com/n-st/nench)

    (curl -s wget.racing/nench.sh | bash; curl -s wget.racing/nench.sh | bash) 2>&1 | tee nench.log


### Superspeed.sh

全国各地测速节点的一键测速脚本 [Superspeed.sh](https://github.com/ernisn/superspeed)

使用：

    bash <(curl -Lso- https://git.io/superspeed)


### Superbench

`SuperBench.sh` 是在 bench.sh 上的增强，增加了服务器类型检测，OpenVZ, KVM ，独立服务器通电时间检测等。

该脚本需要 root 运行：

	wget -qO- https://raw.githubusercontent.com/oooldking/script/master/superbench.sh | bash
	#或者
	curl -Lso- https://raw.githubusercontent.com/oooldking/script/master/superbench.sh | bash
    
    wget -qO- git.io/superbench.sh | bash
    curl -Lso- git.io/superbench.sh | bash

### Serverreview Benchmark
[Serverreview Benchmark](https://github.com/sayem314/serverreview-benchmark):

	curl -LsO git.io/bench.sh; chmod +x bench.sh && ./bench.sh -a share

### LemonBench

~~[LemonBench](https://github.com/LemonBench/LemonBench)，是一款针对 Linux 服务器设计的服务器性能测试工具。通过综合测试，可以快速评估服务器的综合性能，为使用者提供服务器硬件配置信息。~~

### Speedtest

    curl -LsO bench.monster/speedtest.sh; bash speedtest.sh -asia


- <https://bench.monster/>


## CPU 测试
可以通过手工执行命令的方式查看 CPU 信息：

    cat /proc/cpuinfo

同理可以查看内存：

    cat /proc/meminfo
    
以及硬盘：

    fdisk -l
    df -lh


## I/O test

The speed of read and write of your hard drive.

    dd if=/dev/zero of=test bs=64k count=4k oflag=dsync
    dd if=/dev/zero of=test bs=8k count=256k conv=fdatasync


## 网速 Net speed

个人比较常用的是 speedtest-cli

	pip install speedtest-cli
	speedtest-cli


测试服务器到国内的速度，[oooldking](https://github.com/oooldking/script):

	wget -qO- https://raw.githubusercontent.com/oooldking/script/master/superspeed.sh | bash

网络连通性

	wget https://raw.githubusercontent.com/helloxz/mping/master/mping.sh && bash mping.sh

测试带宽

```text
wget https://raw.github.com/sivel/speedtest-cli/master/speedtest.py
python speedtest.py --share
```

## ping测试
全球各地 ping 测试网站：

- <https://ping.pe>

或者

    http://www.ipip.net/ping.php

```text
wget https://raw.githubusercontent.com/helloxz/mping/master/mping.sh
bash mping.sh
```

## 路由测试

脚本：

    wget -qO- https://raw.githubusercontent.com/zq/shell/master/autoBestTrace.sh | bash

一键检测VPS回程国内三网路由，root[^mtr]：

    curl https://raw.githubusercontent.com/zhucaidan/mtr_trace/main/mtr_trace.sh|bash

支持的线路为：电信CN2 GT，电信CN2 GIA，联通169，电信163，联通9929，联通4837，移动CMI

[^mtr]: <https://github.com/zhucaidan/mtr_trace>


BestTrace 工具。

```text
wget https://cdn.ipip.net/17mon/besttrace4linux.zip
unzip besttrace*
chmod +x besttrace
./besttrace -q1 202.106.196.115
```


## 在线测试工具

	http://ping.chinaz.com/

	https://www.17ce.com/

	http://www.webkaka.com/

	http://ce.cloud.360.cn/


## 独立服务器检测 VPS 通电时间
安装检查工具：

    sudo apt install -y smartmontools
    
使用 `df -h` 查看硬盘设备，然后执行：

    smartctl -A /dev/sda | grep "Power_On_Hours"
    
后面的数字即为硬盘的通电时间小时数。如果通电时间比较长，就要做好备份工作了。

一键脚本：

```
wget -q https://github.com/Aniverse/A/raw/i/a && bash a
```

## 手动测试 {#manual}

### CPU

	# cpu
	cat /proc/cpuinfo
	lscpu

### IO

```text
dd if=/dev/zero of=test bs=64k count=16k conv=fdatasync
dd if=/dev/zero of=test bs=64k count=4k oflag=dsync
```

### 网速

	# speed
	wget http://cachefly.cachefly.net/100mb.test

## 流媒体解锁脚本

### RegionRestrictionCheck

GitHub 地址：<https://github.com/lmc999/RegionRestrictionCheck>

执行命令：

```
bash <(curl -L -s https://raw.githubusercontent.com/lmc999/RegionRestrictionCheck/main/check.sh)
```


## reference

- 脚本地址：<https://github.com/teddysun/across/blob/master/bench.sh>
- <https://www.lowendtalk.com/discussion/162132/vps-benchmark-scripts>
- https://github.com/haydenjames/bench-scripts/
- [[整理合集]]