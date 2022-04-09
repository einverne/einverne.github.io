---
layout: post
title: "学习 Beancount 入门复式记账"
aliases: "学习 Beancount 入门复式记账"
tagline: ""
description: ""
category: 学习笔记
tags: [accounting, debits-and-credits, beancount, double-entry, ]
last_updated:
---

很早就听闻了复式记账这个名词，但是一直在我的 TODO 上没来得及消化，记得当时主要是看了 [wzyboy](https://wzyboy.im/post/1063.html) 和 [byvoid](https://www.byvoid.com/zht/blog/beancount-bookkeeping-1) 二位的文章，我关注的不同的人选择同样的方式来做一件事情，肯定是有意义的。所以当时我就将复式计帐和 Beancount 放到了我的 Trello 待办事项里面，这几天终于有时间来了解一下了。

首先什么是**复式记账**，相对复式来说的记账法是**单式记账**，我之前一直[在寻觅的记账软件](/post/2014/09/expense-app.html) 其实都是单式记帐，通过消费流水来记账，这种方式比较简单，只能够记录消费状况，其实对于自己财务的整体状况并不是很清楚，通过这样的记账方法最多只能统计到日常的消费状况，而无法回答诸如[[资产损益表]]、[[资产负债表]]等等个人帐务问题。并且对于信用卡消费还款这样的情况，单式记帐软件根本无法满足需求，而且如今个人的资金分散在支付宝，微信，银行卡，证券股票账户等等各种账户中，如果没有很好的管理，时间一长就非常难以追溯。就像 byvoid 在文章中所说的那样 ----"为什么要记账？实际上是要通过记录来增加对自我的认知。"

## prerequisite
在继续看下去之前，有一些需要提前了解的概念：

- assets（资产）, what you own(cash, money in bank)
- Liabilities（负债）, what you owe(credit card account, money you owe your friends)
- Equity (净资产)
- Dividend (红利，股息)，通过股票投资而获得的股息或红利

## 复式计帐
在了解复式计帐前有些名字概念需要提前了解，在提到复制记账额时候肯定会提到这一个恒等式：

![debits and credits](/assets/debits-and-credits.jpg)

也就是：

	Assets （资产） = Liabilities （债务） + Equity（权益，或者叫净资产 net worth，或者抵押资产）

转换一下就更好理解，一个人的净资产等于资产减去负债。理解净资产后，在记账软件中我们可能会记入

- 获得一笔收入，比如工资等等，这会增加净资产，这个被叫做 income
- 买食物，买图书等等支出，这会减少净资产，则这个被称为 expense
- 使用信用卡购物，则会增加相应的 Liabilities
- 但是从银行取钱，或者存入定期则并不会增加净资产，也不会减少净资产

资产和债务字面意思都比较好理解，Equity 直接翻译叫做净资产，又有翻译叫做权益，也有一个更细节的公式：

	Equity（权益，资产） = Owner's Equity（资产） - Dividends（应付红利） + Retained Earings（净收入）

也就是一个人的资产等于固有资产减去分红加上净收入。这里引入了一个 Dividends 的概念，这样的会计恒等式一般是针对公司主体而言的，所以应付红利则是表示公司对股东的分红。对个人债务而言很少会使用到 Dividends 这样的概念，所以简化一下，净收入又有：

	Retained earings（净收益） = Revenue（收入） - Expense （支出）

这个公式就比较好理解了。

![debits and credits equation](/assets/debits-and-credits-equation.jpg)

所以综上，得到了如上的公式，也就能总结出这几大账户，「其中有些公司记账相关的内容，比如 revenue，dividend，等这里就不提了」, 对于普通人大致可以总结出这几类：

- 资产 `Assets` —— 现金 (Cash)、银行存款、有价证券、Investment, Loans credits 等；
- 收入 `Income` —— 工资 (Paycheck)、奖金 (bonus)、Gift receives, Dividends, Interest 等；
- 费用或者支出 `Expenses` —— 税金 (Taxes)、外出就餐、购物、旅行、Gift given、捐款 (Donations) 等；
- 负债 `Liabilities` —— 抵押 (Mortgage)、信用卡应付款 (Credit Cards)、房贷 (house loans)、车贷 (car loans) 等；
- 权益 `Equity` —— 一般用来记录已有资产；

而这几类的划分也正好和后面要用的 [[Beancount]] 中默认的几类账户是有关系的。

## 复式记账的优点

一般的流水帐是从资金角度出发，比如，某年某月某日某时某刻买了什么东西，而复式记账则能记录资产的流动：

- 单式记账不考虑资金的来源，只记录消费支出
- 复式记账会考虑资金的去向，和来源，比如资产从收入账户转移到银行账户，或者是从银行账户转移到股票账户
- 复式记账可以将投资和消费区分开，甚至可以记录代金券，积分的账户
- 复式记账适合比较复杂，比如有赊账，债权的情况
- 复式记账可以提供除去开支记录之外的[[资产损益表]] (income statement)，[[资产负债表]] (balance sheet)，现金流量表，试算平衡表
- 复式记账容易检查出记录中产生错误的地方

### 借贷记账法
复式记账又分为了借贷记账法，和正负记账法，这里先介绍一下借贷记账法。

借 (debits) 贷 (credits)

Debits 和 Credits 是经济交易中的双向流动：

- Debits represent the flow of **economic benefit to a destination**
- Credits represent the flow of **economic benefit from a source**

> 有借必有贷，借贷必相等

例子：

假如用现金购买了 100 元文具。

| DEBIT（进） | CREDIT（出） |
| ----------- | ------------ |
| 文具        | 100 元       |

记账时需要分开记账

在文具账簿分类下

| DEBIT                | CREDIT |
| -------------------- | ------ |
| 2019-11-11 文具  100 |        |

在现金账簿下：

| DEBIT | CREDIT              |
| ----- | ------------------- |
|       | 2019-11-11 文具 100 |


又用信用卡 25000 购买了电脑：

工具分类下

| DEBIT                        | CREDIT |
| ---------------------------- | ------ |
| 2019-11-11 电脑 信用卡 25000 |        |

信用卡下：

| DEBIT | CREDIT                     |
| ----- | -------------------------- |
|       | 2019-11-11 电脑 工具 25000 |

这是常见的 T 字记账法，左边表示 DR 表示增加，右侧是 CR 表示减少。

### 正负记账法
相较于借贷记账，正负记账则是用 `+` 和 `-` 来分别代表流入和流出。非常相似。

假如用上面的例子，那就应该是：

	2019-11-11 支出：文具 +100
	2019-11-11 现金 	-100

## Why accounting?
更好的了解自己，认识自己的财务状况，这包括

- 整理自己的账户 (Account)，现金，股票账户，甚至虚拟货币账户
- 整理自己过去所有别人欠的，和欠别人的，比如信用卡账单，贷款等
- 了解自己能够支出的现金
- 通过了解自己的财务状况来优化自己的消费，比如不应该在某些方面过度开销

## Beancount
Beancount 是一款开源的复制记账软件，基于纯文本，按照特定语法书写的记账规则，可以非常轻松的生成各种资产报表。

> A double-entry bookkeeping computer language that lets you define financial transaction records in a text file, read them in memory, generate a variety of reports from them, and provides a web interface.

源代码：<http://furius.ca/beancount/>

因为开源所以 Beancount 有无限的扩展性：

- 支持货币转换
- 支持编写脚本自动导入银行账单
- 可以定制自己的 UI 界面
- 有非常丰富的图表，甚至可以通过 SQL 生成报表

Beancount 用 Python 编写，可以从 Pypi 中拉取，同时可以安装 fava 一款比较友好的展示界面, Web UI:

	pyenv local 3.6.1
	python -m venv beancount
	source beancount/bin/active
	pip install beancount fava

安装完成后可以使用这些命令：

- bean-bake
- bean-check
- bean-doctor
- bean-example
- bean-extract
- bean-file
- bean-format
- bean-identify
- bean-price
- bean-query
- bean-report
- bean-sql
- bean-web, Web server for Beancount ledgers. This uses the Bottle single-file micro web framework (with no plugins).

上手体验，使用 `bean-example` 输出样例：

	bean-example > example.bean

然后使用 fava 展示：

	fava example.bean

建议在安装体验完后，仔细阅读作者提供的[文档](https://docs.google.com/document/d/1RaondTJCS_IUPBHFNdT8oqFKJjVJDsfsn6JEjBG04eA/edit).

beancount 具体语法和使用方式 byvoid 的[这篇文章](https://www.byvoid.com/zht/blog/beancount-bookkeeping-2) 已经非常清晰，也就不在这里提了。这里只简单记录一下我需要记住的一些语法单词。

账户操作语法，创立账户、备注账户、注销账户：

	[yyyy-MM-dd] open Assets:Cash:CNY "CNY"
	[yyyy-MM-dd] note Assets:Cash:CNY "现金"
	[yyyy-MM-dd] close Assets:Cash:CNY

五种账户类型，Assets,Liabilities,Equity,Income,Expenses，分别对应资产、负债、权益、收入、支出。

账单语法：

	[yyyy-MM-dd] [*|?] "payee" "content"
	  [account1]          +[num] [currency-unit]
	  [account2]          (-[num] [currency-unit])


### 支付宝账单

- 支付宝账单，登录网页版查询
- 银行账单
- 其他账单可以使用这个工具 [beancount-import](https://github.com/jbms/beancount-import)

### 微信账单
微信账单可以通过如下方式导出，APP，通过“我”-“支付”-“钱包”-“账单”- 右上角“···”-“账单下载”。

导出的账单解压得到 csv，观察 csv 文件，前 16 行是账单信息，从第 17 行开始是真实有效的记录。包括了：

	交易时间	交易类型	交易对方	商品	收 / 支	金额（元）	支付方式	当前状态	交易单号	商户单号	备注

### 处理交通银行信用卡
一种比较直观的方式就是从每个月发送的账单中，将网页的表格下载成 CSV 文件，然后使用自定的脚本批量的添加到 Beancount 中。

[[2021-02-02-beancount-introduction]]

## 我的管理方式
新建一个目录专门用来记录，该目录使用 git 来做版本管理，敏感内容使用 git-crypt 加密。


## reference

- <https://plaintextaccounting.org/>
- <https://www.youtube.com/watch?v=VhwZ9t2b3Zk>
- <http://www.mathstat.dal.ca/~selinger/accounting/tutorial.html>
- [[fava 相关配置]]
- [个人 Beancount 模板](https://github.com/einverne/beancount-sample)