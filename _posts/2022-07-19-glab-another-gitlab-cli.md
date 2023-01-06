---
layout: post
title: "使用 glab 提交 Merge Request"
aliases:
- "使用 glab 提交 Merge Request"
tagline: ""
description: ""
category: 经验总结
tags: [ gitlab, git, cli, gitlab-cli, golang, ]
last_updated: 2023-01-05 04:15:46
create_time: 2022-07-19 03:52:22
---

glab 是一款使用 Go 语言实现的和 GitLab 实例交互的命令行工具。

之前是在 [GitHub](https://github.com/profclems/glab) 上开发，但在 2022 年 11 月 22 之后，被 GitLab 官方采用，变成了[官方支持](https://gitlab.com/gitlab-org/cli)的 cli 工具。

- <https://gitlab.com/gitlab-org/cli>

## Installation

macOS & Linux 使用 Homebrew：

```
brew install glab
```

## config
配置文件的地址在本地 `~/.config/glab-cli/`

## 环境变量

```
GITLAB_URL=
# or GITLAB_HOST=
GITLAB_TOKEN=
```

## zsh completion

    glab completion -s zsh > /path/to/zsh/completion

可以通过 `echo $FPATH` 来查看本机 Zsh 的 completion 文件路径。

## merge requests

创建 Merge Request:

    glab mr create -a username -t "fix something"
    glab mr create --autofill --labels bugfix
    glab mr create --squash-before-merge --remove-source-branch -a username -t "feat: message"

合并

    glab mr merge 123
    glab mr note -m "needs to do before it can be merged" branch-foo

同意：

    glab mr approve {id | branch} [flags]

    glab mr approve 234
    glab mr approve 234 456
    glab mr approve branch-1
    glab mr approve branch-1 branch-2

- <https://glab.readthedocs.io/en/latest/mr/approve.html>

## reference

[[2019-06-20-gitlab-cli-merge-request]]
