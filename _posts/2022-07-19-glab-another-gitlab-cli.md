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
配置文件的地址在本地 `~/.config/glab-cli/`。

```
❯ cat .config/glab-cli/config.yml
# What protocol to use when performing git operations. Supported values: ssh, https
git_protocol: https
# What editor glab should run when creating issues, merge requests, etc.  This is a global config that cannot be overridden by hostname.
editor:
# What browser glab should run when opening links. This is a global config that cannot be overridden by hostname.
browser:
# Set your desired markdown renderer style. Available options are [dark, light, notty] or set a custom style. Refer to https://github.com/charmbracelet/glamour#styles
glamour_style: dark
# Allow glab to automatically check for updates and notify you when there are new updates
check_update: false
# Whether or not to display hyperlink escapes when listing things like issues or MRs
display_hyperlinks: false
# configuration specific for gitlab instances
hosts:
    gitlab.com:
        # What protocol to use to access the api endpoint. Supported values: http, https
        api_protocol: https
        # Configure host for api endpoint, defaults to the host itself
        api_host: gitlab.com
        # Your GitLab access token. Get an access token at https://gitlab.com/-/profile/personal_access_tokens
        token:
# Default GitLab hostname to use
    gitlab_host:
      token: glpxxx
      apt_host: gitlab_host
      git_protocol: https
      api_protocol: https
      user: gitlab_username
host: gitlab.com
```

附加填充里面的 `token` 等信息即可。

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
