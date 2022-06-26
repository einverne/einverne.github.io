---
layout: post
title: "zinit 作者删库事件以及后续代替方案"
aliases: 
- "zinit 作者删库事件以及后续代替方案"
tagline: ""
description: ""
category: 经验总结
tags: [ zinit, github, repository,  ]
last_updated:
---

前两天在新机器上使用我的 dotfiles 配置的时候，本来会自动安装 zinit，并进行一些初始化配置，但突然发现卡在了 zinit 配置拉取的过程中，还以为 GitHub 权限配置的问题，但仔细看了一下发现作者把整个仓库，以及个人页面都给删除了。 `https://github.com/zdharma/zinit` 这个仓库显示 404，我还以为产生了错觉，因为刚刚从 Google 点击跳转过来，Google 的结果还在，但自己一搜就发现原来真的是作者本人把仓库删除了。

所以也没有办法，除了我本地的一份缓存，最近一次提交还是 6 月份，所以只能搜索一下看看还有没有人有最新的备份，然后就看到了 [GitHub 上之前贡献者新建的社区维护的仓库](https://github.com/zdharma-continuum/I_WANT_TO_HELP)。把我 dotfiles 中的地址替换成[该仓库](https://github.com/zdharma-continuum)目前暂时没有遇到任何问题。

另外要注意如果用到了如下的插件也要响应地替换：

    zdharma/zinit   -> zdharma-continuum/zinit
    zdharma/fast-syntax-highlighting   -> zdharma-continuum/fast-syntax-highlighting
    zdharma/history-search-multi-word -> zdharma-continuum/history-search-multi-word

我个人也备份了一份代码 <https://github.com/einverne/zinit> 有兴趣可以看看。

不过我个人还是建议切换到社区维护的版本上。

## 一点感想

我不对作者的行为做任何评价，因为我并不清楚发生了什么，但是无疑这种删库的行为已经伤害了曾经的使用者，以及曾经贡献过代码的开发者。代码容易恢复，当作者仓库的 wiki 内容已经只能从 Google Cache 中恢复了，这无疑会对使用者造成一些困扰。

从这件事情延伸到生活中，以及这两天刚刚发生的 [[Notability]] 买断制更改为订阅模式造成的恶劣舆论影响，让我不经去思考，在如今这样的严重依赖数字化的生活中保持安定。在过去的经历中，已经让我渐渐地养成习惯，尽量去使用[[自由软件]]（能够获取源码），尽量去使用跨平台能导出可使用数据的软件（比如 Obsidian 即使再用不了，我还可以用任何编辑器去编辑我的笔记），如果有离线可用的，绝不用在线服务（Obsidian 相较于 Notion，Notion 开始就不在我的备选方案）。虽然已经这样的做法已经渐渐地让我不会再受到服务关闭的影响，但于此同时我需要考虑的东西就变得多了，数据安全问题，数据备份的问题，这只是涉及数字资产。

但生活中比数字资产重要多的东西也非常多，要做好任何重要的东西可能丢失的备份策略，如果丢失身份证呢，如果在旅行的过程中丢失了护照呢，或者手机失窃了呢？ 去备份任何你生活需要依赖的东西，不要将手机和身份证放到一起，不要将银行卡和任何证件放到一起，去备份你生活中产生的任何[个人的数据](/post/2020/01/backup-data-and-system.html)。

## reference

- [使用 zinit 管理 zsh 插件 代替 Antigen](/post/2020/10/use-zinit-to-manage-zsh-plugins.html)
- [[2020-10-17-use-zinit-to-manage-zsh-plugins]]
- [Reddit discuss](https://www.reddit.com/r/zinit/comments/ffohjj/zinit_project_status_paranoia/)
- <https://github.com/nuta/nsh>