---
layout: post
title: "Genymotion 安装"
tagline: ""
description: ""
category: 经验总结
tags: [Android, AndroidDev, Genymotion]
last_updated: 2016-02-14
---

在Linux下安装 Genymotion Android 模拟器。最近拾起 Android Development，Android 模拟器必不可少，用来用去 Genymotion 模拟器算是速度和效率最棒的模拟器了。

## 事前准备 {#preparation}

Genymotion 依赖 VirtualBox 运行，在安装之前确保已经安装 VirtualBox. 在Linux Mint下直接去 Software Manager 搜索 VirtualBox 然后点击安装即可。

Genymotion 安装需要一个 Genymotion 的个人账号，Genymotion 高级功能需要付费，所以去官网注册一个个人账号使用。
官网地址：<https://www.genymotion.com>

下载安装包，在注册账号登陆之后去首页按照自己的系统选择 32bit 或者 64bit 的安装包下载。目前最新的版本为 2.6.0.

## 安装 {#installation}
假设安装包下载到 `~/Downloads` 目录下，在终端：

	# cd ~/Downloads/
    # Move the downloaded file to ~/Android/ directory #
    mv genymotion-2.6.0_x64.bin ~/Android/

    # Set executable permission
    chmod +x genymotion-2.6.0_x64.bin

    # Install genymotion by running the file
    ./genymotion-2.6.0_x64.bin

    # Navigate into genymotion directory
    cd genymotion

    # launch the genymotion #
    ./genymotion

运行 genymotion 之后，添加设备，此时需要登陆账号，有的时候会遇到 "unknown generic error" 错误，在我的观察下可能就是因为 genymotion 服务器挂了，等些时候再尝试即可。或者有的时候是因为代理的关系。

![unknown generic error](https://lh6.googleusercontent.com/-A6QJ-HjGJog/VrNOdLs52qI/AAAAAAAA6SQ/CKC9sO616cs/w280-h248-no/screenshot-window-2016-02-04-204616.png)

下载对应的镜像，然后就能够运行模拟器了。

为了方便使用可以将 Genymotion 的地址加入到 PATH 中，这样就能快速启动 Genymotion. 类似：

	$ PATH=$PATH:/home/einverne/Android/genymotion/

## 使用 {#after}
在使用 Genymotion 的时候，有时会遇到 ”INSTALL_FAILED_NO_MATCHING_ABIS“ 错误。一些时候是因为 APP 和模拟器CPU架构的问题，但是在 Genymotion 这里需要额外安装一个文件。点击[这里](http://forum.xda-developers.com/showthread.php?t=2528952) 去xda 下载 Genymotion-ARM-Translation_v1.1.zip 这个文件。并拖到模拟器中。这样就不会出现问题了。如果需要在模拟器中安装 GApps ，可以在上面的链接中找到对应的方法。

如果使用过程中出现 “An error occured while deploying the file. INSTALL_FAILED_CPU_ABI_INCOMPATIBLE” 这样的错误，利用上面的方法也能解决。造成这个错误的原因是因为 Genymotion 是一个基于 x86 的虚拟环境，不是一个 ARM 的模拟器。而 Genymotion 在更新过程中移除了 ARM Translation 和 Google Play Apps ， 这样对开发者和使用者造成了一定的困扰，不过还好依然可以通过其他方法解决。

## reference

- <http://techapple.net/2014/07/tutorial-installsetup-genymotion-android-emulator-linux-ubuntulinuxmintfedoraarchlinux>
- <http://www.2daygeek.com/install-genymotion-android-emulator-on-ubuntu-centos-debian-fedora-mint-rhel-opensuse/>
- <http://stackoverflow.com/questions/24572052/install-failed-no-matching-abis-when-install-apk>
- <http://forum.xda-developers.com/showthread.php?t=2528952>