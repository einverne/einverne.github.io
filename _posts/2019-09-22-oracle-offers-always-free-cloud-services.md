---
layout: post
title: "Oracle 提供免费的云服务"
tagline: ""
description: ""
category: 经验总结
tags: [linux, oracle, gcp, cloud, vps, server, ]
last_updated:
---

前两天在 Twitter 上看到有人分享新闻说，Oracle 发布了新的云服务政策，提供 Always Free 的主机和对象存储还是数据库，所以就看了一下，搜了一下新闻，还真的有 [Oracle Offers Always Free Autonomous Database and Cloud Infrastructure](https://www.oracle.com/corporate/pressrelease/oow19-oracle-free-tier-091619.html)，所以就注册一下。但是当天晚上创建 VM 的时候提示我 "out of host capacity"，Google 了一下才发现，原来这条消息早就在羊毛党炸锅了，不亚于 Google Cloud Platform 当年的新闻。不过我个人作为学习使用，并没有违背 Oracle 的政策。所以我就等着 Oracle 解决 "out of host capacity" 的问题。于是等到周末，突然想起这件事情，就登录账号是了一下，确实可以创建了。

这里再整理一下 Oracle 提供的服务内容，根据它官方的[博文](https://www.oracle.com/corporate/pressrelease/oow19-oracle-free-tier-091619.html)，Oracle 提供的服务没有像其他云服务提供商一样提供 12 个月的免费体验，而是对于基础服务，比如 Compute VMs, Database, Block and Object Storage, and Load Balancer, 等等只要在用，不超过限额，那么就在账号有效期内免费使用。

这里引用 Oracle 官方的文章：

> The new program enables developers to build applications using any language and framework on top of Oracle Cloud Infrastructure and Autonomous Database. They can get started quickly without waiting for IT to provision and learn new technologies such as artificial intelligence and machine learning. Enterprises can use Free Tier to prototype, prove out new technologies, and do testing before moving production workloads to the cloud. They can sample robust enterprise infrastructure capabilities like load balancing and storage cloning. Additionally, students can learn how to use the latest technologies and become better prepared for their careers.
>
Oracle 提供的免费服务包括两个部分：

- Always Free services, which provide access to Oracle Cloud services for an unlimited time
- Free Trial, which provides $300 in credits for 30 days to try additional services and larger shapes
而 Always Free 项目涵盖了开发，测试应用必要的各种服务，包括 Oracle Autonomous Database, Compute VMs, Block Volumes, Object and Archive Storage, and Load Balancer 等等。具体来说：

- 2 Autonomous Databases (Autonomous Data Warehouse or Autonomous Transaction Processing), each with 1 OCPU and 20 GB storage
- 2 Compute VMs, each with 1/8 OCPU and 1 GB memory
- 2 Block Volumes, 100 GB total, with up to 5 free backups
- 10 GB Object Storage, 10 GB Archive Storage, and 50,000/month API requests
- 1 Load Balancer, 10 Mbps bandwidth
- 10 TB/month Outbound Data Transfer
- 500 million ingestion Datapoints and 1 billion Datapoints for Monitoring Service
- 1 million Notification delivery options per month and 1000 emails per month

这里可以看到提供的主机是 1/8 OCPU，什么是 OCPU ? 官方的解释是：OCPU 定义为等同于启用了超线程的 Intel Xeon 处理器一个物理核心的 CPU 容量或者等同于 Orcale SPARC 的一个物理核心。[^q] 对于 Intel Xeon 处理器，每个 OCPU 对应于两个硬件执行线程 ( vCPU )。[^q1]

[^q]: <https://cloud.oracle.com/compute-classic/faq>
[^q1]: <https://www.industry-era.com/Cloud-Services-Pricing.php>

AWS, Microsoft 和 Google 提供的云服务都是以 vCPU 作为计算单元，每一个 vCPU 都表示 Intel Xeon 核心的的一个超线程。一个标准的 Intel 核心如果开启了超线程，有两个线程。

### Compute
计算实例配置：

	Shape: VM.Standard.E2.1.Micro
	Processor: 1/8th of an OCPU with the ability to use additional CPU resources
	Memory: 1 GB
	Networking: Includes one VNIC with one public IP address and up to 480 Mbps network bandwidth
	Operating System: Your choice of one of the following Always Free-eligible operating systems:
	Oracle Linux
	Canonical Ubuntu Linux
	CentOS Linux

### Block Volume
存储

	100 GB total of combined boot volume and block volume Always Free Block Volume storage.

	Five total volume backups (boot volume and block volume combined).

### Object Storage
免费账户：

	20 GiB of combined Object Storage and Archive Storage
	50,000 Object Storage API requests per month

付费账户：

	10 GiB of Object Storage
	10 GiB of Archive Storage
	50,000 Object Storage API requests per month

## Server


网站登录地址：

- <https://cloud.oracle.com/sign-in>

韩国区域后台管理地址：

- <https://console.ap-seoul-1.oraclecloud.com>



## Server Config

Check this [post](/post/2015/12/things-to-do-after-buying-vps.html)

	ubuntu@instance: $ sudo su - root
	root@instance: # passwd # set password of root user
	adduser yourname
	apt install vim
	update-alternatives --config editor   # choose vim
	visudo # add  yourname ALL=(ALL:ALL) NOPASSWD:ALL
	vi /etc/ssh/sshd_config # AllowUsers yourname
	/etc/init.d/ssh reload
	# copy ssh pub to ~/.ssh/authorized_keys

then

	ssh -p 22 yourname@ip

另外我个人建议可以登陆后修改一下默认的 SSH 端口。

## 防火墙设置
实例管理页面，Virtual Cloud Network Details，Security Lists, 在防火墙安全策略里面将需要的端口配上。

另外需要特别注意需要登录机器配置实例上的防火墙。

	sudo iptables -P INPUT ACCEPT
	sudo iptables -P FORWARD ACCEPT
	sudo iptables -P OUTPUT ACCEPT
	sudo iptables -F

## 卸载停止不需要的服务

	sudo systemctl stop rpcbind.socket
	sudo systemctl disable rpcbind.socket

卸载 Oracle 后台监控

	sudo systemctl stop snap.oracle-cloud-agent.oracle-cloud-agent.service
	sudo systemctl disable snap.oracle-cloud-agent.oracle-cloud-agent.service

## QA
新开的实例，我一般都会直接修改其 ssh 登录端口，而这台机器白天开了之后设置了 sshd 端口，并且 reload 了 sshd 设置，晚上回到家后发现

	connect to host port xxx:xxx No route to host

这个时候我想着要不就是端口没有生效，要不就是防火墙问题，所以通过 Oracle 后台远程登录的方式进入到机器上，先关了防火墙，然后去控制后台配置了端口，然后再连接即可。

## reference

- <https://docs.cloud.oracle.com/iaas/Content/FreeTier/freetier.htm>
