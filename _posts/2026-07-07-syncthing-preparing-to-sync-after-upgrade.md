---
layout: post
title: "Syncthing 升级 2.0 后同步卡在 Preparing to Sync 的解决方法"
aliases:
- "Syncthing 升级 2.0 后同步卡在 Preparing to Sync 的解决方法"
tagline: "Homebrew 升级 Syncthing 2.0 后的数据库迁移问题"
description: "使用 Homebrew 升级 macOS 上的 Syncthing 之后，已同步好的文件夹一直卡在 preparing to sync 状态。本文分析根本原因并提供几种可行的解决方案。"
category: 经验总结
tags: [syncthing, macos, homebrew, sync, troubleshooting]
create_time: 2026-07-07 10:00:00
last_updated: 2026-07-07 10:00:00
---

![Syncthing 同步状态卡顿示意图](https://pic.einverne.info/images/syncthing-preparing-to-sync.png)

前几天例行 `brew upgrade` 之后，[[Syncthing]] 其中的某一个高频使用的同步文件夹就一直卡在 Preparing to Sync 状态，进度条纹丝不动，CPU 占用却莫名升高。我最初以为是网络问题或者对端设备没启动，结果检查一遍发现所有的其他 Syncthing 节点都正常，就是本机 macOS 这端不动弹。这个状态持续了将近一个小时，才让我意识到不对劲，开始认真排查。

## 问题背景

[Syncthing](https://blog.einverne.info/post/2019/10/syncthing.html) 是一款开源的点对点文件同步工具，不依赖任何中心服务器，数据直接在你自己的设备之间流转。我用它同步多台设备上的工作目录和重要文件，已经稳定运行了6，7年，这次升级前一切都好好的。

这次触发问题的，是 [[Homebrew]] 将 Syncthing 从 1.x 版本升级到了 2.x 版本。Syncthing 2.0 是一次幅度相当大的版本跨越，包含了几项可能让用户措手不及的破坏性变更（breaking changes）。

## 根本原因：数据库引擎从 LevelDB 迁移到 SQLite

Syncthing 2.0 最核心的变化是将底层的索引数据库引擎从 Google 的 [[LevelDB]] 切换到了 SQLite。Syncthing 用这个数据库存储所有文件的元数据、校验值和同步状态，这个库一旦发生格式变更，就意味着首次启动时必须完成一次完整的数据格式迁移。

官方文档对此的表述是："数据库后端已从 LevelDB 切换到 SQLite。首次启动时会进行一次迁移，对于较大的数据集这个过程可能需要较长时间。"对于文件数量众多的用户，这个迁移甚至可以持续数小时乃至整夜。而在迁移完成之前，Syncthing 对所有文件夹展示的状态正是 "Preparing to Sync"——它在准备，只是用户看不到进度。

问题在于，通过 `brew services start syncthing` 作为系统服务运行时，Syncthing 的控制台输出被完全隐藏。用户打开 Web UI 只能看到一个没有进度提示的状态标签，却无从判断迁移是否还在进行、还是真的卡死了。这种信息缺失，是让人以为出了大问题的直接原因。

## 确认迁移状态

在采取任何激进操作之前，先确认 Syncthing 到底是真的卡住了，还是还在默默工作。

停止 Homebrew 服务，改为手动从终端启动 Syncthing，这样就能实时看到日志输出：

```bash
brew services stop syncthing
syncthing
```

观察终端输出。以下这类日志都属于正常现象，说明 Syncthing 仍在工作中，不需要干预：

```
INF GC was interrupted due to exceeding time limit (processed=3 runtime=5m34s folder=default fdb=folder.0001-xxx.db table=blocks)
INF Completed initial scan (folder.label="Default Folder" folder.id=default folder.type=sendreceive)
```

第一行是 SQLite 数据库在做垃圾回收（GC），运行超过时间限制后被中断，这是 Syncthing 2.0 新引入的行为，中断不代表出错，GC 会在后续继续执行。第二行是初始扫描完成的确认，出现这行后文件夹就会脱离 "Preparing to Sync" 状态。

反之，如果日志几分钟内没有任何新内容，或者出现了 "database disk image is malformed" 这样的错误，才需要进行下一步处理。

## 解决方案

### 方案一：耐心等待迁移完成

如果手动运行后看到迁移活动，最好的做法就是什么都不做，等它跑完。文件越多，等待时间越长。根据社区反馈，拥有十几万文件的用户，迁移时间可能超过两个小时。迁移完成后，Syncthing 会自动恢复正常同步，之后再用 `brew services start syncthing` 挂回后台服务即可。

### 方案二：重置索引数据库

如果迁移确实卡死，或者日志中出现了数据库损坏相关的错误，就需要删除旧的索引数据库，让 Syncthing 从零开始重新扫描。

首先，找到 Syncthing 的数据目录：

```bash
# macOS 上默认路径
ls ~/Library/Application\ Support/Syncthing/
```

Syncthing 2.0 的 SQLite 索引数据库位于 `index-v2/` 目录下，每个同步文件夹对应一个独立的 `.db` 文件（如 `folder.0001-abcd1234.db`），以及配套的 `.db-shm` 和 `.db-wal` 文件。如果迁移卡死或数据库损坏，可以删除整个 `index-v2/` 目录让 Syncthing 重建：

```bash
brew services stop syncthing
rm -rf ~/Library/Application\ Support/Syncthing/index-v2/
```

如果你仍有旧版 LevelDB 格式的 `index-v0.14.0.db` 残留（升级异常时可能存在），也可以一并清理：

```bash
rm -rf ~/Library/Application\ Support/Syncthing/index-v0.14.0.db
```

删除后重新启动 Syncthing，它会从头对所有文件夹执行完整扫描。文件本身不会丢失，只是 Syncthing 需要重新建立对所有文件的认知，这个过程同样需要一些时间，但通常比数据库迁移要快得多。

### 方案三：使用 --reset-deltas 参数

如果问题只是同步状态不一致，而数据库本身没有损坏，可以尝试使用 `--reset-deltas` 参数启动 Syncthing，让它重置增量同步状态：

```bash
brew services stop syncthing
syncthing --reset-deltas
```

这个方法比删除整个数据库要温和，只清除增量同步的记录，不会触发全量重扫，适合作为第一道修复手段。

### 方案四：通过 REST API 重置特定文件夹

如果只有某一两个文件夹卡住，其他文件夹正常，可以通过 Syncthing 的 REST API 只重置问题文件夹的索引，避免影响已经工作正常的文件夹。

先在 Web UI 的设置里找到你的 API Key，然后执行：

```bash
# 重置特定文件夹（将 your-folder-id 替换为实际的文件夹 ID）
curl -X POST -H "X-API-Key: your-api-key" \
  "http://127.0.0.1:8384/rest/system/reset?folder=your-folder-id"
```

如果不带 `folder` 参数，则会重置所有文件夹的数据库，效果等同于方案二。

### 方案五：彻底重装

如果以上方案都不奏效，可以做一次干净的重装。这个方法对 macOS + Homebrew 环境效果最好：

```bash
brew services stop syncthing
brew uninstall syncthing
brew install syncthing
```

重装完成后，先从终端手动启动一次，观察迁移日志，确认迁移正常完成后再切换回服务模式：

```bash
syncthing
# 等待迁移完成，Ctrl+C 退出
brew services start syncthing
```

## 其他需要注意的变更

除了数据库迁移，Syncthing 2.0 还有一些其他变化值得留意。日志格式改为结构化日志，旧的 `--verbose` 和 `--logflags` 命令行参数已被移除，改用 `--log-level` 参数控制日志级别。如果你的 Syncthing Web UI 不是绑定在默认的 `127.0.0.1:8384`，需要注意升级机制存在一个已知 bug，它硬编码了默认地址，非默认配置下可能导致自动升级失败。

另外，Syncthing 2.0 不再为部分平台提供预编译二进制文件，包括 DragonFlyBSD、Illumos、Linux on PowerPC64、NetBSD 和部分 OpenBSD 架构，这些平台的用户需要自行从源码编译。

## 最后

这次 Syncthing 升级卡住的经历，再次提醒我在做系统级工具的大版本升级之前，最好先读一读 release notes。Syncthing 2.0 将 LevelDB 换成 SQLite 是一次从根基上的重构，好处是数据库更易于维护和调试，坏处是首次启动的迁移成本对数据量大的用户来说相当可观。

如果你遇到了同样的问题，按照本文的顺序依次尝试，大概率能在方案一或方案二这里就解决。关键是不要慌，不要在迁移过程中强行重启或删除数据，那样才是真的会造成问题。耐心等一等，或者删掉旧索引让它重建，[[Syncthing]] 本身的可靠性依然值得信任。
