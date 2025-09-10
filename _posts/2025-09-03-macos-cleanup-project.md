---
layout: post
title: "清理 macOS 上的一些低频使用的应用"
aliases:
- "清理 macOS 上的一些低频使用的应用"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, mac-app ]
create_time: 2025-09-08 10:19:25
last_updated: 2025-09-08 10:19:25
dg-home: false
dg-publish: false
---

之前的几台 MacBook Pro 都是因为钱包有限，所以只购买了 512GB 的空间。虽然也是够用的，但是如果安装的应用比较多的情况下，就会发现存储总是告警的情况。所以想着安装了 CleanMyMac 应用之后，就打开了它的 Uninstaller 功能，然后把我之前所有安装的应用列表都列出来，清理一下其中不是非常高频使用但是却又能解决特定需求的应用。

我直接按照占用磁盘空间的大小，一次把下面的一些软件都进行了卸载。 

## Trae

Trae 是字节跳动推出的一款 AI IDE。我之前也有做视频介绍过 Trae，但是说实话，我自己个人使用 Claude Code 比较多，直接 NPM 安装一个命令行，在终端打开这个命令行即可。非常轻量，我也不需要再打开一个 IDE。如果我想使用IDE的话，我也有非常多的其他选择，比如说 Cursor，JetBrain，Kiro 等等。 Trae 占用了 1.2GB 删除。

## Windsurf
同样是一款AI的IDE。我之前也有一段时间用过。但是现在有了 Claude Code，以及 Gemini CLI，基本上也没有了 Windsurf 的使用场景了。 

## Crystal

[[Crystal]] 是一个多实例的 Claude Code 管理工具，我个人直接在终端下使用，似乎也不需要再多一个 GUI 了。 

## Calibre

[[Calibre]] 是一个非常好用的开源电子书管理工具，非常推荐，也可以直接在 macOS 上对电子书格式进行转换。但是我自己编写了一个 Telegram 机器人，可以实时进行转码，也可以直接将书发送给 Kindle。因此，在 macOS 本地使用 Calibre 去管理电子书的场景不再存在了。 

## 懒猫微服

我自己购买了懒猫微服，但是说实话，我很少在macOS上使用懒猫微服去管理。手机上基本上也差不多够了。

## Clash for Windows
之前在国内的时候安装的，现在应该不需要了。 

## Cherry Studio

[[Cherry Studio]] 同样是一款我在视频当中介绍过的本地大语言模型客户端。 但现在我使用更轻量级的 [[ChatWise]]，并且日常当中，绝大部分都直接通过网页去询问“Perplexity”就解决了。 

## TimeScribe

[[TimeScribe]] 是一款开源的本地时间管理和追踪工具。 可以直接打开项目，在应用当中去管理在某一些任务当中花费的时间。 但是我觉得大部分都直接通过 Obsidian 里面的看板插件以及 [[ClickUp]] 这一个云端项目管理工具当中自带的时间追踪工具。因此，也用不到这个应用了。 

## Filo

[[Filo]] 是一款由AI加持的Gmail客户端。手机上体验过后，它可以直接帮忙自动总结邮件内容，添加代办事项等等。

但是说实话，手机上我也没有高频使用。因此，在MacOS下的版本我也就卸载了。 

## Electron

不太清楚为什么有一个 Electron 明明没有安装过。也有可能是之前在学习 Electron 的时候不小心安装了一个，竟然占用了我 200 多兆的空间。 

## Another Redis Desktop Manager
[[Another Redis Desktop Manager]] 这一款应用顾名思义，是一款 Redis 的管理工具。但好像应用场景不是很多，并且 Redis CLI 也能够解决绝大部分的问题。 

## Conductor

[[Conductor]] 是一款 Claude Code 的项目管理工具，可以同时开启多个 Cloud Code 的项目任务。 但好像使用场景也不是很高。 

## HandBrake 
[[HandBrake]] 是一款开源的视频编码转码工具。多媒体从业者必备，之前是因为在处理视频文件的时候下载的，但是好像使用频次也不是很高。  

## Web eID
之前初始化 [[爱沙尼亚 数字居民]] 时安装的认证工具，现在卸载了。


## OmniConverter

[[OmniConverter]] 是一款视频音频转码工具，也是之前在本地转码视频和音频的时候下载的，现在也不是高频使用了。 

## Shakepin

[[Shakepin]] 是一款 macOS 上的小工具，可以将我们的文件固定在某一个地方，快速获取。但是我想了想，自从限免的时候获取了，基本上再没有使用的场景，我绝大部分的文件都按照分类存储在我的磁盘上。基本上，我都能快速地找到我想要的文件。 

## FolderX

[[FolderX]] 是一款可以直接在 macOS 的状态栏中添加文件夹标签的小应用。 但是，Finder系统当中也有最近使用的文件列表，我也可以非常快速地找到我想要选择的文件。 

## ForkLift 
[[ForkLift]] 是一个非常老牌的 macOS 上的文件管理器，之前在对比购买 [[QSpace]] 的时候，我下载体验了，但说实话，在 macOS 上我基本上用不到大批量的文件管理工具。虽然 Finder不是那么好用，但是，最基础的文件管理命令直接在命令行中也可以完成。 

## Claudia

[[Claudia]] 是一个 Claude Code 管理工具，可以直接非常简单地管理 Claude Code。 我之前也做过视频，介绍过，但说实话，我还是在命令行下使用的场景比较多。 

## ZeroTier

[[ZeroTier]] 是曾经用了很久的内网穿透工具，但是现在我完全切换到了 [[Tailscale]]。

## Screen Recorder by Omi
[[Screen Recorder by Omi]] 顾名思义，这也是一款 macOS 上的屏幕录制工具。但是开源的有非常强大的 OBS。闭源的也有非常多可选项，它就没有存在的必要了。

## AnyDesk

[[AnyDesk]] 是我使用非常长一段时间的远程桌面控制工具，原本我可以用来控制在父母家中的电脑，帮他们解决一些问题，但是好像过去一年当中也没有太多启用的次数。 

## Folder Hub

[[Folder Hub]] 是一款可以将文件管理器隐藏在刘海下面的小应用。鼠标移动到 Mac OS 的浏海下面就可以启动一个隐藏的文件管理工具。 但是同样的命令行以及翻译都可以解决我的需求。 

## Mastonaut
[[Mastonaut]] 是一款开源的 Mastodon 客户端，我还是使用网页比较多。想不起来用客户端。

## Liquid

[[Liquid]] 是一款文本增强工具 [[Augmented Text Tool]]，可以快速给选定的文字进行增强。比如进行查词，翻译，润色，计算等等。

但是现在单独利用一个需要学习的应用，不如直接问 LLM。

## Clipsy

[[Clipsy]] 是一款粘贴板管理工具，我使用 [[Raycast]] 粘贴板管理用具就够了。 

## Homerow
[[Homerow]] 是一款 Mac OS 上的全键盘快捷操作工具，我之前做过视频测试，但好像使用场景不是很高。 

## ScreenBrush

[[ScreenBrush]] 是一款可以直接在屏幕上面演示时，进行写写画画的应用。好像我自己的使用频次不是很高。 

## Power Node 

[[Power Node Mind Map]] 是一款 MacOS 下的思维导图制作工具。非常简洁小巧。但是我个人使用频率不高。Obsidian 也包含了四位导图绘制的工具流。

## Create Custom Symbols
[[Create Custom Symbols]] 是一款 Mac OS 下的开源图像制作工具，可以将任意的 SVG icons 变成自己独一无二的设计。 

## Reminders MenuBar

[[Reminders MenuBar]] 在 macOS 的状态栏当中显示代办事项的小工具。 不怎么使用了。

## Snippet

[[Snippet]] 是一个 macOS 上的一个可视化的粘贴版工具。不再使用。

## timeGo

timeGo 是一个状态上的倒计时工具。

## Signal Shifter

[[Signal Shifter]] 是一个在 macOS 状态上的小工具，应用会创建完整的音频输入设备、音频输出设备以及可用作音频输入或输出的蓝牙设备列表。这样，您就可以在一个地方集中管理所有音频源。

## Check Check Check

Check Check Check 是一个状态栏上的任务管理工具。不怎么使用。