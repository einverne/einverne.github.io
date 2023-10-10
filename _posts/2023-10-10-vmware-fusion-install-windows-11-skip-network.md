---
layout: post
title: "在 Mac M1 下使用 VMware Fusion 安装 Windows 11 跳过网络"
aliases:
- "在 Mac M1 下使用 VMware Fusion 安装 Windows 11"
tagline: ""
description: ""
category: 经验总结
tags: [vmware, vmware-fusion, windows-11, windows, network]
create_time: 2023-10-10 15:35:03
last_updated: 2023-10-10 15:35:03
---

今天遇到一个证书发行商提供的客户端 Windows only，无奈只能在想办法在 macOS 下安装一个 Windows，因为之前就使用过 VMware Fusion，个人使用是免费的，所以立即就上官网下载。

## Windows 镜像

另外 Windows 镜像在 [MSDN ITELLYOU](https://next.itellyou.cn/Original/) 上下载，

## 安装

安装虚拟机的过程非常简单，将 ISO 拖入到安装界面，然后打开虚拟机就开始了自动安装，但是没想到的是在安装的过程中，遇到了如下的界面，始终无法跳过。

![XAJ0](https://photo.einverne.info/images/2023/10/10/XAJ0.png)

所以在这里记录一下如何在安装的过程中跳过联网。当到联网的画面之后，按下 Shift+F10 或者是 Fn+Shift+F10 快捷键调出命令提示符窗口。

在 cmd 界面中，通过 cd 命令切换到，`C:\Windows\System32\oobe\` 目录，然后执行 `BypassNRO.cmd`，按 Enter 键。系统会自动重新启动，并提供在不联网的情况下完成首次开机设置的选项

## Windows 11 设置联网

在使用上一步完成系统初始化之后，进入 Windows，依然无法联网。可以通过如下的步骤来使得虚拟机中的 Windows 能联网。

- 输入 cmd，打开终端，然后在终端中输入 `powershell`
- 在 powershell 中执行 `Set-ExecutionPolicy RemoteSigned`
- 然后在 VMware 菜单中找到 Install VMware Tools
- 此时虚拟机中会出现一个新的盘符，比如是 D 盘
- 那么在 Powershell 中输入 `cd D:\`
- 然后输入 `./setup.ps1`
- 等待安装完成

![XU69](https://photo.einverne.info/images/2023/10/10/XU69.png)

等待安装完成之后，就可以看到网络已经连接了。

## reference

- [Help](https://communities.vmware.com/t5/Fusion-22H2-Tech-Preview/Stuck-on-quot-Let-s-connect-to-a-network-quot-setup-page-windows/td-p/2868643)
