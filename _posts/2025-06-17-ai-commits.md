---
layout: post
title: "让 AI 来编写 Git 提交变更信息"
aliases:
- "让 AI 来编写 Git 提交变更信息"
tagline: ""
description: ""
category: 经验总结
tags: [ ai, openai, git, git-message, ai-tools, ]
create_time: 2025-06-18 11:44:45
last_updated: 2025-06-18 11:44:45
dg-home: false
dg-publish: false
---

很早之前就看到了 GitHub Copilot 可以在 VS Code 中提交 Git 时自动编写提交 Message，但是实际上我一直没有用起来。正好现在对 Git Message 做一个完整的学习，顺便也了解一下当前的 AI Commits 方案。

之前其实看到过一个对于 Commit message 的规范 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)，之前的一些提交提交历史也是按照 feat, fix 等等方式来进行的，但是其实理解和书写起来也没完全按照这个模式，只借鉴了其中关于提交类型的部分。所以这次调研才看到对于内容部分更详细的说明，现在很多 AI 来产生提交历史的时候，更能看出来区别。

## Git 历史的重要性

Git 历史记录讲述了项目文件的演进过程，包括了什么被修改了，为什么被修改，所有团队中的成员都可以有效地审查变更，通过查看 Git 变更历史可以非常容易地查明 bug 以及破坏性更改的来源。但是往往开发者在花了数小时编写代码之后，却在 Git Message 提交的时候忽略了其重要性，导致 Git 历史非常难以定位和排查。所以本文就来总结一下目前比较好用的 AI 提交 Git message 的方法。


- GitHub Copilot
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [[lumen]]
- [AI Commits](https://github.com/Nutlope/aicommits)
- [GitAI CLI](https://github.com/keli-wen/gitai-cli)

## lumen

[lumen](https://github.com/jnsahaj/lumen) 是一个使用 Rust 编写的命令行工具，可以将 AI 结合到 git 工作流中，用来生成 Git 提交历史。

安装

```
brew install jnsahaj/lumen/lumen
```

可以利用 `lumen draft` 来生成提交历史，在运行这一行命令之前记得将代码 git add 到暂存区中。

默认情况下 lumen 会调用 Phind 这一个模型来生成，但是如果自己想配置 OpenAI，或者 Claude 也可以[指定](https://github.com/jnsahaj/lumen)。

## AI Commits

AI Commits 是一个基于命令行的工具，使用 TypeScript 编写，可以调用大语言模型帮助我们提交 Git 信息。

使用 AI Commits 需要设置 OpenAI 的 API Key。

```
npm install -g aicommits
aicommits config set OPENAI_KEY=XXX
aicommits
aicommits --type conventional
```

AI Commits 可以生成符合 Conventional Commits 规范的提交信息。

## JetBrains IntelliJ IDEA

我个人使用 IntelliJ IDEA 比较多，所以在 IDEA 中也找到了一款 AI Commits 的插件。

![8zyg](https://photo.einverne.info/images/2025/06/18/8zyg.png)

安装之后打开设置，就可以配置调用的模型，以及系统的 Prompt。

![8Z7w](https://photo.einverne.info/images/2025/06/18/8Z7w.png)
