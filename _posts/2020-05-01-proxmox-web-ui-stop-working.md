---
layout: post
title: "Proxmox Web 界面停止工作解决"
tagline: ""
description: ""
category: [ 经验总结 , Proxmox-VE]
tags: [proxmox, virtual, linux, hostname,]
last_updated:
---

今天想把 Proxmox 的静态地址改一下的，但是重启后发现 Web UI 竟然不工作了。SSH 登录后台 `netstat -tupln` 看 8006 端口也没有起来。这一下子突然不知所措，只能一点点 Google，不过幸好问题不算太大。

在 [官方论坛](https://forum.proxmox.com/threads/web-interface-not-working-in-proxmox-3.14141/) 里翻到一个帖子，照着他的方法：

	service pve-cluster restart

运行命令后服务报错了，这就比较好办了，有报错总比抓瞎好，查看服务日志：

	journalctl -xe

然后明显的看到红字：

	May 01 20:01:22 pve systemd[1]: pve-cluster.service: Start request repeated too quickly.
	May 01 20:01:22 pve systemd[1]: pve-cluster.service: Failed with result 'exit-code'.
	-- Subject: Unit failed
	-- Defined-By: systemd
	-- Support: https://www.debian.org/support
	--
	-- The unit pve-cluster.service has entered the 'failed' state with result 'exit-code'.
	May 01 20:01:22 pve systemd[1]: Failed to start The Proxmox VE cluster filesystem.
	-- Subject: A start job for unit pve-cluster.service has failed
	-- Defined-By: systemd
	-- Support: https://www.debian.org/support

继续看帖子，发现是不是有可能是因为 hostname 没有找到对应的 ip。毕竟在我时隔一个月重启后我发现 hostname 被修改成了 ubuntu2，而我之前明明是 pve 来着。于是顺藤摸瓜看看

	vi /etc/hostnames
	vi /etc/hosts

果然发现 hostnames 被改了，于是改回 `pve`，然后查看 `/etc/hosts` 里面的内容的时候，顶部几个注释引起了我的关注

```
# Your system has configured 'manage_etc_hosts' as True.
# As a result, if you wish for changes to this file to persist
# then you will need to either
# a.) make changes to the master file in /etc/cloud/templates/hosts.debian.tmpl
# b.) change or remove the value of 'manage_etc_hosts' in
#     /etc/cloud/cloud.cfg or cloud-config from user-data
```

我突然想起来之前安装过 cloud-init ，然后照着注释的内容在对应的文件里面把 hostname 和 IP 填了进去。然后重启问题就解决了。

