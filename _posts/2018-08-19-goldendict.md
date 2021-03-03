---
layout: post
title: "Linux 下非常好用的字典 GoldenDict"
tagline: ""
description: ""
category: 经验总结
tags: [dict, linux, goldendict, youdao, dictionary, free-dictionary, offline-dictionary, ]
last_updated:
---

最近在使用 Linux 版有道的时候发现非常卡，影响正常使用，所以就发现了这个 GoldenDict。以前在 Win 下用过 [lingoes](http://www.lingoes.cn/) 但是无奈只有 Win 版本。有的时候也真的挺有意思，闭源的软件用着不舒服，切换到开源软件之后就像打开了新天地，从搜狗切换到 Rime 也是，开源软件不仅在功能上优于这些闭源软件，自己稍微调整一下之后就会发现体验也远超有道，搜狗之类。

GoldenDict 是一个开源词典，用 QT 编写，使用 WebKit 作为渲染核心，它像 Eudict、Mdict、Lingoes 以及 BlueDict 等词典一样可以加载外挂词典文件。基于 GNU GPL 第三版以上协议。

使用 GoldenDict 配上习惯的词典和脚本之后就再也离不开这个工具了，设置开机启动，设置 <kbd>Ctrl</kbd> + <kbd>c</kbd>两次查当前选中的词，定期的复习和整理查词列表中的词汇，这个工具完美的解决了我查词的需求，并且提供了远超出我想象的功能，中文成语，地名人名，专业术语，韩语，日语完全完全满足了所有查询的需求。

2020 年 8 月更新，让我异常惊喜的时，当我更换到 MacOS 时，GoldenDict 的 Mac 版虽然很久没有更新，但依然可以非常完美的工作，[Syncthing](/post/2019/10/syncthing.html) 同步字典文件和[脚本](https://github.com/einverne/translator) 后立马就工作，不用改变习惯，并且我也没有习惯使用 Mac 上自带的词典（虽然和系统集成得比较好，重按触摸板选中单词即可）。

## 安装
Ubuntu/Linux Mint 下安装非常简单

    sudo apt install goldendict

- For linux: <https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Linux-Portable>
- For Mac OS X : <https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Mac-OS-X>
- For Windows: <https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Windows>

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

### GoldenDict 开机启动
在 Linux gnome 桌面环境下，可能会发现 GoldenDict 设置选项中的开机启动是灰色的按钮无法选中。其实 gnome 自己有一个开机管理的应用叫做 startup application，在这个应用中添加 GoldenDict 即可。


## GoldenDict 长句翻译问题
GoldenDict 在查词方面非常完美，但唯独在长句翻译上落后一些，但是问题不大，利用 Python[脚本](https://github.com/einverne/translator) 添加到 GoldenDict 后整段的翻译问题也解决了。

[[202008262304-GoldenDict查长句]]

## 词典分组

可以在菜单栏中群组，添加群组，然后为群组增加几部字典，然后添加快捷键对字典进行分组，方便快速查阅。

比如可以将同义词词典单独分类，比如可以将常用词词典分类，方便进行查看。

## 字典安装

### 在线字典
菜单栏选择【编辑】>【词典】>【词典来源】>【网站】> 添加 > 启用 可以启用在线的字典。

欧陆

	https://dict.eudic.net/dicts/en/%GDWORD%

有道的源

    http://dict.youdao.com/search?q=%GDWORD%&ue=utf8

Bing 中文的源

    https://cn.bing.com/dict/search?q=%GDWORD%

iciba

    http://www.iciba.com/%GDWORD%/

zdic

    http://www.zdic.net/sousuo/?q=%GDWORD%

Collins

	https://www.collinsdictionary.com/dictionary/english/%GDWORD%


其他同类型的网站可以照上面的方式自行添加。

- [牛津在线](https://www.oxfordlearnersdictionaries.com/)
- [朗文在线](https://www.ldoceonline.com/)
- [剑桥在线](https://dictionary.cambridge.org/zhs/)
- [韦式在线](https://www.merriam-webster.com/)
- Vocabulary.com
- Dictionary.com
- 沪江小 D 在线词典
- [汉典](https://www.zdic.net/)

### 离线字典
英国学习词典五虎是牛津、朗文、柯林斯、剑桥和麦克米伦，再加上美国的韦氏学习词典，6 大学习词典。

#### 简明英汉字典增强版
收录 324 万词条，如果只是单纯的想要划词翻译，并不是那么在意英语学习，而只想要快速获知单词含义，这本字典足矣。不管是单词还是短语，这本词典收录非常详细。

- <https://github.com/skywind3000/ECDICT/wiki/>

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

#### Oxford Advanced Learner's English-Chinese Dictionary 8th Edition （牛津高阶英汉双解词典）

牛津高阶应该是我最熟悉的一本字典了，从高中起老师推荐，基本算是人手一本的必备词典。不知道在别的地方教学用字典是什么，反正在我看来即使到了大学当时的牛津高阶英汉词典也是非常常见，那个大红色的封面，至今记忆犹新。

牛津高阶为世所公认的权威英语学习词典，创同类词典之先河。自 1948 年出版至今，累计发行量逾 3000 万册，广受全球读者欢迎。收录 183500 单词、短语、释义：英美并重；85000 示例：英汉对照；2000 新词：如 life coach、offshoring；7000 同义词、反义词：有助扩充词汇；5000 专科词语：涵盖文理、工商、科技；700 世界各地用语：如 stickybeak、godown；2600 文化词语：如 Walter Mitty、Capitol Hill；2000 图解词语：图文并茂；400 用法说明：辨析常见疑难；130 研习专页：全面介绍英语应用知识；44 彩页：提供实用帮助；全书逾 2500 页。内容较前一版增加 20％。

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

#### The American Heritage Dictionary 美国传统词典 英英
美国传统字典，简称 AHD。这本字典随着第五版的发布已经有 50 年的历史，经过多次的版本修订 AHD 增加了许多互联网，电子商务，电视频道等等相关的词条 [^ahd]。

[^ahd]: https://book.douban.com/subject/1362017/

AHD 字典的解释简单清晰，针对一些特定的词条会有用法介绍，同义词延伸等等，一句话介绍解释就是非常时候快速查词使用。

AHD 第五版出版介绍

第五版在第四版的基础上新增加了 10000 多词条和短语，超过 4000 张全新全彩的图片。为了让 AHD 紧跟前沿，第五版的出版依靠了一大群专家，学者和贡献者。成千的定义随着时间发生了巨大的变化，比如天文学，生物学，地理学等等。词典中的地图，脚注，同义，语言变化都有了增强和提高。

《美国传统词典》是美国国内非常有影响非常权威的辞典，而且自成系列．35 万个单词，3.4 万个应用实例，500 多种使用注释和新修订的词源附录，曾经被 Amazon.com 评为"编辑选择的参考工具"，是专业英语工作者必不可少的重要工具，也是广大英语爱好者的良师益友，具有非常高的权威性。《美国传统词典》收录了不少英语词根。解释词义的时候会追根溯源寻求词源、词根，可读性强，如同用偏旁部首学习汉字，这对理解和记忆是很有帮助的。所有例句力求语出有典，绝绝非一时的生造。有近义词用法说明，并且用同样有典的例句加以示范。对于渊源曲折的词有风趣而又不失严谨的注释。它是一部典型的英英辞典．它对于学习英语的重要性时非常明显的。许多英语单词都有多重词义，只有原汁原味的英英解释才能准确地道的把它们诠释出来。尤其是许多同义词之间的细微差别，用汉语很难清楚的加以区分，必须放到特定的语言环境中才能体现出来。

单词的释义通过引用经典和同时代的作家的用法变的更加简单。解释单词起源和发展的词源学被重新修订。许多单词可以通过词典的两个附录来追溯词根，这两个附录分别是古印欧语和犹太语。[^ahd5]

[^ahd5]: https://book.douban.com/subject/5986128/

在线查词：

- <https://www.ahdictionary.com>

#### WordNet 3.0 英英字典

WordNet 是由普林斯敦大学的心理学家，语言学家和计算机工程师联合设计的一种基于认知语言学的英语词典。它不是光把单词以字母顺序排列，而且按照单词的意义组成一个“单词的网络”。它是一个覆盖范围宽广的英语词汇语义网。名词，动词，形容词和副词各自被组织成一个同义词的网络，每个同义词集合都代表一个基本的语义概念，并且这些集合之间也由各种关系连接。（一个多义词将出现在它的每个意思的同义词集合中）。WordNet 跟传统的词典相似的地方是它给出了同义词集合的定义以及例句。在同义词集合中包含对这些同义词的定义。对一个同义词集合中的不同的词，分别给出适合的例句来加以区分。

- <http://goldendict.org/screenshots.php?show=wordnet#pic>
- 下载地址 <https://sourceforge.net/projects/goldendict/files/dictionaries/>

#### English Etymology
这是一本英语词源字典，比较简单，排版也比较简陋。对于单词由来比较关注的学习者可以备一份。

#### 简单韩语字典

![korean dictionary](/assets/korean-dictionary-2018-08-21-083443.png)

#### 21 世纪英汉汉英双向词典

从各个方面上来看比较平衡的字典，容量、词条量、解释都介于朗道繁体词典和牛津高阶之间。解释虽然简介但也附有许多详细的解释和例句，相比来说是较为适合大众使用。

官方介绍：

本词典的收词范围是英语基础词汇，包含了我国初级和高级中学使用的最新英语课本及旧版英语课本中的全部单词、复合词和词组；也包含了高等学校英语专业以及文、理、工科本科生在大学英语一级至六级所要掌握的总词汇；还包含了中华人民共和国国家教育委员会制定的全国各类成人高等学校招生考试复习大纲英语词汇表中所有单词和词组。此外还参考各（1）英汉部分：收入单词 15000 余条。为了方便读者学习，本部分还提供了大量的固定搭配和惯用句型。（2）汉英部分：收入汉语词条 23000 余条，除一般词语外，还收入了一些常见的方言、成语、谚语以及自然科学和社会科学的常用词组。

#### 新世纪英汉科技大词典

该词典针对工科学生及科技者编撰，不完全统计词条总数 532388 ，如果你是个工科文艺青年，绝对不甘心于仅仅拿着 kindle 神器却看着小清新。那么本词典是您居家旅行的必备良器。有了金刚钻，你还怕揽不着瓷器活？

#### 朗道英汉字典

实际上朗道是上海一家信息公司，名不见经转。想大家都用过金山词霸的电子辞典软件，可能也用过快译点之类的电子辞典。而朗道是国内中英文翻译软件的鼻祖。收录词汇量大。

#### 牛津现代英汉双解词典

该词典一直被誉为“现代英语之权威”。近一个世纪以来，十次修订，与时俱进，品质更臻完美，既为全世界英语学习者的良师益友，也早已成为我国高级英语学习者首选之必备工具书。其收词多达 130,000 余条，精选新词 10,000 余条，英文释义精，中文译文规范权威，近千条实用的用法说明，大量的词源信息，还有丰富的附录，等等。

#### 简明英汉词典

该词典是权威山寨版词典，胜在什么烂词都收，解释简单好用，如果要是做个词汇量大全，生僻词排名的话，这个词典没准能混出个水分颇多的冠军。金山词霸中默认词典即为此词典，复制一下官方介绍：
该词典是一本针对中高级水平的英语学习者的工具书，是一部针对中国人学习特点、适应英语多层次运用的词典。本词典突出现代性、实用性和简明性；力求选词实用精练，体现时代特征；例证典型地道，释义简明准确；编排科学合理，检索方便省时。其创新意识和鲜明特色，博采了中外英语词典之所长。设计新颖，视野开阔，融短语、辨析、语法、相关词、构词、助记、现代成语及用法为一体，兼具学术性、实用性、知识性和趣味性。

#### 牛津英汉词典

这本词典是外研社从世所公认的英语词典权威出版机构牛津大学出版社引进，根据《牛津学生词典》(Oxford Student’s Dictionary) 翻译而成，是为初高中生及大中专英语学习者编纂的一部简明词典。共收词及短语 50000 余条，释义浅显易懂，简易精练；例证精当，易学易用；语法标注简明清晰，方便实用；同义词列举精益求精，利于扩充使用者词汇量；词源说明，利于使用者记忆单词。

#### 朗文英汉综合电脑词典

码农们有福了，这是一本朗文针对计算机专业制做的英汉词典，码农们可以尝试一下，是不是好用，如果不好用的话，您说一声。我就不用了。

#### 现代英汉词典（2001 年外研社版，kindle 正版词典）

《现代英汉词典》（新版）经过众人的通力合作和不懈努力终于问世了。现在呈献在读者面前的是一部全新的英语学习词典，它收词新、义项全、例证丰富、实用性强，能很好地满足我国中高级英语学习者的需要。
本词典注重吸收现代词典学理论的研究成果，充分借鉴国际英语学习词典的编纂经验，同时结合我国学生学习英语的特点，力求做到科学性、准确性、实用性和趣味性的完美结合。

本词典具有以下四大特色：

一、时代性强，收词广泛。本词典紧跟时代，所收词语较新，丰富全面，共收词目 38， 000 余条（不包括派生词及短语）。这些词语反映了近 10 年来科技、经济等领域出现的词汇变化。所收义项也较同类词典丰富。在拼写和注音上，本词典兼顾英国英语和美国英语的区别，采用第十四版国际音标。
二、释义准确，例证恰当。本词典释义力求准确、完整；例证，无论是英文还是中译文， 也力求恰当、贴切、地道。
三、内容丰富，针对性强。本词典例证丰富，具体说明常用词语的语义、句法、搭配、用 法等特点，有助于培养英语学习者的词汇运用能力。此外，本词典语法标注详尽，不仅对形容词用在名词前、不用在名词前、动词不用进行式、常用被动式等作了标注，还对名词用于可数与不可数、用于单数与复数等作了标注，这些有助于中国学生提高正确运用英语的能力。
四、实用性强，趣味性强。本词典提供用法说明 489 条，详解中国学生易混淆词语的用法及区别。 同时配有插图 200 余幅，有助于学习者理解词义和形象记忆，这些无疑为词典增添了实用性和趣味性。

#### 韦氏国际词典——Webster's Revised Unabridged Dictionary 1913『英英』

《韦氏国际词典》是美国结构主义语言学的硕果。它的篇幅极大，收词 45 万条，是最大型的单卷本英语词典。该书抱着对语言作客观的记录和描写的宗旨，有闻必录，收罗了大量的俗语（包括许多不雅的字眼）。在一段时间里这种编辑方针受到人们尖锐的批评；一二十年后争论才平息下来。

#### Collaborative International Dictionary of English『英英』

The Collaborative International Dictionary of English (CIDE) was derived from the 1913 Webster's Dictionary and has been supplemented with some of the definitions from WordNet. It is being proof-read and supplemented by volunteers from around the world.
This electronic dictionary is also made available as a potential starting point for development of a modern comprehensive encyclopedic dictionary, to be accessible freely on the Internet, and developed by the efforts of all individuals willing to help build a large and freely available knowledge base.

#### 韦氏高阶英语词典——Merriam-Webster's Advanced Learner's English Dictionary『英英』
《韦氏高阶英语词典》是美国老牌权威的辞书出版机构梅里亚姆—韦伯斯特公司出版的一部英语学习工具书，由中国大百科全书出版社引进在中国国内出版，这是“Merriam—Webster”词典首次被引进中国，也是正宗的韦氏词典在中国的第一次授权。以此为契机，韦氏品牌旗下的相关词典将有计划地引入中国市场，形成系列化、规模化。全书收词 10 万，含 3000 核心词汇；16 万例句；22000 余个习语、动词词组、常用短语；12000 余个用法标注、注释和段落。版面字数为 1024 万字。

#### 韦氏大学生词典——Merriam-Webster's Collegiate Dictionary『英英』
韦氏大学生词典之所以深得美国人青睐，主要因为它具有 150 年历史，数代美国人在它的哺育下长大，它在美国的地位相当于中国的《新华字典》。曾经有人这么评论过："韦氏词典是划时代的，它的出现标志着美语体系的独立"。GRE 考试的词汇主要依据就是美国韦氏学院辞典！根据统计比较，GRE 反义词所考短语用词大多是 M-W 词典中的原话。被认为是美式英语的典范，留学美国必备。结合新东方系列学习有奇效。

#### 柯林斯英英字典第三版——Collins Cobuild V3『英英』
本词典属根据世界着名的三大语料库之一 COBUILD 中的英语语料库（The Bank of English）编写的工具书。词典中的例词和例句均取材于 COBUILD 英语语料库。故本词典收录了当代英语词目 75000 余条，其中 4000 余条为近年来进入英语的新词。本词典英语语料地道实用，版面新颖，语言信息特别详尽。本词典能帮助使用者扩大词汇量，不断提高口笔语能力，增强使用英语的自信心，是适合中高等程度的英语教师和学生使用的一本极有价值的参考工具书。柯林斯的特点是解释通俗易懂，每个解释都是用一句话来表达的，还有各种同意词举例，还有比如说形容词能不能用比较及，和什么介词搭配，动词能有几种句型可以使用都有说明。虽说这个词典目前已经发行到第五版，但是根据网上的评价，认为还是第三版最好。第三版的例句很多，而后面的版本开始大幅度删减例句，不只是何原因。希望喜欢韦氏词典的人都来下这个版本的 cobuild。


#### 简明大英百科全书——Britannica Concise Encyclopedia『英英』

《不列颠百科全书》（Encyclopaedia Britannica ，简称 EB），又称《大英百科全书》，是享有盛誉的综合性英文百科全书。 Encyclopedia Britannica Online （简称 EB Online）除包括印刷版的全部内容外， 还整合了其他多个资源的信息。Britannica Concise Encyclopaedia 是《不列颠百科全书》简明版，包括 28,000 个短条目，可以迅速解答有关历史、艺术、科学等主题的问题。大英百科全书公司创立于 1768 年、距今已有 235 年悠久历史的《大英百科全书》，是全世界口碑第一、词条（Entry）最多、内容正确性最获肯定的综合性百科全书；大英百科全书公司（Encyclopedia Britannica Inc.）也以其坚强的内容编辑实力及与时并进的资料库检索科技，成为全球工具书的领导品牌。

#### 牛津英语大词典（简编本，第五版）——Shorter Oxford English Dictionary『英英』

提到《牛津英语大词典》，研究过英语的人可能都知道语言研究与词典编篡中的历史主义原则。《牛津英语大词典》最初出版时，名称是“A Nnw English Dictionary on Historical Principles”。作为历史主义原则的应用典范，这部词典记录了自 1150 年以来的中古英语和现代的演变。可以说，它是英语发展轨迹研究的集大成者。历史主义原则在这部词典中主要表现为：收词释义尊重历史，以书证作为依据；义项排列遵循由古到今的时间顺序，词义的历史演变脉络清晰。《牛津英语大词典》自出版以来，成了英语语言的权威。但它卷帙浩繁，用“汗牛充栋”恐不足以形容其规模，作为个人藏书，多有不便。因此有人说这部词典“authoritative,fascinating,but unusable and unaffordable”。为使这部词典贴近普通读者，删繁就简、取精用弘就十分必要，因此大词典出版后不久就有了《牛津英语大词典》（简编本）（Shorter Oxford English Dictionary)。它容纳了《牛津英语大词典》三分之一以上的内容描述的是 1700 年至今所使用的英语语言。可以说，简编本是一部按历史主义原则编篡的现代英语词典。简编本在保持大词典特色与权威的同时，汲取了大词典修订项目的成果，融合了新词、新义， 反映了英语语言的新发展，具有新时代气息。

#### 朗文当代英语词典（四版）——Longman Dictionary of Contemporary English『英英』

《朗文当代英语词典》共收词目 8 万条，其中百科词目 15000 条，篇幅逾 900 万字，是目前世界上第一部与百科全书相结合的英语学习型辞典，可以充分满足中、高级英语学习者学习语言及文化的需要。该辞典释义浅显易懂，例证典型丰富，用法说明详尽准确。其英文版问世以来，受到全球英语教学界的广泛喜爱。

#### 不列颠百科全书——Britannica『英英』

《不列颠百科全书 (Encyclopedia Britannica)》（又称《大英百科全书》，简称 EB)，被认为是当今世界上最知名也是最权威的百科全书，是世界三大百科全书（美国百科全书、不列颠百科全书、科利尔百科全书）之一。不列颠百科全书诞生于 18 世纪苏格兰启蒙运动 (Scottish Enlightenment) 的氛围中。第一个版本的大英百科在 1768 年开始编撰，历时三年，于 1771 年完成共三册的不列颠百科全书。全书约 4400 万单词，从 1768 年开始编写至今已经出版至 14 版。这套百科全书共 20 卷，字数达到 4350 万字；条目多达 81600 余条；图片有 15300 余幅。内容涵盖政治、经济、哲学、文学、艺术、社会、语言、宗教、民族、音乐、戏剧、美术、数学、物理、化学、历史、地理、地质、天文、生活、医学、卫生、环保、气象、海洋、新闻、出版、电视、广播、广告、军事、电脑、网络、航空、体育、金融等 200 多个学科。


#### 法汉词典

该词典源于法语学习软件《我爱法语》，全本整理扩增法汉词库至 56000 单词。《我爱法语》是一款成熟的法语电子词典软件。

#### 新德汉词典

该词典旨在帮助初学者及提高者学习德语之用，共收词条 20000 多，其中 5000 多条德语基本词含有例句或释例，同时还标明最常用词约 2000 个。其他词条也收录一些较常用的词组搭配。本词典根据德语新正字法编写而成，符合实际需要。

####　プログレッシブ英和中辞典

英語文化へ読者を招待する最良の英和辞典。
　学習や実務に生きる精選された 11 万 7000 語を収録。時事語・生活語・新語・俗語の他、生命科学や金融、スポーツ用語なども追加。大学受験をめざす高校生から、新聞・雑誌を読みこなす社会人まで、幅広く使えます。

内容（「BOOK」データベースより）
総収録項目 11 万 7 千。時事語・生活語・新語・俗語のほか、生命科学・金融・スポーツ用語なども追加。重要見出し語を赤字で示し、語法・類語なども見やすく表示。定評ある語源欄をさらに目立たせ、語源的に関連のある語を赤字で示して、語彙ネットワークを立体的に構成している。
内容（「MARC」データベースより）
総収録項目 11 万 7 千。時事語、生活語、新語、俗語のほか、生命科学、金融、スポーツ用語なども追加。重要見出し語を赤字で示し、語法、類語なども見やすく表示。学習からビジネスまで対応する、1998 年刊に次ぐ第 4 版。

#### 大辞泉

　　1966 年（昭和 41 年）に企画が持ち上がった [1]。実際に出版されたのは 1995 年。カラー図版が多いのが特徴である。初版の収録語数は、約 22 万語。2003 年現在、58 万部が発行されている [1]。iPhone や iPad アプリとして「デジタル大辞泉」が発売されているほか、電子辞書にも「デジタル大辞泉」が収録されている製品がある。さらに、Yahoo! 辞書や goo 辞書、infoseek 辞書、コトバンクに「デジタル大辞泉」が提供されており無料で利用できる。

#### 新华词典 (Chinese Edition)（2001 年修订版，kindle 正版词典）
　　
《新华词典》：1980 年 8 月第 1 版，1989 年 9 月第 2 版，2001 年 1 月第 3 版。主编韩作黎，曾任北京市教育局局长，全国教育学会第一、二届常务理事，北京市教育学会会长，中国作协北京分会儿童文学委员会主任，长期从事普通教育工作及儿童文学创作，对小学教育、教学和学校管理有较深研究。该词典是一部以语文为主兼收百科的中型词典，主要供中等文化程度的读者使用。

#### Macmillan Study Dictionary
暂无

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

最后这里有近 5 个 G 的英英和英俄字典，应该是个俄国人分享的

- <https://cloud.mail.ru/public/CUeM/oCccvrZsA/>

### 字典相关
引进词典又分为英系和美系两大类，目前英系词典占据中国市场的主导地位，著名的品牌如牛津、朗文、剑桥、麦克米伦、柯林斯，简称“牛朗剑麦柯”（谐音“牛郎见迈克”）合称“英国五虎”。

美系词典主要有《美国传统词典》（The American Heritage Dictionary) 和“韦氏词典”两大品牌，而实际上“韦氏”在这里是一个复数名词，在美国有众多出版社都出过冠以“韦氏”名号的词典，之所以造成今天“鱼龙混杂”的局面，是因为韦伯斯特最初编撰“韦氏词典”是早在距今 200 年前的 19 世纪初，根据美国法律，“韦氏”作为未经注册的商标早已超出了知识产权的保护期进入公共出版领域，所以今天变成一个共享品牌。对于中国读者而言，最熟悉的“韦氏”主要有两家，一个就是正宗的“韦伯斯特”，由老东家麦瑞安—韦伯斯特出版公司出版，旗舰品牌 Webster Third New International Dictionary，但普通读者（特别是准备雅思和 GRE 的同学）更熟悉的是该社各形各色的韦氏原版小词典，被大家戏称之曰“韦小宝”。麦瑞安—韦伯斯特于 08 年底推出第一部学习型词典 Webster Advanced Learner's Dictionary，可惜尚未听说那家出版社引进该词典的版权；另一个就是美国鼎鼎大名的兰登书屋所出版的“韦氏词典”系列，现在兰登在所出“韦氏”前面一般都冠以“兰登书屋”的名目，一看便知，不会混淆，如商务 97 年引进出版的《蓝登书屋韦氏英汉大学词典》（Random House Webster's Colledge Dictionary），外研社 06 年引进出版的《韦氏高阶英汉双解美语词典》（Random House Webster’s Dictionary of American English）。在英系美系两大类别之外，有一本词典我要特别提一下，外研社《英汉多功能词典》，这是一本日系词典，原书是日本人编给日本人学英语用的…… 说到这里，实际上今天大名鼎鼎的 OALD 最初就是霍恩比 (A S Hornby) 教授执教日本期间所编写的一部针对非母语人士（主要是以日本人为代表的亚洲读者）的学习型词典《现代英语学习词典》(A Learner's Dictionary of Current English)……在英美两系之外，另有一本日系词典值得特别提一下，即外研社《英汉多功能词典》（A Multifunction English-Chinese Dictionary），日文原版（E-Gate English-Japanese Dictionary）由田中茂范主编。



## 词形匹配
GoldenDict 默认情况下，比如屏幕取词获取 “stores” 默认是没有结果的，但是其实并不是 GoldenDict 的问题，GoldenDict 默认情况下是没有附带构词法规则的，所以查询单词复数等变形形式时可能会差不到，只需要导入构词法规则库就能够让 GoldenDict 自动判断复数从而进行查词。

[下载](https://sourceforge.net/projects/goldendict/files/better%20morphologies/1.0/) 英语构词法规则库，一般下载英文的 `en_US_1.0.zip` 即可：

然后在 `编辑 ->词典 ->词典来源 ->构词法规则库` 中设置规则目录，在我的电脑上是 `/usr/share/myspell/dicts` ，当然也可以将下载的文件拷贝到该目录中记载即可。


## 对比
GoldenDict 和其他可选字典的对比

在 [stardict](http://stardict.sourceforge.net/) 被移除的 Sourceforge 页面上给出了一系列的 Alternative 选择

字典软件        | 链接              | 支持格式                  | 平台                  | 特色功能                  | License
----------------|-------------------|---------------------------|-----------------------|---------------------------|-------------------
GoldenDict      | https://github.com/goldendict/goldendict | 特别多，见上文 | GUN/Linux, Mac, Windows, Android | 见上文 | GNu GPLv3+
Babiloo     | https://code.google.com/archive/p/babiloo/ 已停止 | SDictionary, and StarDict formats | Linux, Windows, Mac | 已停止维护 | GPL v3
LightLang   | https://code.google.com/archive/p/lightlang/ 已停止开发 | 俄语 | Linux only | 已停止维护略 | GPL v2
Lingoes     | http://www.lingoes.net/ | 私有格式 | Windows only | Windows 下比较好用，但有广告 |
Dicto       | http://dicto.org.ru/ | XDXF dictionaries | windows only | 只面向俄语 略 |


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

Wikipedia 的离线包，很大，好几十个 G

- <http://wiki.kiwix.org/wiki/Main_Page>

原来只是想要找到一个 Linux 下代替有道的桌面词典，没想到竟然过了一个礼拜，这一个礼拜每天回来的第一件事情就是整理可用的字典。在一个礼拜的努力下，终于已经完美可用。这一个礼拜所看过的字典版本已经超过了我过去二十多年的数量，也让我发现了原来学习英语一直以来都缺失了这么重要的一环。真的有些单词，英英解释起来要比中文要轻松许多。今天也同样遇到了一个 argument 和 parameter 两个单词在编程的语境中经常被翻译成一个词 ---- 参数，但其实仔细看英英解释就能发现

- argument 是 a reference or value that is passed to a function, procedure, subroutine, command, or program
- parameter 是 a set of fixed limits that control the way that something should be done

虽然两者本身的含义也非常类似，在计算机术语中几乎也是等价，但是英英的解释能看到，argument 是调用者的传参，而 parameter 是定义方法或者函数时候的参数，虽然两者表达的东西是一样的，但是其实有着一定的区别。

再比如之前也提到的 `walk`, `wander`, `stride`, `pace`, `wade` 都有走的意思，但是其实每个单词使用的场景都不一样都需要仔细考虑。或许这就是语言学习最难过的一关，这也是学习者无论如何都很难超越母语使用者最为重要的一点了吧。


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
- <https://dictionaryphile.github.io/>
- <https://www.douban.com/group/topic/31690870/>
