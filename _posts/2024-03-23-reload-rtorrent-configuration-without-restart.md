---
layout: post
title: "不重启的情况下重新加载 rTorrent 配置文件"
aliases:
- "不重启的情况下重新加载 rTorrent 配置文件"
tagline: ""
description: ""
category: 经验总结
tags: [rtorrent, rutorrent, bittorrent, rtorrent-config, linux, screen,]
create_time: 2024-04-01 19:35:28
last_updated: 2024-04-01 19:35:28
dg-home: false
dg-publish: false
---

因为我在 Screen 下使用 rTorrent，最近经常调试修改 `rtorrent.rc` 配置文件，所以想要找一个方法可以在不重启 rTorrent 的情况重新加载配置文件，网上调查了一下之后发现原来挺简单的。

首先因为我是在 [screen](https://einverne.github.io/post/2015/09/linux-screen-introduction.html) 下使用，所以先

```
screen -ls
screen -r session_id
```

重新 attach 上，然后就进入了 rTorrent。

按下快捷键 ctrl + x，进入 command 模式

然后输入

```
import=~/.rtorrent.rc
```

回车

最后离开 screen

```
ctrl a+d
```

## reference

- <https://gist.github.com/Goon3r/1869836d2d17703783732fdf5ddc69fc>
