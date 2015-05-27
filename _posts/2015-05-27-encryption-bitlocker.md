---
layout: post
title: "加密入门（二）：BitLocker"
description: "加密, BitLocker, windows"
category: encryption
tags: [encryption, BitLocker, windows,]
---

BitLocker 是 Windows 7 提供的基于分区的加密方式。BitLocker 不仅仅可以加密本机硬盘分区，还可以加密移动硬盘、U盘、SD 卡等移动存储设备。不过为了保证加密后的移动存储设备在 Windows XP 下面可以正常访问，请将其格式化为 FAT32 文件系统。

BitLocker 定位于商务用户，微软只在 Windows 7 企业版和旗舰版提供这一功能，使用之前请检查 Windows 版本。

##1. BitLocker 加密

本文操作只涉及本地硬盘非系统分区及移动存储设备。加密系统分区需要 TPM 支持，或者通过 U 盘启动，在此不作详细介绍，具体设置请参阅 http://blogs.technet.com/b/xiwang/archive/2009/05/19/windows-7-bitlocker.aspx。

请按照以下步骤对驱动器进行加密：

1. 启动 Windows 资源管理器，右击要使用 Bitlocker 加密的驱动器，选择“启用 BitLocker”。
2. 选择解锁驱动器方式，对于移动存储设备而言，解锁方式包括密码和智能卡解锁，对于本地非系统分区而言，解锁方式包括密码、智能卡和登录到 Windows 时自动对驱动器解锁（必须先使用 BitLocker 加密系统分区）。选择之后输入密码或者插入智能卡，点击“下一步”继续。
3. 选择存储恢复密钥方式，以便在密码遗忘或智能卡丢失的情况下解锁驱动器，对于移动存储设备而言，存储方式包括“将恢复密钥保存到文件”和“打印恢复密钥”，对于本地非系统分区而言，存储方式包括“将恢复密钥保存到 USB 闪存驱动器”“将恢复密钥保存到文件”和“打印恢复密钥”。设置完毕点击“下一步”继续
4. 确认使用 BitLocker 加密，点击“启动加密”按钮开始加密过程。

BitLocker 加密过程较为缓慢，请耐心等待，假如需要暂时移除移动存储设备，请暂停加密，以免造成数据丢失。

在 Windows 7 中插入 BitLocker 加密的驱动器，Windows 会自动弹出对话框让你输入密码，正确输入密码后就可以正常使用，而且使用时对性能的影响很小。

经过BitLocker加密之后的驱动器的图标与普通驱动器不同，Windows 7会以不同颜色的锁和钥匙图标来反映目前的存储器状态，其中灰色代表加密的磁盘已经解锁，黄色则是未解锁。

##2. BitLocker 管理

对于已经使用 BitLocker 加密的驱动器，我们可以修改 BitLocker 密码和解密驱动器。

在 Windows 资源管理器中右击已经使用 BitLocker 加密的驱动器，选择“管理 BitLocker”，在此处我们可以修改 BitLocker 密码。

在开始菜单搜索框中输入“BitLocker”，选择“BitLocker 驱动器加密”选项，然后在相应驱动器处选择“关闭 BitLcoker”即可对驱动器解密。

##3. 在 Windows XP 中读取加密数据

只有 FAT32 格式的移动存储设备在使用 BitLocker 加密之后能在 Windows XP 中读取，在 Windows XP 中双击加密分区，Windows 会要求输入密码，输入密码之后会弹出 BitLocker To Go 阅读器允许你读取加密分区中的文件，不过只能读不能写。

BitLocker 是一种比较简易的加密方式，推荐安装了 Windows 7 旗舰版或企业版的朋友一试。

##本文历史：

2011 年 3 月 11 日：初稿完成
2011 年 8 月 13 日：将 EFS 与 Bitlocker 拆分为两篇文章，并进行改写。

原文地址：加密入门（二）：BitLocker [http://terrychen.info/encryption-bitlocker/](http://terrychen.info/encryption-bitlocker/)
