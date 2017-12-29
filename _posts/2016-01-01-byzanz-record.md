---
layout: post
title: "最棒的gif录屏：byzanz record"
tagline: ""
description: ""
category: 经验总结
tags: [record, gif]
last_updated: 
---

类Unix系统下最棒的gif录屏应用---- byzanz record 。可能大部分的人会在需要用到gif时，会先用录屏软件将需要截取的内容录成视频，然后用 ffmpeg 或者其他的应用将视频转成 gif 动画。而这样会产生几个问题：

1. 麻烦，首先需要有录屏软件，二还得需要 ffmpeg 类似的转码工具
2. 文件超大，我尝试过用 ffmpeg 转 gif，一般情况下转完之后的 gif 的文件都会比较大，即使是几秒钟的动画，大小可能也超出 gif 能够承受的大小，一般都会接近 10M。即使用 `convert` 优化，大小依然不乐观。

## 介绍 {#introduction}
而现在要介绍的 byzanz-record 就是一个轻量级的直接录屏产生 gif 的应用。Byzanz 可以直接避免以上两个问题，将录屏这件事情变得非常容易。看Debian package上面的[介绍](https://packages.debian.org/sid/byzanz)：

    Byzanz is a desktop recorder and command line tool allowing you to record your current desktop or parts of it to an animated GIF, Ogg Theora, Flash or WebM. This is especially useful for publishing on the web.

    Byzanz also allows recording of audio, when the output format supports it.

上面的介绍能够看到 Byzanz 的主要功能，同时说了支持的格式 GIF， Ogg Theora， Flash 和 WebM。同时使用的情况就是想要将内容发布到互联网上的时候。如果输出文件支持音频 Byzanz 也支持。

## 安装 {#installation}

有维护者将 Debian 的代码移植到 PPA，这样我们可以通过 PPA 来安装使用，打开终端，输入以下内容安装：

    sudo add-apt-repository ppa:fossfreedom/byzanz
    sudo apt-get update && sudo apt-get install byzanz

如果 Ubuntu 14.04 和以上版本，直接使用：

    sudo apt-get install byzanz

## 使用 {#usage}

安装完毕之后可以在终端使用如下命名来熟悉使用 Byzanz：

	byzanz-record --duration=10 --x=100 --y=200 --width=700 --height=400 out.gif

通过参数名字能够非常容易的知道含义，`duration` 就是时长，`x` 和 `y` 就是坐标，截取画面左上角的值，`width` 和 `height` 就是截取画面的寛和高，也就是画面的大小，最后就是输出文件的名字。

到现在可能有人发现 Byzanz 比较麻烦的地方了，有的时候我不知道要截取的目标的屏幕坐标和大小的时候呢，有的时候只想截取屏幕的某一个部分呢，如果只想录制一个窗口呢？

于是有人写了三个shell脚本文件：

1. `byzanz-record-window` 选择一个窗口录制
2. `byzanz-record-region` 选择部分窗口录制
3. 简单GUI录制窗口

下面分别介绍这三个脚本使用，分别将这些脚本保存到本地，赋予执行权限 `chmod +x filename`，如果想要在终端任何地方使用，加入 `$PATH` 系统环境变量。

### byzanz-record-window

[脚本地址](https://raw.githubusercontent.com/einverne/dotfiles/master/byzanz-record-window.sh)

下载脚本，加入 `$PATH`，使用例子：

1. 运行 `byzanz-record-window 30 -c output.gif`
2. 使用 alt-tab 选择想要抓取的窗口，单击
3. 等待 10 秒钟（脚本中 `$DELAY` 变量设置）
4. 听到 beep 一声，录制开始
5. 30秒钟之后，beep 一声，录制结束

`-c` 参数表示byzanz将录制鼠标。

### byzanz-record-region

[脚本地址](https://raw.githubusercontent.com/einverne/dotfiles/master/byzanz-record-region.sh)

需要依赖: `xrectsel` [link](https://github.com/lolilolicon/xrectsel). 使用 `make` 命令编译获取可执行的二进制。更多的配置参考项目文件。

使用详情参考上一个 section。

### Gui version of byzanz-record-window
[脚本地址](https://raw.githubusercontent.com/einverne/dotfiles/master/byzanz-record-gui.sh)

脚本由[MHC](http://askubuntu.com/users/81372/mhc)提供。修改了以上脚本，做出了一个简单的GUI版本。

## Example

长达30s钟的gif，而文件大小只有3.5M，对于Web使用来说这是非常可喜的一个大小。而对于10s左右的动画，几乎1M左右的大小，让我感到非常的震惊。

下面就是30s的gif，画质虽然损失较大，但是完全不影响观感。

![byzanz record game](https://lh3.googleusercontent.com/-5BlCCUlOezw/VoZNpK2G3QI/AAAAAAAA5II/ni0WPjejkuo/s1280-Ic42/byzanz_game_test.png)

在我的 <https://github.com/einverne/dotfiles> 项目中有自动安装 byzanz 的脚本，一键安装然后使用即可。

## 参考 {#reference}

- <http://askubuntu.com/questions/107726/how-to-create-animated-gif-images-of-a-screencast>

