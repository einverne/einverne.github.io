---
layout: post
title: "Novita AI 面向 AI 开发者的 GPU 云平台"
aliases:
- "Novita AI 面向 AI 开发者的 GPU 云平台"
tagline: ""
description: ""
category: 经验总结
tags: [ gpu, ai, open-source, model, deepseek, google,  ]
create_time: 2025-05-29 09:43:30
last_updated: 2025-05-29 09:43:30
dg-home: false
dg-publish: false
---

在如今 AI 时代，个人开发者和企业都想要高效，经济，且容易部署的 AI 模型，尤其是 DeepSeek 横空出世之后使得个人在部署使用私有 AI 模型方面变得异常简单，但问题随之出现，普通人的电脑无法带动 DeepSeek 发布的更消耗内存更消耗计算能力的模型，普通用户也很难去给自己的每台电脑都配上英伟达 4090，更不用说去管理 GPU 集群，而普通开发者如果想要将自己的模型部署到云服务上也非常棘手，而这就是今天我要介绍的 Novita.AI 要解决的问题。

## 什么是 Novita

[Novita.AI](https://gtk.pw/novita) 是一个专为开发者设计的 AI 云平台，用户可以通过简单易用的 API 以及按需付费的 GPU 租赁，轻松地部署和扩展 AI 模型。无论是经验丰富的 AI 工程师，还是 AI 领域的门外汉，Novita.AI 都希望开发者将精力集中在创新，而非繁琐的云基础设施运维。

所以 Novita 提供了一整套面向 AI 开发者的解决方案，涵盖了包括模型部署，GPU 实例租赁，无服务 GPU，模型 API 等等核心服务，满足了从初创企业到大型机构在 LLM，文字生成图片，生成音频，生成视频等等方面多样化的需求。

Novita 作为一家初创公司正在以「为每个人，每个地方提供 AI Cloud」的景愿努力。

![Ptu2](https://photo.einverne.info/images/2025/05/29/Ptu2.png)

## 功能

Novita 提供了超过 200 个 AI 模型的库，开发者可以通过简单的 API 调用，快速部署和集成这些模型到自己的应用中，这些模型涵盖了当前 AI 领域大部分应用场景，包括

- AI 聊天，构建智能对话，私人助手，智能客服
- 代码模型，代码生成，代码辅助
- 图像模型，支持图像生成，编辑
- 音频和视频模型，用于语音识别，语音合成，视频内容分析和生成等等

这些模型都经过优化，具备生产环境所需的扩展性，可以让开发者更专注于 AI 功能的开发。

![8wiM](https://photo.einverne.info/images/2025/05/29/8wiM.png)

### 自定义模型部署

对于有特定需求的企业用户，Novita 提供了企业级的自定义模型部署服务，开发者无需关注底层 DevOps 工作，可以快速将定制模型部署到 Novita 云平台上，平台提供了性能保证，扩展能力，以及全天候的监控。

### GPU 实例

Novita 提供 GPU 实例租赁，提供 4090，A100，H100，L40 等 GPU 按需访问，这些 GPU 资源可以根据工作负载定制，也会根据用户的需求扩展到全球多个节点，将 GPU 实例部署在距离用户最近的位置，从而提升访问速度以及低延迟访问。

Novita 也推出了无服务 GPU 平台，进一步简化了 AI 模型的扩展和使用成本，用户只需要为实际消耗的资源付费，在空闲时期可以显著地缩减成本，但同时保证了高峰期的可用性。

![87AR](https://photo.einverne.info/images/2025/05/29/87AR.png)

## 如何使用 Novita

使用我的[邀请链接](https://gtk.pw/novita) 注册 Novita 可以获得 10 美元的初始账户奖励，或者在注册时填写邀请码 `07HIQH`，注册时完成如下的三个步骤

![8IQG](https://photo.einverne.info/images/2025/05/29/8IQG.png)

创建帐号，并且关联 GitHub 帐号，就可以获得 10 美元账户余额。

然后访问 Novita console 控制台页面。

![8G3I](https://photo.einverne.info/images/2025/05/29/8G3I.png)

在控制台中可以非常明显的看到 Novita 提供的三个核心功能

- Model API，可以直接调用的模型 API
- 部署独立的 GPU 实例
- 构建无服务的 GPU 集群

对于我而言，目前最实用的就是可以快速体验最新发布的模型，而不用我每次都下载到我本地来跑。

![8lp4](https://photo.einverne.info/images/2025/05/29/8lp4.png)

直接点击页面中的 DeepSeek 就可以快速进行提问，也可以在右侧对模型参数进行微调。

如果想在自己的应用内集成调用，可以参考 API ，Novita 提供了 OpenAI 兼容的调用模式。

![8oOW](https://photo.einverne.info/images/2025/05/29/8oOW.png)

这样就可以快速集成到自己的服务中了。
