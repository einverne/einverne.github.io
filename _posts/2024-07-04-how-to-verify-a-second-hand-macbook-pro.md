---
layout: post
title: "如何验证一台二手 MacBook Pro"
aliases:
- "如何验证一台二手 MacBook Pro"
tagline: ""
description: ""
category: 经验总结
tags: [macbook, macbook-pro, mac, second-hand, computer, bean-lifecycle, mac-app]
create_time: 2024-07-22 09:33:01
last_updated: 2024-07-22 09:33:01
dg-home: false
dg-publish: false
---

前些天在小红书看到有人发帖出一台 MacBook Pro 14 寸的 M1 Pro 16GB + 512 GB，并且还在 Apple Care 期限内，这个配置和 14.5 万日元的价格我感觉挺合适的，就和对方预约聊了一下，过程还是挺愉快的，约在了上野当面交易，这里就记录一下我是如何验证一台二手的 MacBook 电脑的。

通常验证就大致分成几个部分，包括外观的检查，系统检查，硬件测试，以及其他序列号，购买记录，发票等验证。接下来我就分别从这几个方面记录一下。

## 外观检查

外观方面也比较好检查，主要检查的几个部分，就是外壳，机身，屏幕，键盘是否有明显的划痕。

- 机身，屏幕，键盘是否有明显划痕和损坏
- 底部螺丝是否被拆卸

## 系统检查（软件）

外观检查完成之后可以打开系统，然后进入系统，在检查系统的时候也可以顺手把屏幕，电池状况等检查完毕。

- 检查屏幕
  - 使用[屏幕检查工具](https://lcdtech.info/en/tests/dead.pixel.htm)，检查全黑或全白亮点
  - 检查屏幕是否有脱膜问题
- 检查电池状况
  - 查看电池循环次数
  - 使用 [[coconutBattery]] 检查电池健康状态

## 硬件检查

另外可以使用自动自带的硬件检查，

- 系统诊断
  - 断开除键盘、鼠标、显示器、以太网连接（如果适用）和交流电源连接之外的所有外部设备。
  - 长按 Mac 上的电源按钮。（每台 Mac 都有一个电源按钮。在装有 Touch ID 的笔记本电脑上，按住 Touch ID。
  - 继续按住电源键，Mac 会打开并加载启动选项，看到 Options 选项时，松开电源键
  - 按住键盘上的 Command + D

在 Apple Diagnostics 中局自动进行一系列的检查。

硬件检查包括需要检查

- WiFi，手机共享热点，然后登录网页完成验证
- 屏幕，可以直接 Google screen test，找到网页测试工具，测试屏幕坏点
- 键盘，可以打开记事本，或者网页，一次按键盘，测试
- 触摸板，触摸板，也可以尝试滑动以及点按
- 摄像头，打开系统的 FaceTime 检查
- 麦克风，可以打开自带的 Voice Memo，然后尝试录音
- 扬声器，播放音频，播放 YouTube 测试
- 电池，查看电池状况以及电池循环次数和健康状况
  - 使用系统自带的，按住 Alt 然后点击左上角的 Apple Logo，点击 System Information，然后找到菜单栏中的 Power，可以在右侧看到 Health Information，包括了 Cycle Count，Condition，Maximum Capacity 等信息
  - 可以下载 [[CoconutBattery]] 这一款第三方应用，可以提供电池信息，包括电池容量，循环次数，健康状况等
- 蓝牙，直接使用蓝牙耳机连接，播放音乐即可
- 充电端口，连接充电器尝试
- USB-C 端口，我自带了一个 USB-C 的移动硬盘，插上之后读取，写入
- HDMI 端口，这部分因为我没有携带屏幕没有测试
- SD 卡槽，带上一个 SD 卡，测试读取和写入

## 序列号和保修状态

查看完系统，以及硬件，可以在系统的设置中查看当前机器的保修状态，点击左上角的 Apple Logo，然后点击 More，或者直接在系统中找到 General 信息，查看 Coverage Expired 状态。

并且在设置中确保设备未被激活锁定，退出 iCloud 帐号。

记录下序列号，可以在 [苹果官网](https://checkcoverage.apple.com/coverage)输入序列号，查看保修状态和生产日期 ， 确保序列号和机身底部序列号一致
