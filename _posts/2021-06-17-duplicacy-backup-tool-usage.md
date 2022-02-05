---
layout: post
title: "Duplicacy 增量备份工具使用"
aliases: 
- Duplicacy 增量备份工具使用
tagline: ""
description: ""
category: 经验总结
tags: [ backup, duplicacy, backblaze, google-drive, rsync ]
last_updated:
---


[Duplicacy](https://duplicacy.com/) 是一个用 Go 语言实现的，开源的，跨平台的备份工具。

特性：

- 命令行版本对个人用户完全免费
- 付费授权会提供了一个网页端管理
- 支持 Amazon S3，Google Cloud Storage，Microsoft Azure，Dropbox 和 Backblaze 等云存储，本地磁盘，SFTP 等等
- 支持多个客户端备份到同一个云存储
- 支持增量备份
- 支持加密备份

## Lock Free Deduplication
这是一个对 Duplicacy 实现原理的简单介绍，完整的说明可以参考发布在 IEEE Transactions on Cloud Computing 的 [Paper](https://ieeexplore.ieee.org/document/9310668)。

Lock-Free Deduplication 的三个重要内容：

- 使用 variable-size chunking 算法将文件分割成多块
- 将每一块内容存储到云端空间，每一块的名字是其 hash，依赖文件系统的 API 来管理块，而不是用一个中心化的索引数据来管理
- 当备份被删除时使用 _two-step fossil collection_ 算法移除未被引用的块

variable-size chunking 算法又被称为 Content-Defined Chunking，被很多备份工具使用。相较于固定大小的块划分算法（rsync 所使用的）, 

检查一个块是否被上传过，只需要通过文件名（hash）执行一个文件查询。这使得只提供了非常有限操作的云端存储变成了一个非常强大的现代化的备份工具后端，既可以实现 block-level 的重复数据删除，也可以实现 file-level 的重复数据删除。不依赖于一个中心的索引数据库也就意味着没有必要实现一个存储系统上的分布式锁。

通过消除 chunk indexing database， 无锁的备份不仅减少了代码复杂度，也使得删除重复的过程变得没那么容易出错。

但存在一个问题，当并发访问时，如果没有一个中心化的索引数据库，那么删除 snapshots 的操作就变得非常困难。单一节点去访问文件存储是可以保证的，但是删除的操作可以简化成搜索没有被任何备份引用的块，然后删除他们。但是如果并发的访问，那么一个未被引用的块就不能被轻易地移除，因为可能另外一个备份进程正在引用同一块。正在执行的备份程序可能并不知道删除进程，所以在扫描的过程中可能认为该块存在，而不上传该块，但是删除进程可能在此时删除了该块，那么就造成了数据丢失。

但幸运的是，Lock-free deduplication 的删除问题有一个解决方案，就是 _two-step fossil collection algorithm_。这个算法会使用两个步骤来删除未被引用的块：

- identify, collect them in the first step
- permanently remove them once certain conditions are met

## 安装
从项目 [release](https://github.com/gilbertchen/duplicacy/) 页面下载可执行二进制文件。

```
sudo wget -O /opt/duplicacy https://github.com/gilbertchen/duplicacy/releases/download/v2.0.10/duplicacy_linux_x64_2.0.10
sudo ln -s /opt/duplicacy /usr/local/bin/duplicacy
sudo chmod +x /usr/local/bin/duplicacy
```

## 前提知识

### storage
在 Duplicacy 的概念中 storage 指的是备份存储的地方。这个地方可以是本地，也可以是 [[SFTP]]，或者现成的云端存储服务比如 [[Backblaze]]。

### repository
repository 可以理解成仓库，可以将一个本地文件夹作为仓库。

### snapshot
snapshot 直译是快照，`duplicacy backup` 命令会将 repository 的一份本地快照备份到 storage。

## 使用
Duplicacy 相关的命令：

```
NAME:
   duplicacy - A new generation cloud backup tool based on lock-free deduplication

USAGE:
   duplicacy [global options] command [command options] [arguments...]
   
VERSION:
   2.7.2 (175ADB)
   
COMMANDS:
   init		Initialize the storage if necessary and the current directory as the repository
   backup	Save a snapshot of the repository to the storage
   restore	Restore the repository to a previously saved snapshot
   list		List snapshots
   check	Check the integrity of snapshots
   cat		Print to stdout the specified file, or the snapshot content if no file is specified
   diff		Compare two snapshots or two revisions of a file
   history	Show the history of a file
   prune	Prune snapshots by revision, tag, or retention policy
   password	Change the storage password
   add		Add an additional storage to be used for the existing repository
   set		Change the options for the default or specified storage
   copy		Copy snapshots between compatible storages
   info		Show the information about the specified storage
   benchmark	Run a set of benchmarks to test download and upload speeds
   help, h	Shows a list of commands or help for one command
   
GLOBAL OPTIONS:
   -verbose, -v 		show more detailed information
   -debug, -d 			show even more detailed information, useful for debugging
   -log 			enable log-style output
   -stack 			print the stack trace when an error occurs
   -no-script 			do not run script before or after command execution
   -background 			read passwords, tokens, or keys only from keychain/keyring or env
   -profile <address:port> 	enable the profiling tool and listen on the specified address:port
   -comment  			add a comment to identify the process
   -suppress, -s <id> [+]	suppress logs with the specified id
   -help, -h 			show help
```

### 初始化存储
Duplicacy 可以备份目录级别数据。

```
cd path/to/dir
duplicacy init mywork sftp://user@192.168.2.100/path/to/storage/
```

- mywork 是 duplicacy 用来区分备份的 snapshot_id，用来区分不用存储库的标签
- 远程的文件夹需要提前创建，duplicacy 不会自动创建文件。

开始备份

    duplicacy backup -stats

每一次的备份都通过唯一的 repository id 和从 1 开始自增的 revision number 组成

### 备份

```
#默认命令
duplicacy backup
#如果有多个存储目标，可以用-storage指定存储名称
duplicacy backup -storage storage_name
```

### 查看快照

    duplicacy list
    # 查看指定存储的快照
    duplicacy list -storage storage_name
    # 查看所有存储的快照
    duplicacy list -a

### 还原
可以使用如下的命令还原：

    duplicacy restore -r revision_number
    
说明：

- 这里的 revision_number 可以通过 `list` 命令查看。

### 删除历史快照

    # 删除指定存储内所有快照
    duplicacy prune -a
    # 删除版本 2，`-r` 可以使用多次
    duplicacy prune -r 2
    # 删除一个范围
    duplicacy prune -r 10-20

使用 `-keep` 选项可以指定保存策略，比如

    duplicacy prune -keep 1:7

表示的是对于超过7天的版本，每天保留一个版本。总结一下，`-keep` 接受两个数字 `n:m` ，表示的是对于 m 天前的版本，每隔 n 天保留一个版本。如果 n 为 0，任何超过 m 天的版本会被删掉。

这样如果要实现删除 180 天前的版本：

    duplicacy prune -keep 0:180

`-keep` 选项也可以使用多次，但是需要按照 m 值从大到小排列：

    duplicacy prune -keep 0:180 -keep 7:30 -keep 1:7

## 备份到 Backblaze

[[Backblaze B2 Cloud Storage]] 提供了 10GB 免费存储空间

```
# 将本地存储加密备份到 B2 存储的 Bucket 
duplicacy init -e repository_id b2://unique-bucket-name
```

执行命令后会需要输入 Backblaze 的 KeyID 和 applicationKey，这个在 Backblaze B2 后台可以查看。

执行备份：

    duplicacy bacup

## 备份到多个存储
根据 [[3-2-1 备份原则]] 至少需要有三份完整的数据，其中一份必须在异地，Duplicacy 只需要添加多个存储即可实现多地备份。

    cd path/to/dir
    duplicacy init my-backups --storage-name backblaze b2://bucket-name
    # add an additional storage
    duplicacy add local snapshot_id /mnt/storage/
    duplicacy add offsite_storage_name repository_id offsite_storage_url

说明：

- `add` 子命令和 `init` 命令相差不多，主要区别在于需要为新的存储指定一个名字。这里的 `offsite_storage_name` 可以是任何想要的名字，主要是为了助记。Duplicacy 的第一个存储空间默认的名字是 default。

当配置完成后使用 `duplicacy backup` 即可以实现多处备份。

如果只想要备份到一个地方，也可以使用 `-storage` 指定：

    duplicacy backup -storage offsite_storage_name

另外一种推荐的做法是使用 `copy` 命令，将默认的存储内容复制到新配置的存储（offsite_storage) 上：

    duplicacy copy -from default -to offsite_storage_name

## 恢复到另外的文件夹或恢复到另外的电脑

    cd path/to/dir1
    duplicacy init backup1 sftp://user@192.168.2.100/path/to/storage
    duplicacy backup -stats

如果在当前的文件夹想要恢复，那么直接使用 `duplicacy restore -r 1` 即可。

但是如果要在另外的文件夹，或另一台机器上恢复呢，也非常简单

    cd path/to/dir2
    duplicacy init backup1 sftp://user@192.168.2.100/path/to/storage
    duplicacy restore -r 1

这里需要注意备份的远端地址需要是一样的。比如上面的例子中都使用 SFTP 的地址。

## Duplicacy 支持的Storage

### Local
本地文件的话，直接写文件路径：

    /path/to/backup

### SFTP
SFTP 语法：

    sftp://username@server

### Dropbox
Storage URL:

    dropbox://path/to/storage

- 通过 [Dropbox Developer](https://www.dropbox.com/developers) 生成 Access Token。
- 或者通过 [Link](https://duplicacy.com/dropbox_start.html) 来获取 Access Token。

### Amazon S3

```
s3://amazon.com/bucket/path/to/storage (default region is us-east-1)
s3://region@amazon.com/bucket/path/to/storage (other regions must be specified)
```

需要提供 access key 和 secret key.

支持 [[2021-07-24-minio-usage|MinIO 自建对象存储]]:

```
minio://region@host/bucket/path/to/storage (without TLS)
minios://region@host/bucket/path/to/storage (with TLS)
```

其他 S3 兼容的存储：

    s3c://region@host/bucket/path/to/storage

### Wasabi

```
wasabi://region@s3.wasabisys.com/bucket/path
wasabi://us-east-1@s3.wasabisys.com/bucket/path
wasabi://us-east-2@s3.us-east-2.wasabisys.com/bucket/path
wasabi://us-west-1@s3.us-west-1.wasabisys.com/bucket/path
wasabi://eu-central-1@s3.eu-central-1.wasabisys.com/bucket/path
```

### DigitalOcean Spaces

    s3://nyc3@nyc3.digitaloceanspaces.com/bucket/path/to/storage

### Google Cloud Storage

    gcs://bucket/path/to/storage

- 通过[链接](https://duplicacy.com/gcp_start) 授权
- 或者[下载](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts) 授权文件

Google Cloud Storage 也可以在设置中开启 [S3 兼容](https://cloud.google.com/storage/docs/migrating#migration-simple) 那就可以使用：

    s3://storage.googleapis.com/bucket/path/to/storage

### Microsoft Azure

    azure://account/container

### NetApp StorageGRID

    s3://us-east-1@storagegrid.netapp.com/bucket/path/to/storage

### Backblaze B2

    b2://bucketname

### Google Drive

    gcd://path/to/storage (for My Drive)
    gcd://shareddrive@path/to/storage (for Shared Drive)

### Microsoft OneDrive

    one://path/to/storage (for OneDrive Personal)
    odb://path/to/storage (for OneDrive Business)

### Hubic

    hubic://path/to/storage


### OpenStack Swift

    swift://user@auth_url/container/path

### WebDAV
[[WebDAV]] 链接：

    webdav://username@server/path/to/storage (path relative to the home directory)
    webdav://username@server//path/to/storage (absolute path with double `//`)

更多的 Storage URL 可以参考[这里](https://github.com/gilbertchen/duplicacy/wiki/Storage-Backends)

## 备份脚本

```
#!/bin/bash

#关闭服务

#duplicacy变量
export DUPLICACY_B2_ID=b2_id
export DUPLICACY_B2_KEY=b2_key
export DUPLICACY_PASSWORD=your_password

#导出数据库
cd /data/mysql/
/usr/local/mysql/bin/mysqldump -h 127.0.0.1 -P 3306 --all-databases > /data/mysql/all.sql
zip -mqP password ./all.sql.zip ./all.sql

#增量备份mysql文件夹
cd /data/mysql/
duplicacy backup

#增量备份wordpress文件夹
cd /home/wordpress/
duplicacy backup

#删除60天前的快照，超过30天的快照每15天保留一个
duplicacy prune -all -keep 0:60 -keep 15:30

#启动服务

```

## Duplicacy vs duplicity
Duplicacy 和 duplicity 相比较而言，Duplicacy 在备份很多次的情况下会比 duplicity 占用更多的空间，但是 Duplicacy 每一次备份的时间都要远远少于 duplicity。

duplicity 有一个严重的缺陷在于其增量备份方法，每一次备份都需要用户选择是否全量备份或者增量备份，并且其设计决定了在一个备份了很多次的仓库中删除任何一个历史的备份变得不可能。

具体的比较可以参考[这里](https://github.com/gilbertchen/benchmarking)。

## reference


- <https://duplicacy.com/>
- <https://github.com/gilbertchen/duplicacy/wiki/Lock-Free-Deduplication>
- [Duplicacy User Guide](https://forum.duplicacy.com/t/duplicacy-user-guide/1197)
- [[backup-tools-options]]
