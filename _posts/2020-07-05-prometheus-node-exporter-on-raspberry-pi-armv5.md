---
layout: post
title: "在树莓派上安装 Prometheus node-exporter"
tagline: ""
description: ""
category: 经验总结
tags: [prometheus, raspberry-pi, linux, node-expoter, monitor]
last_updated:
---


前些天正好在我的二代树莓派上安装了 [AdGuard Home](/post/2020/05/use-adguard-home-to-block-ads.html)，这样一个基础服务必然不能少了监控，所以正好把 Prometheus node-exporter 安装一下。

## Prerequisite

首先确认一下 CPU 型号，我的是二代，比较老，直接 `lscpu` 看一下就知道：

	Model name:            ARMv7 Processor rev 5 (v7l)

这是一个 armv5 版本的，然后到 node-exporter 下载二进制：

- <https://github.com/prometheus/node_exporter/releases>

注意选对版本。


## Install

	wget https://github.com/prometheus/node_exporter/releases/download/v1.0.1/node_exporter-1.0.1.linux-armv5.tar.gz

然后接着这篇[文章](/post/2020/04/prometheus-monitoring-system-and-tsdb.html) 即可。

最后验证：

	curl http://localhost:9100/metrics

添加到 Prometheus Server

	  - job_name: 'raspberry pi node exporter'
		scrape_interval: 5s
		scrape_timeout: 5s
		static_configs:
		- targets: ['192.168.2.3:9100']


之后 Grafana 添加数据源，和[之前的文章](/post/2020/05/use-prometheus-and-grafana-monitor-proxmox.html) 一样。

