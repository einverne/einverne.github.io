---
layout: post
title: "macOS 下启动器 Raycast 简单使用"
aliases: 
- "macOS 下启动器 Raycast 简单使用"
tagline: ""
description: ""
category: 产品体验
tags: [ launcher, alfred, macos, mac-application ,  ]
last_updated: 2022-09-29 09:38:41
create_time: 2022-03-10 11:57:31
---

在逛 Twitter 的时候看到有人分享了一款 Launcher，叫做 Raycast，因为平时一直使用 [[Alfred]] 倒是没有引起我的太多注意，但今天又看到了一次，所以就想好好来了解一下这个新出来的启动器。

在 macOS 上其实有非常多的启动器，包括了系统默认的 [[Spotlight]]，以及很多第三方应用，包括了 [[Alfred]], [[LaunchBar]] 在内的无数优质应用。这些应用有着各自的特点。但最重要的一点就是提高我们打开应用的速度，以及在各个小细节方面提高易用程度，比如我最喜欢的 Alfred 的一个贴心功能就是历史粘贴板，在 Linux 上我一直都是用的 [[fcitx]] 默认的快捷键 `Ctrl+;`，所以在 macOS 也用一样的快捷键。

## 安装

安装：

    brew install --cask raycast

## 特性

- 最基本的功能，启动 macOS 上的应用，搜索文件
- 历史粘贴板
- 搜索打开书签
- 集成第三方应用
    - 在 GitHub，Jira 等等中创建、搜索、关闭 issues
    - 批准、合并和关闭 GitHub Pull Request
    - 调用 Zoom 会议
- 支持快捷键设置日程、待办事项
- 支持扩展脚本

## 使用

### Snippet
写过代码的人应该对 Snippet 非常熟悉，我们可以定义一些常用的代码块，然后通过简单的几个字母来快速补充一段内容。

在 Raycast 中，可以通过输入 `Create snippet` 来创建 Snippet，在弹出的设置窗口中输入想要设置的内容。

![raycast-snippet-create](/assets/raycast-snippet-create-20220310234127.png)

注意下面的 Keyword, 输入 Keyword 的内容就是唤起整个 Snippet 的快捷键。

比如当我输入 `:blog` 的时候就会自动补全成`https://blog.einverne.info`

如果有读者记得的话，我在不就之前介绍过一款跨平台的 Text Expander ---- Espanso，也能够做到相同的事情。有兴趣可以查看[espanso：Rust 编写的跨平台开源文本扩展工具](/post/2021/09/espanso-text-expand.html)。

### Clipboard History

在 Raycast 中输入 `Clipboard History` 可以打开粘贴板历史。

这里值得注意的是 Raycast 所有数据都是本地加密存储，所以可以不用担心粘贴板的隐私问题。

同样，在应用设置中，可以设置快捷键，我就设置成和 Linux 下一致的 `Ctrl+;`

![raycast clipboard history hotkey](/assets/raycast-clipboard-history-hotkey-20220310225717.png)

### Search Screenshot
Raycast 支持直接搜索图片中的内容，还可以选中图片之后使用，cmd + Shift + a 使用 Cleanshot 对图片标注。

### Store
输入 `Store` 可以打开 Raycast 的商店，然后可以在其中安装、启用非常多的三方插件。

目前Raycast已经接入了 GitHub、Jira、G Suite、Linear、Asana、zoom，Notion，Things，Raindrop，Todolist 等服务，能够快速完成特定操作。


### Browser Bookmarks
首先在 Store 中安装 Browser Bookmarks

![raycast-store-install-bookmarks](/assets/raycast-store-install-bookmarks-20220310231737.png)

然后在设置中启用 Chrome：

![raycast browser bookmarks](/assets/raycast-browser-bookmarks-20220310231857.png)

注意选择正确的 Profile。

然后就可以在 Raycast 中输入 Browser Bookmark 来搜索 Chrome 的书签了。

![browser-bookmarks-search](/assets/browser-bookmarks-search-20220310232500.png)

不过需要注意的是，只有书签存在中文、英文才能被搜索出来，如果书签没有描述，或者你忘记了域名，那么也是无可奈何的。

### 悬浮标签 Floating Notes
在 Raycast 中输入 Floating Notes 之后就会在桌面最顶层开启一个悬浮便签，便签可以移动位置，但是永远在所有窗口的最上面。非常方便用来记录快速的想法，待办事项等等。

![raycast-floating-notes](/assets/raycast-floating-notes-20220310232923.png)

在输入 Float 之后，有两个选项：

- Toggle Floating Notes Focus，这个选项会将光标移动到便签中
- Toggle Floating Notes Windows 会显示隐藏便签窗口


### 日程管理和待办事项
Raycast 可以直接连接 Calendar，因为我的 macOS 上的日历同步了 Google Calendar 的数据，所以可以直接看到我的日程。

在 Raycast 中输入 `My Schedule` 即可。第一次可能需要授权。

同样可以输入 `reminder` 来查看待办事项，或者根据提示来创建待办事项。

### 系统设置
比如输入 volume 可以调整音量。


其他比如计算器、汇率转换、时间查询等等基础功能就不再展开。

如果有时间会再讲讲如何在 Raycast 中执行自定义脚本，或者如何编写自己的扩展。
Raycast 支持的脚本语言，Bash、Swift、AppleScript。



## related

- [[Alfred]]
- [[LaunchBar]]
- [[hapigo]]
- [Raycast 相关脚本](https://github.com/raycast/script-commands/tree/master/commands)