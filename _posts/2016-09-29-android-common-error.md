---
layout: post
title: "Android 常见错误"
tagline: ""
description: ""
category: Android
tags: [Android, AndroidDev, ]
last_updated: 
---


## INSTALL_FAILED_NO_MATCHING_ABIS 的解决办法

### 出现时机
`INSTALL_FAILED_NO_MATCHING_ABIS` 的解决办法，在 Android 模拟器上安装 apk 的时候出现

### 解决办法
是由于使用了 native libraries ，该 native libraries 不支持当前的cpu的体系结构。

	INSTALL_FAILED_NO_MATCHING_ABIS is when you are trying to install an app that has native libraries and it doesn't have a native library for your cpu architecture. For example if you compiled an app for armv7 and are trying to install it on an emulator that uses the Intel architecture instead it will not work.

现在安卓模拟器的CPU/ABI一般有三种类型，INTEL X86,ARM,MIPS,

如果选择用INTEL X86出现 `INSTALL_FAILED_NO_MATCHING_ABIS` 的错误，那就改用ARM的

参考：<http://stackoverflow.com/questions/24572052/install-failed-no-matching-abis-when-install-apk>


## Apache HTTP Client
Android 6.0 中[移除](https://developer.android.com/about/versions/marshmallow/android-6.0-changes.html#behavior-apache-http-client) 了 Apache HTTP client

程序包org.apache.http.client.methods不存在

    android {
        useLibrary 'org.apache.http.legacy'
    }


