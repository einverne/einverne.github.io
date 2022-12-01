---
layout: post
title: "字幕编辑软件 Aegisub 简单使用"
aliases:
- "字幕编辑软件 Aegisub 简单使用"
tagline: ""
description: ""
category: 经验总结
tags: [ aegisub, subtitle, fansub, 字幕组 , 字幕 ]
create_time: 2022-08-01 22:42:18
last_updated: 2022-08-01 22:42:18
---

前段时间非常感兴趣字幕制作，起因是因为现在已经逐渐可以脱离字幕来看韩影，而有些时候在一些国外的网站上能到制作非常精良的英文字幕，马来西亚字幕，日语字幕，但唯独缺少了中文字幕，想来一方面版权制作方也并没有在华语地区发行也没有制作中文字幕的必要，另一方面国内的字幕组大部分只会发布硬字幕压制的影片，并且随着这两年借口版权法对字幕组的打击，大量的字幕组都转到地下，曾经一度非常辉煌的人人字幕（美剧），猪猪字幕组（日剧，日影，日综），TSKS（韩剧，韩影，韩综），要不就是关站，要不就是解散，更甚至字幕组的运营人员都被判刑。但在没有完善版权法保护，并且又没有完善的方式引进优秀外国作品的当下，字幕组成为了大量中国人了解外国文化的唯一入口。所以在过去的很多年里在内心还是非常感激这些无私的字幕组的。 在这样的背景下，一方面本着学习的态度，另一方面想了解一下字幕组的运行方式，于是就花了一点时间了解了一下字幕制作的完整过程。

字幕格式和字幕制作工具还是挺多的，这里就直接介绍我调研过程中发现的 [[Aegisub]]，完全符合我对软件选择的所有要求，开源，跨平台，并且可以支持非常多的字幕格式，虽然有点丑，但好在功能强大。

Aegisub 是一款开源、跨平台的开源字幕编辑软件。它可以轻松、高效地完成时间轴的制作，并利用内置的各种实用工具来调整字幕的样式，还可以进行实时的视频预览。

- 官网：<https://aegi.vmoe.info/>
- GitHub: <https://github.com/Aegisub/Aegisub>

支持的字幕文件格式有：

- ass
- ssa
- srt
- ttxt
- sub

## 字幕制作过程
如果只有单纯视频，那么需要经过

- 打轴，将字幕出现的时间标注出来
- 听写，将音频内容打到时间轴上
- 翻译，将字幕内容翻译到目标语言
- 校对
- 导出

如果是基于其他语言的字幕，那么就可以节省打轴和听写的步骤，直接进行翻译了。

## 界面
导入视频后界面如下：

![aegisub ui](https://photo.einverne.info/images/2022/08/01/zq1W.png)

## 音频
在 Audio 菜单中可以选择，频谱或者波形，根据个人爱好选择。

推荐开启音频下方的：

- Automatically commit all changes
- Automatically go to next line on commit
- Auto scroll audio display to select file

## 打时间轴
在音频轨道上使用鼠标左键选择一段内容，红色线条为开始，蓝色为结束。还可以使用左键点击标记开始，右键点击表示标记结束。这样就生成了一个红线和蓝线框住的区域。

可以使用「空格」来预览选中的音频。

- Q 键，开始前 500 ms
- W 键，播放结尾后 500 ms
- S 键，播放区域内音频
- D 键，播放结尾前 500ms，确认所有声音
- G 键，提交轴
- A/F 移动音频
- Z/X 上一个/下一个时间段

一般开头贴近音频，但是结尾一般留长 100 ~ 300 ms，避免说完话，字幕立即消失的情况。

一般小于 500ms 的句子，也会拉长至 500 ms

最后保存成 ass 格式。

打时间轴是一个非常重复的体力劳动，所以还有一些自动化的工具。

- [[Subtitle Edit]] 是一个 C# 编写的开源字幕编辑器，其自带一个自动生成时间轴的功能，可以使用 Subtitle Edit 自动生成时间轴，然后导出成 srt 导入到 Aegisub 来调整编辑。
- [autosub](https://github.com/BingLingGroup/autosub) 是一个 Python 编写的命令行工具，可以用来从音频视频中生成字幕，[[autosub]] 甚至可以调用外部语音识别接口自动识别音频内容生成字幕文件，或者调用翻译接口来生成对应语言的字幕。

## 相关脚本
字幕渲染的插件 [VSFilter](https://github.com/qwe7989199/aegisub_scripts/releases)

## 压制
在字幕制作完成之后，可以通过很多方式将字幕压制到视频内容中，因为本文的主角是 Aegisub ，所以压制的内容等有机会再分享。压制也是一门大学问。

## Aegisub 的不同版本
因为官方版本已经很久没有更新，所以有爱好者自行维护发布了一些版本。

- [wangqr 制作的版本](https://github.com/wangqr/Aegisub)

## 版权
最后来聊一聊「字幕」的版权。

如果宽泛地讲，制作，发布和使用电影字幕都是违法的，都是侵犯版权的行为。

电影是有版权的 ( [17 U.S. Code § 102(a)](https://www.law.cornell.edu/uscode/text/17/102) )

 [17 U.S. Code § 106(2)](https://www.law.cornell.edu/uscode/text/17/106) 给予了版权所有者独占的权利，以及授权基于版权物的衍生品的独占权利。

 [17 U.S. Code § 101](https://www.law.cornell.edu/uscode/text/17/101) 定义了什么是衍生品（derivative work）

> a work **based upon** one or more preexisting works, such as a **translation**, musical arrangement, dramatization, fictionalization, motion picture version, sound recording, art reproduction, abridgment, condensation, or any other form in which a work may be recast, transformed, or adapted....

所以我们可以看到版权所有者拥有对授权翻译的独占权利。但这个独占的权利受到 fair use 的限制 ( [17 U.S. Code § 107](https://www.law.cornell.edu/uscode/text/17/107) ):

> criticism, comment, news reporting, teaching (including multiple copies for classroom use), scholarship, or research

如果这些字幕文件不是 fair use 目的（比如引述）那么这些翻译内容就是侵权的。

107 项提供了如下的方法判断是否是 fair use[^1]

[^1]: <https://law.stackexchange.com/a/3582/47086>

> (1) the purpose and character of the use, including whether such use is of a commercial nature or is for nonprofit educational purposes;
> (2) the nature of the copyrighted work;
> (3) the amount and substantiality of the portion used in relation to the copyrighted work as a whole; and
> (4) the effect of the use upon the potential market for or value of the copyrighted work.



## 其他工具

- [[Subtitle Edit]]
- [[Arctime Pro]]
- [pyTranscriber](https://github.com/raryelcostasouza/pyTranscriber) 调用 Google 语音识别文字。
