---
layout: post
title: "在 Linux 下使用 Clash For Windows 管理 Clash 订阅"
aliases: 
- "在 Linux 下使用 Clash For Windows 管理 Clash 订阅"
tagline: ""
description: ""
category: 经验总结
tags: [ linux, clash, v2ray, proxy, shadowsocks,  ]
last_updated:
---

早之前写过一篇[文章](/post/2021/03/linux-use-clash.html)，当时我直接使用命令行的方式使用 [clash](/post/2021/03/linux-use-clash.html)，但用过一段时间之后发现 [Clash For Windows](https://github.com/Fndroid/clash_for_windows_pkg/releases) 支持了 Linux，所以切换到 Clash For Windows，用 UI 界面方便随时切换。

不要看这个 Clash For Windows 的名字有点歧义，实际上是全平台的，不是 Windows 专属的。Clash For Windows 在下文中会简称 CFW。

Clash for Windows 的优点：

- 支持自动选择节点，可以根据延迟自动选择，也可以根据规则
- 支持本地编辑规则
- 支持查看当前订阅的流量等信息

更加详细的使用指南可以参考[这个文档](https://docs.gtk.pw/contents/quickstart.html)

## CFW 使用

可以在 [GitHub 下载](https://github.com/Fndroid/clash_for_windows_pkg/releases)，也可以使用[镜像地址下载](https://dl.gtk.pw/proxy/linux)。

下载完成后是一个压缩包，解压，并执行其中的 `cfw` 即可。

添加快捷方式，因为我使用 Cinnamon 是基于 Gnome ，所以可以执行如下命令添加一个快捷方式：

```
gnome-desktop-item-edit ~/.local/share/applications --create-new
```

在弹出的窗口中，填写 Name 和 Command

![gnome new launcher](/assets/gnome-new-launcher-20211216190628.png)

说明：

- Name: 显示的名字
- Command: cfw 的绝对路径

Dashboard:

![](/assets/clash-for-windows-general-20211216190926Blog.png)

Clash For Windows 页面：

![](/assets/clash-for-windows-under-linux.png)

在 Profile 页面上可以添加订阅地址，订阅地址可以在[这里](https://board.gtk.pw/) 获取。

