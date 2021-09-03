---
layout: post
title: "VPS 安全设置"
tagline: ""
description: ""
category: 经验总结
tags: [linux, vps, server, ssh ,config, scan]
last_updated:
---

以前也写过一篇文章叫做[购买 VPS 之后需要做的事情](/post/2015/12/things-to-do-after-buying-vps.html) 其中也提到了一些安全设置来确保 VPS 的安全性，但是那篇文章更多的集中于设置和配置。那这篇文章就集中总结归纳一下需要特别注意的安全问题。

## 保持系统更新
经常检查系统更新，尤其是出现重大安全问题时一定更新到最新的系统，以 Debian/Ubuntu/LinuxMint 为例

    apt-get update
    apt-get upgrade

## SSH 端口和登录
SSH 默认使用 22 端口，我们和 VPS 打交道用的最多的就是这一个端口，修改 `/etc/ssh/sshd_config` 中 `Port` 的设置，修改为其他端口，然后使用

    ssh -p <the port you set> name@server.ip

来指定端口访问，虽然修改为非默认端口也避免不了被扫描出来，但概率要稍微低一点。

推荐使用公钥、私钥来登录 VPS，在本机 `ssh-copy-id name@server.ip` 将本地公钥[拷贝](/post/2016/06/ssh-copy-id.html) 到远程 `~/.ssh/authorized_keys` 文件中

## 禁止 root 账户 SSH 登录
限制 root 账户登录 SSH 同理，修改 `/etc/ssh/sshd_config` 将 `PermitRootLogin` 值改为 no。注意之前先[新建可用账户](/post/2015/12/things-to-do-after-buying-vps.html)，然后再禁用 root 登录。

    adduser [nickname_you_want]
    adduser [nickname_you_want] sudo        # 或者 visudo

## 禁止密码登录
通过上面的命令生成公私钥之后，可以取消密码登录，编辑 `/etc/ssh/sshd_config` 然后修改：

    PasswordAuthentication no

然后重启 ssh 服务：

    sudo /etc/init.d/ssh restart

## 开启登录失败次数
在 `/etc/ssh/sshd_config` 中增加：

    MaxAuthTries 6

然后重启 ssh。

## 禁用 ping
不响应 ping，修改 `/proc/sys/net/ipv4/icmp_echo_ignore_all` 文件，0 为允许，1 为禁止

    # 禁止 ping
    echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
    # 允许 ping
    echo 0 > /proc/sys/net/ipv4/icmp_echo_ignore_all

## 限制账号多重登录
编辑 `/etc/security/limits.conf` 添加配置：

    *               hard    maxlogins       2

## 安装 fail2ban
Fail2ban 是一个能够保护 SSH 等常用端口暴力破解的工具

    sudo apt install fail2ban

项目的配置地址在 `/etc/fail2ban/` 目录下。

- fail2ban.conf 文件是 fail2ban 软件配置，包括日志级别，日志位置，PID 等等
- jail.conf 则是关于功能配置，包括默认禁止登录时间，允许重复登录次数，白名单，邮件等等

其中可以找到一个 `jail.conf` 的配置文件，该文件可能在升级时被覆盖，所以可以拷贝一份 `cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local` 来编辑 local 文件，fail2ban 配置文件优先级：

- /etc/fail2ban/jail.conf
- /etc/fail2ban/jail.d/*.conf，按字母顺序排列
- /etc/fail2ban/jail.local
- /etc/fail2ban/jail.d/*.local，按字母顺序排列

编辑 `/etc/fail2ban/jail.local`

    [DEFAULT]
    # "ignoreip" can be an IP address, a CIDR mask or a DNS host. Fail2ban will not
    # ban a host which matches an address in this list. Several addresses can be
    # defined using space separator.
    ignoreip = 127.0.0.1/8 123.45.67.89

    # "bantime" is the number of seconds that a host is banned.
    bantime  = 31536000            ; 1 year

    # A host is banned if it has generated "maxretry" during the last "findtime"
    # seconds.
    findtime = 600
    maxretry = 3

更多的配置可以参考[这篇文章](https://linode.com/docs/security/using-fail2ban-for-security/)

fail2ban 的日志可以在 `/var/log/fail2ban.log` 查看。

## 如何查看日志
当你发现服务器有异常请求时，如何查看服务器用户登录日志。首先查看当前服务器登录的用户

    w

使用该命令可以查看当前连接在线的用户，然后使用

    last

来查看过去一段时间的登录用户，包括登录用户名，登录 IP，登录时间，时长等等。如果发现异常等级即使处理。

然后检查 `sudo less /var/log/auth.log` 文件查看登录日志。


## reference

- <https://www.linode.com/docs/security/securing-your-server/>
