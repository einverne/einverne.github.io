---
layout: post
title: "威联通折腾篇五：安装 Transmission 下载 BT"
aliases: "威联通折腾篇五：安装 Transmission 下载 BT"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, download, bt,]
last_updated:
---

这一篇讲在威联通上安装和使用下载工具 -- Transmission，一个知名的轻量级，跨平台，开源的 BT 下载工具。

[Transmission](https://transmissionbt.com/) 是一个 BT 客户端，提供了 Web 和命令行界面，非常适合在威联通机子上跑。威联通自身的 Download Station 根本无法用，而迅雷和百度也基本无法用。只能尝试一下这个方法了。

## 安装
如果看过之前的文章，应该知道威联通第三方的应用市场 QNAP CLUB，在其中直接能够找到 QTransmission。安装完成之后用户名密码是 qnap 和 qnap。

配置文件路径：

- `/opt/QTransmission/etc`
- `/share/CACHEDEV1_DATA/.qpkg/QTransmission/etc`

为什么有两个路径呢，是因为 opt 目录下的路径其实是一个软链接，指向真实在 `/share/CACHEDEV1_DATA/.qpkg/QTransmission` 的目录。

如果要修改 WEB 界面的端口，需要同时修改 `/mnt/HDA_ROOT/.config/qpkg.conf` 里面 QTransmission 配置的端口。

## 配置
安装完成后直接在威联通 WEB 界面上点击进入，然后使用 qnap - qnap 登录。设置限速、关闭 DHT，然后在路由器上做端口转发，保证 51413 端口开放。

使用 vi 修改配置 `vi /share/CACHEDEV1_DATA/.qpkg/QTransmission/etc/settings.json`，需要注意的是在修改配置的时候，停用 QTransmission，否则再启用 QTransmission 就会恢复到默认配置。

其他常用的配置

    "cache-size-mb": 16

然后在威联通中新建共享文件夹，配置下载保存的位置。

    "download-dir": "/share/Transmission"

等等。

配置详解见文末。

## 启动脚本
默认情况下可以尝试使用如下命令来启动和停止。

    /etc/init.d/QTransmission.sh start
    /etc/init.d/QTransmission.sh stop


## 问题
如果启动之后 51413 端口在界面上依然显示无法连接，可以尝试等待一段时间再试试。我的实际测试情况是界面上无法连接，但是实际还是能够正常工作。

### 配置监听文件夹自动下载

在配置中：

    "watch-dir": "/share/bt",  # 监听文件夹目录
    "watch-dir-enabled": true # 是否监听文件夹

即可

### 远程控制
配合 Android 上的 [[Transdroid]] 使用，需要开启远程访问控制，如果有固定的访问 IP 段，可以对应的配置，直接禁用下面两个白名单危险系数较高，慎重：

    "rpc-whitelist-enabled": false,
    "rpc-host-whitelist-enabled": false,

![Transdroid](/assets/Screenshot_Transdroid-175310.jpg)

## Transmission 配置详解
打开 Transmission 的配置能看到非常多的配置选项，这里列举一下重要的配置：

    "alt-speed-up": 500, # 限速时段上传限速值
    "alt-speed-down": 500, # 限速时段下载限速值
    "alt-speed-enabled": false,
    "alt-speed-time-begin": 540,
    "alt-speed-time-day": 127, # 时段限速日期（星期几），127 表示每天，更复杂配置参考官网。用 7 位二进制数表示，然后转换成十进制数，0000001 表示周日，1000000 表示周六，0000010 表示周一，0000100 表示周二。如果你只要在周末限速，该数应该 1000001，转换为十进制就是 65
    "alt-speed-time-enabled": true, # 启用限速，为 false 时，以上计划配置则不生效，生效时会自动禁用 alt-speed-enabled 配置，二者只能选一个
    "alt-speed-time-end": 420, # 限速时段结束时间，这个配置表示的是凌晨零点到开始时间的分钟数，比如 7:00 就是 7*60=420。需要注意的是，该时间是用的 GMT 时间，即北京时间 -8 小时。比如你计划北京时间 7 点 30 分开始，这个数字应该是（7-8+24）*60+30=1410
    "bind-address-ipv4": "0.0.0.0", # IPv4 地址绑定，一般不要改动
    "bind-address-ipv6": "::", #IPv6 地址绑定，一般不要改动
    "blocklist-enabled": true, # 启动白名单，默认不启动，需要启动改为 true
    "blocklist-updates-enabled": false,
    "blocklist-url": "http://www.example.com/blocklist",
    "cache-size-mb": 4, #缓存大小，以 MB 为单位，建议设大一些，避免频繁读写硬盘而伤硬盘，建议设为内存大小的 1/6～1/4
    "compact-view": false,
    "dht-enabled": false, #关闭 DHT（不通过 tracker 寻找节点）功能，不少 PT 站的要求，但 BT 下载设置为 true 会使得下载更好
    "download-dir": "/share/Downloads", #下载的内容存放的目录
    "download-queue-enabled": true,  # 下载队列开关
    "download-queue-size": 5, # 下载队列数量
    "encryption": 1, # 加密。指定节点的加密模式，默认 1。0 表示关闭 , 0= 不加密，1= 优先加密，2= 必须加密
    "lazy-bitfield-enabled": true, # 默认为 true，设置为 true 时可以避免某些 ISP 通过查询完整位段来屏蔽 BT，从而破解部分 ISP 对 BT 的封杀，当然不一定完全有效
    "idle-seeding-limit": 30,
    "idle-seeding-limit-enabled": false,
    "incomplete-dir": "/share/Downloads",  # 临时文件路径
    "incomplete-dir-enabled": false,
    "inhibit-desktop-hibernation": true,
    "lpd-enabled": false, #禁用 LDP（本地节点发现，用于在本地网络寻找节点）, 不少 PT 站的要求
    "main-window-height": 500,
    "main-window-is-maximized": 0,
    "main-window-width": 615,
    "main-window-x": 337,
    "main-window-y": 211,
    "message-level": 2,
    "open-dialog-dir": "/share/Download",  # 网页对话框打开的根目录
    "peer-congestion-algorithm": "",
    "peer-limit-global": 240, # 全局连接数
    "peer-limit-per-torrent": 60, # 每个种子最多的连接数
    "peer-port": 51413, # 传入端口，预设的 port 口
    "peer-port-random-high": 65535, # 传入端口随机值范围上限
    "peer-port-random-low": 49152, # 传入端口随机值范围下限
    "peer-port-random-on-start": false, # 启用随机端口，默认关闭，不建议改为 true
    "peer-socket-tos": "default",
    "pex-enabled": false, # 是否启用用户交换，默认为 true，关于 PEX，有兴趣的朋友可参考 http://en.wikipedia.org/wiki/Peer_exchange，对于只用 PT 的朋友，可以设为 false, 禁用 PEX（节点交换，用于同已与您相连接的节点交换节点名单）, 不少 PT 站的要求
    "port-forwarding-enabled": true, # 启用端口转发（uPnP），如果路由支持并且也开启了 uPnP，则路由会自动做端口映射，但是需要注意的是如果内网有几台机器同时使用 transmission，就必须更改 peer-port 值为不一样
    "preallocation": 1, # 预分配文件磁盘空间，0= 关闭，1= 快速，2= 完全。建议取 1 开启该功能，防止下载大半了才发现磁盘不够。取 2 时，可以减少磁盘碎片，但速度较慢。
    "prefetch-enabled": 1,
    "queue-stalled-enabled": true,
    "queue-stalled-minutes": 30,
    "ratio-limit": 2, # 分享率限制
    "ratio-limit-enabled": false, # 启用分享率限制，默认不启用
    "rename-partial-files": true, #在未完成的文件名后添加后缀.part,false= 禁用
    "rpc-authentication-required": true, # 远程控制需要验证，默认为需要
    "rpc-bind-address": "0.0.0.0", # 远程控制地址绑定，允许 IP 通过 RPC 访问，默认值表示任何地址都可以访问
    "rpc-enabled": true, # 启用远程控制，默认启用
    "rpc-host-whitelist-enabled": true, # 是否开启主机白名单
    "rpc-host-whitelist": "", # 白名单，如果需要远程访问，最好配置
    "rpc-password": "{cxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxaE", #web-ui 的密码，可直接修改，重新运行或者 reload 服务的时候密码会自动 HASH 增加安全性
    "rpc-port": 9091, # 默认 web-ui 的 port 口，也是远程控制端口，可自行更改
    "rpc-url": "/transmission/",
    "rpc-username": "transmission", #默认登入名称，也是远程控制用户名
    "rpc-whitelist": "127.0.0.1", # 远程控制白名单，默认值为所有地址，支持通配符*，如 192.168.2.*
    "rpc-whitelist-enabled": true, # 启用远程控制白名单，如果启用，则仅仅上面列出的地址可以远程连接
    "scrape-paused-torrents-enabled": true,
    "script-torrent-done-enabled": false,
    "script-torrent-done-filename": "/home/",
    "seed-queue-enabled": false,
    "seed-queue-size": 10,
    "show-backup-trackers": true,
    "show-extra-peer-details": false,
    "show-filterbar": true,
    "show-notification-area-icon": false,
    "show-options-window": true,
    "show-statusbar": true,
    "show-toolbar": true,
    "show-tracker-scrapes": true,
    "sort-mode": "sort-by-age",
    "sort-reversed": false,
    "speed-limit-down": 300, #平时的下载限速
    "speed-limit-down-enabled": true, #启用平时下载限速
    "speed-limit-up": 30, #平时上传限速
    "speed-limit-up-enabled": true, #启用平时上传限速
    "start-added-torrents": false,
    "statusbar-stats": "total-ratio",
    "torrent-added-notification-enabled": true,
    "torrent-complete-notification-enabled": true,
    "torrent-complete-sound-enabled": true,
    "trash-can-enabled": true,
    "trash-original-torrent-files": false,
    "umask": 18,
    "upload-slots-per-torrent": 14
    "utp-enabled": true, #启用μTP 协议
    "watch-dir": "/share/bt",  # 监听文件夹目录
    "watch-dir-enabled": false # 是否监听文件夹

跟多的详细配置可以参考官网[文档](https://github.com/transmission/transmission/wiki/Editing-Configuration-Files)

## Add tracker
选择合适的 [[Tracker]] 可以显著的提升下载体验。
可以从下面两个地址中找到每天更新的 Tracker 服务器地址：

- <https://github.com/ngosang/trackerslist>
- <https://github.com/XIU2/TrackersListCollection>、<https://trackerslist.com/>

写一个[脚本](https://github.com/oilervoss/transmission/blob/master/addtracker.sh)，使用 transmission-remote 命令添加到 bt 。

- <https://trackerslist.com/all.txt>

## 更换 Web Control 页面
这里有一个更强大的网页界面。

- <https://github.com/ronggang/transmission-web-control>

默认的 Transmission 安装的地点是：`/share/CACHEDEV1_DATA/.qpkg/QTransmission/` 进入该目录，然后进入 /`/share/transmission/` 完整路径如下：

	/share/CACHEDEV1_DATA/.qpkg/QTransmission/share/transmission/

在该目录中有一个 `web` 文件夹，这个文件夹就是要被替换的前端界面。

- 先将原来 web 目录中的 index.html 重命名成 index.original.html `mv web/index.html index.original.html`
- 备份 web 整个目录，以防万一
- 用 wget 从 Github 下载整个项目，得到一个 zip 文件
- `unzip xxx.zip` 解压该文件
- 然后将 github 项目中的 src 文件夹拷贝到 web 文件夹中（做好备份工作）

## Other
如果在 QNAP 上开启了远程控制，那么在桌面版系统上可使用这个 Remote control [GUI](https://github.com/transmission-remote-gui/transgui)，可以有更多的功能。

Android 推荐使用 [Transdroid](http://www.transdroid.org/) 来管理。之后在做一下管理端口映射，那就可以无论在哪里都能远程管理了。

## reference

- [官网](https://transmissionbt.com/)
