---
layout: post
title: "guake zsh 配置小记"
tagline: ""
description: ""
category: 经验总结
tags: [linux, guake, zsh, vim, agnoster, fonts, solarized]
last_updated: 
---

配置zsh guake 小记

## Install zsh

    sudo apt-get update && sudo apt-get install zsh

## Install Oh-my-zsh

    wget –no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O – | sh

## Make zsh default shell

	chsh -s $(which zsh)

## Get oh-my-zsh config

From here: <https://github.com/robbyrussell/oh-my-zsh>

## Change theme
Edit zshrc config `vim ~/.zshrc`

    ZSH_THEME="agnoster"

## Install missing fonts
Install missing fonts here: <https://github.com/Lokaltog/powerline-fonts>
After install missing font, change terminal font to "Melon xx".

## Refresh font cache

	fc-cache -f -v

## Install solarized scheme to guake
According to this: <https://github.com/coolwanglu/guake-colors-solarized> `git clone` this repo and run `./set_dark solarized` .

## finally

![guake zsh](https://lh3.googleusercontent.com/-TK4Dv6_PTwg/VpL-fHQmWoI/AAAAAAAA5ik/ySgfjDrFKR0/s1280-Ic42/screenshot-monitor-2016-01-09-234852.png)

## reference

- <https://github.com/robbyrussell/oh-my-zsh>
- <https://gist.github.com/leemour/5749839>
- <https://gist.github.com/agnoster/3712874>
