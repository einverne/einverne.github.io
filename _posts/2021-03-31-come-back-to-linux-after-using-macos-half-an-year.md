---
layout: post
title: "使用了半年 macOS 之后 我又回到了 Linux 的怀抱"
aliases: "使用了半年 macOS 之后 我又回到了 Linux 的怀抱"
tagline: ""
description: ""
category: 经验总结
tags: [linux, macos, operating-system,  ]
last_updated:
---

我在使用了[半年 macOS](/post/2020/07/macbook-pro-initial-setup.html) 之后，又回到了 Linux 的怀抱，虽然 macOS 有其自身的优势，我也不否认 macOS 系统上软件生态的友好，但我发现即使我将日常开发主力机器装回到 Linux，也没有丧失操作系统的便捷性和易用性。这或许和我下意识的只使用跨平台的软件有关，并且最长使用的软件几乎都是一套快捷键。

一开始从一个系统切换到另一个系统的时候，难免会有一些东西需要学习，但是其内在的逻辑是一致的，操作系统无非是提高了上层应用运行时的环境。并且如今跨平台的软件越来越多，只要数据在我这里，无论在哪一个系统中都可以迅速地开始自己的工作。


## 契机

### 稳定性
这一次无意间迫使我回到 Linux 的原因之一就是我发现 macOS 并没有我想象的稳定，在最近的使用过程中经常发现一些古怪的问题，并且我无法自己解决，[必须售后客服解决](/post/2021/03/repair-macos-smc-nvram.html)，这更让我意识到我不能完全依赖这一个系统，即使我每天备份，数据没有问题，但一旦发生致命性的问题，我依然需要借助客服去解决（当然这里要提一句苹果的售后客服确实是不错的）。

最近自动更新之后又发现了一个问题，`/usr/libexec/secd` 占用非常高的 CPU，然后导致风扇狂转。

![Screen Shot 2021-04-22 at 8.52.18 PM.png](/assets/Screen-Shot-2021-04-22-secd-high-cpu.png)

幸而这个问题，我简单的搜索了一下之后就找到了解决方法，删除 `~/Library/Keychains` 目录并重启电脑。这个目录中保存了本地的 Keychain 一些密码，网上的说法大概率和 Keychain 的更新机制有关系。

### 流畅度
我一度以为 macOS 上的应用质量很高，但实际使用后发现，确实在日常使用上高于 Linux 上大多数的应用，但是 macOS 上依然会发生 Application Not Responding 的问题，即使我的配置是 i9+32G，也时不时的出现转圈。

## 跨平台的应用

- Chrome 浏览器，登陆账号同步，就什么都有了。
- [Syncthing](/post/2019/10/syncthing.html) 同步工具，将数据和文档两边实时同步，辅助以 NextCloud
- Terminal (Guake / kitty) 我都使用 F12 作为触发（macOS 上借助 Hammerspoon 脚本），可以快速的将终端调用出来
- [RIME](/post/2014/11/rime.html) （fcitx-rime / Squirrel) RIME 的两个版本，同一套配置和词库，输入习惯都可以同步
- [IntelliJ IDEA](https://einverne.gitbook.io/intellij-idea-tutorial/)
- Bitwarden 密码管理
- SmartGit Git客户端
- [Telegram](/post/2016/07/telegram-review.html) IM
- [GoldenDict](/post/2018/08/goldendict.html) 词典
- VMware Fusion / VMware Workstation
- [Obsidian](/post/2020/05/obsidian-note-taking.html) 笔记，笔记内容通过 Syncthing 同步，并定时加入 git ，具体见[我的笔记跨设备同步方案](/post/2020/11/obsidian-sync-acrose-devices-solution.html)
- 等等

记录一下常用的命令：

Bitwarden

    sudo snap install bitwarden

Chrome

    sudo apt update
    sudo apt install google-chrome-stable


## config
zsh, tmux, vim, rime,

- dotfiles
- rime-conf

同步的配置


## 改键

之前在 Twitter 上看到一套将 Linux 上的快捷键和 macOS 映射成一致的解决方案：

- <https://github.com/rbreaves/kinto/>

但是，在经过我的尝试之后我还是没有使用上面的方案，在终端中 macOS 上也是使用 `Ctrl`，在 Linux 和 macOS 上使用大部分快捷键，我能用 vim-key-binding 就使用 Vim-key-binding 的，比如在 Chrome 中使用 [Vimium](https://chrome.google.com/webstore/detail/dbepggeogbaibhgnhhndojpepiihcmeb)，在 Obsidian 开启 Vim 快捷键映射，在 IDEA 中使用 Vim 插件，已经满足我大部分的日常使用。

