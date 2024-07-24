---
layout: post
title: "macOS 迁移助手迁移后 Syncthing 设备 ID 相同问题解决方案"
aliases:
- "macOS 迁移助手迁移后 Syncthing 设备 ID 相同问题解决方案"
tagline: ""
description: ""
category: 经验总结
tags: [ syncthing, macos, macos-app, mac-app, sync, migration-assistant, 迁移助手, mac ]
create_time: 2024-07-24 11:44:18
last_updated: 2024-07-24 11:44:18
dg-home: false
dg-publish: false
---

最近使用 macOS 自带的 Migration Assistant（迁移助手）将系统从一台 M1 Mimi 上迁移到了笔记本上，与此同时发现 Syncthing 也无缝迁移过来了，但是 Syncthing 在新旧两台 Mac 上出现相同的设备 ID。这是因为 Syncthing 的设备 ID 由其配置文件夹中的`cert.pem`和`key.pem`文件决定。如果这些文件在迁移过程中被复制，两台设备就会拥有相同的 ID，从而导致 Syncthing 操作出现冲突。

要解决这个问题，需要为其中一台 Mac 生成新的设备 ID。

以下是详细的步骤指南：

## Syncthing ID 相同解决方案

1. 关闭新 Mac 上的 Syncthing

   - 打开活动监视器或使用终端确保 Syncthing 没有运行。
   - 也可以使用任务管理器结束所有 Syncthing 进程。

因为我直接使用 brew 安装的，所以直接停止服务

```
brew services stop syncthing
```

2. 定位 Syncthing 配置文件夹

   - 在 macOS 上，配置文件通常位于`~/Library/Application Support/Syncthing`。

3. 删除`cert.pem`和`key.pem`文件

   - 导航到 Syncthing 配置文件夹。
   - 删除`cert.pem`和`key.pem`文件。这些文件负责生成设备的唯一 ID。

4. 重启 Syncthing

   - 重启 Syncthing 后，它会自动生成新的`cert.pem`和`key.pem`文件，从而创建新的设备 ID。

```
brew services start syncthing
```

5. 重新配置 Syncthing

   - 由于设备 ID 已更改，需要重新将此设备添加到 Syncthing 网络中。
   - 在其他设备上，删除旧的设备条目，并使用新 ID 添加新设备。

6. 验证同步
   - 确保设备之间的同步正常工作。
   - 通过在一台设备上创建文件并检查是否出现在另一台设备上来进行测试。

## More

- 备份配置：在进行任何更改之前，最好备份 Syncthing 配置文件夹。
- 避免同步配置文件夹：为防止将来出现此问题，避免在设备之间同步 Syncthing 配置文件夹。

