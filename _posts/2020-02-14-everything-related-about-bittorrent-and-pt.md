---
layout: post
title: "关于 BitTorrent 和 PT 你需要知道的一切"
tagline: ""
description: ""
category:
tags: [bt, pt, bittorrent, torrent, dht, distribute-system, magnet-link, file-sharing, ]
last_updated:
---



## 几个 bt 中经常见到的词汇
bt 其实是 BitTorrent 的缩写，后文为了描述简单统一简称为 bt。

BitTorrent 协议由美国程序员布莱姆·科亨在 2001 年发布。

### peer
peer 可以理解成节点，或者等同于 client 客户端。只要你在本地打开了 bt 软件，连接了 swarm，有数据传输，就可以认为是一个 peer. 严格的来说，peer 指的是还未下载完成的节点。但通俗的就认为所有连接到 swarm 的客户端都叫做 peer，这个意义上， peer 和 client 有着相同的含义，并不区分是否完成了整个 torrent 的下载。

用英文来解释 peer 是，a person who has the same social status as you，地位同等的人，相互平等的人，同辈。

### Swarm
swarm 是一个用来描述当前分享的 torrent 的所有可连接的 peers 的术语，换句话说，一个 swarm 也就是当前对同一个种子文件正在交换数据的 peers. 在 bt 最初的协议中 peers 需要请求 tracker 来获取 swarm，也就是当前可连接的 peers 列表。

### Tracker
当一个 peer 想要加入某一个特定的 torrent 时，需要有几个初始化的操作。首先需要知道有哪些 peers 正在分享着改 torrent，以便于开始连接和传输数据。根据 BitTorrent 最初的协议，初始化过程由 Tracker 提供。后来演化过的 BT 协议又加入了其他的方法，比如说 DHT.

BitTorrent Tracker 是一个 http/https 服务，通过 BitTorrent 协议间接的和 peers 连接，它可以追踪哪些 seeds 和 peers 在一个 swarm 中。为了初始化下载，客户端首先要和 Tracker 通信，获取一个当前可连接的 peers 列表，这些 peers 都在同一个 torrent 的 swarm。Tracker 实际上并不参与任何数据的传输，并且也没有 torrents 数据的备份。一旦 peers 列表获取成功，peer 通信就可以不依赖 Tracker 进行。但是 clients 会周期性地向 Tracker 发送数据报告，并换取新节点的信息。

基本上，Tracker 就是一台回应 HTTP GET 请求的服务器，请求中包含客户端整体传输的数据。回应信息包括一个 peers 列表，让 peers 参与 torrent 传输。URL 包含在 torrent 文件的 metadata 的 announce URL 中。其他参数被附加到该 URL 后。

Tracker 服务器不能和 BitTorrent Index server 混为一谈。BitTorrent Index 是一个用来存放 torrent 文件的服务器，通常包含了种子文件的基本信息及描述等等。

### Seeds and Seeding
A seed is a peer that has a complete copy of the torrent’s contents and keeps uploading it.

### Super-seeding(initial seeding)

Super-seeding, 或者又被叫做，初始做种 (initial seeding) 是一种为了节省带宽而设计的技术。试想一下，当你是种子发布者，并且第一将种子发布到网上时，种子的复制可能会很慢，因为初始的做种者会将同一块数据发送给不同的 peers，而其他块可能还没有被上传。为了防止这种情况，一些客户端可以开启 super-seeding 模式，这时会优先发送还没有被上传的数据块，通过算法来保证上传一个种子尽可能的节省带宽。[^1]

[^1]: <http://bittornado.com/docs/superseed.txt>

当你是种子的发布人，并且没有其他做种者时，开启初始做种就会将自己伪装成下载者并检测其他下载已经完成的部分，仅传输所有人都缺少的部分，一般出种所需流量与资源大小差不多，普通做种可能需要两倍流量。一般在 PT 中不需要开启初始做种，因为，开启后上传速率和上传量和未开启前比较会显著下降，很多人会因为其中一个人带宽不好而无法尽快出种。因此初始做种通常用于公网 BT。

### DHT
DHT(Distributed Hash Table) 网络用来寻找在 swarm 中的 peers 的 IP 地址，用来取代了 Tracker 的功能。DHT 允许通过 info hash 来查询 peers，而不需要通过 Trackers.

DHT 是分布式系统的一种，它通过一个类似 hash table(key,value) 的查询服务。任何参与的节点都能迅速的获取到 key 关联的信息。维护从键到值的映射的责任分布在 DHT 网络的各个节点中，以这样一种方式，这样的更改将导致最小程度的中断。这使 DHT 网络可以扩展到非常多的节点，并处理连续的节点到达，离开和故障。[^hash]

[^hash]: <https://en.wikipedia.org/wiki/Distributed%20Hash%20Table>

在原始的 BitTorrent 设计中，Tracker 是初始化时必须要经过的步骤，并且 Tracker 被部署在网络的单一节点上。这就意味着，BitTorrent 会有单点故障，这也是 BitTorrent swarm 的阿喀琉斯之踵，如果 Tracker 故障，那么 peers 就无法相互知道，结果就是 torrent 死掉。而在 DHT 网络中，这个问题就不存在。二者的差别在于，不像 Tracker，DHT 不依赖于一个单一机器来初始化 peers 的连接，而是将 DHT 网络中所有的节点都认为是潜在的节点，因此提供了容错机制。在 DHT 网络中初始化机制包括了一些冗余的机制：

- 使用一些著名的或者广泛熟知的 DHT 节点
- 使用一组 BitTorrent 客户端退出时缓存的节点
- 使用一组 torrent 文件中的 bootstrap 节点
- 从 swarm 中下载至少包含一个 peer 的 torrent，然后交换 UDP 端口

一旦获取到一个节点，客户端可以使用该节点在 DHT 网络中找到更多的节点，然后就可以用 DHT 节点来获取 peers 完成下载。[^dht]

[^dht]: <http://wiki.bitcomet.com/using_dht_tracker>

### Peer Exchange (PEX)
在 BitTorrent 文件共享网络中，Peer Exchange 用来维持共享同一个 torrent 的一组 peers. 在原始的 BitTorrent 协议中， 所有的 peer 都需要依赖 Tracker 来获取一组 peers. Peer Exchange 允许一组 peers 中的成员自己在 swarm 中交换群组成员信息，也就意味着可以减少对 Tracker 的依赖，减少对 Tracker 的轮询，也就减少了 Tracker 的负载。

Peer Exchange 并没有完全的消除对 Tracker 的依赖，一个 peers 第一次要加入给定 torrent 的 swarm，它必须联系 Tracker 来找到该 torrent 的一组 peers.


### Magnet Links
根据原始的 BitTorrent 网络协议，.torrent 文件是从 torrent 网站（通常是索引网站）下载的。下载文件后，BitTorrent 客户端会从.torrent 文件中计算信息密钥的 20 字节 SHA-1 哈希，它会在对跟踪器（或 DHT​​网络）的查询中使用该 ID 来唯一地识别种子并找出共享该 torrent 的其他对等方的 IP 地址，随后它将连接并下载.torrent 文件中的内容。

Magnet Links 更进一步，info-hash 值已经被计算得到。因此当使用一个 Magnet Link, BT 客户端可以得到 info-hash。然后 BT 客户端可以通过该 hash，在 DHT 网络中查询，找到网络中同样共享着这个 torrent 的 peers。然后客户端会从其他 peers 那边下载这个 torrent 文件。一旦获取到 torrent 文件，后面就是熟悉的流程了。

可以看到客户端依然需要依赖 .torrent 文件来完成初始化过程，因为 torrent 包含着下载需要的必不可少的信息，但是可以看到，不再需要依赖一个 Tracker 服务器，你甚至可以不需要从网站上下载一个 .torrent 文件，在 DHT 网络中就存在。

然而，请注意，Magnet Links 不能消除对 torrent 文件的依赖。 然而，他们可以减少种子索引网站的负载，也可能有更好的机会让一个种子活着，因为一旦 .torrent 文件在 DHT 网络上，它理论上不需要在网站上下载；, 你所需要的只是一个 Magnet Lins, 并且，如果原始站点上的 torrent 下载中断或不再提供它，Magnet Links 更有可能在 Internet 上传播的。
在更大范围内，Magnet Lins 的优势在于其开放性和平台独立性带来的多功能性；几乎在任何操作系统上，都可以使用为不同网络和协议设计的完全不同的客户端应用程序来下载资源相同的磁链接（前提是该资源在那些网络上可用）。可以同时从多个网络中搜索和检索相同资源的多网络客户端也是如此，所有这些都具有单个磁链。

另外，由于 Magnet Lins 是纯文本的，因此可以简单地将链接复制并粘贴到：电子邮件，即时消息，博客或其他社交网络媒体中，以实现非常快速的分发；

Magnet Links 由一系列一个或多个参数组成，其顺序并不重要，其格式与许多 HTTP URL 末尾的查询字符串相同。最常见的参数是“ xt”，表示“确切主题”，通常是由特定文件的内容哈希形成的

比如：

    magnet:?xt=urn:btih:b0a8dbd866c5f6d2b619f17e1988f46bdace72ba&dn=Absolute+OpenBSD+-+UNIX+For+The+Practical+Paranoid

这个例子中，`xt` 参数是资源的十六进制 SHA-1 ，`dn` (display name) 是一个可读的名字。

Magnet Links 实现的第一版需要 BitTorrent hash 值包括一个 Base32 的编码，后来改成了 hex encoding ，这也是目前官方的 BitTorrent specifications 建议的格式。[^bt]

[^bt]: <http://www.bittorrent.org/beps/bep_0009.html#magnet-uri-format>


### Peer DL
Peer DL.

Peer Download Rate is an estimated rate at which the peer is downloading based on the peer's reported change in pieces obtained. This estimation is very crude and is most likely inaccurate, so it should only be lightly relied upon.

## 几个 PT 站相关的概念

### 分享率
分享率是几个概念中比较好理解的一个，顾名思义就是上传量 / 下载量的比率。因为 BitTorrent 鼓励分享，所以这个比率反映着每一个用户的分享比例。

一般的站点会有如下的要求：

当以下情况时将被自动降至本级：

1. 如果你已经下载了超过 50GB，你应该有大于 0.6 的分享率。
2. 如果你已经下载了超过 100GB，你应该有大于 0.7 的分享率。
3. 如果你已经下载了超过 200GB，你应该有大于 0.8 的分享率。
4. 如果你已经下载了超过 500GB，你应该有大于 0.9 的分享率。
5. 如果你已经下载了超过 1000GB，你应该有大于 1.0 的分享率。

如果没有达到要求就会被 BAN 掉，因分享率不达标而收到系统自动警告的情况下，默认的警告的期限是一周，一周结束后警告标志才会消失。

### H&R

H&R 是 Hit and Run 的缩写，表示下载完资源后在规定时间内没有完成最少做种时间的行为，简单说就是“下完就跑” 实行 H&R 考核是为了提高资源保种率，使老资源不断种。

	HR 未达标数 >= 10, 将被 BAN.

H&R：0/0 解析为，（要做种的种子数『显示数字为黑色』)/ 未达标（在规定时间内没完成做种时间的种子数『红色数字显示』)

### 魔力值
按照作种时间和数量计算得到，魔力值的计算有一个非常复杂的公式，在这里研究这个公式也并不显示，要提升魔力值最好的方法就是作种，并且需要一定量地作种，然后经常在论坛中交流就行，没多久就会发现魔力值会平稳增长。

下面是有人总结出来的一些可控的增长魔力值的方法，不同站点可能并不相同，所以参考一下即可，不必太认真。

- 发布新种子 = 30 个魔力值
- 上传一个字幕 = 15 个魔力值
- 发布新主题 = 2 个魔力值
- 回复帖子 = 1 个魔力值
- 发布种子、候选的评论 = 1 个魔力值
- 参与一次调查投票 = 1 个魔力值
- 参与一次候选投票 = 1 个魔力值
- 参与一次趣味盒投票 = 1 个魔力值
- 说谢谢 = 1 个魔力值 （有的站是 0.5 个魔力值）
- 收到感谢 = 1 个魔力值发布的趣味盒内容获得用户较高的评价

#### 提高魔力值的方法
在了解了魔力值的计算公式后，提升魔力值的方法自然也就有了，因为魔力值依赖作种，所以作种数越多那么魔力值提升也就越快，那么如何快速作种呢，有一个快速简单的方法，就是将种子列表根据大小排序，然后从小到大把自己感兴趣的小种子全部下载下并长期挂着作种。另外不要吝啬任何给予别人感谢的机会，在鼓励别人的同时，自己也能获得一定的魔力。

### 做种率
往往有些时候 PT 新人考核的时候第一项就是做种率，这个是一个比较好理解的概念，做种率就是作种时间和下载时间的比率。所以要提高做种率，就是要以最快的速度下载，并且以最长时间作种，或者和魔力值的获取方法相似，作种比较小的种子，因为下载快，所以做种率相对于体积比较大的种子会有很多优势。

## PT 站生存指南
PT, 也就是 Private BitTorrent, 私有的 Tracker，只有特定人群可以连接的 BitTorrent Network.

### 如何提高分享率
顾名思义，就是上传量 / 下载量的比率，规则中对分享率是有要求的。在保持网络畅通的情况下，达成下载是可控的，只有找几个非免费的，并且作种人数比较多的种子，基本下载就可以达到，但是上传量并不是那么容易完成。

首先要大致知道 bt 的基本原理，简单的来说 BitTorrent 是一个 peer-to-peer file sharing，点对点文件共享的协议。知道这个后，就很容易的理解，上传，下载，分享了。

要提高分享率，也就是要增大分子，上传量，在下载量（分母）可控的情况下，如何提高上传呢？下面就是几个技巧。

### Free&2x 种子不要错过
Free 优惠的种子千万不要错过。

### 主动分享
制作种子，主动分享的内容，所有人都会从分享者这边获取，也就意味着能够控制上传量。但制作种子对新手来说有一些难度，所以新手可以继续往下看。


### 下载热门新种
对于没有人下载的种子，那么下载的时候只有一个人，那么你的本地文件也就没人连过来下载，自然也就没有上传量。而对于刚发布的种子，因为作种的人相对较少，而下载的人多，所以只要连上 peers，你本地的部分自然就会有人从你的本地获取，自然就有了上传。

为了攒上传，所以在选择种子时记得找免费的，上传人数少（新种），下载人数多（热门）的。


### 下载冷门好种
当热门种子被大不分人下载并作种后，如果还下载热门种子，那基本上只有下载速度，并且可能跑满带宽，但是上传可能就不多了，因为同时在下载的人有非常多已经完成的节点可以连接，而并没有多少人连到你的机器下载，所以你的上传就没了。

### 在硬盘空间足够的情况下下载大种子
种子越大下载的时间越多，通常能有不错的上传。

### 保持作种
提高分子的另外做法就是 24h 保持作种，可能本地的作种目前没有人在下载， 但是无法保证之后没有人来下载，所以为一些冷门的好种作种不时的就可能有人能连过来给增加上传。


## 通过软连接来辅种
都知道如果相同的文件，被封装制作成不同的 torrent，那么在下载时，客户端只会对相同的文件进行校验。而如果一旦目录结构变化了，那么就会重新下载。这个时候利用软连接来连接目录结构就能校验同一个文件。

举一个简单例子，比如 A.torrent 和 B.torrent 都是对文件 resource 的种子，但是在制作 torrent 时 A, B 种子分别是对 `dir_a/resource` 和 `dir_b/resource` 两个文件夹下的 resource 制作的种子。那么在下载时，即使是同一个文件，那么在下载时也会分别下载到两个文件中。如果想要本地文件中只有一份 resource 那么可以先下载 A.torrent 那么在本地就有了 `dir_a` 目录，此时用 `ln -s` 来制作软连接：

	ln -s dir_a dir_b

然后再下载 B.torrent 时，会发现客户端只会对文件进行校验，而不会重新下载 resource 了。

当然如果是文件名不一致，也可以利用 ln 来软连接一个新的文件，达到同样的效果。

## Extend
一款用來輔助 PT 的 Chrome 插件：

- <https://github.com/ronggang/PT-Plugin-Plus>

一键生成媒体信息：

- <https://api.rhilip.info/ptgen.html>


最后，个人也搭建了一个[私人的 PT](https://pt.gtk.pw)，分享一些电影、图书、综艺，欢迎来玩。

## reference

- <https://wiki.theory.org/index.php/Main_Page#Metainfo_File_Structure>
- <http://wiki.bitcomet.com/peers_seeds_torrent_tracker_dht_peer_exchange_pex_magnet_links>

