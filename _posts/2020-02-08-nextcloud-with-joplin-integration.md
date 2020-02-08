---
layout: post
title: "NextCloud 和 Joplin 完美合作"
tagline: ""
description: ""
category: 经验总结
tags: [nextcloud, joplin, file-sync, note, note-taking, open-source,]
last_updated:
---

今天不经意打开了 NextCloud 管理后台，然后看提示有 App 更新就顺手进去看了一下，然后就发现了宝藏，这一年多来不过把 NextCloud 作为 Dropbox 代替品，做为文件同步工具，没想到后台已经发展出各种“玩法”，安装插件可以在 NextCloud 中启用 Calendar，Contacts，甚至还有视频通话插件，然后通过插件可以将 NextCloud 扩展成 RSS 阅读器，可以变成看板，可以变成电子书阅读器等等。不过让我眼前一亮的是其中有个插件叫做 Joplin Web API。不过该插件目前[并不完善](https://joplinapp.org/nextcloud_app/)，还在 beta 阶段，不过不妨展开想象，如果未来可以借助 NextCloud，那么分享 Joplin 中的笔记，甚至对同一个笔记展开协同合作也不是不可能的。

## WebDAV
NextCloud 默认已经启用了 WebDAV, 所以可以在 Joplin 设置，同步设置中直接配：

	http://[ip]:[port]/remote.php/dav/files/USERNAME/Joplin

记得 Joplin 文件夹要创建好。

## 二步验证
开启二步验证后需要在后台生成一个密码，而不能用自己的用户名和密码来同步。

## reference

- <https://nextcloud.com/blog/mobile-note-taking-with-your-private-cloud-announcing-joplinnextcloud-integration/>
- <https://discourse.joplinapp.org/t/joplin-web-api-for-nextcloud/4491>
