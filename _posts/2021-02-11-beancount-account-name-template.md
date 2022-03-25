---
layout: post
title: "使用 Beancount 记账篇一：给账户命名"
aliases: "使用 Beancount 记账篇一：给账户命名"
tagline: ""
description: ""
category: Beancount
tags: [ beancount, accounting, bookkeeping, double-entry, ]
last_updated:
---

在之前整理[复式记账](/post/2019/11/double-entry-bookkeeping.html) 的文章中曾短暂的提及过 Beancount，上一篇文章简单介绍了一下 [Beancount](/post/2021/02/beancount-introduction.html)，现在经过一段时间的使用，也正好回顾总结一下自己的使用经历和经验。

要入门 Beancount 的使用，其中最重要的第一步便是充分的认识 Beancount 中的账户概念，在复式记账中资金都是在账户与账户之间流转，因此账户就非常重要。但是因为 Beancount 的入门难度要远远超过其他的记账软件，所以迈出第一步就变得至关重要，迈出了这第一步后面就会发现 Beancount 能带来远超预期的收益。

在 Beancount 中内置类几类账户，这几类账户会用来生成最后的 [[资产损益表]]、[[资产负债表]] 等等报表。这几类账户在之前的[文章](/post/2019/11/double-entry-bookkeeping.html)中也提及过：

- Assets
- Income
- Expense
- Liabilities
- Equity

在 fava 展示损益表的时候会使用到 Income 和 Expense，而在展示负债表的时候会用到 Assets, Liabilities 和 Equity。

## 文件组织
在构建了一个完整的命名体系之前，可以先对 Beancount 帐本进行提前的规划。比如我以如下的方式管理：

```
├── account
│   ├── assets.bean
│   ├── equity.bean
│   ├── expenses.bean
│   ├── income.bean
│   ├── liabilities.bean
├── beans
│   ├── 2020.bean
│   ├── 2021
│   │   ├── 01.bean
│   │   ├── 02.bean
│   │   ├── 03.bean
│   │   └── 04.bean
│   ├── 微信\224\230账\215\225(20200701-20200930).bean
│   └── 微信\224\230账\215\225(20201001-20201231).bean
├── config.py
├── datas
│   ├── 微信\224\230账\215\225(20200701-20200930).csv
│   └── 微信\224\230账\215\225(20201001-20201231).csv
├── importers
│   └── beanmaker.py
├── main.bean
├── processing.sh
├── requirements.txt
```

说明：

- account 账户中只定义 `open` 和 `close` 账户的语句，不同的名字命名的账户分开管理
- beans 目录中是真正记录交易的地方
- datas 目录则是账单的原始数据
- `main.bean` 主帐本的定义
- `processing.sh` 以及 `importers` 是处理原始账单数据的脚本

在 `main.bean` 中通过 `include` 语法将其他 bean 引入，同时还定义了一些可选项。


    option "title" "ledger" ; "我的账本" ledger
    option "operating_currency" "CNY" ; 帐本货币
    option "operating_currency" "USD"

    ; fava
    2016-04-14 custom "fava-option" "auto-reload" "true"

    include "account/*.bean"
    include "beans/*.bean"

剩下的其他几个文件一个是配置从原始账单自动生成对应 `bean`，以及提前预处理账单的脚本 `processing.sh`，这部分内容会在后续介绍多个类型账单导入的文章中介绍。

当然你并不需要按照这样的方式来管理，Beancount 完全支持在一个文件中记录所有的内容，就像[这个演示](https://fava.pythonanywhere.com/example-with-budgets/editor/) 那样。

## 给 Assets 账户命名
对于个人而言，如果用最通俗的语言来解释 Assets 的话，「那就是你所拥有的资产」，这个资产包括现金，银行的存款，证券市场上的股票等等能够产生购买力的，或者能够用来清还债务的东西。

对于国内的场景，可能还会有账户叫做支付宝余额，或者微信零钱。那么有这样的概念之后就可以轻松的定义出这样的账户。

    ; 现金
    2010-11-11 open Assets:Cash

    ; 支付宝
    2015-11-11 open Assets:Alipay:Balance ;"余额"

    ; 微信余额
    2010-01-01 open Assets:WeChat:Balance

    ; 老虎证券
    2018-06-01 open Assets:Broker:US:Tiger

    ; 银行账户来
    2010-11-11 open Assets:DebitCard:CMB CNY

去除上面这些比较好理解的实体账户，还有一类虚拟账户，比方说借钱给了张三10000元，那么就应该开一个「应收款」账户：

    ; 欠的钱
    2000-01-01 open Assets:Receivables:Zhangsan CNY

记录一笔交易

    2000-03-09 * "借钱给张三 100000"
      Assets:Receivables:Zhangsan 10000 CNY
      Assets:DebitCard:CMB   -10000 CNY
    
等张三将钱归还，就可以将此账户关闭：

    2001-01-01 close Assets:Receivables:Zhangsan
    
但是如果要去通过 Beancount 来记录证券交易，那么便会稍微复杂一些。之后会再写新的文章进行总结。


## 给 Income 账户命名
收入账户也比较好理解，有多少收入便开通多少个收入账户。一般来说如果是月工资则会按序进入上面开的银行账户。如果年终有奖励则还会开一个 Bonus 的账户。

    2010-11-11 open Income:Salary:Hooli CNY  	; "Regular Pay"
    2010-11-11 open Income:Bonus:Hooli  CNY 	; "Annual bonus"

对于普通的收入账户比较明确，但是如果要记录比如未成熟的期权，股票等，则就稍微复杂一些，之后再用其他文章说明。

## 给 Expense 账户命名
开支账户是一个相对比较繁琐的账户，但理念非常容易理解。在普通的记账软件中，一般会对消费进行分类，那么就可以根据自己的真实情况将这一个分类搬到 Beancount 的 Expense 账户中。

如果之前没有使用过类似的记账软件，那么大概也会知道可能有那么几类，衣、食、住、行。日常生活的开支基本上这几大类也都覆盖了，其他的开支账户可以等用到的时候再建立。

可以来参考一下其他软件的账户分类。

对于开支账户，不建议设置很多，但也不建议设置得比较笼统，需要自己把握那个度。开设很多账户在记账的时候就会需要花费很多时间思考一笔交易被划分到哪个账户；而设置的比较少的时候，后期进行统计的时候就没有区分度。

在创建账户的时候也可以参考一些市面上成熟的应用的内置分类。

之前用过的一个叫做 Wallet 的应用的内部账户分类。

    Food & Drinks
        Bar, cafe
        Groceries
        Restaurant, fast-food
    Shopping
        Clothes & shoes
        Drug-store chemist
        Gifts
        Jewels
        Pets
        Stationery
    Housing
        Energy
        Maintenance
        Mortgage
        Property insurance
        Rent
        Services
    Transportation
        Business trips
        Long distance
        Public transport
        Taxi
    Vehicle
        Fuel
        Leasing
        Parking
        Rentals
        Vehicle insurance
        Vehicle maintenance
    Life & Entertainment
        Sport
        fitness
        Alcohol
        Book, audio, subscriptions
        Charity
        Wellness
    Communication
        Internet
        Phone
        Postal Services
        Software
   
再比如 MoneyWiz 默认账户名

    Automobile
      Accessories
      Car Insurance
      Gas/Fuel
      Lease
      Maintenance
      Other
      Parking
    Bills
      Cable
      Electricity
      Gas
      Internet/Broadband
      Mobile Phone
      Other
      Phone
      Water
    Clothing
      Accessories
      Clothes
      Jewelry
      Other
      Shoes
    Digital
      Apps
      Books
      Movies
      Music
      Other
      Podcasts
      TV Shows
    Food & Dining
      Dining/Eating Out
      Groceries
      Other
    Health Care
      Dental
      Eye Care
      Health Insurance
      Medical
      Other
      Pharmacy
    Housing
      Furniture/Accessories
      Home Insurance
      Maintenance
      Mortgage
      Other
      Rent
    Leisure
      Entertainment
      Fitness/Sport
      Other
      Personal Care
    Loans
      Other
      Taxes
      Transportation
      Travel

当然我觉得个人没有必要划分的这么细，可以在使用的过程中再逐步增加分类。

    ; 衣、鞋
    2010-01-01 open Expenses:Dressup:Clothing

    ; 食
    2010-01-01 open Expenses:Food:Drinks ;"饮料"
    2010-01-01 open Expenses:Food:Fruits ;"水果"

    ; 住
    2010-11-11 open Expenses:House:Rent              ; 房租
    2010-11-11 open Expenses:House:WaterElectricity     ; 水费、电费
    2010-01-01 open Expenses:House:Gas ;"燃气"

    ; 行
    2010-11-11 open Expenses:Transport:Public
    2010-11-11 open Expenses:Transport:Taxi

    ; other
    2010-01-01 open Expenses:Digital


开支分类这个事情也可以做的比较智能一些，比如通过学习，[自动进行分类](https://github.com/beancount/smart_importer)。

不过我个人还是觉得通过关键字自动进行开支账户的导入还是足够精确的。

## 给 Liabilities 账户命名
最常见的负债账户就是信用卡了，可以将开卡的时间以及开卡的银行记录下来。以后按月整理信用卡账单就会方便很多。

如果涉及到房贷等等，其实是差不多的。

比如开通一个交通银行信用卡的账户：

    2010-11-11 open Liabilities:CreditCard:BOC CNY

和之前一样，在处理借款的时候，也可以用账户来追踪：

    ; 欠钱
    2000-01-01 open Liabilities:Payables:Zhangsan CNY

Beancount 这样的纯文本记账工具，对于账户开通和关闭处理几乎没有成本，可以任性地添加账户。

## 命令规范
命名规范可以简化理解的成本，和代码规范一样，帐本被阅读的次数肯定要比记录的时候要多，尤其是当帐本越来越复杂的时候。一套有机完整的命名不仅可以让记账更人性化，也可以免去之后再去频繁修改账户名字的烦恼。

个人为 Beancount 的账户命名应该要遵守几点：

- 账户名要尽量详细，但不应该太长，个人使用的习惯一般不会超过3级目录。
- 帐户名有大到小整理，在 fava 界面中，多级账户会进行归类求和，可以清晰地看到上一级账户的总额
- 在初始开通账户的时候尽量采用详细的多级账户，在未来合并账户的操作可以通过替换完成，但是拆分账户的操作则需要一一核对
- 降低记账的认知负担，在确定好帐户名之后尽量可以通过直觉直接确定应该归属到哪一类账户。

## 附录

### mint-categories
mint-categories https://www.mint.com/mint-categories

```
Expenses (all types)
  1. Rent/Mortgage
      a. Home Owners Association Dues
      b. Rental Insurance
      c. Home Owners Insurance
  2. Fixed Expenses
      a. Utilities
      b. Gas
      c. Electric
      d. Water/Trash/Sewer
      e. Cable/Internet/Phone
      f. Cell Phone
      g. Credit Cards
      h. Car Expenses
      i. Maintenance
      j. Gas
  3. Extra Expenses
      a. Grocery (Food)
      b. Clothes/Shoes/Hygiene
      c. Extra for Home Expenses
  4. Savings
      a. Savings Account. Speak with employer; some saving plans can pull from paycheck before taxes. That means less of your paycheck is taxable.
      b. Create an Emergency Fund; it should be at least 6 months of expenses. Emergencies can happen and drain a well-established savings account
  5. Taxes
      a. No explanation needed
  6. Fun Cash
      a. Out with friends
      b. Movies
      c. Vacations
```


### GnuCash

      Adjustment
      Auto
          Fees
          Gas
          Parking
          Repair and Maintenance
      Bank Service Charge
      Books
      Cable
      Charity
      Clothes
      Computer
      Dining
      Education
      Entertainment
          Music/Movies
          Recreation
          Travel
      Gifts
      Groceries
      Hobbies
      Insurance
          Auto Insurance
          Health Insurance
          Life Insurance
      Laundry/Dry Cleaning
      Medical Expenses
      Miscellaneous
      Online Services
      Phone
      Public Transportation
      Subscriptions
      Supplies
      Taxes
          Federal
          Medicare
          Other Tax
          Social Security
          State/Province
      Utilities
          Electric
          Garbage collection
          Gas
          Water
      
 
### 其他模板

- <https://github.com/mckelvin/beancount-boilerplate-cn/blob/dev/ledger/account.beancount>


## reference

- [个人 Beancount 模板](https://github.com/einverne/beancount-sample)