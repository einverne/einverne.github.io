---
layout: post
title: "Android GPS 反作弊"
tagline: ""
description: "Android 防止模拟位置方法"
category: 学习笔记
tags: [Android, AndroidDev]
last_updated: 
---

在移动设备上有很多方式来追踪用户的地理位置信息，下文会展开。然而并没有一种方式能够很容易作弊，对于日常普通用户而言模拟地理位置可以实现但是相对成本较高。因而综合使用以下的定位方法，可以让模拟地理位置信息变得非常困难。

有以下技术可以用来实现GPS定位：

- [GPS Reporting](http://en.wikipedia.org/wiki/GPS_tracking_unit)  ，这是相对来说成本较“昂贵”的定位方法，一般来说 GPS 需要消耗更多的电量来提供GPS芯片读取卫星信号。GPS 信号可以编程通过修改GPS芯片驱动来改变获取到的位置，这种方式[甚至不需要修改设备](http://www.ae.utexas.edu/news/features/todd-humphreys-research-team-demonstrates-first-successful-gps-spoofing-of-uav)。

- [GSM Reporting](http://en.wikipedia.org/wiki/Mobile_phone_tracking) 通常是最常见的定位方法，通过距离最近的三个信号塔，三角定位。在这种方式下，模拟位置相对较难。或许可以通过修改设备硬件，或者通过伪造基站来达到伪造定位，当成本也相对较高。并且，一般来说通信是加密的，也会造成不少困扰。

- [LAN Reporting](http://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=0CCcQFjAB&url=http%3A%2F%2Fweb.cs.wpi.edu%2F~emmanuel%2FMQPs%2Flocus%2FLocus_MQP_Report.pdf&ei=2QbqU8afFOfjsATTiIGQBQ&usg=AFQjCNGOu_RWdAY3WiY93gC5d6jM-GqsGQ&sig2=p8bbtX2LgfGfg1Tqu6YqHA&bvm=bv.72676100,d.cWc&cad=rja) 这种方式通常能够提供高精度的室内定位。

- [WAN Reporting](http://www.webtorials.com/content/2012/07/tracking-hackers-down---then-striking-back.html) 这种方式就是简单的 IP 定位，这种方式也是最容易破解的。这种方式也是通常移动设备上网页常见的定位用户方法。

- [Others](http://en.wikipedia.org/wiki/Location-based_service#Control_plane_locating) 除了以上提到的常见定位方法，还有一起其他的定位方法，比如“[惯性导航系统](http://en.wikipedia.org/wiki/Inertial_navigation_system)” , 这种方式不需要额外的传输手段，它使用内部的传感器和地图来确定位置，具体来说就是“使用加速器和陀螺仪来测量物体加速度和角速度，并使用计算机来连续估算 运动物体的位置、姿态和速度。通常不需要外部参考系，常被用在飞机，导弹， 潜艇和各种航天器中。” 摘自[维基](https://zh.wikipedia.org/wiki/%E6%83%AF%E6%80%A7%E5%AF%BC%E8%88%AA%E7%B3%BB%E7%BB%9F) 。

其他可以考虑的因素是，大部分的地理位置数据会保存在移动设备的某个地方。因此开发者可以通过获取用户上一次的地理位置信息来判断当前的位置信息是否正确。比如你可能1min前还在北京海淀，然后现在定位信息在美国华盛顿，这样的位置变化可能有些问题。

以上翻译自[Security StackOverflow](http://security.stackexchange.com/a/65215/112050) **(Bluetooth, RFID, Inertial nav, experimental, etc)** 



## 检测 Android 模拟位置

在讲完实现定位方式之后，探讨一下 Android 对于模拟 GPS 的检测方法。 



### Developer Mode Mock Location

在 6.0 以前在开发者选项中有模拟位置的选项可选，开发者可以用过模拟位置来伪造地理位置信息。这种方式可以被很多方法检测到。比如：

    public static boolean isMockSettingsON(Context context) {
      // returns true if mock location enabled, false if not enabled.
      if (Settings.Secure.getString(context.getContentResolver(),
                                    Settings.Secure.ALLOW_MOCK_LOCATION).equals("0"))
         return false;
      else
         return true;
     }

第二种方式是检测安装的应用中是否有应用使用了 `android.permission.ACCESS_MOCK_LOCATION` 权限。

    public static boolean areThereMockPermissionApps(Context context) {
      int count = 0;
      PackageManager pm = context.getPackageManager();
      List<ApplicationInfo> packages =
         pm.getInstalledApplications(PackageManager.GET_META_DATA);
      for (ApplicationInfo applicationInfo : packages) {
         try {
            PackageInfo packageInfo = pm.getPackageInfo(applicationInfo.packageName,
                                                        PackageManager.GET_PERMISSIONS);
            // Get Permissions
            String[] requestedPermissions = packageInfo.requestedPermissions;
            if (requestedPermissions != null) {
               for (int i = 0; i < requestedPermissions.length; i++) {
                  if (requestedPermissions[i]
                      .equals("android.permission.ACCESS_MOCK_LOCATION")
                      && !applicationInfo.packageName.equals(context.getPackageName())) {
                     count++;
                  }
               }
            }
         } catch (NameNotFoundException e) {
            Log.e("Got exception " + e.getMessage());
         }
      }
      if (count > 0)
         return true;
      return false;
      }

通过这两个方法能够减少一定程度非 root 机模拟位置的可能性。



### root 手机

而对于root机型，几乎无法从根源上反作弊，对于出来四年的 Ingress 也几乎无法避免作弊的问题，目前可知的 Ingress 对于位置欺骗的反作弊方式有：

- 速度限制， 35 miles per hour 大概是 55km/h 
- 交叉验证 SSID，通过匹配数据库中记录的 SSID 来确定位置

[摘自StackOverflow](http://stackoverflow.com/a/16776891/1820217)

而对于这两种方式 Ingress 官方并没有明确的文档指出，基本通过玩家黑盒测试得出。而对于最新出的 Pokemon Go，在全球作弊成风的情况下官方直接禁用了 Root 机型。因此目前对于 root 机型的反作弊我还是没有找到可用的方法。


