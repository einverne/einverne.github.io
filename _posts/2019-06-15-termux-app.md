---
layout: post
title: "Termux app 使用记录"
aliases: "Termux app 使用记录"
tagline: ""
description: ""
category: 学习笔记
tags: [termux, android, android-app, terminal, linux, 终端 , 工具 ,  ]
last_updated: 2022-07-01 02:24:23
create_time: 2019-05-06 11:14:43
---

Termux 是一个 Android 上的应用，但是这个应用是一个终端模拟器，可以完美的在 Android 上模拟一个 Linux 终端环境。甚至不需要 root 权限，正常安装即可使用。Termux 还提供了一套自己的包管理。

> Termux is an Android terminal emulator and Linux environment app that works directly with no rooting or setup required. A minimal base system is installed automatically - additional packages are available using the APT package manager.

官网地址：

- <https://termux.com/>
- <https://github.com/termux/termux-app>

和 Linux 类似，Termux 有着自己的软件源 http://termux.net/

## Termux 和其他终端模拟的区别
Android 上有很多终端模拟，SSH 连接的工具，以前经常用 Juice SSH，Terminal Emulator for Android，这些工具和 Termux 有什么区别呢。

- [ConnectBot](https://github.com/connectbot/connectbot)  [Juice SSH](https://juicessh.com/) 仅提供了 SSH client 功能，但是不支持本地命令
- [Android Terminal Emulator](https://github.com/jackpal/Android-Terminal-Emulator) 仅提供了有限的本地 [bash shell](https://github.com/jackpal/Android-Terminal-Emulator/wiki/Android-Shell-Command-Reference) 支持

那么 Termux 首先是一个 Android Terminal Emulator，可以和其他 Terminal 一样提供本地 Shell 支持，安装 openssh 就支持 SSH Client，除开这两个功能以外，Termux 模拟了一套 Linux 运行环境，可以在无需 root 情况下对 Android 设备进行如同 Linux 设备一样的操作，甚至可以在其中使用 pkg 的包管理（实际也是使用的 apt)。所以在 Linux 设备上能做的一切操作，Termux 都能支持。比如：

- 包管理
- zsh, vim, tmux, ssh, wget, curl, etc
- python, php, etc
- 搭建数据库，运行 nginx，跑网站
- 编写源代码，版本控制，编译，运行程序
- 网络分析工具，nmap, iperf

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

## 开启存储访问
在 Termux 下执行：

    termux-setup-storage

点击允许，使得 Termux 可以访问本地文件。开启之后可以通过 `cd /sdcard` 来访问内部存储 sdcard。

默认会创建如下的软链接：[^storage]

```
~/storage/dcim -> /storage/emulated/0/DCIM
~/storage/downloads -> /storage/emulated/0/Download
~/storage/movies -> /storage/emulated/0/Movies
~/storage/music -> /storage/emulated/0/Music
~/storage/pictures -> /storage/emulated/0/Pictures
~/storage/shared -> /storage/emulated/0
```

[^storage]: <https://wiki.termux.com/wiki/Termux-setup-storage>

或者也可以手工使用软链接 link 到 home 目录方便访问

    ln -s /sdcard/ ~/storage

这样就可以直接在 home 目录下访问 storage 目录来快速访问 sdcard。

## 更换清华源
更换软件源：

    export EDITOR=vi
    apt edit-sources

将其中内容替换为：

    deb https://mirrors.tuna.tsinghua.edu.cn/termux stable main

在新版的 Termux 中官方提供了图形界面（TUI）来半自动替换镜像[^mirror]：

    termux-change-repo

[^mirror]: <https://mirrors.tuna.tsinghua.edu.cn/help/termux/>

执行前确保 `termux-tools` 包安装了。

如果遇到报错说：

> CANNOT LINK EXECUTABLE  "library "libssl.so.1.1" not found"

那么可以重新安装 F-droid 市场中的版本，Play Store 中的版本可能优点问题。

## 安装基础的工具

    pkg install git vim curl wget tree fzf

## zsh
安装 zsh

    pkg install wget curl git vim zsh unrar unzip
    
使用我的 [dotfiles](https://github.com/einverne/dotfiles)。

然后在目录下执行 `make termux` 完成初始化。

## SSH
默认 Termux 并没有安装 ssh 客户端，所以输入下面命令安装：

    pkg install openssh

安装了 ssh 客户端就能够 ssh 连接远程服务器了。如果要从其他设备连接 Termux ，那么需要做一些设置。

生成密钥：

    ssh-keygen -b 4096 -t rsa
    # 或生成 ed25519
    ssh-keygen -t ed25519 -C "i@einverne.info"

此时会在 Termux 手机上生成一对公钥私钥，在 `~/.ssh` 目录下。

### 从电脑 SSH 连接 Termux
Termux 不支持密码登录，所以需要将客户端设备的 `id_rsa.pub` 文件内容拷贝到 Termux 的 `~/.ssh/authorized_keys` 文件中。因为 Termux 不支持 `ssh-copy-id` 所以只能手动操作。

要实现如此可以在 Termux home 目录中 SSH 到客户端的机器上，然后拷贝：

    scp username@desktop.ip:~/.ssh/id_rsa.pub .
    cat id_rsa.pub >> ~/.ssh/authorized_keys

或在 Termux 中一行命令，将需要登录 Termux 机器上的公钥拷贝到 Termux 机器上的 authorized_keys 中：

    ssh user@desktop_clinet "cat ~/.ssh/id_rsa.pub" >> ~/.ssh/authorized_keys

然后在 Termux 上启用 sshd:

    sshd -d   # -d 开始 debug 模式，可以不加

默认 sshd 监听的是 8022 端口，需要注意。

在电脑上使用 ssh 登陆手机 Termux

    ssh -p 8022 -i ~/.ssh/id_rsa ipOfAndroidDevice

Termux 是单用户系统，所以不需要输入用户名，即使输入了 Termux 也会忽略。

### 传输文件
这样就免去了使用数据线连接手机传文件的问题，只要在局域网中能够互相访问，相互传输文件就方便许多。

    # PC to Phone
    scp -P 8022 -r ~/Downloads/ username@deviceIP:~/storage/pc/
    # Phone to PC
    scp -P 8022 -r username@deviceIP:~/storage/Downloads/ ~/

如果要在 Termux 上查看 sshd 日志，可以输入 `logcat -s 'syslog:*'`

确保这些目录的权限正确

    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa.pub
    chmod 600 ~/.ssh/known_hosts
    chmod 600 ~/.ssh/authorized_keys

最后可以在桌面端配置 `vi ~/.ssh/config`

```
Host op7
    HostName ipOfYourDevice
    User termux
    Port 8022
    ForwardX11 yes
    ForwardX11Trusted yes
    IdentitiesOnly yes
    IdentityFile ~/.ssh/id_rsa
```

这样就可以 `ssh op7` 来登陆手机 Termux 了。

比如我手机的 sdcard 路径就是 `/storage/emulated/0/` .

## 字体

若出现 zsh 的 agnoster 主题（或其他依赖 powerline 字体的主题）无法正常显示，可将您的 powerline 字体拷贝到 ～/.termux/font.ttf 后执行 `termux-reload-settings`

## 备份 Termux

[https://wiki.termux.com/wiki/Backing_up_Termux](https://wiki.termux.com/wiki/Backing_up_Termux)

## adb

如果开启了 Android 远程调试，那么使用 `adb connect ip` 就方便许多，安装 `adb` 以备不时之需。

- <https://github.com/MasterDevX/Termux-ADB>

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
- <https://wiki.termux.com/wiki/Remote_Access>
- https://tonybai.com/2017/11/09/hello-termux/
