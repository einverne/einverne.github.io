---
layout: post
title: "在 Ubuntu/Mint 下快速创建桌面快捷方式"
tagline: ""
description: ""
category: 经验总结
tags: [linux, desktop, desktop-icon, short-cut, gnome, ]
last_updated:
---

Mint 下有些应用下载之后，解压就能使用，但是这样每次启动该应用时就需要到这个目录中来启动，没有可快捷方式可以直接在桌面上，或者启动器中快速启动。 Mint/Ubuntu 中，gnome 桌面的快捷方式都存在 `~/.local/share/applications` 目录下。

系统中还有另外一个目录 `/usr/share/applications` 也会存放桌面快捷方式。

使用 `gnome-desktop-item-edit ~/.local/share/applications --create-new` 即可创建新的快捷方式。如果该命令不存在记得安装

    sudo apt-get install --no-install-recommends gnome-panel

运行上面的命令之后会出现一个对话框，然后选择相应的图标，可执行文件地址，起名字即可。这样以后就可以从启动器中启动该应用。[Wiznote](/post/2018/02/wiznote.html) 就是使用该方法来启动的 .AppImages 文件。

创建的 Desktop 文件 (.desktop) 类似下面

    [Desktop Entry]
    Encoding=UTF-8
    Name=eclipse
    Comment=Eclipse IDE
    Exec=/usr/local/eclipse/eclipse  #根据软件的具体执行路径修改
    Icon=/usr/local/eclipse/icon.xpm  #根据软件的具体执行路径修改
    Terminal=false  #软件打开时是否启动终端
    StartupNotify=false
    Type=Application
    Categories=Application;Development;

另外系统的 desktop 默认地址是 `/usr/share/applications` 。将文件创建在该文件夹中也能够达到效果。
