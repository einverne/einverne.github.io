---
layout: post
title: "oneplus 3 recovery ROM kernel 选择"
tagline: ""
description: ""
category: 经验总结
tags: [oneplus, rom, kernel, ]
last_updated:
---


所有下载链接建议有国外 VPS 的直接从国外的 VPS 下载，scp 拉回本地，浏览器下载太慢。

## Recovery

- <https://twrp.me/oneplus/oneplusthree.html>

## ROM

AOSP Extended

- <https://forum.xda-developers.com/oneplus-3/oneplus-3--3t-cross-device-development/rom-aospextended-rom-v3-1-t3557363>

LineageOS

- <https://download.lineageos.org/oneplus3>

## Kernel

- <https://forum.xda-developers.com/oneplus-3/oneplus-3--3t-cross-device-development/kernel-caesium-kernel-op3-op3t-t3672090>

## GApps

- <https://opengapps.org/?arch=arm64>
- <https://github.com/opengapps/arm64>

## Magisk

- <https://www.xda-developers.com/how-to-install-magisk/>

## Decryption Unsuccessful
在安装完新的 AOSP Extended ROM 之后启动突然出现了 "Decryption Unsuccessful" 的问题，一查可能是之前的数据分区加密过，新的系统无法解密读取这些文件了。

> There's some weird issues with the latest AOSP based ROM that makes encrypted ext4 based data partition unable to be decrypted in both system and older version of TWRP if you're encrypted before (intentionally or unintentionally). This however doesn't apply to F2FS and unencrypted ext4 data partition

[xda](https://forum.xda-developers.com/redmi-note-4/how-to/fix-decryption-unsuccessful-twrp-t3818052) 提供了两种解决方案：

推荐的方式是重新分配分区 F2FS，这需要提前备份所有 internal storage 数据，然后抹去所有数据

- 通过 TWRP 挂载 SD 卡，备份全部数据
- 格式化所有数据，在 TWRP 中选择 "Format", 然后选择 "Wipe data"
- 然后 Flash ROM 和 GApps

第二种方式是安装一个第三方修改过的 Kernel，这种方式不需要抹除数据

- Xenial b25x or newer
- Revolt EAS-R13

这里补充下 F2FS，很多人可能好奇 F2FS 是什么，具体做什么用，F2FS 是 “Flash-Friendly File system”，是一种新的文件系统，用于 NAND 闪存一类的储存设备，F2FS 和主流的 ext3/4 相比，有更好的加密特性，更快的读取速度，对碎片小文件读写优化，增加了固态存储的寿命等等优点。但 F2FS 也有其缺点，就是在大文件读写上性能可能会波动。
