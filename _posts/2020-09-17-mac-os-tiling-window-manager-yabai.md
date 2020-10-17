---
layout: post
title: "Mac OS 上的平铺窗口管理工具 yabai"
tagline: ""
description: ""
category:
tags: [mac, tiling-window-manager, window-manager, hammerspoon, ]
last_updated:
---

yabai 是一个 Mac OS 上的平铺窗口管理工具。Linux 上很早就有一系列的[平铺窗口管理工具](https://en.wikipedia.org/wiki/Tiling_window_manager)，比如 i3, awesome 等等。yabai 将这个功能带到了 Mac 上。所谓的平铺式窗口管理，是相较于普通的浮动窗口管理，在通常使用的情况下，系统上的应用如果打开了很多，就不可避免的相互叠加，需要频繁的使用 ⌘+Tab 来切换窗口。而平铺式窗口管理，则将所有的窗口平铺在桌面上，窗口之间不会相互重叠。


自定义快捷键完成窗口管理，比如最大化，调整大小，调整布局，切换桌面，移动到其他显示器等等
自动进行窗口布局
多桌面多显示器支持
高度的可订制化


## 安装

通过[官网的教程](https://github.com/koekeishiya/yabai/wiki/Installing-yabai-(latest-release)) 直接进行安装。

- [关闭系统完整性保护 System Integrity Protection](https://github.com/koekeishiya/yabai/wiki/Disabling-System-Integrity-Protection)


## 配置

yabai 的 [wiki](https://github.com/koekeishiya/yabai/wiki/Configuration) 已经解释了大部分的配置。

yabai 会自动加载 `~/.yabairc` 配置文件。

配置的格式：

	yabai -m <category> <command>

在配置调试阶段，不可避免的会需要多次加载 yabairc 配置，如果每次都要重启 `brew services restart yabai` 太慢了，yabai 提供了重新加载的方法，执行 ：

	launchctl kickstart -k "gui/${UID}/homebrew.mxcl.yabai"

也可以绑定快捷键

```
# e.g. bind to key in skhd:
# ctrl + alt + cmd - r : launchctl kickstart -k "gui/${UID}/homebrew.mxcl.yabai"
```

因为我自己的常用的快捷键是 hyper+r 重新加载 hammerspoon 的配置，所以改了一下 hyper+r 不仅重新加载 hammerspoon, 也重新加载 yabai.

### Display
在显示器之间切换，显示器的编号可以在系统偏好中查看。

```
# Focus display focused before the current one (so you can alternate)
yabai -m display --focus recent

# Focus previous display by arrangement index
yabai -m display --focus prev

# Focus next display by arrangement index
yabai -m display --focus next

# Focus display with arrangement index 2
yabai -m display --focus 2
```

### Space
将焦点放到不同的 Space 上

	alt - 1 : yabai -m space --focus 1
	alt - 2 : yabai -m space --focus 2
	alt - 3 : yabai -m space --focus 3
	alt - 4 : yabai -m space --focus 4

### Windows
将光标定位到同一个 Space 的不同窗口上。

```
# focus window
alt - j : yabai -m window --focus south
alt - h : yabai -m window --focus west
alt - k : yabai -m window --focus north
alt - l : yabai -m window --focus east
```

交换窗口的位置

```
alt + shift - j : yabai -m window --swap south
alt + shift - h : yabai -m window --swap west
alt + shift - k : yabai -m window --swap north
alt + shift - l : yabai -m window --swap east
```

同样可以定义移动窗口

```
shift + cmd - h : yabai -m window --warp west
shift + cmd - j : yabai -m window --warp south
shift + cmd - k : yabai -m window --warp north
shift + cmd - l : yabai -m window --warp east
```




## 参考配置

- yabai 作者的配置 <https://github.com/koekeishiya/dotfiles>
- <https://github.com/narze/dotfiles>
- <https://github.com/einverne/dotfiles>

## reference

- <https://github.com/koekeishiya/yabai>
