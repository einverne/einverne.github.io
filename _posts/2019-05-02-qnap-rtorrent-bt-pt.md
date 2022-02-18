---
layout: post
title: "威联通折腾篇十五：rtorrent-Pro 使用"
aliases: "威联通折腾篇十五：rtorrent-Pro 使用"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, nas, bt, pt, ]
last_updated:
---

QNAP CLUB 中淘到很多不错的应用，rtorrent-Pro 就是一款，现在作者升级了 rtorrent-pro 付费 15 欧元。这又是一款 BT 下载工具，界面非常美观。

> rtorrent development for QNAP was started in 2008. Today after 10yrs from its 1st build, we provide you best Torrent app ever.
> rtorrent is an high performance and extra featured bittorrent client combined with simple and elegant user interface. rtorrent differentiates itself from other implementations by transferring data directly between file pages mapped to memory by the mmap() function and the network stack. On high-bandwidth connections, it claims to be able to seed at 3 times the speed of the official client.
> We strive to make rtorrent the best torrent client you could ever want!

![rtorrent ui](/assets/rtorrent-Pro_ux_ui_themes_small.png)

支持的 QNAP 型号

- armv7l - ARM processors: TS-x28/x31P/x31P2/x41 and more...
- x86_64 - Intel/AMD64 CPU: TS-x51 and all higher (x53/61/63/70/71/73/77/78/80/82/88...)

如果不确定自己的 QNAP 型号，登录后台运行 `uname -m` 输出 CPU 架构如果是上面提到的两个就是支持的。

## Installation

安装非常简单，下载应用，在后台上传安装即可。安装后默认的用户名是：`rtorrent` 密码是：`admin`.

![rtorrent pro splash screen](/assets/rtorrent-pro-splash-screen.png)

重启，启动，暂停的使用：

	/etc/init.d/rtorrent.sh [start|stop|restart]

## Things to do
在安装完毕之后，第一件事情就是更改密码。

用新密码登录进去之后进行配置，首先熟悉配置文件的地址。

### Config
配置文件地址：

	vi /share/CACHEDEV1_DATA/.qpkg/rtorrent/etc/rtorrent.conf

需要注意的是如果之前安装过其他 BT 下载工具，比如 Transmission 之类，可能会造成端口冲突 (DHT 端口），需要手工调整一下端口设置。

rtorrent 用到的端口：

- 6881 DHT, 可在配置文件修改
- 42000 连入端口
- 19000

### Change Paths

注意到该路径，rtorrent 相关的内容都安装在了该路径中。安装完毕之后 rtorrent 会在 Download 目录下创建名为 `rtorrent` 的文件夹，并且创建软链接 `/share/Rdownload`，rtorrent 下载的内容都会在该目录中。

> In stock QNAP applications, a default Download share is used to save downloaded data from the Internet. Download share location is always static and only on the first initiated disk volume. In the default configuration, Rtorrent also uses the Download network share.

可以自定义 Rtorrent 存储的路径，创建共享文件夹名为 `Rdownload`，指定一块硬盘，当创建共享文件夹时，记得关闭 Rtorrent-Pro，创建成功后再启动。这样 rtorrent-Pro 就会使用新的路径。

### Watch 监控目录
Transmission [之前的文章](/post/2018/06/qnap-transmission.html) 也提到过监控某个文件夹，一旦有文件新加进去自动下载。

rtorrent 同样可以实现，默认的配置已经有配置，如果想要更加详细的了解，可以参考[这里](https://github.com/rakshasa/rtorrent/wiki/TORRENT-Watch-directories)

Schedule 的语法：

	# Schedule syntax: id,start,interval,command call cmd every interval seconds

比如：

	schedule = watch_directory_1,20,10,"load.start=/downloads/watched/*.torrent"

说明：

用简短的一句话来总结上面的配置含义就是，定义了一个定时器，名叫 watch_directory_1, rTorrent 启动后 20 秒开始，每隔 10 秒执行一次命令，这个命令是从给定的目录中加载 torrent 文件。

- schedule 的语法用逗号分隔四段，分别是 ID，启动，间隔时间，执行的命令
- id 可以自行定义
- start，rTorrent 启动后多久开始执行
- interval ，间隔多长时间执行，如果是 0 则表示执行一次
- load.start 表示从给定的目录（该目录必须要存在）加载 torrent 文件，这个地方除了 load.start 还可以用
	- load.start_verbose = file
	- load.verbose = file, verbose 会在终端将任何错误打印出来
	- load.normal



## rtorrent 配置说明

	# Maximum and minimum number of peers to connect to per torrent.
	# throttle.min_peers.normal.set = 40
	# throttle.max_peers.normal.set = 100
	# 最小允许的 peer
	min_peers = 40
	# 最大允许 peer
	max_peers = 100

	# Same as above but for seeding completed torrents (-1 = same as downloading)
	# throttle.min_peers.seed.set = 25
	# throttle.max_peers.seed.set = 60
	min_peers_seed = 10
	max_peers_seed = 50

	# Maximum number of simultanious uploads per torrent.
	# throttle.max_uploads.set = 30
	# 最大同时上传数
	max_uploads = 10

	# Global upload and download rate in KiB. "0" for unlimited.
	# throttle.global_up.max_rate.set_kb = 0
	# throttle.global_down.max_rate.set_kb = 0
	# 最大下载速度
	download_rate = 1024
	# 最大上传速度
	upload_rate = 512

	# tracker_numwant = -1
	#trackers.numwant.set = -1

	# Max mapped memory
	# nb does not refer to physical memory
	# max_memory_usage = 768M
	pieces.memory.max.set = 1024M

	# Max number of files to keep open simultaneously
	# max_open_files = 65536
	#network.max_open_files.set = 1024

	# max_open_http = 48
	#network.http.max_open.set = 48

	# Default directory to save the downloaded torrents.
	# directory.default.set = /share/Rdownload/downloads/
	# 下载目录
	directory = /share/Rdownload/downloads/

	# Default session directory. Make sure you don't run multiple instance
	# of rtorrent using the same session directory. Perhaps using a
	# relative path?
	# session.path.set = /share/Rdownload/session
	# 下载历史，包括进度信息，DHT 节点缓存
	session = /share/Rdownload/session

	# Schedule syntax: id,start,interval,command call cmd every interval seconds,
	#                  starting from start.
	# An interval of zero calls the task once while a start of zero calls it immediately.
	# Start and interval may optionally use a time format dd:hh:mm:ss
	# e.g. to start a task every day at 18:00, use 18:00:00,24:00:00.
	# Commands: stop_untied =, close_untied =, remove_untied =
	# Stop, Close or Remove the torrents that are tied to filenames that have been deleted

	# Watch a directory for new torrents, and stop those that have been
	# deleted.
	# 将 torrent 文件放到该目录自动下载
	schedule = watch_directory,10,10,load_start=/share/Rdownload/watch/*.torrent
	# 将 torrent 文件移走停止下载
	#schedule = untied_directory,10,10,stop_untied=

	# Close torrents when diskspace is low.
	# 当硬盘空间不足停止所有下载
	schedule = low_diskspace,5,60,close_low_diskspace=1000M

	# Stop torrents when reaching upload ratio in percent, when also reaching
	# total upload in bytes, or when reaching final upload ratio in percent
	# Example: stop at ratio 2.0 with at least 200 MB uploaded, or else ratio 20.0
	# 在总上传量达到 200M 的情况下上传 / 下载率达到 200%,
	# 或者在总上传量不足 200M 情况下上传 / 下载率达到 2000%, 则停止上传
	#schedule = ratio,60,60,stop_on_ratio=200,200M,2000
	#ratio.enable=
	#ratio.min.set=500
	#ratio.max.set=2000
	#ratio.upload.set=200M
	#method.set = group.seeding.ratio.command, d.close=

	# Port range to use for listening.
	# network.port_range.set = 6890-6999
	# bt 监听端口
	port_range = 42000-42000

	# Start opening ports at a random position within the port range.
	# network.port_random.set = no
	# 是否随机从上面的端口中选择
	port_random = no

	# Check hash for finished torrents. Might be usefull until the bug is
	# fixed that causes lack of diskspace not to be properly reported.
	# pieces.hash.on_completion.set = yes
	check_hash = yes

	# Set whether the client should try to connect to UDP trackers.
	# use_udp_trackers = yes
	trackers.use_udp.set = yes

	# Alternative calls to bind and ip that should handle dynamic ip's.
	#schedule = ip_tick,0,1800,ip=rakshasa
	#schedule = bind_tick,0,1800,bind=rakshasa

	# Remove a scheduled event
	# schedule_remove = "ip_tick"


	# Enable DHT support for trackerless torrents or when all trackers are down.
	# May be set to "disable" (completely disable DHT), "off" (do not start DHT),
	# "auto" (start and stop DHT as needed), or "on" (start DHT immediately).
	# The default is "off". For DHT to work, a session directory must be defined.
	#
	# dht.mode.set = auto
	dht = auto

	# UDP port to use for DHT.
	# DHT 的 UDP 端口
	# dht_port = 6881
	dht.port.set = 6882

	# Enable peer exchange (for torrents not marked private)
	#
	# protocol.pex.set = yes
	protocol.pex.set = yes
	#peer_exchange = yes

	# network.scgi.open_port = 127.0.0.1:5000
	scgi_port = 127.0.0.1:19000
	#scgi_local = /var/run/rtorrent-rpc.socket

	network.xmlrpc.dialect.set = i8
	#xmlrpc_dialect=i8
	encoding_list = UTF-8

以上配置文件非全部，如果要应用到真实环境，请拷贝完整的配置，以上只作为演示和注释使用。

## Other
BT 下载的工具有很多，qBittorrent，Transmission，rtorrent, uTorrent，等等，非常多，wiki 有一张非常详细的[对比图](https://en.wikipedia.org/wiki/Comparison_of_BitTorrent_clients)，在不同系统上都有着各自的最佳选择。对占用资源，下载效率的测试还没有来得及验证，等使用一段时间后再来更新吧。


## Android Client
记得启用之后可以使用 [[Transdroid]] Android 客户端来管理 rtorrent-pro. 可以从 Google Play Store 下载，或者从官网：

- <http://transdroid.org/latest>

安装之后在设置中添加 Server，名字，服务器类型，IP，HOST NAME，User name, password 没啥好说，这里的用户名和密码和界面上的用户名和密码一致。

在高级设置中，记得将 Port Number 设置为 **6009**, 或者使用 `Use SSL` 的话，输入 **6008**.

详细的每一步指导看[这里](https://forum.qnap.net.pl/threads/rtorrent-pro-android-mobile-tablet-notifications-management-client.24637/)

## reference

- <https://qnapclub.eu/en/qpkg/376>
- <https://github.com/rakshasa/rtorrent/wiki/Config-Guide>
