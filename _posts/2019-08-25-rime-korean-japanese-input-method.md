---
layout: post
title: "Rime 配置使用韩语及日语输入法"
tagline: ""
description: ""
category: 经验总结
tags: [rime, hangul, korean, japanese, input-method, open-source,]
last_updated:
---

总结一些 Rime 下韩语输入方案。

## 韩语输入方案
韩文字母输入键盘布局有 Dubeolsik(두벌식, 2-set)， Sebeolsik Final (세벌식 최종, 3-set) , Sebeolsik 390, Sebeolsik Noshift

### 두벌식
简称 2-set, 这可能是使用最为广泛的一种键盘布局了，南韩从 1969 年起就开始使用。该键盘布局非常有特点，辅音 Consonants 在左边，元音 vowels 在右边。所以能非常轻松地做到左右开工。

![Dubeolsik](/assets/hangul-keyboard-layout/KB_South_Korea.svg)

标准的 2-set 键盘布局已经成为了主流标准，在如今的移动设备中这个键盘布局也已经称为了事实标准。

对于这个键盘布局，突出的特点就是左右子音和母音的划分。具体的使用可以参考[这篇文档](/assets/hangul-keyboard-layout/Hangeul_keyboard.pdf).

而对于这个键盘布局 Rime 的方案可以参考[这里](https://github.com/einverne/rime-hangul)

韩文键盘布局：A=ㅁ，B=ㅠ，C=ㅊ，D=ㅇ，E=ㄷㄸ，F=ㄹ，G=ㅎ，H=ㅗ，I=ㅑ，J=ㅓ，K=ㅏ，L=ㅣ，M=ㅡ，N=ㅜ，O=ㅐㅒ，P=ㅔㅖ，Q=ㅂㅃ，R=ㄱ ㄲ，S=ㄴ，T=ㅅㅆ，U=ㅕ，V=ㅍ，W=ㅈㅉ，X=ㅌ，Y=ㅛ，Z=ㅋ
要打出紧音只需要按住 shift 在按相应的松音键就可以了，比如按 Q 键显示ㅂ，按住 shift 再按 Q 就会打出ㅃ。

左手辅音、右手元音


紧音指的是ㄲ/ㄸ/ㅃ/ㅆ/ㅉ 五个音

ㄲ ：shift + ㄱ
ㄸ： shift +ㄷ
ㅃ： shift +ㅂ
ㅆ： shift +ㅅ
ㅉ： shift +ㅈ


### 세벌식 390
Sebeolsik 390 (세벌식 390; 3-set 390) 发布于 1990 年，它基于 Dr. Kong Byung Woo 早期的工作，这个键盘布局充分利用了 QWERTY 键盘的空间，四行键盘都布满了韩文元音与辅音，所以数字被挤压到右手边三行。按照音节划分，Syllable-initial（起始音节）部分在右边绿色部分，syllable-final（结束音节）部分在左边红色部分。
Wiki 上称该布局更加 ergonomic （符合人体工程学）但是这个键盘布局并没有广为接受。

![Sebeolsik 3-set 390](/assets/hangul-keyboard-layout/KB_Sebeolsik_390.svg)


### 세벌식 최종
Sebeolsik Final (세벌식 최종; 3-set Final) 这是上一个布局的最终成果，和上一布局的区别在于数字布局变成了两行，并且所有的音节都在键盘中，不需要额外按键既可以输入所有音节。和 390 布局一样，起始音节在右边，结束音节在左边。虽然该布局经过了精心设计不过依然没有被广泛接受。

![Sebeolsik 3-set final](/assets/hangul-keyboard-layout/KB_Sebeolsik_Final.svg)

### Sebeolsik Noshift
最后还有中 Noshift 布局，设计的目的就是不需要 Shift 使用，对一些无法同时按住两个键的残疾人该键盘有一定优势。

![Sebeolsik Noshift](/assets/hangul-keyboard-layout/KB_Sebeolsik_NoShift.svg)

当然如果要了解其他布局，韩语的键盘布局还有[这么这么多](https://commons.wikimedia.org/wiki/Category:Korean_keyboard_layouts)


### GongjinCheong Romaja 输入法
这是遵循韩文罗马化标准 GongjinCheong 的输入法。

![GongjinCheong Romaja](/assets/hangul-keyboard-layout/gongjincheong-romaja.png)

GongjinCheong 和下方的 HNC 有些许的差异。

### HNC Romaji 输入法
这一套输入法其实遵循着 McCune-Reischauer Romanization 罗马化方案，是西方世界最早将韩文罗马化的方案。也是目前非常流行的韩文转写方案。[^1][^2]

![HNC Romaja](/assets/hangul-keyboard-layout/hnc-romaja.png)

[^1]: <https://en.wikipedia.org/wiki/McCune–Reischauer>
[^2]: <https://www.library.illinois.edu/ias/koreancollection/koreanromanizationtable/>

单母音 모은

```
ㅣ i	ㅡ w
ㅏ a	ㅜ u	ㅓ e	ㅗ o
ㅑ ya	ㅠ yu	ㅕ ye	ㅛ yo
```


双母音

```
		ㅐ ai	ㅔ ei
		ㅒ yai	ㅖ yei
ㅘ oa	ㅙ oai	ㅚ oi
ㅝ uo	ㅞ uei	ㅟ ui
			ㅢ wi
```


单子音 자은

```
ㄱ g	ㅋ k	ㄴ n
ㄷ d	ㅌ t	ㄹ r/l
ㅂ b	ㅍ p	ㅁ m
ㅅ s	ㅈ j	ㅊ c
ㅇ x	ㅎ h
```

双子音

```
ㄲ gg	ㄸ dd	ㅃ bb	ㅆ ss	ㅉ jj
```

### Rime hangyl
Rime 的韩语转写方案非以上提交的任何标准，不过最像后面两种罗马化方案，有一些微小的差别，但是却非常的好用。

和 HNC 的主要差别在于 w 和 y 的差异，在 HNC 键盘中 w 是 `ㅡ` 而 Rime 方案中则是 `ㅜ` ，而另外一个 y ，HNC 是 `ㅣ` ， Rime 的方案则是 `ㅡ`，实际使用上来看 ，而二者区别几乎可以忽略不计。

![rime hangyl](/assets/hangul-keyboard-layout/rime-hangyl.png)

Rime 解决方案： <https://github.com/einverne/rime-hangul>

### 韩语打字练习

韩语打字练习推荐

- <https://www.koreanji.com/study/korean-language/hangeul/how-to-type-hangeul/>
- <https://10fastfingers.com/typing-test/korean>
- <http://play.typeracer.com/?universe=lang_ko>
- <http://www.tajamaster.com>

- 韩语 <https://github.com/lotem/rime-aca-archives>
- 古韩语 <https://github.com/biopolyhedron/rime-qyeyshanglr-hanja>


## 日语输入方案

- <https://github.com/lotem/rime-kana>
- <https://github.com/biopolyhedron/rime-jap-poly>

## reference

- <https://github.com/einverne/rime-hangul>
- <https://support.apple.com/en-in/guide/korean-input-method/welcome/mac>
- <https://guides.mtholyoke.edu/c.php?g=102012&p=663147>
- <http://blog.klerelo.com/2014/08/mac-comment-ecrire-en-coreen-avec-son.html>
- <http://deltazone.pixnet.net/blog/post/341170670-rime%e8%a8%ad%e5%ae%9a%e6%aa%94-%e9%9f%93%e8%aa%9e>
- 陈辉：韩语罗马字表记法的历史与现状
