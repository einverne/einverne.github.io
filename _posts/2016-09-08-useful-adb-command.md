---
layout: post
title: "常用 adb command 命令"
tagline: ""
description: ""
category: Android
tags: [AndroidDev, Android, adb]
last_updated: 2017-02-26
---

一些常用的 adb 命令，包括Android录屏，及从电脑复制文件，从 Android 设备拉取文件等等。

adb 的全称是 Android Debug Bridge, 这个命令可以用来发送一系列指令给 Android 设备，包括但不限于基本的 Linux 指令。只要手机或者任何 Android 设备开启了Debug模式并且取得信任，adb 命令几乎可以用来做任何事情。因此网络上也存在使用 adb 来入侵同一局域网下的 Android 盒子的例子。

## adb devices
来查看设备是否已经连接

    $ adb devices
    List of devices attached
    2dd11c6e	device


## adb push

将文件复制到 Android 设备上：

`adb push filename.txt /sdcard/Download/`



## adb pull

将文件从 Android 设备上拉回本地

`adb pull /sdcard/Download/filename.txt ~/filename.txt` 



## adb reboot

重启设备，在刷机时经常使用



## adb reboot-bootloader

重启进去 bootloader

或者使用 `adb reboot recovery` 直接进入 recovery 模式



## adb shell
直接使用该命令可以进入手机的 Shell.

### 修改权限

进入 Android Shell 之后就可以使用任何 Linux 命令来直接操作 Android 设备， 比如：

` adb shell chmod 666 /data/filename.txt` 

### shell 中录制屏幕

在 shell 命令中可以使用 `screenrecord` 命令来录制屏幕。需要 Android 4.4 （API Level 19）及以上，该命令将屏幕保存成 MPEG-4 文件。不录制声音。

`adb shell screenrecord /sdcard/Download/filename.mp4`

使用 <kbd>Ctrl</kbd> + <kbd>c</kbd> 来停止录像，否则默认录制 3min 或者使用 `--time-limit` 参数来指定。

注意：

- `screenrecord` 命令可以按照设备原始分辨率录屏，但是有些设备可能不支持原始分辨率，此时降低分辨率再尝试。
- 不支持录屏中旋转屏幕

可选参数：

-  `--help`
- `--size <width*Height>`  比如 1280\*720.
- `--bit-rate <rate>`  默认码率 4Mbps，6Mbps 可以设置  6000000.
- `--time-limit <TIME>` 默认为180 (3min) 设置时间，单位秒
- `--rotate` 旋转输出
- `--verbose` 显示 log 信息，如果不设置，不显示任何信息

### 列出Android 设备上所有安装的应用
使用如下命令[^1]:

	adb shell 'pm list packages'

使用如下命令去除前面的 package: 

    adb shell pm list packages | awk -F ":" '{print $2}'
    # 或者，-f 用来输出第二部分， -d 用来标示分割符号
    adb shell pm list packages | cut -f 2 -d ":"

在使用 adb shell 进入 手机 Shell 之后可以使用， pm help 来获取更多关于 pm 命令的详情。关于 pm 的命令。

[^1]: https://gist.github.com/davidnunez/1404789

## adb install

可以使用该命令安装应用程序

可以使用 `-r` 命令更新应用 

`adb install -r apkfilename.apk` 

同理可以使用 `adb uninstall apkfilename.apk` 来卸载应用。

使用 `adb uninstall -k apkfilename.apk` 可以卸载应用，但是保留数据。


## reference


- <https://developer.android.com/studio/command-line/shell.html#shellcommands>
