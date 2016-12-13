---
layout: post
title: "Android Notification"
tagline: ""
description: ""
category: Android
tags: [Android, AndroidDev, ]
last_updated: 
---


Android Support v4 包中的 NotificationCompat.Builder ，在 Android 3.0 API Level 11 中才有 Notification.Builder。

## 创建通知
您可以在 NotificationCompat.Builder 对象中为通知指定 UI 信息和操作。要创建通知，请调用 NotificationCompat.Builder.build()，它将返回包含您的具体规范的 Notification 对象。要发出通知，请通过调用 NotificationManager.notify() 将 Notification 对象传递给系统。

必需的通知内容

Notification 对象必须包含以下内容：

- 小图标，由 setSmallIcon() 设置
- 标题，由 setContentTitle() 设置
- 详细文本，由 setContentText() 设置

setContentIntent()  设置用户点击通知之后的动作。

NotificationCompat.Builder 在构造时自动设置时间为 System.currentTimeMillis() ，设置 Audio stream 为 `STREAM_DEFAULT`。

NotificationCompat.Builder 中可选的其他参数有

- setAutoCancel()  设置通知是否自动消失
- setLargeIcon(Bitmap icon) 设置大图标
- setTicker()  设置通知第一次到达时在status bar 上显示的文字，在Android L版本之后不再显示
- setLights()  设置通知呼吸灯的颜色以及频率
- setDeleteIntent()  设置用户直接在通知列表删除通知时的动作
- setAction() 设置通知中的动作

## 重要类

NotificationCompat.Builder 不必多说，其他重要的类有 `NotificationCompat.Action` 通知动作需要包含一个图标，一个标签，一个 PendingIntent 。通知动作在 Android 4.1 之前不会显示。

如果要在通知栏显示复杂View，需要设定 RemoteView，使用 `setContent(RemoteViews views)` 方法

`NotificationCompat.Style` 用来展现更丰富的通知内容的样式，直接子类有

- NotificationCompat.BigPictureStyle
- NotificationCompat.BigTextStyle
- NotificationCompat.InboxStyle
- NotificationCompat.MediaStyle

BigPictureStyle 可以显示大图，如果通知附带一张大图片，可以使用该样式。通常 Android 截屏之后显示的通知就是。

    Notification notif = new Notification.Builder(mContext)
         .setContentTitle("New photo from " + sender.toString())
         .setContentText(subject)
         .setSmallIcon(R.drawable.new_post)
         .setLargeIcon(aBitmap)
         .setStyle(new Notification.BigPictureStyle()
             .bigPicture(aBigBitmap))
         .build();

InboxStyle 可以产生多行文本的通知，至多可以显示5个字符串。

    Notification noti = new Notification.Builder()
         .setContentTitle("5 New mails from " + sender.toString())
         .setContentText(subject)
         .setSmallIcon(R.drawable.new_mail)
         .setLargeIcon(aBitmap)
         .setStyle(new Notification.InboxStyle()
             .addLine(str1)
             .addLine(str2)
             .setContentTitle("")
             .setSummaryText("+3 more"))
         .build();

还有可以显示很多文字的 BigTextStyle，和比较复杂的 MediaStyle。

## Android 4.4 以下的通知

![android notification](https://lh4.googleusercontent.com/-fFhC1XFLiqc/V-noomqkvwI/AAAAAAABDNM/yoCX0PTtut4LsmhelxhLskdeGMzG-v8igCJoC/w340-h200-no/Android_notification_4.png)

![android notification expand](https://lh3.googleusercontent.com/-LthdqPKbfMk/V-noo7b4bsI/AAAAAAABDNM/zgE36HdwrZoVpGoEUbDJ9oWBFS3_ehOCQCL0B/w760-h396-no/Android_notification_4_expand.jpg)

## Android 5.0 及以上的通知

![android notification 5](https://lh4.googleusercontent.com/-hgQhQzgJMPk/V-noo_jI8DI/AAAAAAABDNM/PVDDK5xMd4IpEEL7-CvT9rv_HZscHKPHQCL0B/w1330-h443-no/android_notification_5.png)

## reference

- <https://developer.android.com/reference/android/support/v4/app/NotificationCompat.Builder.html>
- <http://www.androidpolice.com/2014/11/14/lollipop-feature-spotlight-the-status-bar-notification-ticker-is-gone-and-thats-kind-of-dumb/>
- <http://stackoverflow.com/questions/16168553/create-custom-notification-android>
- <http://dj-android.blogspot.in/2013/04/android-notifications-3-applying-big.html>