---
layout: post
title: "使用 mktorrent 从命令行制作 torrent"
aliases: "使用 mktorrent 从命令行制作 torrent"
tagline: ""
description: ""
category: 学习笔记
tags: [torrent, bittorrent, linux, command,]
last_updated:
---

一个 torrent 文件，本质上就是按照 BitTorrent 协议制作的一个包含一系列 meta 信息的文本文件，torrent 文件主要包含两部分重要信息，Tracker 信息和文件 meta 元信息。

- Tracker，就是 BitTorrent 协议中的中心 Trakcer 服务器
- 文件元信息则是根据目标文件分块，然后索引，Hash 的信息

在制作 torrent 文件时，会根据 BitTorrent 协议对目标文件进行分片，piece length 来表示一个分片，或者一块的大小，通常是 2 的 n 次方，根据目标文件的大小可以选择性的使用不同的 piece length。

- 2^18, 256 KB，通常用在目标文件在 512 MiB 以下
- 2^19, 512 KB，通常用在目标文件在 512 MiB - 1024 MiB
- 2^20, 1024 KB，通常用在目标文件在 1 GB - 2GB
- 2^21, 2048 KB，通常用在目标文件在 2 GB - 4GB
- 2^22, 4096 KB，通常用在目标文件在 4 GB - 8GB
- 2^23, 8192 KB，通常用在目标文件在 8 GB - 16GB
- 2^24, 16384 KB，通常用在目标文件在 16 GB - 512GB，通常这是日常使用应该用的最大的块大小

通常情况下根据目标文件的大小选择合适的 piece length，如果分片太小就可能造成 torrent 文件过大。选择合适的分片大小，一方面可以减小 torrent 需要保存的元信息，另一方面也减少了对分片的校验耗时，下载时对分片的确认也可以加快。

## transmission-cli

如果使用 [Transmission](/post/2018/06/qnap-transmission.html) 那么 [transmission-create](https://github.com/tldr-pages/tldr/pull/3916/files) 已经充分够用。

如果要使用 transmission-create 需要安装：

	sudo apt install transmission-cli

创建一个 torrent:

```
transmission-create -o path/to/example.torrent --tracker tracker_announce_url --piecesize 2048 path/to/file_or_directory
```

创建一个私有 Torrent：

```
transmission-create -p -o path/to/example.torrent --tracker tracker_announce_url --piecesize 2048 path/to/file_or_directory
```

说明：

- `-p`: 私有种子，不使用 DHT
- `-o`: 生成 torrent 文件路径
- `-t`: tracker 地址
- `-s`: 每个文件块大小(kb 单位，普通设置 2048即可)
- `-c`: 备注，评论

创建一个带 comment 的 torrent:

```
transmission-create -o path/to/example.torrent --tracker tracker_url1 -c comment path/to/file_or_directory
```


## mktorrent

或者使用 `mktorrent` 命令也能够快速的制作 torrent 文件

	sudo apt install mktorrent

或者使用源码编译安装：

	git clone git@github.com:Rudde/mktorrent.git
	cd mktorrent
	sudo make
	sudo make install

默认会安装到 `/usr/local/bin/mktorrent` .

### 使用

查看 `man mktorrent` 手册，非常容易理解。

```
mktorrent 1.0 (c) 2007, 2009 Emil Renner Berthing

Usage: mktorrent [OPTIONS] <target directory or filename>

Options:
-a, --announce=<url>[,<url>]* : specify the full announce URLs
                                at least one is required
                                additional -a adds backup trackers
-c, --comment=<comment>       : add a comment to the metainfo
-d, --no-date                 : don't write the creation date
-h, --help                    : show this help screen
-l, --piece-length=<n>        : set the piece length to 2^n bytes,
                                default is 18, that is 2^18 = 256kb
-n, --name=<name>             : set the name of the torrent
                                default is the basename of the target
-o, --output=<filename>       : set the path and filename of the created file
                                default is <name>.torrent
-p, --private                 : set the private flag
-t, --threads=<n>             : use <n> threads for calculating hashes
                                default is 2
-v, --verbose                 : be verbose
-w, --web-seed=<url>[,<url>]* : add web seed URLs
                                additional -w adds more URLs

Please send bug reports, patches, feature requests, praise and
general gossip about the program to: esmil@users.sourceforge.net
```

举个例子：

	mktorrent -v -p -d -c "Demo comments" -l 18 -a https://some.website/announce.php -o example.torrent path/to/dir_or_file

解释这个命令的含义一个一个选项看即可：

- `-p` 标记 torrent 私有，不启用 DHT 和 Peer Exchange，如果不知道后面两个术语，可以参考我[之前的文章](/post/2020/02/everything-related-about-bittorrent-and-pt.html)
- `-d` 不写入创建时间
- `-c` 后接简短的描述信息
- `-l 18` 表示块大小，18 就是 2^18 bytes, 也就是 256kb 一块。如果不设置 -l 选项，默认也是 `-l 18`
- `-a` 后接 announce URLs
- `-o` 后接输出的 torrent 文件
- 最后就是要制作的 torrent 的文件目录或者文件

mktorrent 在 1.1 版本之后添加了 `-s` 选项

```
-s                : add source string embedded in infohash
```

表示添加额外的信息到 torrent 文件中。

## web seed
使用 mktorrent 还可以使用 `-w` 选项来添加 web seed URLs。

> Web seeding was implemented in 2006 as the ability of BitTorrent clients to download torrent pieces from an HTTP source in addition to the swarm. The advantage of this feature is that a website may distribute a torrent for a particular file or batch of files and make those files available for download from that same web server; this can simplify long-term seeding and load balancing through the use of existing, cheap, web hosting setups. In theory, this would make using BitTorrent almost as easy for a web publisher as creating a direct HTTP download. In addition, it would allow the "web seed" to be disabled if the swarm becomes too popular while still allowing the file to be readily available.

简而言之就是 Web seed 可以让 torrent 从 HTTP 来源来发布文件。

最后的最后求一枚 Open.CD 的邀请。

## reference

- <https://github.com/Rudde/mktorrent>
- <https://bytesized-hosting.com/pages/how-to-create-a-torrent-using-mktorrent>
