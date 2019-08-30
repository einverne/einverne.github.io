---
layout: post
title: "在 Ubuntu 下为 Postman 创建 icon"
tagline: ""
description: ""
category: 经验总结
tags: [ubuntu, linux-mint, wiznote, postman, icon, launcher, ]
last_updated:
---

Postman 早两年就不再更新 Chrome 版本的应用，转而发布 Native app，这个原生的应用非常完美，但唯一的不足就是没有启动 ICON，下载之后就只有一个 tar 包，解压到任意一个文件夹之后就能使用，但是在桌面上，或者启动器中是无法找到该应用的。

和之前说过的给 [Wiznote](/post/2018/02/wiznote.html) 一样，可以使用 gnome 提供的工具来给 Postman 也提供一个 ICON

	gnome-desktop-item-edit ~/.local/share/applications --create-new

然后填入应用图标，路径，等等就可以。然后去该目录下查看就能看到已经创建了一个 Postman.desktop 文件，当然你也可以手动创建该文件。

	[Desktop Entry]
	Encoding=UTF-8
	Version=1.0
	Type=Application
	Name=Postman
	Icon=postman.png
	Path=/home/[your username]/Postman
	Exec=/home/[your username]/Postman/Postman
	StartupNotify=false
	StartupWMClass=Postman

如果只想要展示在 Unity;GNOME 下可以配置：

	OnlyShowIn=Unity;GNOME;
	X-UnityGenerated=true

系统主题的大部分图标在该目录下：

	/usr/share/icons/

## reference

- <https://www.getpostman.com/apps>

