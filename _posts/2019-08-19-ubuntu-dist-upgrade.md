---
layout: post
title: "Ubuntu 从 16.04 升级 18.04"
tagline: ""
description: ""
category: 经验总结
tags: [ubuntu, linux, ]
last_updated:
---

经常看到的 Ubuntu 16.04 或者 18.04 都是 Ubuntu 长期支持版本

> A Long Term Support release or LTS release, means that Ubuntu will support the version for five years.

如果要从 16.04 升级到 18.04 包括两个部分，一是将当前安装的程序及 lib 升级到 18.04 兼容的版本，另外一个就是将系统升级到 18.04.

    sudo apt update && sudo apt upgrade
    sudo apt autoremove
    sudo apt dist-upgrade

运行 `apt dist-upgrade` 会升级所有 packeges 到想要升到的 Ubuntu 版本，而 `sudo do-release-upgrade` 会将 Ubuntu 升级到新版本。大部分情况下不需要手动触发 `sudo apt dist-upgrade`，因为在运行 `sudo do-release-upgrade` 会自动先运行 `dist-upgrade` 。预先将所有的应用程序都更新到最新版本避免兼容性问题。

最后进行升级 Do upgrade

    sudo do-release-upgrade

要注意該命令无法回滚，做好相应的备份工作，或者知道如何处理失败。

## Install Cinnamon

    sudo add-apt-repository ppa:embrosyn/cinnamon
    sudo apt update && sudo apt install cinnamon

Remove

    sudo apt-get install ppa-purge
    sudo ppa-purge ppa:embrosyn/cinnamon


## 升级到非 LTS
编辑 `/etc/update-manager/release-upgrades` 并设置

    Prompt=normal

然后再运行 `sudo do-release-upgrade`


