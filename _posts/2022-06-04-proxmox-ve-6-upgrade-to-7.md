---
layout: post
title: "Proxmox VE 从 6 升级到 7"
aliases:
- "Proxmox VE 从 6 升级到 7"
tagline: ""
description: ""
category: 经验总结
tags: [ proxmox, pve, pve-upgrade, proxmox-ve, debian, apt ]
last_updated: 2022-09-02 01:10:05
create_time: 2021-10-19 06:44:33
---

Proxmox VE 6.4 版本已经 [停止更新](https://pve.proxmox.com/wiki/FAQ#faq-support-table) ，只能升级到 7.x 版本了。Proxmox VE（后简称 PVE） 7.x 版本使用 Debian 11（bullseye）。

通常有两种方式升级 PVE 6.x 系统到 7.x：

- 在硬件上全新安装，然后从备份中恢复 VMs
- 通过 apt (按步骤) 在 PVE 6.x 上升级

全新安装然后恢复的方式直接看 [官网文档](https://pve.proxmox.com/wiki/Upgrade_from_6.x_to_7.0) ，这里就只总结一下原地通过 apt 方式平滑升级到 7.x 的过程。

## Preconditions

- 升级到 PVE 6.x
- 如果使用了 Hyper-converged Ceph, 需要根据 [文档](https://pve.proxmox.com/wiki/Ceph_Nautilus_to_Octopus) 将 Ceph Nautilus cluster 升级到 Ceph 15.2 Octopus
- 如果使用 Proxmox Backup Server 需要同步 [升级到 1.2 版本](https://pbs.proxmox.com/wiki/index.php/Upgrade_from_1.1_to_2.x)
- 可靠的连接，推荐使用 iKVM 或者 [[IPMI]]，或者可以直接物理访问的方式，以防止突然网络断开可能造成的问题
    - 如果只有 SSH 连接，推荐在非生产的环境中先测试升级，然后再升级生产
- 备份并验证所有 VMs 和 CTs 的完整性，防止出现问题
- 在 root 分区至少需要 4 GiB 空闲空间
- 查阅所有 [已知的升级问题](https://pve.proxmox.com/wiki/Upgrade_from_6.x_to_7.0#Known_upgrade_issues)

在更新之前，先把虚拟机全部关机，并且取消所有的自动启动。

## Step by step

使用 `pve6to7` 来检查，这个程序会检查升级必须要执行的内容，并给出建议和警告

```
pve6to7
```

确保在升级之前执行一次完整检查：

```
pve6to7 --full
```

这个脚本会检查并告警，但是默认情况下，不会对系统做任何修改，告警的问题不会自动修复，需要用户手动解决，并且需要记住 PVE 可以被高度的修改，这个脚本不会检查出所有的问题。

### 迁移重要的 Virtual Machines 和 Containers
如果有 VMs 或 CTs 不能接受在升级过程中停机，可以将他们迁移到其他节点。VM 或 CT 从低版本 PVE 迁移到高版本是兼容的。但是从高版本迁移到低版本 PVE 可能出现问题。如果要升级 PVE 集群，这一点请铭记。

### 检查网桥
升级后，网桥的 MAC 地址可能发生变化。可以通过如下两个方式解决。

#### 使用 ifupdown2
如果已经在 PVE 6 下使用了 `ifupdown2` ，那么升级到 PVE 7.x 的时候，ifupdown2 (3.1.0-1+pmx1) 版本会自动适配。

#### 使用硬编码的 MAC 地址
如果需要保留老的 MAC 地址，那么需要手动配置 `/etc/network/interfaces` ，添加 `hwaddress MAC`。可以使用 `ip -c link` 来查看网卡的 MAC 地址。默认情况下，主要的网桥叫做 `vmbr0`

```
auto vmbr0
iface vmbr0 inet static
    address 192.168.X.Y/24
    hwaddress aa:bb:cc:12:34
    # ... remaining options
```

如果安装了 `ifupdown2` ，可以使用 `ifreload -a` 来应用修改。如果使用老的 `ifupdown`，没有 `ifreload` 命令，可以重启，或者重启接口 `ifdown vmbr0` 然后 `ifup vmbr0`。注意，硬编码的 MAC 地址在更换了物理网卡之后需要手动修改。

### 更新 APT repositories
确保已经更新到 6.4

```
apt update
apt dist-upgrade
```

更新所有 Debian repository 到 Bullseye

```
sed -i 's/buster\/updates/bullseye-security/g;s/buster/bullseye/g' /etc/apt/sources.list
```

对于非订阅用户：

```
sed -i -e 's/buster/bullseye/g' /etc/apt/sources.list.d/pve-install-repo.list 
```

如果配置了 Ceph 那么也需要修改， 具体可参考官网。

然后执行：

```
apt update
```

### 升级系统到 Debian Bullseye 和 Proxmox VE 7.0
注意这一步根据不同的网络环境（bandwidth）和系统性能（filesystem's IOPS），可能会花费不同的时间，对于一个比较慢的系统可能花费 60 分钟或更多，对于高性能的 SSD 存储可能只需要数分钟。

```
apt dist-upgrade
```

在升级的过程中可能会有弹出窗口讯问是否需要替换一些配置文件，根据需要自行选择即可。

命令执行完成之后，重启系统就可以享受新的 PVE kernel 了。

## related

- [[Proxmox VE]]
- [[Ceph]]

## reference

- <https://pve.proxmox.com/wiki/Upgrade_from_6.x_to_7.0>
