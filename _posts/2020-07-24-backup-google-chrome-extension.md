---
layout: post
title: "备份和恢复从 Chrome Webstore 中下架的 Google Chrome Extension"
tagline: ""
description: ""
category: 经验总结
tags: [chrome, google-chrome, chrome-webstore, chrome-extension, javascript]
last_updated:
---

这两天重装系统同步 Chrome 的数据才发现，我一直使用的 Dream Afar New Tab 这个我用了很久的扩展从 Chrome Webstore 消失了，不清楚是 Google 主动下架，还是作者很久没有更新被 Webstore 下了还是为什么。但这个扩展经过了很多的 Chrome 版本依然运行良好至今为止都能每天给我提供世界不同地方的美景。



## 备份文件
Chrome 的扩展安装后以文件的形式在如下的目录中：

- Windows: `%UserProfile%\AppData\Local\Google\Chrome\User Data\Default\Extensions`
- Linux: `~/.config/google-chrome/Default/Extensions/`
- Mac: `~/Library/Application Support/Google/Chrome/Default/Extensions/`

然后在 `chrome://extensions/` 扩展管理中点击 Details 获取扩展的详细信息可以知道扩展的唯一 ID，这个 ID 一般也是 Chrome Web Store 的唯一索引 ID，比如 Dream Afar 是 `henmfoppjjkcencpbjaigfahdjlgpegn`。然后在上面的目录中找到对应的目录，将该目录备份，然后在另外的系统中对应的位置恢复该目录即可。

## Re-Packaging

在扩展页面，左上角有一个 Pack，选择扩展的根目录，然后选择 Pack 就可以得到一个 crx 文件。


## reference

- <https://superuser.com/a/420941/298782>
- <https://superuser.com/a/473770/298782>
