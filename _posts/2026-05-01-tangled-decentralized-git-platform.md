---
layout: post
title: "Tangled：基于 AT Protocol 的去中心化代码托管平台"
aliases:
- "Tangled：基于 AT Protocol 的去中心化代码托管平台"
tagline: "当 Git 遇上 Bluesky 的协议，开发者终于有了 GitHub 的去中心化替代"
description: "Tangled 是一个建立在 AT Protocol 之上的去中心化代码托管与协作平台，支持自托管 Git 仓库、Pull Request、CI、Issues 等完整功能，同时保持开发者对数据的完整控制权。"
category: 产品体验
tags: [git, open-source, decentralized, at-protocol, bluesky, self-hosting]
create_time: 2026-05-01 10:00:00
last_updated: 2026-05-01 10:00:00
---

最近一段时间，我对去中心化互联网的兴趣越来越浓。[[Bluesky]] 的崛起让我第一次真正感受到 [[AT Protocol]] 的魅力——不是从概念上，而是实际体会到"带着自己的身份换平台"是什么感觉。然后，我发现了 [[Tangled]]。

Tangled 是一个建立在 AT Protocol 上的代码托管与协作平台，定位是 [[GitHub]] 的去中心化替代。第一次打开 [tangled.org](https://tangled.org)，界面整洁得出乎意料，仓库列表、Issue、Pull Request，一切都那么熟悉，但背后的逻辑已经完全不一样了。

![Tangled 去中心化代码托管平台](https://pic.einverne.info/images/2026-05-01-10-00-00-tangled-decentralized-network.png)

## Tangled 是什么

Tangled 是由芬兰创业公司 Tangled Labs Oy 开发的去中心化代码托管平台。2025 年初正式向公众开放，2026 年 3 月完成了 450 万美元的融资。目前平台已有超过 7000 名用户和 5000 个仓库，发展速度相当不错。

它的核心理念是：**代码托管不应该绑定在某一家公司的服务器上。** 开发者应该真正拥有自己的数据，社区应该能够自我治理，而不是被平台规则左右。这不是一句空话——Tangled 的整个架构都是围绕这个目标设计的。

## AT Protocol 带来的身份革命

理解 Tangled 之前，需要先了解 [[AT Protocol]]（Authenticated Transfer Protocol），也就是 Bluesky 背后的协议。

AT Protocol 的精髓在于将用户身份从应用层剥离出来。你的账号属于你选择的 PDS（Personal Data Service，个人数据服务），而不是某个具体的 App。就像你的手机号码可以携号转网一样，你的 AT Protocol 账号可以迁移到不同的应用和服务商，而你的社交关系和数据跟着走。

这对代码托管意味着什么？你在 Tangled 上积累的 Star、Follow、Issue 评论记录，都存储在 AT Protocol 网络中，而不是 Tangled 公司的数据库里。如果 Tangled 哪天关门了，数据不会消失。如果你不满意 Tangled 的服务，你可以带着身份和数据切换到另一个兼容 AT Protocol 的代码托管服务。

如果你已经有了 Bluesky 账号，直接用同一个 handle 就能登录 Tangled。没有账号也没关系，注册时选择 Tangled 自己运营的 PDS（`tngl.sh`），会分配一个 `user.tngl.sh` 格式的 handle。

## Knots：分布式仓库存储的核心

Tangled 架构里最有意思的概念是"Knot"（结节）。

每个 Knot 都是一个轻量级的、无状态的 Git 服务器。你的代码仓库实际存储在 Knot 上，而不是 Tangled 的中央服务器上。Tangled 的 appview（应用视图）相当于一个聚合器，它把散落在不同 Knot 上的仓库统一呈现出来，让用户可以无缝地访问、克隆和贡献代码，而不用关心这些代码物理上存储在哪里。

这个设计有几个实际好处。首先，你可以在自己的服务器上自托管 Knot，代码从不离开你的机器。其次，Knot 支持单用户和多用户两种模式，既适合在家里的树莓派上单独运行，也适合作为社区服务器使用。默认情况下，Tangled 提供免费的托管 Knot，普通用户不需要自己折腾服务器。

仓库的"地址"绑定在所有者的 DID（去中心化标识符）上，而不是某台服务器的域名上。这意味着即使仓库从一台服务器迁移到另一台，链接依然有效，类似 DOI 之于学术论文的作用。

## 功能概览

Tangled 的功能集已经相当完整，并且在一些地方做出了有趣的创新。

### Pull Request 与 Jujutsu 支持

Tangled 的 Pull Request 系统采用了"轮次（round）"的提交与审查模式，而非传统的单一线性流程。每次修改都作为一个新的轮次提交，使得审查历史更清晰，reviewer 能更好地跟踪每一轮的变化。

更值得关注的是，Tangled 是目前已知第一个代码托管平台支持 [[Jujutsu]]（jj）的 stacked pull request 工作流。Jujutsu 是一个新兴的版本控制系统，在处理一系列相互依赖的变更时比 Git 更直观。Tangled 团队自己也在日常开发中使用 Jujutsu，因此支持得很到位。

### Spindle：自研 CI 系统

CI 是 Tangled 用户呼声最高的功能需求，团队考虑过接入第三方平台，但最终选择自研——于是有了 Spindle。

Spindle 基于 Nix 和 Nixery 构建 CI 镜像，支持按需动态创建环境，并带有缓存机制。目前还处于早期阶段，使用 Docker/Nixery 引擎，后续计划迁移到微型虚拟机以支持完整的 NixOS 和其他系统镜像。Spindle 也是 AT Protocol 原生的，这意味着 CI 的触发和结果都能整合进去中心化的数据流中。

### Issues 与标签系统

Issues 经过了一次完整的重设计，现在支持线程式讨论——顶层评论下可以有回复，更适合有深度的技术讨论。

标签系统也做得比较灵活。除了普通标签，还支持 key-value 格式的标签（如 `priority/high`），以及约束了取值范围的标签（如 `priority: [high medium low]`）。多个相同类型的标签也可以同时存在，比如同一个 Issue 可以有多个 `reviewed-by` 标签。

### 静态网站托管

每个 Tangled 用户都有一个专属的子域名，可以直接从 Git 仓库部署静态网站，类似 [[GitHub Pages]] 的功能。注册 `tngl.sh` 账号的用户，网站域名是 `username.tngl.sh`；使用其他 PDS 的用户则可以申请一个 `username.tngl.io` 域名。

### 通知系统

应用内通知现已覆盖主要事件：有人在你的仓库开 Issue 或 PR、有人评论了你参与的 Issue/PR、Issues 被关闭或合并、有人给你的仓库 Star 或关注了你。这些通知都可以在设置中精细调整。

### AI 代理支持

Tangled 明确将 AI 纳入了产品规划。通过完整的 XRPC API，AI 代理可以作为代码贡献者参与项目——创建仓库、提交 Pull Request、执行代码审查。对于想要在工作流中集成 AI 助手的团队来说，这是一个很实用的接口。

## 如何开始使用

上手非常简单，直接访问 [tangled.org](https://tangled.org)。

如果有 Bluesky 账号，用现有的 handle 登录即可，两个平台共享同一套身份体系。如果没有，注册新账号时会在 `tngl.sh` 上创建 PDS，整个过程就像普通的网站注册。

登录后，界面和 GitHub 非常相似：创建仓库、设置说明、选择初始化选项，然后用标准的 Git 命令推送代码就行了。SSH 密钥的配置方式也和 GitHub 一致。

克隆仓库时，地址格式是 `git@tangled.org:username/repo-name.git`，不需要额外学习新的工具链。

## 自托管 Knot：真正的数据自主

对于有服务器的人来说，自托管 Knot 是一个很有吸引力的选择。你的代码完全存储在自己的机器上，只是通过 AT Protocol 的身份和数据流接入 Tangled 的生态。

官方提供了 Docker 镜像，配置主要包括设置所有者的 DID 和对外暴露服务端口。部署完成后，你的私有 Knot 会出现在 Tangled 的网络中，其他用户可以访问你的公开仓库，你也可以用 SSH 直接推送代码。如果哪天你不想用 Tangled 了，代码还在你自己的服务器上，Git 仓库可以随时镜像到其他地方。

## 最后

Tangled 解决的本质问题是：**为什么代码托管必须是中心化的？**

GitHub 目前拥有大约 88% 的市场份额，这种集中程度对整个开源生态其实是一种隐患。Tangled 不是要颠覆 GitHub，而是在探索另一种可能——一个开发者真正拥有数据所有权的代码协作世界。

目前 Tangled 还处于早期，功能还在快速迭代。但 AT Protocol 的身份基础、Knot 的分布式存储、以及团队对 Jujutsu 等新工具的拥抱，都让我觉得这个方向是对的。至少，现在是个参与进来的好时机——在它还小的时候，你的反馈更容易被听到，社区也更有可能因你的参与而变得更好。

如果你已经有了 Bluesky 账号，不妨今天就去 tangled.org 看一看。
