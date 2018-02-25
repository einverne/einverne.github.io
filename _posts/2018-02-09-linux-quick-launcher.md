---
layout: post
title: "Linux 下几款快速启动器"
tagline: ""
description: ""
category: 整理合集
tags: [linux, launcher, command, app,]
last_updated: 
---

本篇文章主要介绍 Linux 下几款常用的启动器，启动器顾名思义就是用来快速开启应用程序的程序。启动器最常用的功能就是用来快速启动另外一个程序，但是一款好的启动器应该提供一些常用的功能，比如说base64 编解码，比如当前Unix时间戳，再比如搜索Google，计算器，打开文件，单位转化，甚至是执行系统命令等等。

本文主要要介绍的是这三款： GNOME Do，cerebroApp，albertlauncher。

## GNOME Do
GNOME Do 是最初由David Siegel开发的一个GNU/Linux下的流行的自由应用程序启动器[^1]，GNOME Do 不仅能够用来启动程序，也能够快速打开文件，控制媒体文件等等。

通过下面命令安装

    sudo apt install gnome-do

他的官网地址：<https://do.cooperteam.net/> 安装之后我最喜欢的设置就是将启动 Do 的快捷键设置为 <kbd>Alt</kbd>+<kbd>Space</kbd> 

不过可惜的是 GNOME Do 已经很多年没有[更新](https://launchpad.net/do/+announcements) ，版本也永远的停留在了 GNOME Do 0.95。总结来看 Do 虽然不是最好的启动器，但是应付日常使用完全没有任何问题。

[^1]: 参考[维基](https://zh.wikipedia.org/wiki/GNOME_Do)


## cerebroApp
cerebroApp 是一款用 Javascript 实现的启动器，跨平台，支持插件，界面友好。一般启动器能够实现的功能他都有。安装方法可参考其官网: <https://cerebroapp.com/> 非常简单，几乎一键。

代码地址: <https://github.com/KELiON/cerebro>

### 改变快速启动hotkeys
当尝试在 Perferences 中修改启动快捷键时你会发现无法修改，查看官方的文档可以看到:

    Config file path
    Windows: %APPDATA%/Cerebro/config.json
    Linux: $XDG_CONFIG_HOME/Cerebro/config.json or ~/.config/Cerebro/config.json
    macOS: ~/Library/Application Support/Cerebro/config.json

修改配置文件，可以看到默认定义的快捷键是 `Control + Space` 我习惯使用 `Alt + Space`

### 安装插件
安装插件非常简单，在 cerebro 中直接输入 `plugins hash` 即可。

在 Cerebro 中访问粘贴板 <https://github.com/codingmatty/cerebro-plugin-clipboard>

直接在 Cerebro 中获取 hash ，安装 [cerebro-hash](https://www.npmjs.com/package/cerebro-hash) ，然后先键入 hash 加上空格后面是需要 hash 的字符串。

    hash [input]
    hash (algorithm) [input]
    (algorithm) [input]

有道翻译插件 <https://github.com/lcjnil/cerebro-youdao> 输入 `youdao hello` 来查询

还有 BASE64 加密解密，时间戳 等等插件，自己添加即可。

更多有用的 Cerebro 扩展插件可以在这里获取: <https://github.com/lubien/awesome-cerebro>

## albertlauncher
同样是一款开源启动器，不过他只有 Linux 版本，安装过程也是比较简单。功能区别不是很大。它使用 C/C++ Qt 写成。同样支持插件。

安装过程可参考: <https://albertlauncher.github.io/docs/installing/>

项目地址: <https://github.com/albertlauncher/albert>

总的来说比较推荐 cerebroApp ，在三者区别不大的情况下，跨平台还是比较吸引我的，并且UI小清新。
