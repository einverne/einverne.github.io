---
layout: post
title: "通过 WebDAV 连接 NextCloud"
tagline: ""
description: ""
category: 学习笔记
tags: [nextcloud, webdav, dav, sync, files, linux, ]
last_updated:
---

NextCloud 支持 WebDAV 协议，用户可以完全通过 WebDAV 来连接并同步文件。虽然官方还是[推荐](https://docs.nextcloud.com/server/13/user_manual/files/access_webdav.html) 使用客户端来同步文件，不过如果要临时访问 NextCloud 上的文件，使用 WebDAV 方式还是很便捷的。

假设 NextCloud 的地址是 example.com 这个，那么在 Linux 下，一般文件管理器中有连接到服务器的选项在其中，填入服务器 IP 地址，访问端口，然后访问地址填写 `/remote.php/dav/files/[USERNAME]` 输入该用户的用户名和密码即可访问该用户的所有文件列表。

如果要直接在文件管理器中访问，可以尝试使用如下的协议地址：

    dav://[USERNAME]@[SERVER_IP]:[PORT]/remote.php/dav/files/[USERNAME]

在 Linux 下还能通过命令行访问，具体可参考下面的链接。

## NextCloud 通过 webdav 同步 Joplin
同步地址，其中 ip, port, username，需要替换：

	http://ip:port/remote.php/dav/files/username/JoplinSync

## reference

- <https://docs.nextcloud.com/server/13/user_manual/files/access_webdav.html>
