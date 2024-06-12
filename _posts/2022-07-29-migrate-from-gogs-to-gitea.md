---
layout: post
title: "从 Gogs 迁移到 Gitea"
aliases:
- "从 Gogs 迁移到 Gitea"
tagline: ""
description: ""
category: 经验总结
tags: [ gogs, gitea, git, self-hosted  ]
create_time: 2022-07-29 04:26:39
last_updated: 2022-07-29 04:27:12
---

过去几年里面一直使用 Gogs，从 [NAS](/post/2020/02/qnap-_gogs_-docker-backup-and-restore.html) 上迁移到 VPS，然后[一路升级](/post/2021/10/upgrade-gogs-0-11-91-to-0-12-3.html)到最新版本，没出现啥问题。

## Gitea 和 Gogs 往事

Gitea 是 Gogs fork 出来由社区维护的项目。

- <https://blog.wolfogre.com/posts/gogs-vs-gitea/>

[在 Gitea 2016 年](https://blog.gitea.io/2016/12/welcome-to-gitea/) 发表的文章中提到，Gitea 是由一群不满意 Gogs 单一维护者管理的一群 Gogs 用户而诞生的新项目。

Gitea 有三位 Owner，每年选举一次，任何人只要有至少 4 次贡献被接受就可以申请成为 maintainer。

Gitea 和 Gogs [横向对比](https://docs.gitea.io/zh-cn/comparison/)

## 从 Gogs 0.12.x 升级到 Gitea

正在运行 Gogs 0.9.146 以下版本，你可以平滑的升级到 Gitea。

- 备份 Gogs 和数据库

## reference

- <https://docs.gitea.io/en-us/upgrade-from-gogs/>
- <https://awk.space/blog/gogs-to-gitea/>
