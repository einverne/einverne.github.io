---
layout: post
title: "Use shadowsocks libev"
tagline: ""
description: ""
category: 学习笔记
tags: [socks, shadowsocks, shadowsocks-libev, proxy, ubuntu, ]
last_updated:
---

This post is under the environment of Ubuntu 18.04, this instruction will guide how to install shadowsocks libev both server side and client settings manually. And show the step to configure the simple-obfs.

The source code is in following two repositories:

- <https://github.com/shadowsocks/shadowsocks-libev>
- <https://github.com/shadowsocks/simple-obfs>


You can manually build and install yourself. But under Ubuntu 18.04, you can just install like this:

	sudo apt install shadowsocks-libev simple-obfs

and the configuration is under `/etc/shadowsocks-libev/`. You can manullay modify it and make it work.

If your system is before Ubuntu 18.04, you have to build it from source.

Install shadowsocks-libev via Ubuntu PPA

    sudo apt-get install software-properties-common -y
    sudo add-apt-repository ppa:max-c-lv/shadowsocks-libev -y
    sudo apt-get update
    sudo apt install shadowsocks-libev

Install simple-obfs

    sudo apt-get install --no-install-recommends build-essential autoconf libtool libssl-dev libpcre3-dev libev-dev asciidoc xmlto automake
    git clone https://github.com/shadowsocks/simple-obfs.git
    cd simple-obfs
    git submodule update --init --recursive
    ./autogen.sh
    ./configure && make
    sudo make install

Make ~obfs-server~ able to listen on port 443

  setcap cap_net_bind_service+ep /usr/local/bin/obfs-server

Server configuration

  Add below to ~/etc/shadowsocks-libev/config.json~

    {
        "server":"0.0.0.0",
        "server_port":443,
        "local_port":1080,
        "password":"password",
        "timeout":300,
        "method":"chacha20-ietf-poly1305",
        "plugin":"obfs-server",
        "plugin_opts": "obfs=tls;obfs-host=www.douban.com",
    }


Start ~shadowsocks-libev~ server

    systemctl enable shadowsocks-libev.service
    systemctl start shadowsocks-libev.service
    systemctl status shadowsocks-libev.service


Optimizations

Install & enable BBR TCP congestion control

     apt install --install-recommends linux-generic-hwe-16.04
     apt autoremove
     modprobe tcp_bbr
     echo "tcp_bbr" >> /etc/modules-load.d/modules.conf
     echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
     echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
     sysctl -p


MISC

Add below to ~/etc/sysctl.d/local.conf~

     fs.file-max = 51200

     net.core.rmem_max = 67108864
     net.core.wmem_max = 67108864
     net.core.netdev_max_backlog = 250000
     net.core.somaxconn = 4096

     net.ipv4.tcp_syncookies = 1
     net.ipv4.tcp_tw_reuse = 1
     net.ipv4.tcp_fin_timeout = 30
     net.ipv4.tcp_keepalive_time = 1200
     net.ipv4.ip_local_port_range = 10000 65000
     net.ipv4.tcp_max_syn_backlog = 8192
     net.ipv4.tcp_max_tw_buckets = 5000
     net.ipv4.tcp_fastopen = 3
     net.ipv4.tcp_mem = 25600 51200 102400
     net.ipv4.tcp_rmem = 4096 87380 67108864
     net.ipv4.tcp_wmem = 4096 65536 67108864
     net.ipv4.tcp_mtu_probing = 1


Reboot

    reboot

Client configuration

Add below to `/usr/local/etc/shadowsocks-libev.json`

Note that the ~plugin~ has to be absolute path in order to be able to use
  ~brew services start shadowsocks-libev~.

    {
        "server":"SERVER",
        "server_port":443,
        "local_address": "127.0.0.1",
        "local_port":1080,
        "password":"PASSWORD",
        "timeout":300,
        "method":"chacha20-ietf-poly1305",
        "workers":8,
        "plugin":"/usr/local/bin/obfs-local",
        "plugin_opts": "obfs=tls;obfs-host=www.bing.com",
        "fast_open":true,
        "reuse_port":true
    }


## reference

- <https://gist.github.com/nuhuo08/01cb865f77967a2ce14841d6d7fc1f02>
