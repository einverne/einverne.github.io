---
layout: post
title: "在 JetBrains IntelliJ IDEA 中使用 GitHub Copilot"
aliases: 
- "在 JetBrains IntelliJ IDEA 中使用 GitHub Copilot"
tagline: ""
description: ""
category: 经验总结
tags: [ jetbrains, intellij-idea, github, github-copilot, ]
last_updated:
---

虽然之前早早的就把 GitHub Copilot 在 Visual Studio Code 上用了起来，但是平时使用的 IDE 还是 IntelliJ IDEA 比较多，今天刷 Twitter 看到有人分享说在 IntelliJ IDEA 上可以通过添加 preview 的 plugin 源来添加 GitHub Copilot 插件支持，搜了一下果然可以。

具体的教程可以参考[GitHub](https://github.com/github/copilot-preview/blob/main/docs/gettingstartedjetbrains.md)。

主要的步骤就是通过在插件管理里面添加 Plugin repository:

    https://plugins.jetbrains.com/plugins/super-early-bird/list

然后重启之后搜索 `github copilot` 安装启用。不过需要注意的是该插件只有在 IDEA 2021.2 及以上版本中才能安装。

![](/assets/intellij-idea-github-copilot-20211023143804.png)

安装之后在 Tools -> GitHub Copilot 中登录，启用。

## 快捷键 {#shortcut}

记录整理一些常用的快捷键。在默认情况下，Tab 就是选中默认的。Esc 是取消建议。

- Option(macOS)/Alt(Windows/Linux) + `[` 或 `]` 可以选择上一条或下一条建议
- Option(macOS)/Alt(Windows/Linux) + Enter 可以查看更多的建议
- Trigger inline suggestion: Alt + `\` or Option + `\`。
