---
layout: post
title: "小米笔记本 Air 13.3 在 Linux Mint 下安装 nvidia 驱动"
tagline: ""
description: ""
category: 经验总结
tags: [linux-mint, nvidia, ]
last_updated:
---

先来说说前因后果，因为使用之前 msi 上的系统[恢复到小米笔记本](/post/2016/08/clonezilla-clone-system.html) 所以也不存在 wifi 驱动的问题，恢复完成之后一切都非常顺利，所有的一切设置都和之前的笔记本一致，唯一让我不满意的就是说好的续航非常给力呢，实际使用也只有短短三个小时，比我之前的 GE60 好不到哪里去。所以我就在想问题出在哪里，显卡肯定是首要原因。

另外其他的耗电可以使用

    sudo apt install powertop

然后使用 `sudo powertop` 来查看，基本上也就是显示屏，wifi 模块耗电之外，如果看到其他不正常的耗电就需要仔细查看一下了。

## Nvidia
所以第一件事情就是安装 NVIDIA 驱动，并且在设置中禁用独立显卡，而是 intel 的集成显卡。在官网找到小米笔记本使用的 MX150 显卡驱动：

- <https://www.geforce.com/drivers>

当前时间最新的驱动版本是 `NVIDIA-Linux-x86_64-390.87.run` 这个，随着时间推进可能会有最新的版本。

下载完成之后更改文件的权限，如果给予可执行权限，之后也可以使用 sudo bash NVIDIA-Linux-x86_64-390.87.run 来执行。

    sudo chmod a+x NVIDIA-Linux-x86_64-390.87.run

删除原有 NVIDIA 驱动

    sudo apt-get --purge remove nvidia-*
    sudo apt-get --purge remove xserver-xorg-video-nouveau

重启电脑，使用 Ctrl + Alt +F1 到控制台（Ctrl+Alt+F7 是回到桌面），首先登录 root 账号，然后结束图形化界面

    sudo service lightdm stop

然后执行安装操作

    sudo bash ~/Downloads/NVIDIA-Linux-x86_64-390.87.run --no-x-check --no-nouveau-check --no-opengl-files

 这边三个参数表示：

 - `--no-x-check` 安装驱动时关闭 X 服务
 - `--no-nouveau-check` 安装驱动时禁用 nouveau
 - `--no-opengl-files` 只安装驱动文件，不安装 OpenGL 文件

更多的参数可以参考官网的[说明](http://download.nvidia.com/XFree86/Linux-x86_64/390.87/README/)

安装过程中可能会出现提示

- The distribution-provided pre-install script failed are you sure you want to continue，没关系，继续进行
- Would you like to register the kernel module sources with DKMS? This will allow DKMS to auomatically build a new module,if you install a different kernel later，选择 No
- Nvidia's 32-bit compatibility libraries，选择 no 即可

安装完成之后

    sudo service lightdm start

重启图形化界面，sudo reboot 或者登录再重启

重启后，输入以下命令

    nvidia-smi

会显示当前驱动的版本和基本信息

    nvidia-smi
    Thu Sep 20 22:33:25 2018
    +-----------------------------------------------------------------------------+
    | NVIDIA-SMI 390.87                 Driver Version: 390.87                    |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |===============================+======================+======================|
    |   0  GeForce MX150       Off  | 00000000:01:00.0 Off |                  N/A |
    | N/A   44C    P0    N/A /  N/A |    101MiB /  2002MiB |      2%      Default |
    +-------------------------------+----------------------+----------------------+

    +-----------------------------------------------------------------------------+
    | Processes:                                                       GPU Memory |
    |  GPU       PID   Type   Process name                             Usage      |
    |=============================================================================|
    |    0      2986      G   /usr/lib/xorg/Xorg                           101MiB |
    +-----------------------------------------------------------------------------+

## Cinnamon 耗电
重启电脑 Cinnamon 报错

![cinnamon running without video hardware acceleration](/assets/Linux-Mint-Running-in-software-rendering-mode-error.png)

> Running in software rendering mode
> Cinnamon is currently running without video hardware acceleration and, as a result, you may observe much higher than normal CPU usage.
> There could be a problem with your drivers or some other issue. For the best experience, it is recommended that you only use this mode for troubleshooting purposes.

## 默认开启 Fn 功能键
Linux 下默认 F1-F12 功能键都是不启用的，按下 Fn+ESC(LOCK) 键，开启默认 Fn 功能。


## reference

- <https://github.com/Golovin-Andrey/xiaomi-mi-13-ubuntu>
- <https://blog.csdn.net/lukaslong/article/details/81488219>
