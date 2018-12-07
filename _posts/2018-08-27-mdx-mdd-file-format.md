---
layout: post
title: "MDX/MDD 文件格式解析"
tagline: ""
description: ""
category: 学习笔记
tags: [python, goldendict, mdx, mdd, dict, ]
last_updated:
---

MDict 将字典定义（关键字，解释）放在 MDX 文件中，字典相关的其他资源样式文件，比如图片，发音，样式放在 MDD 文件中，虽然存放的内容是不一样的，但是两种文件的结构是一致的。

## 源文件格式

MDict 的 html 格式

每个项目两行

    第一行是关键字
    第二行开始是正文，这里的正文应该包括关键字。可以使用 html 的标记（不要包含<html>) <body></body></html>, 这个程序会自动加上，另注意在转换时要指明源数据为 html).
    如果需要显示音标的话，可以利用 html 指定字体就可以显示了。

举例


    Whole
    <font size=5>whole</font>
    <br>
    <font face="Kingsoft Phonetic Plain, Tahoma">(hol,hJl; houl)</font>
    </>

注意"</>"和下一个记录间不要有任何其他空行

在 html 中连接到其它关键字的方法

    <a href="entry://key#section">key</a>

其中 key 是关键字，section 是对应关键字页面中的 section 名称

在 html 中嵌入图片的方法

    <img src="file://abc.gif"> 或者 <img src="/abc.gif"> 其中 src 指向的文件名大小写不敏感

并将所有图片文件放在一个单独的目录中（不要与词典源文件放在同一目录中）. 数据目录中可以带有子目录。在使用 MdxBuilder 制作词库时，将 Data 路径指向上面存放数据的目录，该目录中的所有文件都会被压缩到后缀名为.mdd 文件中，使用时该.mdd 文件应当与.mdx 文件在同一目录下。

在 html 中嵌入声音的方法

使用链接 `<a href="sound://keyword.spx">keyword</a>` 这样的形式，点击该链接的时候可以进行发音 发音仅支持.wav 和.spx 格式的音频文件

内部重定向（内容链接）

当两个关键字所指向的内容是一样的时候，可以采取重定向的方式来达到"链接"的效果。内部重定向的格式为：6

    @@@LINK= 关键字

例如 color 和 colour 都指向相同的内容，制作词典时可以正常编写 color 词条，但对于 colour 词条，可以写成：

    colour
    @@@LINK=color
    </>

当显示 colour 条目的内容时，程序会自动找到 color 的内容进行显示，链接是可以多重嵌套的。


## writemdict
一个 Python 库用来将 mdx 转换为 txt 文本

- <https://bitbucket.org/xwang/mdict-analysis>


一个 Python 库可以用来制作 mdx 词典

- <https://github.com/zhansliu/writemdict>
