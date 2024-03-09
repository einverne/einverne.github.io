---
layout: post
title: "将 Blogger 备份并转成 Markdown 导入 Obsidian"
aliases:
- "将 Blogger 备份并转成 Markdown 导入 Obsidian"
tagline: ""
description: ""
category: 经验总结
tags: [ blogger, xml-to-markdown, obsidian, markdown, nodejs ]
create_time: 2024-03-09 22:44:21
last_updated: 2024-03-09 22:44:21
dg-home: false
dg-publish: false
---

这两天看到有人分享自己的密码管理方案是通过固定 Pattern 然后根据不同的网站设定一个随机可记忆字串来防止密码泄漏之后影响其他网站，于此同时也一定程度上可以摆脱密码管理器的约束。这也是我这 10 多年来的密码管理方案，虽然我还是会强烈推荐 Bitwarden，当一些重要的网站我还是会选择自己记住密码，并且加上二步验证保护安全，而其他网站则是通过密码管理器来管理。

但是我明明记得我写过一篇关于密码管理的文章，但就是怎么都没有找到，后来一想这已经是十年前写在 Blogger 上面的文章，于是突然想把沉积多年的 Blogger 内容备份出来，并转成 Markdown ，导入到 Obsidian，因为我一直认为只有被反复唤起（搜索）的内容才有价值。

既然有了这个目标，那么说干就干，首先是导出 Blogger 的内容，这一点在设置中，直接可以选择 Backup，下载获取到一个特殊格式的 XML 文件。

然后我用 Google 简单的搜索了一下 Blogger to Markdown，发现原来已经有人使用 NodeJS 实现过了。但代码直接运行有一些异常，打开代码看看，做了一下[修复](https://github.com/einverne/blog2md)。

然后再运行命令，不到一分钟的时间就把 2010 年到 2019 年的内容转成了 Markdown。

![Fxo2sAk_OP](https://pic.einverne.info/images/Fxo2sAk_OP.png)

## Blogger

在这个时间点又不免再感慨一下，Blogger 当年作为一个非常流行的博客平台，如今却半死不活，很多年没有更新，Google 内部可能也放弃维护了，并且非常无语的是，我登录了后台才发现，以前明明发布的内容，却告诉我有一些文章被 Blogger 自动取消发布了，说违反了社区规则，但我仔细地看了一下这几篇文章，是 2014 年发表的一篇《继续折腾 WNDR3800 之 shadowsocks》，这篇文章已经存在互联网上 6 年，但却告诉我在 2020 年违反了社区规则？实在没有搞懂 Google。

![I_V2Ou3VaB](https://pic.einverne.info/images/I_V2Ou3VaB.png)

我仔细的检查了一下文章内容，无非就是几行代码，以及一些 iptables 的配置，完全看不出任何违反社区规则的内容。
![tgMxnz8HSo](https://pic.einverne.info/images/tgMxnz8HSo.png)

## 一些感慨

在把文件导出来之后，也看了几篇当时写的文章，感慨物是人非，那个时候我还是非常喜欢 Google，也会在第一时间去尝试 Google 的所有的服务，当时也写了很多 Google+ 的使用感受，当时也确实在 Google+ 认识了一些朋友，但后来的事情其实大家也都知道，自从 Google+，Google Reader 关闭以来，我就已经开始自主的脱离 Google 的生态，将所有我自己产生的数据慢慢地从 Google 从移走，Google Photo 等等。

而到了 2024 年，Google 突然遇到 OpenAI 的「劲敌」，至于 AI 是否会颠覆传统的搜索引擎，在这个时间还不好说，但可以肯定地说肯定会代替一部分的搜索流量，至于是否会影响到 Google 的广告业务，那也只能让我们拭目以待了。
