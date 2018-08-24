---
layout: post
title: "Linux 下超好用字典 GoldenDict"
tagline: ""
description: ""
category: 经验总结
tags: [dict, linux, goldendict, youdao, dictionary, free-dictionary, offline-dictionary, ]
last_updated:
---

最近在使用 Linux 版有道的时候发现非常卡，影响正常使用，所以就发现了这个 GoldenDict。以前在 Win 下用过 [lingoes](http://www.lingoes.cn/) 但是无奈只有 Win 版本。

GoldenDict 是一种开源词典，它像 Eudict、Mdict、Lingoes 以及 BlueDict 等词典一样可以加载外挂词典文件。基于 GNU GPL  第三版以上协议。

## 安装

    sudo apt install goldendict

- For linux: https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Linux-Portable
- For Mac OS X : https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Mac-OS-X
- For Windows: https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Windows

## 功能特色

支持的字典格式

- Babylon .BGL files, Babylon（巴比伦）词典的 .BGL 格式文件，完整保留全部图片及其他资源
- StarDict .ifo/.dict./.idx/.syn dictionaries StarDict（星际译王）
- MDict .mdd and .mdx 文件，mdd 文件是音频图片部分，mdx 是索引
- Dictd .index/.dict(.dz) dictionary files
- ABBYY Lingvo .dsl 源文件，together with abbreviations. The files can be optionally compressed with dictzip. Dictionary resources can be packed together into a .zip file.
- ABBYY Lingvo .lsa/.dat 格式音频档案 . Those can be indexed separately, or be referred to from .dsl files.
- Lingoes 灵格斯词霸 .ld2 这里需要指出来的是 ld2 格式只有移动版 Android 才支持


更多支持的格式可以参考[这里](https://github.com/goldendict/goldendict/wiki/Supported-Dictionary-Formats)

其他功能特色

- 支持 Windows, Linux, Mac, Android，Android 版是[商业软件](https://play.google.com/store/apps/details?id=mobi.goldendict.android)，免费版最多能用 5 本词典，支持分享查词。
- 完美支持单词复数，ing 形式等变形（软件设置中 morphology）
- 支持查阅 Wikipedia、Wikitionary 及任何其他基于 Mediawiki 的站点。
- 支持使用模板化的 Url 样式来使用任何网页。
- 支持查找与收听 forvo.com 网站上面的发音。
- 基于 hunspell 的词法系统，用于词语的溯源及拼法建议。
- 能够索引任意路径下面的音频文件以查找语音。
- 弹出搜索功能：一个小窗口会弹出，用于显示在另一程序中选中的单词的词义。
- 支持全局热键，可在任何一点触发该程序，或直接从剪切板中查找词义。

## 字典安装

### 在线字典
有道的源

    http://dict.youdao.com/search?q=%GDWORD%&ue=utf8

Bing 中文的源

    https://cn.bing.com/dict/search?q=%GDWORD%

iciba

    http://www.iciba.com/%GDWORD%/

zdic

    http://www.zdic.net/sousuo/?q=%GDWORD%

### 离线字典

#### 简明英汉字典增强版
收录 324 万词条，如果只是单纯的想要划词翻译，并不是那么在意英语学习，而只想要快速获知单词含义，这本字典足矣。不管是单词还是短语，这本词典收录非常详细。

- <https://github.com/skywind3000/ECDICT/wiki/%E7%AE%80%E6%98%8E%E8%8B%B1%E6%B1%89%E5%AD%97%E5%85%B8%E5%A2%9E%E5%BC%BA%E7%89%88>


#### 21 世纪英汉汉英双向词典

#### Longman Dictionary of Contemporary English 5th Edition （朗文当代高级英语辞典第五版） 五星推荐
记得当时上学的时候，隔壁寝室英语专业的学长唯一给我推荐的字典就是朗文当代（LDOCE5），后来渐渐的才了解到，这本英英词典收录单词量最大，例句最多，搭配和用法也最全。

![longman dictionary](/assets/longman-dictionary-of-contemporary-english-screenshot-window-2018-08-22-075104.png)

词典给出了每个单词的音标以及英式和美式发音，单词的各种变形，单词出现时间，同时还有单词的词源。同时它会列出每个词条的英文解释和各种搭配例句，甚至这本朗文当代连例句的音频也有，并且不是那种合成的机械式发音，而是真人原声，非常自然。

朗文当代还有一个实用功能就是：**COLLOCATIONS**，也就是单词搭配

![longman dictionary collocations](/assets/longman-dictionary-COLLOCATIONS-2018-08-22-080150.png)

比如一些简单的单词，可能平时知道解释，但是并不了解一些搭配使用，这个功能让学习单词更上了一层。比如说上图中，`development` 组合，前面加形容词，动词，后面可以接名词。

词典另外一个实用功能就是：**THESAURUS**，也就是同类词典，朗文当代会列举出当前单词同类的其他单词，比如 `walk`

- **walk** to move forward by putting one foot in front of the other
- **wander** to walk without any clear purpose or direction
- **stride** to walk with long steps in a determined, confident, or angry way
- **pace** to walk first in one direction and then in another many times, especially because you are nervous
- **march** to walk quickly with firm regular steps – used especially about soldiers or someone who is angry
- **wade** to walk through deep water
- **stomp** to walk putting your feet down very hard, especially because you are angry

这些单词都有“行走”的意思，但是看到英文解释就会发现，每个单词都有细微的区别，"wander"是“漫无目的的走”，"stride"是“大踏步走”，"pace" 是“踱步走”。


#### Macmillan English Dictionary for Advanced Learners （麦克米伦高阶英语词典 第二版）
《麦克米伦高阶英语词典》是针对高阶英语学习者推出的学习型字典，有如下特点

- 采用星号标注词频，使用一、二、三个不等的星号来标示其使用频率的高低（一二三星词汇加起来一共有 7500 个，三星词汇出现频率最高，一星最少）
- 另外字典带有大量的短语搭配，每个词条相应都会列出常用的短语搭配
- 另外有发音和同义词，但是他的同义词不像朗文当代会单独列出一个小篇幅介绍，而是穿插在单词的释义下面。

![macmillan english dictionary](/assets/macmillan-english-dictionary-2018-08-22-202845.png)

#### Oxford Advanced Learner's English-Chinese Dictionary 8th Edition （牛津高阶英汉双解）
牛津高阶应该是我最熟悉的一本字典了，从高中起老师推荐，基本算是人手一本的必备词典。不知道在别的地方教学用字典是什么，反正在我看来即使到了大学当时的牛津高阶英汉词典也是非常常见，那个大红色的封面，至今记忆犹新。

这本字典和其他字典比较起来就显得非常贴近中文为母语的英语学习者了。英语解释和汉语解释都很详细。包括习语，搭配，同义等等也都有。这里就是牛津词典和其他词典不同的地方了，在牛津的版本中会出现 `IDM`，是 idiom，表示的是习语，习惯用法，`SYN` 是 synonym 也就是同义，对于一般的单词牛津词典都会单独把这些列出来。其他常见的标志

- `PHR V` 是 phrase verb 动词短语
- `AW` 学术单词

其他的非常用的就去看字典的说明吧

![oxford advanced learner's English-Chinese Dictionary 8th](/assets/oxford-advanced-learners-english-chinese-dictionary-2018-08-24-091127.png)

#### Collins Cobuild Advanced Learner's English Dictionary （柯林斯高阶英英词典）

柯林斯字典有两个特点

- 采用英文整句释义来解释单词
- 用五颗星来标记词频

柯林斯词典有一个高达 2.5 亿的语料库，从语料库中筛选出了最常用的 14600 词用五星标注。其中五星（最常用词，以下逐级次之）680 词，四星 1040 词（累计 1720 词），三星 1580 词（累计 3300 词），二星 3200 词（累计 6500 词），一星 8100 词（累计 14600 词）。根据语料库的统计结果，掌握五级四级的前 1720 詞，就可以读通英语资料的 75%，掌握五、四、三、二级的 6500 词，就可以读通英语资料的 90%，掌握这 14600 词，就可以读懂任何英语资料的 95%，即从理论上说，任何一篇 100 词的文章里大概只有 5 个词不认识。

#### Cambridge Advanced Learner’s Dictionary （剑桥高阶英语学习词典）
剑桥高阶英语学习词典（又称 CALD），它以剑桥国际英语语料库（CIC）中逾 7 亿词条为蓝本，并参考了剑桥英语学习者语料库（CLC）中剑桥测试系统的原始语料，收词量和词条搭配量都非常巨大。这本词典的收词量很大，而且带有大量的短语。对于每个单词，词典中都会给出英式和美式的音标以及发音。

#### Merriam-Webster's Advanced Learner's English Dictionary （韦氏高阶英语词典）
《韦氏高阶英语词典》是美系品牌，因此收录了较多的美式常用惯用语以及动词搭配。词典最大的特点是：例句超级多。这本词典据说收录了 160,000 个例句，号称是市面上所有英语学习字典中收录例句最多者。韦氏不仅收录例句多，对于比较难的例句，它还会贴心地在例句后面附带上一句通俗版的解释，从为学习者考虑这一点来说，这是我见过的最有诚意的一本词典了。

如果你喜欢看大量的例句，喜欢通过例句来记单词，那么这本词典会是你最好的选择。

#### Merriam-Webster's Collegiate Dictionary （韦氏大学辞典）
与上面提到的几本学习型词典不同，这本词典是母语词典，其使用对象是英语母语人士，有点类似与汉语中的《新华词典》。韦氏大学辞典释义的用词难度也比学习型词典高上不止一个等级，而且一般没有例句。我们可以对比一下"melancholy"在柯林斯和韦氏大学词典中的解释：an abnormal state attributed to an excess of black bile and characterized by irascibility or depression

black bile 是什么？irascibility 又是什么？ 如果词汇量太低的话你会发现查个单词结果连释义都看不懂。这种母语词典最大的优点是释义精准且全面，收词量巨大，缺点是释义用词难度没有上限，对初学者来说难度太高，容易打击自信心。建议将韦氏大学辞典与其他学习型词典一起搭配使用，互为补充，不建议单独使用。

#### Vocabulary.com
这本词典来源于单词学习网站 http://Vocabulary.com ，它是一本能让你感觉到是在“学单词”而不是在“记单词”的词典，比如词典会采用口语化举例子的形式来让你理解单词的意思，用法和来源，让你学以致用。

#### Longman Language Activator （朗文英语联想活用词典）
《英语联想活用词典》是一本学习型字典，也是一本同义词词典，它的主要排版形式如下

![longman language activator](/assets/longman-language-activator-2018-08-23-080631.png)

联想词活用词典，是 Thesaurus （同义词典） 的进一步细化，将同义的单词和词组进一步展开说明的词典，被称为联想词，也就意味着这本词典并不止索引了同义词，相关联的单词都会在 RELATED 中显示。这本字典是全英字典，适合学习英语到一定程度，想要进一步学习同义词用法的英语学习者。

比如上图中索引的是 love，相关的单词中有反义词 hate，有同义的 like，还有联想的 sex，relationship，boyfriend/girlfriend， marry，obsession 等等，这是一本值得用来读的字典。

#### Collins Thesaurus （柯林斯同义词词典）
与上面的学习型词典不同，柯林斯同义词词典是一本工具词典。它能够列出常用词条的同义词。我们可以使用它来扩大词汇量，丰富写作用词。举个例子，表示寒冷最简单的可以用"cold"，但我们还可以有更多选择，查一查词典，它会告诉你还可以用 "chilly, arctic, bleak, cool, freezing, frigid, frosty, frozen, icy, wintry" 这些词。


#### USE THE RIGHT WORD
上面的 Collins Thesaurus 是同义词词典，而这本 `USE THE RIGHT WORD` 则是同义词辨析词典。

其实即使是同义词，它们的意思也往往是有细微差别的。小学的时候你一定学过 “安静”和“宁静”这两个词，我们可以说“上课铃响了，教室里逐渐安静下来”，却没有人说“上课铃响了，教室里逐渐宁静下来”，这就是词与词之间的区别。

英语中也是如此，比如"disaster"和"catastrophe" 都能表示“灾难”，但两者是有区别的，"disaster"更加强调灾难已经形成的事实，而"catastrophe"是强调灾难本身，所以才有这样一个句子 "They were glad they had survived the catastrophe and had met with no disaster."

而 USE THE RIGHT WORD 就是一本能告诉你单词之间细微区别的词典。将它装载到手机词典中，查单词时顺便看看相应的同义词辨析，这样能不断提高你对单词的敏感度。

![no two words means exactly same thing](/assets/no-two-words-mean-exactly-the-same-thing.jpg)

下面是词典截图，收录单词不是很多，但是解释比较多。

![use the right word](/assets/use-the-right-word-2018-08-22-205833.png)

#### WordNet 3.0


- <http://goldendict.org/screenshots.php?show=wordnet#pic>
- 下载地址 <https://sourceforge.net/projects/goldendict/files/dictionaries/>

#### English Etymology
这是一本英语词源字典，比较简单，排版也比较简陋。对于单词由来比较关注的学习者可以备一份。

#### 简单韩语字典

![korean dictionary](/assets/korean-dictionary-2018-08-21-083443.png)


### 其他字典
首推 pdawiki，这个论坛上有非常多精美的字典，不过要求门槛比较高，新人一般很难下载到这些离线的字典。

- <https://www.pdawiki.com/forum/forum.php>

goldendict 官网给出的字典

- <http://goldendict.org/dictionaries.php>

解压后，在词典 - 文件添加路径即可

- <http://download.huzheng.org/zh_CN/>

胡正网站给出了非常多语言的字典

babylon 免费的字典

- <http://www.babylon-software.com/free-dictionaries/>

### 字典相关
引进词典又分为英系和美系两大类，目前英系词典占据中国市场的主导地位，著名的品牌如牛津、朗文、剑桥、麦克米伦、柯林斯，简称“牛朗剑麦柯”（谐音“牛郎见迈克”）合称“英国五虎”。

美系词典主要有《美国传统词典》（The American Heritage Dictionary) 和“韦氏词典”两大品牌，而实际上“韦氏”在这里是一个复数名词，在美国有众多出版社都出过冠以“韦氏”名号的词典，之所以造成今天“鱼龙混杂”的局面，是因为韦伯斯特最初编撰“韦氏词典”是早在距今 200 年前的 19 世纪初，根据美国法律，“韦氏”作为未经注册的商标早已超出了知识产权的保护期进入公共出版领域，所以今天变成一个共享品牌。对于中国读者而言，最熟悉的“韦氏”主要有两家，一个就是正宗的“韦伯斯特”，由老东家麦瑞安—韦伯斯特出版公司出版，旗舰品牌 Webster Third New International Dictionary，但普通读者（特别是准备雅思和 GRE 的同学）更熟悉的是该社各形各色的韦氏原版小词典，被大家戏称之曰“韦小宝”。麦瑞安—韦伯斯特于 08 年底推出第一部学习型词典 Webster Advanced Learner's Dictionary，可惜尚未听说那家出版社引进该词典的版权；另一个就是美国鼎鼎大名的兰登书屋所出版的“韦氏词典”系列，现在兰登在所出“韦氏”前面一般都冠以“兰登书屋”的名目，一看便知，不会混淆，如商务 97 年引进出版的《蓝登书屋韦氏英汉大学词典》（Random House Webster's Colledge Dictionary），外研社 06 年引进出版的《韦氏高阶英汉双解美语词典》（Random House Webster’s Dictionary of American English）。在英系美系两大类别之外，有一本词典我要特别提一下，外研社《英汉多功能词典》，这是一本日系词典，原书是日本人编给日本人学英语用的…… 说到这里，实际上今天大名鼎鼎的 OALD 最初就是霍恩比 (A S Hornby) 教授执教日本期间所编写的一部针对非母语人士（主要是以日本人为代表的亚洲读者）的学习型词典《现代英语学习词典》(A Learner's Dictionary of Current English)……在英美两系之外，另有一本日系词典值得特别提一下，即外研社《英汉多功能词典》（A Multifunction English-Chinese Dictionary），日文原版（E-Gate English-Japanese Dictionary）由田中茂范主编。



## 词形匹配
GoldenDict 默认情况下，比如屏幕取词获取 “stores” 默认是没有结果的，但是其实并不是 GoldenDict 的问题，只需要导入构词法规则库就能够让 GoldenDict 自动判断复数从而进行查词。

下载英语构词法规则库：

然后在 `编辑 ->词典 ->词典来源 ->构词法规则库` 中设置规则目录，在我的电脑上是 `/usr/share/myspell/dicts` ，当然也可以将下载的文件拷贝到该目录中记载即可。


## 对比
GoldenDict 和其他可选字典的对比

在 [stardict](http://stardict.sourceforge.net/) 被移除的 Sourceforge 页面上给出了一系列的 Alternative 选择

功能                | GoldenDict         | Babiloo              | LightLang         | Lingoes               | Dicto
--------------------|--------------------|----------------------|-------------------|-----------------------|----------------------------
链接                | https://github.com/goldendict/goldendict | https://code.google.com/archive/p/babiloo/ 已停止 | https://code.google.com/archive/p/lightlang/ 已停止开发 | http://www.lingoes.net/ | http://dicto.org.ru/
支持格式 | 特别多，见上文 | SDictionary, and StarDict formats | 俄语 | 私有格式 | XDXF dictionaries
平台     | GUN/Linux, Mac, Windows, Android | Linux, Windows, Mac | Linux only | Windows only | Windows only
特色功能 | 见上文 | 已停止维护 略 | 已停止维护略 | 轻便简洁，但是有广告 | 只面向俄语 略
License  | GNU GPLv3+ | GPL v3 | GPL v2 |


## 其他编程资源
使用 stardict-tools 可以将 stardict 格式的字典转变成可读的格式

    sudo apt-get install stardict-tools
    # 工具安装之后会在 `/usr/lib/stardict-tools/` 目录下

一个将各种字典文件转变格式的脚本

- <https://github.com/ilius/pyglossary>

一个使用 Python 编写的生成 .mdx 文件的脚本

- <https://github.com/zhansliu/writemdict>

一份关于 MDD 和 MDX 文件格式的分析

- <https://bitbucket.org/xwang/mdict-analysis>

wikipedia 的离线包，很大，好几十个 G

- <http://wiki.kiwix.org/wiki/Main_Page>

## reference

- <http://goldendict.org/>
- Source Code <https://github.com/goldendict/goldendict>
- SourceForge <https://sourceforge.net/projects/goldendict/files/>
- <https://blog.yuanbin.me/posts/2013-01/2013-01-31_23-07-00/>
- <http://forum.ubuntu.org.cn/viewtopic.php?f=95&t=265588>
- lingoes 词典 <http://www.lingoes.cn/zh/dictionary/index.html>
- <https://xinyo.org/archives/61412/> 朗文 5、韦伯 11、牛津 8（均含发音）词典包
- <https://www.cnblogs.com/oucbl/p/6839493.html>
- 字典推荐 <https://www.jianshu.com/p/817284262546>
- <https://zhuanlan.zhihu.com/p/20214473>
- 各个版本字典介绍 <https://book.douban.com/review/2292414/>
