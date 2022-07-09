---
layout: post
title: "从 VMware Fusion 中迁移虚拟机到 VMware Workstation"
aliases: "从 VMware Fusion 中迁移虚拟机到 VMware Workstation"
tagline: ""
description: ""
category: 经验总结
tags: [vmware, vmware-workstation, vmware-fusion, virtual-machine, vm, windows ]
last_updated:
---

用了半年多 macOS，虽然不错，但工作用还是觉得 Linux 比较顺手，所以经过了半年时间还是从 macOS 切换回了 Linux。然而需要解决的一个问题便是我之前的 macOS 上使用 VMware Fusion 的个人授权安装了一个 Windows 用来进行一些调试，现在有一些配置因为需要依赖外部人员进行操作，证书之类的，只能想办法把 Fusion 上的虚拟机转移到 Linux 下的 VMware Workstation 中。

## 前提知识
在正式迁移之前先了解一下磁盘上的几类文件，这些文件都是和 VMware 虚拟机相关的。

### VMX 文件
VMware 虚拟化软件比如 VMware Workstation 和 VMware Fusion 的配置文件。

存储使用「新建虚拟机向导」创建的虚拟机设置；包括内存、硬盘和处理器限制等。

VMX 文件使用纯文本格式保存，并包含配置 `属性=值`。

比如，内存限制是

    memsize = "2048"

表示虚拟机允许的最大内存为 2G。

Fusion 保存的 VMX 文件通常存储在 `.vmwarevm` 包内。

### VMDK 文件
VMDK 文件表示 `Virtual Machine Disk`，是 VMware 虚拟机的虚拟硬盘格式。通常 `vmdk` 文件包含这虚拟机所需要的所有文件。


## 导出
经过一些调研，虽然 [VMware的官网](https://docs.vmware.com/en/VMware-Fusion/12/com.vmware.fusion.using.doc/GUID-16E390B1-829D-4289-8442-270A474C106A.html) 写着可以通过菜单里面的 Export 来将虚拟机导出成 OVF 格式，但是我一查发现我用的并不是 Fusion Pro 版本，也没有这一个选项。

所以只能另找办法，后来发现有人发现了 VMware 这个命令行工具可以进行转换。

```
cd /Applications/VMware\ Fusion.app/Contents/Library/VMware\ OVF\ Tool/

./ovftool  <PATH TO SOURCE VM's .vmx file>   <PATH TO OUTPUT ova file>

# example

./ovftool --acceptAllEulas ~/Documents/Virtual\ Machines.localized/CentOS\ 6.5.vmwarevm/CentOS\ 6.5.vmx      /tmp/CentOS6.5.ova
```

但还没进行尝试，就发现原来 VMware Workstation 和 Fusion 只是两个操作系统上的不同实现，其实虚拟机部分还是相同的，查看其硬盘上的文件，发现结构类似，文件类型也差不多，所以就萌生了先 `scp` 导过来看一下能不能直接使用的想法，经过一段时间的拷贝，发现 Linux 下的 Workstation 可以直接识别。

## 问题 {#questions}
在迁移了 Windows 第一次启动的时候，报了一个错：

> was created by a VMware product that is incompatible with this version of VMware Workstation and cannot be used.
Cannot open the configuration file.

这个错一看就知道可能是版本不兼容的问题，我的 Fusion 是最新的 12 版本，而 Workstation 则是很多年前安装的 15 版本。后来查到可以通过修改 `vmx` 配置文件解决。

修改 `vmx` 中的 `virtualHW.version` 版本到一个比较低的版本即可。

二者对应的版本可以通过如下这张表进行查看。

<table><tbody><tr><td colspan="1" rowspan="1"><strong>Virtual Hardware Version</strong></td><td colspan="1" rowspan="1"><strong>Products</strong></td></tr><tr><td colspan="1" rowspan="1">19</td><td colspan="1" rowspan="1">ESXi 7.0 U2(7.0.2)</td></tr><tr><td colspan="1" rowspan="1">18</td><td colspan="1" rowspan="1">ESXi 7.0 U1 (7.0.1)<br>Fusion 12.x<br>Workstation Pro 16.x<br>Workstation Player 16.x</td></tr><tr><td colspan="1" rowspan="1">17</td><td colspan="1" rowspan="1">ESXi 7.0&nbsp; (7.0.0)</td></tr><tr><td colspan="1" rowspan="1">16</td><td colspan="1" rowspan="1">Fusion 11.x<br>Workstation Pro 15.x<br>Workstation Player 15.x</td></tr><tr><td colspan="1" rowspan="1">15</td><td colspan="1" rowspan="1">ESXi 6.7 U2</td></tr><tr><td colspan="1" rowspan="1">14</td><td colspan="1" rowspan="1">ESXi 6.7<br>Fusion 10.x<br>Workstation Pro 14.x<br>Workstation Player 14.x</td></tr><tr><td colspan="1" rowspan="1">13</td><td colspan="1" rowspan="1">ESXi 6.5</td></tr><tr><td colspan="1" rowspan="1">12</td><td colspan="1" rowspan="1">Fusion 8.x<br>Workstation Pro 12.x<br>Workstation Player 12.x</td></tr><tr><td colspan="1" rowspan="1">11</td><td colspan="1" rowspan="1">ESXi 6.0<br>Fusion 7.x<br>Workstation 11.x<br>Player 7.x</td></tr><tr><td colspan="1" rowspan="1">10</td><td colspan="1" rowspan="1">ESXi 5.5<br>Fusion 6.x<br>Workstation 10.x<br>Player 6.x</td></tr><tr><td colspan="1" rowspan="1">9</td><td colspan="1" rowspan="1">ESXi 5.1<br>Fusion 5.x<br>Workstation 9.x<br>Player 5.x</td></tr><tr><td colspan="1" rowspan="1">8</td><td colspan="1" rowspan="1">ESXi 5.0<br>Fusion 4.x<br>Workstation 8.x<br>Player 4.x</td></tr><tr><td colspan="1" rowspan="1">7</td><td colspan="1" rowspan="1">ESXi/ESX 4.x<br>Fusion 3.x<br>Fusion 2.x<br>Workstation 7.x<br>Workstation 6.5.x<br>Player 3.x<br>Server 2.x</td></tr><tr><td colspan="1" rowspan="1">6</td><td colspan="1" rowspan="1">Workstation 6.0.x</td></tr><tr><td colspan="1" rowspan="1">4</td><td colspan="1" rowspan="1">ESX 3.x<br>ACE 2.x<br>Fusion 1.x<br>Player 2.x</td></tr><tr><td colspan="1" rowspan="1">3 and 4</td><td colspan="1" rowspan="1">ACE 1.x<br>Lab Manager 2.x<br>Player 1.x<br>Server 1.x<br>Workstation 5.x<br>Workstation 4.x</td></tr><tr><td colspan="1" rowspan="1">3</td><td colspan="1" rowspan="1">ESX 2.x<br>GSX Server 3.x</td></tr></tbody></table>




### 调整 VMware 虚拟机自适应窗口

在菜单栏 View 选择 Fit Guest Now.



## Other


### Step 1

Copy the VMDK file from the VMware Workstation virtual machine to the Mac running VMware Fusion.

### Step 2

Open VMware Fusion and create a new virtual machine.

### Step 3

Click "Continue without disk."

### Step 4

Click "Use an existing virtual disk," then double-click the VMDK file and click "Continue."

### Step 5

Choose the operating system type, if prompted, then click "Continue."

### Step 6

Select whether or not to run the virtual machine automatically.

### Step 7

Click "Customize Settings" to adjust the virtual machine's allocated resources, such as CPUs and RAM.

Close the settings window and then power on the virtual machine.



