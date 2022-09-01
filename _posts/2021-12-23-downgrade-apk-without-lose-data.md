---
layout: post
title: "不丢失数据 降级 Android 应用版本"
aliases: 
- "不丢失数据 降级 Android 应用版本"
tagline: ""
description: ""
category: 经验总结
tags: [ android, apk, adb,  ]
last_updated:
---

之前一次不消息把 Google Play Store 中的自动更新启用了，之后一个夜里把所有应用都更新了，不过有些应用本来就不想升级的，比如网易云音乐（有一些低版本没有广告，没有乱七八糟的直播什么的），微信。所以想着能不能在不丢失数据的情况下降级应用。简单的搜索了一下果然可以。

这里需要使用到 adb 命令，不同的系统直接安装即可，我现在在 Linux 下之前就已经安装过。

macOS 下：

    brew cask install android-platform-tools


执行：

    adb devices

查看是否连接，如果出现了设备 ID，则表明连接成功了。

然后准备好特定版本的 apk。

    adb push wechat_7.0.0.apk /sdcard/Download/wechat_7.0.0.apk

然后进入下一步：

    adb shell

进入系统的 shell 环境。

    pm install -d -r /sdcard/Download/wechat_7.0.0.apk

说明：

- `-d` 表示运行降级安装
- `-r` 表示保存数据重新安装现有应用

如果无法安装报错：

```
255|OnePlus7Pro:/ $ pm install -d -r /sdcard/Download/wechat_7.0.0.apk                                                                                                                                                                       
avc:  denied  { read } for  scontext=u:r:system_server:s0 tcontext=u:object_r:fuse:s0 tclass=file permissive=0
System server has no access to read file context u:object_r:fuse:s0 (from path /sdcard/Download/wechat_7.0.0.apk, context u:r:system_server:s0)
Error: Unable to open file: /sdcard/Download/wechat_7.0.0.apk
Consider using a file under /data/local/tmp/
Error: Can't open file: /sdcard/Download/wechat_7.0.0.apk

Exception occurred while executing 'install':
java.lang.IllegalArgumentException: Error: Can't open file: /sdcard/Download/wechat_7.0.0.apk
	at com.android.server.pm.PackageManagerShellCommand.setParamsSize(PackageManagerShellCommand.java:520)
	at com.android.server.pm.PackageManagerShellCommand.doRunInstall(PackageManagerShellCommand.java:1283)
	at com.android.server.pm.PackageManagerShellCommand.runInstall(PackageManagerShellCommand.java:1249)
	at com.android.server.pm.PackageManagerShellCommand.onCommand(PackageManagerShellCommand.java:185)
	at android.os.BasicShellCommandHandler.exec(BasicShellCommandHandler.java:98)
	at android.os.ShellCommand.exec(ShellCommand.java:44)
	at com.android.server.pm.PackageManagerService.onShellCommand(PackageManagerService.java:22322)
	at android.os.Binder.shellCommand(Binder.java:940)
	at android.os.Binder.onTransact(Binder.java:824)
	at android.content.pm.IPackageManager$Stub.onTransact(IPackageManager.java:4644)
	at com.android.server.pm.PackageManagerService.onTransact(PackageManagerService.java:4515)
	at android.os.Binder.execTransactInternal(Binder.java:1170)
	at android.os.Binder.execTransact(Binder.java:1134)
```

那么需要将 apk 移动到 `/data/local/tmp/`:

    mv /sdcard/Download/wechat_7.0.0.apk /data/local/tmp/

然后再安装：

    pm install -d -r /data/local/tmp/wechat_7.0.0.apk


如果还不行，那么可以保留数据卸载应用然后重新安装：

    pm uninstall -k com.tencent.mm
    pm install -d /data/local/tmp/wechat_7.0.0.apk