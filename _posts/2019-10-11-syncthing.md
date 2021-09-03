---
layout: post
title: "Syncthing 又一款同步工具"
tagline: ""
description: ""
category: 产品体验
tags: [syncthing, sync, tools, linux, cross-platform, application, ]
last_updated:
---

昨天在整理同步工具的时候接触到了 Syncthing，简直秒杀了我现在使用的任何同步工具，所以不得不花一些篇幅来记录一下。

在看到 Syncthing 的介绍时，就非常好奇它的同步原理。也幸亏它的官方文档也有非常[详细的 QA](https://docs.syncthing.net/users/faq.html)

几个比较重要的点：

- 和 BitTorrent/Resilio Sync 的区别在于，Syncthing 开放源代码，使用开放协议，避免 Resilio Sync 闭源协议的安全问题
- Syncthing 的同步原理，和 BT 类似，会将文件分片传输，当越多设备在线，那么共享速度越快
- Syncthing 依赖于一个全局发现服务器，用来通过 Device ID 来发现设备 IP 和 端口，任何人都可以自己架设全局 Discovery 服务器，然后将自己的节点指向该服务器，这样就不必共享全局的服务器了，更甚至不需要依赖与因特网就能够实现局域网内文件同步
- 关于安全性的[说明](https://docs.syncthing.net/users/security.html) 已经列举的非常详细了，所有内容通过 TLS 加密传输

## 下载安装
下载及安装过程不再赘述，官网已经非常详细了。

- <https://syncthing.net/>

### 在 Ubuntu 下安装

- <https://apt.syncthing.net/>

### Docker 安装

使用 Linuxserver 的镜像安装：

- <https://github.com/einverne/dockerfile/tree/master/syncthing>

## 端口
Syncthing 有个端口需要注意一下

- 8384 端口是网页 GUI 监听端口，默认监听 127.0.0.1
- `tcp://0.0.0.0:22000` 服务监听地址
- `udp://0.0.0.0:21027` 本地发现服务端口

## 配置文件

在 Unix 下在 `$HOME/.config/syncthing` 下

	vi ~/.config/syncthing/config.xml

然后修改本地监听地址从 127.0.0.1 到 0.0.0.0.

## 设置 Syncthing 开机启动
如果熟悉 supervisord 可以使用官方提供的文档配置，如果在 Linux 下可以尝试使用 Systemd

	sudo systemctl enable syncthing@yourname.service
	sudo systemctl start syncthing@yourname.service

记得把 yourname 替换成用户名。

Syncthing 服务启动后端口是 8384.

## 推荐理由
推荐的理由：

- 无需额外的服务器资源，以前使用 NextCloud 的时候，有一个很不方便的便是需要保证服务器 24h 不停地在线，放在家里 NAS 如果遇到停电就很不方便
- 同步速度非常快，使用中心化的同步服务，中心服务器的网速限制了同步的速度，如果客户端越多速度越慢，但是 Syncthing 做到了点对点传输，也就意味着客户端越多那么同步速度越快，因为这一个节点的文件内容可以并行分片的从不同的节点获取
- 丰富的客户端，除了 iOS 没有官方支持，三大桌面端，Android，路由器，NAS 几乎都有支持，因为 Go 写的嘛
- Syncthing 完美的替换了 Dropbox 等等服务

## Syncthing 配置本地 Discovery 服务器
有一种情况是，加入只想要在本地局域网中传输数据，那么可以关闭全局 Discovery 服务器，然后在设置中手动指定某一态服务器的 IP 和 端口，而不是使用默认的 dynamic。这样所有的数据就会在本地传输。

## Syncthing File Versioning
Syncthing 支持文件的版本控制，当从 cluster 同步，删除或者同步一个新版本之后备份之前的老版本。

## Syncthing 使用过程中的一些问题

### 发送和接收模式 {#folder-types}
Syncthing 支持三种工作模式：[^folder]

[^folder]: <https://docs.syncthing.net/users/foldertypes.html>

- 发送和接收，Send & Receive Folder，这是文件夹的默认模式，对文件夹的修改会发送，其他设备的修改也会同步回来
- 仅发送 Send Only，这种模式表示仅仅将当前设备上的文件夹的改动发送到其他设备，用来隐式地表示其他同步设备上的文件不会被修改，或者其他设备上的修改可以被忽略。这种模式非常适合，将当前设备设定为工作设备，然后设定一台设备作为此设备的备份。
    - 在 Send Only 模式下，集群中其他设备的修改都会被忽略，修改依然会接收，文件夹可能会出现 「out of sync」，但是没有修改会被应用到本地
    - 当 Send Only 文件夹出现 out of sync，那么一个红色的 Override Changes 会出现在文件夹详情中，点击该按钮会强制将当前主机的状态同步到其他剩余节点。任何对文件的修改，都会被当前主机上的版本所覆盖，任何不存在于当前主机节点的文件都会被删除，其他类似
- 仅接收 Receive Only，这种模式下所有的修改都会被接收并应用，然后重新分发给其他使用 send-receive 模式的设备。但是本地的修改不会被分发给其他设备。这种模式适合于建立备份镜像（replication mirrors），或者备份目的主机的场景，这些情况下不期望有本地修改或者本地的修改是不允许的
    - 当本地文件被删除时，Syncthing 会显示一个 Revert Local Changes 按钮。使用这个按钮会将本地的修改回撤，所有添加的文件会被删除，修改或删除的文件会重新从其他节点同步

比较容易理解，但是假如 A 设备设置仅发送，B 设备设置发送和接收，A 是不会同步 B 的更改的！

### .stignore
忽略列表，和 `gitignore` 类似。每一台设备上的 `.stignore` 都是分别设置的，不会进行同步。

如果A的`.stignore`忽略了 `test` ，而B没有这样做，实际上会发生这样的事情：

- A 不会扫描和通知B（广播）关于test的变动；
- B 对关于test的变动持开放的姿态，但不会收到任何关于A上面test的变动信息（可能接收到其它同步设备的）；
- B 会扫描test以及推送其关于test变动的信息，但会被A忽略，A也会忽略其它同步设备关于test的信息；
- B 会接收来自其它同步设备推送的关于test的信息；

### 同步状态 {#lastest-change}
管理后台显示的最后更改（Lastest Change)是指的，根据【别人的变动】【对自己做修改】的情况和时间。或许用英语来解释稍微易懂一些， The "Latest Change" on the folder only shows incoming changes.

管理后台显示的最后扫描或者Last Scan是指对【自己的目录】最后扫描的时间。

管理后台显示的 Out Of Sync 或者**未同步**指的是「尚未接他方推送的变动」，如果已收到对方关于变动的通知，但因为下载问题或者`.stignore`的设定而未能下载这些变动，就会出现这个情况。

Override Changes

Override Changes 或者撤销变动，中文译法有些不准确。出现这个提示的原因通常是设为仅发送的一方（A，master）认为自己的资料是最新的，认为对方（B）推送的变动是应该被撤销的，即使B关于特定资料的修订时间要晚于本地；点这个按钮会强迫B对方撤销自己的变动，以其收到的A的版本为准更改资料。


### 228/SECCOMP
当我在一台比较老的机器上安装 Syncthing， systemd status 发现无法启动 Syncthing，查看日志说是：`228/SECCOMP` 错误。

这个时候需要修改 `sudo vi /lib/systemd/system/syncthing@.service`，并将其中两行注释。

```
# SystemCallArchitectures=native
# MemoryDenyWriteExecute=true
```

然后重新 `sudo systemctl daemon-reload`，并重新启动 Syncthing：

    sudo systemctl start syncthing@einverne.service


## reference

- <https://docs.syncthing.net/intro/getting-started.html>
