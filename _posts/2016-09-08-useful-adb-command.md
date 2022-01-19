---
layout: post
title: "常用 adb command 命令"
tagline: ""
description: ""
category: 整理合集
tags: [android-dev, android, adb, dev, device, ]
last_updated: 2017-02-26
---

一些常用的 adb 命令，包括 Android 录屏，及从电脑复制文件，从 Android 设备拉取文件等等。

adb 的全称是 Android Debug Bridge, 这个命令可以用来发送一系列指令给 Android 设备，包括但不限于基本的 Linux 指令。只要手机或者任何 Android 设备开启了 Debug 模式并且取得信任，adb 命令几乎可以用来做任何事情。因此网络上也存在使用 adb 来入侵同一局域网下的 Android 盒子的例子。

adb 使用的默认端口是 5037.

Ubuntu 系下安装

    sudo apt-get install android-tools-adb
    sudo apt-get install android-tools-fastboot

## 查看连接设备 adb devices
来查看设备是否已经连接

    $ adb devices
    List of devices attached
    2dd11c6e	device

获取设备状态

    adb get-state

返回的结果可能有三种

- device: 设备正常连接
- offline: 连接异常，设备无响应
- unknown: 没有连接设备

## 杀掉 adb 进程
在连接异常时，而已杀死服务重启尝试

    adb kill-server
    adb start-server

## 打印日志

    adb logcat

## 将文件推送到设备上 adb push

将文件复制到 Android 设备上：

    adb push filename.txt /sdcard/Download/

## 从设备上拉取文件 adb pull

将文件从 Android 设备上拉回本地

    adb pull /sdcard/Download/filename.txt ~/filename.txt

### 从设备上拉取多个文件
`adb pull` 命令不知道为什么用 `*.apk` 这样的正则无法使用，所以只能先过滤出来特定的文件后缀，然后再使用 `adb pull`

比如说要把 `/sdcard/Download` 文件夹中的 `*.apk` 文件都拉取到本地，那么可以：

    adb shell ls /sdcard/Download/\*.apk | tr '\r' ' ' | xargs -n1 adb pull

如果想要了解更多 `xargs` 命令的使用，可以参考[这一篇文章](/post/2019/06/xargs.html)。

## 检查设备是否已经 root

    adb shell

然后进入之后输入 `su` 查看手机是否会弹出 root 授权窗口。

## adb reboot

重启设备，在刷机时经常使用

## 进入 bootloader
使用

    adb reboot bootloader

重启进去 bootloader

或者使用 `adb reboot recovery` 直接进入 recovery 模式

## 端口重定向
将宿主机上某端口重定向到设备端口

    adb forward tcp:8008 tcp:8008

执行命令后所有发往宿主机 8008 端口的数据都会被转发到 Android 设备 8008 上。

## adb shell 命令
直接使用该命令可以进入手机的 Shell。 adb 其他命令是 adb 自带的命令，而 `adb shell` 则是调用的 Android 设备上的命令。Android 设备的命令放在 `/system/bin` 目录下。

比如 `adb shell which ls` 返回的结果会告诉你找到的是 `/system/bin/ls` 这个命令。

### 修改权限

进入 Android Shell 之后就可以使用任何 Linux 命令来直接操作 Android 设备， 比如：

    adb shell chmod 666 /data/filename.txt

### screencap 屏幕截图
shell 中可以直接截取设备的屏幕

    adb shell screencap -p /sdcard/screen.png
    adb pull /sdcard/screen.png
    adb shell rm /sdcard/screen.png

使用 `screencap` 截图保存到 sdcard 上，使用 `pull` 命令拉到本地并删除 sd 卡中文件。这种方式比较繁杂，需要三个步骤，如果查看 `screencap -h` 会发现，帮助中有一行，如果不加文件名，命令会将结果输出到标准输出。那么

    adb shell screencap -p > screen.png
    adb shell screencap -p | sed 's/\r$//' > screen.png

直接将结果输出到本地，之所以使用 `sed` 是因为需要将多余的 `\r` 删除。`adb shell` 在执行时会将 `\n` 转换为 `\r\n`。

在本地添加 alias

    alias and-screencap="adb shell screencap -p | sed 's/\r$//'"
    and-screencap > screen.png

### screenrecord 在 shell 中录制屏幕

在 shell 命令中可以使用 `screenrecord` 命令来录制屏幕。需要 Android 4.4 （API Level 19）及以上，该命令将屏幕保存成 MPEG-4 文件。不录制声音。

    adb shell screenrecord /sdcard/Download/filename.mp4

使用 <kbd>Ctrl</kbd> + <kbd>c</kbd> 来停止录像，否则默认录制 3min 或者使用 `--time-limit` 参数来指定。

注意：

- `screenrecord` 命令可以按照设备原始分辨率录屏，但是有些设备可能不支持原始分辨率，此时降低分辨率再尝试。
- 不支持录屏中旋转屏幕

可选参数：

-  `--help`
- `--size <width*Height>`  比如 `1280*720`.
- `--bit-rate <rate>`  默认码率 4Mbps，6Mbps 可以设置  6000000.
- `--time-limit <TIME>` 默认为 180 (3min) 设置时间，单位秒
- `--rotate` 旋转输出
- `--verbose` 显示 log 信息，如果不设置，不显示任何信息

### 列出 Android 设备上所有安装的应用
`pm` 可以记忆成 package manager ，使用 pm 命令可以获取设备上应用相关的信息。

使用如下命令 [^1]:

	adb shell 'pm list packages'

使用如下命令去除前面的 package:

    adb shell pm list packages | awk -F ":" '{print $2}'
    # 或者，-f 用来输出第二部分， -d 用来标示分割符号
    adb shell pm list packages | cut -f 2 -d ":"

在使用 adb shell 进入 手机 Shell 之后可以使用， pm help 来获取更多关于 pm 命令的详情。关于 pm 的命令。

- `adb shell pm list packages`
- `adb shell pm list packages -f` 列出包名及对应的 apk 名及存放的位置
- `adb shell pm list packages -d` Filter to only show disabled packages.
- `adb shell pm list packages -e` Filter to only show enabled packages.
- `adb shell pm list packages -s` Filter to only show system packages.
- `adb shell pm list packages -3` Filter to only show third party packages.
- `adb shell pm list packages -i` 应用包名及其安装来源 com.android.vending 表示从官方 Play Store 安装
- `adb shell pm list packages -u` Also include uninstalled packages.
- `adb shell pm list packages --user <KEYWORDS>` The user space to query.

在命令后直接添加关键词能够根据关键字过滤结果。

    adb shell pm path com.android.chrome

能够给出应用的 apk 路径。

    adb shell pm dump com.android.chrome

能够列出指定应用的各种信息

如果 apk 文件在 Android 设备上，可以使用

    adb shell pm install /path/to/apk
    adb shell pm uninstall package_name
    adb shell pm clear  # 清除应用数据

[^1]: https://gist.github.com/davidnunez/1404789

### am
启动一个指定的 Activity

    adb shell am start -n com.oneplus.camera/.OPCameraActivity

强制停止应用

    adb shell am force-stop pacakge_name

### input 模拟点击和滑动事件
命令格式

    adb shell input text <string>
    adb shell input keyevent <key code number or name>
    adb shell input tap <x> <y>             # 点击事件
    adb shell input swipe <x1> <y1> <x2> <y2> [duration(ms)]

模拟按键的，keycode 为 3 时表示 HOME 键，更多的可以参考后文的附录

    adb shell input keyevent 3

模拟点击时，后面接的 x，y 都是真实屏幕分辨率，比如想要点击屏幕 (x,y)=(150,150) 像素的位置

    adb shell input tap 150 150

模拟屏幕滑动和 tap 是一样的，只是需要给出滑动的起点和终点两个坐标值

    adb shell input swipe 150 150 200 200

### ime 列出输入法
列出设备上的输入法

    adb shell ime list [-a] [-s]
    adb shell ime enable ID
    adb shell ime disable ID
    adb shell ime set ID

### wm
获取设备分辨率

    adb shell wm size

## 安装及卸载应用程序 adb install

可以使用该命令安装应用程序，命令的通用模式：

    adb install app.apk

可以使用 `-r` 命令覆盖安装应用 `adb install -r apkfilename.apk`

如果 adb 连接了多台设备可以使用 `-s` 来选择一台设备

    adb -s DEVICE install -r app.apk

`adb install` 的其他参数

- `adb install -l app.apk` forward lock application
- `adb install -r app.apk` 替换存在的应用
- `adb install -t app.apk` 允许测试包
- `adb install -s app.apk` 在 sdcard 上安装
- `adb install -d app.apk` 允许比现在安装版本更低的包 allow version code downgrade
- `adb install -p app.apk` 增量更新 partial application install

同理可以使用 `adb uninstall apkfilename.apk` 来卸载应用。

使用 `adb uninstall -k apkfilename.apk` 可以卸载应用，但是保留数据。

## adb connect
通过网络来使用 adb，可以通过该命令来连接网络上开放远程调试的设备（比如 Android 机顶盒之类）。

    adb connect <host>[:<port>]

远程连接之后就可以使用上面的所有命令，也可卸载远程设备上的应用，也可以安装本地的 apk 到远程设备上，也可以通过 adb 命令来控制远程设备上的应用。

通过下面的命令向远程设备安装应用

    adb -s <ip:port> install -r <app.apk>

向远程设备发送按键事件，比如下面向远程设备发送 Powerbutton 按键按下事件

    adb -s <ip:port> shell input keyevent 26

或者启动远程设备上的应用 Start the App

    adb -s <ip:port> shell monkey -p <package name> -c android.intent.category.LAUNCHER 1


## adb 命令如何显示 package version
在电视盒子上安装 Youtube 应用的时候，遇到了几个版本，突然想到这个命令

    adb shell dumpsys package com.google.android.youtube | grep version

可以用来查看当前这个 package 的版本号。

## 获取当前正在运行的应用 Activity Name
使用 adb shell dumpsys

    adb shell dumpsys activity activities | grep 'Hist #'

      * Hist #0: ActivityRecord{b71f1a7 u0 com.oneplus.camera/.OPCameraActivity t4826}
      * Hist #0: ActivityRecord{5de041d u0 slide.cameraZoom/.CameraZoomActivity t4825}
      * Hist #0: ActivityRecord{1e2287c u0 mobi.acpm.inspeckage/.ui.MainActivity t4824}
      * Hist #0: ActivityRecord{e96e625 u0 com.google.android.calendar/.AllInOneCalendarActivity t4812}
      * Hist #0: ActivityRecord{cf38cb2 u0 com.google.android.googlequicksearchbox/com.google.android.apps.gsa.staticplugins.opa.OpaActivity t4711}
      * Hist #0: ActivityRecord{ff685a1 u0 com.android.launcher3/.Launcher t4639}
      * Hist #0: ActivityRecord{78edd61 u0 com.android.systemui/.recents.RecentsActivity t4652}

## 从 Android 中备份应用
有一个常见的场景就是在需要备份已经安装的 app，导出 apk 的时候，如果是手机的的话借助 ES Explorer 能快速搞定，如果是机顶盒那么就要 adb connect 之后用命令来备份了。用到的命令上文都有提及，首先要知道需要备份的应用的包名 package name

    adb shell pm list packages

然后获取该应用的完整路径

    adb shell pm path com.example.app

输出结果会是类似于

    package:/data/app/com.example.app-2.apk

这样的路径，然后使用 pull 命令将文件备份到本地

    adb pull /data/app/com.example.app-2.apk /path/to/local/destination/app.apk

然后在目标目录下就能看到备份的内容了。

## 附录 keyevent

```
KEYCODE_UNKNOWN=0;
KEYCODE_SOFT_LEFT=1;
KEYCODE_SOFT_RIGHT=2;
KEYCODE_HOME=3;
KEYCODE_BACK=4;
KEYCODE_CALL=5;
KEYCODE_ENDCALL=6;
KEYCODE_0=7;
KEYCODE_1=8;
KEYCODE_2=9;
KEYCODE_3=10;
KEYCODE_4=11;
KEYCODE_5=12;
KEYCODE_6=13;
KEYCODE_7=14;
KEYCODE_8=15;
KEYCODE_9=16;
KEYCODE_STAR=17;
KEYCODE_POUND=18;
KEYCODE_DPAD_UP=19;
KEYCODE_DPAD_DOWN=20;
KEYCODE_DPAD_LEFT=21;
KEYCODE_DPAD_RIGHT=22;
KEYCODE_DPAD_CENTER=23;
KEYCODE_VOLUME_UP=24;
KEYCODE_VOLUME_DOWN=25;
KEYCODE_POWER=26;
KEYCODE_CAMERA=27;
KEYCODE_CLEAR=28;
KEYCODE_A=29;
KEYCODE_B=30;
KEYCODE_C=31;
KEYCODE_D=32;
KEYCODE_E=33;
KEYCODE_F=34;
KEYCODE_G=35;
KEYCODE_H=36;
KEYCODE_I=37;
KEYCODE_J=38;
KEYCODE_K=39;
KEYCODE_L=40;
KEYCODE_M=41;
KEYCODE_N=42;
KEYCODE_O=43;
KEYCODE_P=44;
KEYCODE_Q=45;
KEYCODE_R=46;
KEYCODE_S=47;
KEYCODE_T=48;
KEYCODE_U=49;
KEYCODE_V=50;
KEYCODE_W=51;
KEYCODE_X=52;
KEYCODE_Y=53;
KEYCODE_Z=54;
KEYCODE_COMMA=55;
KEYCODE_PERIOD=56;
KEYCODE_ALT_LEFT=57;
KEYCODE_ALT_RIGHT=58;
KEYCODE_SHIFT_LEFT=59;
KEYCODE_SHIFT_RIGHT=60;
KEYCODE_TAB=61;
KEYCODE_SPACE=62;
KEYCODE_SYM=63;
KEYCODE_EXPLORER=64;
KEYCODE_ENVELOPE=65;
KEYCODE_ENTER=66;
KEYCODE_DEL=67;
KEYCODE_GRAVE=68;
KEYCODE_MINUS=69;
KEYCODE_EQUALS=70;
KEYCODE_LEFT_BRACKET=71;
KEYCODE_RIGHT_BRACKET=72;
KEYCODE_BACKSLASH=73;
KEYCODE_SEMICOLON=74;
KEYCODE_APOSTROPHE=75;
KEYCODE_SLASH=76;
KEYCODE_AT=77;
KEYCODE_NUM=78;
KEYCODE_HEADSETHOOK=79;
KEYCODE_FOCUS=80;//*Camera*focus
KEYCODE_PLUS=81;
KEYCODE_MENU=82;
KEYCODE_NOTIFICATION=83;
KEYCODE_SEARCH=84;
KEYCODE_MEDIA_PLAY_PAUSE=85;
KEYCODE_MEDIA_STOP=86;
KEYCODE_MEDIA_NEXT=87;
KEYCODE_MEDIA_PREVIOUS=88;
KEYCODE_MEDIA_REWIND=89;
KEYCODE_MEDIA_FAST_FORWARD=90;
KEYCODE_MUTE=91;
```

## reference

- <https://developer.android.com/studio/command-line/shell.html#shellcommands>
- <https://developer.android.com/reference/android/view/KeyEvent.html>
