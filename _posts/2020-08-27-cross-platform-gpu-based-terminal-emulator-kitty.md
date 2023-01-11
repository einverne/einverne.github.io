---
layout: post
title: "跨平台的 GPU 加速终端 kitty"
aliases: "跨平台的 GPU 加速终端 kitty"
tagline: ""
description: ""
category: 学习笔记
tags: [gpu, terminal, linux, mac, guake, drop-down, ]
last_updated:
---

之前在学习使用 [dotbot](/post/2020/08/use-dotbot-dotfiles-management.html) 管理 dotfiles 的时候参考了不少 GitHub 上的 dotfiles 项目，发现大家都不约而同的用到了一个叫做 kitty 的终端，我个人在 Linux 上用 [Guake](/post/2016/01/guake-zsh-config.html) ，在切换到 Mac 之后选择了大部分人推荐的 iTerm2，虽然用着也没有遇到问题，但一旦和 kitty 比较起来速度便成为了一个问题。

官网地址：<https://github.com/kovidgoyal/kitty>

## 为什么要换用 kitty？
之前使用的 Guake, iTerm 自身也并没有什么问题，但近两年来越来越喜欢纯文本的配置，这样就可以放到 dotfiles 中进行追踪，并且跨平台也只需要同步一下配置即可，Guake 和 iTerm 在各自的平都是非常不错的选择，但都不是跨平台的选择。所以综上这些原因，让我有了尝试一下 kitty 的动力。

kitty 的一些特性：

- 跨平台，日常在 Linux 和 Mac 之间切换，我希望配置一遍就可以在不同的平台上使用。
- 纯文本的配置，理由同上
- GPU 渲染，肉眼可见的速度提升


## 配置 {#config}
kitty 默认的配置文件在 `~/.config/kitty/kitty.conf`，可以将这个文件拷贝到 dotfiles 仓库中管理，然后用软链接链过去。kitty 默认不支持热加载配置文件 [^1]，所以每一次修改配置都需要退出重进。

[^1]: <https://github.com/kovidgoyal/kitty/issues/635>

调试 kitty 的配置可以使用 `kitty --debug-config`，执行这行命令会将 kitty 当前的配置，以及加载的配置都打印出来。kitty 配置的各个选项在 [kitty](https://sw.kovidgoyal.net/kitty/conf.html) 的文档中已经非常详细的记录了。

### include 其他配置

	include other.conf

### 配置 Fira Code 字体
自从发现了 [Fira Code](/post/2014/06/fonts-for-coding.html) 字体已经用这一款字体很多年了。但是在 kitty 上使用时，Fira Code 字体总是在一行的偏上部分，这已经很多人反馈过 [^2].

[^2]: <https://github.com/kovidgoyal/kitty/issues/2022>

目前的解决办法只能是：

```
adjust_line_height  -3
adjust_column_width -1
```


### 配置和 Guake 类似的下拉式终端
借助 Hammerspoon 可以实现类似 Guake 类似的下拉效果。

```
hs.hotkey.bind({}, "F12", function()
    local app = hs.application.get("kitty")
    if app then
        if not app:mainWindow() then
            app:selectMenuItem({"kitty", "New OS window"})
        elseif app:isFrontmost() then
            app:hide()
        else
            app:activate()
        end
    else
        hs.application.launchOrFocus("kitty")
		app = hs.application.get("kitty")
    end

	app:mainWindow():moveToUnit'[100, 80, 0, 0]'
	app:mainWindow().setShadows(false)
end)
```

### 同步我之前的快捷键
我之前在使用 Guake 的时候就使用 Alt+n/p 来切换 Tab，正好键位在 Mac 上是 Cmd+n/p 用下面的代码重新 remap 一下：

	map cmd+n next_tab
	map cmd+p previous_tab

## 配色方案

- [base16-kitty](https://github.com/kdrag0n/base16-kitty)
- [kitty-snazzy](https://github.com/connorholyday/kitty-snazzy)
- 或者[自定义](https://terminal.sexy/)

## reference

- <https://sw.kovidgoyal.net/kitty/conf.html>
- <https://github.com/kovidgoyal/kitty/issues/45>
- <https://marvinsblog.net/post/2019-05-02-kitty-terminal/>
