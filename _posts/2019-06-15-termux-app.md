---
layout: post
title: "Termux app 使用记录"
tagline: ""
description: ""
category: 学习笔记
tags: [termux, android, android-app, terminal, linux, ]
last_updated:
---

Termux is an Android terminal emulator and Linux environment app that works directly with no rooting or setup required. A minimal base system is installed automatically - additional packages are available using the APT package manager.

官网地址：

- <https://termux.com/>
- <https://github.com/termux/termux-app>

和 Linux 类似，Termux 有着自己的软件源 http://termux.net/

## 使用

基本 UI 操作

- 左侧滑出，侧边栏，管理 session
- 长按终端，弹出上下文菜单

快捷键，音量减 (-) 代表 Ctrl

- 更多快捷键 <https://termux.com/touch-keyboard.html>
- 蓝牙键盘快捷键 <https://termux.com/hardware-keyboard.html>

pkg 命令

    pkg search <query>              搜索包
    pkg install <package>           安装包
    pkg uninstall <package>         卸载包
    pkg reinstall <package>         重新安装包
    pkg update                      更新源
    pkg upgrade                     升级软件包
    pkg list-all                    列出可供安装的所有包
    pkg list-installed              列出已经安装的包
    pkg shoe <package>              显示某个包的详细信息
    pkg files <package>             显示某个包的相关文件夹路径


两个重要的文件路径

- `$HOME` 进入终端的默认位置，一般在 `/data/data/com.termux/files/home`
- `$PREFIX` 是 usr 目录，包含配置文件 etc/ 目录和可执行文件 bin/ 目录，一般为 `/data/data/com.termux/files/urs`

可以使用 `echo $HOME` 和 `echo $PREFIX` 来查看。

## zsh
安装 zsh

    pkg install wget curl git vim zsh unrar unzip
    sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"


## SSH
默认 Termux 并没有安装 ssh 客户端

    pkg install openssh


## Penetration Test
日常 nmap

- `pkg install hydra` Network logon cracker and bruteforcer supporting different services like ssh, telnet, ftp etc
- `pkg install nmap` Utility for network discovery and security auditing
- Metasploit Framework
- RouterSploit
- slowloris

更多可以参考 [Termux Hacking](https://wiki.termux.com/wiki/Hacking)



## 外延

- <https://github.com/aidlearning/AidLearning-FrameWork>

## reference

- 目前最强的教程 <https://www.sqlsec.com/2018/05/termux.html>
- <https://wiki.termux.com/wiki/Main_Page>
