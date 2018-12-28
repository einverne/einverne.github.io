---
layout: post
title: "《正则指引》笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [regex, regular-expression, java, python, nlp, ]
last_updated:
---

## 字符组 Character class
字符组 Character Class 是一个比较好理解的，就是一组字符，用方括号来标示，表示匹配其中某一个字符。比如常见的

    [aef]
    [0-9]
    [a-zA-Z]

字符组中的范围表示使用的是 ASCII 编码中的码值，所以不能写成 [9-0]

排除型字符组，在方括号后增加 `^`

    [^0-9]       # 非 0-9
    [^ae]       # 非 a 或 e

字符组简记法，常见的字符组，比如数字，英文字符组，可以用简单的缩写形式来表示。

    \d      [0-9]


## 元字符 meta-character
比如字符组中的 `-` 还有括号 `[`, `]` 还有常见的 `^`, `$` 这些特殊意义的字符都是元字符。如果遇到想要匹配这些特殊的字符就需要转义。


