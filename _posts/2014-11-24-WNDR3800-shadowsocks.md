---
layout: post
title: "继续折腾WNDR3800之shadowsocks"
tagline: ""
description: ""
category: 经验总结
tags: [Shadowsocks, openwrt, Knowledge]
last_updated: 2016-10-03
---

[之前](http://www.einverne.tk/2014/09/netgear-wndr3800-openwrt-install-xware.html)也说过在Openwrt下使用迅雷远程下载，现在因为不想在PC端总是开着一个shadowsocks的程序，所以将shadowsocks安装到路由器端。然后还顺带解决一下DNS污染，和流量智能转发。

## Shadowsocks
[下载](http://sourceforge.net/projects/openwrt-dist/files/shadowsocks-libev/)编译好的ipk

    opkg update
    opkg install libpolarssl
    opkg install shadowsocks-libev_1.5.1_ar71xx.ipk

shadowsocks安装后有三个命令，ss-local启动sock5代理，ss-redir启动透明代理,ss-tunnel启动隧道。我使用了ss-local和ss-redir

    # 编辑 /etc/shadowsocks.json
    {
        "server":"[服务器ipv4/ipv6地址]", 
        "server_port":8388, #服务器端口 
        "local_port":1081, #本地sock5代理端口
        "password":"[密码]",
        "timeout":300,
        "method":"[加密方式]"
    }

修改配置文件`/etc/init.d/shadowsocks`

    START=95
    SERVICE_USE_PID=1
    SERVICE_WRITE_PID=1
    SERVICE_DAEMONIZE=1
    CONFIG=/etc/shadowsocks.json
    start() {
        service_start /usr/bin/ss-local -c $CONFIG
    	service_start /usr/bin/ss-redir -c $CONFIG
    }
    stop() {
        service_stop /usr/bin/ss-local
    	service_stop /usr/bin/ss-redir
    }

添加执行权限，设置开机启动

    chmod +x /etc/init.d/shadowsocks
    /etc/init.d/shadowsocks enable

## pdnsd

    opkg update
    opkg install pdnsd

配置`/etc/init.d/pdnsd.conf`

    global {
	    #debug = on;
        perm_cache=1024;
        cache_dir="/var/pdnsd";
        run_as="nobody";
        server_port = 1053;   #使用1053作为DNS端口, 默认是53，一定要修改否则会跟默认dnsmasq冲突
        server_ip = 127.0.0.1; 
        status_ctl = on;
        query_method=tcp_only;#最重要的配置, 只使用tcp查询上级DNS
        min_ttl=15m;
        max_ttl=1w;
        timeout=10;
    }
    server {
        label= "googledns"; #这个label随便写
        ip = 8.8.8.8;    #这里为上级 dns 的 ip 地址，要求必须支持TCP查询，相关说明见后文注解
        root_server = on;
        uptest = none;   #不去检测 dns 是否无效.
    }

启用pdnsd，并设置为开机启动：

    /etc/init.d/pdnsd enable
    /etc/init.d/pdnsd restart

完成!

## dnsmasq和ipset
openwrt默认安装的dnsmasq不支持ipset，需要先卸载，换成dnsmasq-full，输入一下命令查看dnsmasq版本，写着no ipset的就需要安装完整版。

    dnsmasq -v
    
运行以下命令：

    opkg update
    opkg install kmod-ipt-ipset ipset ipset-dns
    opkg remove dnsmasq
    opkg install dnsmasq-full

dnsmasq-full从[这里](http://sourceforge.net/projects/openwrt-dist/files/dnsmasq/)下载，设置dnsmasq对特定域名使用本地的pdnsd进行解析：
为了保持配置文件整洁，建议在 `/etc/dnsmasq.conf` 最后加入：

    conf-dir=/etc/dnsmasq.d

然后新建mkdir目录 `/etc/dnsmasq.d` ，在里面加入一个conf，名字任选。譬如 `/etc/dnsmasq.d/fuckgfw.conf` ,下面是我的文件内容，你可以按自己需要整理自己的：

    #Google and Youtube
    server=/.google.com/127.0.0.1#1053
    server=/.google.com.hk/127.0.0.1#1053
    server=/.gstatic.com/127.0.0.1#1053
    server=/.ggpht.com/127.0.0.1#1053
    server=/.googleusercontent.com/127.0.0.1#1053
    server=/.appspot.com/127.0.0.1#1053
    server=/.googlecode.com/127.0.0.1#1053
    server=/.googleapis.com/127.0.0.1#1053
    server=/.gmail.com/127.0.0.1#1053
    server=/.google-analytics.com/127.0.0.1#1053
    server=/.youtube.com/127.0.0.1#1053
    server=/.googlevideo.com/127.0.0.1#1053
    server=/.youtube-nocookie.com/127.0.0.1#1053
    server=/.ytimg.com/127.0.0.1#1053
    server=/.blogspot.com/127.0.0.1#1053
    server=/.blogger.com/127.0.0.1#1053
    
    #FaceBook
    server=/.facebook.com/127.0.0.1#1053
    server=/.thefacebook.com/127.0.0.1#1053
    server=/.facebook.net/127.0.0.1#1053
    server=/.fbcdn.net/127.0.0.1#1053
    server=/.akamaihd.net/127.0.0.1#1053
    
    #Twitter
    server=/.twitter.com/127.0.0.1#1053
    server=/.t.co/127.0.0.1#1053
    server=/.bitly.com/127.0.0.1#1053
    server=/.twimg.com/127.0.0.1#1053
    server=/.tinypic.com/127.0.0.1#1053
    server=/.yfrog.com/127.0.0.1#1053

    #Google and Youtube
    ipset=/.google.com/setmefree
    ipset=/.google.com.hk/setmefree
    ipset=/.gstatic.com/setmefree
    ipset=/.ggpht.com/setmefree
    ipset=/.googleusercontent.com/setmefree
    ipset=/.appspot.com/setmefree
    ipset=/.googlecode.com/setmefree
    ipset=/.googleapis.com/setmefree
    ipset=/.gmail.com/setmefree
    ipset=/.google-analytics.com/setmefree
    ipset=/.youtube.com/setmefree
    ipset=/.googlevideo.com/setmefree
    ipset=/.youtube-nocookie.com/setmefree
    ipset=/.ytimg.com/setmefree
    ipset=/.blogspot.com/setmefree
    ipset=/.blogger.com/setmefree
    
    #FaceBook
    ipset=/.facebook.com/setmefree
    ipset=/.thefacebook.com/setmefree
    ipset=/.facebook.net/setmefree
    ipset=/.fbcdn.net/setmefree
    ipset=/.akamaihd.net/setmefree
    
    #Twitter
    ipset=/.twitter.com/setmefree
    ipset=/.t.co/setmefree
    ipset=/.bitly.com/setmefree
    ipset=/.twimg.com/setmefree
    ipset=/.tinypic.com/setmefree
    ipset=/.yfrog.com/setmefree
    
    #Dropbox
    ipset=/.dropbox.com/setmefree
    
    #1024
    ipset=/.t66y.com/setmefree
    
    #shadowsocks.org
    ipset=/.shadowsocks.org/setmefree
    
    #btdigg
    ipset=/.btdigg.org/setmefree
    
    #sf.net
    ipset=/.sourceforge.net/setmefree
    
    #feedly
    ipset=/.feedly.com/setmefree

按照这种格式指定特定的域名走代理。
`server=/google.com/127.0.0.1#1053`的含义是google.com通过本地1053端口解析地址
`ipset=/google.com/setmefree` 的含义给google.com的数据包打上标记，一会配置`iptables`时会用到
接下来配置`iptables`，在`/etc/firewall.user`里加上两行

    ipset -N setmefree iphash
    iptables -t nat -A PREROUTING -p tcp -m set --match-set setmefree dst -j REDIRECT --to-port 1081

每条记录都需要跟一条ipset设置，不要忘了。作用是把打上了标记的数据包重定向到ss-redir的透明代理端口

    root@OpenWrt:~# cd /usr/bin
    touch shadowsocks-firewall
	vi shadowsocks-firewall

修改文件内容

    #!/bin/sh
    
    #create a new chain named SHADOWSOCKS
    iptables -t nat -N SHADOWSOCKS
    
    # Ignore your shadowsocks server's addresses
    # It's very IMPORTANT, just be careful.
    iptables -t nat -A SHADOWSOCKS -d YOUR-SERVERS-IP-ADDRESS -j RETURN
    
    # Ignore LANs IP address
    iptables -t nat -A SHADOWSOCKS -d 0.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 10.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 127.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 169.254.0.0/16 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 172.16.0.0/12 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 192.168.0.0/16 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 224.0.0.0/4 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 240.0.0.0/4 -j RETURN
    
    # Ignore Asia IP address
    iptables -t nat -A SHADOWSOCKS -d 1.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 14.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 27.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 36.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 39.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 42.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 49.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 58.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 59.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 60.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 61.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 101.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 103.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 106.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 110.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 111.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 112.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 113.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 114.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 115.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 116.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 117.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 118.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 119.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 120.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 121.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 122.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 123.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 124.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 125.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 126.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 169.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 175.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 180.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 182.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 183.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 202.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 203.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 210.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 211.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 218.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 219.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 220.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 221.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 222.0.0.0/8 -j RETURN
    iptables -t nat -A SHADOWSOCKS -d 223.0.0.0/8 -j RETURN
    
    # Anything else should be redirected to shadowsocks's local port
    iptables -t nat -A SHADOWSOCKS -p tcp -j REDIRECT --to-ports 1081
    
    # Apply the rules
    iptables -t nat -A PREROUTING -p tcp -j SHADOWSOCKS

 - 你必须把上面的107.89.0.12换成你服务器真实的IP地址（即自己前面在shadowsocks.json配置的服务器 IP。）
 - `iptables -t nat -A SHADOWSOCKS -p tcp -j REDIRECT --to-ports 8024`
   这里的8024必须和OpenWrt路由器 `/etc/shadowsocks.json`里的 local_port一样，也就是说，如果
   `/etc/shadowsocks.json`里 `"local_port":1081`,
   那这里的8024也要改成1081（如果照着我上面的本地端口填了8080，这里就改成8080）

配置成功后，`chmod +x shadowsocks-firewall`给其运行权限。

运行

     /usr/bin/shadowsocks-firewall

重启dnsmasq和firewall就可以实现流量自动分流了

    /etc/init.d/dnsmasq restart
    /etc/init.d/firewall restart

以后只要修改`dnsmasq`的配置文件就可以指定更多的地址走代理


## 可选方案 解决 dns 污染
这里比较方便的是，通过 [ChinaDNS](https://github.com/clowwindy/ChinaDNS-C) 就可以了。

和安装 ShadowSocks 一样，可以先通过 WinSCP上传到路由器。

    opkg install ChinaDNS-C_1.0.0_ar71xx.ipk  # 安装
    /etc/init.d/chinadns start                # 运行
    /etc/init.d/chinadns enable               # 开机启动

## reference

 1. http://hong.im/2014/07/08/use-ipset-with-shadowsocks-on-openwrt/
 2. http://www.jianshu.com/p/4800eec60516
 3. http://blog.berry10086.com/Tech/Openwrt/openwrt-shadowsocks-ipset/
 4. http://www.shuyz.com/install-shadowsocks-on-hg255d-openwrt-and-config-nat.html
 5. http://hong.im/2014/03/16/configure-an-openwrt-based-router-to-use-shadowsocks-and-redirect-foreign-traffic/