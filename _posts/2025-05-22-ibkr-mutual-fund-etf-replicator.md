---
layout: post
title: "IBKR 使用教程系列之共同基金 ETF Replicator"
aliases:
- "IBKR 使用教程系列之共同基金 ETF Replicator"
tagline: ""
description: ""
category: 经验总结
tags: [ etf, ibkr, us-stock, stock-market,  ]
create_time: 2025-05-22 22:57:52
last_updated: 2025-05-22 22:57:52
dg-home: false
dg-publish: false
---

这两天在 [IBKR](https://gtk.pw/ibkr) 上买了一点按月分红的 ETF，然后在邮箱中就收到了 IBKR 发过来的建议邮件，说 IB 还提供了一个共同基金的工具可以来寻找类似表现，但是费用更低的其他 ETF，这就是一款 ETF 发掘工具。

![P39H](https://photo.einverne.info/images/2025/05/22/P39H.png)

所以收到邮件之后，我就立即定了一个计划，晚上回来就登录 IBKR 的后台，下载 Trader Workstation（TWS），然后在其中找到了这一款工具。

Mutual Fund/ETF Replicator 是一个非常使用的分析工具，可以帮助用户找到相似业绩的共同基金和 ETF，通过比较可以找到管理费用更低的组合。

Mutual Fund/ETF Replicator 工具在 Trader Workstation（TWS）中

- Mosaic 界面
  - 点击界面左上角「新窗口」，然后在搜索框中输入 Mutual Fund/ETF Replicator 并选择
  - 或者，点击「新窗口」，然后选择「更多高级工具（More Advanced Tools」，再从中选择「Mutual Fund/ETF Replicator」
- 标准模式（Classic TWS）界面
  - 在 TWS 界面顶部分析工具 Analytical Tools 中
  - 在下拉菜单「技术」（Technical）部分，选择「Mutual Fund/ETF Replicator」

![VvwMZpxW32](https://pic.einverne.info/images/VvwMZpxW32.png)

## 使用

在 Mutual Fund/ETF Replicator 工具界面的“共同基金输入框”(Mutual Fund/ETF Entry) 面板中，您需要输入您想要分析的共同基金或 ETF 的代码 (Symbol)。

![[Pasted image 20250522230723.png]]

在 Browse Mutual Funds 中也可以通过基金家族来查找比选择特定的基金。

您可以根据自己的计划修改“投资金额”(Investment Amount)，该金额将用于计算，如果要达到与原始基金相似的投资规模,需要购买多少推荐的 ETF。默认情况下,1 万美元的投资额，分别需要改买的股数。

流动性

在勾选「搜索时考虑流动性（Consider Liquidity During Search）选项，如果勾选此项,工具在筛选 ETF 时会优先考虑那些不仅管理费较低,而且流动性也较好的 ETF。流动性是指在不显著影响价格的情况下买卖证券的容易程度 这在市场波动较大的时候尤其重要 。

完成所有信息的入入之后,复制器会扫描市场并展示结果,通常会显示一个高度相关的单一 ETF 和一个可能高度相关的复合型 ETF。

你会在界面中看到如下的关键信息，包括了 ETF 代码、建议股数、投资百分比、基金全称、基金规模、基金类型、ETF 概览等等。

此外，该工具还会显示原始基金的基金家族，规模，所属行业，前端收费，后端收费，赎回费用等。
