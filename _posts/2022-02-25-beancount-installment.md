---
layout: post
title: "使用 Beancount 记账篇三：周期账单"
aliases: 
- "使用 Beancount 记账篇三：周期账单"
tagline: ""
description: ""
category: Beancount
tags: [ beancount, accounting, double-entry,  ]
last_updated: 2022-02-28 10:14:41
create_time: 2022-02-28 07:40:19
---

在 Beancount 使用的过程中难免会出现周期性重复的账单，比如房租，水电，网费，以及可能的分期付款账单，每个月的订阅费用等等。在之前我都是在 Vim 下复制粘贴然后改改，倒是没有那么麻烦，比如房租，基本上几秒钟就能搞定，但是长期下来我发现这样一来比较繁琐，因为我基本上每个月只对账一次，也不会一直开着 fava，所以有可能有遗漏，排查起来麻烦，二来为了管理方便我需要单独设立一个文件来管理，比如房租会单独有一个 `rent.bean` 文件，所以最后并没有向日常的账单那样是按照月份来管理的，如果要从时间上来统一管理就比较麻烦。

不过随手一查文档，发现 Beancount 提供了一个[插件](https://beancount.github.io/fava/api/beancount.plugins.html) `plugin "beancount.plugins.forecast` 专门用来处理周期性账单(交易)，可以按照每月费用的自动生成。并且只需要记录一次，之后可以按照设定的周期截止时间，或者执行几次来自动完成对账。体验了一下感觉非常不错，下面就记录一下使用过程。

首先在 `main.bean` 中引入插件：

```
plugin "beancount.plugins.forecast"
```

然后就可以在 `*.bean` 文件中定义分期语法。

这里举一个例子，比如每个月3000的房租：

```
plugin "beancount.plugins.forecast"

2021-01-01 open Expenses:House:Rent
2021-01-01 open Assets:DebitCard:CMB

2021-05-17 # "House Rent [MONTHLY]"
    Expenses:House:Rent   3000 CNY
    Assets:DebitCard:CMB
```

使用上了上述的交易之后，Beancount 会每个月自动记录一笔，在 Fava 中查看的时候会默认把今年剩余的月份都补全。注意上面的语法中 `#` 是必须的，并且 `[MONTHLY]` 定义了记账周期。

同样的，这里的 `MONTHLY` 可以替换成 

- `YEARLY`，每年
- `WEEKLY`，每周
- `DAILY`，每天

更进一步，如果已知了账单的循环次数，比如分期付款的时候分了 12 期，那么可以在 `MONTHLY` 后面使用如下的语法：

```
2022-02-08 # "Computer [MONTHLY REPEAT 12 TIMES]"
  Expenses:DigitalDevice                      20000 USD
  Liabilities:CreditCard:CMB
```

其中的 `[MONTHLY REPEAT 12 TIMES]` 就定义了循环的次数。

另外一种情况就是不清楚次数，但是知道账单结束的时间，那么可以使用 `UNTIL` 语法：

```
2022-02-08 # "Electricity bill [MONTHLY UNTIL 2022-12-31]"
  Expenses:Electricity                      50.10 USD
  Assets:Checking                          -50.10 USD
```

交易按照年循环，循环 10 次：

```
2014-03-08 # "Electricity bill [YEARLY REPEAT 10 TIMES]"
  Expenses:Electricity                      50.10 USD
  Assets:Checking                          -50.10 USD
```

`SKIP` 语法可以用来跳过某一次记账:

```
2014-03-08 # "Electricity bill [WEEKLY SKIP 1 TIME REPEAT 10 TIMES]"
  Expenses:Electricity                      50.10 USD
  Assets:Checking                          -50.10 USD

2014-03-08 # "Electricity bill [DAILY SKIP 3 TIMES REPEAT 1 TIME]"
  Expenses:Electricity                      50.10 USD
  Assets:Checking                          -50.10 USD
```


## reference

- <https://beancount.github.io/docs/api_reference/beancount.plugins.html>
- [如何编写插件](https://beancount.github.io/docs/beancount_scripting_plugins.html)
- [个人 Beancount 模板](https://github.com/einverne/beancount-sample)