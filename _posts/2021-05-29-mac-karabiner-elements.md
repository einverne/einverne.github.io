---
layout: post
title: "macOS 上的超级强大的键盘自定义工具 Karabiner Elements"
aliases:
- "macOS 上的超级强大的键盘自定义工具 Karabiner Elements"
tagline: ""
description: ""
category: 经验总结
tags: [ mac-app , macos , mac-application , keyboard , karabiner , open-source  ]
last_updated:
create_time: 2021-05-25 20:04:30
last_updated: 2022-06-25 20:04:30
---

之前使用 macOS 外接键盘的时候因为想要实现和 Linux 一致的键位，所以接触到了 Karabiner Elements 这一款 macOS 上的键盘映射工具，但是了解之后发现，Karabiner 能做的事情不只有键盘按键的映射，设置可以组合按键，区别短按和长按，组合使用不同的按键，下面就简单的介绍一下过去几年里面我使用的 Karabiner Elements 特性。

Karabiner Elements 是 Mac 上一款强大的键盘自定义工具，几乎可以实现任何的键盘 remapping，并且也是开源的。如果说改键的话，只显示了 Karabiner 的很小一部分功能，Karabiner 还能实现组合按键触发一些功能，甚至可以针对不同的设备触发不同的功能。

官方网站: <https://github.com/pqrs-org/Karabiner-Elements>

## 功能特性

- 键盘映射，将某一个功能按键映射到另一个功能键，比如把 Fn 映射成 Ctrl；或者调换按键的功能，比如当我连上我的外接键盘的时候就将左侧的 Option 键和 Cmd 键互换，这样按键的布局就和内置的键盘是一样的了。
- 可以将一个按键映射成多个按键，比如把 <kbd>caps lock</kbd> 映射成 `Ctrl+Shift+Option+Cmd`，作为一个 hyper key，再使用该 hyper 就能实现一些快捷键，比如 hyper + hjkl 结合 Hammerspoon 来管理窗口
- 将一个按键的短按(轻触)，和长按区别开，比如 Caps Lock 按一下映射成 Esc，长按组合其他按键映射成同时按下 Ctrl+Shift+Option+Cmd，作为 hyper key。
- 支持不同的 profile 配置，比如我就有两套 remapping, 分别对应内置的键盘和外接的键盘，利用自带的 cli 工具，再结合 Hammerspoon 就可以轻松的实现自动根据 WiFi 或者监听 USB 设备来切换 profile 配置；又或者可以配置在 Alfred 中配置快速切换 profile
- 针对特定型号的键盘生效不同的配置
- 支持虚拟键盘

## 使用 Karabiner 自带的 cli 切换 profile
Karabiner 自带一个叫做 `karabiner_cli` 的命令，使用该命令可以快速切换 profile。

这个命令默认没有加入到 PATH，需要完整的输入路径来执行：

    /Library/Application\ Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli --list-profile-names

查看其使用方式，可以清楚的看到可以用来快速的切换 profile 信息。

```
A command line utility of Karabiner-Elements.
Usage:
  karabiner_cli [OPTION...]

      --select-profile arg      Select a profile by name.
      --show-current-profile-name
                                Show current profile name
      --list-profile-names      Show all profile names
      --set-variables arg       Json string: {[key: string]: number}
      --copy-current-profile-to-system-default-profile
                                Copy the current profile to system default
                                profile.
      --remove-system-default-profile
                                Remove the system default profile.
      --lint-complex-modifications complex_modifications.json
                                Check complex_modifications.json
      --version                 Displays version.
      --version-number          Displays version_number.
      --help                    Print help.

Examples:
  karabiner_cli --select-profile 'Default profile'
  karabiner_cli --show-current-profile-name
  karabiner_cli --list-profile-names
  karabiner_cli --set-variables '{"cli_flag1":1, "cli_flag2":2}'
```

From: <https://pqrs.org/osx/karabiner/document.html#command-line-interface>

再结合 Hammerspoon 根据条件自动切换不同的 profile

```
wifiWatcher = nil
homeSSID = "EinVerne_5G"
lastSSID = hs.wifi.currentNetwork()

workSSID = "MIOffice-5G"

function ssidChangedCallback()
    newSSID = hs.wifi.currentNetwork()

    if newSSID == homeSSID and lastSSID ~= homeSSID then
        -- We just joined our home WiFi network
        hs.audiodevice.defaultOutputDevice():setVolume(25)
        hs.alert.show("Welcome home!")
        -- result = hs.network.configuration:setLocation("Home")
        -- hs.alert.show(result)
    elseif newSSID ~= homeSSID and lastSSID == homeSSID then
        -- We just departed our home WiFi network
        hs.audiodevice.defaultOutputDevice():setVolume(0)
        hs.alert.show("left home!")
        -- result = hs.network.configuration:setLocation("Automatic")
        -- hs.alert.show(result)
    end

    if newSSID == workSSID then
        hs.alert.show("work karabiner setup")
        hs.execute("'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile Work")
    else
        hs.alert.show("built-in karabiner setup")
        hs.execute("'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile Built-in")
    end

    lastSSID = newSSID
end

wifiWatcher = hs.wifi.watcher.new(ssidChangedCallback)
wifiWatcher:start()
```

## 设定 Caps Lock 作为 Hyper key
在菜单，Complex modifications 中可以开启 caps lock 作为 Cmd+Control+Option+Shift。

## 设定 Ctrl np 作为上下
从该 [网站](https://ke-complex-modifications.pqrs.org) 导入 complex modifications，然后就可以找到 Emacs 的键位绑定，我开启了全局的 Ctrl+n/p 作为上下。

## 设定 Finder 重命名

默认情况下 Enter 是进入重命名，我对重命名的需求没有那么大，所以将 Linux 下的习惯 F2 映射成重命名。Enter 则是进入文件夹。

## 禁用 Cmd+h 最小化窗口
Cmd+h 在 macOS 上算是鸡肋，直接禁用。

## reference

- <https://github.com/pqrs-org/Karabiner-Elements/issues/1029#issuecomment-338321585>
- <https://ke-complex-modifications.pqrs.org/>
- <https://github.com/Vonng/Capslock>
- <https://medium.com/@nikitavoloboev/karabiner-god-mode-7407a5ddc8f6>
- <https://karabiner-elements.pqrs.org/docs/manual/configuration/configure-complex-modifications/>
- <https://github.com/wincent/wincent>
