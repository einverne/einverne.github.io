---
layout: post
title: "利用 macOS 的 LiveText 轻松复制视频文字实现观看韩综"
aliases:
- "利用 macOS 的 LiveText 轻松复制视频文字实现观看韩综"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, macos-app, macos-feature, copy-text, video-text ]
create_time: 2024-09-07 09:34:23
last_updated: 2024-09-07 09:34:23
dg-home: false
dg-publish: false
---

前两天我录制了一期视频讲述如何通过 MemoAI 这样的语音转文字的应用来自动通过音频转写文字，然后变成字幕来观看韩综《思想验证区域：The community》，其实那一期视频主要是为了介绍软件应用的，所以就以我正在观看的韩综做了一个例子，但是其实制作字幕的时候我也知道，这一个综艺比较特殊，因为其中有很长的一段「讨论」，里面的参与者是通过匿名在线聊天室的方式录制的，所以整个综艺会有相当长的一段时间是没有人说话，而是大家都在打字进行辩论的！那么语音转文字就变得鸡肋了。所以这个地方字幕组也是非常辛苦，需要将视频中的字幕一个个取出来然后进行翻译叠加到视频里面。

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=113082563101475&bvid=BV1YjpTeREGs&cid=25743984325&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

但是这个综艺现在基本没有什么字幕组在做字幕，现在有的一个被抛弃字幕组出的速度也比较慢，所以如果要自己看后面的内容，如果不懂韩语那就必须等着，但是如果稍微懂一些韩语，我这里就教大家一个方法，如何复制视频中的文字，通过既有的免费翻译软件，比如 Papago，Google Translate，DeepL 等来实现看剧自由。

## 前提条件

首先需要一台 Mac 电脑，macOS 系统版本需要在 Ventura 之上（Ventura，Sonoma），也就是需要在 13 或 14 版本。

Apple 在 Monterey（12 版本） 中引入了 [Live Text](https://support.apple.com/en-us/120004)，用户可以轻松地复制，翻译，查找静态照片中的文本，并且在 macOS Ventura 中，将这个功能扩展到了视频中。用户可以直接在视频中对文字进行复制。

但是这个功能有一些限制：

- Live Text 的功能只限于系统自带的应用，比如 QuickTime，Photos 和 Safari
- 只能从暂停的视频帧中复制文本
- 复制的文本不带有任何格式

## 如何使用 macOS 上的 Live Text

对于照片中的 Live Text，这里就不展开说明了，只需要长按照片中的文字，iOS 就会自动识别内容，可以复制，翻译等等操作。

比如下面的图片中，我长按图片中的文字，就可以直接选中文字。

![UCZZXcEFYe](https://pic.einverne.info/images/UCZZXcEFYe.jpeg)

### 复制视频中的文字

在 Mac 上要复制视频中的文字需要按照如下的步骤完成：

- 使用 QuickTime Player 打开
- 暂停视频
- 将鼠标悬浮在要复制的文字上，直到光标变成文本选择模式
- 单击并拖动光标以突出显示要复制的文本
- 按住 Control 或者右击高亮的文本，选择复制
- 这样文本内容就已经被复制到粘贴版中了
- 打开 Papago，粘贴文本

![aItRjVsqtF](https://pic.einverne.info/images/aItRjVsqtF.png)

或者，可以选择视频右下角很小的 Live Text 的图标，然后系统会自动高亮显示所有的文字，选择要复制的文本，或者选择全部复制，就可以将视频中的所有文本复制到粘贴板中。

获取到文字之后，就可以使用自己顺手的翻译工具进行翻译了，个人经过很多的尝试之后发现韩语翻译，还是韩国人自己做的 Papago 翻译得比较易于理解。

![LK_wlm4UQp](https://pic.einverne.info/images/LK_wlm4UQp.png)

比如翻译

```
만약 굉장히 잔인한 백인 사이코패스 범죄자를 다룬 영화라면,
그것이 도덕적으로 옳지 않다고 규제할 수 있을까요?
```

![N2Uf2KUbdQ](https://pic.einverne.info/images/N2Uf2KUbdQ.png)

或者使用 Easydict 批量翻译。

![LhTIIXQ6om](https://pic.einverne.info/images/LhTIIXQ6om.png)

通过这样的方式，即使是 Papago 翻译的存在歧义，通过这一些翻译工具的交叉对比，大致的语义也能够理解了。
