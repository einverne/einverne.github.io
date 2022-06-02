---
layout: post
title: "威联通折腾篇六：文件同步"
aliases: "威联通折腾篇六：文件同步"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, file-sync, syncthing, dropbox, resilio-sync, resilio, nextcloud, ]
last_updated:
---

文件同步应该算是 NAS 最最基本的一个服务了，但是为什么直到篇六才提到他呢，是因为威联通自带的 QSync ，嗯，虽然能用，但是，没有 Linux 客户端，虽然其他平台客户端 OK，但是作为我主力工作的平台没有同步客户端，只能 smb 挂载。而之前搞 zerotier 同局域网速度不佳，其他 [frp 内网穿透](/post/2018/06/qnap-frp-usage.html) 也最多拉一些小文件，完全做不到 Dropbox 那样无缝，无痛。

而到现在，腾讯云上的 NextCloud 已经稳定运行近半年，所以如果在威联通上装上 NextCloud 只要网络访问畅通的情况下，做到所有平台访问 NAS 应该问题不大。而说到文件同步，之前的时候还用过 [Resilio Sync](/post/2016/04/btsync-review.html) 和 Syncthing ，为什么不用这两个呢？ 一来前者确实很好用，只要手握 key ，就能够做到随时随地同步，但是这个神器 tracker 被屏蔽了，导致根本无法连接到节点，虽然有人 VPN 搞，但终究是躲猫猫的游戏，故放弃。而 Syncthing 同为开源的点对点同步工具，其实一点都不差，虽然需要用到的客户端 Linux Android 都有，但是终究不全，虽然现在好像已经有了 gtk 版本，但也不是那么好用。关于二者的具体对比可以参考后文。

## 安装 NextCloud
在 Container Station 中安装 NextCloud 相对比较容易，如果熟悉 Docker 可以直接使用 Docker Compose 文件，如果不熟悉，那直接使用 GUI 也比较方便。

安装步骤简单描述如下：

1. 打开 Container Station ，选择**创建**，然后搜索 nextcloud，选择 **Docker Hub**
2. 安装官方提供的 NextCloud 镜像。 注：以上两步可以简化为 ssh 登陆后 `docker pull nextcloud`， 如果熟悉命令行推荐使用命令行下载避免界面可能出现的各种奇怪问题
3. 等待镜像下载完成，选择从镜像创建容器
4. 修改名字为 "nextcloud"，CPU 内存等配置自己选择
5. 高级设置中，网络选择 NAT 模式，并且在下方选择一个合适的端口，比如 20080，这样以后访问 NAS 该端口就转发到 Docker 80 端口
6. 设置共享文件夹，如果使用 docker 默认的 volume ，那么会存储在一个很深的目录中，这里我选择挂载本机共享文件夹，这边到 File Station 中创建一个共享文件夹 NextCloud（注意给予其他用户访问权限），然后回到设置，新增挂载，然后本地路径选择刚刚创建的共享文件夹，然后挂载路径填写 `/var/www/html`
7. 完成创建。稍等片刻就会发现 NextCloud 共享文件夹中多出了很多容器的文件，其中 NextCloud 之后会同步的文件也在其中。

完成容器的创建之后，需要首次登录配置，在容器成功运行之后，在界面中会出现一个链接，http://<nas-ip>:20080 这样的形式，点击进入，如果一切都没问题，这边应该会出现 NextCloud 首次安装的配置，需要创建管理员和连接数据库。

这边我选择使用 NAS 宿主机的 MySQL 服务，而不像[之前使用 Docker Compose 那样](https://github.com/einverne/dockerfile) 使用 MySQL 容器，主要是 NAS 上可以方便的使用 phpMyAdmin 来管理。NAS 上 MySQL 服务端口 3306。然后还需要注意的一个配置是，在 Container Station 属性，网络属性中有一个桥接地址，该配置为 Docker 容器提供网络访问，记住这边的网关比如我的是 10.0.3.1

在 NextCloud 容器运行成功之后也可以通过在命令行中使用 `docker inspect nextcloud` 然后查看 **Gateway** 地址 `docker inspect nextcloud | grep "Gateway"` 来查看 Docker 容器的网络配置。

在 Docker 中连接宿主机 MySQL 时需要特别注意，这个时候不能使用 `localhost` 或者 `127.0.0.1`，因为这个时候 `localhost` 或者 `127.0.0.1` 会指向 Docker 容器本地的地址，需要换成宿主机，比如这里 NAS 的地址，也就是容器的网关地址，比如我这边上面查看得到的 `10.0.3.1`

填写 NextCloud 配置之前，在 phpMyAdmin 中先创建 nextcloud 用户和 nextcloud 数据库，记住用户名密码，然后在网页中的配置中填写，然后数据库地址一定需要填写 `10.0.3.1:3306` ，这边一定要记住使用容器 Gateway 地址。

选择 NextCloud 的一大原因就是因为 NextCloud 的跨平台支持太棒了，所有的平台都有非常好用的客户端。

下面是我的 Mint 上客户端和网页中同步的内容，局域网中速度还是很快的。

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/28001578967/in/dateposted/" title="nextcloud qnap docker"><img src="https://farm2.staticflickr.com/1785/28001578967_f25d1c5179_b.jpg" alt="nextcloud qnap docker"></a>

或者如果熟悉 compose 也可以使用

    version: "3"
    services:
      nextcloud:
        image: nextcloud:apache
        container_name: nextcloud
        restart: always
        ports:
          - 20080:80
        volumes:
          - /share/NextCloud:/var/www/html

确保 `/share/NextCloud` 也就是 NextCloud 共享文件夹以及创建

## Resilio Sync VS Syncthing
他们都可以免费使用，都是为了解决文件在多台设备之间同步的问题，都采用了 P2P 点对点传输技术（数据不经过第三方，从一点直接加密传输到另一点）。

### Resilio Sync
特别的，Resilio Sync 拥有近乎完美的跨平台产品线，Android、iOS、Windows Phone、MacOS、Windows、Linux、BSD、以及几乎所有的商业 NAS 操作系统都有对应的客户端。

从软件界面来说，Resilio Sync 对桌面系统和手机系统都提供了原生的客户端界面，对 Linux、BSD、NAS 等系统则提供基于网页的管理界面。

从原理上来讲 Resilio Sync 是通过官方的 Tracker 追踪服务器建立多台设备之间的连接，最终实现数据从一台设备以最快速度传输到另外一台设备。由于软件本身是闭源的，因此软件在与 Tracker 服务器连接的过程中是否会泄露用户隐私就不得而知了。

### Syncthing
有人说，Syncthing 就是为替代 Resilio Sync 而生的，它不但能实现相应的数据同步功能，它还完全开放源代码。

Syncthing 由社区驱动，即程序是由社区里的技术爱好者们共同开发的，任何人都可以参与到软件的开发中去，人人都可以看到软件的源代码。因此，社区负责人敢拍着胸脯说，我们尊重隐私、我们真正安全、我们简单好用。

然而，Syncthing 在跨平台的方面的确略逊一筹，社区仅以开发核心软件为主，如果需要某个特殊系统平台的客户端，要么你自己动手开发，要么就是等其他技术高手开发。比如苹果手机系统 iOS、Windows Phone 就没有对应版本的 Syncthing 客户端。

在软件界面方面，Syncthing 原生仅提供基于终端的命令行控制和基于网页的管理界面。移动端仅提供 Android 系统客户端。近期社区又发布了跨平台的 Syncthing-GTK 客户端支持 Linux 各发行版和 Windows 系统。

如果你想选择这两者，这里有些参考：

- 如果你需要在多种不同系统的设备之间同步数据，那么就选择 Resilio Sync;
- 如果你要同步的是机密级别数据，那么就选择 Syncthing；
- 喜欢折腾就选 Syncthing，闲麻烦就选 Resilio Sync；
- 如果你想要可靠稳定，未来有意向付费使用更多功能，Resilio Sync 是不二之选；
- 设备的硬件配置不高的情况下 Syncthing 会更轻便；
