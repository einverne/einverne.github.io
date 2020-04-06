---
layout: post
title: "使用 hub 命令来操作 GitHub"
tagline: ""
description: "hub 命令用来扩展 git "
category: 学习笔记
tags: [hub, github, git, version-control, ]
last_updated:
---

[hub](https://github.com/github/hub) 命令是 git 命令的扩展，利用 GitHub 的 API 可以轻松的扩展 Git 的能力，比如常见的 pull requests 可以通过命令行来实现。

## 安装
在官网的文档上，Mac 有一键安装，Fedora 有一键安装，唯独 Ubuntu/Mint 系列没有一键安装的，其实用 hub 的二进制也非常容易，不过没有一键安装，比如 `apt install hub` 这样的命令还是有些麻烦。

所以有了这个很简单的脚本

    VERSION="2.5.1"
    wget https://github.com/github/hub/releases/download/v$VERSION/hub-linux-amd64-$VERSION.tgz
    tar xzvf hub-linux-amd64-$VERSION.tgz
    sudo ./hub-linux-amd64-$VERSION/install

对于 bash，zsh 的自动补全可以参考文末的链接。

Mac 或者 Go 安装可以参考[这里](https://hub.github.com/)

当第一次和 GitHub 有交互时会弹出用户名和密码用来生成 OAuth token，token 保存在 `~/.config/hub` 文件中。或者可以提供 `GITHUB_TOKEN` 环境变量，值是拥有 repo 权限的 access token。

如果需要设置 zsh 的 autocomplete 可以

    # Setup autocomplete for zsh:
    mkdir -p ~/.zsh/completions
    cp ./hub-linux-amd64-$VERSION/etc/hub.zsh_completion ~/.zsh/completions/_hub
    echo "fpath=(~/.zsh/completions $fpath)" >> ~/.zshrc
    echo "autoload -U compinit && compinit" >> ~/.zshrc

    echo "eval "$(hub alias -s)"" >> ~/.zshrc


## 使用

### 贡献者
如果是开源项目贡献者，`hub` 可以使用命令来拉取代码，浏览页面，fork repos，甚至提交 pull requests 等等。

这里为了和 git 命令区别开，还是使用 hub 命令，如果熟悉之后可以设置一个别名直接用 hub 替换 git 命令。

    hub clone dotfiles      # clone own repo
    hub clone github/hub    # clone others
    hub browse -- issues    # Open browser and navigate to issue page

贡献者工作流

    hub clone others/repo
    cd repo
    git checkout -b feature
    git commit -m "done with feature"
    hub fork    # fork repo , hub command will add a remote
    hub push YOUR_USER feature
    hub pull-request

维护者工作流目前还没有用到先略过。

## 常用命令介绍

### hub push
将本地 branch push 到 remote，和 git 命令类似

    hub push REMOTE[,REMOTE2...] [REF]

比如

    hub push origin,staging,qa branch_name

### hub create
在 GitHub 创建 repo 并且添加 remote.

    hub create [-poc] [-d DESC] [-h HOMEPAGE] [[ORGANIZATION/]NAME]

## alias
编辑：

	git config --global --edit

添加：

	[alias]
		pr="!f() { \
			BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD); \
			git push -u origin $BRANCH_NAME; \
			hub pull-request; \
		};f "

这样以后使用 `git pr`，就可以实现，`push` 当前分支，并创建 PR 了。

## reference

- <https://github.com/github/hub/tree/master/etc>
- <https://andrewlock.net/creating-github-pull-requests-from-the-command-line-with-hub/t>
