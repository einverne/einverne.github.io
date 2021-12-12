---
layout: post
title: "Android 反编译"
tagline: ""
description: "Android 反编译工具 apktool dex2jar jd gui"
category: 经验总结
tags: [Android, Java, Apktook, Google]
last_updated: 
---


本文介绍 Android 反编译工具，只介绍工具名字及工具简单使用，详细开来再具体讲吧。本文主要包含工具的作用，工作的简单用法，以及反编译的基本步骤。

## 概述
反编译 Android APK 主要需要依靠如下几个工具:

- `apktool`：A tool for reverse engineering Android apk files 查看 APK 包中的 `AndroidManifest.xml` 等 XML 资源文件 
    - apk 本质上是一种压缩包，可以通过解压的方式获得资源文件，但是如果直接解压 manifest 和 XML 都是乱码，所以需要 apktool 工具来获得资源文件
- `dex2jar`：Tools to work with android .dex and java .class files 将 APK 包中的 Dalvik 字节码文件（.dex）转换为 .jar 文件
- `JD-GUI`：Java Decompiler is a tools to decompile and analyze Java 5 “byte code” and the later versions 查看 .jar 文件的 Java 源码
    - jd-gui 可以用来查看上一步中从 dex 文件得到的 jar

相关项目及工具地址后文贴出。

## 使用方法

## apktool
Apktook 是一个反编译(reverse engineering) 工具，可以用来反编译Android APK。几乎可以将APK中的 `resources.arsc`, `classes.dex` 和 `9.png` 以及 XMLs 等等源文件反编译得到。

安装需要：

1. JRE 1.7 及以上
2. 关于 Android SDK, AAPT 以及 smali 的基本知识

地址: <https://ibotpeaches.github.io/Apktool/>

### apktool 安装 {#apktool-installation}

各平台的安装[指南](https://ibotpeaches.github.io/Apktool/install/)，如果使用 Linux 可以使用如下简易步骤：

1. 右击[链接](https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/linux/apktool) 将 Linux 的脚本保存为 `apktool`，并移动到 `/usr/local/bin/` 目录下
2. 下载最新版本 apktool.jar (https://bitbucket.org/iBotPeaches/apktool/downloads/)
3. 确保 Linux 64 位系统中安装了 `ia32-libs`，使用 `apt search ia32` ，然后 `apt install ia32-libs` 安装，可跳过
4. 将下载的 apktool-x.x.x.jar 重命名为 `apktool.jar`
5. 将 `apktool.jar` 和 `apktool` 移动到 `/usr/local/bin/` 目录中，需要 root 权限
6. 给予以上两者执行权限 `chmod +x /usr/local/bin/apktool`
7. 在终端执行 `apktool`

### apktool 使用 {#apktool-usage}

1. 拿到 APK 安装包，比如 xxx.apk
2. 在APK同目录下，执行 `apktool d xxx.apk`
3. 目录下会多一个与 APK 同名的文件夹，是解压后的 APK，其中的 XML 资源文件和各种 drawable 图片资源等可以直接看, 不想看 XML 文件的话，可以不用 apktool，直接将 APK 后缀改为 .zip 后解压即可，此时得到的解压目录中的结构和 apktool 解的是一样的，但是 XML 都处在压缩状态不能看。


Apktool 其实还可以用来做另外一件事情，就是汉化，或者将语言包替换之后，重新打包，此时需要使用 `apktool b xxx.apk` 来重新打包 APK。

## dex2jar
dex2jar 能够将 dex 转换为 jar

地址：<https://github.com/pxb1988/dex2jar>

4. 不使用 apktool，直接修改后缀解压 APK，将解压后 APK 中的 .dex 文件复制到 dex2jar 目录下
5. 进入该目录执行 ./d2j-dex2jar.sh xxx.dex（注意赋予该 shell 可执行权限 chmod +x d2j-dex2jar.sh）

## JD GUI
JD GUI 用来反编译源文件jar包，查看源代码

地址：<http://jd.benow.ca/>

5. dex2jar 目录下会多一个 .jar 文件，用 GUI 工具 JD-GUI 打开看就可以了（当然，混淆过的代码中变量名都是 a, b, c, d）

## 总结
总的来说 apktool 可以让你轻松的拿到应用的资源文件，包括图片，xml等，而 dex2jar 和 JD GUI 可以反编译源代码，看到一些基础的代码结构。



## Update

后来 Google 搞了一个 ClassyShark，看起来不错，不过还没来得及尝试

<http://classyshark.com/>

还有一个 不错的 smali 查看插件看起来也不错，还未尝试

<https://github.com/JesusFreke/smali>

另外有一个 MAC 专属的一键反编译工具，可以一试：

<https://github.com/Jermic/Android-Crack-Tool>

又一个查看 dex 到 jar 的反编译工具:

<https://github.com/skylot/jadx>

