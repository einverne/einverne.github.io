---
layout: post
title: "简单高效跨平台的备份程序 Restic"
aliases: 
- "简单高效跨平台的备份程序 Restic"
tagline: ""
description: ""
category: 学习笔记
tags: [ restic, backup, backup-tool, tools, google-drive, go-lang, duplicacy, linux, syncthing ]
last_updated: 2023-05-26 05:22:24
create_time: 2022-01-29 02:33:17
---

Restic 是一款简单易用、快速、高效、安全，并且跨平台的开源备份程序。Restic 使用 Go 语言实现。集成了 rclone 可以轻松的备份到各类云端存储。

官网：<https://restic.net/>

支持的存储类型：

- 本地磁盘，SFTP
- Amazon S3，minIO，[[Backblaze B2 Cloud Storage]]，OpenStack Swift，Google Cloud Storage 等等
- 通过 rclone 挂载的存储，比如 Google Drive，OneDrive 等

## Restic 设计原则

Restic 是一个数据备份程序，其设计遵循以下原则：

- 简单：备份应该是一个顺畅、无感知的过程。Restic 易于配置和使用，这样就可以在数据丢失的情况下直接恢复历史数据。同样，恢复数据的过程也不应该很复杂。
- 快速：用 Restic 备份数据应该只受网络或硬盘带宽的限制，这样就可以每天备份文件。如果备份需要花费太多时间，就没有人会进行备份。恢复备份也应该很快速。
- 可验证：比备份更重要的是恢复，因此 Restic 可以轻松验证备份的数据是否可以恢复。
- 安全：Restic 使用加密技术来保证数据的机密性和完整性。假设存储备份数据的位置不是受信任的环境（例如，系统管理员等其他人能够访问您的备份的共享空间）。 Restic 可以保护您的数据免受此类攻击者的侵害。
- 高效：随着数据的增长，额外的快照应该只占用实际增量的存储。重要的是，在将重复数据实际写入存储后端之前会对其进行去重，以节省宝贵的备份空间。

## 概念

### Repository

Repository 称为存储仓库，备份期间产生的所有数据都以结构化形式发送并存储在存储库中，例如在具有多个子目录的文件系统层次结构中。

存储库实现必须能够完成许多操作，例如列出内容。v0.12.0 中已支持的存储服务包括：aws s3，minio server，Wasabi， Aliyun OSS， OpenStack Swift，Backlbaze B2，Azure Blob Storage，Google Cloud Storage，rclone

### Blob

Blob 将多个数据字节与识别信息（如数据的 SHA-256 哈希及其长度）,加密的数据块及元数据，其中元数据包括长度，SHA-256 哈希信息。数据块可以存放文件数据（data），也可以存放目录结构数据（tree）。Blob 的大小在 512KiB 到 8MiB 之间，因此小于 512KB 的文件不会被拆分。Restic 的实现目标是让 Blob 平均大小为 1MiB。

### Pack

Pack 是一个包，结合了一个或多个 Blob，例如在单个文件中。Restic 中的单个数据文件，包括一个或多个 Blob，一旦创建不再修改。

一般只创建不删除，仅 prune 操作会删除不再被引用的数据。

### Snapshot

Snapshot 快照代表在某个时间点已备份的文件或目录的状态。这里的状态是指内容和元数据，如文件或目录及其内容的名称和修改时间。

### Storage ID

- _Storage ID_：Pack 文件的 SHA256 哈希值，通过这个 ID 可以在仓库中加载需要的数据文件。Restic 将这个 ID 作为 Pack 的文件名，也就是文件的 SHA256 哈希值。Pack 文件名即哈希值的设计也可以方便的检验数据文件是否被改动过。

## Install

Debian/Ubuntu:

    apt-get install restic

macOS:

    brew install restic

通过二进制：

    wget https://github.com/restic/restic/releases/download/v0.9.5/restic_0.9.5_linux_amd64.bz2
    bzip2 -d restic*.bz2 && rm -rf restic*.bz2
    chmod +x restic*
    mv restic* /usr/local/bin/restic
    restic version

升级可以通过：

    restic self-update

## Usage

初始化本地备份：

    restic init --repo /path/to/backup_folder

配置 SFTP 存储，[配置 SSH 免密码登录](/post/2016/06/ssh-copy-id.html)：

    restic -r sftp:root@192.168.2.100:/path/to/backup_folder init

如果服务器的 SSH 端口不是 22，则需要配置 `ssh` 配置，编辑 `~/.ssh/config` 然后配置：

    Host 192.168.2.100
      User root
      Port 222

将目录 `/var/www` 备份到服务器的 `/path/to/backup_folder`

    restic -r sftp:192.168.2.100:/path/to/backup_folder --verbose backup /var/www

查看备份快照：

    restic -r sftp:192.168.2.100:/path/to/backup_folder snapshots

恢复备份：

    restic -r sftp:192.168.2.100:/path/to/backup_folder restore latest --target /var/www

这里的 `latest` 可以替换为任意一次的备份 ID。

删除备份：

    restic -r sftp:root@192.168.2.100:/path/to/backup_folder forget abc3123

上面的命令只是将快照清除了，但快照中包含的文件还在存储仓库中，可以使用 `prune` 命令来清理未被引用的数据：

    restic -r sftp:root@192.168.2.100:/path/to/backup_folder prune

## 结合 cron 来定时备份

每隔 30 分钟备份一次

    30 * * * * /usr/local/bin/restic -r sftp:root@192.168.2.100:/path/to/backup_folder backup --password-file /home/einverne/restic/resticpasswd -q /var/www; /usr/local/bin/restic forget -q --prune --keep-hourly 24 --keep-daily 7

## Restic 和 rclone 的区别

两个工具的设计目的是不一样的，Restic 更偏向备份工具，所以设计了很多备份、恢复、查看验证历史版本等等特性。而 Rclone 则更偏向于将网络硬盘挂载到机器中实现与云端存储的双向同步。二者各有所长。

- Rclone 面向文件，保证两端文件一致，而 Restic 则是会加密文件再传输，每一次增量备份
- Rclone 不会记录文件版本，Restic 每一次备份都会产生新版本
