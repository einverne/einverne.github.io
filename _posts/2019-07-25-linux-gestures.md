---
layout: post
title: "Linnx Mint 上使用触摸板手势"
tagline: ""
description: ""
category: 经验总结
tags: [linux, mint, gesture, touchpal, trackpad, ]
last_updated:
---

都知道 Mac 上的触摸板非常好用，简单的手势就能实现十几种操作，从单指，双指，三指，到四指，甚至五指，从轻点，按压，到滑动，到捏合，组合起来能实现非常多的操作。


## Mac 下手势
通过不同的组合可以得到非常多的功能。一些比较重要的操作列在了下面。

### 单指
一个手指轻轻点击，可以选中目标；

### 双指

- 两个手指同时点击，鼠标右键功能；
- 两个手指轻点，Smart zoom，可以快速缩放；
- 两个手指分开或捏合，可以放大缩小图片、网页等内容；
- 两个手指上下拖移滑动，即可实现翻页；
- 两个手指旋转，可以旋转图片等对象；
- 两个手指从触控板右侧边缘向左滑动，可以调出通知窗口；
- 两个手指在网页中左右滑动，可以倒退或前进网页；


### 三指

- 三个手指可以调用 Look Up
- 三个手指左右滑动，可以在全屏应用桌相互切换；
- 三个手指向上滑动，可以打开所有正在使用的软件窗口；
- 三个手指向下滑动，可以打开同一个软件的不同窗口；

### 四指

- 四个手指同时捏合，可以调出应用程序窗口；
- 四个手指同时张开，可以显示桌面；

## Linux 下手势
日常使用 Linux Mint 对手势要求倒也没有那么高，很多上面列举的功能都能用快捷键来实现，比如查词，我就是用 GoldenDict 的全局快捷键 Ctrl+C Ctrl+C，不过倒是要事先选中。比如切换 Workspace，我是用 Alt + 1/2/3/4 来控制的，其他切换应用倒也都有对应的快捷键，不过有时候确实感觉到 Mac 上触摸板在浏览网页时非常舒服，虽然我用 Vimium 映射了一些快捷键，H/L 但有时候就是没触摸板方便。

## 准备工作

### 安装必要的工具
第一步安装必要的依赖：

	sudo apt install python3 python3-setuptools python3-gi libinput-tools python-gobject xdotool wmctrl

将当前用户加入 input 用户组：

	sudo gpasswd -a $USER input


### 安装 libinput-gestures
然后安装 libinput-gestures

需要到 [GitHub](https://github.com/bulletmark/libinput-gestures) 项目页面手工安装 libinput-tools。

	git clone https://github.com/bulletmark/libinput-gestures.git
	cd libinput-gestures
	sudo make install (or sudo ./libinput-gestures-setup install)

安装后执行

	libinput-gestures-setup autostart
	libinput-gestures-setup start

默认的手势配置在 `/etc/libinput-gestures.conf` 下，如果要创建自定义的配置，可以将配置内容拷贝到 `~/.config/libinput-gestures.conf` 然后编辑该文件。更多 libinput-gestures 的说明可以参考 [GitHub 页面](https://github.com/bulletmark/libinput-gestures)

### 安装 GUI 配置
再安装 gestures 图形化安装界面

	git clone https://gitlab.com/cunidev/gestures.git
	cd gestures
	sudo python3 setup.py install

然后从菜单中搜索 gestures 就能打开。

当然如果想用配置文件来配置，直接编辑 `~/.config/libinput-gestures.conf` 文件也可以。

### 配置

Gestures 实现的强大功能都依赖于 Cinnamon 中非常丰富的快捷键功能，在设置中能看到非常丰富的快捷键设置，在此定义好快捷键就能在 xdotool 中使用。Linux Mint 默认的快捷键可以在此[查看](https://shortcutworld.com/Linux-Mint/linux/Linux-Mint_Shortcuts)

![linux mint keyboard shortcut](/assets/linux-mint-keyboard-shortcut.png)

折腾一番后可以实现这些功能。

### 三指上滑显示所有打开的窗口
Cinnamon 中 Toggle Scale view (display all windows on current Workspace) 的快捷键是 Ctrl + Alt + Down，所以：

	xdotool key Ctrl+Alt+Down

### 三指下滑切换桌面与当前应用
Cinnamon 的桌面我的快捷键是 Super+d 来显示桌面，所以可以设置：

	xdotool key super+d

### 三指切换工作区

	xdotool key Ctrl+Alt+Left
	xdotool key Ctrl+Alt+Right

其他组合同理。

更多的按键代码可以在[这里](https://gitlab.com/cunidev/gestures/-/wikis/xdotool-list-of-key-codes) 看到。

## Extend
外延，如果喜欢使用鼠标手势，Linux 下可以尝试一下 [EasyStroke](https://github.com/thjaeger/easystroke/wiki)，个人不太喜欢使用鼠标，所以就暂时列在这里，暂不使用。


## reference

- <https://github.com/bulletmark/libinput-gestures>
- <https://gitlab.com/cunidev/gestures>
- <https://www.semicomplete.com/projects/xdotool/>
- <https://wayland.freedesktop.org/libinput/doc/latest/gestures.html>
- <https://github.com/iberianpig/fusuma>
