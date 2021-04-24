---
title: Android SDK环境变量配置
layout: post
category : 经验总结
tagline: ""
tags : [android, jdk, android-sdk, android-develop, ]
---

Android SDK就是 Google 提供的Android开发工具包,之前请先[配置好JDK][1]
## Install Android SDK under Linux
    
    sudo apt update && sudo apt install android-sdk

安装之后 Android SDK 的地址可能在：

- `/home/account/Android/Sdk`
- `/usr/lib/android-sdk`


### Android SDK下载地址
- Google搜索Android SDK
- 或者https://developer.android.com/sdk/index.html

###配置Android SDK环境变量
1. 下载Android SDK，点击安装，直接默认路径即可！ 下载地址：https://developer.android.com/sdk/index.html

2. 默认路径安装后，安装完成，开始配置环境变量。

3. 打开计算机属性——高级系统设置——环境变量（如上文）

4. 新建一个环境变量，变量名：ANDROID_HOME，变量值：D:\Android\android-sdk（以你安装目录为准,确认里面有tools和add-ons等多个文件夹），点击确认。

5. 在用户变量PATH后面加上变量值;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;点击确认即可

6. Android SDK配置完成，接下来验证配置是否成功。

7. 点击运行——输入cmd——回车——输入adb——回车，如果出现一堆英文，即表示配置成功，输入Android，启动Android SDK Manager。

### 目录tools和platform-tools的区别

Android sdk目录里，有一些文件夹：

- tools：该目录存放大量的Android开发，调试工具,该目录下存放大量Android开发工具，例如SDK Manager、androidavd、emulator、ddms等等。
- platforms-tools：该文件夹存放Android平台和相关工具,存放Android不同平台的相关工具；随着SDK更新版本，这里的工具会有相应更新变化，但是一般都是向后兼容。最常用的是Android Debug Bridge（adb）工具
- add-ons：该目录存放额外的附件软件。刚解压时该目录为空。
- platforms：该目录存放不同版本的Android版本。刚解压时该目录为空。
- SDK Manager.exe:该程序就是Andriod SDK管理器。
- AVD Manager.exe:该程序就是Andoid虚拟设备。
- docs：该文件夹存放了Android SDK开发文件和API文档等
- samples：该文件夹存放不同的Android平台和示例程序。

参考: http://blog.csdn.net/rflyee/article/details/8973529


  [1]: http://www.einverne.tk/2014/02/jdk.html
