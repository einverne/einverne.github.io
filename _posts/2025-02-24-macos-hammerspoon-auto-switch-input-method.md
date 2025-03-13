---
layout: post
title: "macOS 上利用 Hammerspoon 自动切换输入法"
aliases:
- "macOS 上利用 Hammerspoon 自动切换输入法"
tagline: ""
description: ""
category: 经验总结
tags: [hammerspoon, rime, ime, input-method, japanese-input-method]
create_time: 2022-01-13 10:27:40
last_updated: 2025-03-13 10:27:40
dg-home: false
dg-publish: false
---

很久之前我介绍过一款 macOS 上的自动化应用 [Hammerspoon](https://blog.einverne.info/post/2020/11/mac-application-hammerspoon-automation-tool.html)，在那篇文章中我就已经简要的介绍过如何利用 Hammerspoon 实现超级强大的窗口管理，实现切换 WiFi 自动提醒，也简单的介绍过如何自动切换输入法，但是没有展开，今天正好趁着我重写 Hammerspoon 的配置文件，再展开介绍一下如何利用 Hammerspoon 自动切换 Rime 输入法。

## 查找 RIME 输入法的 Source ID

在编写切换脚本前，首先需要获取 RIME 输入法的源 ID。可以通过以下方法获取，在 Hammerspoon 的控制台中运行：

```lua
hs.keycodes.currentSourceID()
```

RIME 输入法的 ID 通常为：`im.rime.inputmethod.Squirrel.Rime` 或 `im.rime.inputmethod.Squirrel.Hans`。

## 编写 Hammerspoon 脚本切换到 RIME

将以下代码添加到`~/.hammerspoon/init.lua` 文件中：

lua

```
-- 定义切换到RIME的函数
function switchToRIME()
    hs.keycodes.currentSourceID("im.rime.inputmethod.Squirrel.Rime")
end

-- 定义切换到英文的函数
function switchToEnglish()
    hs.keycodes.currentSourceID("com.apple.keylayout.ABC")
end

-- 使用快捷键切换到RIME
hs.hotkey.bind({"cmd", "shift"}, "r", function()
    switchToRIME()
    hs.alert.show("已切换到RIME输入法")
end)

-- 使用快捷键切换到英文
hs.hotkey.bind({"cmd", "shift"}, "e", function()
    switchToEnglish()
    hs.alert.show("已切换到英文输入法")
end)
```

添加后，重新加载 Hammerspoon 配置（点击菜单栏图标选择"Reload Config"）。现在可以使用`Cmd+Shift+r`切换到 RIME，`Cmd+Shift+e`切换到英文。

## 自动根据应用切换输入法

也可以设置在切换到特定应用时自动切换输入法：

```
-- 定义输入法函数
local function RIME()
    hs.keycodes.currentSourceID("im.rime.inputmethod.Squirrel.Rime")
end

local function English()
    hs.keycodes.currentSourceID("com.apple.keylayout.ABC")
end

-- 指定应用使用的输入法
local appInputMethod = {
    ["iTerm2"] = English,
    ["Visual Studio Code"] = English,
    ["微信"] = RIME,
    ["Notes"] = RIME,
    -- 可以根据需要添加更多应用
}

-- 记录当前输入法ID
currentID = ""

-- 应用程序观察者函数
function applicationWatcher(appName, eventType, appObject)
    if (eventType == hs.application.watcher.activated) then
        for app, fn in pairs(appInputMethod) do
            if app == appName then
                currentID = hs.keycodes.currentSourceID()
                fn()
            end
        end
    end

    if eventType == hs.application.watcher.deactivated then
        for app, fn in pairs(appInputMethod) do
            if app == appName then
                hs.keycodes.currentSourceID(currentID)
                currentID = hs.keycodes.currentSourceID()
            end
        end
    end
end

-- 启动应用程序观察者
appWatcher = hs.application.watcher.new(applicationWatcher):start()
```

这个脚本会在你切换到指定应用时自动更改输入法，并在离开该应用时恢复之前的输入法状态。

## 使用左右 Command 键切换输入法

另一种实现方式是使用左右 Command 键快速切换输入法：

```
-- 左Command键切换到英文
hs.hotkey.bind({}, 'lcmd', function()
    hs.keycodes.currentSourceID("com.apple.keylayout.ABC")
end, nil, nil)

-- 右Command键切换到RIME
hs.hotkey.bind({}, 'rcmd', function()
    hs.keycodes.currentSourceID("im.rime.inputmethod.Squirrel.Rime")
end, nil, nil)
```

请注意，使用左右 Command 键作为单独热键可能会影响其他使用 Command 的组合键。

配置完成后，记得重新加载 Hammerspoon 配置以使更改生效。

## 最后

经过上面这么多学习使用之后，我总结出来一条自动化根据当前的窗口切换输入法的规则，Hammerspoon 可以自动检测当前前台的窗口，然后根据窗口的名字自动设置当前的输入法，比如说我在 Obsidian 中的时候自动设置成 RIME，当我切换到 [Warp 终端](https://blog.einverne.info/post/2022/03/warp-terminal-usage.html)的时候，就自动切换成英文输入法，相关的配置可以参考[这里](https://github.com/einverne/dotfiles/blob/master/hammerspoon/ime.lua)。
