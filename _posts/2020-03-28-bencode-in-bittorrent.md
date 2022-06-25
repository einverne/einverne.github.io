---
layout: post
title: "BitTorrent 协议中的 BenCode 编码"
aliases: "BitTorrent 协议中的 BenCode 编码"
tagline: ""
description: ""
category: 学习笔记
tags: [bittorrent, bencode, encode, encoding, ]
last_updated: 2022-06-10 02:22:08
create_time: 2021-07-03 10:32:51
---

在了解 [BitTorrent](/post/2020/02/everything-related-about-bittorrent-and-pt.html) 协议的时候，想着 `.torrent` 文件是如何生成的，所以就找了几个 CLI，比如 `transmission-cli` 和 `mktorrent`这两个开源的制作 torrent 文件的开源项目，发现他们就是按照一种约定的格式来生成文件。而这个约定的结构中就少不了现在要谈的 BenCode 编码。

BitTorrent 协议使用 `.torrent` 文件来描述资源信息。`.torrent` 文件使用一套 BenCode 编码来对信息进行描述。

## What is BenCode
BenCode 是用于编码 torrent 文件的一种编码格式。BenCode 支持四种数据类型：

- 字符串 String
- 整数 Integer
- 数组 List
- 字典 Dictionary

需要注意的是 BenCode 只用 ASCII 字符进行编码，如果是非 ASCII 码，BenCode 会用一种编码方式将其转换成 ASCII 码。

### 字符串 {#string}
在编码字符串时 BenCode 选择将字符长度编码在其中：

	<Length>:<Content>

比如 `6:string` 就表示 `string` 本身。其中 6 表示的是字符串长度。长度使用十进制表示。

### 整数 {#integer}
整数编码时在前后加 `i` 和 `e`，比如：

	i123e

表示整数 123 . 这种方式也可以表示负数：`i-1e`.

不过需要注意的是 `i-0e`, `i03e` 这样的表示是非法的，但是 `i0e` 是合法的，表示整数 0 .

### 数组 {#array}
列表前后用 `l` 和 `e` 标识。列表中的元素可以是 BenCode 支持的任何一种类型。比如要编码字符串 `content` 和数字 42:

	l7:contenti42ee

注意这里每个类型的边界都有定义清楚。字符串可以用长度来限定边界，但是整数一定需要 `i` 和 `e` 来限定边界。

### 字典 {#map}
字典类型可以保存一对一的关系，在 BenCode 中 KEY 必须为字符串类型，而 VALUE 可以是 BenCode 支持的任意一种类型。字典编码时用 `d` 和 `e` 限定范围。

另外需要注意，字典中 KEY 和 VALUE 必须相邻，字典依照 KEY 的字母序排序。

比如要定义 "name" -> "Ein Verne", "age" -> 18, "interests" -> ["book", "movie"]

首先要到 KEY 进行排序 "age", "interests", "name"

	3:age9:Ein Verne
	9:interestsi18e
	4:namel4:book5:moviee

然后把上面的 KEY VALUE 连接起来，并在前后加上字典的 `d` 和 `e` 限定。

	d3:age9:Ein Verne9:interestsi18e4:namel4:book5:movieee

### 总结一下

| 类似   | 数据         | 编码         |
| ------ | ------------ | ------------ |
| int    | -42          | i-42e        |
| string | 'span'       | 4:spam       |
| list   | ['XYZ', 432] | l3:XYZi432ee |
| dict   | {'XYZ': 432} | d3:XYZi432ee             |

## torrent 文件
在了解了 BenCode 的编码后，用纯文本文件打开 `.torrent` 文件就能知道一二了。本质上 torrent 文件就是一个用 BenCode 编码的纯文本文件，torrent 在 BitTorrent 协议中又被称为 metainfo。

metainfo 是一个 BenCode 编码的字典：

	announce
		tracker 的地址
	info
		字典，单文件和多文件略有不同

torrent 文件中的所有字符串必须是 UTF-8 编码的。

### 单文件 {#single-file}
我在本地新建了一个 README.md 文件，然后用如下命令创建一个 torrent 文件 "test.torrent".

	mktorrent -a http://announce.url -c "This is comments" -l 18 -o "test.torrent" -p -v README.md

然后查看 `cat test.torrent` 内容：

	d8:announce19:http://announce.url7:comment16:This is comments10:created by13:mktorrent 1.013:creation datei1585360743e4:infod6:lengthi5e4:name9:README.md12:piece lengthi262144e6:pieces20:h7@xxxxxlxx]7:privatei1eee

拆解这个编码，先分段开。


	d
	 8:announce -> 19:http://announce.url
	 7:comment -> 16:This is comments
	 10:created by -> 13:mktorrent 1.0
	 13:creation date -> i1585360743e
	 4:info
	  d
	   6:length -> i5e
	   4:name -> 9:README.md
	   12:piece length -> i262144e
	   6:pieces -> 20:h7@xxxxxxxxx
	   7:private -> i1e
	  e
	e

拆解后可以看到 info 字典中有这么几项：

- length 指的是整个文件的大小
- name 下载的文件名
- piece length 整数，BitTorrent 文件块大小
- pieces 字符串，连续存放所有块的 SHA1 值，每一个块的 SHA1 值长度都是 20，这里因为文件本身比较小所以只有一块
- private 整数，标记 torrent 是否私有


注：pieces 中有些特殊字符，在文章中用其他字符替换了。

### 多文件 {#multiple-files}
多文件时 info 字典中会有一个 files 列表，这个列表由字典组成，每一个字典中是文件的内容，包括文件名和文件长度。

比如对当前文件夹下 `README.md` 和 `README1.md` 两个文件制作 torrent.

	mktorrent -a http://announce.url -c "This is comments" -l 18 -o "test.torrent" -p -v .

得到的 torrent 文件：

	d8:announce19:http://announce.url7:comment16:This is comments10:created by13:mktorrent 1.013:creation datei1585361538e4:infod5:filesld6:lengthi5e4:pathl9:README.mdeed6:lengthi0e4:pathl10:README1.mdeee4:name1:.12:piece lengthi262144e6:pieces20:rhr7r@rorrrlrrrrrrrr7:privatei1eee

拆解一下：

	d
	 8:announce -> 19:http://announce.url
	 7:comment -> 16:This is comments
	 10:created by -> 13:mktorrent 1.0
	 13:creation date -> i1585361538e
	 4:info ->
	  d
	   5:files -> l
	               d
				    6:length -> i5e
				    4:path -> l 9:README.md e
				   e
				   d
				    6:length -> i0e
				    4:path -> l 10:README1.md e
				   e
				  e
	   4:name -> 1:.
	   12:piece length -> i262144e
	   6:pieces -> 20:rhrxxxxxxxxrrrrrr
	   7:private -> i1e
	  e
	e

多文件时 info 字典中的内容稍微多一些。

- files 是多个文件的信息，其中包括了文件长度和路径。

## 相关库
构造好字典之后，使用如下库调用即可。

- PHP：[sandfoxme/bencode](https://github.com/sandfoxme/bencode)、[rchouinard/bencode](https://github.com/rchouinard/bencode)、[dsmithhayes/bencode](https://github.com/dsmithhayes/bencode)、[bhutanio/torrent-bencode](https://github.com/bhutanio/torrent-bencode)
- Python：[amyth/bencode](https://github.com/amyth/bencode)、[utdemir/bencoder](https://github.com/utdemir/bencoder)、[jcul/bencode](https://github.com/jcul/bencode)、[fuzeman/bencode.py](https://github.com/fuzeman/bencode.py)
- Node.js： [themasch/node-bencode](https://github.com/themasch/node-bencode)、[benjreinhart/bencode-js](https://github.com/benjreinhart/bencode-js)


## 客户端
可以对 torrent 文件进行编辑的客户端：

- [Torrent File Editor](https://torrent-file-editor.github.io/) Windows, macOS
- [BEncode Editor](https://sites.google.com/site/ultimasites/bencode-editor)

## reference

- <http://www.bittorrent.org/beps/bep_0003.html>
- <https://zh.wikipedia.org/wiki/Bencode>
