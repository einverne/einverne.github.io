---
layout: post
title: "利用 AI 来完成实盘交易"
aliases:
  - "利用 AI 来完成实盘交易"
tagline: ""
description: ""
category: 经验总结
tags: [ai, deepseek, gemini, chatgpt, openai, market, financial, cryptocurrency]
create_time: 2025-10-31 09:53:48
last_updated: 2025-10-31 09:53:48
dg-home: false
dg-publish: false
---

## 基础知识

[[夏普比率]] 用来衡量投资者在承担每一单位风险时所获得的超额收益。这一指标由诺贝尔经济学奖得主威廉·夏普在 1966 年首次提出。

夏普比例回答了一个核心问题：我为了获得这些报酬冒了多少风险？他将投资组合的报酬减去无风险利率，再除以报酬的波动程度，从而得出一个数值。这个数值越高，代表该投资在承担相对风险的情况下带来的投资报酬效率越高。

简单来说，夏普比率的衡量是承受 1%的风险下能得到的报酬多少。夏普比率没有绝对的基准点，数字本身没有固定的意义，只有在与其他投资组合进行比较时才具有价值。

一般而言，夏普比率大于 1 表现良好；下谱比率大于 2 表现优秀。当下谱比率小于 0.5 时，风险调整后收益相对较低。 作为参考，单纯买进持有 S&P 500 指数的夏普比率大约在 0.5。

## Alpha Arena by Nof1

Nof1.ai 是一个使用多种大语言模型在金融交易市场进行实盘交易的竞争平台，通过统一的提示词比较不同 AI 模型在真实交易中的表现。

N-of-1 （N=1 试验）原本是一个医学试验，指的是单个患者多次交叉临床试验设计。

nof1.ai 的设计目标：

- 测试未经训练或微调的 LLM 的交易能力
- 评估不同模型的隐性偏见和默认交易行为
- 评估模型在真实，动态，高风险环境下的决策能力

Alpha Arena，这是全球首个以 AI 模型为对象，在真实市场用真实资金进行投资竞赛的基准测试。平台会给每个 AI 模型分配相同的初始资金（比如 $10,000），用在真实市场（当前是加密货币永续合约市场 Hyperliquid）进行操作。所有模型接受同样的输入提示和数据，目标是最大化风险调整后的收益。

平台给予包括 Qwen, DeepSeek, Claude, Grok, Gemini 和 GPT-5 在内的多个顶级 AI 模型各 10000 美元的真实资本。它们在去中心化交易所上进行 7x24 小时的自主交易，所有交易记录均在链上，完全透明。

![lkWtw6dbnD](https://pic.einverne.info/images/lkWtw6dbnD.png)

## RockFlow RockAlpha

[[RockFlow]] 发布的 [RockAlpha](https://rockalpha.rockflow.ai) 在真实的股票市场交易。

![K-Wm4U7geR](https://pic.einverne.info/images/K-Wm4U7geR.png)

## AI Trader

[AI Trader](https://github.com/HKUDS/AI-Trader) 是一个开源的项目，AI 大语言模型在交易 NASDAQ 100 上竞争，没有人类指令，

## 几个开源项目

仅用于教育和研究目的。

- [ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) 集成多个流派的投资风格给出具体的投资建议，买入，卖出还是保持
- [A_Share_investment_Agent](https://github.com/24mlight/A_Share_investment_Agent?tab=readme-ov-file) AI 投资系统，多个 Agent，每个都负责特定领域的分析，给出决策
- [ContestTrade](https://github.com/FinStep-AI/ContestTrade) 是 Python 编写的多 Agent 交易系统，基于 Internal Contest Mechanism
- [nofx](https://github.com/tinkle-community/nofx) 是一个自动化交易的开源项目，由 DeepSeek/Qwen AI 支持，支持 Binance Hyperliquid，Aster DEX exchanges 平台
- [Alpha Arena Lite](https://github.com/Moshiii/Alpha-Arena-Lite) OpenAI 分析加密货币投资趋势

## 最后

DeepSeek 不愧是量化交易公司搞出来的模型，在目前调研的所有市场中都表现良好，夏普比率也远超其他 AI 模型。相对于 Qwen 投注大起大落，以及 Gemini 的高频交易，DeepSeek 不仅维持了交易次数最低，而且还保持了收益最大。
