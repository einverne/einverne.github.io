---
layout: post
title: "Linux 服务器控制面板 Hestia 使用"
aliases:
- "Linux 服务器控制面板 Hestia 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ linux, control-panel, hestia, web-server, mail-server, dns, aapanel, ]
create_time: 2022-07-08 09:37:34
last_updated: 2022-07-08 09:37:34
---

Hestia 是一个开源的 Linux 服务器控制面板，HestiaCP fork 自另一款流行的控制面板 [VestaCP](https://vestacp.com/) 。由于 VestaCP 开发和维护趋于停止，很多安全问题和漏洞没有及时修复，所以有人从 VestaCP 拉出新分支进行开发和维护。

HestiaCP 提供了一个简单干净的网页界面，给网站维护人员提供了更加简单的方式维护网页服务器。HestiaCP 提供了很多功能，包括管理部署网站(Nginx, Apache，PHP)，数据库（MySQL,PostgreSQL）, FTP（[[ProFTPd]], [[vsftpd]]），DNS zones（Bind），邮件服务器（[[Dovecot]], [[exim4]]）,垃圾邮件扫描（[[SpamAssassin Score]]），邮件病毒扫描（[[ClamAV]]）等等。

HestiaCP 还提供了基于命令行的管理工具，具体可以见 [文档](https://docs.hestiacp.com/cli_commands.html)

另一个值得一说的功能就是，HestiaCP 提供了一键安装网站（Quick Install App）的功能，默认提供了一些非常受欢迎的网页应用，包括 [[WordPress]], [[Drupal]], [[Joomla]], [[Opencart]], [[PrestaShop]], [[Lavarvel]], [[Symfony]]。

在接触 Hestia 之前，有段时间直接使用 LNMP，或者使用 [[aapanel]]，但后来发现 aaPanel 的 License 或许存在某些问题，并且在读了 [Stallman](/post/2022/06/free-as-in-freedom.html) 的 [著作](/post/2022/05/free-software-free-society.html) 之后对自由软件的认识更深刻了一些，所以直接替换成 GPL 发布的 Hestia。作为 aaPanel 的开源代替品，发现 Hestia 还是非常不错的。

- 官网：<https://hestiacp.com/>
- GitHub: <https://github.com/hestiacp/hestiacp>

后台演示：

![hestia control panel](https://photo.einverne.info/images/2022/04/30/dnaw.png)

## Features

- Apache2, Nginx, PHP-FPM
- 多 PHP 版本
- 集群功能的 DNS 服务器
- POP/IMAP/SMTP 邮件服务器，带反垃圾邮件，病毒扫描
- 支持 MariaDB 和 PostgreSQL 数据库
- 自带 [[fail2ban]] 和防火墙

## Prerequisites

- 一台运行 Debian 或 Ubuntu 的服务器或 VPS，推荐使用一个全新安装的系统，避免可能出现的任何问题
- root 权限，或者使用 `sudo`

## Installation
本文中演示在 Ubuntu 20.04 上安装 HestiaCP。整个过程可能会需要 15 分钟左右。

安装脚本：

```
wget https://raw.githubusercontent.com/hestiacp/hestiacp/release/install/hst-install.sh
bash hst-install.sh
```

可以通过 [安装器](https://gabizz.github.io/hestiacp-scriptline-generator/) 自己选择安装的组件。选择组件之后会产生一个命令：

```
wget https://raw.githubusercontent.com/hestiacp/hestiacp/release/install/hst-install.sh
sudo bash hst-install.sh --apache no --phpfpm yes --multiphp no --vsftpd yes --proftpd no --named yes --mysql yes --postgresql no --exim yes --dovecot yes --sieve no --clamav no --spamassassin no --iptables yes --fail2ban yes --quota no --api yes --interactive yes --with-debs no  --port '8083' --hostname 'your_hostname' --email 'i@youremail.com' --password 'your_password' --lang 'en'
```

你可以根据自己的需要自行选择需要的组件。可以在官网 [文档](https://docs.hestiacp.com/getting_started.html) 中查看默认会安装的组件。

安装完成之后会在日志中看到后台登录的链接，已经默认的用户名和密码。安装完成后可能会需要一次重启来完成安装。

访问 `https://ip:8083` ，或者如果已经配置了域名 A 记录指向该 IP，也可以使用域名加端口来访问。

### netplan 错误
安装过程中如果遇到：

```
[ * ] Installing dependencies...
!!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!!                                             
WARNING: Your network configuration may not be set up correctly.
Details: The netplan configuration directory is empty.
You may have a network configuration file that was created using                                                systemd-networkd.

It is strongly recommended to migrate to netplan, which is now the
default network configuration system in newer releases of Ubuntu.

While you can leave your configuration as-is, please note that you
will not be able to use additional IPs properly.

If you wish to continue and force the installation,
run this script with -f option:
Example: bash hst-install-ubuntu.sh --force

!!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!!
Error: Unable to detect netplan configuration.
```

是因为 Ubuntu 没有使用 netplan，或者 VPS 主机提供的镜像没有使用 netplan，但是 `/etc/netplan` 文件夹存在，这就导致 HestiaCP 安装脚本执行过程中判断错误。

解决方案：查看 `/etc/netplan` 文件夹，如果配置文件夹是空的，那么可以直接删除该文件夹，如果确定自己已经使用了 netplan 作为网络配置，那么检查一下网络配置。

## Usage

### 申请 Let's Encrypt SSL 证书
在完成安装访问后台的时候，浏览器会报 Your connection is not private 的错误，这是因为 SSL 证书缺失了。

可以使用 `v-add-letsencrypt-host` 命令来圣晴证书。

不过我在执行的过程中发生一些问题，报错：

```
Error: Let's Encrypt validation status 400 (xxx.einverne.info). Details: Unable to update challenge :: authorization must be pending
Error: Let's Encrypt SSL creation failed
```

查看发现因为在机器上安装了 Docker，所以虚拟了一个网络端口，在后台 Web 查看域名的时候，看到其中关联的 IP 地址是一个本地的地址 `172.17.0.1`，把这个地址修改成 VPS 的真实 IP 地址。然后重新执行命令即可。

如果出现其他的错误，也可以到如下的目录中查看日志：

```
/var/log/hestia/LE-user-domain-timestamp
```

### Create a new user
虽然以 `admin` 登录可以在后台做任何事情，但是还是推荐创建一个新用户，以新用户的身份来操作。

### 添加域名
创建完用户之后以该用户登录，然后在 Web 中，选择添加域名。

添加的过程中有如下配置：

- Domain：需要添加的域名
- IP Address: IP 地址，如果服务器有多个 IP 这里也会显示出来
- Create DNS zone: 如果想要 HestiaCP 来管理 [[DNS zone]] 可以配置
- Enable mail for this domain: 如果要使用该域名来发送邮件可以配置该选项

在高级选项中：

- Aliases: 默认你需要配置 `www.yourdomain.com` 指向你的域名
- Proxy Support: HestiaCP 默认使用 Nginx 来代理静态文件
- Web Statistics: 是否开启数据记录，默认未开启，但是 HestiaCP 自带了强大的 `AWStats`，可以到其 [官网](https://awstats.sourceforge.io/) 查看
- Custom document root: 默认是 `/home/your_user/web/your_website/public_html/`
- Enable SSL for this domain: 开启 SSL
- Additional FTP Accounts: 是否创建 FTP 账号

## Tips

### 修改面板的端口
默认情况下 HestiaCP 使用 8083 端口，当然在安装的时候也可以指定，但是如果安装完成之后想要调整端口，可以使用如下的命令：

```
v-change-sys-port 2083
```

### 强制主机 SSL
强制主机名使用 SSL

```
v-add-letsencrypt-host
v-add-web-domain-ssl-hsts 'admin' 'hcp.domain.com'
v.add-web-domain-ssl-force 'admin' 'hcp.domain.com'
```

### 删除不需要的主机方案

```
rm -fr /usr/local/hestia/install/rhel
rm -fr /usr/local/hestia/install/ubuntu
rm -fr /usr/local/hestia/install/debian/7
rm -fr /usr/local/hestia/install/debian/8
rm -fr /usr/local/hestia/install/debian/9
```

### 开放端口

```
touch /etc/iptables.up.rules
v-add-firewall-rule ACCEPT 0.0.0.0/0 22 TCP SSH
v-add-firewall-rule ACCEPT 0.0.0.0/0 5566 TCP HestiaCP
```

### 使用命令行工具

```
source /etc/profile
PATH=$PATH:/usr/local/hestia/bin && export PATH
```

### 修改控制面板的 IP
可以使用命令行：

```
v-update-sys-ip 1.2.3.4
v-rebuild-web-domains admin
v-rebuild-mail-domains admin
```

## HestiaCP vs VestaCP
HestiaCP 是 VestaCP fork，VestaCP 开发和维护趋于停止，存在许多漏洞和安全性问题。VestaCP 是第一个 Nginx 的 GUI 控制面板。在 VestaCP 之前有很多 CLI-only 的管理工具。

- HestiaCP 支持 Debian 和 Ubuntu
- HestiaCP 添加了 CardDAV/CalDAV/ActiveSync 支持。[^1]

[^1]: <https://forum.hestiacp.com/t/what-is-the-difference-between-vestacp-and-hestiacp/44>

## related

- [[aapanel]]
- [[CyberPanel]]
- [[DirectAdmin]]

## reference

- <https://bytexd.com/install-hestiacp/>
