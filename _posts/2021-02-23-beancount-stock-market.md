---
layout: post
title: "使用 Beancount 记账篇四：证券交易"
aliases: "使用 Beancount 记账篇四：证券交易"
tagline: ""
description: ""
category: [Beancount, 经验总结]
tags: [beancount, securities, 记账, 复式记账, accounting, bookkeeping, vesting, stock, rsu]
last_updated:
---

在我使用 Beancount 的过程中，让我收益最大的是让我知道了一个词 commodity ，直接翻译为通货，它不等同于金钱，也不是我们理解的钱。但是在记账的过程中使用最多的就是以货币单位，比如 CNY 人民币，USD 美元，HKD 港币来作为 commodity 记账。

Beancount 给我普及了 commodity，它可以是用于交换的任何物品或资源，比如可以是股票，可以是黄金，也可以是期权，也可以是加密货币等。这种灵活性使得 Beancount 在处理不同类型的资产时非常强大。

## Commodity

每一个投资标的就是一个 commodity, 比如现金 CNY, USD, 股票 SPY, AAPL ...

- 各国外汇按标准名称来：
  - `CNY`, `USD`, `CNH`, ...
- 美股代号按交易所代码来
  - `AAPL`, `GOOGL`
- 港股代号以 `HK_` 开头按 4 位数字命名
  - `HK_2800`, `HK_0700`
- A 股(含场内基金)代号以 `CN_` 开头按 6 位数字命名
  - `CN_000001`, `CN_510300`, ...
- 场外基金(货币基金除外)以 `CN_F` 开头按 6 位数字命名
  - `CN_F110011`
- 货币基金直接用 CNY 表示，收益需要手工更新(原因是货币基金无净值的概念)。
  - CNY

## 记录证券交易

股票交易中的「盈亏」，或者叫资本收益或损失，简称 P/L（也有缩写成 PnL，英语里面叫做 Profit and Loss)。

cost 成本价
price 最新价

```beancount
2010-08-29 * "店铺" "日常消费"
    Expenses:Food:Other    199.00 CNY
    Assets:DebitCard:CMB       -199.00 CNY
```

Beancount 中可以用同样的方式记录买入股票，比如以 2000 USD 买入 10 股 Google 股票，佣金 1 美元：

```beancount
2020-01-01 * "购入10股谷歌"
    Assets:Broker:Cash             -20001.00 USD
    Assets:Broker:GOOG        10 GOOG { 2000.00 USD }
    Expense:Broker:Commission 1 USD
```

同样可以使用断言：

```beancount
2020-01-02 balance Assets:Broker:GOOG 10 GOOG
```

卖出股票，比如

```beancount
2020-08-30 * "以2500卖出2股谷歌"
    Assets:Broker:GOOG    -2 GOOG { 2000.00 USD } @ 2500 USD
    Assets:Broker:Cash         5000 USD
    Expense:Broker:Commission 1 USD
    Income:Broker:PnL
```

单价使用 `@` 符号记录，总价使 `@@` 记录，比如下面的例子中 `@@` 就表示卖出一共收益。

```beancount
2020-08-30 * "以2500卖出2股谷歌"
    Assets:Broker:GOOG    -2 GOOG { 2000.00 USD } @@ 5000 USD
    Assets:Broker:Cash         5000 USD
    Income:Broker:PnL
```

这里 `Income:Broker:PnL` 就是股票盈亏账户。

通过 price 可以声明价格

比如，2021-01-01 Google 的股价上升到 3000 USD

    2021-01-01 price GOOG 3000 USD

## 花括号用于记录商品或股票的成本

在 Beancount 中，`{}` 符号用于记录商品或货币的成本。它通常用于跟踪投资商品的成本基础，以便在出售时计算资本收益或损失。

- **成本基础**：`{}` 用于指定商品或货币的成本价格。这在处理投资时尤其重要，因为它允许你在出售商品时追踪其成本，从而计算资本收益或损失。
- **匹配库存**：在减少库存（如出售股票）时，`{}` 用于指定要减少的特定批次的成本，以便正确匹配和减少库存。

比如购买了股票，并希望记录其成本

```
2024-08-03 * "购买 100 股 APPL 200 USD"
    Assets:Investments 100 APPL {200 USD}
    Assets:Cash -20000 USD
```

在这个例子中，花括号中的 200 USD 表示每股 APPL 股票的成本是 200 美元，当以后要出售这些股票时，Beancount 可以根据这个成本基础来计算资本收益或损失。

如果后来出售部分股票，要指定需要出售的股票的成本

```
2024-09-10 * "出售股票"
  Assets:Investments  -5 AAPL {200 USD}
  Assets:Cash          1000 USD
```

这个例子中，花括号用来确保从持仓中减少的股票是以 200 美元的成本持有的，这个有助于计算资本收益。

通过使用花括号可以准确地管理和跟踪商品的成本基础。

## 利用脚本自动填充 price 语句
待补充。


## reference

- <https://wzyboy.im/post/1317.html>
- 抓取价格 <https://gist.github.com/wzyboy/13dece71994f92e06f54d789df4564bc>
- <https://github.com/mckelvin/beancount-boilerplate-cn>
