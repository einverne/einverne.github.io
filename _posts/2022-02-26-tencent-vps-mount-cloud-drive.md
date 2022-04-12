---
layout: post
title: "腾讯轻量云服务器挂载云硬盘"
aliases:
- "腾讯轻量云服务器挂载云硬盘"
tagline: ""
description: ""
category: 经验总结
tags: [ tencent, cloud, vps, cloud-drive, mount, linux, ]
last_updated:
---

之前看到轻量云服务器做活动，500 GB 的存储空间一年只需要 9.9 元，配合之前的轻量服务器正好买了 3 年。


挂载到之前的轻量云服务器作为数据盘。

- 限国内轻量云服务器
- 仅有100GB、500GB、1TB，分别售价一年为 5 元，9.9 元，和 19.9 元，可以一年或者三年购买。
- 选择区域时需要与轻量云服务器位置一致

![tencent cloud drive discount](/assets/tencent-cloud-drive-discount.png)

如果感兴趣可以 Follow 我的 Twitter，之后有更多的优惠会及时发出来。

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">腾讯轻量云 1T 磁盘一年 19.9 看着还不错啊.<a href="https://t.co/jh5IKgWSy1">https://t.co/jh5IKgWSy1</a> <a href="https://t.co/TaQHx5lxGa">pic.twitter.com/TaQHx5lxGa</a></p>&mdash; Ein Verne (@einverne) <a href="https://twitter.com/einverne/status/1502186186617634820?ref_src=twsrc%5Etfw">March 11, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

我本人的轻量云并没有那么多的流量，所以放弃了 1T 的空间选择了折中的 500G。

## 初始化云硬盘

    sudo fdisk -l
    # 创建文件系统
    sudo mkfs -t ext4 /dev/vdb
    # 新建挂载点
    sudo mkdir /mnt
    # 挂载
    sudo mount /dev/vdb
    sudo df -TH

Linux 系统开机自动挂载磁盘

```
sudo blkid /dev/vdb
/dev/vdb: UUID="8cxxxxxx-9a49-49bf-8185-xxxxxxxxxxxx" TYPE="ext4"
```

修改 `/etc/fstab` 文件

```
《设备信息》 《挂载点》 《文件系统格式》 《文件系统安装选项》 《文件系统转储频率》 《启动时的文件系统检查顺序》
```

```
UUID=d489ca1c-5057-4536-81cb-ceb2847f9954 /mnt ext4 defaults 0 0
```

最后执行：

	sudo mount -a
    
可以用 `df -h` 来验证。

## reference

- <https://cloud.tencent.com/document/product/1207/63926>
