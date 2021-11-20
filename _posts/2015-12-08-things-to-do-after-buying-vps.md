---
layout: post
title: "购买 VPS 之后需要做的事情"
tagline: ""
description: ""
category: 经验总结
tags: [linux, vps, lnmp,]
last_updated: 2016-04-09
---

## Security
Security is the most important thing we should take care at first.

### Change password

The first thing you login into your VPS using root is to change your root password your VPS provider gave. Run the `passwd` to change your root password.

After you run this command, your terminal will prompt you to input new password. So just type your new password twice. Linux will check your new password to prevent simple password or short password. So don’t use any exist words or any password only contains number.

### Create a new User

One of the most important security thing is try your best not to login to your VPS using root account. A better way is to create a new user account and do anything you like as this new user.

Following command is to create a new user and set a password for this user. Please replace `einverne` as your own name.

	# create a new user called einverne
    adduser einverne
    # set password for user einverne
    passwd einverne

After you create a new user account successfully, we give the new user root privileges. Someone may be curious about why we create a new user and grant root privileges, so why don’t we just use root account. There are two points. One is that this can prevent user making system-destroying mistakes, second is that all command run by `sudo` will have a record in `/var/log/secure` which can be reviewed later if needed.

### update default editor

    apt install vim -y
    update-alternatives --config editor

choose: vim

### sudo
Run `visudo` command to enter sudo config file. Find a section called user privilege specification. And add a new line under this section like this:

    # User privilege specification
    root    ALL=(ALL)       ALL
    # new add
    einverne	ALL=(ALL)	NOPASSWD:ALL

### ssh configuration
Now it's time to make the server more secure. You can set the ssh configuration to permit root login. But before doing this config, please make sure to have a new account have the root privileges.

Edit ssh config file:

     sudo vim /etc/ssh/sshd_config

Then change follow line:

    Port 22
    PermitRootLogin no

Port means the ssh port you can connect, you can set any number between 1025 and 65535. PermitRootLogin means you can disallow root login, if you set to **no**.

Finally, add `AllowUsers einverne` at the bottom of the sshd_config file.

Then reload the config file to make ssh work.

    service ssh reload

To test the new ssh config, do not logout of root. Open a new terminal and login with your new account like:

    ssh -p port einverne@server.address

![servers](https://lh3.googleusercontent.com/-fxTfiWZ7Q9U/VZA0FJkW1TI/AAAAAAAApLg/7mc831epKyA/s1024-Ic42/MNK_006.jpg)

After you set up server ssh, you can generate SSH key at local computer and use SSH key to connect to server rather than using password. Generating a key at local computer:

	ssh-keygen -t ed25519 -C "your@email.com"

follow the instruction of this command, for example you name it **vps** , just enter to skip password of key, and you will get two files under `~/.ssh/`, **vps** is your private key, keep it safe. And **vps.pub** is the public key. And Now use `ssh-copy-id` to copy public key to server.

	ssh-copy-id user@server.address

Then type the password. And it will be the last time to type your password to connect to server. If your computer don't have the command `ssh-copy-id`, you have to copy the public key to server `~/.ssh/authorized_keys` manually.

	scp ~/.ssh/name.pub user@server:~/.ssh/

Then copy the file content to `authorized_keys` file.

	cat name.pub >> authorized_keys

Finally to check the permission of the folder `.ssh` and file `authorized_keys`

	drwx------ 2 einverne einverne       4096 Apr 19 21:25 .ssh
	-rw------- 1 einverne einverne  744 Apr 19 21:14 authorized_keys

and if not:

	chmod 700 ~/.ssh/
	chmod 600 authorized_keys

### setup alias

Add alias to `.bashrc` or `.zshrc` file.

	alias vps = "ssh username@server -p port"

Then next time, you can just type `vps` to connect to server.

### ssh config

There are two config file to setup ssh. One is system wide configuration file which can be found `/etc/ssh/ssh_config`. And another is per-user configuration file which is located under user home directory `~/.ssh/config`. Most time we only care about user config.

Try to set up:

	Host ds #this can be anything just a alias
		HostName server
		Port 22
		User username

Then we can use `ssh ds` to connect to server. If you have multi config just add to following like:

	Host ds
		HostName server
		Port 22
		User einverne

	Host github
		HostName github.com
		Port 22
		User einverne
		IdentityFile ~/.ssh/private_key_name

After all this, you can type following command to have a try:

	scp filename ds:~/filename   # copy file to server
	ssh ds "ls ~" 		# list server files

### setup hostname

    hostnamectl set-hostname example_hostname

### setup timezone
设置时区：

    sudo dpkg-reconfigure tzdata

## Test VPS
单独总结了一篇文章来讲[如何测评一个 VPS 性能](/post/2021/07/vps-benchmark.html)。

### Network test
You can use this [solution](https://github.com/sivel/speedtest-cli/) to solve the problem. Or there are some download test file.

Install speedtest package:

	pip install speedtest-cli

or

	easy_install speedtest-cli

Usage:

    $ speedtest-cli -h
    usage: speedtest-cli [-h] [--bytes] [--share] [--simple] [--list]
                         [--server SERVER] [--mini MINI] [--source SOURCE]
                         [--timeout TIMEOUT] [--secure] [--version]

    Command line interface for testing internet bandwidth using speedtest.net.
    --------------------------------------------------------------------------
    https://github.com/sivel/speedtest-cli

    optional arguments:
      -h, --help         show this help message and exit
      --bytes            Display values in bytes instead of bits. Does not affect
                         the image generated by --share
      --share            Generate and provide a URL to the speedtest.net share
                         results image
      --simple           Suppress verbose output, only show basic information
      --list             Display a list of speedtest.net servers sorted by
                         distance
      --server SERVER    Specify a server ID to test against
      --mini MINI        URL of the Speedtest Mini server
      --source SOURCE    Source IP address to bind to
      --timeout TIMEOUT  HTTP timeout in seconds. Default 10
      --secure           Use HTTPS instead of HTTP when communicating with
                         speedtest.net operated servers
      --version          Show the version number and exit

一些机房 100M 测速下载文件地址，用于测速之用

description:
VPS 的网络性能，主要分出口和入口二个指标，入口可以用 wget 文件得到。
看下载速度，如果是 11M/s，大概就是百兆口，70M/S，大概就是 G 口。
您的 VPS 搭建好网站环境后，可以用其它的 VPS 去拽这个文件，得到出口的带宽。

Directspace 机房 /10M.100M 测试包 Portland

    wget http://bandwidth.directspace.net/10MBtest.zip
    wget http://bandwidth.directspace.net/100MBtest.zip

## Change default shell

    sudo apt install zsh
    chsh -s $(which zsh)

logout and login again.

## BBR
BBR 是 Google 提出的 TCP拥塞控制算法，可以使Linux服务器显著地提高吞吐量和减少TCP连接的延迟，已经提交并合并到了 Linux 内核。

检查是否开启了 BBR：

```
sudo sysctl net.ipv4.tcp_available_congestion_control | grep bbr
sudo sysctl net.ipv4.tcp_congestion_control | grep bbr
```


如果开启通常会在结果中包含 bbr。如果没有开启则使用 Teddysun 的一键脚本，注意开启之后需要重启才能生效。

```
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh
```


## docker
Docker become much powerful these days, I can build and sever all my self-host services by using Docker.

	sudo apt update
	sudo apt install apt-transport-https ca-certificates curl software-properties-common
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
	sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
	sudo apt update
	apt-cache policy docker-ce
	sudo apt install docker-ce
	sudo systemctl status docker

或者通过一键脚本：

    curl -fsSL https://get.docker.com/ | sh
    # 启动并设置开机自启docker
    systemctl enable --now docker

Executing the docker command without sudo 非 root 用户执行 docker 命令：

    # sudo groupadd docker
	sudo usermod -aG docker $USER
    newgrp docker

设置后登出，然后登录。

### 安装 docker-compose

    sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    # 如果/usr/local/bin不在PATH里
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose


如果使用我的 [dotfiles](https://github.com/einverne/dotfiles) 配置，在 `~/.zshrc` 第一次配置的时候就会把 `docker-compose` 二进制文件拉下来。

## shadowsocks
sock5 proxy.

- first install pip

        yum update && yum install python-setuptools
        easy_install pip

    or use command `yum -y install python-pip` to install pip

- install shadowsocks using pip

		pip install shadowsocks

    just run this command

- create json config file

		vim /etc/shadowsocks.json

	edit file as follow:

		{
			"server":"[ip]",
			"server_port":[port],
			"local_port":[port],
			"password":"[password]",
			"timeout":600,
			"method":"AES-256-CFB"
		}

	Explanation of each field:

		- server: your hostname or server IP (IPv4/IPv6).
		- server_port: server port number.
		- local_port: local port number.
		- password: a password used to encrypt transfer.
		- timeout: connections timeout in seconds.
		- method: encryption method, "bf-cfb", "aes-256-cfb", "des-cfb", "rc4", etc. Default is table, which is not secure. "aes-256-cfb" is recommended.

- start server

	`ssserver -c [json_path] -d start`

    start service

## lnmp

Second thing is to install lnmp, if you want to host a website on your VPS. You can use screen to install lnmp.

Screen can prevent network connection error during the lnmp installation. You can find more details on the lnmp official [site](http://lnmp.org/install.html)

1. [install screen](http://www.vpser.net/manage/screen.html)
2. run this command: `screen -S lamp` to create a screen session
3. download packages `wget -c http://soft.vpser.net/lnmp/lnmp1.1-full.tar.gz`
4. uncompress the package `tar zxf lnmp1.1-full.tar.gz`
5. enter directory: `cd lnmp1.1-full/`
6. install lnmp
	If you are using Centos run `./centos.sh` , If you are using Debian run `./debian.sh` , If you are using Ubuntu run `./ubuntu.sh

If you’re ssh connection suddenly failed, you can connect to your server. Then run command `screen -r lnmp`to restore your lnmp installation.

From:<http://www.vpser.net/manage/run-screen-lnmp.html>

After installation, you will see some short instructions.

    lnmp status manage: /root/lnmp {start|stop|reload|restart|kill|status}
    default mysql root password:12345678
    phpinfo : http://yourIP/phpinfo.php
    phpMyAdmin : http://yourIP/phpmyadmin/
    Prober : http://yourIP/p.php
    Add VirtualHost : /root/vhost.sh

    The path of some dirs:
    mysql dir: /usr/local/mysql
    php dir: /usr/local/php
    nginx dir: /usr/local/nginx
    web dir : /home/wwwroot/default

    LNMP is a tool to auto-compile & install Nginx+MySQL+PHP on Linux
    This script is a tool to Manage status of lnmp
    For more information please visit http://www.lnmp.org

    Usage: /root/lnmp {start|stop|reload|restart|kill|status}

## reference

- <http://linux.die.net/man/1/ssh-copy-id>
- <http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/>
- <http://linux.die.net/man/5/ssh_config>
- <http://dhq.me/use-ssh-config-manage-ssh-session>
- <http://blog.jobbole.com/33790/>
