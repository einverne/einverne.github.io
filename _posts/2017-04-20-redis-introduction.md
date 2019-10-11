---
layout: post
title: "Redis 介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [redis, database, nosql, 学习笔记 ]
last_updated:
---

Redis (Remote Dictionary Server) 是由 Salvatore Sanfilippo（antirez） 开发的开源数据库，基于内存的 Key-Value 类型的 NoSQL 。目前在 DB Engines Ranking K-V 数据库中排行第一 [^1]。

Redis 是 REmote DIctionary Server 远程字典服务的缩写，他以字典结构存储数据，并允许其他应用通过 TCP 协议来读写字典中的内容。

[^1]: <https://db-engines.com/en/ranking/key-value+store>

Redis 支持很多的特性：

- 所有数据存放在内存中
- 支持数据持久化：AOF 和 RDB 两种类型
- 支持异步数据复制

Redis Cluster 常用 5 种数据结构 (String, Lists, Sets, Sorted Set, Hash) 以单进程方式处理请求，数据持久化和网络 Socket IO 等工作是异步进程。


## 安装 {#install}

### 源中安装 {#from-source}
在 Debian/Ubuntu/Linux Mint 下直接安装即可，但是 redis 对内核有要求，如果安装失败的时候， `-uname -a` 看一下自己的内核，如果版本太低就升级一下。

	sudo apt-get install redis-server

安装成功之后就可以使用

	sudo service redis-server status # 查看当前状态
	sudo service redis-server stop/start # 等等来控制 redis-server 的状态

最方便最快捷的安装方式，如果使用 docker 也可以使用 docker 中官方的源。

### 手动安装
官网下载 <https://redis.io/download>

下载最新的稳定版 Redis，可以从 <http://download.redis.io/redis-stable.tar.gz> 获取最新稳定版

	curl -O http://download.redis.io/redis-stable.tar.gz

解压 tag.gz

	tar xzvf redis-stable.tar.gz

进入解压后目录

	cd redis-stable

编译和安装，运行 make 命令

	make

当二进制文件编译完成之后，运行 test 确保一切都正确

	make test

当所有测试跑通过之后安装到系统

	sudo make install

运行 test 的时候报了一个错误：

> *** [err]: Test replication partial resync: ok psync (diskless: yes, reconnect: 1) in tests/integration/replication-psync.tcl

参考该 [issue](https://github.com/antirez/redis/issues/2715) 使用单核运行 test

	taskset -c 1 sudo make test

## 配置 Redis {#configuration}

在 etc 目录下新建 redis 配置文件目录

	sudo mkdir /etc/redis

将默认配置文件拷贝到配置目录

	sudo cp redis.conf /etc/redis

编辑配置文件

	sudo vim /etc/redis/redis.conf

修改 supervised 为 systemd

    # If you run Redis from upstart or systemd, Redis can interact with your
    # supervision tree. Options:
    #   supervised no      - no supervision interaction
    #   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
    #   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
    #   supervised auto    - detect upstart or systemd method based on
    #                        UPSTART_JOB or NOTIFY_SOCKET environment variables
    # Note: these supervision methods only signal "process is ready."
    #       They do not enable continuous liveness pings back to your supervisor.
    supervised systemd

接下来，寻找 `dir` 配置， 该参数制定 Redis 存储数据的目录，需要一个 Redis 有写权限的位置，使用 `/var/lib/redis`.

    # The working directory.
    #
    # The DB will be written inside this directory, with the filename specified
    # above using the 'dbfilename' configuration directive.
    #
    # The Append Only File will also be created inside this directory.
    #
    # Note that you must specify a directory here, not a file name.
    dir /var/lib/redis

修改完毕，保存关闭。

### 创建 systemd unit
创建 `redis.service` 文件

	sudo vim /etc/systemd/system/redis.service

[Unit] 单元中提供描述，和启动需要在网络可用之后。[Service] 中定义服务的具体动作，自定义用户 redis，以及 `redis-server` 的地址。


    [Unit]
    Description=Redis In-Memory Data Store
    After=network.target

    [Service]
    User=redis
    Group=redis
    ExecStart=/usr/local/bin/redis-server /etc/redis/redis.conf
    ExecStop=/usr/local/bin/redis-cli shutdown
    Restart=always

    [Install]
    WantedBy=multi-user.target

### 创建 redis 用户，组

创建用户，组

	sudo adduser --system --group --no-create-home redis

创建文件夹

	sudo mkdir /var/lib/redis

给予权限

	sudo chown redis:redis /var/lib/redis

修改权限，普通用户无法访问

	sudo chmod 770 /var/lib/redis

## 运行 Redis {#Run-redis}
启动

	sudo systemctl start redis

查看状态

	sudo systemctl status redis

显示

    sudo service redis status
    ● redis.service - Redis In-Memory Data Store
       Loaded: loaded (/etc/systemd/system/redis.service; disabled; vendor preset: enabled)
       Active: active (running) since Sat 2017-04-22 18:59:56 CST; 2s ago
     Main PID: 28750 (redis-server)
       CGroup: /system.slice/redis.service
               └─28750 /usr/local/bin/redis-server 127.0.0.1:6379

    Apr 22 18:59:56 ev redis-server[28750]:   `-._    `-._`-.__.-'_.-'    _.-'
    Apr 22 18:59:56 ev redis-server[28750]:       `-._    `-.__.-'    _.-'
    Apr 22 18:59:56 ev redis-server[28750]:           `-._        _.-'
    Apr 22 18:59:56 ev redis-server[28750]:               `-.__.-'
    Apr 22 18:59:56 ev redis-server[28750]: 28750:M 22 Apr 18:59:56.445 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower valu
    Apr 22 18:59:56 ev redis-server[28750]: 28750:M 22 Apr 18:59:56.445 # Server started, Redis version 3.2.8
    Apr 22 18:59:56 ev redis-server[28750]: 28750:M 22 Apr 18:59:56.445 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.ov
    Apr 22 18:59:56 ev redis-server[28750]: 28750:M 22 Apr 18:59:56.445 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage
    Apr 22 18:59:56 ev redis-server[28750]: 28750:M 22 Apr 18:59:56.445 * DB loaded from disk: 0.000 seconds
    Apr 22 18:59:56 ev redis-server[28750]: 28750:M 22 Apr 18:59:56.445 * The server is now ready to accept connections on port 6379


使用 `redis-cli` 客户端测试。

	redis-cli

然后运行 `ping` ，会得到 PONG。

    127.0.0.1:6379> ping
    PONG
    127.0.0.1:6379> set test "It's working"
    OK
    127.0.0.1:6379> get test
    "It's working"
    127.0.0.1:6379> exit

然后重启 redis

	sudo systemctl restart redis.service

然后进入 `redis-cli`:

    127.0.0.1:6379> get test
    "It's working"

如果能够获得，就证明配置好了。

开机启动

    sudo systemctl enable redis


在启动了 redis 之后就可以再熟悉一下他的[命令](/post/2017/04/redis-command.html) 了。

## 多数据库支持
Redis 实例提供了多个用来存储数据库的字典，客户端可以用来指定将数据存储在哪个数据库中，类似关系型数据库可以新建很多个数据库，可以将 Redis 的每一个字典都理解成为一个数据库。

每个数据库对外都是以一个从 0 开始的递增数字命名， Redis 默认支持 16 个数据库。 客户端与 Redis 建立连接之后会自动选择 0 号数据库，不过随时可以使用 SELECT 命令来更换数据库，比如选择 1 号数据库 `SELECT 1`.

注意：Redis 不支持自定义数据库名，每个数据库都以编号命名；Redis 也不支持为每一个数据库设置不同的访问密码；多个数据库之间并不是完全隔离， `FLUSHALL` 命令可以清空 Redis 实例中所有数据库数据。



## reference

参考： <https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04>
