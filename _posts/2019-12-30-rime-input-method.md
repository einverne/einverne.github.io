---
layout: post
title: "关于 Rime 输入法思考和整理"
tagline: ""
description: ""
category: 学习笔记
tags: [rime, linux, input-method, fcitx,]
last_updated:
---

很多年前写过一篇 [Rime 配置](/post/2014/11/rime.html)，这几年陆陆续续，用过搜狗，也用回过 Rime，还试过 Linux 上其他的输入法，但是最后终于在 2019 年完全的切换到 Rime 下，并且经过一系列的折腾发现 Rime 的能力远远超过我的想象。其实输入法是一个及其有依赖性的工具，输入习惯，输入的常用词等等，都累积在了输入法中。这些年输入法引入了云同步功能，但我倒是觉得带来的便利性甚至不如其带来的缺点，唯一的好处是记录输入习惯，和常用词库，但是实际上可能带来的问题更多，比如

- 隐私没有得到有效保护，有没有发现有的时候输入了某些词，可能一会儿广告就来了
- 安全问题，甚至有过报道输入法将用户输入的内容[不加密传输到服务器](https://zh.wikipedia.org/wiki/%E7%99%BE%E5%BA%A6%E8%BE%93%E5%85%A5%E6%B3%95#%E4%BA%89%E8%AE%AE)，假如真的能够拿到一个用户的输入历史记录，真的可以查到这个用户非常多的习惯，甚至有可能会泄漏用户密码等等
- 我在弃用搜狗的时候甚至不允许用户删除自己的云端词库，这一部分原本属于用户的资产，无形中变成了一个商业公司的资产


## 多输入法
就像 Rime 自己说的那样，Rime 是一个输入方案的合集。所以只要有合适的输入方案，就可以输入对应的语言，从方言，到世界其他各国的语言，Rime 都可以轻松的实现，甚至可以借助 Rime 来实现一套自己的输入编码方案，比如官网教学中的一套输入中文大写数字的输入方案，定义 schema, 字典，然后就实现了一套中文大写数字的输入法。

- [RIME 韩语方案](https://github.com/einverne/rime-hangul)
- [RIME 日语方案](https://einverne.github.io/post/2022/10/japanese-input-method-macos-rime.html)

## 安全
Rime 输入法不会联网，所有的配置都以文本的方式保存在本地，虽然一定成都上削弱了 Rime 的便捷性，但实际上就加强了 Rime 的安全性。只要保证自己的电脑安全，所有的数据都是安全的。

## 完全可配置
Rime 输入法从外观到词库，到甚至到输入方案都可以自己定制。熟悉 Rime 的机制后，完全可以使用 Git 将一整套配置管理起来。你可以使用一个输入法输入多国语言，<kbd>Ctrl</kbd> + <kbd>`</kbd> 切换 Schema，非常轻松可以实现。

### 自定义短语
输入的候选词也能够配置，

可以在 `custom_phrase.txt` 中配置：

	地平线：黎明时分	hzd	2

这样在输入法中输入 `hzd` 就可以直接出现前面的短语，只要在配置方案中配置了 custom_phrase，就可以使用。

	custom_phrase:
	  db_class: stabledb
	  dictionary: ""
	  enable_completion: false
	  enable_sentence: false
	  initial_quality: 1
	  user_dict: custom_phrase

然后在 translators 中加入该词典：

	translators:
	  - xxxxx
	  - "table_translator@custom_phrase"

### lua
如果在 macOS 上还可以添加 lua 扩展，在输入的过程中通过定制关键字，触发 lua 函数的调用，生成输入法结果返回，比如经常在输入法中输入日期，那么可以定义输入 `rq` 的时候，自动返回当前的日期。
