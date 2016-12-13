---
layout: post
title: "Android monkey test"
tagline: ""
description: "Android UI 测试，压力测试，monkey test"
category: Android
tags: [Andorid, AndroidDev, monkey]
last_updated: 2016-10-18
---

Android UI monkey 测试

伪随机用户事件，发送到模拟器或者设备，用来对应用程序进行压力测试。

功能：

- 设定事件数
- 操作限定到某一个特定 package
- 事件类型和频率
- 调试选项

报错：

- 如果应用 crash 或者遇到 unhandled exception ， monkey 会停止并上报错误
- 如果应用产生 not responding error ， monkey 也会停止并上报

## 基本使用

基本语法：

	adb shell monkey [options] <event-count>


下面的例子是测试在特定包上，发送500随机事件

	adb shell monkey -p your.package.name -v 500


一些有用的选项：

| Option        |     描述              |
|---------------| -----------------------|
| -v   -vv   -vvv   |    三档等级，越来越详细 |
| \-\-throttle <milliseconds>     |  事件和事件之间延迟   |
| \-\-pct-touch <percent>   |  点击事件，单个点按下抬起，后接百分比 |
| \-\-pct-motion <percent>  |  滑动事件，某一点按下，随机移动距离，抬起|
| \-\-pct-trackball <percent>  |  模拟轨迹球，包含随机的移动，可能伴随着点击 |
| \-\-pct-nav <percent>  | 外部输入，上下左右操作（没有使用过，但似乎游戏可用） |
| \-\-pct-syskeys <percent>  |  调整系统事件，包括Home，back ，音量键等等 |
| -p <allowed-package-name>  |  允许的 package name  |
| -c <main-category>  |  指定允许monkey跑的 category，下面有例子 |
| \-\-ignore-crashes    |  通常monkey 遇到crash 会停止，此选项忽略crash 直到指定次数跑完|
| \-\-ignore-timeouts |   忽略 ANR |
| \-\-ignore-security-exceptions      |  忽略Permission error 或者其他 unhandled exception |

## 测试特定Activity

`Manifest` 文件中定义 category：

```
<activity android:name="MonkeyActivity">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.MONKEY" />
    </intent-filter>
</activity>
```

使用命令：

	adb shell monkey -p my.package -c android.intent.category.MONKEY -v 500

## 防止通知栏下拉

在 Android 5.0 Lollipop 及以上系统中可以使用 [screen pinning](http://fieldguide.gizmodo.com/16-things-you-can-do-in-android-lollipop-that-you-could-1659628014).

- 在 settings>security>screen pinning
- 点击 程序切换按钮  multitasking
- 点击图标上的绿色图钉， pin icon

此时再运行则不会跳出应用。

## 停止 MonkeyTest

使用以下命令停止 monkey Test ：

```
adb shell ps | awk '/com\.android\.commands\.monkey/ { system("adb shell kill " $2) }'
```

## monkeyrunner

features 功能：

- 多设备控制，同时在多台设备测试
- 功能测试
- 回归测试
- 可扩展自动化

monkeyrunner 使用 [Jython](http://www.jython.org/)

## reference

- <https://developer.android.com/studio/test/monkey.html>
- <https://developer.android.com/studio/test/monkeyrunner/index.html>
- <http://stackoverflow.com/questions/16019290/android-monkey-test-choose-a-specific-activity>
- <http://stackoverflow.com/questions/9999036/how-do-i-stop-the-monkey-madness> 