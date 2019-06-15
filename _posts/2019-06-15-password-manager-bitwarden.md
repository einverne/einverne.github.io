---
layout: post
title: "全平台开源的密码管理软件 Bitwarden"
tagline: ""
description: ""
category: 产品体验
tags: [bitwarden, password, password-manager, lastpass, 1password, chrome, cross-platform]
last_updated:
---

今天逛博客偶然间见到了一款全平台开源的密码管理软件，回想 2013 年的时候曾经写过一篇密码管理的方案，一回首已经六年，而这六年间换了无数设备，换过无数密码，从最早手写，固定规则，到 KeePass，到 LastPass，还曾经买过一年的 LastPass 会员，如今稳定地用着 LastPass。也见证了 LastPass 从简陋的单纯的密码管理到 Chrome 上的自动填充，再到 Android 上的一键填充，最后 iOS 也开放了支持，所有的平台几乎 LastPass 通吃了， Auto Fill 的功能实在太贴心。然后为了增加安全性很多网站开始开启二步验证，最早只有孤零零的 Google 一家，而如今但凡安全措施做的比较好的网站都支持了二步验证，而二步验证非常不愉快的一个使用体验就是无法跨设备同步，Google Authenticator 但只是非联网的一个本地应用，当然站在 Google Authenticator 的角度无疑是对的，完全隔离网络，那么再厉害的黑客也无法获知二步验证的数字，然而这一点却牺牲了用户使用的便携程度。我曾经遇到过一次手机无法开机而丢失所有二步验证的 token，这几乎让我崩溃，我需要到每一个网站去重置我的二步验证设置。而 LastPass Authenticator 虽然牺牲了一定的安全性，但带来的易用性确实方便了。只要开启同步换一个设备登录 LastPass 那么所有的内容都回来了。所以 LastPass 和 LastPass Authenticator 也成为了我每个设备的必用软件。

然而时间到了 2019 年，网络安全问题和个人隐私的问题日渐严重，在这样一个时间节点，我发现了 Bitwarden 这样一款软件，更让我惊讶的是从服务端到客户端全开源，并且全平台支持，甚至还支持命令行登录，这一点连 LastPass 都不曾做过。但这个应用服务如今还依然不流行，大多数的潜在用户都被 1Password 或者 LastPass 这样的服务提供方吸收了。基于这样的理由，虽然目前可能自动填充的功能还不及 LastPass, 但 Bitwarden 还是非常值得一试。

-<https://bitwarden.com/>
- <https://github.com/bitwarden>

简单的看了一下客户端基本用 C# 和 TypeScript 写成，暂时还无法看代码了。感兴趣可以自行到 GitHub 审查代码。

Bitwarden 解决了 LastPass 潜在的一些问题，但依然也引入了一些问题。LastPass 带来的问题一个就是安全问题，如何保证用户的密码在服务器同步时的安全性，虽然 LastPass 曾正面出来声明过所有的密码都是由客户端加密再进行传输，服务端是不进行解密的，但是这个不确定性就在于 LastPass 是否可信。另外一个问题就是 LastPass 集中了用户大量的密码，肯定是黑客等等专注需要攻破的系统，一旦发生 LastPass 主密码泄露事件，那么造成的影响就不是一家网站，而是附带的很多网站，那就是互联网的大事情了。而这一点也正是幸运的地方，那么 LastPass 肯定会雇佣一批安全专家对他们的系统进行维护，这远比维护一套自己的 Bitwarden 服务端的安全系数要高。

另外如果自行假设 Bitwarden 服务端，那么一定开启防火墙，保证只有自己才能访问。先写这么多之后再补充。
