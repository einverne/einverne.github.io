---
layout: post
title: "我的 Obsidian 跨设备同步方案"
tagline: ""
description: ""
category: 检验总结
tags: [obsidian, markdown, git, syncthing, ]
last_updated:
---

自从半年前发现了 [Obsidian](/post/2020/05/obsidian-note-taking.html) 这款笔记软件，我就开始大量的使用该笔记，有人说过：「工具是开发者方法论的固化」。这么多年了我一直有一种工具控的倾向，往往同一个需求会对比可能的所有方案，最后再决定一个，但是近些年来我越来越倾向于「简单就是好」，并且数据要由自己掌控的「工具选择逻辑」。

## Do one thing and do it well
基于上面的选择逻辑，我的 Obsidian 跨平台同步工具，我选择了：

- [Syncthing](/post/2019/10/syncthing.html)，作为文件同步工具
- Markor，作为 Android 上的 Markdown 编辑器，我提交了一段模板可以来创建 Zettelkasten 笔记
- Git，版本同步（配合git subtree）
- Bash/Cron/Hammerspoon，定时脚本提交备份到 Git




