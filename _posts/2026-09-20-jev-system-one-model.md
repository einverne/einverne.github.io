---
layout: post
title: "Jev：不聊天只做判断的 System One 决策模型"
aliases:
  - "Jev：不聊天只做判断的 System One 决策模型"
  - "Jev"
  - "TypeSafe Jev"
tagline: "不生成文字，只返回带概率的结构化判断"
description: "介绍 TypeSafe AI 发布的 System One 模型 Jev，包括它和 LLM 的区别、Noul、Choice、Score 三种问题类型、适用场景、上手方式以及当前版本的局限"
category: 产品体验
tags: [ llm, jev, typesafe-ai, system-one, openai, coding, workflow]
create_time: 2026-09-26 16:16:23
last_updated: 2026-09-26
---

过去一两年，大模型的发展方向几乎都是更长的思考链、更大的上下文、更强的 Agent 能力。但在日常写代码和搭建自动化流程的过程中，我发现很多地方用到大模型，其实只是为了让它做一个简单的判断，却要付出几秒钟的等待和解析 JSON 的麻烦。TypeSafe AI 发布的 Jev 走了一条相反的路：不聊天、不写代码，只做快速的判断。

## Jev 是什么

Jev 是 [[TypeSafe AI]] 在 2026 年 9 月 15 日以抢先体验（early access）形式发布的第一个公开模型，也是官方提出的第一个 System One 模型。Jev 不生成文字，而是做判断：输入一段非结构化的上下文，加上事先定义好的问题和可选答案，Jev 直接返回带概率的结构化结果，代码可以拿来直接做分支、排序或路由。

官方对它的定位是一句话：

> Think of Jev as a frontier-intelligence function call: unstructured state in, typed probabilistic decisions out.

也就是说，Jev 更像一个「带智能的函数调用」，而不是聊天机器人。

传统的 LLM 的主要能力是和人聊天，以及在 Coding Agent 上生成代码。但在真实的软件和自动化流程里，很多环节并不需要一段文字，而只需要一个决定：这封邮件是否紧急、这个工单交给哪个部门、这条评论是否违规。用 LLM 来做这些事，通常要写 Prompt、等模型逐字生成、再解析输出，速度慢、成本高，还可能遇到格式错误。Jev 就是为这类场景设计的，官方把它称为「smart if-statements」，即可以嵌进普通代码里的智能判断规则。

### System One 的含义

官方把 Jev 模型称为 System One 模型，灵感来自 [[Daniel Kahneman]] 的《[[思考，快与慢]]》。

系统一是人类大脑中负责快速直觉判断的部分，系统二是负责缓慢、深度推理的部分。现在的大语言模型通过思维链等方式，越来越往系统二的方向发展；Jev 则反过来，专注于系统一，即「一个知识丰富的人在几秒钟之内就能做出的判断」。书中认为系统一容易出错，TypeSafe 的观点是，这类模型可以被训练得比其他方案更可靠。

### 和 LLM 的区别

- 生成方式不同：LLM 是自回归模型，一个 Token 接一个 Token 地生成，每一步都依赖上一步；Jev 使用并行采样器，一次查询就把所有输出的概率同时算出来
- 输出不同：Jev 不输出自由文本，只在事先定义好的答案范围里做选择，所以不会出现格式错误，也不会编造一个不存在的选项
- 训练方法不同：LLM 常用 [[RLHF]] 或 RLVR 训练，目标是生成人类更喜欢的文本；Jev 使用 TypeSafe 提出的 RLCD（Reinforcement Learning for Calibrated Decisions），目标是在结构化判断上给出校准过的、诚实的概率
- 输出附带置信度：每个答案都带有概率和置信度，代码可以根据置信度决定是否执行、是否转人工

需要注意的是，「不会幻觉」指的是答案的格式永远正确，并不代表判断一定正确。模型仍然可能在 3 个选项中很自信地选错。

### 名字的由来

Jev 这个名字来自英国经济学家 [[William Stanley Jevons]]，也就是「[[杰文斯悖论]]」的提出者。杰文斯悖论指的是，当一种资源的利用效率提升、使用成本下降之后，它的总消耗量反而会增加。蒸汽机效率提升之后，煤炭的消耗不降反升。TypeSafe 认为机器智能也会走同样的路：当判断变得足够便宜和快速，软件中使用 AI 的地方会成倍增加。

### 背后的公司

TypeSafe AI 的创始人是 Diogo Almeida，他曾在 [[OpenAI]] 参与指令遵循方向的研究，这些工作后来成为 [[ChatGPT]] 背后的研究基础（InstructGPT / RLHF）。公司在隐身状态下研发了 2 年才对外发布产品，据媒体报道，公司由 DCVC 领投完成了 4000 万美元融资。

## Jev 的优势

以下数据来自 TypeSafe 官方：

- 输出结构永远正确：直接返回结构化结果，结构化输出的错误率为 0，不需要解析 JSON，也不需要格式错误时的重试逻辑
- 速度快：端到端响应时间在 70 到 500 毫秒，官方给出的前沿大模型对比数据是 3 到 329 秒，在分类任务上最多快 200 倍左右
- 价格低：输入每百万 Token 只需要 0.042 美元，输出 Token 完全免费，比传统大模型便宜 2 个数量级
- 附带概率和置信度：每个答案都有经过校准的概率，代码可以据此决定自动执行还是转人工
- 多个问题并行：一次请求中可以同时问很多问题，响应时间基本不变。官方 Cookbook 中把 13 个问题合并到一次调用里，比逐个调用便宜 12.2 倍、快 10 倍，而且答案没有变化
- 数据不用于训练：Jev 不会使用客户的请求和响应训练模型，企业客户还可以申请零数据保留（ZDR）

在我们的自动化流程当中，有大量这样的判断，比如这个任务要交给哪个模型处理、这封邮件是否紧急、这个工单要转给哪个部门。过去这些判断要么写成固定的规则，要么交给 LLM，前者不够灵活，后者又慢又贵，Jev 正好填补了两者之间的空白。

## 适用场景

官方把 Jev 的用途归为 4 类：

- AI 工作流中的判断规则：也就是官方所说的 smart if-statements，把结构化的判断结果当作普通代码中的条件分支，代替难以维护的正则和规则，比如工单分类、邮件分级、内容审核
- 大规模数据处理：对大量数据做 map-reduce 式的打标、过滤和打分，价格足够低，才让海量数据逐条调用模型成为可能
- 实时应用：响应在毫秒级，官方演示了让 Jev 根据文字描述的游戏状态实时玩 Doom，以及玩 Wikipedia 竞速游戏
- 检查其他 AI：给 LLM 的输入和输出打分、做评判、加护栏，以及检测越狱攻击

官方文档中还有 20 多个 Cookbook 示例，比较有代表性的有：

- 意图路由：先用 Jev 判断请求类型，简单请求交给确定性代码处理，复杂请求交给专门的 LLM，拿不准的交给人工
- LLM 护栏：用一次请求检查 LLM 应用所有的输入和输出消息，根据风险概率和严重程度决定放行、复核、拦截或转交
- RAG 段落筛选：对检索回来的每个段落打分，只把相关的段落交给负责回答的模型
- 引用核查：检查引用的原文是否真的支持结论，找出 LLM 编造的引用
- 重排序：在法律检索数据集 CLERC 上，对 BM25 召回的 30 个候选段落逐一判断，top-1 准确率从 5% 提升到 18%，top-10 准确率从 38% 提升到 62%
- 层级分类：对专利、商品、代码等层级很深的分类体系，逐层用 Choice 分类，并用 beam search 保留多条候选路径

从这些例子可以看出，Jev 并不是要取代 LLM，而是和 LLM 配合使用：LLM 负责生成和复杂推理，Jev 负责其中大量快速、便宜的判断。

## Jev 调用方式

Jev 的调用依赖两个部分：

- state，状态，也就是上下文，可以是消息、邮件、文章、JSON 数据等，官方特别强调可以直接传入程序中的结构化状态
- questions，让模型判断的问题，是一个由问题 ID 和问题定义组成的字典

然后 Jev 就能直接返回结构化的答案。

一次请求可以同时包含多个问题，每个问题都会针对同一个 state 并行、独立地进行判断，所以多加几个问题几乎不会增加响应时间，问题之间也不会互相干扰，不会出现 LLM 上下文越长效果越差的「上下文腐烂」问题。

## 3 种问题类型

Jev 支持 3 种问题类型：

- Noul，回答是否的问题，Jev 返回为「是」的概率
- Choice，回答选择题，让 Jev 从给定的选项中选出一个
- Score，评分题，让 Jev 在一个有顺序的等级中给出评分

3 种问题可以在同一次 API 调用中混合使用。

### 请求示例

官方 Quick Start 中的例子，用一条客服工单同时问了 3 个问题：交给哪个部门处理、用户有多不满、是否紧急。

```json
{
  "model": "jev-latest",
  "state": "Hi, I've been trying to connect my Stripe account for 3 days and the integration keeps failing. I'm losing sales. Please help ASAP.",
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "Which team should handle this",
      "criteria": {
        "billing": "Payment or subscription issues",
        "technical": "Bugs or integration problems",
        "sales": "Pricing or account questions"
      }
    },
    "frustration": {
      "type": "score",
      "instructions": "How frustrated the customer appears",
      "criteria": [
        "Calm, just stating facts",
        "Frustrated but civil",
        "Very angry, strong language"
      ]
    },
    "is_urgent": {
      "type": "noul",
      "instructions": "The message conveys urgency or time-sensitivity"
    }
  }
}
```

返回结果：

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "department": {
      "type": "choice",
      "choice": "technical",
      "confidence": 0.78,
      "probabilities": {"technical": 0.85, "sales": 0.0, "billing": 0.15}
    },
    "frustration": {
      "type": "score",
      "score": 1.0,
      "confidence": 1.0,
      "legend": {
        "0": "Calm, just stating facts",
        "1": "Frustrated but civil",
        "2": "Very angry, strong language"
      },
      "probabilities": {"0": 0.0, "1": 1.0, "2": 0.0}
    },
    "is_urgent": {"type": "noul", "noul": 1.0}
  },
  "usage": {"input_tokens": 392, "output_tokens": 65}
}
```

department 判断为 technical（概率 0.85，置信度 0.78），frustration 评分为 1.0，即「Frustrated but civil」，is_urgent 为 1.0。`model` 字段返回的是实际使用的版本号，这次请求消耗了 392 个输入 Token，而输出 Token 是免费的。

也可以使用官方的 Python SDK（需要 Python 3.10 及以上版本）：

```bash
pip install typesafe-sdk
```

```python
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

# 默认从环境变量 TYPESAFE_API_KEY 读取 API Key，默认模型为 jev-latest
client = TypeSafeClient()

ticket = "Hi, I've been trying to connect my Stripe account for 3 days and the integration keeps failing. I'm losing sales. Please help ASAP."

response = client.system_one(
    state=ticket,
    questions={
        "department": Choice(
            instructions="Which team should handle this",
            criteria={
                "billing": "Payment or subscription issues",
                "technical": "Bugs or integration problems",
                "sales": "Pricing or account questions",
            },
        ),
        "frustration": Score(
            instructions="How frustrated the customer appears",
            criteria=[
                "Calm, just stating facts",
                "Frustrated but civil",
                "Very angry, strong language",
            ],
        ),
        "is_urgent": Noul(
            instructions="The message conveys urgency or time-sensitivity",
        ),
    },
)

print(response.answers["department"].choice)  # "technical"
print(response.answers["frustration"].score)  # 1.0
print(response.answers["is_urgent"].noul)     # 1.0
```

### Noul：是非题

Noul 用来回答一个「是或否」的问题，或者判断一句陈述是否成立，比如「这条消息是否在申请退款」「这份简历是否有 Python 经验」。

请求参数：

- `type`：固定为 `noul`
- `instructions`：要判断的问题或陈述
- `criteria`：可选，用 `true` 和 `false` 两个字段分别描述什么情况算「是」、什么情况算「否」

返回结果只有一个 0 到 1 之间的数字 `noul`，表示答案为「是」的概率，0 表示否，1 表示是。因为一个数字已经同时描述了两种结果，所以 Noul 没有单独的 `confidence` 字段。

```json
{"type": "noul", "noul": 0.99}
```

使用建议：

- 一个 Noul 只问一件事，复合问题拆成多个 Noul，再在代码中组合
- 让「是」对应高分，避免「这条消息是否不包含个人信息」这种否定问法，否则代码里很容易把判断写反
- 根据犯错的代价设置阈值：两种错误代价差不多时用 0.5；误判为「是」代价很高时（比如自动退款）把阈值调高；漏掉真正的「是」代价很高时把阈值调低
- 中间地带交给人工，比如官方示例中大于 0.8 判定为是，小于 0.2 判定为否，中间的交给人工复核
- Noul 返回的是概率，不是程度。0.5 表示模型拿不准，而不是「有一半」。想问程度应该用 Score

`instructions` 也可以传入对象，比如把一条待比对的数据库记录和问题一起传进去，一次请求就能用多个 Noul 把一份简历和多条记录做查重。

### Choice：选择题

Choice 让 Jev 从一组事先定义好的选项中选出一个，适合分类和路由，比如工单分配给哪个部门、商品属于哪个类目、代码是哪种编程语言。Choice 是单选，不支持多选。

请求参数：

- `type`：固定为 `choice`
- `instructions`：问题本身
- `criteria`：选项名到选项描述的映射，模型会同时看到选项名和描述；如果选项名本身已经足够清楚（比如 calm、frustrated、angry），描述可以为 `null`

一个问题最多可以有 255 个选项，每多一个选项只多消耗几个 Token。

返回结果包含 3 个字段：

- `choice`：概率最高的选项
- `probabilities`：所有选项的概率分布，加起来等于 1
- `confidence`：0 到 1 之间，根据概率分布的形状计算，只有一个明显的峰值时置信度高，概率分散在多个选项上时置信度低

```json
{
  "type": "choice",
  "choice": "returns",
  "confidence": 1.0,
  "probabilities": {"returns": 1.0, "shipping": 0.0, "billing": 0.0}
}
```

官方举了一个含糊的例子：一张工单同时提到了配送延迟、尺码不对和重复扣款，这时 department 在 returns（0.61）和 billing（0.35）之间摇摆，置信度只有 0.42。代码可以根据这些数字做进一步处理：

- department 的置信度低于 0.3 时，转交人工处理
- 第二个部门的概率超过 0.25 时，同时抄送给该部门
- 用户诉求的置信度低于 0.5 时，先让用户补充说明

使用建议：

- 给出完整的选项列表，并加上一个 `other` 或「以上都不是」的兜底选项，否则模型只能在不合适的选项里硬选一个
- 选项描述之间要有明确区分，比如「退货政策」和「退货进度」就很容易混淆；如果模型总是分不清两个选项，可以把描述写成包含 `what`、`not_for`、`examples` 等字段的对象
- 类目层级很深时，可以逐层串联多个 Choice，官方的 Hierarchical Classification 示例还演示了每层保留前 K 个路径的 beam search

### Score：评分题

Score 让 Jev 在一个有顺序的等级上给出评分，比如 Bug 的严重程度、用户的不满程度、候选人的经验水平。和 Choice 的区别在于，Score 的选项有高低顺序，结果可以落在两个等级之间。

请求参数：

- `type`：固定为 `score`
- `instructions`：问题本身
- `criteria`：按从低到高排列的等级描述，至少 2 个、最多 10 个，按顺序从 0 开始编号

返回结果：

- `probabilities`：每个等级的概率，加起来等于 1
- `score`：每个等级编号乘以对应概率后求和，得到的加权平均值
- `legend`：等级编号和描述的对应关系
- `confidence`：概率越集中在一个等级上，置信度越高

以官方的 Bug 严重程度为例，3 个等级分别是「只影响外观」「功能受损但有替代方案」「阻塞且没有替代方案」，返回的概率分别是 0、0.57、0.43，所以 score 为 0×0 + 1×0.57 + 2×0.43 = 1.43，置信度 0.35。

```json
{
  "type": "score",
  "score": 1.43,
  "confidence": 0.35,
  "probabilities": {"0": 0.0, "1": 0.57, "2": 0.43}
}
```

置信度偏低通常有 3 个原因：等级之间在这个内容上有重叠；一个问题同时在衡量多件事；内容本身没有提供足够的信息。

使用建议：

- 描述具体情形，而不是程度。「存在替代方案」比「中等严重」更容易让模型对上号
- 不要直接用数字当等级。模型是逐个独立判断每个等级的，看不到编号。官方测试中，用 `["0","1","2"]` 作为等级时，一个按钮错位的问题得到 0.55 分、置信度 0.33；换成文字描述之后得到 0 分、置信度 1.0
- 一个问题只衡量一个维度。如果一个等级同时要求「准时、聪明、有经验」，那么只满足其中一部分的内容就无处安放
- 模型总是落在两个相邻等级之间时，可以把等级写成包含 `what`、`examples` 字段的对象，补充一个相关的例子能明显提升置信度

多个 Score 可以组合成一个综合评分：先把每个 score 除以最高等级编号（`len(criteria) - 1`）归一化到 0 到 1，再在代码中加权求和，官方称之为 Composite scoring 模式。这样当业务优先级变化时，只需要调整代码里的权重系数，而不用重写 Prompt。

### 如何选择问题类型

| 类型 | 适用场景 | 选项特点 | 返回值 |
| --- | --- | --- | --- |
| Noul | 是否判断、规则检查、守门 | 只有是和否 | 为「是」的概率 |
| Choice | 分类、路由、打标签 | 多个选项，没有顺序 | 选中项、概率分布、置信度 |
| Score | 打分、分级、排序 | 多个等级，有高低顺序 | 加权分数、概率分布、置信度 |

复杂的判断不要塞进一个问题里。比如不要直接问「给这个创业项目打分」，而是拆成市场规模、技术可行性、差异化等多个独立的问题，再在代码里组合结果。这也是 Jev 和 LLM 使用思路上最大的不同：LLM 把逻辑写在 Prompt 里，Jev 把逻辑留在代码里。


## 如何体验 Jev

直接在官网 Playground 中在线体验，或者创建 API Key，并编写代码使用。

每个新注册的账号，添加支付方式之后拥有 5 美元的体验额度。按照每百万输入 Token 0.042 美元计算，5 美元大约可以处理 1.19 亿个输入 Token，以 Quick Start 中那个 392 Token 的请求为例，可以调用约 30 万次，用来测试完全足够。

官方文档提供了 4 种上手方式，可以按照自己的习惯选择。

### Playground 在线体验

不写代码的话，最快的方式是 [Playground](https://console.typesafe.ai/playground)：

- 登录 TypeSafe 控制台，打开 Playground
- 把一段文本粘贴到 state 中，比如一条客服消息
- 添加一个问题，比如一个 Noul 问题「Does this message express urgency?」
- 继续添加 Choice、Score 问题，在一次调用中同时查看所有结果

Playground 适合在正式写代码之前，先验证问题的措辞和选项的描述是否合适。

### 直接调用 HTTP API

在控制台的 [API Keys 页面](https://console.typesafe.ai/keys) 创建 API Key，然后用任意语言发送 POST 请求即可：

```bash
export TYPESAFE_API_KEY="your-api-key"

curl -X POST https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Hi, I have been trying to connect my Stripe account for 3 days and the integration keeps failing. Please help ASAP.",
    "model": "jev-latest",
    "questions": {
      "urgency": {
        "type": "noul",
        "instructions": "Does this message express urgency?"
      }
    }
  }'
```

可以通过 `GET https://api.typesafe.ai/v1/models` 查看当前账号可以使用的模型。目前可用的模型是 `jev-1.13.0`，另外有两个别名：

- `jev-latest`：最新的正式版本，也是 SDK 的默认值
- `jev-preview`：最新的预览版本，目前和 `jev-latest` 指向同一个模型

别名会随着新版本发布而变化，模型的判断结果也可能随之改变。如果已经针对某个版本调好了置信度阈值，建议在生产环境中固定使用具体的版本号，比如 `jev-1.13.0`，再按照自己的节奏升级。每次响应中的 `model` 字段会返回实际使用的版本号，可以记录到日志中。

### 使用 SDK

官方提供了 Python 和 JavaScript/TypeScript 两个 SDK。

```bash
# Python，需要 Python 3.10 及以上
pip install typesafe-sdk
# 或者
uv add typesafe-sdk

# JavaScript / TypeScript
npm install @typesafe-ai/sdk
```

两个 SDK 都会自动从环境变量 `TYPESAFE_API_KEY` 读取 API Key，默认使用 `jev-latest` 模型。Python SDK 同时提供同步的 `TypeSafeClient` 和异步的 `AsyncTypeSafeClient`，并且内置了重试机制，遇到限流时会按照 `retry-after` 自动退避重试。具体的调用方式见上文的请求示例。

### 让 Coding Agent 帮忙写

TypeSafe 还提供了一个 Agent Skill，可以让 [[Claude Code]]、[[Codex]] 等 Coding Agent 了解 Jev 的 API、3 种问题类型和常见的架构模式，从而生成正确的集成代码。

Skill 的源码托管在 GitHub 的 [typesafe-ai/skills](https://github.com/typesafe-ai/skills) 仓库中，核心文件是 `skills/typesafe-ai/SKILL.md`。下面 3 种安装方式任选其一即可，同时使用多种方式会装出重复的副本。

#### 安装

在 Claude Code 中，以插件的形式安装，先添加插件市场，再安装插件：

```bash
claude plugin marketplace add typesafe-ai/skills
claude plugin install typesafe@typesafe-ai
```

在 Codex、Cursor 等其他 Agent 中，使用 skills.sh 的命令行工具安装，执行后会提示选择要安装到哪个 Agent：

```bash
# 默认安装到当前项目
npx skills add typesafe-ai/skills --skill typesafe-ai

# 加上 -g 安装到全局，所有项目都可以使用
npx skills add typesafe-ai/skills --skill typesafe-ai -g
```

也可以手动安装，把仓库中整个 `skills/typesafe-ai` 目录（包括其中的参考文件）复制到 Agent 的 skills 目录中，以 Claude Code 为例：

```bash
git clone https://github.com/typesafe-ai/skills.git /tmp/typesafe-skills
cp -r /tmp/typesafe-skills/skills/typesafe-ai ~/.claude/skills/
```

如果懒得自己敲命令，还可以把下面这段话直接发给 Coding Agent，让它自己完成安装：

```text
Install the TypeSafe skill. If you're in Claude Code, run `claude plugin marketplace add typesafe-ai/skills`, then `claude plugin install typesafe@typesafe-ai`. If you're in another agent, run `npx skills add typesafe-ai/skills --skill typesafe-ai` and select your agent. Use one installation method. You can read the skill directly at https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md (raw: https://raw.githubusercontent.com/typesafe-ai/skills/main/skills/typesafe-ai/SKILL.md). Then use the TypeSafe skill when working on this project.
```

#### 更新

TypeSafe 的 API 还在快速迭代，Skill 版本过旧时，Agent 可能会编造出不存在的请求或响应字段，所以需要定期更新。

Claude Code 插件的更新命令：

```bash
claude plugin marketplace update typesafe-ai
claude plugin update typesafe@typesafe-ai
```

更新之后重启 Claude Code，或者在会话中执行 `/reload-plugins` 重新加载。也可以在 `/plugin` 菜单中依次选择 Marketplaces → typesafe-ai → Enable auto-update 开启自动更新。

通过 skills.sh 安装的，执行：

```bash
npx skills update
```

手动安装的，用 GitHub 上最新的 `skills/typesafe-ai` 目录整个替换掉旧目录即可。

#### 调用

安装之后，在 Claude Code 中可以直接输入斜杠命令调用：

```text
/typesafe:typesafe-ai
```

在其他 Agent 中，或者 Agent 没有自动加载 Skill 时，在提示词中明确写上「use the TypeSafe skill」即可。如果仍然没有生效，检查安装时选择的是否是当前使用的 Agent，然后重启 Agent。

#### 常用提示词

官方给出了几个可以直接使用的提示词。

找出项目中适合使用 Jev 的地方，让 Agent 扫描现有项目，寻找可以用智能判断代替复杂解析逻辑或脆弱代码的位置：

```text
Using the TypeSafe skill, explore the project and find opportunities for using
intelligent judgement to stand in for complex parsing or other fragile code.
```

让 Agent 用真实的 API 做实验。先把 API Key 导出到环境变量，Agent 会自己发送一些低成本的测试请求，再根据结果给出修改方案：

```bash
export TYPESAFE_API_KEY="your-api-key"
```

```text
Using the TypeSafe skill, run some experiments using the TypeSafe API key that I've
exported to `TYPESAFE_API_KEY`. Propose changes based on the most promising results.
```

对照官方 Cookbook 重构代码，让 Agent 检查现有代码是否有可以套用的官方示例：

```text
Using the TypeSafe skill, analyze my code and see if there are any applicable
cookbooks (https://console.typesafe.ai/docs/cookbooks) that show how I could
refactor my code to be less fragile or complex.
```

从零开始写一个小工具，比如一个从多个维度评估文档的命令行程序：

```text
Let's build a simple CLI that uses the TypeSafe API to evaluate a set of supplied
documents on multiple dimensions. Use the TypeSafe skill to understand how to use
the TypeSafe API and how to structure the system. Ask me questions about what kinds
of documents I want to evaluate and on what dimensions.
```

需要注意的是，Jev 本身并不能作为 Coding Agent 背后的模型。它不能写代码、不能对话、也不能调用工具，不存在把 Claude Code 的模型换成 `jev-latest` 这种用法。正确的思路是继续用 LLM 写代码，而在写出来的程序里调用 Jev 做判断。

官方还给了几条使用建议：把所有问题和阈值常量集中放在一个文件里，方便人工审查；Agent 并不擅长写问题，问题的措辞最好自己参与修改；不要轻易相信 Agent 的判断，让它用真实请求去验证假设。

## 局限

和 LLM 模型一样，Jev 也一样会犯错。官方在文档中专门列出了当前版本 `jev-1.13` 已知的「锯齿」（jaggedness），也就是那些它做得不好的地方，并说明其中很多会在后续版本中改进。

Jev 的能力有明确的边界，不能生成文字，不能做数学推理，也无法比较日期。总的来说，Jev 擅长常识性的语义判断，但不擅长需要多步推理、数字精度的任务，而且对问题的理解非常字面化。

### 已知的失败场景

| 场景 | 表现 | 建议做法 |
| --- | --- | --- |
| 数学和计数 | 算不准、数不清，看不懂十六进制颜色、RGB 这类数字表示，Score 的分数也不能用来插值出精确数值 | 计算和计数放在代码里 |
| 日期比较 | 把日期当文本，判断先后、间隔、是否在区间内都不可靠 | 用 Choice 提取年月日，在代码中比较 |
| 间接推理 | 双重否定、多跳推理时准确率下降 | 问题写得直接，在 state 中用字段名指明看哪里 |
| 无关上下文过多 | 无关内容成为干扰项，越多越不准 | 先在代码中过滤，只传问题需要的字段 |
| 对抗性内容 | 注入的指令、误导性表述会影响结果，同样存在 [[Prompt Injection]] 风险 | 写清 criteria，上线前测试边界情况 |
| 问题与描述矛盾 | instructions 和 criteria 意思不一致时判断混乱 | 让两者的表述保持一致 |
| 问题之间的换算 | 同一问题的正反两种问法，概率相加不等于 1（官方示例 0.72 + 0.47 = 1.19），Noul 和 Choice 的数值也不能互相比较 | 不依赖问题之间的数学关系，阈值不跨类型复用 |
| 生成文本 | 效果差且很慢 | 用正则或 LLM 找出候选项，让 Jev 从中选择 |

### 使用上的限制

- 只支持文本输入：state 只能是字符串、JSON 对象或文本数组，不支持图片、音频和视频，需要先在代码中转换成文本或结构化字段
- 上下文长度有限：单次请求最多 64k Token，其中 state 加上最长的一个问题不能超过 32k Token。和动辄几十万、上百万 Token 上下文的 LLM 相比，不能直接把一整份长文档丢进去
- 英文效果最好：英文是主要训练语言，其他语言包括中日韩文字都能处理，但准确率目前较低。用 Jev 处理中文、日文内容之前，最好先用自己的数据测试，并在路由时更加关注置信度
- 不能微调：Jev 不支持用客户数据做 Fine-tuning 或 LoRA，所有账号使用同一套权重，只能通过 state、instructions 和 criteria 把领域知识传给模型
- 限流：目前的限制是每秒 25 万 Token、每分钟 1200 次请求，超出后会返回 `429 Too Many Requests`。由于需求量很大，官方表示这个限制随时可能动态调整，更高的额度需要联系销售购买企业方案
- 不能解释原因：Jev 只返回答案和概率，不会给出推理过程。一旦判断出错，只能靠调整问题措辞和选项描述来排查

### 如何看待这些局限

还有两点值得注意。

第一，「校准」是统计意义上的。Jev 返回的概率在大量预测上是准确的，比如所有 0.8 的判断里大约 80% 是对的，但这并不保证某一个具体的答案是正确的。同样，高置信度也不等于答案正确。

第二，目前公开的速度、成本和准确率数据主要来自 TypeSafe 官方，演示也多是在模拟环境中完成的，还缺少公开基准测试的成绩和大规模生产环境的验证。

官方文档最后总结了 4 条应该避免的做法：

- 让模型去做代码可以精确计算的事情
- 在一个问题里藏着多个判断
- 需要多层间接推理的 System Two 任务
- 在 state 中放入超出问题需要的上下文

总结下来，使用 Jev 的正确姿势是：把确定性的逻辑（计算、比较、计数、流程）留在代码里，只把「一个懂行的人几秒钟就能做出的判断」交给 Jev，再通过置信度决定是否自动执行，或者交给人工、交给更强的推理模型处理。

## 参考资料

- [Introducing System One Models & Jev - TypeSafe AI Blog](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe 官方文档](https://docs.typesafe.ai/introduction)
- [Quick start](https://docs.typesafe.ai/introduction/quickstart)
- [Models：价格、限流与上下文长度](https://docs.typesafe.ai/models)
- [Jev 1.13 jaggedness：已知问题](https://docs.typesafe.ai/model-jaggedness/jev-1.13)
- [Cookbooks](https://docs.typesafe.ai/cookbooks)
- [typesafe-ai/skills - GitHub](https://github.com/typesafe-ai/skills)
- [What is Jev, TypeSafe AI's System One model? - Vercel](https://vercel.com/i/what-is-jev)


