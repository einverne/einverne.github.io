---
layout: post
title: "Mac OS 上的平铺窗口管理工具 yabai"
tagline: ""
description: ""
category: 学习笔记
tags: [mac, tiling-window-manager, window-manager, hammerspoon, ]
last_updated:
---

yabai 是一个 Mac OS 上的平铺窗口管理工具。Linux 上很早就有一系列的[平铺窗口管理工具](https://en.wikipedia.org/wiki/Tiling_window_manager)，比如 i3, awesome 等等。yabai 将这个功能带到了 Mac 上。所谓的平铺式窗口管理，是相较于普通的浮动窗口管理，在通常使用的情况下，系统上的应用如果打开了很多，就不可避免的相互叠加，需要频繁的使用 ⌘+Tab 来切换窗口。而平铺式窗口管理，则将所有的窗口平铺在桌面上，窗口之间不会相互重叠。

## 为什么要用平铺式窗口管理
在不了解平铺式窗口管理之前，我个人非常厌烦的一个事情就是不停地在不同的窗口之前切换，并且切换的效率非常低，虽然在 Mac 上有 [Contexts](https://contexts.co/) 这样的软件来间接的提高窗口切换的速度，但是 Contexts 也需要一个模糊的查找来定位到需要切换的窗口。后来又发现了 Karabiner, 发现可以通过定义组合快捷键来快速切换到对应的应用，比如我定义了 oc 切换到 Chrome，ob 切换到 Obsidian, ok 切换到 kitty，这使得我在任何一个应用中都可以按下 o, 然后迅速的按下 c/b/k 等等来跳转到对应的窗口，即使这个应用窗口在后台，或者这个应用都没有开启，也会打开这个应用后将光标定位到该应用窗口。但这种情况下窗口大小的管理问题便随之而来，虽然我也用 Hammerspoon 定义了快捷键可以全屏，左右上下半屏，但窗口管理的其他一些问题还是没有得到进一步的改善，比如将窗口移动到第二个桌面，将窗口移到左边的显示器等等问题。

而平铺式的窗口管理，通过强可定制的快捷键将这些操作都固化成一定的动作，在熟悉这一些动作之后可以明显的提高效率，从窗口管理的麻烦中解脱出来。平铺式的窗口管理通常有如下特点：

- 高度可定制化的快捷键动作，一般的平铺窗口工具都会提供比如切换活动窗口，最大化 / 最小化，调整大小，切换桌面，移动到其他显示器等等动作，通过这些动作和自定义的快捷键的绑定就可以实现一套自己的工作流，更甚至可以直接抛弃鼠标
- 无需烦恼窗口的布局，在平铺式窗口管理下，窗口与窗口之间不会重叠，所有的窗口平铺在桌面上自动进行布局，再也不用担心窗口叠加切换的问题，但习惯了浮动窗口的用户可以一开始并不习惯，但如果使用久了之后就能摸索出一套属于自己的布局，利用一些快捷键可以立即进入该布局，在使用过程中也可以以 O(1) 的复杂度直接找到对应的窗口，切换窗口再不是问题

## 安装

如果要让 yabai 正常工作，需要 [关闭系统完整性保护 System Integrity Protection](https://github.com/koekeishiya/yabai/wiki/Disabling-System-Integrity-Protection)，然后通过[官网的教程](https://github.com/koekeishiya/yabai/wiki/Installing-yabai-(latest-release)) 直接进行安装。

	brew tap koekeishiya/formulae
	brew install yabai
	sudo yabai --install-sa

skhd 用于给 yabai 提供快捷键支持。

	brew install koekeishiya/formulae/skhd

如果有其他的键盘映射工具，比如 Hammerspoon, Karabiner 也是可以的。

如果要调试 skhd 可以在安装时：

	brew install skhd --with-logging

然后 skhd 就会将错误日志打印到 `/usr/local/var/log/skhd/skhd.err.log` 下。

## 配置

yabai 的 [wiki](https://github.com/koekeishiya/yabai/wiki/Configuration) 已经解释了大部分的配置选项。

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

因为我自己的常用的快捷键是 hyper+r 重新加载 hammerspoon 的配置，所以改了一下 hyper+r 不仅重新加载 hammerspoon 配置，也重新加载 yabai 配置。

### 模式切换
以 [koekeishiya](https://github.com/koekeishiya/dotfiles/blob/master/skhd/skhdrc) 的配置为例：

```
# change layout of desktop
ctrl + alt - a : yabai -m space --layout bsp
ctrl + alt - d : yabai -m space --layout float
ctrl + alt - s : yabai -m space --layout $(yabai -m query --spaces --space | jq -r 'if .type == "bsp" then "float" else "bsp" end')
```

说明：

- `ctrl + alt - a` 就是平铺窗口模式
- `ctrl + alt - d` 就是浮动窗口模式
- `ctrl + alt - s` 切换模式

使用者可以定义任何自己习惯的快捷键来替换这一套配置。

### 管理多个 Display 显示器
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
Space 指的是系统的不同虚拟桌面，yabai 可以快速的对不同的桌面进行管理。

将焦点放到不同的 Space 上

	alt - 1 : yabai -m space --focus 1
	alt - 2 : yabai -m space --focus 2
	alt - 3 : yabai -m space --focus 3
	alt - 4 : yabai -m space --focus 4

### 窗口管理 Windows

yabai 默认会使用二分的方式来划分窗口，一个窗口时会全屏，两个窗口时会左右对半，三个时会上下切分左边半个，依次类推。

#### 切换活跃窗口
下面的配置是将光标定位到同一个 Space 的不同窗口上。这个操作比较常见，使用 option 作为 modifier。切换活跃窗口的操作还是非常频繁的。

```
# focus window
alt - j : yabai -m window --focus south
alt - h : yabai -m window --focus west
alt - k : yabai -m window --focus north
alt - l : yabai -m window --focus east
```

这些定义分别对应着使得，j（下方）, k（上方）, h（左侧）, l（右侧） 的窗口成为活跃窗口。

交换窗口的位置

```
alt + shift - j : yabai -m window --swap south
alt + shift - h : yabai -m window --swap west
alt + shift - k : yabai -m window --swap north
alt + shift - l : yabai -m window --swap east
```

同样可以定义如何移动窗口

```
shift + cmd - h : yabai -m window --warp west
shift + cmd - j : yabai -m window --warp south
shift + cmd - k : yabai -m window --warp north
shift + cmd - l : yabai -m window --warp east
```

调整窗口大小的操作我用的很少，有需要可以使用。

```
# move window
shift + ctrl - a : yabai -m window --move rel:-20:0
shift + ctrl - s : yabai -m window --move rel:0:20
shift + ctrl - w : yabai -m window --move rel:0:-20
shift + ctrl - d : yabai -m window --move rel:20:0

# increase window size
shift + alt - a : yabai -m window --resize left:-20:0
shift + alt - s : yabai -m window --resize bottom:0:20
shift + alt - w : yabai -m window --resize top:0:-20
shift + alt - d : yabai -m window --resize right:20:0

# decrease window size
shift + cmd - a : yabai -m window --resize left:20:0
shift + cmd - s : yabai -m window --resize bottom:0:-20
shift + cmd - w : yabai -m window --resize top:0:20
shift + cmd - d : yabai -m window --resize right:-20:0
```

开关窗口的浮动模式

	alt - t : yabai -m window --toggle float && yabai -m window --grid 4:4:1:1:2:2

开关 picture-in-picture 模式

	alt - p : yabai -m window --toggle border && \
	          yabai -m window --toggle pip


## Status bar
我个人将桌面上除了窗口以外的所有状态栏等等都隐藏了，如果要添加自定义的内容可以选择：

- [spacebar](https://github.com/somdoron/spacebar)
- [uberbar](https://github.com/AdamWagner/yabai-uberbar)
- [uebersicht](http://tracesof.net/uebersicht/)

## stackline
stackline 是 yabai 的一个增强，在窗口的 stack 模式上增加了一层可视化的显示，一个 stack 会在左上角的地方显示当前这个 stack 中的应用列表。

## 参考配置

- yabai 作者的配置 <https://github.com/koekeishiya/dotfiles>
- <https://github.com/narze/dotfiles>
- <https://github.com/einverne/dotfiles>

## reference

- <https://github.com/koekeishiya/yabai>
- <https://github.com/koekeishiya/yabai/tree/master/examples>
- <https://github.com/koekeishiya/dotfiles/>
- <https://stevenlee090.github.io/yabai-skhd-wm/>
