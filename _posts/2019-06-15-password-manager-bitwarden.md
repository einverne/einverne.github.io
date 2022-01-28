---
layout: post
title: "全平台开源的密码管理软件 Bitwarden"
aliases: "全平台开源的密码管理软件 Bitwarden"
tagline: ""
description: ""
category: 产品体验
tags: [bitwarden, password, password-manager, lastpass, 1password, chrome, cross-platform]
last_updated:
---

今天逛博客偶然间见到了一款全平台开源的密码管理软件 -- Bitwarden，回想 2013 年的时候曾经写过一篇[密码管理的方案](https://einverne.wordpress.com/2013/04/02/%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86/)，一回首已经六年，而这六年间换了无数设备，换过无数密码，从最早手写，固定规则，到 KeePass，到 LastPass，还曾经买过一年的 LastPass 会员，如今稳定地用着 LastPass。也见证了 LastPass 从简陋的单纯的密码管理到 Chrome 上的自动填充，再到 Android 上的一键填充，最后 iOS 也开放了支持，所有的平台几乎 LastPass 通吃了， Auto Fill 的功能实在太贴心。

然后为了增加安全性很多网站开始开启二步验证，最早只有孤零零的 Google 一家，而如今但凡安全措施做的比较好的网站都支持了二步验证，而二步验证非常不愉快的一个使用体验就是无法跨设备同步，Google Authenticator 但只是非联网的一个本地应用，当然站在 Google Authenticator 的角度无疑是对的，完全隔离网络，那么再厉害的黑客也无法获知二步验证的数字，然而这一点却牺牲了用户使用的便携程度。我曾经遇到过一次手机无法开机而丢失所有二步验证的 token，这几乎让我崩溃，我需要到每一个网站去重置我的二步验证设置。而 LastPass Authenticator 虽然牺牲了一定的安全性，但带来的易用性确实方便了。只要开启同步换一个设备登录 LastPass 那么所有的内容都回来了。所以 LastPass 和 LastPass Authenticator 也成为了我每个设备的必用软件。

然而时间到了 2019 年，网络安全问题和个人隐私的问题日渐严重，在这样一个时间节点，我发现了 Bitwarden 这样一款软件，更让我惊讶的是从服务端到客户端全开源，并且全平台支持，甚至还支持命令行登录，这一点连 LastPass 都不曾做过。但这个应用服务如今还依然不流行，大多数的潜在用户都被 1Password 或者 LastPass 这样的服务提供方吸收了。基于这样的理由，虽然目前可能自动填充的功能还不及 LastPass, 但 Bitwarden 还是非常值得一试。

- <https://bitwarden.com/>
- <https://github.com/bitwarden>

简单的看了一下客户端基本用 C# 和 TypeScript 写成，因为不太熟悉 C# 暂时不看代码了。感兴趣可以自行到 GitHub 审查代码。

Bitwarden 解决了 LastPass 潜在的一些问题，但依然也引入了一些问题。LastPass 带来的问题一个就是安全问题，如何保证用户的密码在服务器同步时的安全性，虽然 LastPass 曾正面出来声明过所有的密码都是由客户端加密再进行传输，服务端是不进行解密的，但是这个不确定性就在于 LastPass 是否可信。另外一个问题就是 LastPass 集中了用户大量的密码，肯定是黑客等等专注需要攻破的系统，一旦发生 LastPass 主密码泄露事件，那么造成的影响就不是一家网站，而是附带的很多网站，那就是互联网的大事情了。而这一点也正是幸运的地方，那么 LastPass 肯定会雇佣一批安全专家对他们的系统进行维护，这远比维护一套自己的 Bitwarden 服务端的安全系数要高。

另外如果自行搭建 Bitwarden 服务端，那么一定要做好充分的安全工作，首先得保证服务器的安全，其次开启系统防火墙，保证只有自己才能访问。先写这么多之后再补充。

## 安装 Bitwarden 服务端
Bitwarden 的[官方网站](https://help.bitwarden.com/article/install-on-premise/) 提供了各个系统的安装方式。

Bitwarden 自己的[服务端](https://github.com/bitwarden/server) 依赖比较重，还需要 MySQL，所以我选择了 [Rust 实现的版本](https://github.com/dani-garcia/bitwarden_rs)

官方的 Wiki 中写的非常详细，使用 Docker Compose [搭建](https://github.com/dani-garcia/bitwarden_rs/wiki/Using-Docker-Compose)

## 使用 Bitwarden 客户端
Bitwarden 提供了非常丰富的客户端支持，从桌面端，到浏览器扩展，非常好用，并且 macOS 上还支持指纹。

## Bitwarden 结合 Alfred
[[Alfred]] 是 macOS 上一个启动器，Bitwarden 自身支持 [cli](https://bitwarden.com/help/article/cli/)，两者结合起来就非常方便使用了。

推荐使用：

- <https://github.com/blacs30/bitwarden-alfred-workflow>

主要的几个命令：

- `.bwauth` 授权
- `.bwconfig` 配置
- `.bwf` 搜索文件夹
- `.bw search_keyword` 搜索关键字


## vaultwarden 开启 admin 页面

强烈建议开启 HTTPS 之后再启用 admin 管理页面。

该页面允许管理员检查注册用户并进行管理，即使注册关闭了也允许邀请用户。

在配置中启用 `ADMIN_TOKEN`:

```
docker run -d --name bitwarden \
  -e ADMIN_TOKEN=some_random_token_as_per_above_explanation \
  -v /vw-data/:/data/ \
  -p 80:80 \
  vaultwarden/server:latest
```

强烈推荐使用 `openssl rand -base64 48` 来生成随机字符串作为 TOKEN。

启用之后页面会在 `admin` 页面。


## reference

- <https://github.com/dani-garcia/vaultwarden/wiki/Enabling-admin-page>