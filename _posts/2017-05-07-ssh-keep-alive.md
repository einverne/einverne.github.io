---
layout: post
title: "保持 SSH 连接"
tagline: ""
description: ""
category: 经验总结
tags: [ssh, linux, git, github, gitlab, ]
last_updated:
---

记录一些 SSH 相关的内容，经常使用。

SSH 是 Secure Shell 的缩写，是一个应用层的加密网络协议，它不只可以用于远程登录，远程命令执行，还可用于数据传输。
当然它由 ssh Client 和 ssh Server 端组成，有很多实现，Ubuntu 上就默认安装的 OpenSSH, Client 端叫做 ssh, Server 端叫做 sshd.   OpenSSH 只用来做远程登录和命令执行。

## 免密登录
查看本地 `~/.ssh/` 目录是否有 `id_rsa.pub`，如果没有，在本地创建公钥

	ssh-keygen -t rsa

一路回车到底

然后把本地公钥复制到远程机器的 `~/.ssh/` 目录下，并命名为 `authorized_keys`

	scp ~/.ssh/id_rsa.pub username@hostname:~/.ssh/authorized_keys
	# or
	ssh-copy-id -i ~/.ssh/id_rsa.pub username@hostname

如果远程主机配置了多台机器免密登录，最好将 `id_ras.pub` 追加而不是覆盖到 `authorized_keys`

	cat id_rsa.pub >> .ssh/authorized_keys

## 保持连接

### 配置服务端
SSH 总是被强行中断，导致效率低下，可以在服务端配置，让 server 每隔 30 秒向 client 发送一个 keep-alive 包来保持连接：

	vim /etc/ssh/sshd_config

添加

	ClientAliveInterval 30
	ClientAliveCountMax 60

第二行配置表示如果发送 keep-alive 包数量达到 60 次，客户端依然没有反应，则服务端 sshd 断开连接。如果什么都不操作，该配置可以让连接保持 30s*60 ， 30 min

重启本地 ssh

	sudo service ssh restart

如果找不到 ssh,"Failed to restart ssh.service: Unit ssh.service not found." ，需要安装

	sudo apt-get install openssh-server


### 配置客户端
如果服务端没有权限配置，或者无法配置，可以配置客户端 ssh，使客户端发起的所有会话都保持连接：

	vim /etc/ssh/ssh_config

添加

	ServerAliveInterval 30
	ServerAliveCountMax 60

本地 ssh 每隔 30s 向 server 端 sshd 发送 keep-alive 包，如果发送 60 次，server 无回应断开连接。

下面是 `man ssh_config` 的内容

ServerAliveCountMax
Sets the number of server alive messages (see below) which may be sent without ssh(1) receiving any messages back from the server. If this threshold is reached while server alive messages are being sent, ssh will disconnect from the server, terminating the session. It is important to note that the use of server alive messages is very different from TCPKeepAlive (below). The server alive messages are sent through the encrypted channel and therefore will not be spoofable. The TCP keepalive option enabled by TCPKeepAlive is spoofable. The server alive mechanism is valuable when the client or server depend on knowing when a connection has become inactive.

The default value is 3. If, for example, ServerAliveInterval (see below) is set to 15 and ServerAliveCountMax is left at the default, if the server becomes unresponsive, ssh will disconnect after approximately 45 seconds. This option applies to protocol version 2 only; in protocol version 1 there is no mechanism to request a response from the server to the server alive messages, so disconnection is the responsibility of the TCP stack.

ServerAliveInterval
Sets a timeout interval in seconds after which if no data has been received from the server, ssh(1) will send a message through the encrypted channel to request a response from the server. The default is 0, indicating that these messages will not be sent to the server, or 300 if the BatchMode option is set. This option applies to protocol version 2 only. ProtocolKeepAlives and SetupTimeOut are Debian-specific compatibility aliases for this option.

## 共享 SSH 连接
如果需要在多个窗口中打开同一个服务器连接，可以尝试添加 `~/.ssh/config`，添加两行

    ControlMaster auto
    ControlPath ~/.ssh/connection-%r@%h:%p

配置之后，第二条连接共享第一次建立的连接，加快速度。

添加长连接配置

	ControlPersist 4h

每次 SSH 连接建立之后，此条连接会被保持 4 小时，退出服务器之后依然可以重用。

配置连接中转

    ForwardAgent yes

当需要从一台服务器连接另外一个服务器，而在两台服务器中传输数据时，可以不用通过本地电脑中转，直接配置以上 ForwardAgent 即可。

最终， `~/.ssh/config` 下的配置：

	Host *
		ForwardAgent yes
		ServerAliveInterval 3
		ServerAliveCountMax 20
		TCPKeepAlive no
		ControlMaster auto
		ControlPath ~/.ssh/connection-%r@%h:%p
		ControlPersist 4h
		Compression yes

## 同一台机器配置多个 key

之前写过一篇文章总结，在同一台机器上同时使用 GitHub，和 GitLab 的 key，可以具体参考[这里](/post/2015/08/git-with-multi-ssh-key.html)


