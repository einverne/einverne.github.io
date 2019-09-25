---
layout: post
title: "Linux 下使用 emoji"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, ubuntu, linux-mint, mint, emoji, ]
last_updated:
---

Ubuntu 或者其他一些 Linux 发行版 (Debian/Ubuntu/Linux Mint) 会内置 [Google Noto Color emoji font](https://www.google.com/get/noto/help/emoji/)，如果没有也可以直接通过一个命令直接安装 Noto Color emoji.


## 安装字体 {#fonts}
首先要安装支持 Emoji 的字体，个人比较喜欢 [Google Noto Color Emoji](https://www.google.com/get/noto/#emoji-zsye)，这是 Google 开源的用于 Android 的字体。并且支持[力度一直都非常大](https://github.com/googlei18n/noto-emoji/commit/91dc393ca4f4a924f4f6b06bf8e4407b30c7bdd9)。

### Noto color Emoji
直接安装

	sudo apt install fonts-noto-color-emoji

或者从这里下载字体文件：

- <https://www.google.com/get/noto/#emoji-zsye-color>

将字体文件放到 `~/.fonts` 目录中。

然后运行 `sudo fc-cache -f -v`

### ttf-ancient-fonts
Symbola font 可以将绝大部分 emoji 显示为单色的图案。

Ubuntu 系安装：

	sudo apt-get install ttf-ancient-fonts

### twemoji
Twitter 的 emoji 方案：

	sudo apt-add-repository ppa:eosrei/fonts
	sudo apt-get update
	sudo apt-get install fonts-twemoji-svginot

### Emoji One Font

另一种可选方案：

- <https://www.emojione.com/>

### 使用 EmojiOne Picker 来输入 Emoji {#input-emoji-with-emojione-picker}
Ubuntu 上可以使用 EmojiOne 来输入 Emoji

- <https://github.com/gentakojima/emojione-picker-ubuntu>

PPA:

	sudo add-apt-repository ppa:ys/emojione-picker
	sudo apt-get update
	sudo apt-get install emojione-picker

如果在 Ubuntu 18.04 下安装 PPA 有问题，参考[这里](https://github.com/gentakojima/emojione-picker-ubuntu/issues/35) 解决。

先将 apt source 下的内容改成

	sudo vi /etc/apt/sources.list.d/ys-ubuntu-emojione-picker-bionic.list

修改为

	deb http://ppa.launchpad.net/ys/emojione-picker/ubuntu xenial main

然后再安装

	sudo apt install emojione-picker -t xenial

## 在 Chrome 中使用 Emoji
在安装了 Noto Color Emoji 之后，记得需要在 Chrome 的设置中将 Chrome 的字体设置成 Noto 字体。

- rebuild font cache
- restart Chrome

## reference

[^twemoji]: <https://github.com/eosrei/twemoji-color-font#install-on-linux>
