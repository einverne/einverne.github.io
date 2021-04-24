---
layout: post
title: "Android 上的 RIME 输入法 trime 同文输入法使用"
aliases: "Android 上的 RIME 输入法 trime 同文输入法使用"
tagline: ""
description: ""
category: 经验总结
tags: [rime, input-method, android, google-gboard, ]
last_updated:
---

早之前就已经在 [Linux 和 macOS 上配置了 RIME](/post/2014/11/rime.html) 并且一直使用到现在，但是在主力的 Android 上从最早的触宝输入法，后来切换成 Gboard，日常使用倒是没什么大问题，就是有一些词总是需要翻页才能找到，这让我非常不爽，就想手机上能不能用 RIME，于是就有了这篇水文。

开源地址：<https://github.com/osfans/trime>

## Gboard 存在的问题
最大的问题便是词库不全，在桌面端虽然 [[RIME]] 也不能及时更新词库，但是只要我在 RIME 中输入一遍后，便再没有这个问题，并且 RIME 会记住你所造出来的词，并且根据输入习惯去调整该词出现的优先级，使用起来非常舒服。

另外一个便是 Gboard 没有同步桌面输入法的输入习惯，一是上面提到的词库问题，二便是词语出现的位置，我感受到我经常需要手动的去选择词语的位置。

## 为什么不使用搜狗、百度之类的输入法
这应该是一个被无数次提起，又被无数人遗忘的事情，就像我之前[提到](/post/2019/12/rime-input-method.html) 的那样，很多人已经忘记了这些「云」输入法后台明文上传用户的输入，也很多人不知道其实搜狗输入法的云同步记录是无法让用户删除的。虽然我承认从 PC 切换到移动端的那几年个人的同步词库确实会有很多帮助，但实际上 RIME 也能轻松的做到。

## 惊喜
不过每一次从闭源到开源的切换，都让我有意外的收获，感慨开源社区的伟大，[从 Dropbox 切换到 Syncthing](/post/2019/10/syncthing.html)，让我体会到了同步文件原来还可以这样迅速，再不用考虑 Dropbox 中心服务器的同步速度问题；[从 Evernote 切换到 Joplin](/post/2019/10/joplin-best-evernote-alternative-i-ever-used.html)，[[Joplin]]不仅网页剪切速度快，并且还可以调用本地编辑器，比如 vim 对笔记内容进行编辑；从 LastPass 切换到 Bitwarden，发现原来 Linux 客户端可以这么好用，macOS 也可以充分利用 Touch ID。

尝试 Trime 同文输入法也是一样，在 Play Store 上安装之后用 Syncthing 把我桌面端的 rime-config 配置同步到了手机上，然后拷贝了配置到 sdcard 下面的 rime 文件夹，Deploy 一下直接就能用了。

## 安装和基础使用
在进入基础配置使用之前，最好先熟悉一下[桌面版 RIME 的配置](/post/2014/11/rime.html)。

RIME 使用 `yaml` 作为配置文件，在 RIME 的不同客户端中，会有一个单独的配置来配置该客户端相关的内容：

- 在 macOS 上是 `squirrel.yaml`
- 在 Windows 上是 `weasel.yaml`

而在 Android 上是 `trime.yaml`，安装完成后你可以在手机 sdcard 根目录的 `rime` 文件夹中看到该配置文件。

个人推荐在 Android 端使用 [Syncthing](/post/2019/10/syncthing.html) 将 `rime` 配置文件夹同步到电脑端，并使用 Vim 编辑，之后会实时同步到 Android 文件夹中，这样就避免了每次都需要使用 `adb` 把配置文件 `push` 到手机的麻烦。

同步之后可以看到文件夹下的相关配置，基本上和桌面版的 RIME 是一致的：

- `default.yaml`，各输入方案共享的全局配置
- `default.custom.yaml`，（可选）对 default.yaml 的修改，不会随着客户端的更新而被覆盖，所以对 default 的修改可以通过 patch 的方式放入该配置文件
- `xxx.schema.yaml`，xxx 输入方案的配置
- `xxx.custom.yaml`，（可选）对 `xxx.schema.yaml` 的自定义修改
- `xxx.dict.yaml`, xxx 输入方案的词库（字典）

关于 [Trime 的配置可以参考官方的wiki](https://github.com/osfans/trime/wiki/trime.yaml%E8%A9%B3%E8%A7%A3)。


## 如何进行主题配置
默认的主题并不是不能用，但如果你想更加个性化，你可以定制同文输入法键盘的任何地方。

在 Trime 的主题设置中，同一个主题可以包含多套配色。

主题中可以定义键盘布局，而配色则可以更改总体外观。

### 自定义键盘布局
Trime 已经内置了常用的键盘布局，在 `trime.yaml` 中搜索 `preset_keyboards` 就可以看到：

- 40 键
- 36 键
- 30 键
- 26 键
- 预设数字键
- 预设符号键
- 预设注音键盘
- 预设仓颉五代键盘
- 仓颉六代
- 五笔
- 电码
- 地球拼音

我个人比较倾向于使用 36 键的布局，比如 Gboard 的布局，在输入数字的时候会方便很多。

![Screenshot_gboard_keyboard.jpg](/assets/Screenshot_gboard_keyboard.jpg)

在你所使用的主题中，比如 `xxx.trime.yaml` 中设定：

    preset_keyboards:  
      double_pinyin_flypy:
        __include: /preset_keyboards/qwerty0
    
首先找到 `preset_keyboards`，如果没有自己手动创建，然后在它下面创建如上的配置。 


## reference

- 如果你使用五笔可以参考 [wzyboy](https://wzyboy.im/post/1251.html) 的配置
- <https://github.com/SivanLaai/rime_pure>