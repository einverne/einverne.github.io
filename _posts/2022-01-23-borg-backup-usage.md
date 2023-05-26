---
layout: post
title: "Borg Backup 命令行增量备份工具使用"
aliases: 
- "Borg Backup 命令行增量备份工具使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ borg, borgbackup, backup, ssh, scp, rsync ]
last_updated:
---

[BorgBackup](https://github.com/borgbackup/borg) 是一个 Python 和 C 语言编写的命令行增量数据备份工具。

特性：

- 高效存储
- 加密
- 支持多种压缩算法
  - LZ4 快，低压缩
  - ZSTD 高速低压缩、低速高压缩
  - ZLIB 中等速度，中等压缩
  - LZMA 低速 高压缩
- 远程备份，数据可以通过 SSH 备份到远程机器
- FUSE
- 跨平台
- 开源

## 客户端

Borg 本身是一个命令行工具，但是在 macOS 和 Linux 下可以使用 [Vorta](https://vorta.borgbase.com/) 这是一个跨平台的 GUI 客户端。

## 概念

BorgBackup 中有两个必须知道的概念：

- repository, 备份仓库
- archive 每次备份

## 安装

在 Debian/Ubuntu 下：

    sudo apt install borgbackup -y

如果要 Python 环境，也可以使用 pip 安装：

    pip install borgbackup

也可以手工安装（记得去官网获取最新版本）：

```
wget https://github.com/borgbackup/borg/releases/download/1.0.12/borg-linux64
sudo mv borg-linux64 /usr/local/bin/borg
sudo chown root:root /usr/local/bin/borg
sudo chmod 755 /usr/local/bin/borg
```

验证：

    borg --version
    borg --help

其他更多系统的安装可以参考[官网](https://borgbackup.readthedocs.io/en/stable/installation.html)。

## 使用

相关命令：

```
borg init -- 初始化一个仓库
borg create -- 创建一个archive到仓库中
borg list -- 列出所有的仓库或者某个仓库中某个archive的内容
borg extract -- 还原某个archive
borg delete -- 手动删除某个archive
borg config -- 获取或者设置某个配置
```

备份流程：

```
# 创建仓库存储目录
$ mkdir -p /tmp/backup/
# 初始化仓库
$ borg init --encryption=repokey /tmp/backup/borg_sample
```

初始化 repository 的时候，可以指定加密类型：

- none 不加密
- repokey 或 keyfile 的时候，使用 AES-CTR-256 加密
- 其他的加密类型可以参考官网

```
# 创建测试备份内容
# 会被修改的文件file_change.txt，不会被修改的文件file_static.txt，二进制大文件random.dump
$ mkdir -p /tmp/data
$ cd /tmp/data
$ echo "here is the first line of file 1" >> file_change.txt
$ echo "here is the static file" >> file_static.txt
$ dd if=/dev/urandom of=random.dump bs=10M count=10
10+0 records in
10+0 records out
104857600 bytes (105 MB) copied, 0.950948 s, 110 MB/s
$
# 第一次备份
$ borg create --stats --progress /tmp/backup/borg_sample::first /tmp/data/
------------------------------------------------------------------------------
Archive name: first
Archive fingerprint: bd5ddf9ac944353bb209576c12a16652a18f866c9d033fef2eb582d288a3cff5
Time (start): Sat, 2022-01-29 10:48:07
Time (end):   Sat, 2022-01-29 10:48:07
Duration: 0.54 seconds
Number of files: 3
Utilization of max. archive size: 0%
------------------------------------------------------------------------------
                       Original size      Compressed size    Deduplicated size
This archive:              104.86 MB            105.27 MB            105.27 MB
All archives:              104.86 MB            105.27 MB            105.27 MB

                       Unique chunks         Total chunks
Chunk index:                      42                   42
------------------------------------------------------------------------------
```

如果不传 `--stats --progress` 则静默输出。

在 create 的时候可以选择使用压缩算法：

    borg create --compress zstd,1 /tmp/backup/borg_sample::2022-01-20 /tmp/data/

如果不指定压缩算法，默认会使用 LZ4，速度快，压缩比率低。

```
# 修改备份内容,修改file_change.txt， 新增file_new.txt，新增random_2.dump
$ cd /tmp/data
$ echo "here is the second line of file 1" >> file_change.txt
$ echo "here is new file for second backup" >> file_new.txt
$ dd if=/dev/urandom of=random_2.dump bs=10M count=10
10+0 records in
10+0 records out
104857600 bytes (105 MB) copied, 0.599837 s, 175 MB/s
$
# 第二次备份
$ borg create --stats --progress /tmp/backup/borg_sample::second /tmp/data/
------------------------------------------------------------------------------
Archive name: second
Archive fingerprint: 67b7f448698a471561ff2cf5de2b571cb40ddbce3f1a23669bfbec76d291c1b6
Time (start): Sat, 2022-01-29 10:50:35
Time (end):   Sat, 2022-01-29 10:50:35
Duration: 0.51 seconds
Number of files: 4
Utilization of max. archive size: 0%
------------------------------------------------------------------------------
                       Original size      Compressed size    Deduplicated size
This archive:              209.72 MB            210.54 MB            105.27 MB
All archives:              524.30 MB            526.36 MB            210.55 MB

                       Unique chunks         Total chunks
Chunk index:                      85                  205
------------------------------------------------------------------------------
```

列出备份：

```
# 列出所有的备份
$ borg list /tmp/backup/borg_sample/
first                                Sat, 2022-01-29 10:48:07 [bd5ddf9ac944353bb209576c12a16652a18f866c9d033fef2eb582d288a3cff5]
second                               Sat, 2022-01-29 10:49:27 [6a5131bc1098d4ba46daabc6e440d6daf9211db94ac2d17893f996ce78840162]

$
# 列出第一次备份的内容
$ borg list /tmp/backup/borg_sample::first
drwxrwxr-x einverne einverne        0 Sat, 2022-01-29 10:47:39 tmp/data
-rw-rw-r-- einverne einverne 104857600 Sat, 2022-01-29 10:47:41 tmp/data/ramdom.dump
-rw-rw-r-- einverne einverne       11 Sat, 2022-01-29 10:47:11 tmp/data/file_change.txt
-rw-rw-r-- einverne einverne       12 Sat, 2022-01-29 10:47:21 tmp/data/file_static.txt
$
```

使用 `info` 获取存档信息：

    borg info /tmp/backup/borg_sample/::first

恢复备份：

```
# 将第一次备份恢复, 查看file_change.txt内容，只包含第一次的内容
$ mkdir -p /tmp/restore/first
$ cd /tmp/restore/first
$ borg extract --list /tmp/backup/borg_sample::first
tmp/data
tmp/data/file_change.txt
tmp/data/file_static.txt
tmp/data/random.dump
$
$ cat tmp/data/file_change.txt
here is the first line of file 1
$
# 将第二次备份导出, 查看file_change.txt内容，其中包含了第二次新增加的内容
# 也包含了第一次新增的file_new.txt和random_2.dump
$ mkdir -p /tmp/restore/second
$ cd /tmp/restore/second
$ borg extract --list /tmp/backup/borg_sample::second
tmp/data
tmp/data/file_change.txt
tmp/data/file_static.txt
tmp/data/random.dump
tmp/data/file_new.txt
tmp/data/random_2.dump
$
$ cat tmp/data/file_change.txt
here is the first line of file 1
here is the second line of file 1
$
# 第一次备份是100M,第二次是200M, 但由于是增量备份的，random.dump没有改变，因此仓库的总容量只有200M
$ du -sh /tmp/backup/borg_sample/
201M	/tmp/backup/borg_sample/
$
# 删除第一次备份，恢复第二次的备份
# 可以看到再第一次和第二次备份中都有的file_static.txt和random.dump都可以恢复出来。
# 恢复出来的数据和之前恢复的数据是一样的
$ borg delete /tmp/backup/borg_sample::first
$ borg list /tmp/backup/borg_sample
second                               Tue, 2019-09-24 04:10:55 [a423a94e8a8f4352e72c0951e6a408f4f4f6d5f362518dcbcba77b9005dafa12]
$
$ mkdir -p /tmp/restore/second_back
$ cd /tmp/restore/second_back
$ borg extract --list /tmp/backup/borg_sample::second
tmp/data
tmp/data/file_change.txt
tmp/data/file_static.txt
tmp/data/random.dump
tmp/data/file_new.txt
tmp/data/random_2.dump
$
$ diff -r /tmp/restore/second /tmp/restore/second_back
$
$ cat tmp/data/file_change.txt
here is the first line of file 1
here is the second line of file 1
$
$ cat tmp/data/file_static.txt
here is the static file
```

查找备份和备份之间的差异，可以使用 `diff` 命令：

    borg diff /tmp/backup/borg_sample::first second

重命名备份名：

    borg rename /tmp/backup/borg_sample::first 2022-01-20

熟悉了 Borg 命令的时候之后，大部分情况下，我们可以使用 [[Borgmatic]] 来管理备份，Borgmatic 会将基础的配置，比如仓库的地址，压缩方法，源目录，passphrase 等等在一个地方进行管理，然后使用简单的命令即可执行。

## Borgmatic

## 备份到远程

Borg 支持远程仓库，可以将数据通过 SSH 备份到任何远程主机中。

    borg init user@hostname :/path/to/repo

同样使用 `mount` 和 `extract` 的时候：

    borg mount ssh://user@hostname:222/home/einverne/borg/backup /path/to/backup
    borg extract ssh://user@hostname:222/home/einverne/borg/backup
