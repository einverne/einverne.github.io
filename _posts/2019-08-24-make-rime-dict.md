---
layout: post
title: "利用 imewlconverter 制作 Rime 词库"
tagline: ""
description: ""
category: 学习笔记
tags: [rime, Rime, 词库 , 小狼毫 , 中州韵 , trime, input-method, ]
last_updated:
---

之前就写过文章介绍这款跨平台的开源输入解决方案 [Rime](/post/2014/11/rime.html)，所有的配置以及同步方法都在之前的文章中有介绍。这篇文章主要介绍如何制作 Rime 的扩展词库。虽然目前网上也有一些非常不错的词库，但是很多内容还是需要自己慢慢培养的。


## 词库转换工具

从 2.4 版本起支持加密的搜狗词库了，直接导出搜狗词库，然后转成 Rime 的格式即可。

- <https://github.com/studyzy/imewlconverter/releases>

安装 dotnet：

- <https://dotnet.microsoft.com/download/dotnet-core/2.2>

macOS 下直接 `brew install dotnet-sdk`

下载 release 对应版本，然后运行：

	dotnet ImeWlConverterCmd.dll -?
    
在 macOS 下使用 `dotnet ImeWlConverterCmd.dll "-?"`.

具体转换命令，比如导入一个搜狗细胞词库成 Rime 词库，则命令为：

	dotnet ImeWlConverterCmd.dll -ct:pinyin -os:linux -i:scel ./input.scel -o:rime ./rime.txt

`ImeWlConverterCmd.dll` 工具的其他重要参数，对于输出为 rime 的 `-ct:pinyin/wubi/zhengma`，也可以通过 `-os:windows/macos/linux` 来指定操作系统。

## 繁简转换
安装 `opencc` 繁简转换工具

	sudo apt install opencc

然后运行装换

	opencc -i source.txt -o dest.txt

会将 `source.txt` 文本内容全部转换成 `dest.txt` 繁体的文本。

然后将文本内容全部拷贝到 `luna_pinyin.mywords.dict.yaml` 文件中，并添加文件头：

	---
	name: luna_pinyin.mywords
	version: "0.0.1"
	sort: by_weight
	use_preset_vocabulary: true
	...

说明：

- `sort: by_weight`，词条的排序方式，可选填 `by_weight` 按照词频高到低，`original` 保持原码表中的顺序
- `use_preset_vocabulary: true` 表示是否导入预设的词汇表，当词库中没有定义拼音和词频的时候开启


然后找到 `luna_pinyin.extended.dict.yaml`，打开文件导入新的词库

	import_tables:
	  - luna_pinyin.mywords



## 搜狗细胞词库
下载对应的细胞词库：

- <https://pinyin.sogou.com/dict/>

然后使用上面的方法转换。

### 搜狗拼音备份词库 bin

    dotnet ImeWlConverterCmd.dll -ct:pinyin -os:linux -i:sgpybin ./input.bin -o:rime ./rime.txt


## 清华大学开放中文词库
包含了 IT, 财经，成语，地名，历史名人，诗词，医学，饮食，法律，汽车，动物，等几大类词库。

- <http://thuocl.thunlp.org/>

## 通讯录姓名
我所有的通讯录都在 [Google 通讯录](https://contacts.google.com/?hl=zh-CN) 中保存着，页面上可以很方便的导出 csv 文件。有了这个文本文件就可以快速制作通讯录姓名的词库。

简单观察一下通讯录 csv 的结构就知道第一列就是姓名，解析一下文件然后将第一列弄出来。和上面的流程一直，制作一个 `luna_pinyin.contacts.dict.yaml` 文件保存这些通讯录名字，然后将该词库添加到 extended 中。部署即可生效。

## 纯文本词库

    dotnet ImeWlConverterCmd.dll -ct:pinyin -os:linux -i:word ~/Downloads/entry.csv -o:rime ./rime-.txt


## Rime 导入词库
通过扩展来导入词库，纯文本管理，


## Rime 导出词库

同步后在同步的文件夹中能找到纯文本保存的词库。
