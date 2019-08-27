---
layout: post
title: "禁用 fcitx 额外键切换输入法"
tagline: ""
description: ""
category: 经验总结
tags: [fcitx, rime, fcitx-config, input-method, keyborad, linux ]
last_updated:
---

之前有提到过在 Linux 下全面切换成了 Rime 输入法，用的是 fcitx-rime 版本的，但是 fcitx 默认自己有一个设置是 `Extra key for trigger input method`，而这个设置默认的是 Shift both，也就是两边的 Shift 键默认都是切换输入法，那么这就和我的习惯非常不一致。

我习惯于左 Shift 将输入的内容非候选词上屏，也就是当我输入一个英文，但是忘记切换中文输入法时，我可以快速按下左 Shift 来上屏，或者我可以直接 Enter 来上屏，但是如果 fcitx 的话可能机会造成切换输入法，而导致所有输入的内容都丢失。

所以可以安装 fcitx config 工具，在 GUI 中修改，或者可以直接修改配置文件

	vi ~/.config/fcitx/config

找到如下一行

	SwitchKey=SHIFT Both

然后替换成

	SwitchKey=Disabled

然后查看这个配置能看到其他很多有趣的配置，自行调整即可。如果发现这一行配置经常在重启之后又恢复到了默认状态那么可以给这个文件设置一个权限

	sudo chmod 444 ~/.config/fcitx/config

另外 fcitx 的扩展配置也在同一级别的目录中，可以查看

	ls ~/.config/fcitx/conf
