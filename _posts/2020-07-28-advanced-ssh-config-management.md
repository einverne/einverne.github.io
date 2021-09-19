---
layout: post
title: "使用 assh 来管理 SSH config"
tagline: ""
description: ""
category: 学习笔记
tags: [ssh, assh, ssh-config, ssh-manage, config-management,]
last_updated:
---

前两天一直在思考如何管理我的 SSH config 配置，最后的解决办法就是通过 git 版本管理起来。但这两天由冒出一个新的问题，那就是经常在国内直连 aws 或者 oracle 的机器时 ssh 连不上，但是通过国内的 VPS 中转就非常快，那这就意味着，我每一次连接国外的机器时必须先登录腾讯云的机器，然后在从腾讯云的机器上连过去，有些麻烦，但那天在 Twitter 上看到有人分享了一个 SSH 管理的命令行工具 `assh`，大致的看了一下[使用简介](https://github.com/moul/assh)，通过配置就可以完美的解决这个问题。

## ProxyCommand

assh 这个工具就将登录一台机器跳转 SSH 再登录另外一台机器的步骤简化了，assh 使用 lib-ssh 提供的 ProxyCommand 来实现。大部分的公司，或者注重安全的 SSH 访问都会将 SSH 的登录配置管理放到一台堡垒机或者跳板机上，然后通过跳板机再去连接真正的机器。

     +-------+       +----------+      +-----------+
     | Laptop| <---> | Jumphost | <--> | RealServer |
     +-------+       +----------+      +-----------+

比如上面的流程中，可能需要先连接 Jumphost:

    ssh -p 222 someone@Jumphost

然后在 Jumphost 上连接真正的服务器，一方面是为了安全考虑，另一方面是可以非常方便的进行权限管理和审计：

	ssh someone@RealServer

如果要简化这个步骤可以使用 SSH 的 `-J` 选项：

	ssh -J someone@Jumphost:222 someone@RealServer

或者可以使用 ProxyCommand:

	ssh -o ProxyCommand='ssh -W %h:%p -p 222 someone@Jumphost' someone@RealServer

从 OpenSSH 7.3 开始，还可以使用 `ProxyJump`，可以通过在 config 文件中配置：

	Host RealServer
	    HostName 1.2.3.4
		ProxyJump someone@Jumphost:22[, user2@Jumphost2:222]
		User someone

如果有多个 Jumphost 可以直接用逗号分隔接在后面。

上面两个方式都可以直接通过 Jumphost 来直接登录到 RealServer 上。

## SSH Config 配置

- `Host`: 定义 host, `*` 可以用来表示全局配置
- `HostName`: 定义真实的 hostname, 可以是域名或者 IP
- `User`: SSH 登录的用户名
- `IdentityFile`: 私钥路径
- `ProxyCommand`: 定义连接服务器的命令
- `LocalForward`: 通过 TCP 转发指定的本地端口到远程的端口
- `Port`: 指定连接的远程端口
- `Protocol`: 协议
- `ServerAliveInterval`: 设置没有数据后多少时间间隔超时
- `ServerAliveCountMax`: 设置服务活跃信息的数量，如果阈值达到，同时服务器活跃信息 ，服务器活跃消息 (server alive messages) 通过加密通道传输，因此不能被欺骗。The TCP keepalive 选项通过 TCPKeepAlive 是可以伪造的。服务器活跃机制在判断客户端或者服务器在不活跃时何时断开是非常有用的。默认值是 3，举一个例子，ServerAliveInterval 设置成 15，ServerAliveCountMax 保持默认，如果服务器没有回应，ssh 会在大约 45 秒后断开连接。这个选项只在 protocol 2 下有效

看一个最基本的 `assh.yml` 配置：

```
hosts:
  hosta:
    Hostname: 1.2.3.4

  hostb:
    Hostname: 5.6.7.8
    Gateways: hosta

  hostc:
    Hostname: 9.10.11.12
    Gateways: hostb

  hostd:
    Hostname: 13.14.15.16
    GatewayConnectTimeout: 2
    Gateways:
    - direct
    - hosta
```

说明：

- 配置了 hosta 直连
- hostb 则是通过 hosta 连接，ssh hostb 时会转换成 `ssh -o ProxyCommand="ssh hostb nc %h %p" hosta`
- hostc 通过 hostb 连接
- hostd 会首先尝试直连，如果失败了则回退到使用 hosta 连接

## 加速 SSH 会话

OpenSSH 可以复用存在的 TCP 连接，比如在创建了多个 SSH sessions 的时候，可以避免 TCP 创建连接带来的过度开销，修改 `vi ~/.ssh/config`:

	Host *
		ServerAliveInterval 60
		ServerAliveCountMax 30
		ControlMaster auto
		ControlPath ~/.ssh/connection-%r@%h:%p
		ControlPersist 48h

## assh
回到 [assh](https://github.com/moul/assh) 本身，assh 是用 Go 语言编写的一个命令行工具，使用 yaml 格式的配置，可以通过该配置快速生成 `~/.ssh/config` 配置，通过几行配置就可以利用 [ProxyCommand](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Proxies_and_Jump_Hosts#ProxyCommand_with_Netcat) 来进行 SSH 跳转。

### 特性
assh 非常小巧，当却很强大

- 支持正则表达式
- 支持别名 aliases -> gate.domain.tld
- 支持 includes 语法，可以将配置文件拆分到多个文件 includes: split configuration in multiple files
- 支持 SSH 连接的透明转发 gateways -> transparent ssh connection chaining
- local command execution: finally the reverse of RemoteCommand
- inheritance: make hosts inherits from host hosts or templates
- 支持继承，可以通过继承其他 hosts 或者模板来简化配置
- templates: 模板
- 通过环境变量来进行配置 variable expansion: resolve variables from the environment
- 更加灵活的 ProxyCommand, smart proxycommand 当 [netcat](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Proxies_and_Jump_Hosts#ProxyCommand_with_Netcat) 或者 socat 可用时，会替换纯 TCP 连接
- 可以进行速率控制，rate limit
- JSON output
- desktop notifications: based on events
- Graphviz representation of the hosts

### Install
如果本地安装了 Go 环境：

	go get -u moul.io/assh/v2
    
macOS 上：

    brew install assh

### Event
assh 支持一些事件，可以用来触发一些操作或者进行通知。

#### BeforeConnect
BeforeConnect 会在 assh 将要连接到远程 SSH 端口时触发。


#### OnConnect
OnConnect 会在连接到远端 SSH 端口后被调用。

#### OnConnectError
OnConnectError 会在 assh 在建立 TCP 连接失败时调用。

#### OnDisconnect
OnDisconnect 会在 assh socket 断掉后触发。

#### BeforeConfigWrite
BeforeConfigWrite 会在 assh 重写 `~/.ssh/config` 时触发。

### 基础命令

#### assh config

    # 生成 SSH 配置文件
	assh config build
	assh config build > ~/.ssh/config
	# 搜索 hosts
	assh config search <keywords>

    # 列出配置
	assh config list
	# 可视化显示
	assh config graphviz

#### assh sockets

    # 列出活跃的连接
	assh sockets list
	# create a master control sockets
	assh sockets master
	# close active control sockets
	assh sockets flush

#### assh ping

    # send packets to the SSH server
	assh ping -c 4 host

## reference

- <https://github.com/moul/assh>
- <https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Proxies_and_Jump_Hosts>
