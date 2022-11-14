---
layout: post
title: "Mastodon 站点管理：导入自定义表情包"
aliases:
- "Mastodon 站点管理：导入自定义表情包"
tagline: ""
description: ""
category: 经验总结
tags: [ mastodon, sns, twitter, emoji, tootctl,  ]
create_time: 2022-11-14 09:49:59
last_updated: 2022-11-14 10:00:59
---

[[Mastodon]] 实例可以允许站点管理员自定义整站上的表情包，管理的地址在 **首选项-管理（Administration）-自定义表情（custom emojis）** ， 具体的页面地址是 `https://instance.domain/admin/custom_emojis`。

下面介绍几种方式来管理 Mastodon 实例上的表情。

## 手动上传 Emoji
如果有自制的表情，可以通过上传的方式导入。

请右上角**上传新表情**，格式必须为 png，文件大小不能超过 50KB。

## 手动拷贝他站表情
如果使用了 [[mastodon-relay-servers|Mastodon 中继站]]，那么经过一段时间的使用会导入一些其他站点的表情，在站点管理中能看到。Mastodon 允许将其他站点的标签复制到本站点。

- 点击“远程”，勾选想要的表情
- 点击右侧“复制”，即可复制至你站，可以在“本站”中见到

在“本站”一栏可以进行表情分类。

## 批量下载并导入
Mastodon 的 `tootctl` 提供了导入 Emoji 的相关命令，那么其实只要准备好表情包，然后通过 `tootctl` 命令导入即可。

这里就要使用一个开源的脚本，可以从其他网站批量下载 [表情](https://github.com/Starainrt/emojidownloader/)。

脚本的原理就是利用 Mastodon 的 [Emoji API](https://docs.joinmastodon.org/methods/instance/custom_emojis/)。

如何预览一个站点的所有表情呢，有一个在线网站 <https://emojos.in/> ，可进行表情包预览（对未开启 authorized_fetch 的站点有效）。

顺便输入一个 Mastodon 实例的地址，得到：

- <https://emojos.in/masto.ai>

然后执行脚本：

- 到项目的 [release](https://github.com/Starainrt/emojidownloader/releases) 下载最新发布的二进制可执行文件，右键复制下载地址。
- 在服务器执行：

```
wget https://github.com/Starainrt/emojidownloader/releases/download/v0.1.0/emoji_downloader_linux_x86_64
chmod +x ./emoji_downloader_linux_x86_64
./emoji_downloader_linux_x86_64
```

运行程序，根据提示下载。可以自行选择需要下载对方站哪一种表情包分类，对表情包命名有无批量改动。（注意：如果对方站开启了 authorized_fetch 模式，则需要拥有对方站账号。)

最后会下载一个格式为 `.tar.gz` 的压缩包，里面包括了选择的所有表情。

- 然后进入 docker 容器，导入表情：

```
docker cp ./表情路径 mastodon-web-1:/tmp/表情名字.tar.gz
docker exec -it mastodon-web-1 /bin/bash
tootctl emoji import --category 你设定的分类 文件路径/文件名
```

然后刷新页面，在 LOCAL 管理页面就能看到导入的表情了。

## Emoji 使用

在站点发送 Toot 的右上角 Emoji 选择器就可以选择表情使用。或者直接输入对应的表情编码即可。

最后欢迎大家来使用：<https://m.einverne.info>
