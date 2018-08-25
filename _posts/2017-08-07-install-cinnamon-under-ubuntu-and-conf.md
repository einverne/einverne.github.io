---
layout: post
title: "在 Ubuntu 下安装并使用 Cinnamon"
tagline: ""
description: ""
category: 经验总结
tags: [Ubuntu, Linux, Cinnamon, LinuxMint]
last_updated:
---

Ubuntu 16.04 LTS 或者 Ubuntu 17.04 下可以通过 PPA 来安装 Cinnamon，感谢[维护者](https://launchpad.net/~embrosyn/+archive/ubuntu/cinnamon)

命令如下：

	sudo add-apt-repository ppa:embrosyn/cinnamon
	sudo apt update && sudo apt install cinnamon

当安装完成之后，Log out 或者 重启，在登录界面选择 Cinnamon 来使用。

我在使用一段时间之后才发现没有安装 Nemo 的插件，以至于右击都没有压缩的选项，通过一下步骤安装 Nemo 以及相关套件。

安装 Nemo

	sudo add-apt-repository ppa:noobslab/mint
	sudo apt-get update
	sudo apt-get install nemo

安装插件

	sudo apt-get install nemo-compare nemo-dropbox nemo-fileroller nemo-pastebin nemo-seahorse nemo-share nemo-preview nemo-rabbitvcs

安装完成之后退出 nemo :

	nemo -q

然后重启 nemo 即可。

关于 Nemo 更多的使用，可以参考我博客上另外的文章。

## reference

- <http://www.omgubuntu.co.uk/2017/05/install-cinnamon-3-4-ubuntu-ppa>
- <https://askubuntu.com/a/367484/407870>
