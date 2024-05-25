---
layout: post
title: "使用 Beancount 记账篇三：限制性股票"
aliases: "使用 Beancount 记账篇三：限制性股票"
tagline: ""
description: ""
category: Beancount
tags: [ beancount, accounting, bookkeeping, vesting, stock, rsu, ]
last_updated: 2021-07-03 10:19:35
create_time: 2021-07-03 10:19:35
---

通过之前几篇文章的介绍，相信大部分人已经入门了基本的 Beancount 的使用，也能理解[[复式记账]]的魅力。

- [使用 Beancount 记账篇零：Beancount 入门使用](/post/2021/02/beancount-introduction.html)
- [使用 Beancount 记账篇一：给账户命名](/post/2021/02/beancount-account-name-template.html)
- [使用 Beancount 记账篇二：各类账单导入](/post/2021/02/beancount-import-bill.html)

这一篇文章就接着之前的内容，来讲讲如何在 Beancount 下记录期权（或者限制性股票）交易的记账。

RSU（restricted stock units），又被称为限制性股票，restricted 意味着当前无法获得，一般经过特定的时间周期，当其成熟时才可以收到。通常的，被许诺可以在未来的 3~4 年中每个季度或每个月份收到固定份额的股票，当你离开公司的时候，剩余为成熟的份额就视为自动丢失。

其中的一种方法是，可以将 RSUs 视为 assets, 一种定期的应收款。

作者提供了一份[示例](https://github.com/beancount/beancount/blob/master/examples/vesting/vesting.beancount)。

追踪奖励

Beancount 提供了一个名为 `commodity` 的广义「货币」单位的概念，用户可以自定义任何类型的记账货币。相比普通的记账软件，它们可能只支持一些常见货币单位，比如人民币（CNY）或美元（USD）。但是 Beancount 的强大之处在于，你可以定义诸如 BTC 这样的单位，使得 Beancount 能够记录虚拟货币交易记录。甚至，你还可以定义 SNE 代表一股 Sony 的股票，或者 GOOG 代表一股 Google 的股票，这样就可以利用 Beancount 记录证券交易。

第一步，定义 Commodities，比如，"Hooli Inc"，最终会变成公司的流通股票，进而变成 US dollars。

    1990-12-02 commodity HOOL
      name: "Common shares of Hooli Inc."
      quote: USD

然后定义未成熟的 RSU：

    2013-01-28 commodity HOOL.UNVEST
      name: "Unvested shares of Hooli from awards."

进而开设一个收入账户，比如使用 `Income:US:Hooli` 作为从 Hooli 的所有收入账户

    2010-01-01 open Income:US:Hooli:Awards    HOOL.UNVEST

然后定义一个支出账户

    2014-01-28 open Expenses:Hooli:Vested     HOOL.UNVEST

接受奖励

    2014-04-02 * "Award S0012345"
      Income:US:Hooli:Awards                -1680 HOOL.UNVEST
      Assets:US:Hooli:Unvested:S0012345      1680 HOOL.UNVEST

    2014-04-02 open Assets:US:Hooli:Unvested:S0012345

## 期权成熟之后

定义一个收入账户

```
2013-04-04 open Income:US:Hooli:RSU
```

可能还需要定义其他税收的账户

    2015-01-01 open Expenses:Taxes:TY2015:US:StateNY
    2015-01-01 open Expenses:Taxes:TY2015:US:Federal
    2015-01-01 open Expenses:Taxes:TY2015:US:SocSec
    2015-01-01 open Expenses:Taxes:TY2015:US:SDI
    2015-01-01 open Expenses:Taxes:TY2015:US:Medicare
    2015-01-01 open Expenses:Taxes:TY2015:US:CityNYC

交完税之后会剩下的部分放入新的账户

```
2013-01-28 open Assets:US:Hooli:RSURefund
```

Vesting

```
2015-05-27 * "Vesting Event - S0012345 - HOOL" #award-S0012345 ^392f97dd62d0
  doc: "2015-02-13.hooli.38745783.pdf"
  Income:US:Hooli:RSU                    -4597.95 USD
  Expenses:Taxes:TY2015:US:Medicare         66.68 USD
  Expenses:Taxes:TY2015:US:Federal        1149.48 USD
  Expenses:Taxes:TY2015:US:CityNYC         195.42 USD
  Expenses:Taxes:TY2015:US:SDI               0.00 USD
  Expenses:Taxes:TY2015:US:StateNY         442.32 USD
  Expenses:Taxes:TY2015:US:SocSec          285.08 USD
  Assets:US:Hooli:RSURefund               2458.97 USD
```

整个过程

```
;; An example that demonstrate how to track vesting of restricted stock units (RSUs).
;; See doc at: http://furius.ca/beancount/doc/vesting

1990-12-02 commodity HOOL
  name: "Hooli Common shares."

2013-01-28 commodity HOOL.UNVEST
  name: "Unvested award of Hooli Common shares."


2013-01-28 open Income:US:Hooli:Awards        HOOL.UNVEST
2014-01-28 open Expenses:Hooli:Vested         HOOL.UNVEST


2014-04-02 * "Award S0012345"
  Income:US:Hooli:Awards                -1680 HOOL.UNVEST
  Assets:US:Hooli:Unvested:S0012345      1680 HOOL.UNVEST

2014-04-02 open Assets:US:Hooli:Unvested:S0012345


2014-07-02 * "Award C123456"
  Assets:US:Hooli:Unvested:C123456        720 HOOL.UNVEST
  Income:US:Hooli:Awards                 -720 HOOL.UNVEST

2014-07-02 open Assets:US:Hooli:Unvested:C123456


2013-04-04 open Income:US:Hooli:RSU

2015-01-01 open Expenses:Taxes:TY2015:US:StateNY
2015-01-01 open Expenses:Taxes:TY2015:US:Federal
2015-01-01 open Expenses:Taxes:TY2015:US:SocSec
2015-01-01 open Expenses:Taxes:TY2015:US:SDI
2015-01-01 open Expenses:Taxes:TY2015:US:Medicare
2015-01-01 open Expenses:Taxes:TY2015:US:CityNYC

; Rounding errors accumulate here and are paid 2-3 months after vesting
2013-01-28 open Assets:US:Hooli:RSURefund

2013-04-04 open Assets:US:Schwab:HOOL

2001-01-01 open Assets:US:BofA:Checking


2015-05-27 * "Vesting Event - S0012345 - HOOL" #award-S0012345 ^392f97dd62d0
  doc: "2015-02-13.hooli.38745783.pdf"
  Income:US:Hooli:RSU                    -4597.95 USD
  Assets:US:Hooli:RSURefund               2458.97 USD
  Expenses:Taxes:TY2015:US:Medicare         66.68 USD
  Expenses:Taxes:TY2015:US:Federal        1149.48 USD
  Expenses:Taxes:TY2015:US:CityNYC         195.42 USD
  Expenses:Taxes:TY2015:US:SDI               0.00 USD
  Expenses:Taxes:TY2015:US:StateNY         442.32 USD
  Expenses:Taxes:TY2015:US:SocSec          285.08 USD

2015-05-27 * "Vesting Event - C123456 - HOOL" #award-C123456 ^392f97dd62d0
  doc: "2015-02-13.hooli.38745783.pdf"
  Income:US:Hooli:RSU                    -1970.55 USD
  Assets:US:Hooli:RSURefund               1053.84 USD
  Expenses:Taxes:TY2015:US:Medicare         28.58 USD
  Expenses:Taxes:TY2015:US:Federal         492.63 USD
  Expenses:Taxes:TY2015:US:CityNYC          83.75 USD
  Expenses:Taxes:TY2015:US:SDI               0.00 USD
  Expenses:Taxes:TY2015:US:StateNY         189.57 USD
  Expenses:Taxes:TY2015:US:SocSec          122.18 USD

2015-05-25 * "Conversion into shares" ^392f97dd62d0
  Assets:US:Schwab:HOOL                        18 HOOL {131.3700 USD}
  Assets:US:Hooli:RSURefund
  Assets:US:Hooli:Unvested:S0012345           -35 HOOL.UNVEST
  Expenses:Hooli:Vested                        35 HOOL.UNVEST

2015-05-25 * "Conversion into shares" ^392f97dd62d0
  Assets:US:Schwab:HOOL                         8 HOOL {131.3700 USD}
  Assets:US:Hooli:RSURefund
  Assets:US:Hooli:Unvested:C123456            -15 HOOL.UNVEST
  Expenses:Hooli:Vested                        15 HOOL.UNVEST


2015-06-13 * "HOOLI INC       PAYROLL" ^392f97dd62d0
  doc: "2015-02-13.hooli.38745783.pdf"
  Assets:US:Hooli:RSURefund                -94.31 USD
  Assets:US:Hooli:RSURefund                 -2.88 USD
  Assets:US:BofA:Checking                   97.19 USD

2015-06-14 balance Assets:US:Hooli:RSURefund  0 USD





2015-06-04 balance Assets:US:Hooli:Unvested:S0012345  1645 HOOL.UNVEST
2015-06-04 balance Assets:US:Hooli:Unvested:C123456    705 HOOL.UNVEST





2015-06-02 price HOOL.UNVEST               132.4300 USD.UNVEST



;; Example sale:
;;
;; 2013-04-04 open Assets:US:Schwab:Cash
;; 2013-04-04 open Income:US:Schwab:Gains
;;
;; 2015-09-10 * "Selling shares"
;;   Assets:US:Schwab:HOOL         -26 HOOL {131.3700 USD} @ 138.23 USD
;;   Assets:US:Schwab:Cash     3593.98 USD
;;   Income:US:Schwab:Gains
;;
;; 2015-09-11 balance Assets:US:Schwab:HOOL  0 HOOL
```

## Commodity 命名

投资标的 Commodity

美股按照交易所代码

    AAPL, SPY

港股以代号 `HK_` 开头，加 4 位数字

    HK_2800, HK0700

A 股和场内基金，代号以 `CN_` 开头加 6 位数字

    CN_000001

场外基金，以 `CN_F` 加 6 位数字

货币基金

## 获取标的物最新价格

待补充

## reference

- <https://beancount.github.io/docs/stock_vesting_in_beancount.html>
