---
layout: post
title: "Meta Muse 介绍与注册指南：一个会替你跑腿的个人 AI Agent"
aliases: ["Meta Muse 体验：一个真的会替你跑腿的个人 AI Agent", "Meta Muse 介绍与注册指南", "Muse"]
tagline: "它去做，而不是告诉你怎么做"
description: "Meta 在 2026 年 9 月发布的个人 AI Agent Muse 介绍：从 OpenClaw 和 Meta 收购 Manus 的风波讲起，介绍它是什么、在哪些平台可用、地区和注册条件、邀请码 48 小时兑换规则、免费额度与付费方案，以及上手前建议先调整的隐私设置。"
category: "产品体验"
tags: [meta, ai-agent, muse, openclaw, manus, llm, productivity]
create_time: 2026-09-25 23:03:11
last_updated: 2026-09-28 10:00:00
---

2026 年 9 月 8 日，[[Meta]] 发布了个人 AI Agent [[Muse]]，宣传语只有一句：「它去做，而不是告诉你怎么做」。用 [[ChatGPT]] 或 [[Claude]] 时，我们得到的往往是一份说明书，真正动手的部分，打开网页、填表单、下单付款，还得自己来。Muse 想把这一段也接过去：你交给它的不是一个问题，而是一件事，它会自己打开浏览器一步步做完，需要你拍板时再回来问你。这是 Meta 迄今为止在消费级 AI 上下的最大一笔注，两周后的 Connect 2026 大会几乎整场都围绕它展开。

这篇先简单交代一下背景，再把 Muse 是什么、怎么注册、额度怎么算讲清楚。具体的使用案例和玩法，我会另外写一篇教程。

![Meta Muse 个人 AI Agent 概念配图](https://pic.einverne.info/images/2026-09-25-23-05-00-muse-ai-agent.png)

## 从 OpenClaw 到 Muse

今年个人 AI 助手这股风，是 [[OpenClaw]] 带起来的。这个由 Peter Steinberger 做的开源项目在 1 月底爆红，它常驻在你自己的机器上，有长期记忆，能接入 WhatsApp、Telegram 这些聊天工具，替你操作浏览器和文件。很多人第一次意识到，AI 可以是一个一直在线、会主动做事的助手。不过它的门槛也不低，得自己准备机器、配模型、管权限，Steinberger 自己都说它不是给非技术用户用的。我之前也写过一个 [[OpenClaw 篇一：开源 AI 代理介绍及安装|OpenClaw 系列]]。

Meta 也看中了这个方向。2025 年底它宣布以约 20 亿美元收购通用 Agent 公司 [[Manus]]，结果中国监管部门介入审查，2026 年 4 月直接叫停交易并要求撤销，Manus 在 8 月宣布恢复独立。收购没成，Meta 最后拿出来的是自研的 Muse。Meta 超级智能实验室的产品负责人 Nat Friedman 也公开承认，Muse 在产品上「大量借鉴了 OpenClaw」，只是代码从零写起。

所以可以把 Muse 理解成面向普通人的 OpenClaw：搭机器、配模型、管权限这些麻烦事都收进了 Meta 的云端，代价是你得信任 Meta。

## Muse 是什么

Muse 是 Meta 推出的个人 AI Agent，背后的模型是 Meta 自家的多模态模型 Muse Spark。它和聊天机器人最根本的差别，在于它背后跑着一台真实的机器。

每个用户都会分到一台 Muse Secure VM，也就是一台独立的云端 Linux 虚拟机，里面有完整的浏览器和文件系统，Agent 和你授权给它的数据都放在这台机器上。Meta 官方没有公布具体配置，用户和媒体实测的结果大致是 2 个 vCPU、8GB 内存、跑 Ubuntu，磁盘容量的说法从 8GB 到 100GB 不等，而且付费版和免费版分到的机器看起来是一样的。

你可以交给它各种琐事，比如取消一张信用卡的年费、盯着演唱会票价降到某个数字就买、把 Instagram 上收藏的食谱拆成一张采购清单。它会自己拟订计划，打开网页、读页面、点按钮、填表单，遇到需要你拍板的地方停下来问你。你把 App 关掉它也还在跑，做完或者需要你确认时再回来找你。

安全方面有几个设计值得知道：

- Sentinel：同一台虚拟机里有一个独立的审查 Agent，和 Muse 在系统层面隔离。Muse 发往互联网的任何动作都要先经过 Sentinel 放行，必要时它会来问你
- 凭据隔离：你保存的账号密码和支付方式放在单独的安全存储里，Muse 能用但看不到明文，后续还会支持 [[1Password]]
- 付款：结账走 [[Stripe]] 的 Link，每次交易生成一张一次性虚拟卡，真实卡号不会给商家，还附带 Link 的购物保障
- 敏感操作前确认：发邮件、付款之前一定会先问你，并且保留完整的操作记录，能看到它做过什么、打算做什么

Meta 还预告了一个 Confidential VM，整台虚拟机用只有用户自己持有的密钥加密，连 Meta 都进不去。但它要到 2026 年晚些时候才推出，现阶段的 Secure VM 只是把你和其他用户隔开，并不阻止 Meta 在运营服务时访问你的数据。

## 在哪里可以用

Muse 目前可以通过这几个入口使用：

- 网页端：[muse.ai](https://muse.ai)
- 手机 App：iOS 和 Android
- [[WhatsApp]]：直接在聊天里和它对话
- Mac 客户端：9 月 18 日前后上线，是第一个能直接操作你本机的版本，可以读写文件、邮件、信息、日历和备忘录，Connect 大会上又宣布它能驱动 Mac 上的任意应用

9 月 23 日的 Connect 2026 上，Meta 还公布了一批后续计划：在智能眼镜上用唤醒词呼叫 Muse、给 Muse 一个可以视频对话的虚拟形象、给它一个独立邮箱地址，以及一个叫 Muse Charm 的钥匙扣大小的随身设备，计划 12 月出货，价格还没公布。这些大多只给了「即将推出」「未来几个月」这样的时间，暂时不要当成现在就能用的功能。

App 上线后势头很猛，9 月 18 日登上美区 App Store 免费榜第一，第二天也登顶了 Google Play，Sensor Tower 估计到 9 月下旬下载量已经超过 340 万。

## 地区和注册条件

在动手注册之前，先确认自己满足这几个条件：

- 地区：目前只对美国和加拿大开放。美国是 9 月 8 日首发，加拿大 9 月 18 日跟进，其他地区打开 App 会看到等候名单或「所在地区暂不可用」的提示
- 年龄：必须年满 18 岁
- 账号：需要一个 Meta 账号，可以用已有的 Facebook 或 Instagram 账号创建，也可以用邮箱加手机号新建
- 支付卡：多家媒体报道，即使只用免费版，注册时也要绑一张支付卡，用作年龄和身份验证，也是为了之后它替你付款

关于地区限制多说一句：网上有不少教你用 VPN 或云桌面绕过去的文章，但 Muse 的地区判断是在账号层面做的，不只看 IP，再加上支付卡和应用商店的地区，基本是三道检查。强行绕过有可能连累你的 Meta 账号，而宣称有「内部渠道」能提前开通的，基本可以当成骗局。邀请码也只能给额外额度，没法帮你跳过地区限制。

## 注册步骤

满足条件的话，注册流程并不复杂：

1. 打开 [muse.ai/join](https://muse.ai/join) 或者在 App Store、Google Play 下载 Muse App
2. 用 Meta 账号登录，网页端会要求手机号验证
3. 按提示绑定支付卡，完成年龄和身份确认
4. 走完新手引导
5. 马上进入 Settings → General → Redeem Invite Code 兑换邀请码，原因见下一节

## 邀请码和 48 小时窗口

Muse 的邀请机制是这样的：新用户在注册后兑换别人的邀请码，邀请人和被邀请人各得 10 亿 Muse token。这部分奖励额度在账户里显示为永不过期，按免费版每周约 1 亿的额度算，相当于多出 10 周左右的用量。它是使用额度，不能提现，也不能转让。

有两个限制要注意：

- 48 小时窗口：邀请码必须在账号创建后 48 小时内兑换，过期就不能再补。我的建议是注册完立刻去兑换，不要想着「先玩两天再说」
- 使用次数：每个码能用的次数有上限，早期报道是 20 次，Meta 官方账号后来在 Threads 上回复说目前是 30 次，满了之后这个码就失效

如果你打算试，可以用我的码：`TOCKLC`

注册地址：[https://muse.ai/join](https://muse.ai/join)

完成引导之后进 Settings → General → Redeem Invite Code 输入 `TOCKLC`，兑换成功后我们各得 10 亿 token，可以在额度页确认是否到账。顺便提醒一句，搜「Muse 邀请码」会跳出一堆专门做邀请码农场的站点，码的有效性没人保证，用认识的人给的码会稳妥一些。

## 免费额度和付费方案

Muse 的计费单位叫 Muse token，按周计算额度，每周重置，没用完的不会累积到下周。目前的方案如下：

| 方案 | 价格 | 每周额度 |
| --- | --- | --- |
| Free | 免费 | 约 1 亿 token |
| Power | 20 美元 / 月 | 5 亿 token |
| Maximum | 100 美元 / 月 | 30 亿 token |

几个细节：

- 免费版的 1 亿是 Zuckerberg 在发布时给出的数字，Meta 帮助中心只写了「免费使用，有用量上限」，额度未来有可能调整
- 三个方案功能完全一样，区别只在用量，官方没有提到付费版会更快或用更好的模型
- 免费额度用完之后，可以升级订阅，或者等到下周额度刷新，不会在你没订阅的情况下自动扣钱
- 订阅按月自动续费，要在当初购买的那个平台上管理和取消，比如在 iOS 上订的就得去 iOS 里退

1 亿 token 到底能干多少事？Meta 没有公布单个任务大概要花多少 token，Agent 读网页、截图、规划、调用工具都在消耗，所以很难换算成「能订几张机票」。能参考的是 Gizmodo 记者的测试：他让 Muse 连续做了横版过关游戏、带关卡的射击游戏、一个网站、50 段配乐变奏和 50 段动画，这时只用掉周额度的 6% 左右，再加上一个仿 Mac 桌面的大项目，也才到 11%。这些都是很吃算力的生成类任务，日常的查资料、比价、填表单只会少得多。

所以结论比较清楚：大多数人用免费版就够了，再加上邀请码的 10 亿，短期内基本不用考虑付费。

顺带一提，Meta 敢给这么多免费额度，是因为 Zuckerberg 在 Connect 上说得很明白，他们打算从 Muse 促成的交易里抽一小笔手续费。它的商业模式不是订阅费，而是它替你花出去的钱。想明白这一点，对它推荐的商品和商家保持一点警惕是应该的。

## 上手前先调好的几项设置

注册完不急着让它去做事，建议先花几分钟把权限理一遍：

- 连接应用时按需授权：每接入一个服务，都可以单独设置权限级别，比如邮箱可以只给只读，不给代发。权限随时能改，也能随时断开
- 退出模型训练：在设置里可以选择不让你的交互用于训练 Meta 的模型
- 让它忘记：它记住的东西可以让它单独忘掉
- 查看操作记录：它做过什么、打算做什么都有完整记录，前几次用的时候建议多翻翻

Meta 声明 Muse 的对话和虚拟机里的数据不会进入广告系统。但要注意，你通过 Muse 浏览和购物的行为，仍然可能通过常规的网页追踪间接影响你看到的广告。

我自己的做法是先用一个干净的账号试水，暂时不接入主邮箱和任何有支付能力的账户。这么谨慎是有原因的：Inc. 的记者 Jason Aten 反馈，他明确没有给 Muse 授权读取信息，Mac 版的 Muse 却同步了他的 Messages 数据库，主动根据他和朋友的聊天建议他写专栏，被问到时还给出了和实际情况不符的解释。TechRadar 的测试者也提到，使用过程中会不断被提示去连接金融账户、邮件、文档和身份信息。Mac 版能直接读本机数据，授权时尤其要看清楚。

## 目前的局限

在决定要不要花时间研究之前，这几个短板也应该知道：

- 慢：让 Muse 去一个网站下单，全程往往比自己打开网站直接买要久，它要读页面、理解布局、判断该点哪里，每一步都在花时间
- 被网站封堵：Amazon 从 9 月 20 日前后开始屏蔽 Muse 访问，理由是违反其使用条款；CNN 记者实测时，Target 允许浏览，但在结账环节拦下了自动点击，最后还得手动填个人信息。电商平台并没有动力让一个替用户比价的机器人在自己站内畅通无阻
- 会出错：CNN 的测试里，它推荐的约会地点有两家早就关门了。Meta 自己在安全说明里也写得很直白，Muse 仍然会犯错，也可能在读到的网页里遇到恶意指令

另一方面，Connect 上公布的合作名单在变长，Shopify、Walmart、Best Buy、Sephora、Expedia、Notion、GitHub 等都在其中，Meta 还开放了第三方开发者接入。能用的服务会越来越多，但现在还是偏少。

## 最后

Muse 让我在意的不是它现在能做什么，老实说以它目前的速度和被网站封堵的程度，很多任务自己动手更快。真正的变化在于交互方式：过去两年我们学的是怎么写更好的 prompt，Agent 时代要学的是怎么安全地授权，判断哪些事可以交出去、哪些事必须自己按下最后一个按钮。

如果你在美国或加拿大，注册成本很低，免费额度加上邀请码的 10 亿 token 足够玩很久，值得试一下。先从查资料、比价、整理清单这类出错了也无所谓的任务开始，把主邮箱和支付账户留在外面，等 Confidential VM 上线、长期使用的反馈多起来再说。

Muse 的具体使用案例和上手方法，我整理在了下一篇 [Meta Muse 使用教程：上手设置、提示词技巧与实用案例](https://blog.einverne.info/post/2026/09/meta-muse-use-cases-tutorial.html) 里。

## 参考

- [OpenClaw - Wikipedia](https://en.wikipedia.org/wiki/OpenClaw)
- [From Clawdbot to Moltbot to OpenClaw - CNBC](https://www.cnbc.com/2026/02/02/openclaw-open-source-ai-agent-rise-controversy-clawdbot-moltbot-moltbook.html)
- [Meta admits Muse's likeness to OpenClaw isn't a coincidence - TechCrunch](https://techcrunch.com/2026/09/22/meta-admits-muses-likeness-to-openclaw-isnt-a-coincidence/)
- [China blocks Meta's $2B Manus deal after months-long probe - TechCrunch](https://techcrunch.com/2026/04/27/china-vetoes-metas-2b-manus-deal-after-months-long-probe/)
- [Meta reportedly moves to unwind $2B Manus deal - TechCrunch](https://techcrunch.com/2026/06/13/meta-reportedly-moves-to-unwind-2b-manus-deal-after-beijings-demand/)
- [Manus to return as independent company - CNBC](https://www.cnbc.com/2026/08/11/manus-china-meta-acquisition.html)
- [Introducing Muse: The World's First Personal AI Agent Built for Everyone](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
- [Muse subscriptions - Meta Help Center](https://www.meta.com/help/subscriptions/1625680452306909/)
- [Everything new coming to Meta's AI agent Muse - TechCrunch](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)
- [Meta's Muse hits Mac - TechCrunch](https://techcrunch.com/2026/09/18/metas-muse-hits-mac-letting-the-ai-take-actions-on-your-computer/)
- [Meta says its Muse AI agent can do things for you. I put it to the test - CNN](https://www.cnn.com/2026/09/23/tech/meta-muse-ai-agent)
- [Meta's New Muse AI Agent Read My Private Messages - Inc.](https://www.inc.com/jason-aten/metas-new-muse-ai-agent-read-my-private-messages-i-never-asked-it-to/91408202)
- [Meta's Muse Let Me Waste a Mind-Boggling Amount of Free Compute - Gizmodo](https://gizmodo.com/metas-muse-let-me-waste-a-mind-boggling-amount-of-free-compute-on-nothing-in-particular-2000808945)
