---
layout: post
title: "又一 Google 服务停止：Google Translator Toolkit 关闭"
tagline: ""
description: ""
category: 思考感悟
tags: [google-translator, translator, ]
last_updated:
---

前两天收到一份邮件，标题写着 `Google Translator Toolkit to be shut down on December 4, 2019`[^1]，感叹又一款良心服务要终结其生命了。虽然不常用 Google 翻译工具包，甚至很长时间这个翻译工具都偷偷的被隐藏在翻译页面的角落里面，但是不得不说这个工具曾经帮助我翻译过不少文档内容，也非常适合学习。Google 翻译工具包提供上传文档自动翻译，术语翻译等等功能，结合 Google Translate 的帮助能非常快速的辅助完成一篇文档的翻译。在自动翻译完成的基础上可以人工的进行修改润色。更甚至可以添加好友一同翻译，将文档分享给他人。至今为止我也只有在 Google 翻译工具包中体验过如此完整的翻译体验。

很多其他的翻译工具大多只能够提供字符串的辅助翻译，比如之前帮别人翻译过 Android 应用内文本，这些工具都非常的简陋，甚至有些术语都不能自动帮忙翻译，还需要一个字一个字的输入。虽然 Google 在邮件中给出了一些 [alternative](https://en.wikipedia.org/wiki/Comparison_of_computer-assisted_translation_tools) 但我只想说这些工具要么就是限制平台的，要么就看起来不像是一个完整的产品。体验没有一个能比得上 Google Translator Toolkit.

[^1]: <https://support.google.com/translatortoolkit/answer/9462068>

## 理想中的翻译工具应该有的功能

- 导入术语库，自动翻译
- 自动总结翻译习惯，提取常用翻译
- 多人协作翻译，提供校对审阅确认等机制


## 几个社区常用的翻译网站

- <https://www.transifex.com/>
- <https://crowdin.com/>
- <https://www.oneskyapp.com/>

这些网站多多少少我都有用过，目前 crowdin 做的还不错，有机器翻译自动提示，格式化处理的也比较好，快捷键也很合适。

另外开源版本的 Pootle，也有不少人推荐，用 Python + Django 写的。不过还没有尝试。

另一个开源的本地化工具 Weblate

- <https://github.com/WeblateOrg/weblate/>

