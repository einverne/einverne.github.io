---
layout: post
title: "Ubuntu 下启用 SFTP 服务"
aliases: 
- Ubuntu 下启用 SFTP 服务
tagline: ""
description: ""
category: 经验总结
tags: [ sftp, ubuntu, linux, ssh, file, backup, ]
last_updated:
---

[[SFTP]] 全名为 SSH File Transfer Protocol，是一种通过 SSH（Secure Shell）协议进行文件传输的网路协议。它提供了一种安全的方式来传输文件，因为所有传输的数据都会被加密，这可以防止数据在传输过程中被拦截和阅读。 SFTP 不仅可以进行文件传输，还可以进行远程文件管理，例如创建和删除远程目录，移动和重命名远程文件等。这使得 SFTP 成为一种非常强大的工具，尤其是对于需要远程管理文件的开发者来说。

在互联网的早期人们都使用 FTP 来传输文件，FTP 是 File Transfer Protocol 文件传输协议的缩写，这是一个非常流行的文件传输协议。但因为 FTP 在传输过程中不是安全的，只能用于可信网络，所以就需要一个基于安全可靠连接的文件传输协议，这就是 SFTP（Secure File Transfer Protocol）。

SFTP 扩展了 SSH 协议，提供了安全的文件传输能力，提供了文件存取、传输和管理功能。

因为是基于 SSH 协议的，所以首先需要依赖 `openssh-server`。

```
sudo apt install openssh-server
sudo apt install ssh
sudo vi /etc/ssh/sshd_config
```

文件末尾增加：

```
Match group sftp
ChrootDirectory /home
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
PermitTunnel no
ForceCommand internal-sftp
```

然后重新加载配置：

```
sudo service ssh restart
```

创建 `sftp` 用户组：

```
sudo addgroup sftp
```

创建用户并将用户添加到用户组：

```
sudo useradd -m sftpuser -g sftp
```

修改密码：

```
sudo passwd sftpuser
sudo chmod 700 /home/sftpuser/
```

连接

```
sftp sftpuser@localhost
```

如果遇到错误

```
Connection closed
```

可以通过如下的方式查询错误日志

```
grep -i sftp /var/log/*
```

或者执行

```
sftp -vvv sftpuser@localhost
```
