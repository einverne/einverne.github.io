---
layout: post
title: "gitconfig includeIf 管理多用户配置"
aliases: "gitconfig includeIf 管理多用户配置"
tagline: ""
description: ""
category: 经验总结
tags: [git, gitconfig, version-control, github, ]
last_updated:
---

`~/.gitconfig` 配置用来存储用户相关的配置，当 git 在提交或其他操作时，如果找不到项目目录下的 `.git/config` 文件时会回退到使用该全局配置文件。

大部分的配置可以通过 `git config` 来配置，比如常见的设置用户名和密码。

```
git config user.name "Ein Verne"
git config user.email "some@one.com"
```

通常情况下只需要维护一份全局的 `~/.gitconfig` 然后在各自的项目中维护自己的 `gitconfig` 即可，但是我最近遇到一个问题便是，我迁移了几十个项目到另外一台机器中，这些项目我需要一个 `~/.gitconfig-work` 的配置，用来区别和其他 `git config` 配置中使用的用户名和邮箱。

比如经常见到的 work 中有一个工作邮箱，自己在使用 GitHub 时有一个自己的邮箱，另外在其他开源项目中有一个独特的用户名和邮箱。这个时候就需要使用到 git 配置中的 `includeIf` 配置。

一份正常的 `~/.gitconfig` 配置可能是[这样的](https://github.com/einverne/dotfiles/blob/master/git/global.gitconfig):

```
[user]
	email = someone@gmail.com
	name = Ein Verne
	signingkey = 92
[push]
	default = matching
[alias]
	unstage = reset HEAD --
	a = add
	b = branch
[commit]
    gpgsign = true
[gpg]
    program = gpg
[includeIf "gitdir:~/play/"]
    path = .gitconfig-play
[includeIf "gitdir:~/projects/"]
    path = .gitconfig-wk
```

中间略有省略，不过大致的格式是这样。注意到最后的 `includeIf` 配置。

上面两行表示的意思就是对于 `~/play/` 下面的项目，使用 `~/.gitconfig-play` 配置。

看一下 `~/.gitconfig-play` 的配置。

```
[user]
	email = some@play.com
	name = Alex
```

然后对于 `~/projects/` 下面的项目，就使用 `~/.gitconfig-wk` 配置。

## reference

- <https://github.com/blog/2360-git-2-13-has-been-released>
- <https://git-scm.com/docs/git-config>
- <https://stackoverflow.com/a/36296990/1820217>
