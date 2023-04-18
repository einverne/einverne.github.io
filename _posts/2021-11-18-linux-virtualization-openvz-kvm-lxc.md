---
layout: post
title: "Linux 虚拟化技术 OpenVZ KVM LXC 对比"
aliases: 
- "Linux 虚拟化技术 OpenVZ KVM LXC 对比"
tagline: ""
description: ""
category: 经验总结
tags: [ linux, linux-virtualization, ovz, kvm, lxc ]
last_updated: 2023-04-18 09:57:13
create_time: 2021-11-18 09:41:29
---

介绍一下 Linux 下常见的虚拟化技术。

- OpenVZ
- KVM
- LXC
- Xen

## OpenVZ

OpenVZ 是一种基于 Linux 内核的虚拟化技术，它允许在单个物理服务器上运行多个独立的 Linux 系统实例，每个实例都可以拥有自己的 IP 地址、文件系统、进程等。OpenVZ 使用容器技术实现虚拟化，相比于传统的虚拟机技术，它的性能更高、开销更小，因为它不需要模拟硬件，而是直接利用宿主机的资源。OpenVZ 还提供了一些管理工具，如 vzctl 和 vzlist，方便用户管理和监控容器。

OpenVZ（通常简写成 [[OVZ]]） 只能虚拟化 Linux 操作系统，但是 KVM 可以虚拟化 Linux，Windows，和其他操作系统。

OpenVZ 使用共享的 kernel，所有虚拟化 VPS 中的用户都使用同一个 kernel，因此 kernel 是不可自定义的。

一旦你使用的 RAM 达到了 host 分配的额度，那么剩下的 RAM 就是自由竞争的。如果你运行一些小型程序可能不是问题，但是一定你运行资源密集型程序就可能产生问题。

## KVM

KVM 是 Kernel-based Virtual Machine 的缩写，是一个基于内核的虚拟化技术。借助 KVM 可以将 Linux 主机隔离成多个可以独立运行的虚拟环境，即虚拟机。

KVM 允许在单个物理服务器上运行多个独立的虚拟机，每个虚拟机都可以运行不同的操作系统。KVM 使用硬件辅助虚拟化技术，即 Intel VT 或 AMD-V，来提高虚拟机的性能和安全性。KVM 还提供了一些管理工具，如 virt-manager 和 virsh，方便用户管理和监控虚拟机。由于 KVM 是一种完全虚拟化技术，因此它可以运行几乎所有的操作系统，包括 Windows 和其他非 Linux 操作系统。

KVM 是 Linux 的一部分，Linux 2.6.20 版本及之后的版本包含了 KVM。KVM 在 2006 年首次公布，并且之后持续在更新和维护。

与 VMwareESX/ESXi、微软 Hyper-V 和 Xen 等虚拟化产品不同，KVM 的思想是在 Linux 内核的基础上添加虚拟机管理模块，重用 Linux 内核中已经完善的进程调度、内存管理、IO 管理等代码，使之成为一个可以支持运行虚拟机的 Hypervisor。因此，KVM 并不是一个完整的模拟器，而只是一个提供了虚拟化功能的内核插件，具体的模拟器工作需要借助 QEMU 来完成。

KVM 允许你设置使用资源的最小和最大值，这样虚拟化的系统就只能使用这些资源。并且在 KVM 下，RAM，CPU 和硬盘资源都是直接分配给用户，用户可以完全使用这些资源，而不用担心其他虚拟化机器的竞争。

KVM 提供了一个隔离的环境，用户可以自行替换 kernel。

### QEMU

KVM 不是一个完整的虚拟机，而是借助 QEMU 来完成虚拟化过程。KVM 是 Linux kernel 的一个模块，通过命令 `modprobe` 去加载 KVM 模块。加载模块之后，才能通过其他工具创建虚拟机。仅有 KVM 模块不行，用户还需要开源的虚拟化软件 QEMU。

## LXC

LXC，一般指 Linux Container，即内核容器技术的简称。LXC 将 Linux 进程沙盒化，使得进程之间相互隔离，并且能够控制各进程的资源分配。

LXC（Linux Containers）是一种基于 Linux 内核的容器化技术，它允许在单个物理服务器上运行多个独立的 Linux 系统实例，每个实例都可以拥有自己的文件系统、进程等，但它们共享宿主机的内核。LXC 使用轻量级的虚拟化技术，相比于传统的虚拟机技术，它的性能更高、开销更小，因为它不需要模拟硬件，而是直接利用宿主机的资源。LXC 还提供了一些管理工具，如 lxc-start 和 lxc-stop，方便用户管理和监控容器。LXC 可以用于构建轻量级的虚拟化环境，比如用于开发、测试、部署等场景。

[Linux 容器项目（LXC）](https://linuxcontainers.org/)提供了一组工具、模板、库和语言绑定。LXC 采用简单的命令行界面，可改善容器启动时的用户体验。

LXC 提供了一个操作系统级的虚拟化环境，可在许多基于 Linux 的系统上安装。在 Linux 发行版中，可能会通过其软件包存储库来提供 LXC。

在 Linux 内核中，提供了 cgroups 功能，来达成资源的区隔化。它同时也提供了名称空间区隔化的功能，使应用程序看到的操作系统环境被区隔成独立区间，包括进程树，网络，用户 id，以及挂载的文件系统。但是 cgroups 并不一定需要引导任何虚拟机。

LXC 利用 cgroups 与名称空间的功能，提供应用软件一个独立的操作系统环境。LXC 不需要 Hypervisor 这个软件层，软件容器（Container）本身极为轻量化，提升了创建虚拟机的速度。软件 Docker 被用来管理 LXC 的环境。

## Xen

Xen 最初是剑桥大学 Xensource 的开源项目，2003 年发布首个版本，2007 年 Xensource 被 Citrix 公司收购，开源 Xen 由 xen.org 继续维护。

Xen 是一种基于虚拟机监控器（Hypervisor）的虚拟化技术，它可以在一台物理服务器上运行多个独立的虚拟机，每个虚拟机都可以运行不同的操作系统。Xen 使用硬件辅助虚拟化技术，即 Intel VT 或 AMD-V，来提高虚拟机的性能和安全性。Xen 的虚拟机监控器可以直接访问物理硬件，而虚拟机则运行在虚拟化的环境中，因此可以获得接近于原生系统的性能。Xen 还提供了一些管理工具，如 xm 和 xl，方便用户管理和监控虚拟机。Xen 可以用于构建高性能、高可用性的虚拟化环境，比如用于云计算、虚拟桌面、数据库等场景。

我所购买的 [servaRICA](https://gtk.pw/rica) 就是 Xen 的虚拟化计数。

Xen 是运行在裸机上的虚拟化管理程序（HyperVisor)。

Xen 会在 Guest VM 边上运行着管理端 VM，Xen 称这个 VM 为 Dom0，虚拟机操作系统叫做 DomU。这个管理 VM 会负责管理整个硬件平台的所有输入输出设备，半虚拟化中 Hypervisor 不对 IO 设备做模拟，只对 CPU 和内存做模拟。

半虚拟化还有一个叫法：操作系统辅助虚拟化（OS Assisted Virtualization），这是因为 Guest VM 自身不带设备驱动，需要向“管理 VM”寻求帮助。这种虚拟化技术允许虚拟化操作系统感知到自己运行在 XEN HyperVisor 上而不是直接运行在硬件上，同时也可以识别出其他运行在相同环境中的虚拟机。
