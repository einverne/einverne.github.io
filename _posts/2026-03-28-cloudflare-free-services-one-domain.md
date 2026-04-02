---
layout: post
title: "Cloudflare 免费服务盘点"
aliases:
  - "Cloudflare 免费服务盘点"
  - "Cloudflare Free Tier"
tagline: "盘点 Cloudflare 免费套餐里那些被低估的生产力工具"
description: "从 DNS、CDN 到 R2 图床、Workers 无服务器计算、Pages 静态托管、D1 数据库、Tunnel 内网穿透，一个域名接入 Cloudflare 之后能白嫖到的所有免费服务全面盘点。"
category: 产品体验
tags:
  - cloudflare
  - free-tier
  - self-hosted
  - cloudflare-workers
  - cloudflare-pages
  - cloudflare-r2
  - cloudflare-tunnel
create_time: 2026-03-28 10:00:00
last_updated: 2026-03-28 10:00:00
---

![Cloudflare 免费服务全景](https://pic.einverne.info/images/2026-03-28-cloudflare-free-services-overview.png)

我一直觉得 [[Cloudflare]] 是互联网基础设施领域里最慷慨的公司之一。不是因为它便宜，而是因为它的免费套餐好用到让人心虚——总觉得哪天会收到账单，但用了好几年，账单真的没来过。

事情的起因很简单：我手里有几个域名，最早只是把 DNS 托管到 Cloudflare 上，图个解析快、面板好用。后来慢慢发现，光是一个域名接入 Cloudflare，能顺手用上的免费服务多到离谱。图床、邮箱、短链接、静态网站托管、内网穿透、数据库、甚至零信任安全网关，全部免费，而且不是"试用 14 天"那种免费，是长期可用的 Free Tier。

这篇文章就来系统地盘一盘，一个域名接进 Cloudflare 之后，到底能免费用多少东西。

## DNS：全球最快的免费 DNS

把域名接入 Cloudflare 的第一步就是把 Nameserver 指过去，这一步做完你就已经在享受全球最快的 DNS 解析服务了。Cloudflare 的公共 DNS 解析器 1.1.1.1 常年霸占全球最快 DNS 排行榜前列，而当你把域名托管到 Cloudflare 上时，你的域名也跑在同一套基础设施上。

对普通用户来说，DNS 解析快意味着访客输入你的域名后，浏览器能更快地找到你的服务器地址。这是网站加载的第一步，虽然只差几十毫秒，但积少成多，对全球用户的体验影响不小。Cloudflare DNS 免费版支持无限域名、无限记录数，还自带 DNSSEC 一键开启，你不需要为这些付一分钱。

## CDN：全球加速不限流量

接入 Cloudflare DNS 之后，你只需要把 DNS 记录的代理状态打开（那个橙色云朵图标），流量就自动走 Cloudflare 的全球 CDN 网络了。Cloudflare 在全球超过 300 个城市部署了节点，你的静态资源会被缓存到离用户最近的节点上。

最关键的一点：免费套餐不限流量。这在 CDN 行业里几乎是独一份。大多数 CDN 服务商按流量计费，流量一大账单就吓人。但 Cloudflare 的免费套餐没有带宽限制，不管你的网站一个月跑了 100GB 还是 1TB 流量，都不额外收费。对于个人项目、博客、作品集这类网站来说，这基本意味着你可以永远不用操心 CDN 费用。

## R2 对象存储：免费图床的最优解

[[Cloudflare R2]] 是 Cloudflare 推出的 S3 兼容对象存储服务，免费套餐提供 10GB 存储空间，每月 100 万次 Class A 操作（写入）和 1000 万次 Class B 操作（读取），而且最大的卖点是不收取出口流量费。

对于个人用户来说，R2 最直接的用途就是当图床。10GB 存储空间，按平均每张图片 200KB 计算，可以存大约 5 万张图，对于一个博客来说绰绰有余了。我自己就把博客的所有图片都托管在 R2 上，配合 Cloudflare 自家的 CDN，访问速度非常快，而且完全不用担心流量费爆炸的问题。

你可以直接用 R2 的公开访问功能绑定自己的域名，比如 `img.yourdomain.com`，这样图片链接就是你自己的域名，看起来干净专业，也不用担心第三方图床跑路的风险。即使搭配一个简单的 [[Workers]] 脚本做上传接口，整个图床方案的成本依然是零。

## Email Routing：无限别名的域名邮箱

[[Cloudflare Email Routing]] 可能是被低估最严重的免费服务之一。它允许你为自己的域名创建无限数量的邮箱别名，并将收到的邮件转发到你的真实邮箱（比如 Gmail）。

举个例子，你可以设置 `newsletter@yourdomain.com` 专门接收订阅邮件，`shopping@yourdomain.com` 用来注册购物网站，`dev@yourdomain.com` 用来注册开发者服务。所有邮件最终都会转发到你的 Gmail 里，但对外你使用的是不同的邮箱地址。这样做的好处很多：你可以轻松追踪哪些网站泄露了你的邮箱，也可以针对特定别名设置过滤规则，还能在某个别名收到太多垃圾邮件时直接把它停掉。

更进一步，Email Routing 支持 Catch-all 规则，也就是说 `任意字符@yourdomain.com` 都会被转发到你指定的邮箱。你在注册任何新账号时，可以随手编一个之前没用过的别名，完全不需要提前在 Cloudflare 面板里配置。这个功能配合密码管理器使用，简直是隐私保护的利器。

如果你需要更强大的域名邮箱管理，也可以订阅我维护的 [EV Hosting](https://client.einverne.info)。

## Workers：每天十万次免费请求的无服务器平台

[[Cloudflare Workers]] 是 Cloudflare 的无服务器计算平台，代码运行在全球边缘节点上，响应速度极快。免费套餐每天提供 10 万次请求，对于个人项目来说已经非常充裕了。

Workers 的玩法太多了，列举几个我觉得最实用的场景：

API 中转和代理是最常见的用途。很多海外 API 在国内访问不稳定，你可以用 Workers 做一层代理转发，把请求从 Cloudflare 的边缘节点发出去，稳定性和速度都会好很多。比如把 OpenAI 的 API 套一层 Workers，国内的应用就可以相对稳定地调用了。

短链接服务也是一个经典场景。Workers 配合 KV（键值存储，免费套餐每天 10 万次读取）可以非常轻松地搭建一个跑在自己域名上的短链接服务。整个实现可能只需要几十行代码，但效果完全不输任何商业短链接工具，而且链接走的是你自己的域名，品牌感拉满。

此外，Workers 还可以用来做网页内容改写、A/B 测试、请求鉴权、定时任务（配合 Cron Triggers）等等。每天 10 万次请求的额度，个人使用基本用不完。

## KV：轻量键值存储

[[Cloudflare Workers KV]] 是和 Workers 配套的全球分布式键值存储。免费套餐提供 1GB 存储空间，每天 10 万次读取和 1000 次写入。虽然写入次数不算多，但对于配置管理、短链接映射、简单的计数器、功能开关这类读多写少的场景来说完全够用。

KV 的数据会自动复制到全球所有边缘节点，读取延迟极低。如果你用 Workers 搭了一个短链接服务或者 API 网关，KV 就是最自然的数据存储选择——不需要额外配置数据库，不需要操心连接池和冷启动，直接在 Workers 代码里读写就行。

## Pages：无限带宽的静态网站托管

[[Cloudflare Pages]] 是一个专门用来托管静态网站的服务，类似于 [[Netlify]] 或 [[Vercel]]，但免费套餐更加慷慨。Pages 提供无限带宽、每月 500 次构建、支持自定义域名、自动 HTTPS，而且每次 Git 提交都会自动触发部署。

对于个人博客、作品集、文档站点、落地页这类静态网站来说，Pages 几乎是完美的托管方案。你只需要把代码推到 GitHub 或 GitLab，Pages 就会自动拉取、构建、部署。整个过程不需要你操心服务器、CDN、SSL 证书，部署完之后就可以躺平了。

Pages 还支持 Preview Deployments，每个 Pull Request 都会生成一个独立的预览链接，方便团队协作和代码审查。对于个人开发者来说，这意味着你可以先在预览环境确认效果，再合并到主分支正式上线，流程非常丝滑。

## Tunnel：不买服务器也能暴露本地服务

[[Cloudflare Tunnel]]（以前叫 Argo Tunnel）是我个人最喜欢的 Cloudflare 免费服务之一。它可以在你的本地机器和 Cloudflare 网络之间建立一条加密隧道，让外部用户通过你的域名访问你本地运行的服务，而不需要你有公网 IP，也不需要配置端口转发或购买云服务器。

使用场景非常多。比如你在本地开发了一个 Web 应用的 demo，想发给客户或同事预览，以前你可能需要部署到服务器上或者用 ngrok 之类的工具。现在你只需要运行 `cloudflared tunnel`，你的本地服务就可以通过 `demo.yourdomain.com` 这样的地址访问了，而且走的是你自己的域名，看起来就像一个正式上线的服务。

更进阶的用法是把家里的 NAS、Home Assistant 智能家居控制面板、或者其他自部署服务通过 Tunnel 暴露出去。这样你在外面也能安全地访问家里的服务，不需要搞动态 DNS、端口映射那些麻烦事，安全性也比直接暴露端口好得多，因为所有流量都经过 Cloudflare 的安全层。

## D1：免费的 SQLite 云数据库

[[Cloudflare D1]] 是 Cloudflare 推出的 Serverless SQLite 数据库。免费套餐提供每天 5 万次读取、2.5 万次写入和 5GB 存储空间（包含 1GB 的活跃存储），对于小型应用来说完全够用。

D1 和 Workers 是天然搭档。你可以用 Workers 写后端逻辑，用 D1 存数据，整个应用从计算到存储全部跑在 Cloudflare 的边缘网络上，不需要买任何服务器。适合做的东西包括：个人记账应用、TODO 清单、链接收藏夹、简单的 CRM、投票系统等等。只要你的应用数据量不大、并发不高，D1 免费版就能撑住。

D1 使用标准的 SQL 语法，支持事务和索引，如果你熟悉 SQLite 或任何关系型数据库，上手几乎没有学习成本。Cloudflare 还提供了一个 Web 控制台可以直接执行 SQL 查询，调试和管理都很方便。

## Zero Trust：给内部工具加一道安全门

[[Cloudflare Zero Trust]]（以前叫 Cloudflare for Teams）的免费套餐支持最多 50 个用户，提供了一套完整的零信任安全方案。

最实用的功能是 Access，它可以给你的任何 Web 应用加上一层身份验证。假如你用 Tunnel 把家里的 NAS 面板暴露到了公网，你肯定不希望任何人都能直接访问。这时候 Access 就可以在访问你的服务之前先弹出一个登录页面，支持 GitHub、Google、邮箱验证码等多种认证方式。只有通过验证的用户才能访问你的服务，整个配置在 Cloudflare 面板里点几下就能完成，不需要改动你的应用代码。

对于个人用户来说，50 个用户的额度基本就是"无限"——你加上家人和几个朋友，大概率用不到 10 个。但这个功能带来的安全性提升是实实在在的，你再也不用担心自部署的服务被扫描、被爆破了。

## Workers AI：免费的边缘 AI 推理

[[Cloudflare Workers AI]] 是 Cloudflare 在边缘网络上提供的 AI 推理服务，免费套餐每天提供 10,000 Neurons（Cloudflare 自己的计算单位）。这个额度听起来抽象，换算成实际用量大概是每天几百次文本对话，或者几十张图片生成，具体取决于你调用的模型大小。

Cloudflare 上架了不少开源模型，包括 Llama、Mistral、Stable Diffusion 等，覆盖文本生成、图像生成、文本分类、翻译、语音识别等多种任务。你可以直接在 Workers 里通过几行代码调用这些模型，不需要自己部署 GPU 服务器，也不需要管理任何基础设施。对于想在自己的项目里加一点 AI 能力但又不想为此付费的个人开发者来说，这个免费额度足够用来做原型验证或者轻量级的生产应用了。

配合 Workers 和 R2 使用，你甚至可以搭一个完整的 AI 应用：Workers 处理请求逻辑，Workers AI 做推理，R2 存储生成的内容，整条链路全部跑在 Cloudflare 上，成本依然是零。

## Turnstile：免费的人机验证

[[Cloudflare Turnstile]] 是 Cloudflare 推出的验证码替代方案，用来区分真人和机器人，而且对用户来说体验比传统验证码好得多——大多数情况下用户甚至不需要做任何操作，Turnstile 会在后台自动完成验证。

免费套餐不限使用量，这一点非常重要。如果你的网站有注册、登录、评论这类需要防刷的表单，Turnstile 可以帮你挡住大量的机器人注册和垃圾请求。集成方式也很简单，前端加几行 JavaScript，后端验证一个 token，比接入 reCAPTCHA 还省事，而且不需要让用户去点红绿灯或者找自行车。

对于做独立项目的开发者来说，注册防刷是一个很容易被忽视但又很头疼的问题。Turnstile 免费、无限量、用户体验好，基本上是目前个人项目防机器人的最优解。

## 还有一些值得一提的

除了上面这些主要服务，Cloudflare 免费套餐还附带了不少实用功能：

SSL/TLS 证书是很多人最早接触到的 Cloudflare 免费福利。只要你把域名的 DNS 解析托管到 Cloudflare，它就会自动为你的域名签发和续期 SSL 证书，全程不需要你手动操作。你不用去 [[Let's Encrypt]] 申请证书，不用配置自动续期脚本，不用担心证书过期导致网站打不开。对于不熟悉服务器运维的人来说，这一个功能就值得把域名接入 Cloudflare。而且 Cloudflare 提供的不只是边缘证书，还支持源服务器证书（Origin CA），可以加密从 Cloudflare 到你服务器之间的连接，实现全链路 HTTPS。

Web Application Firewall（WAF）基础规则是免费包含的，可以挡住一些常见的网络攻击，比如 SQL 注入和 XSS。虽然免费版的规则集不如付费版全面，但对于个人网站来说已经是一层不错的防护了。

DDoS 防护是 Cloudflare 所有套餐都包含的，包括免费套餐。Cloudflare 宣称可以缓解任意大小的 DDoS 攻击，你不需要做任何额外配置，只要流量走 Cloudflare 代理，就自动受到保护。

Analytics 提供基础的网站访问统计，包括请求数、带宽、访客来源国家等，虽然不如 Google Analytics 详细，但胜在无需加载任何脚本，不影响页面性能，也不涉及隐私问题。

## 最后

回过头来看，一个域名接入 Cloudflare 之后，你可以免费获得 DNS 解析、全球 CDN、10GB 对象存储图床、无限邮箱别名转发、每天 10 万次的无服务器计算、轻量键值存储、无限带宽的静态网站托管、内网穿透、SQLite 云数据库、零信任安全网关、边缘 AI 推理、免费人机验证、自动 SSL 证书，加上 WAF 和 DDoS 防护。这些服务组合在一起，几乎可以覆盖一个独立开发者或小团队的绝大部分基础设施需求，而且全部是长期可用的 Free Tier，不是什么试用期或者信用额度。

我自己目前用到的包括 DNS、CDN、R2 图床、Email Routing、Workers、Pages 和 Tunnel，基本上个人项目的基础设施全部跑在 Cloudflare 上。说实话，每次看到 Cloudflare 的账单显示 $0.00 的时候，都会有一种不真实感——这么多服务用下来居然真的不用花钱。

当然，Cloudflare 的商业逻辑也很清楚：用免费套餐吸引开发者，等你的项目做大了、流量涨了、需求复杂了，自然会升级到付费套餐。但对于个人用户和小项目来说，免费版已经足够好用，甚至好用到你可能好几年都不需要升级。

如果你手里有一个闲置域名，不妨花半小时把它接入 Cloudflare，然后慢慢探索这些免费服务。你会发现，一个域名加上 Cloudflare，能玩出的花样远比你想象的多。

## 相关链接

- [Cloudflare 免费套餐概览](https://www.cloudflare.com/plans/free/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Tunnel 文档](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
