---
layout: post
title: "Beancount 支出账户设计"
aliases:
- "Beancount 支出账户设计"
tagline: ""
description: "如何设计一套清晰、易用的 Beancount 支出账户分类体系"
category: 经验总结
tags: [beancount, expense, double-entry, accounting, fava]
create_time: 2023-05-27 22:29:11
last_updated: 2026-01-20 00:00:00
---

在之前关于 [[Beancount]] 的文章中，我已经将复式记账的原理和实践进行了详细总结，也专门介绍了如何初始化自己的 Beancount 仓库。在建立 Beancount 账本初期，我们需要定义几大类的账户：

- assets.bean：资产账户
- liabilities.bean：负债账户
- income.bean：收入账户
- expense.bean：支出账户
- equity.bean：权益账户，用来平衡和初始化账户
- price.bean：价格定义文件，用来记录货币和资产价格

本文主要深入探讨支出账户的设计，特别是如何建立一套清晰、易于记忆和维护的支出账户命名体系。

## 核心分类体系：衣食住行游

虽然你可以根据自己的情况定义任何账户名称，但为了方便记忆和管理，我将支出账户划分成了五大核心分类：衣食住行游。这个分类方式覆盖了日常生活的主要支出场景，既简单易记，又足够全面。

结合 [[Fava]] 的可视化功能，这种分类方式可以清晰地展示出各类支出的占比，帮助我们更好地了解消费结构。因此，我将这五大分类作为支出账户的第二层级：

- `Expenses:Clothing`：衣着相关支出（服装、鞋帽、配饰等）
- `Expenses:Food`：饮食相关支出（餐饮、食材、零食等）
- `Expenses:House`：居住相关支出（房租、水电、家居用品等）
- `Expenses:Transport`：交通相关支出（交通费、车辆维护、燃油等）
- `Expenses:Travel`：旅游娱乐支出（旅行、景点门票、娱乐活动等）

## 具体示例：House 住房支出

以最常见的租房场景为例，我的二级分类是 House，然后在第三级细化具体的支出类型。比如租房开支就是：

```
Expenses:House:Rent
```

与住房相关的其他开支都可以放在 House 这个二级分类下：

```
2010-11-11 open Expenses:House:Rent              ; 房租
2010-11-11 open Expenses:House:Water             ; 水费
2010-11-11 open Expenses:House:Electricity       ; 电费
2010-01-01 open Expenses:House:Gas               ; 燃气费
2010-01-01 open Expenses:House:Internet          ; 网费
2021-06-10 open Expenses:House:Commodity         ; 住房日常开销
2021-06-10 open Expenses:House:Maintenance       ; 房屋维修
2021-06-10 open Expenses:House:Furniture         ; 家具购置
```

通过这样的分类，在 Fava 界面上可以非常清楚地看到 House 这一大类在所有支出中的占比，同时也能细化到每一项具体开支的金额和趋势。

## 扩展分类：根据个人需求定制

除了日常的衣食住行游这五大基本分类，你可以根据自己的实际需求开设其他分类。

比如对于数字化生活场景较多的用户，可以建立一个 Digital 分类，专门归集数字产品和服务的支出：

```
2020-01-01 open Expenses:Digital:Software         ; 软件订阅
2020-01-01 open Expenses:Digital:Domain           ; 域名费用
2020-01-01 open Expenses:Digital:Hosting          ; 服务器托管
2020-01-01 open Expenses:Digital:Game             ; 游戏购买
2020-01-01 open Expenses:Digital:Music            ; 音乐订阅
2020-01-01 open Expenses:Digital:Video            ; 视频会员
```

如果你有投资理财的习惯，也可以单独建立 Investment 分类：

```
2020-01-01 open Expenses:Investment:Commission    ; 交易手续费
2020-01-01 open Expenses:Investment:Management    ; 管理费用
2020-01-01 open Expenses:Investment:Tax           ; 投资相关税费
```

对于有健康管理需求的用户，可以建立 Health 分类：

```
2020-01-01 open Expenses:Health:Medical           ; 医疗费用
2020-01-01 open Expenses:Health:Fitness           ; 健身开支
2020-01-01 open Expenses:Health:Supplement        ; 保健品
2020-01-01 open Expenses:Health:Insurance         ; 医疗保险
```

## 分类设计的原则

在设计支出账户分类时，建议遵循以下原则：

1. 层级清晰：通常 2-3 层就足够了，过深的层级反而增加记账负担
2. 易于记忆：使用直观的英文单词或缩写，避免过于复杂的命名
3. 保持一致：同一层级的分类应该使用统一的命名规范
4. 适度细化：在可管理性和精确度之间找到平衡点
5. 灵活调整：随着生活变化，及时调整分类体系

## 参考资源

在设计支出账户分类时，可以参考以下资源获取灵感：

1. [我的 Beancount 示例仓库](https://github.com/einverne/beancount-sample)：包含了完整的账户分类体系
2. [BMPI 的 Beancount 实践](https://www.bmpi.dev/self/beancount-my-accounting-tool-v2/)：详细介绍了他的记账工具和方法论
3. [YNAB 分类系统](https://github.com/andreasgerstmayr/fava-dashboards)：可以快速区分刚需消费和非刚需消费，结合 fava-dashboards 插件使用效果更好
4. [Beancount 账户模板](https://github.com/dallaslu/beancount-template/blob/main/accounts/expenses.bean)：一个很好的支出账户分类参考

## 总结

一个好的支出账户分类体系应该既能满足日常记账的需要，又不会过于复杂难以维护。通过衣食住行游这样的核心分类，结合个人实际需求的扩展分类，可以建立起一套清晰、易用、可持续的个人财务记录系统。

记住，分类体系不是一成不变的，随着生活方式的变化，适时调整和优化你的分类体系才是长期坚持记账的关键。



