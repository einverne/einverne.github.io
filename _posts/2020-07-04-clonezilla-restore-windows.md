---
layout: post
title: "使用 Clonezilla 恢复 Windows 系统遇到的几个问题"
tagline: ""
description: ""
category: 经验总结
tags: [clonezilla, backup, restore, ]
last_updated:
---

之前也总结过两篇文章，[我是如何使用 Clonezilla 进行全盘备份和恢复的](/post/2016/08/clonezilla-clone-system.html) 以及[备份 Linux 过程中遇到的问题](/post/2018/03/clonezilla-backup-and-restore-tutorial.html)，今天这篇就记录一下恢复之前备份过的 Windows

我先来还原一下现在情况，原来我有两台小米的 Air 笔记本，所有的配置一样，不过一台我从之前的电脑上恢复了一个 Linux Mint 的系统，暂且叫这台 A1 笔记本，然后还有一台是默认的 Windows 系统，不过这一台用的比较少，暂且叫这台 A2 笔记本。前段时间我把 A2 笔记本使用 Clonezilla 备份了一下生成了一个从 device 到 image 的镜像，然后我把 A2 笔记本卖了，所以现在只剩下 A1 笔记本。

我在卖 A2 笔记本的时候，当时也做了系统的恢复，就是把当年 A1 原始的默认 Windows 系统恢复到了 A2 笔记本上，正好省去了我格式化硬盘，备份数据的苦恼，恢复上去之后 A2 没啥问题也可以直接启动。

但今天恢复 A1 笔记时，却遇到了一些问题，这里记录一下。

## no bootable devices found

安装我之前的操作，恢复之前备份的 A2 的硬盘镜像文件到 A1 的整块硬盘上，官网的教程非常详细，这里就略过了，就安装默认的下一步下一步直接走了，可以所有操作完成后等等重启时，屏幕只出现了 "no bootable devices found"，我一想不应该呀，虽然用的是另一台机器的镜像恢复的数据，但是理论上应该还是能找到系统的。

之后还想着是不是引导坏了，还用着 Win PE 进去想修复一下，谁知道在 PE 里面根本找不到系统的硬盘，后来想想是不是恢复的时候把 MBR 搞坏了，还是说默认的 Windows 是安装在 GPT 分区表的硬盘上的。

然后使用如下的方法重新恢复了一次：

- <http://drbl.sourceforge.net/faq/fine-print.php?path=./2_System/23_Missing_OS.faq#23_Missing_OS.faq>

然后去 BIOS 中把之前引导 Linux 是的 Legacy 改成了 UEFI Mode，果然就能进入系统了。



