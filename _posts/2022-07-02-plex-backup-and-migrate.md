---
layout: post
title: "Plex Media Server 备份恢复和数据迁移"
aliases:
- "Plex Media Server 备份恢复和数据迁移"
tagline: ""
description: ""
category: 经验总结
tags: [ plex, plex-media-server, backup, syncthing, ]
create_time: 2022-09-02 01:21:05
last_updated: 2022-07-02 02:54:42
---

这些年来逐渐将我的音乐库迁移到了 Plex Media Server 上，因为之前部署的 Plex 是用了 Docker，迁移到独立主机之后想直接安装，所以想将之前的 Plex 数据迁移出来，直接恢复使用。

## 备份
备份是一定要做的事情，为了数据安全。

通常 Plex 中的媒体文件都会用 [[Syncthing]] 来做一份备份冗余，但是 Plex Media Server 生成的媒体文件，包括 viewstates, metadata, settings 等等就需要直接去备份 Plex Media Server 的内容了。

在 Debian/Fedora/CentOS/Ubuntu 中：

```
/var/lib/plexmediaserver/Library/Application Support/Plex Media Server/
```

### 数据库地址
Plex 在本地使用 SQLite3 存储数据。

在 macOS 上：

```
~/Library/Application\ Support/Plex\ Media\ Server/Plug-in\ Support/Databases/com.plexapp.plugins.library.db
```

Windows 上：

```
"%LOCALAPPDATA%\Plex Media Server\Plug-in Support\Databases\com.plexapp.plugins.library.db"
```

在 Linux 上（包括 NAS）：

```
$PLEX_HOME/Library/Application\ Support/Plex\ Media\ Server/Plug-in\ Support/Databases/com.plexapp.plugins.library.db
```

备份时不要对备份的数据进行任何修改，防止备份数据库出错。

如果修改了本地媒体文件的地址，需要更新数据库：

```
UPDATE `section_locations` 
   SET `root_path`=
       REPLACE(`root_path`, 
               '/Old_PATH/', 
               '/NEW_PATH/')
WHERE `root_path` like '%Old_PATH%';
```

如果确定需要修改数据库中的路径，那么确保所有表中的路径都要修改。

## 移动媒体文件到另外的位置
如果只是升级磁盘，文件的目录没有变化，那么只需要在迁移之前停掉 Plex Media Server，然后升级完成之后再启动即可。

如果更改了媒体文件的路径，那么就需要多出几步。

- 首先停用 Emptying of Trash
    - 在管理后台禁用 `Empty trash automatically after every scan`
- 停止 Plex Media Server
- 将文件内容拷贝到新的位置
- 启动 Plex Media Server
- 启动 Plex Web App
- 编辑 Libraries ，添加新的位置到库中，暂时保留之前的文件路径，需要对每一个移动的库都操作一遍
- 更新库，在添加之后，执行一次 `Scan Library Files`，服务器会检查新位置的文件内容，然后和已经有的媒体文件做关联
- 等待完成扫描之后移除老的文件路径。

## reference

- [备份设置](https://support.plex.tv/articles/201539237-backing-up-plex-media-server-data/)
- [数据库](https://support.plex.tv/articles/202915258-where-is-the-plex-media-server-data-directory-located/)
- [移动媒体文件](https://support.plex.tv/articles/201154537-move-media-content-to-a-new-location/)
