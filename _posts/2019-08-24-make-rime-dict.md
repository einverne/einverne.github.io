---
layout: post
title: "制作 Rime 词库"
tagline: ""
description: ""
category: 学习笔记
tags: [rime, Rime, 词库 , 小狼毫 , 中州韵 ,]
last_updated:
---

之前就写过文章介绍这款跨平台的开源输入解决方案 [Rime](/post/2014/11/Rime.html)，所有的配置以及同步方法都在之前的文章中有介绍。这篇文章主要介绍如何制作 Rime 的扩展词库。虽然目前网上也有一些非常不错的词库，但是很多内容还是需要自己慢慢培养的。


## 词库转换工具

从 2.4 版本起支持加密的搜狗词库了，直接导出搜狗词库，然后转成 Rime 的格式即可。

- <https://github.com/studyzy/imewlconverter/releases>


## 繁简转换
安装 opencc 繁简转换工具

	sudo apt install opencc

然后运行装换

	opencc -i source.txt -o dest.txt


luna_pinyin.mywords.dict.yaml

	---
	name: luna_pinyin.mywords
	version: "0.0.1"
	use_preset_vocabulary: true


然后找到 `luna_pinyin.extended.dict.yaml`，打开文件导入新的词库

	import_tables:
	  - luna_pinyin.mywords
	-
	-
## Rime 导入词库



rime_dict_manager

## Rime 导出词库


