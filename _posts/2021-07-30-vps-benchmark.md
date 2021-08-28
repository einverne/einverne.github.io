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

### bench.sh

[teddysun](https://github.com/teddysun/across/blob/master/bench.sh) 提供的综合脚本，检测 CPU，内存，负载，IO，带宽：

	wget -qO- bench.sh | bash
    curl -Lso- bench.sh | bash


unixbench 测试，UnixBench 跑分不一定代表真实性能，但可以提供一定参考。

	wget --no-check-certificate https://github.com/teddysun/across/raw/master/unixbench.sh
	chmod +x unixbench.sh
	./unixbench.sh


### nench
[Nench](https://github.com/n-st/nench)

    (curl -s wget.racing/nench.sh | bash; curl -s wget.racing/nench.sh | bash) 2>&1 | tee nench.log


### Superspeed.sh

全国各地测速节点的一键测速脚本 [Superspeed.sh](https://github.com/ernisn/superspeed)

使用：

    bash <(curl -Lso- https://git.io/superspeed)


### Yet-Another-Bench-Script
[GitHub 页面](https://github.com/masonr/yet-another-bench-script)

    curl -sL yabs.sh | bash



### Superbench

`SuperBench.sh` 增强版，增加服务器类型检测，openvz, kvm 等。

	wget -qO- https://raw.githubusercontent.com/oooldking/script/master/superbench.sh | bash
	#或者
	curl -Lso- https://raw.githubusercontent.com/oooldking/script/master/superbench.sh | bash

### Serverreview Benchmark
[Serverreview Benchmark](https://github.com/sayem314/serverreview-benchmark):

	curl -LsO git.io/bench.sh; chmod +x bench.sh && ./bench.sh -a share

### LemonBench

[LemonBench](https://github.com/LemonBench/LemonBench)，是一款针对 Linux 服务器设计的服务器性能测试工具。通过综合测试，可以快速评估服务器的综合性能，为使用者提供服务器硬件配置信息。

### Speedtest

- <https://bench.monster/>


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

    http://www.ipip.net/ping.php

```text
wget https://raw.githubusercontent.com/helloxz/mping/master/mping.sh
bash mping.sh
```

## 路由测试

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


## reference

- 脚本地址：<https://github.com/teddysun/across/blob/master/bench.sh>
- <https://www.lowendtalk.com/discussion/162132/vps-benchmark-scripts>
- https://github.com/haydenjames/bench-scripts/
- [[整理合集]]