F---
layout: post
title: "告别手动管理窗口的烦恼 AeroSpace 极致的平铺窗口管理器上手体验"
aliases:
- "告别手动管理窗口的烦恼 AeroSpace 极致的平铺窗口管理器上手体验"
tagline: ""
description: ""
category: 产品体验
tags: [aerospace, macos, mac-app, macos-app, tiling-window-manager]
create_time: 2025-05-23 10:20:36
last_updated: 2025-05-23 10:20:36
dg-home: false
dg-publish: false
---

[AeroSpace](https://github.com/nikitabobko/AeroSpace) 是一个 macOS 上的 [[i3]] 类似的平铺窗口屏幕管理工具，很早之前我也介绍过另外一款开源的窗口平铺管理应用 [Yabai](https://blog.einverne.info/post/2020/09/mac-os-tiling-window-manager-yabai.html)，但是 Yabai 要禁用 macOS 的 SIP，最终还是没有利用起来，目前还是靠着 Contexts，[[Hammerspoon]] 来管理窗口。但是最近再次看到了 AeroSpace 这样一款平铺窗口管理器，它轻量，高效，灵活的配置直接成为了我窗口管理的第一候选。


## 什么是平铺窗口管理器

Tiling Window Manager（平铺式窗口管理器）是一种将屏幕空间自动划分为不重叠矩形区域、每个窗口都紧密排列、互不遮挡的窗口管理器类型。

为什么要使用平铺式窗口管理器呢？

- 最大化利用屏幕，所有的应用都平铺在桌面上，没有重叠和交叉
- 依赖键盘操作，减少对鼠标的依赖，提高效率
- 多任务处理提高效率，在开发，监控等等场景下，经常需要同时处理多个应用，经常需要快速切换和定位窗口
- 高度可订制化，支持自定义布局，配置，可以根据自己的习惯灵活调整
- macOS 上可以减少系统动画对我们操作的干扰，在 GNU/Linux 上则可以尽量节省系统资源占用，平铺窗口管理器通常非常轻量，简洁

## 为什么选择 AeroSpace

市面上的平铺窗口管理工具并不少，为什么我会选择 AeroSpace 呢？

- i3/Sway 类似的操作逻辑，在 GNU/Linux 下 i3wm 或 Sway 生态以及非常成熟，AeroSpace 借鉴了非常多这些前辈的核心理念，比如工作区 WorkSpace，容器 container，平铺布局 tiling layout 等等，用户通过键盘操作就可以完成窗口管理
- 平铺和浮动模式，AeroSpace 专注于平铺，新窗口会自动填满可用的空间，可以轻松切换窗口的布局，比如水平或垂直分割，对于一些特定的临时性开启的窗口也可以保留浮动窗口，比如临时开启系统偏好设置等等
- 基于文本文件的自定义配置文件，所有的配置通过一个纯文本文件 `~/.aerospace.toml` 来管理，可以使用任意自己喜欢的编辑器去编辑，像写代码一样管理快捷键，工作区名称，规则等等，也可以将自己的配置文件版本化，放到 Git 中去[管理](https://github.com/einverne/dotfiles)。
- 轻量高性能，和其他功能复杂的应用相比，AeroSpace 使用 Swift 编写响应迅速，几乎没有卡顿
- 无需关闭 SIP，Yabai 虽然也非常强大，但是很多高级功能，比如窗口边框，动画控制等都需要关闭 SIP，这会给 macOS 带来一定的安全风险，并且系统升级之后可能需要重新配置，AeroSpace 通过 macOS 的 Accessibility API 来实现窗口管理，巧妙的避开了这个问题
- 活跃的社区和开发

## 个人的调整
在很多人的配置和习惯中，将 mod+Enter 作为创建终端的快捷键，但是我个人因为在 Linux 就保留了使用 F12 呼出下拉式终端的方式，并且我使用的终端无论是 Guake， Kitty 还是 Warp  都可以在应用内创建多个 Tab 来管理，所以我个人还是保留了 F12 作为调用终端的习惯。

## 安装

通过如下的命令安装

```
brew install --cask nikitabobko/tap/aerospace
```

安装完成后，首次运行 AeroSpace 会提示你需要赋予辅助功能（Accessibility）权限。请前往“系统设置” -> “隐私与安全性” -> “辅助功能”，然后将 AeroSpace 添加进去并启用。

拷贝一份默认的配置，进行修改

```
cp /Applications/AeroSpace.app/Contents/Resources/default-config.toml ~/.aerospace.toml
```

AeroSpace 使用 TOML 格式作为核心配置文件，这个默认的配置文件已经包含了一部分基础的快捷键和设置，可以很好的作为初始学习配置的内容。TOML 格式易读并且支持注释。

## 使用

### 核心概念
在上手使用之前，可以先了解一下几个概念。

#### 显示模式

显示模式，AeroSpace 提供了平铺，堆叠和悬浮三种模式

- 平铺 tiles，所有打开的窗口平铺在当前屏幕中，像铺地砖一样
- 堆叠 accordion，所有应用窗口一层覆盖一层，只有一个应用在最前端显示
- 悬浮 floating，类似当前 macOS 管理窗口的模式

#### Workspace 工作区

Workspace（工作区），类似 macOS 中的虚拟桌面，每个工作区都有自己独立的显示模式，窗口布局。我通常会为不同的任务分配不同的工作区，比如一个用于编码，一个用于浏览器查资料，一个用于通讯工具。

#### Callbacks
Callbacks 回调，AeroSpace 提供了非常多的回调函数，用户可以在这些回调函数中执行命令，比如 `on-window-detected` 回调，就会在检测新窗口时调用。可以使用如下的语法来配置自己的行为。

```
[[on-window-detected]]
    if.app-id = 'com.apple.systempreferences'
    if.app-name-regex-substring = 'settings'
    if.window-title-regex-substring = 'substring'
    if.workspace = 'workspace-name'
    if.during-aerospace-startup = true
    check-further-callbacks = true
    run = ['layout floating', 'move-node-to-workspace S']  # The callback itself
```


#### 其他概念

- Container (容器)：在平铺模式下，窗口被组织在容器中。你可以改变容器的分割方式（水平/垂直）。
- Focus (焦点)：决定了哪个窗口是当前活动窗口，键盘输入会发送到这个窗口。

### AeroSpace 默认的快捷键

核心的几个动作

- 切换窗口
- 移动窗口
- 调整窗口大小
- 切换工作区
- 移动窗口到工作区
- 切换模式

| 功能                   | 快捷键                          |
| -------------------- | ---------------------------- |
| 修改为堆叠模式              | Option-comma                 |
| 修改为平铺模式              | Option-/                     |
| 当前焦点切换到左/下/上/右窗口     | Option-H/J/K/L               |
| 将当前窗口向左/下/上/右移动      | Shift-Option-H/J/K/L         |
| 调整当前窗口的大小            | Shift-Option -/=             |
| 切换到编号为 X 的工作区        | Option-X                     |
| 将当前窗口移动到编号 X 的工作区    | Shift-Option-X               |
| 在最近两个工作区切换           | Option-Tab                   |
| 将当前窗口移动到另外显示器        | Shift-Option-Tab             |
| 将当前窗口所属布局切换为横向       | Option-/（slash）              |
| 将当前窗口所属布局切换为纵向       | Option-; (semicolon)         |
| 重置当前工作区布局为等分         | Shift-Option-; 然后按 r         |
| 当前窗口改为悬浮             | Shift-Option-; 然后按 f         |
| 关闭所有其他窗口             | Shift-Option-; 然后按 Backspace |
| 将当前窗口与其左/下/上/右窗口归为一组 | Shift-Option-/ 然后按 H/J/K/L   |

作者在源代码中提供了[带注释版本](https://github.com/nikitabobko/AeroSpace/blob/main/config-examples/default-config.toml) 的说明，如果熟悉 i3 也可以参考 [i3 按键](https://github.com/nikitabobko/AeroSpace/blob/main/config-examples/i3-like-config-example.toml)。

AeroSpace 的默认快捷键以 Option 为主。

### 工作区
AeroSpace 重新实现了 macOS 的空间，并称之为 Workspace。当工作区不活跃时，所有窗口都会被放置在屏幕可见区域之外的右下角或左下角。一旦切换回工作区，窗口就会被重新放置到屏幕的可见区域。

上面快捷键部分提到了，可以使用 Option 加上数字键或者任意按键（不包括HJKL）来切换对应的工作区，Option+Tab 来在最近的两个工作区之间切换。

对于多显示器，AeroSpace 支持每个显示器拥有独立的工作区，可以使用 Option Shift Tab 将整个工作区移动到下一个显示器。

### 特定应用规则

有一些应用比如我自己使用 Raycast 启动器，Warp 终端，SmartGit，系统偏好等等天生就不适合平铺模式，可以在规则中设置，默认以浮动方式打开，或者在特定的工作区打开。

获取应用的 app-id 和 app-name 可以执行命令 `aerospace list-apps`。或者可以使用 osascript 命令

```
# 获取应用的 bundle ID
osascript -e 'id of app "App Name"'

# 获取应用的所有窗口标题
osascript -e 'tell application "System Events" to tell process "App Name" to get name of every window'
```


### 设置窗口间隔

为了区分窗口，我喜欢在窗口之间设置一个不太明显的间隙。

```
# ~/.aerospace.toml
[gaps]
inner.horizontal = 10
inner.vertical = 10
outer.left = 10
outer.bottom = 10
outer.top = 10
outer.right = 10
```

### 快捷键调整

默认情况下 AeroSpace 使用 Alt + 数字键作为切换 Workspace 的快捷键，这个默认的设置已经可以满足我切换工作区的需求了。

修改快捷键的时候注意不要和系统或其他全局快捷键冲突。

### 快捷键启动应用

AeroSpace 设计了一个功能，可以利用 `exec-and-forget` 来定义快捷键直接启动应用

```
# ~/.aerospace.toml
'alt - shift - return' = 'exec-and-forget open -n /Applications/iTerm.app'
'alt - shift - c' = 'exec-and-forget open -n /Applications/Google\ Chrome.app'
```

### 多显示器配置

AeroSpace 对多显示器的支持相当不错，每个显示器都可以有自己独立的工作区和布局。

如果你有自己的特定工作流，比如将特定的 Workspace 专门用于浏览器，终端，或者监控任务，并将他们固定在特定的显示器上，那么可以使用 `workspace-to-monitor-force-assignment` 来配置将特定的 Workspace 强制分配到特定的显示器中。

```
[workspace-to-monitor-force-assignment]
1 = 'main'
2 = 'secondary'
```

说明

- `main` 对应系统设置中设置的主显示器
- `second` 对应非主显示器

我自己的配置是将 1-4 工作区留给我的内置显示器，而将 5-8 分配给了外接显示器，在连接了显示器之后会得到显示器的名字，或者也已利用 AeroSpace 的命令 `aerospace list-monitors` 来获取显示器名字。

```
[workspace-to-monitor-force-assignment]
1 = 'main'
2 = 'main'
3 = 'main'
4 = 'main'
5 = ['secondary', 'main']
6 = ['secondary', 'main']
7 = ['secondary', 'main']
8 = ['secondary', 'main']
```

我就可以将 secondary 替换成我显示器的名字，这样如果有副显示器就会优先利用外接显示器，如果不可用则会回退到使用主显示器。

也可以利用正则表达式来匹配名字

```
7 = ['^dell.*', 'secondary', 'main']
```

完成配置之后还可以利用如下的命令在显示器之间移动工作空间。

```
# 移动当前工作空间到下一个显示器
aerospace move-workspace-to-monitor next

# 移动工作空间到特定显示器
aerospace move-workspace-to-monitor main
aerospace move-workspace-to-monitor secondary
```

## mode

可以利用 [mode](https://nikitabobko.github.io/AeroSpace/guide#binding-modes) 命令来定义组合快捷键。比如我们可以定义一套快捷键触发按键是 Alt-r，表示调整窗口，然后进入了 resize 模式之后，就可以再按下减号或者等于号来调整窗口大小。

```
[mode.main.binding]            # Declare 'main' binding mode
    alt-r = 'mode resize'      # 1. Define a binding to switch to 'resize' mode

[mode.resize.binding]          # 2. Declare 'resize' binding mode
    minus = 'resize smart -50'
    equal = 'resize smart +50'
```

这个模式非常类似 Tmux，以及我在 [[Hammerspoon]] 文章中介绍过的快捷键模式，因为这一类的产品操作完全依赖于键盘，所以为了避免快捷键冲突，经常会需要使用组合的快捷键，先通过一个快捷键触发进入某种模式之后，再按下按键来实现真正的动作。


## 比较

### AeroSpace vs 其他工具 (Yabai, Amethyst)

- **AeroSpace vs Yabai**：两者都深受 i3/bspwm 影响，配置和使用哲学相似。Yabai 在功能上可能更全面（比如窗口边框、透明度等），但如前所述，很多高级功能依赖关闭 SIP。AeroSpace 则力求在不关闭 SIP 的前提下提供核心的平铺窗口管理体验。对我来说，AeroSpace 目前提供的功能已经足够，且无需关闭 SIP 是决定性因素。
- **AeroSpace vs Amethyst**：Amethyst 更偏向于“自动”平铺，用户干预较少，配置选项也相对简单，开箱即用体验不错。AeroSpace 则赋予用户更大的控制权和自定义空间，更像是“手动挡”，需要你明确告诉它如何布局、如何移动。如果你喜欢完全掌控一切，AeroSpace 可能更适合。

## 小提示和注意

### 日志

如果遇到问题，可以通过 `~/Library/Logs/aerospace.log` 查看。

或执行命令 `aerospace status-bar-menu enable` 后从状态栏菜单中找到。

### 学习曲线

如果你之前没有接触过平铺窗口管理器，初期可能会有一点学习曲线，特别是记忆各种快捷键。但是一旦熟悉之后，效率的提升是巨大的。建议可以从默认的配置开始，根据自己的需求逐步改进和适配。


### 备份你的配置

默认的 `~/.aerospace.yaml` 配置文件在一段时间的调整之后，你也不想让它突然间丢失吧，那么通常情况下，我会将其放到 [dotfiles](https://github.com/einverne/dotfiles) 仓库中保存，并利用 Git 进行版本管理。

## 最后

AeroSpace 对于我而言，是目前 macOS 上最接近理想状态的平铺窗口管理器。它精准地抓住了 i3-like WM 的核心优势——键盘驱动、高度可配置、高效的空间利用——同时又巧妙地适应了 macOS 的生态，也无需关闭 SIP，让人用得非常安心。如果你也是一个追求效率、喜欢键盘操作、并且不满足于 macOS 原生窗口管理方式的用户，我强烈推荐你尝试一下 AeroSpace。花一点时间配置和熟悉它，相信它会给你带来惊喜。

## reference

- [AeroSpace 的官方文档](https://nikitabobko.github.io/AeroSpace/guide.html)

## related

- [[FlashSpace]] 另一个 macOS 上的虚拟工作区管理器