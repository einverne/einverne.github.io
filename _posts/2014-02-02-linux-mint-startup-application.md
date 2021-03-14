---
layout: post
title: "Linux Mint 下开机自启动应用"
tagline: ""
description: ""
category: 经验总结
tags: [linux, linux-mint, cinnamon, startup, application, ]
last_updated:
---

在 Cinnamon 桌面环境下有一个开机启动应用的管理程序叫做 startup applications，用该程序来管理开机启动应用是非常方便的。更准确的来说应该是 login 到桌面环境中启动的应用程序管理。

>

## 使用

命令行是

    cinnamon-settings startup

同样在 gnome 的桌面环境下也有一个相似的 `gnome-session-properties` 但是这个应用没有 Cinnamon 提供的方便友好，一个很大的差别就是 Cinnamon 提供的 startup 工具允许用户直接选择已经安装的应用，而 gnome 提供的只允许用户自己选择执行脚本（命令），自己选择图标，标题等等。Cinnamon 帮我们做了很多友好的工作。

实际上所有开机自启动的配置都在 `~/.config/autostart` 目录中，每一个启动项都以自己名字开头，比如 GoldenDict `goldendict.desktop` 这样的名字，包含如下内容。

    [Desktop Entry]
    Type=Application
    Terminal=false
    Categories=Office;Dictionary;Education;Qt
    Name=GoldenDict
    GenericName=Multiformat Dictionary
    Comment=GoldenDict
    Encoding=UTF-8
    Icon=goldendict
    Exec=goldendict
    X-GNOME-Autostart-enabled=true
    NoDisplay=false
    Hidden=false
    Name[en_US]=GoldenDict
    Comment[en_US]=GoldenDict
    X-GNOME-Autostart-Delay=100

其中定义了常见的配置，包括启动命令，图标，名字等等。


## reference

- <https://github.com/linuxmint/cinnamon-settings-daemo>
