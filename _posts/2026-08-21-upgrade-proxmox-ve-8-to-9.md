---
layout: post
title: "Proxmox VE 8 升级到 9 的完整流程与避坑清单"
aliases:
- "Proxmox VE 8 升级到 9 的完整流程与避坑清单"
tagline: "先跑 pve8to9，再动 apt"
description: "从一次真实的 pve8to9 --full 检查结果出发，梳理 Proxmox VE 8.4 升级到 9 的完整流程：前置条件、检查脚本读法、deb822 格式换源、dist-upgrade 时配置文件的取舍，以及 systemd-boot 元包、LVM autoactivation、网卡改名、PCI 直通、cgroup v1 移除等一系列容易踩的坑。"
category: 经验总结
tags: [ proxmox-ve, pve, debian, trixie, upgrade, virtualization, homelab, linux, apt, systemd-boot ]
create_time: 2026-08-21 16:00:00
last_updated: 2026-08-21 16:00:00
---

这两天折腾 [[Proxmox VE]] 硬盘迁移的时候，顺手看了眼版本，发现手上这台还停在 8.4，而 PVE 9 从 2025 年 8 月发布到现在已经迭代到 9.2 了。想着既然机器都拆过一遍，索性把升级也一并规划了，很多年前我写过一篇 Proxmox VE [从 6.x 升级到 7.x](https://blog.einverne.info/post/2022/06/proxmox-ve-6-upgrade-to-7.html) 的文章，当时还遇到了不少的问题，但是家里这台 PVE 单机比较简单，希望升级过程不要出什么差错。

![Proxmox VE 8 升级到 9 的检查与流程示意](https://pic.einverne.info/images/2026-08-21-16-00-00-proxmox-ve-8-to-9-upgrade.png)

这篇就把 8 升 9 的完整流程记下来。

## PVE 9 更新了什么

PVE 8 基于 Debian 12 Bookworm，PVE 9 基于 Debian 13 Trixie。这是一次大版本的底座更换，不是小修小补，所以整个升级本质上是一次 Debian 的 dist-upgrade，PVE 的组件只是跟着走。

如果你今天才动手，`apt dist-upgrade` 之后会是 9.2 这个版本（2026 年 5 月发布），组件情况大致是：Debian 13.5、Linux 7.0 内核、QEMU 11.0、LXC 7.0、ZFS 2.4，Ceph 方面 Squid 19.2.3 和 Tentacle 20.2.1 并存，新装默认用 Tentacle。这一路从 9.0 攒下来不少东西，值得升的理由主要有几个：

厚置备 LVM 共享存储终于支持快照了。以前用 iSCSI/FC 接 SAN 的人只能靠备份来做回滚点，这是个长期的痛点。

SDN 部分扩得很凶。9.0 引入了 fabrics 概念支持 OpenFabric 和 OSPF，9.2 又加上了 WireGuard 和 BGP，还有路由映射、前缀列表这些精细的路由过滤能力。做多节点互联的话变化很大。

集群资源调度器在 9.2 加了动态负载均衡，会根据节点和虚拟机的实时资源利用率自动迁移 HA 管理的虚拟机。以前 CRS 只在启动和恢复时介入，现在是持续的。

还有一些小而实在的：Web 界面终于适配了移动端，出门用手机看一眼节点状态不再是折磨；9.1 支持从 OCI 镜像创建 LXC 容器，等于把 Docker 生态的镜像直接拿来做系统容器；自定义 CPU 型号的管理搬进了 Web 界面。

## 升级前必须满足的条件

这几条是硬性的，不满足就别开始。

当前必须已经是最新的 8.4。`pveversion` 输出的版本号要是 8.4.1 或更高。如果你还在 8.2、8.3，先在 Bookworm 源上把 8.x 升到最新再说。

如果安装了 Ceph 必须保证是 Squid 19.2。`ceph --version` 确认一下，还在 Quincy 或 Reef 的话得先把 Ceph 升上去，再动 PVE 的版本。跨两个大版本同时升级是自找麻烦。

必须有带外访问手段。IPMI、iKVM 或者能物理接触到机器。这条我要特别强调，官方文档明确写了不要通过 GUI 的虚拟控制台执行升级，因为升级过程中 pveproxy 会重启，控制台连接会断，而 apt 事务被打断在中途是最难恢复的状态。如果只能走 SSH，务必先开一个 tmux 或 screen 会话，把升级命令跑在里面，这样连接断了进程还活着。

根分区至少留 5G 空闲，建议 10G 以上。以及所有虚拟机都有可用的备份。

## pve8to9 这个脚本值得认真读

PVE 提供了 `pve8to9` 这个检查工具，默认只读取信息不做任何修改，可以放心随时跑。加 `--full` 会执行更完整的一轮检查，官方建议在正式开始前至少跑一次完整版。

```bash
pve8to9 --full
```

它的输出分成几个区块：包版本、集群健康、Ceph 状态、存储配置、虚拟机检查、杂项检查，最后给一个汇总。每条结果的前缀标明了严重程度，PASS 是通过，INFO 是提示，SKIP 是不适用，WARN 是警告，FAIL 是必须修复。

正确的用法是循环：跑一次，修掉报出来的问题，再跑一次，直到 FAILURES 归零。

## 我这台机器报出来的三个问题

先说那个 FAIL：

```
FAIL: systemd-boot meta-package installed. This will cause problems on
upgrades of other boot-related packages. Remove 'systemd-boot'
```

这个坑的来源是 Debian 13 把 systemd-boot 拆成了三个包：`systemd-boot-efi` 提供 EFI 二进制文件，`systemd-boot-tools` 提供 `bootctl` 之类的工具，而 `systemd-boot` 这个元包带着安装钩子，它的 postinst 脚本会主动把 systemd-boot 装成系统引导器。

问题在于 PVE 的引导是由 `proxmox-boot-tool` 或者 GRUB 管理的。一台实际跑 GRUB 的机器上装着这个元包，升级时钩子一执行，要么把 EFI 启动顺序改到一个没有内核配置的 systemd-boot 上，要么脚本直接报错返回非零码，让整个 apt 事务在引导包这一步中断。两种结果都很难看。

动手删之前，我建议先确认这台机器到底用的哪个引导器，不要凭包列表猜。最可靠的判断依据是当前 EFI 启动项指向 ESP 上的哪个文件：

```bash
efibootmgr -v
proxmox-boot-tool status
ls -R /boot/efi/EFI
```

我这台的输出是这样：

```
Boot0000* proxmox HD(2,GPT,...)/File(\EFI\proxmox\shimx64.efi)
```

配合 ESP 里只有 `grubx64.efi`、`shimx64.efi`、`grub.cfg`，而 `proxmox-boot-tool status` 报 `/etc/kernel/proxmox-boot-uuids does not exist`，可以确定走的是 shim 到 GRUB 的链路，属于传统的 GRUB 加 fstab 挂载 ESP 的安装方式。这个 systemd-boot 包纯粹是历史遗留，删掉不影响启动。

PVE 的规律是：ZFS on root 的安装用 systemd-boot 并由 `proxmox-boot-tool` 管理，LVM 加 UEFI 的安装用 GRUB 加 shim。所以看到 LVM 布局基本就能预判是 GRUB。

删之前可以先模拟一次，确认不会牵连别的包：

```bash
apt-get -s remove systemd-boot
```

我这边的模拟结果只删一个包，因为 `systemd` 和 `proxmox-kernel-helper` 对它都只是 Suggests 级别的关系，不是硬依赖。确认之后执行：

```bash
apt remove systemd-boot
```

注意 `systemd-boot-efi` 要保留，别一起删了。反过来说，如果你确实是自己手动配置了 systemd-boot 引导，那就不要删，这时候脚本的建议不适用于你。

第二个是 WARN：

```
WARN: 1 running guest(s) detected
```

单节点没地方迁移，`qm shutdown` 关掉就是。为什么必须关：升级会替换 QEMU 二进制和内核，正在运行的虚拟机会处于「进程里跑的是旧版 QEMU，磁盘上已经是新版」的割裂状态，之后的热迁移、快照等操作都可能失败。

第三个是 NOTICE，不算错误：

```
NOTICE: storage 'local-lvm' has guest volumes with autoactivation enabled
```

PVE 9 开始，新建的 LVM 和 LVM-thin 虚拟机卷默认不再开启 autoactivation，改成由 PVE 按需激活。这个改动是为共享存储场景做的：旧行为下系统启动会激活 VG 里所有 LV，在多节点共用同一组 LUN 的环境里，两个节点同时激活同一个卷可能导致数据损坏，也会让虚拟机创建和迁移莫名其妙失败。

官方给了迁移脚本把已有卷转换过去：

```bash
/usr/share/pve-manager/migrations/pve-lvm-disable-autoactivation
```

共享存储强烈建议执行，纯本地存储可选。我这台全是本地盘，检查脚本自己也说了通常不会有问题，所以不着急。

## 开始升级

这是升级流程里操作最琐碎的一段。先确保 8.4 本身是最新的：

```bash
apt update && apt dist-upgrade
pveversion
```

这里确保输出的 PVE 版本是 `8.4.x`。然后最终跑一次 `pve8to9 --full` 确保解决了所有问题。如果检查见过中出现错误，必须先解决。

然后把 Debian 主源从 `bookworm` 改到 `trixie`：

```bash
sed -i 's/bookworm/trixie/g' /etc/apt/sources.list
sed -i 's/bookworm/trixie/g' /etc/apt/sources.list.d/*.list
```

PVE 自己的源建议直接改成 Trixie 时代的 deb822 格式。企业源写到 `/etc/apt/sources.list.d/pve-enterprise.sources`：

```
cat > /etc/apt/sources.list.d/pve-enterprise.sources << EOF
Types: deb
URIs: https://enterprise.proxmox.com/debian/pve
Suites: trixie
Components: pve-enterprise
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
EOF
```

没有订阅的话，写到 `/etc/apt/sources.list.d/proxmox.sources`，URI 换成 `http://download.proxmox.com/debian/pve`，Components 换成 `pve-no-subscription`。

用了 Ceph 的话，`/etc/apt/sources.list.d/ceph.sources` 同理，源地址指向 `ceph-squid` 目录。

改完之后用这两条命令验证：

```bash
apt update
apt policy
```

`apt policy` 能让你看清楚每个仓库的实际优先级和 suite，比单纯看 `apt update` 有没有报错靠谱得多。另外，所有 backports 相关的行都要注释掉或删掉，backports 里的包版本关系在跨大版本升级时经常打架。

如果 `apt update` 在 Ceph 源上报 401，说明订阅信息需要刷新：

```bash
pvesubscription update --force
```

## 执行升级与配置文件的取舍

正式开始：

```bash
apt dist-upgrade
```

耗时差异很大，SSD 上可能五分钟以内，机械盘上可能超过一小时。中途 dpkg 会就一批配置文件冲突征求意见，这里的选择是有讲究的，选错了不会立刻爆炸但会留下隐患。

保留你自己版本的：`/etc/issue`（登录提示，PVE 会自己重新生成）和 `/etc/default/grub`（你可能改过内核参数，比如 IOMMU 相关的设置，覆盖掉的话 [[PVE 直通 USB]] 之类的直通配置会失效）。

采用维护者版本的：`/etc/lvm/lvm.conf`（新版有必要的 thin_check 参数变化）、`/etc/chrony/chrony.conf`（时间同步配置结构变了）。

`/etc/ssh/sshd_config` 建议采用维护者版本，新版会把已废弃的 `ChallengeResponseAuthentication` 选项去掉。不过如果你自定义过 SSH 端口或者密钥认证策略，接受新版之后记得立刻检查一遍，别把自己关在门外——这种情况下保持一个已登录的 SSH 会话不要退出是保命的做法。

升级完成后再跑一次 `pve8to9`，然后必须重启。即使你升级前已经在跑 6.14 内核也要重启，因为 PVE 9 的内核是用新的编译器和 ABI 版本重新构建的，和用户空间的组件需要对齐。

## 那些真正会咬人的坑

前面几条属于流程，下面这些是环境相关的，命中哪条取决于你的机器。

网卡可能改名。这是我个人认为杀伤力最大的一条，尤其对没有带外管理的家用机器。跨大版本升级时 systemd 的可预测网卡命名规则可能变化，`enp1s0` 变成 `enp2s0f0` 这种事完全可能发生，而 `/etc/network/interfaces` 里的名字还是旧的，重启之后就是彻底失联。PVE 9 提供了 `pve-network-interface-pinning` 工具，可以把网卡固定成 `nic0`、`nic1` 这样的稳定名字，建议升级前就先做这个绑定。

说到这个，我上次就是因为换机器导致网口名字对不上而失联的，最后是靠安卓手机的 USB 网络共享救回来的，那次经历我单独写了一篇 [把 Android 手机当成 USB 无线网卡](https://blog.einverne.info/post/2026/08/android-phone-as-usb-network-adapter-and-more.html)，如果你也没有带外管理，可以提前把这招准备好。

PCI 直通可能失效。6.14 内核上有报告说部分设备的直通会失败，遇到的话可以先固定回旧内核再排查。做了显卡直通、网卡直通的机器，升级前建议先确认自己的设备型号有没有相关报告。

cgroup v1 彻底移除了。运行 systemd 230 及更早版本的容器不再受支持，具体来说就是 CentOS 7 和 Ubuntu 16.04 这类老系统的 LXC 容器，升级后起不来。手上还有这种容器的话，升级前就得先规划迁移。

`/etc/sysctl.conf` 不再被读取。Debian 13 改成只读 `/etc/sysctl.d/` 下的文件，所以你在 sysctl.conf 里写的内核参数（比如 IP 转发、网络缓冲区调优）会静默失效。要挪到 `/etc/sysctl.d/99-custom.conf` 这样的文件里。

`/tmp` 变成 tmpfs 了，大小上限是内存的一半，而且 `/tmp` 和 `/var/tmp` 会被定期清理。如果你有脚本往 `/tmp` 放大文件或者放需要跨重启保留的东西，得改。

第三方存储插件必须先适配。用了社区的存储插件的话，升级前确认插件作者已经发布了 PVE 9 兼容版本，否则存储直接不可用。GlusterFS 存储插件在 9.0 被移除了，还在用的需要提前迁移。

其他零碎的：Veeam 备份在 QEMU machine 版本 10.0 及以上会出问题，需要把虚拟机的 machine 版本钉在 `9.2+pve1`；NVIDIA vGPU 需要 GRID 18.3 以上；`maxfiles` 这个备份保留选项不再支持；`VM.Monitor` 权限被移除，如果你的 API token 或自定义角色用到了它，权限模型要重新梳理；十年以上的老硬件测试覆盖有限，部分老 AMD 平台上 Ceph 出现过非法指令错误。

升级过程中如果被审计日志刷屏，可以临时关掉：

```bash
systemctl disable --now systemd-journald-audit.socket
```

## 升级后的收尾

重启后先强制刷新浏览器，Windows 下 Ctrl+Shift+R，macOS 下 Command+Option+R。Web 界面的 JS 和 CSS 变化很大，用了缓存的旧资源会出现各种奇怪的显示问题，这是新手最容易误判成「升级失败」的现象。

然后确认版本和服务状态：

```bash
pveversion -v
systemctl status pveproxy pvedaemon pvestatd pvescheduler
```

集群环境下每个节点重复一遍前面的完整流程。全部节点都到 9 之后，HA 组会自动转换成新的 HA 规则，转换过程可以用 `journalctl -eu pve-ha-crm` 观察。

最后可以选择性地把剩下的传统格式源统一转成 deb822：

```bash
apt modernize-sources
```

这个命令会先给出预览，问你是否执行时可以回答 n 先看看它打算改什么，实际执行时旧文件会保留成 `.list.bak`，不用担心改坏。

## 最后

提醒大家，`pve8to9` 这个命令行检查，在升级之前一定要检查。系统升级的风险从来不是均匀分布的，绝大部分风险集中在引导、网络、存储这三块，而这三块恰好都是失败之后很难再连上机器去修的地方。

顺着这个思路，我给自己定了几条原则：动 apt 之前先跑检查脚本并且清零；升级前先把网卡名字固定住；确保有一条不依赖 PVE 自身服务的登录通道，无论是 IPMI 还是一台插着 USB 的安卓手机。这些准备加起来不到半小时，但它们决定了万一出事的时候，你是坐在电脑前敲几条命令，还是要抱着显示器和键盘跑去机器跟前。

我这台机器接下来的计划是先删掉 systemd-boot 元包，把闲置的那块大容量机械盘挂上做备份存储，给虚拟机做一次完整备份，然后再动升级。
