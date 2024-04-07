---
layout: post
title: "在命令行下使用 GitHub Copilot CLI"
aliases:
- "在命令行下使用 GitHub Copilot CLI"
tagline: ""
description: ""
category: 产品体验
tags: [github, github-copilot, cli, linux, shell, zsh, ai, artificial-intelligence]
create_time: 2023-03-31 22:36:59
last_updated: 2023-03-31 22:36:59
---

GitHub Copilot CLI 是一个让 GitHub Copilot 来在命令行环境下使用自然语言提示命令行的工具。

如果要使用 GitHub Copilot CLI ，那么必需能够访问 [GitHub Copilot](https://github.com/features/copilot/)，并且还需要通过 [waitlist](https://githubnext.com/projects/copilot-cli/)。另外需要注意的是 GitHub Copilot CLI 目前还是在试验中（technical preview），有一些 corner case 或者还有一些平台支持可能不完善，并且 CLI 补充的任何命令请在完全知晓是什么内容和作用的情况下再执行。

- <https://www.npmjs.com/package/@githubnext/github-copilot-cli>
- 有问题可以加入 [Discord](https://discord.com/invite/githubnext)

## 最新教程

GitHub Copilot 已经发布正式版本，可以直接通过官方的 `gh` 命令来使用。

```
gh auth login
gh extension install github/gh-copilot
gh extension upgrade github/gh-copilot
```

几个子命令

```
# 解释命令
gh copilot explain "sud apt update"
# 执行命令
gh copilot suggest
gh copilot suggest "show process"
```

设置 alias

```
echo 'eval "$(gh copilot alias -- zsh)"' >> ~/.zshrc
```

然后就可以执行

```
ghce
ghcs
```

参考[官方文档](https://docs.github.com/en/copilot/github-copilot-in-the-cli/using-github-copilot-in-the-cli)。

## 安装

使用 `npm` 全局安装：

```
npm install -g @githubnext/github-copilot-cli
```

然后将 `github-copilot-cli` 添加到 PATH，然后使用下面的命令授权

```
github-copilot-cli auth
```

然后按照命令行的提示在网页授权。一旦授权，token 会保存在用户设备本地，为后续的请求使用。这个命令正常只会在第一次使用的时候执行。

更新命令

```
npm install -g @githubnext/github-copilot-cli
```

设置 alias

正常情况下可以直接执行 `github-copilot-cli` 来使用，但是更建议使用 `??`, `git?`, `gh?` 这样的方式。

可以在 Shell 的配置 `.zshrc` 和 `.bashrc` 中添加

```
eval "$(github-copilot-cli alias -- "$0")"
```

## 使用

GitHub Copilot CLI 会将自然语言转变成 shell 命令，在安装之后可以通过如下三种方式使用：

- `??` 将自然语言变成命令
- `git?` 将自然语言变成 git 命令
- `gh?` 将自然语言变成 GitHub CLI 命令

![s8dN](https://photo.einverne.info/images/2023/04/17/s8dN.jpg)

GitHub Copilot CLI 的三种模式均以相同方式工作 ---- 编写自然语言查询来声明您想要的内容，然后 GitHub Copilot CLI 将尝试构建一个命令或命令序列来执行它。

如果满意 Copilot 建议的命令，只需要求 GitHub Copilot CLI 运行它即可。

GitHub Copilot CLI 还会逐步解释建议命令的作用。 当学习新命令时尤其需要注意：shell 非常强大，您可能会无意中做出您不打算进行的破坏性的变化。在运行命令之前，一定要确保您理解建议命令的作用。像所有 AI 系统一样，GitHub Copilot CLI 不是完美的，可能会犯错误。

## Shell 使用注意事项

因为直接使用 Shell ，而有一些关键的符号在 Shell 中有其自身的含义，所以有一些需要特别注意的内容。

有一些符号可能在提交到 GitHub Copilot CLI 之前就被 Shell 处理了，所以避免使用如下的符号，或者使用 `\` 转义，或者将符号放到单引号 `'...'` 中。

- 查询中的单引号 `'`，双引号 `"`，或者问号，感叹号，通常会造成 shell 的语法错误，如果遇到这种情况，按 `Ctrl-c`，然后重新查询即可
- 括号，包括 `() [], {}` 也可能造成语法错误
- `*` 号，会匹配文件或文件夹，这会导致敏感的文件名出现在查询中
- `|` 管道符，将被解释为 shell pip，并将查询解释为单独的命令。造成查询 Copilot 失败
- 小心，避免在任何变量前使用 `$` ，这会导致 Shell 将其扩展成一个变量值，并且可能无意之间将敏感的环境变量传给 GitHub Copilot 查询

## related

- [Warp](/post/2022/03/warp-terminal-usage.html) 是我去年介绍的一款使用 Rust 编写的终端，Warp 也提供了类似的通过 AI 支持的命令行补全，如果感兴趣也可以去体验一下。
- 另外还有一些 Zsh 插件也可以借助 OpenAI Codex 的能力提供命令自动补全的能力，比如 [Zsh Codex](https://github.com/tom-doerr/zsh_codex) 但是该项目有一段时间没有更新了。
- [[AI Shell]]