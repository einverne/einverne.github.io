---
layout: post
title: "使用 Beancount 记账篇零：Beancount 入门使用"
aliases: "使用 Beancount 记账篇零：Beancount 入门使用"
tagline: ""
description: ""
category: Beancount
tags: [beancount, accounting, double-entry, bookkeeping, ledger ]
last_updated:
---

说起 Beancount，就不得不提[复式记账](/post/2019/11/double-entry-bookkeeping.html)，在之前的文章里面已经完整的叙述过复式记账是比单式记帐更加科学的记账方法，但是复式记账在目前只被大多数企业所采用，并没有被大众所接受，市面上也依然缺少复式记账的工具。而 Beancount 就是其中比较好用的一个工具。

## 为什么要用 Beancount 记账
为什么要用 Beancount 记账？ 要回答这个问题需要从两个方面说起，一方面是为什么要记账，另一方面是在这么多的记账软件中为什么要用 Beancount。

首先回答为什么要记账，在[之前的文章](/post/2019/11/double-entry-bookkeeping.html)中也提到过，通过记账是认识自己的一种方式，通过周期性的记账可以更好的理清自己的财务状况，可以对自己的[[资产损益表]]、[[资产负债表]]情况一目了然。尤其是当自己的收入一部分在银行，一部分在支付宝，一部分在微信，还有一部分在股市的时候，就很难具体地回答出自己到底有多少资产。并且如果不有意识地记录自己的每个月的开销，那么对自己的支出也可能非常模糊。通过记账不仅可以加深对自己的财务的了解，也可以根据支出的数据针对性的进行优化。就像启蒙我使用 Beancount 的 byvoid 的[文章](https://byvoid.com/zhs/blog/beancount-bookkeeping-1/) 中提到的那样，如果要达到财务自由，需要达到三点要求，对支出的预期，对资产和收入的了解，和对寿命的期望。而记账可以解决前两点。

再考虑一下第二个问题，相比较于其他的复式记账工具，为什么要选择 Beancount，回答这个问题之前，我就要先拿出我自己一贯的选择软件或者工具的准则，第一开源优先，第二跨平台，第三数据可以导出或自行管理。并且因为私人的财务数据是非常重要的个人隐私，我不相信任何托管数据的商业机构的软件。所以按照我的准则，我去了解支持复式记账的工具，有如下的选择：

- 开源并且跨平台的 [GnuCash](https://www.gnucash.org/)
- John Wiegley 的 [Ledger](https://github.com/ledger/ledger)，C++ 编写，基于命令行的复式记账工具
- [hledger](https://hledger.org/) 使用 Haskell 重新编写的 [Ledger CLI](https://ledger-cli.org/)
- Beancount 纯文本，命令行，Python 编写，[源自 Ledger](https://beancount.github.io/docs/beancount_history_and_credits.html)

除开第一个 GnuCash 下面三个都是纯文本的记账工具，纯文本工具带来的好处便是，可以将这个系统放入到版本控制，比如 Git 中，也可以将数据同步到其他平台。并且只要有一套渲染工具就可以提供非常详细的报表数据。Beancount 提供了 fava 这样基于 Web 的展示工具。[plaintextaccounting](https://plaintextaccounting.org/#software) 这个网站提供了更加详细的对比，对于这些纯文本的工具，只有自己掌握数据，那么从一个工具迁移到另一个工具的成本也不会很高。

我选择 Beancount 的理由便是，Beancount 足够简单，但又有丰富的扩展性，就像作者自己[说的](https://beancount.github.io/docs/a_comparison_of_beancount_and_ledger_hledger.html) 那样，简化了 Ledger 中的概念，并且通过自己的实践重新定义了 Beancount 的能力。

## 什么是 Beancount
经过上面这么多说明，Beancount 是什么就不需要多说了，需要记住的就是纯文本，复式记账工具，这两个重要的特性了。

Beancount 其他重要的特性：

- Python 编写可以直接运行在本地
- Beancount 提供自定义的货币单位，可以实现虚拟货币，证券交易等等场景，甚至可以将年假以天的方式记录到账簿
- 凭借 fava 提供了丰富的查询功能
- 可以利用 SQL 进行更加复杂的统计
- 可以通过脚本快速导入微信，支付宝，信用卡等账单


## 基础使用
在交易记录中，会使用 `+` 或 `-` 来表示资金的流动。一般来说：

- Assets 资产账户，正数表示资金增加，负数表示资金减少
- Income 收入账户，一般使用 `-` 负数表示
- Expense 支出账户使用 `+`, 表示支出增加
- Liabilities 负债账户，`-` 表示借款，负债增加，`+` 表示还款，负债减少

每一笔交易都是资金在这样四个基础账户中流转。

Beancount 定义了一些基本的语法规则，用户需要按照这样的规则对自己的交易进行记录。

定义使用的货币

    option "operating_currency" "CNY" ; 帐本货币
    option "operating_currency" "USD"

或者等熟悉了基本使用之后，可以用 `commodity` 来自定义货币。

```text
1990-01-01 commodity BTC
  name: "Bitcoin"
```

使用 `open` 和 `close` 来开通或关闭账户，在 Beancount 中作者将顶级的账户限制为了五类，Assets，Income, Expense, Liabilities, Equity。暂且可以按照字面去了解其具体作用，之后会再写一篇文章来讲述如何对这五类账户进行命名。

比如 2016年1月1日，开通了一个招行借记卡

    2010-11-11 open Assets:DebitCard:CMB CNY
      name: "招商银行借记卡"
      
    2010-01-01 open Income:Salary:Company CNY

开户的语法：

```
;开户，支持unicode, yyyy-MM-dd 表示开户时间
yyyy-MM-dd open 账户类型:命名:命名区别 货币[,货币2]  
```

2016年1月2日，收到第一笔工资，那么就是收入账户到资产账户的流转，钱从收入账户 `Income:Salary:Company` 中流转到刚开通的招行 `Assets:DebitCard:CMB`：

    2016-01-02 * "Income"
      Income:Salary:Company -1234 CNY
      Assets:DebitCard:CMB

这里需要注意的是收入一般使用 `-` 来表示。

在 2020年销户了

    2020-01-01 close Assets:DebitCard:CMB

记录交易，比如 2021年1月1日，使用招行的信用卡买了 40 元的咖啡。这个40 元被分别记录到两个账户中。

    2010-01-01 open Expenses:Drink:Coffee
    2010-01-01 open Liabilities:CreditCard:CMB

    2021-01-01 * "收付款方：某某咖啡店" "备注：Coffee"
      Expenses:Drink:Coffee        +40.00 CNY
      Liabilities:CreditCard:CMB

如果一笔交易只涉及到两个账户，根据正负平衡原则，第二个账户后面的 `-40.00 CNY` 可以省略。

交易的基本的语法可以简记为：

	[yyyy-MM-dd] [*|!] "payee" "备注"
	  [account1]          +[num] [currency-unit]
	  [account2]          (-[num] [currency-unit])

在日期后面有一个标识符，flag，用来标记交易的状态：

- `*` 完成的交易，确切的知道交易额
- `!` 未完成的交易，需要确认或修改交易额


记住这个公式：

     (Assets + Expenses) + (Liabilities + Income) + Equity = 0


这样就已经了解了 Beancount 的基本使用，先迈进第一步，后面再慢慢了解 Beancount 的货币转换，断言，账户平衡等等特性。

## Beancount 账户概念
在 Beancount 中每一笔交易都会被划进不同的账户中。

这里只对账户进行简单的介绍，之后会在展开。

Beancount 中的五类根账号：

- Assets 资产账户，可以用来记录现金，银行卡余额，证券账户余额等等
- Liabilities 负债，比如信用卡，房贷账户，车贷账户等等
- Income，收入账户，比如工资账户，其他收入账户等等
- Expense，开支账户，比如房租，日常用品，数码产品等等
- Equity，权益账户，一般不直接使用，Beancount 中一般用来平衡其他账户，比如初始化 Beancount 的使用

在 Beancount 中给账户命名，一般使用冒号来间隔，比如要记录一个外出打车的开支，可以命名成：

    2010-11-11 open Expenses:Transport:Taxi
    
同一分类下，还可以定义：

    2010-11-11 open Expenses:Transport:Public
    2010-11-11 open Expenses:Transport:Taxi
    2010-11-11 open Expenses:Transport:Bike

范围由粗略到详细，这样之后在 fava 中通过界面可以一层层通过统计得出，在出行方面的开支。

## Beancount 记录交易
在了解基本的 Beancount 之后，可以再举一些经常使用的例子。

### 收入
这里需要注意的是 Beancount 中，收入账户一般使用 `-` 来记录。

    2020-02-01 * "北京某有限公司" "工资"
      Income:Salary           -5000 CNY
      Expenses:Endowment      +1000 CNY; 养老保险
      Expenses:Unemployment     +30 CNY; 失业保险
      Expenses:Medical         +300 CNY; 医疗保险
      Expenses:Taxes           +100 CNY; 个人所得税
      Income:HousingFund       -500 CNY; 公司额外支付的住房公积金
      Assets:HousingFund      +1000 CNY; 住房公积金
      Assets:DebitCard:CMB    +3070 CNY; 招商银行工资卡

### 消费

    2020-02-29 * "超市" "食材 牛奶"
      Liabilities:CreditCard:BOC     -90 CNY; 交通银行信用卡
      Expenses:Food:Ingredients      +40 CNY; 食材
      Expenses:Food:Drinks           +50 CNY; 饮品

### 信用卡还款

```
    2021-01-05 * "信用卡还款"
      Assets:DebitCard:CMB           -100 CNY
      Liabilities:CreditCard:BOCOM   +100 CNY
```

如果遇到双币信用卡还款问题可以使用 `@` 转换汇率：

```
2021-09-25 * "购汇 还款"
  Liabilities:CreditCard:BOC:US              152 USD @ 6.461381579 CNY
  Assets:DebitCard:CMB                        -982.13 CNY
```

### 垫付

    2019-10-12 * "合租交燃气费用"
      Expenses:House:Gas         +200 CNY
      Liabilities:CreditCard:BOC -200 CNY
      Assets:WeChatPay         +150 CNY; 发回来的红包

### 初始化设置
使用 `pad` 来初始化账户。如果一开始的时候账户中本身有一些数据，可以使用 `pad` 来初始化账户。

比如在开始使用 Beancount 的时候银行卡中有 20000 人民币余额，那么就可以定义为：

```text
2019-01-01 pad Assets:DebitCard:CMB Equity:Opening-Balances
2019-01-02 balance Assets:DebitCard:CMB          20000.00 CNY
```


## Beancount 生成报表
Beancount 可以配合 `fava` 一起使用，使用 `pip install beancount fava`，然后执行：

    fava main.bean

fava 就会根据你在 `main.bean` 文件中定义的内容渲染一个网页端。官网提供了一个简单的例子。

- <https://fava.pythonanywhere.com/example-beancount-file/income_statement/>

在这个界面上可以看到 Income Statement [[资产损益表]]， Balance Sheet [[资产损益表]]，Trail Balance [[试算表]]，Journal 日记帐等等功能。

## reference

- <https://plaintextaccounting.org/#comparisons>
- [个人 Beancount 模板](https://github.com/einverne/beancount-sample)