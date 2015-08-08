---
title: 照片添加GPS信息
layout: post
category : 经验总结
tagline: ""
tags : [DSLR, GPS, Nikon, 摄影]
---

在玩Ingress之后的很长一段时间内，我觉得如果照片没有地理位置信息是一种缺失，而去年买的 Nikon 单反没有GPS模块，Nikon提供的GPS模块需要单独购买价格不便宜并且携带不方便，于是我找到一种既便宜又简洁的方式可以给照片添加上GPS信息。

需要借助的工具：

- 支持GPS的Android手机一部
- Google [My Tracks](https://play.google.com/store/apps/details?id=com.google.android.maps.mytracks) 应用 
- [GeoSetter](http://www.geosetter.de/en/) 软件

具体原理是：按照时间顺序，将手机记录的GPS信息写入相机拍摄的照片中。

具体步骤：

1. 调校相机时间和手机时间保持一致
2. 使用My Tracks应用记录GPS信息，保证在使用单反拍照前后一直在记录。所以最好的办法是出门前打开My Tracks，回家关闭记录。
3. 回到家，导出照片，安装GeoSetter软件，将My Tracks记录的文件导出为gpx文件
4. 打开GeoSetter，全选所有照片，在菜单中找到和GPS文件同步，快捷键Ctrl+G，找到Android手机中Export出的gpx文件，同步。
5. Ctrl+S，保存。

之后GPS信息就被写到照片文件中了。
