---
layout: post
title: "使用 Beancount 记账篇六：利用 VS Code 插件辅助"
aliases: 
- "使用 Beancount 记账篇六：利用 VS Code 插件辅助"
tagline: ""
description: ""
category: Beancount
tags: [ beancount, double-entry, accounting, bookkeeping, ]
last_updated:
---

在之前的文章中已经详细地讲解过 [Beancount](https://blog.einverne.info/post/2021/02/beancount-introduction.html) 这个纯文本的复式记账工具，正是因为纯文本的记账工具，所以帐本就可以理解成为有一定格式的「代码」，所以编写这一份帐本，就可以和代码补充的 IDE 一样，比如在记录从信用卡（Liabilities）产生消费 （Expenses）时，可以利用账户的关键字，借助插件自动补全，快速完成记账。

这篇文章重点介绍一下 VSCode 下的 Beancount 插件。

## 插件安装

和正常的 VSCode 插件安装一样，直接在插件市场里面搜索 Beancount，找到 VSCode-Beancount，然后点击安装即可。

## VSCode 插件

[VSCode-Beancount](https://marketplace.visualstudio.com/items?itemName=Lencerf.beancount) 插件提供了语法高亮和账户自动补全功能。

```json
{
    "beancount.mainBeanFile": "main.bean",
    "beancount.inputMethods": ["pinyin"]
}
```

当配置好之后，插件会自动读取 Beancount 账户信息，然后在记账的过程中，只需要通过关键字来快速输入即可。

