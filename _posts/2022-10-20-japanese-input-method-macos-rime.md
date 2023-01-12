---
layout: post
title: "日语输入法相关及 Rime 下输入日语"
aliases:
- "日语输入法相关及 Rime 下输入日语"
tagline: ""
description: ""
category: 学习笔记
tags: [ japanese, rime, input-method,  ]
create_time: 2022-10-21 11:21:19
last_updated: 2022-10-21 11:21:19
---

语言学习中最重要的就是与人交流，那么写（在互联网时代，就是输入）就变得非常重要了。这里就记录一下我使用 Rime 来输入日语的过程。

## 输入法选择

日语输入法有很多的选择，可以选择系统自带的，比如 Windows 和 macOS 都有不错的日语输入法，也可以选择收费的 [ATOK](https://www.atok.com/) 一个月需要花费几百日元，不过好处可能是可以在电脑和手机端保持一致的使用体验。

而我肯定使用 [Rime](/post/2014/11/rime.html) 输入法的，之前也整理过关于如何用 Rime 来输入韩文的 [文章](/post/2019/08/rime-korean-japanese-input-method.html) ，当时埋下的一个坑，本来想介绍一下韩文和日文在 Rime 中的使用，但日文部分因为当时不熟悉就空着了，这里正好填补一下该部分。关于我为什么选择 Rime 输入法也可以参考 [这里](/post/2019/12/rime-input-method.html) 。

而在手机上 Android 自带的 GBoard ，iOS 系统自带的输入法也支持日文，就不多说了。

简单的搜索一下就发现了比较成熟的 Rime 下的日语输入方案 ---- [Rime Japanese](https://github.com/gkovacs/rime-japanese)

简单的看了一下，这个方案使用的是 [Hepburn romanization 方案](https://en.wikipedia.org/wiki/Hepburn_romanization) ，平文式罗马字标注。
平文式罗马字是一种使用罗马字母来为日语的发音进行标注的方案

## 平假名

### 清音

按照罗马拼音正常输入，对照五十音图。

```
あ い う え お /ア イ ウ エ オ a i u e o
か き く け こ /カ キ ク ケ コ ka ki ku ke ko
さ し す せ そ /サ シ ス セ ソ sa shi su se so
た ち つ て と /タ チ ツ テ ト ta chi tsu te to
な に ぬ ね の /ナ ニ ヌ ネ ノ na ni nu ne no
は ひ ふ へ ほ /ハ ヒ フ ヘ ホ ha hi fu he ho
ま み む め も /マ ミ ム メ モ ma mi mu me mo
や ゆ よ /ヤ ユ ヨ ya yu yo
ら り る れ ろ /ラ リ ル レ ロ ra ri ru re ro
わ を /ワ ヲ wa wo
ん /ン n
```

需要注意的是其中有几个

- し 是 `shi` 而不是 si
- ち 是 `chi`
- つ 是 `tsu`

### 浊音

```
が　ぎ　ぐ　げ　ご  \ ガ　ギ　グ　ゲ　ゴ ga gi gu ge go
ざ　じ　ず　ぜ　ぞ \ ザ　ジ　ズ　ゼ　ゾ za ji zu ze zo
だ　ぢ　づ　で　ど \ ダ　ヂ　ヅ　デ　ド da di du de do
ば　び　ぶ　べ　ぼ \ バ　ビ　ブ　べ　ボ ba bi bu be bo
```

### 半浊音

```
ぱ　ぴ　ぷ　ぺ　ぽ \ パ　ピ　プ　ぺ　ポ pa pi pu pe po
```

### 拗音
拗音的输入则是要记住 `y` 的位置。

```
きゃ　きゅ　きょ  \ キャ　キュ　キョ kya kyu kyo
しゃ　しゅ　しょ \ シャ　シュ　ショ sha shu sho
ちゃ　ちゅ　ちょ \ チャ　チュ　チョ cha chu cho
にゃ　にゅ　にょ \ ニャ　ニュ　ニョ nya nyu nyo
ひゃ　ひゅ　ひょ \ ヒャ　ヒュ　ヒョ hya hyu hyo
みゃ　みゅ　みょ \ ミャ　ミュ　ミョ mya myu myo
りゃ　りゅ　りょ \ リャ　リュ　リョ rya ryu ryo
ぎゃ　ぎゅ　ぎょ \ ギャ　ギュ　ギョ gya gyu gyo
じゃ　じゅ　じょ ジャ　ジュ　ジョ ja ju jo
びゃ　びゅ　びょ ビャ　ビュ　ビョ bya byu byo
ぴゃ　ぴゅ　ぴょ ピャ　ピュ　ピョ pya pyu pyo
```

片假名转换

macOS 自带的输入法平假名和片假名切换是  F6 变成平假名，F7 变成片假名。在 Rime 里面这个方案使用的

片假名长音，按数字键 0 右方的 `-` 减号。

### 拨音输入

拨音输入 n，比如

- にほん　nihon

### 促音输入

っ(促音)双打后一个假名的罗马字发音的第一个辅音，如“ちょっと”为“chotto”。输入两次 `t` 

### 小写
小写的输入，在前面加上 `x` 或者 `_` 即可

输入字母 `_` 或 `x`+a、i、u、e、o，输入 `_a` 得到ぁ，输入 `xa` 也得到ぁ，输入 `_i` 得到ぃ。

或者在 Rime 的日文方案里面，比如日语的派对（party）

```
パーティー
```

可以直接输入 `pa-ti-`

### 两个连续的小写
在一些日语单词中会出现连续的两个小写字母，比如

```
ファックス  传真
```

这个时候输入的时候 `fakkusu`。 促音的输入是和后面的音多输入一次 `k`。

- `しゅっきん` 出勤，输入 `shukkin`

### 古语

古语假名ゐ和ゑ的输入

ゐ输入 wi ゑ输入 we

## 一些自定快捷键

- `comma/period`  用来翻页，前一页后一页

## 成果
结果

![rime japanese](/assets/screenshot-area-2022-10-21-132954.png)

## reference

- Google 开源的日语输入法 [mozc](https://github.com/google/mozc) 看起来上面的日语词库有部分就是取自于该项目
- [GitHub Rime 项目讨论日语输入法方案](https://github.com/rime/home/issues/68)
