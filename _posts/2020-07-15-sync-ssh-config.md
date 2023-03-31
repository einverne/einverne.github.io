---
layout: post
title: "多设备间同步 ssh 配置及密钥"
aliases:
- "多设备间同步 ssh 配置及密钥"
tagline: ""
description: ""
category: 学习笔记
tags: [ssh, config, sync, unix, linux,]
last_updated:
---

ssh 客户端会在用户目录 `~/.ssh/` 目录下存放配置信息 (`~/.ssh/config`) 和公钥和私钥，如果有多个设备不同设备间的同步和管理就会成为一个比较头疼的问题。我在 Reddit 上[抛出这个问题](https://www.reddit.com/r/MacOS/comments/hricr0/how_do_you_manage_your_ssh_key_and_configurations/) 后，我本来想的是通过 git 版本控制来进行管理，但有人说因为公钥和私钥都是二进制的文件，其实没有必要使用 git，任何一个同步工具就能够解决。

不过鉴于国内糟糕的网络环境，我还是通过 git 来管理，最后同步该私有仓库即可。主要注意的是 SSH key 是非常敏感的信息，要注意安全。

## SSH 目录的权限
用户目录下的 `~/.ssh`目录以及下面的文件需要特别小心的管理其权限，

- 整个 `~/.ssh` 目录需要设置 `700 (drwx------)` 权限
- public key 需要设置 `644(-rw-r--r--)`
- 客户端的私钥需要设置 `600 (-rw-------)`

需要保证该目录不会被其他 group 的用户读取和修改。

## SSH 配置
OpenSSH 客户端的配置文件保存在用户本地的 `~/.ssh/config` 文件中，该文件是一个文本文件。`.ssh` 目录会在用户第一次执行 ssh 命令的时候被创建。如果文件夹不存在，可以直接手动进行创建:

```shell
mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/config && chmod 600 ~/.ssh/config
```

ssh 客户端在解析配置时会按照如下顺序：

    command line options
	user-specific file, located at ~/.ssh/config
	system-wide file, /etc/ssh/ssh_config

## SSH 配置项说明

SSH Config 文件符合如下的结构:

```
Host hostname1
    SSH_OPTION value
    SSH_OPTION value

Host hostname2
    SSH_OPTION value

Host *
    SSH_OPTION value
```

SSH 客户端配置文件的内容按节（部分）组织。每个部分都以主机指令开始，包含在与远程SSH服务器建立连接时使用的特定SSH选项。

Host指令可以包含一个模式或由空格分隔的模式列表。每个模式可以包含零个或多个非空格字符或以下模式说明符之一：

- `*` 匹配零个或多个字符。例如，`Host *` 匹配所有主机，而 192.168.0.* 匹配192.168.0.0/24子网中的主机。
- `?` 匹配一个字符。模式 `Host 10.10.0.?` 匹配 `10.10.0.[0-9]` 范围内的所有主机。
- `!` 当在模式的开头使用时，否定匹配。例如，`Host 10.10.0.*!10.10.0.5` 匹配 `10.10.0.0/24` 子网中除 `10.10.0.5` 之外的任何主机。

SSH 客户端会逐行读取配置文件，并且如果出现多个匹配的配置，将优先采用第一个出现的匹配模式的选项。因此，具体的主机配置定义应该在文件的开头给出，并且通用的配置应该放在文件的末尾。

可以通过 `man ssh_config` 查看 ssh options 可配的列表。

SSH config 文件也会被 `scp`, `sftp` 和 `rsync` 这些命令读取。

## SSH Config File Example
上面已经了解了 SSH 配置的一些基本只是，现在来看看一个常见的配置例子：

	Host github.com
		HostName github.com
		PreferredAuthentications publickey
		IdentityFile ~/.ssh/id_rsa_einverne_github

这一段的配置就是当连接 GitHub 的时候直接使用配置的 publickey 去连接。

如果是 

```
ssh -p 2322 alex@dev.example.com
```

可以配置成

```
Host dev
    HostName dev.example.com
    User alex
    Port 2322
```

当添加了这一个配置之后，就可以使用 `ssh dev` 来直接连接。

## SSH config

SSH config 中可配置字段解释。


#### Host
用于我们执行 SSH 命令的时候如何匹配到该配置。

- `*`，匹配所有主机名。
- `*.example.com`，匹配以 .example.com 结尾。
- `!*.dialup.example.com`,`*.example.com`，以 ! 开头是排除的意思。
- `192.168.0.?`，匹配 `192.168.0.[0-9]` 的 IP。

#### AddKeysToAgent

是否自动将 key 加入到 ssh-agent，值可以为 no(default)/confirm/ask/yes。

如果是 yes，key 和密码都将读取文件并以加入到 agent ，就像 ssh-add。其他分别是询问、确认、不加入的意思。添加到 ssh-agent 意味着将私钥和密码交给它管理，让它来进行身份认证。

#### AddressFamily
指定连接的时候使用的地址族，值可以为 any(default)/inet(IPv4)/inet6(IPv6)。

#### BindAddress
指定连接的时候使用的本地主机地址，只在系统有多个地址的时候有用。在 UsePrivilegedPort 值为 yes 的时候无效。

#### ChallengeResponseAuthentication
是否响应支持的身份验证 chanllenge，yes(default)/no。

#### Compression
是否压缩，值可以为 no(default)/yes。

#### CompressionLevel
压缩等级，值可以为 1(fast)-9(slow)。6(default)，相当于 gzip。

#### ConnectionAttempts
退出前尝试连接的次数，值必须为整数，1(default)。

#### ConnectTimeout
连接 SSH 服务器超时时间，单位 s，默认系统 TCP 超时时间。

#### ControlMaster
是否开启单一网络共享多个 session，值可以为 no(default)/yes/ask/auto。需要和 ControlPath 配合使用，当值为 yes 时，ssh 会监听该路径下的 control socket，多个 session 会去连接该 socket，它们会尽可能的复用该网络连接而不是重新建立新的。

#### ControlPath
指定 control socket 的路径，值可以直接指定也可以用一下参数代替：

- %L 本地主机名的第一个组件
- %l 本地主机名（包括域名）
- %h 远程主机名（命令行输入）
- %n 远程原始主机名
- %p 远程主机端口
- %r 远程登录用户名
- %u 本地 ssh 正在使用的用户名
- %i 本地 ssh 正在使用 uid
- %C 值为 %l%h%p%r 的 hash

请最大限度的保持 ControlPath 的唯一。至少包含 %h，%p，%r（或者 %C）。

#### ControlPersist
结合 ControlMaster 使用，指定连接打开后后台保持的时间。值可以为 no/yes/ 整数，单位 s。如果为 no，最初的客户端关闭就关闭。如果 yes/0，无限期的，直到杀死或通过其它机制，如：ssh -O exit。

#### GatewayPorts
指定是否允许远程主机连接到本地转发端口，值可以为 no(default)/yes。默认情况，ssh 为本地回环地址绑定了端口转发器。

#### HostName
真实的主机名，默认值为命令行输入的值（允许 IP）。你也可以使用 %h，它将自动替换，只要替换后的地址是完整的就 ok。

#### IdentitiesOnly
指定 ssh 只能使用配置文件指定的 identity 和 certificate 文件或通过 ssh 命令行通过身份验证，即使 ssh-agent 或 PKCS11Provider 提供了多个 identities。值可以为 no(default)/yes。

#### IdentityFile
指定读取的认证文件路径，允许 DSA，ECDSA，Ed25519 或 RSA。值可以直接指定也可以用一下参数代替：

- %d，本地用户目录 ~
- %u，本地用户
- %l，本地主机名
- %h，远程主机名
- %r，远程用户名

#### LocalCommand
指定在连接成功后，本地主机执行的命令（单纯的本地命令）。可使用 %d，%h，%l，%n，%p，%r，%u，%C 替换部分参数。只在 PermitLocalCommand 开启的情况下有效。

#### LocalForward
指定本地主机的端口通过 ssh 转发到指定远程主机。格式：LocalForward [bind_address:]post host:hostport，支持 IPv6。

#### PasswordAuthentication
是否使用密码进行身份验证，yes(default)/no。

#### PermitLocalCommand
是否允许指定 LocalCommand，值可以为 no(default)/yes。

#### Port
指定连接远程主机的哪个端口，22(default)。

#### ProxyCommand
指定连接的服务器需要执行的命令。%h，%p，%r

如：`ProxyCommand /usr/bin/nc -X connect -x 192.0.2.0:8080 %h %p`

#### User
SSH 登录的用户名

## 疑难杂症

### sign and send pubkey signing failed
SSH 连接时发生这个错误：

	sign_and_send_pubkey: signing failed: agent refused operation
	: Permission denied (publickey).
	ssh_exchange_identification: Connection closed by remote host

大概率是 `~/.ssh/` 目录下私钥的权限不对，找到对应的私钥：

	chmod 600 ~/.ssh/id_rsa


## reference

- [配置多个 SSH Key](/post/2015/08/git-with-multi-ssh-key.html)
- [SSH 保持连接](/post/2017/05/ssh-keep-alive.html)
