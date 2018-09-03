---
layout: post
title: "adb shell dumpsys 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [adb, android, android-dev, shell, ]
last_updated:
---

adb 相关的命令在 [这篇](/post/2016/09/useful-adb-command.html) 文章中已经提及。这里主要展开
`adb shell dumpsys` 这个子命令。

今天在查当前运行的 Activity 时遇见这个命令。

## 当前 service
`adb shell dumpsys`，默认打印出当前系统所有 service 信息

## 获取屏幕信息

    adb shell dumpsys display |grep DisplayDevice

## 获取电源管理信息

    adb shell dumpsys power

## 电池信息

    adb shell dumpsys battery

    Current Battery Service state:
      AC powered: false
      USB powered: true
      Wireless powered: false
      Max charging current: 500000
      status: 5
      health: 2
      present: true
      level: 100
      scale: 100
      voltage: 4276
      temperature: 305
      technology: Li-ion

## CPU 信息

    adb shell dumpsys cpuinfo

    Load: 5.76 / 6.18 / 6.54
    CPU usage from 591395ms to 291331ms ago with 99% awake:
      6.9% 497/surfaceflinger: 3.2% user + 3.6% kernel
      6.5% 2688/com.google.android.googlequicksearchbox:search: 4.1% user + 2.4% kernel
      5.8% 4740/com.qiyi.video: 2.9% user + 2.8% kernel / faults: 529 minor
      3.9% 11113/com.qiyi.video:downloader: 2% user + 1.9% kernel / faults: 270 minor
      2.9% 1441/system_server: 1.9% user + 1% kernel / faults: 25775 minor 1 major
      1.5% 1883/com.android.systemui: 1.3% user + 0.2% kernel / faults: 3487 minor
      1% 28574/kworker/u8:7: 0% user + 1% kernel
      0.9% 2836/kworker/u8:2: 0% user + 0.9% kernel
      0.8% 1862/android.process.media: 0.4% user + 0.3% kernel / faults: 12370 minor 1 major
      0.5% 3330/com.android.vending: 0.3% user + 0.2% kernel / faults: 1483 minor
      0.5% 21190/kworker/u8:3: 0% user + 0.5% kernel
      0.4% 58/irq/169-cpr3: 0% user + 0.4% kernel
      0.4% 30021/kworker/u8:8: 0% user + 0.4% kernel
      0.4% 14747/com.microsoft.office.outlook: 0.3% user + 0.1% kernel / faults: 9563 minor
      0.4% 733/adbd: 0% user + 0.3% kernel / faults: 7954 minor
      0.4% 3/ksoftirqd/0: 0% user + 0.4% kernel
      0.3% 26596/org.thunderdog.challegram: 0.2% user + 0.1% kernel / faults: 160 minor
      0.3% 53/smem_native_rpm: 0% user + 0.3% kernel
      0.3% 15/ksoftirqd/1: 0% user + 0.3% kernel
      0.3% 1849/VosMCThread: 0% user + 0.3% kernel
      0.3% 2785/com.google.android.gms.persistent: 0.2% user + 0% kernel / faults: 1635 minor 2 major
      0.2% 336/cfinteractive: 0% user + 0.2% kernel
      0.1% 4090/com.hjwordgames:pushservice: 0.1% user + 0% kernel / faults: 1551 minor
      0.2% 2135/com.fanli.android.apps: 0.1% user + 0% kernel / faults: 5490 minor
      0.1% 13655/.DaemonService: 0.1% user + 0% kernel
      0.1% 25689/com.douban.frodo: 0.1% user + 0% kernel / faults: 276 minor
      0.1% 17113/com.lastpass.lpandroid: 0.1% user + 0% kernel / faults: 13 minor
      0.1% 3021/com.smzdm.client.android: 0.1% user + 0% kernel / faults: 619 minor
      0.1% 31410/kworker/0:4: 0% user + 0.1% kernel
      0.1% 5053/kworker/0:0: 0% user + 0.1% kernel
      0.1% 7/rcu_preempt: 0% user + 0.1% kernel
      0.1% 31308/kworker/1:1: 0% user + 0.1% kernel
      0.1% 3496/com.smzdm.client.android:QALSERVICE: 0% user + 0% kernel / faults: 1021 minor
      0.1% 2320/com.android.phone: 0% user + 0% kernel / faults: 90 minor
      0.1% 2162/com.catchingnow.icebox:Service: 0.1% user + 0% kernel / faults: 662 minor
      0.1% 10/rcuop/0: 0% user + 0.1% kernel
      0.1% 493/healthd: 0% user + 0.1% kernel
      0.1% 13190/kworker/0:2: 0% user + 0.1% kernel
      0% 4075/com.smzdm.client.android:core: 0% user + 0% kernel / faults: 732 minor 1 major
      0% 941/ipacm: 0% user + 0% kernel
      0% 13475/com.tencent.mm: 0% user + 0% kernel / faults: 58 minor
      0% 25826/com.douban.frodo:pushservice: 0% user + 0% kernel
      0% 16098/com.hjwordgames: 0% user + 0% kernel / faults: 822 minor 2 major
      0% 30029/com.netease.cloudmusic: 0% user + 0% kernel / faults: 604 minor
      0% 444/logd: 0% user + 0% kernel / faults: 1 minor
      0% 2668/com.smzdm.client.android:channel: 0% user + 0% kernel / faults: 496 minor
      0% 739/netd: 0% user + 0% kernel / faults: 578 minor
      0% 2039/com.catchingnow.icebox: 0% user + 0% kernel / faults: 51 minor
      0% 753/thermal-engine: 0% user + 0% kernel
      0% 3616/com.fanli.android.apps:xg_service_v3: 0% user + 0% kernel / faults: 349 minor
      0% 495/lmkd: 0% user + 0% kernel
      0% 730/jbd2/dm-0-8: 0% user + 0% kernel
      0% 742/rild: 0% user + 0% kernel
      0% 6131/com.tencent.mm:push: 0% user + 0% kernel / faults: 75 minor
      0% 9407/cn.wiz.note: 0% user + 0% kernel / faults: 64 minor
      0% 22/ksoftirqd/2: 0% user + 0% kernel
      0% 1856/sdcard: 0% user + 0% kernel
      0% 25/rcuop/2: 0% user + 0% kernel
      0% 496/servicemanager: 0% user + 0% kernel
      0% 1381/kworker/1:3: 0% user + 0% kernel
      0% 2141/com.oneplus.camera: 0% user + 0% kernel
      0% 765/cnss-daemon: 0% user + 0% kernel
      0% 32524/kworker/2:2: 0% user + 0% kernel
      0% 5673/com.netease.cloudmusic:play: 0% user + 0% kernel / faults: 196 minor
      0% 6991/com.jingdong.app.reader: 0% user + 0% kernel / faults: 567 minor
      0% 18/rcuop/1: 0% user + 0% kernel
      0% 587/sensors.qcom: 0% user + 0% kernel / faults: 62 minor
      0% 2291/com.oneplus.camera:picture: 0% user + 0% kernel
      0% 2300/com.oneplus.gallery: 0% user + 0% kernel
      0% 1096/xposed_service_app: 0% user + 0% kernel
      0% 4964/irq/21-408000.q: 0% user + 0% kernel
      0% 5109/kworker/3:1: 0% user + 0% kernel
      0% 436/kworker/0:1H: 0% user + 0% kernel
      0% 1848/wlan_logging_th: 0% user + 0% kernel
      0% 10572/cn.wiz.note:channel: 0% user + 0% kernel / faults: 502 minor
      0% 32/rcuop/3: 0% user + 0% kernel
      0% 187/hwrng: 0% user + 0% kernel
      0% 735/file-storage: 0% user + 0% kernel
      0% 2333/com.android.launcher3: 0% user + 0% kernel / faults: 8 minor
      0% 4982/perfd: 0% user + 0% kernel
      0% 8/rcu_sched: 0% user + 0% kernel
      0% 29/ksoftirqd/3: 0% user + 0% kernel
      0% 143/kswapd0: 0% user + 0% kernel
      0% 428/ueventd: 0% user + 0% kernel
      0% 5734/com.duokan.reader:pushservice: 0% user + 0% kernel / faults: 3 minor
      0% 26019/com.instagram.android:mqtt: 0% user + 0% kernel / faults: 112 minor
      0% 11/rcuos/0: 0% user + 0% kernel
      0% 760/zygote64: 0% user + 0% kernel / faults: 1215 minor
      0% 2272/com.quicinc.cne.CNEService: 0% user + 0% kernel / faults: 6 minor
      0% 3381/com.google.android.gms: 0% user + 0% kernel / faults: 393 minor
      0% 29600/kworker/3:2: 0% user + 0% kernel
      0% 451/vold: 0% user + 0% kernel
      0% 745/installd: 0% user + 0% kernel
      0% 2103/wpa_supplicant: 0% user + 0% kernel
      0% 2277/com.android.nfc: 0% user + 0% kernel
      0% 7631/com.instagram.android: 0% user + 0% kernel / faults: 3 minor
      0% 26/rcuos/2: 0% user + 0% kernel
      0% 44/msm_watchdog: 0% user + 0% kernel
      0% 494/dashd: 0% user + 0% kernel
      0% 750/cnd: 0% user + 0% kernel
      0% 2682/com.fanli.android.apps:channel: 0% user + 0% kernel
      0% 25022/kworker/2:0H: 0% user + 0% kernel
      0% 29503/kworker/1:0: 0% user + 0% kernel
     +0% 5626/kworker/2:1: 0% user + 0% kernel
     +0% 5854/kworker/3:0: 0% user + 0% kernel
     +0% 5886/kworker/1:4: 0% user + 0% kernel
     +0% 5981/kworker/0:1: 0% user + 0% kernel
     +0% 6096/com.ideashower.readitlater.pro: 0% user + 0% kernel
    11% TOTAL: 5.2% user + 4.3% kernel + 0% iowait + 1.3% irq + 0.3% softirq

## 内存信息

    adb shell dumpsys meminfo
    # 指定应用内存
    adb shell dumpsys meminfo package_name

## Activity 信息

    adb shell dumpsys activity
    adb shell dumpsys activity -h

## 获取 package 信息

    adb shell dumpsys package
    adb shell dumpsys package -h
    adb shell dumpsys package pacakge_name

## 获取通知信息

    adb shell dumpsys notification

## 获取 wifi 信息

    adb shell dumpsys wifi

## 电话信息

    adb shell dumpsys telephony.registry

输出

- mCallState 0 表示待机，1 表示来电未接状态，2 表示电话占线
- mDataConnectionState 0 无数据连接，1 正在创建数据连接，2 已连接

## reference

- <https://developer.android.com/studio/command-line/dumpsys>
