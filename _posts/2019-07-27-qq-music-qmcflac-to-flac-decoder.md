---
layout: post
title: "QQ 音乐 qmcflac 文件解密"
aliases: "QQ 音乐 qmcflac 文件解密"
tagline: ""
description: ""
category: 学习笔记
tags: [qq-music, flac, decoder, ]
last_updated:
---

首先说重点，代码来自：

- <https://github.com/Presburger/qmc-decoder>

## Build
按照项目主页的方式 Build，生成 decoder 二进制可执行文件即可。

这个二进制可以实现 qmc0、qmc3、qmcflac 格式转换，生成普通未加密的 mp3, 或者 flac 文件。


## Result
运行

![qq music decoder](/assets/qq-music-decoder-screenshot-area-2019-07-27-095049.png)

结果

![qq music decoder result](/assets/qq-music-decoder-results-screenshot-area-2019-07-27-094151.png)

## 外延

C++ 实现的另外一个[版本](https://github.com/MegrezZhu/qmcdump)

如果熟悉 Java 也可以参考[这个项目](https://github.com/OnlyPiglet/qmcflactomp3)

如果熟悉 C# 那么可以看看这个[项目](https://github.com/Ras0N/QMCTrans)
