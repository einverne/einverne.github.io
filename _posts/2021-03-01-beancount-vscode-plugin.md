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

[[Beancount]] 是一个纯文本的复式记账工具，因为是纯文本的记账工具，所以帐本就可以理解成为有一定格式的「代码」，所以编写这一份帐本，就可以和代码补充的 IDE 一样，比如在输入消费 Expenses，或者 Liabilities 等时，可以利用账户的关键字来借助插件自动补全，快速完成记账。

这篇文章重点介绍一下 VSCode 下的 Beancount 插件。

## VSCode 插件

[VSCode-Beancount](https://marketplace.visualstudio.com/items?itemName=Lencerf.beancount) 插件提供了语法高亮和账户自动补全功能。

```json
{
    "beancount.mainBeanFile": "main.bean",
    "beancount.inputMethods": ["pinyin"]
}
```

