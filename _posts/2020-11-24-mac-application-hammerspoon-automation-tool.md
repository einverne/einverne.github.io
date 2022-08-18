---
layout: post
title: "Mac 应用篇：Hammerspoon 自动化工具使用"
aliases:
- "Mac 应用篇：Hammerspoon 自动化工具使用"
tagline: ""
description: ""
category: 经验总结
tags: [ mac, hammerspoon, automation, tool, window-manage, mac-app , mac-application  ]
last_updated: 2022-06-24 08:46:11
create_time: 2021-09-27 07:44:20
---

这是一篇耽搁了很久，一直躺在我的 Obsidian 笔记中的一篇文章，一直就想好好介绍一下 Hammerspoon，但是因为过去虽然也在用 macOS，但是使用最多的还是 Ubuntu，Hammerspoon 只能在 macOS 上使用，就没有那么大的兴致再花时间学习它的使用。但最近更新了一下系统，发现 Hammerspoon 出了一点问题，没有了 Hammerspoon 之后我才发现很多不适应的地方，那就在花一点时间再梳理一下我的配置。

## Hammerspoon 是什么？
Hammerspoon 是一个 macOS 上开源的自动化工具，什么叫做自动化工具呢？通过 Hammerspoon ，可以使用一些脚本来实现原来只能通过界面操作，或快捷键才能达到的效果，并且实现系统自动化。最简单的例子，比如当我连上家里的 WiFi 的时候，就自动将音量调成 3 档；再比如当我切换窗口的时候，自动切换输入法，比如在 IDEA IntelliJ 中自动使用英文输入法，当我打开 Obsidian 则自动切换成中文输入法。

Hammerspoon 使用 Lua 脚本语言与操作系统通信。通过编写 Lua 脚本实现与 macOS API 的交互，Hammerspoon 提供的 API，包括应用的、窗口的、鼠标指针、文件系统、声音设备、电池、屏幕、键盘/鼠标事件、粘贴板、地理位置服务、WiFi 等等。Hammerspoon 是操作系统和 Lua 执行引擎的桥梁，通过 Hammerspoon 可以让 macOS 实现非常强大的自动化。

官网: <https://www.hammerspoon.org/>

## Hammerspoon 能做什么
Hammerspoon 实际上是将 macOS 的系统接口实现了一层转发，让用户可以通过简单的 Lua 脚本进行配置，从而实现一定的 UI 自动化，一旦能够直接从 API 层面对接操作系统，那么 Hammerspoon 能够做的事情就非常多了：

- 创建并管理全局快捷键，这样就可以创建一组属于自己的快捷键工作流
- 管理窗口 move windows，结合自定义快捷键可以非常轻松地对窗口进行管理
- 发送通知 display notifications
- 和其他应用交互 talk to other applications
- 添加自定义内容到状态栏 add things to your menu bar，有了这个功能就可以在状态栏上添加任何自定义的内容，比如有人利用公开的天气 API 在状态栏显示最近和未来的天气，可以显示系统的网速等等
- 监听文件内容变化，可以利用这个自动加载配置，或者自动提交任务等等
- 监听 WiFi 变化，可以利用不同的网络环境配置不同的网络配置，自动切换不同的工作环境等等
- 监听应用的启动和停止
- 在屏幕上绘制 draw on the screen
- 监听电池变化 watch for changes to your battery
- 当电脑接口对接硬件时触发动作 carry out actions when you plug things into your computer

## Installation
通过 Homebrew 安装：

    brew install --cask hammerspoon

## 上手配置
Hammerspoon 的默认配置在 `~/.hammerspoon/init.lua`，我个人通过将配置文件放在 [dotfiles](https://github.com/einverne/dotfiles) 中软链接到目的位置来同步配置。

做一个最简单的例子，在 `init.lua` 文件中写入：

```
hs.alert.show("Config reload!")
```

然后重新加载 Hammerspoon 配置，就会看到在屏幕中央出现 "Config reload!" 的弹出提示。

## 使用 Hammerspoon 作为管理窗口工具
虽然 [[Mac 上的窗口管理工具]] 有很多，免费的，收费的，Moom, Rectangle 等等，但是自由度都没有 Hammerspoon 多。

下面是我使用的一些窗口管理快捷键。

按下 <kbd>Option</kbd>+<kbd>r</kbd> 进入窗口的管理模式，在该模式下按下快捷键可以实现非常多的操作：

- HL/JK 可以用来将窗口按照左、右、下、上分屏
- ASDW 可以用来移动窗口的位置，对应上下左右
- Y/O/U/I 可以将窗口变成四分之一屏幕大小，分别是左上，右上，左下，右下
- Shift+HL/JK 可以收缩窗口大小，比如 Shift+H 就是让窗口右侧往左侧缩小
- =/- 用来扩展和收缩窗口
- Left/Right/Up/down 将窗口移动到左边、右边、上边、下边
- F 全屏
- C 中央
- ESC/Q 退出该模式
- Tab 显示 Cheatsheet

这一套窗口管理方法来自 [ashfinal/awesome-hammerspoon](https://github.com/ashfinal/awesome-hammerspoon.git)

不过我个人最常使用的快捷键还是 Hyper + h/l/j/k 可以将当前的窗口以左/右/下/上方式进行分屏。这里需要结合 [[Mac 应用 Karabiner Elements 键盘自定义工具]]

[[Mac 下的自定义快捷键]]

使用 Hammerspoon 实现 Hyper + h/l/j/k 管理窗口的相关配置：

```
hyper = {"ctrl", "alt", "cmd", "shift"}
function move_window(direction)
    return function()
        local win      = hs.window.focusedWindow()
        local app      = win:application()
        local app_name = app:name()
        local f        = win:frame()
        local screen   = win:screen()
        local max      = screen:frame()
        if direction == "left" then
            f.x = max.x + 6
            f.w = (max.w / 2) - 9
        elseif direction == "right" then
            f.x = (max.x + (max.w / 2)) + 3
            f.w = (max.w / 2) - 9
        elseif direction == "up" then
            f.x = max.x + 6
            f.w = max.w - 12
        elseif direction == "down" then
            f.x = (max.x + (max.w / 8)) + 6
            f.w = (max.w * 3 / 4) - 12
        end
        f.y = max.y + 6
        f.h = max.h - 12
        win:setFrame(f, 0.0)
    end
end
hs.hotkey.bind(hyper, "Left", move_window("left"))
hs.hotkey.bind(hyper, "Right", move_window("right"))
hs.hotkey.bind(hyper, "Up", move_window("up"))
hs.hotkey.bind(hyper, "Down", move_window("down"))
hs.hotkey.bind(hyper, "H", move_window("left"))
hs.hotkey.bind(hyper, "L", move_window("right"))
hs.hotkey.bind(hyper, "K", move_window("up"))
hs.hotkey.bind(hyper, "J", move_window("down"))
```

## 使用 Hammerspoon 在切换 WiFi 时自动切换对应设置
当连接的 WiFi 发生变化的时候触发一个监听事件，更加详细的配置可以看我的 [dotfiles](https://github.com/einverne/dotfiles) 。

```
function ssidChangedCallback()
    newSSID = hs.wifi.currentNetwork()

    local devices = hs.usb.attachedDevices()

    if newSSID == homeSSID and lastSSID ~= homeSSID then
        -- We just joined our home WiFi network
        hs.alert.show("Welcome home!")
        hs.audiodevice.defaultOutputDevice():setVolume(25)
        -- result = hs.network.configuration:setLocation("Home")
        -- hs.alert.show(result)
    elseif newSSID ~= homeSSID and lastSSID == homeSSID then
        -- We just departed our home WiFi network
        hs.alert.show("left home!")
        hs.audiodevice.defaultOutputDevice():setVolume(0)
        -- result = hs.network.configuration:setLocation("Automatic")
        -- hs.alert.show(result)
    end

    if newSSID == workSSID then
        hs.alert.show("work karabiner setup")
        selectKarabinerProfile("goku")
    else
        hs.alert.show("built-in karabiner setup")
        selectKarabinerProfile("goku")
    end

    lastSSID = newSSID
end

wifiWatcher = hs.wifi.watcher.new(ssidChangedCallback)
wifiWatcher:start()
```

## 使用 Hammerspoon 一键布局桌面窗口
我抢了同事一个显示器使用，所以外接了三个显示器，在每一个显示器中都有默认的布局。我一般左边竖置的显示器常驻一个 Terminal，中间横置的一个显示器为主要工作的区域，一般放 IntelliJ IDEA，DataGrip，SmartGit 等等其他工具，右侧竖置的显示器上面为即时通信窗口，下面是浏览器。

使用 Hammerspoon 可以很快速的恢复所有窗口的布局，不过我自己用的并不多。

## 输入法自动切换
比如在特定应用中自动切换成 [Rime 输入法](/post/2014/11/rime.html) 或者切换成 ABC 英文。比如在 IntelliJ IDEA 中不会输入中文的，直接切换成 ABC 输入英文即可，而当切换到浏览器的时候切换到 Rime。

再 [结合 Rime 输入法的自动设置输入法的自动切换](/post/2020/11/_rime_-auto-switch-language-in-vim-mode.html) 就非常舒服了。

完美的代替了 [kawa](https://github.com/utatti/kawa) 这款切换输入法的工具。

## 定时自动执行脚本
比如我使用 Obsidian 来作笔记，同时使用 git 来做版本管理，写一个脚本，每 30 分钟提交一次。

```
log = hs.logger.new('autoscript', 'debug')
local cmdArr = {
    "cd /Users/einverne/Sync/wiki/ && /bin/bash auto-push.sh",
}

function shell(cmd)
    hs.alert.show("execute")
    log.i('execute')
    result = hs.osascript.applescript(string.format('do shell script "%s"', cmd))
    hs.execute(cmd)
end

function runAutoScripts()
    for key, cmd in ipairs(cmdArr) do
        shell(cmd)
    end
end

myTimer = hs.timer.doEvery(10, runAutoScripts)
myTimer:start()
```

比如定时提交 git commit，定时 git push 等等。当然直接使用 [Crontab](/post/2017/03/crontab-schedule-task.html) 来实现也是可以的。

## Mute on sleep
在笔记本合上时静音

```
function muteOnWake(eventType)
  if (eventType == hs.caffeinate.watcher.systemDidWake) then
    local output = hs.audiodevice.defaultOutputDevice()
    output:setMuted(true)
  end
end
caffeinateWatcher = hs.caffeinate.watcher.new(muteOnWake)
caffeinateWatcher:start()
```

## Locking the screen
定义锁屏的快捷键。

```
-- lock screen shortcut
hs.hotkey.bind({'ctrl', 'alt', 'cmd'}, 'L', function() hs.caffeinate.startScreensaver() end)
```

## 监听 USB 事件并做相应的设置
对我而言最常见的就是当我接入外接键盘的时候，自动切换 `karabiner-Elements` 的键盘 profile。

这样当我使用 macOS 自带的键盘和外置键盘的时候就可以保持一致的使用习惯。

## 绑定快捷键快速打开应用
快速打开终端：

```
hs.hotkey.bind({'ctrl', 'alt', 'cmd'}, 'K', function () hs.application.launchOrFocus("iTerm") end)
```

更多的例子可以参考我的 [dotfiles](https://github.com/einverne/dotfiles)

## 防止长时间不用进入休眠
参考 <https://github.com/einverne/dotfiles/hammerspoon/> 关键字 Caffeine。

## 将当前窗口移动到其他屏幕中
定义了快捷键 Hyper + 1/2/3 将当前窗口快速移动到其他显示器：

```
function moveWindowToDisplay(d)
  return function()
    local displays = hs.screen.allScreens()
    local win = hs.window.focusedWindow()
    win:moveToScreen(displays[d], false, true)
  end
end

hs.hotkey.bind({"ctrl", "alt", "cmd"}, "1", moveWindowToDisplay(1))
hs.hotkey.bind({"ctrl", "alt", "cmd"}, "2", moveWindowToDisplay(2))
hs.hotkey.bind({"ctrl", "alt", "cmd"}, "3", moveWindowToDisplay(3))
```

## 对虚拟桌面的支持
非官方支持
- <https://github.com/asmagill/hammerspoon_asm.undocumented>
- <https://gist.github.com/TwoLeaves/a9d226ac98be5109a226>

## 扩展

Hammerspoon 的配置文件是使用 Lua 书写，如果熟悉 Lua，可以更进一步使用 Lua 的 moonscript 来简化配置。

    brew install lua@5.3
    luarocks-5.3 install moonscript
    luarocks-5.3 install lodash

参考 [这里](https://github.com/xream/.hammerspoon)

 [这里](https://github.com/ahonn/dotfiles/blob/master/hammerspoon/main.moon)

Hammerspoon [官网文档](https://www.hammerspoon.org/docs/)

## Spoon 是什么？
Spoon 是预置在 Hammerspoon 内的插件系统，Spoon 是使用纯 Lua 实现的插件，可以方便用户集成集成到 Hammerspoon 的配置中。

可以从官方的页面获取 [Spoon](http://www.hammerspoon.org/Spoons) ，源码可以参考对应的 GitHub 页面，下载后解压得到 `.spoon` 文件，双击导入即可。文件会自动将自己拷贝到 `~/.hammerspoon/Spoons/NAME.spoon`，然后在 `init.lua` 中 `hs.loadSpoon("NAME")` 即可。

更具体的 [Spoon](https://github.com/Hammerspoon/hammerspoon/blob/master/SPOONS.md) 的使用可以参考官网。

### 编写 Spoon
Spoon 文件有一定的格式，方便集成调用。

Spoon 文件中的常用方法：

- `NAME: init()`，这个方法会被 `hs.loadSpoon()` 调用，会进行一些初始设置，这里面不应该执行任何动作
- `NAME: start()`，如果有需要在后台进行的任务，可以由这个方法启动
- `NAME: stop()`，关闭后台任务
- `NAME: bindHotkeys(mapping)`，定义功能快捷键，通常是 table 的形式：

## reference

- <https://www.hammerspoon.org/docs/index.html>
- <https://medium.com/@jhkuperus/introducing-hammerspoon-personal-productivity-d32c0c825caf>
- <https://www.songofcode.com/posts/powerful-hammerspoon/>
- <https://github.com/ashfinal/awesome-hammerspoon>
- <https://blog.theodo.com/2018/03/making-runtime-funtime-hammerspoon/>
- <https://spinscale.de/posts/2016-11-08-creating-a-productive-osx-environment-hammerspoon.html>
- <https://github.com/wangshub/hammerspoon-config>
- <https://github.com/scottcs/dot_hammerspoon>
- <https://www.autohotkey.com/>
- <https://medium.com/@robhowlett/hammerspoon-the-best-mac-software-youve-never-heard-of-40c2df6db0f8>
- <https://www.thetopsites.net/article/54151343.shtml>
- [非官方支持](https://github.com/asmagill/hammerspoon_asm.undocumented)
- [非官方实现，将窗口移动到其他桌面](https://gist.github.com/TwoLeaves/a9d226ac98be5109a226)
- <https://github.com/scottcs/dot_hammerspoon/blob/master/.hammerspoon/init.lua>
- <https://github.com/eliasnorrby/dotfiles/blob/21cef799a0/keyboard/hammerspoon/init.lua>
- <https://github.com/mengelbrecht/hammerspoon-config/blob/master/init.lua>
- <https://github.com/songchenwen/dotfiles/blob/master/hammerspoon/init.lua>
- <https://wiki.nikitavoloboev.xyz/macos/macos-apps/hammerspoon#links>
- <https://github.com/agzam/spacehammer>
- <https://github.com/songchenwen/dotfiles/blob/master/iTerm2/install.sh>
- <https://github.com/mengelbrecht/hammerspoon-config/blob/master/init.lua>
- <https://github.com/scottcs/dot_hammerspoon/blob/master/.hammerspoon/modules/worktime.lua>
- [[Mac 应用列表]] [[自动化工具]]
