---
layout: post
title: "清理 macOS 磁盘"
aliases: "清理 macOS 磁盘"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, macos-cleanup, mac, mac-app ]
last_updated:
---

在使用一段时间的 macOS 之后，在打开磁盘就会发现其中有一大部分的磁盘被 Other 占用。这一部分内容在磁盘管理里面是看不到详情的，也就没有办法手动进行管理。

![macOS storage other](https://blog.einverne.info/assets/macos-storage-other.png)

## 磁盘中的 Other 是什么？

macOS 可以识别很多类型的文件，比如说音频，视频，应用等等，但是还有很多其他类型的文件系统是无法识别的，那么就会把这些文件统计成 Other。比如说系统临时文件，应用的缓存文件，日志文件等等。

## 如何清理磁盘中的 Other？

清理磁盘中的 Other 可以帮助释放磁盘空间，提高系统性能。以下是一些方法可以尝试：

1. 使用第三方工具：有很多专门用于清理 macOS 系统文件的第三方工具，比如 [CleanMyMac](https://macpaw.com/cleanmymac)， [柠檬清理](https://lemon.qq.com/)等。这些工具可以扫描并清理系统中的临时文件、缓存文件等，帮助释放磁盘空间。
2. 手动清理：可以通过 Finder 手动查找并删除一些不需要的文件，比如下载文件夹、桌面上的临时文件等。也可以尝试清理浏览器缓存、邮件附件等。
3. 清理日志文件：日志文件可能会占用大量空间，在终端中输入命令 `sudo rm -rf /private/var/log/*` 可以删除系统日志。
4. 清理应用缓存：有些应用会生成大量缓存文件，可以尝试在应用设置中找到清理缓存的选项，或者卸载并重新安装应用来清除缓存。
5. 升级 macOS 版本：有时候升级到最新版本的 macOS 可能会自动进行一些系统优化和清理操作，帮助释放磁盘空间。

