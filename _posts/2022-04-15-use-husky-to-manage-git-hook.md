---
layout: post
title: "使用 Husky 来管理 git hook"
aliases:
- "使用 Husky 来管理 git hook"
tagline: ""
description: ""
category: 学习笔记
tags: [ husky, git-hook, git,  ]
last_updated:
---

今天在 GitHub 上看到一个 repo，在其根目录中包含了一个 `.husky` 的文件夹，好奇之下就去搜索了以，于是发现了 husky 这个项目，这是一个使用 JavaScript 实现的用来管理 Git hooks 的工具。

GitHub: <https://github.com/typicode/husky>

## 什么是 Git hook
首先要先了解一下 Git hooks，对于 git 已经是现代开发中必不可少的一个工具了，大家应该都比较熟悉，但是可能很多人在项目中并没有使用过 Git 的 hooks。

Git 的 hooks 允许用户在特定的时机执行用户自定义的脚本。

比如非常常见的，在提交之后自动对代码内容进行一些常规检查，如果失败则不允许提交等等。常用的 hook 有 `pre-commit`, `commit-msg`，`pre-push` 等。

Git hooks 是基于事件的，Scott Chacon 在 Pro Git 书中将 hooks 分成几个类型：

- 客户端 hook，在使用者自己的本地环境中被调用。
    - 代码提交相关的 hook，在提交动作前后，通常用于检查完整性，生成提交信息，校验，发出通知等等
    - Email 相关的 hook，主要用于 Email 提交的代码。像 Linux 内核使用 Email 提交补丁会使用到。工作方式和提交类 hook 相似
    - 其他类，包括代码合并，check-out，rebase，rewrite，clean 等等
- 服务端 hook，一般在服务器端执行，用于接受推送，部署在 git 仓库的服务器上
    - 触发类，在服务器接收到一个推送之前或之后执行动作，前触发用于检查，后触发用于部署
    - 更新，类似前触发，更新的 hook 是以分支作为作用对象，在分支更新通过之前执行

hook 列表：

| hook 名称            | 触发命令                             | 描述                                                                                        | 参数个数描述             |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------ |
| `applypatch-msg`     | `git am`                             | 编辑 commit 时提交的 message，通常用于验证或纠正提交的信息以符合项目标准                    | 包含预备提交信息的文件名 |
| `pre-applypath`      | `git am`                             | 变更 commit 之前，如果以非 0 退出，会导致 uncommit 状态，用于 commit  之前的检查              |                          |
| `pre-applypath`      | `git am`                             | commit 完成提交之后，主要用于通知                                                           |                          |
| `pre-commit`         | `git commit`                         | 获取 commit message 之前，非 0 退出会取消本次 commit，检查 commit 自身，而不是 commit message |                          |
| `prepare-commit-msg` | `git commit`                         | 接收默认 commit message 之后，启动 commit message 编辑器之前。                              |                          |
| `commit-msg`         | `git commit`                         | message 提交之后修改 message 的内容或退回不合格的 commit                                    |                          |
| `post-commit`        | `git commit`                         | commit 完成之后调用，主要用于通知                                                           |                          |
| `pre-rebase`         | `git rebase`                         | 执行 rebase 时，可用于中断不想要的 rebase                                                   |                          |
| `post-checkout`      | `git checkout` 和 `git clone`        | 更新工作树后调用 checkout 时，或执行 git clone 后，主要用于验证环境、显示变更、配置环境     |                          |
| `post-merge`         | `git merge` or `git pull`            | 合并之后调用                                                                                |                          |
| `pre-push`           | `git push`                           | 推送远程之前                                                                                |                          |
| `pre-receive`        | 远程 repo 进行 `git-receive-pack`      | 远程 repo 更新刚被 push 的 ref 之前调用，非 0 会中断本次                                      |                          |
| `update`             | 远程 repo 进行 `git-receive-pack`    | 远程 repo 每一次 ref 被 push 的时候调用                                                     |                          |
| `post-receive`       | 远程 repo 进行 `git-receive-pack`    | 远程 repo 所有的 ref 更新之后                                                               |                          |
| `post-update`        | `git-receive-pack`                   | 所有 ref 被 push 后执行一次                                                                 |                          |
| `pre-auto-gc`        | `git gc --auto`                      | 用于在自动清理 repo 之前做一些检查                                                          |                          |
| `post-rewrite`       | `git commit --amend` 或 `git rebase` | git 命令重写 rewrite 已经被 commit 的数据时调用                                                                                            |                          |

在 `.git` 这个隐藏的文件目录下，有一个 `hooks/` 文件夹，下面通常会有一些 sample 文件。如果要使其生效，去掉后缀 sample 即可

目录下的每一个文件都是可执行的文件，脚本通过文件名调用，内容的第一行必须有 Shebang `#!`，引用正确的脚本解析器，比如 bash, perl, python, nodejs 等。Git hooks 使用的脚本语言是没有限制的。

比如在 `pre-commit` 中执行代码检查：

```
#!/bin/sh
npm run lint

# 获取上面脚本的退出码
exitCode="$?"
exit $exitCode
```

## 什么是 Husky
通过上面的简单了解也可能看到本地的 `git hook` 是保存在本地的 `.git` 文件夹中的，本地的 `git hook` 是不会被提交到版本控制中的。这就存在了一个问题，便是如何在项目中管理 Git hooks，这个时候就需要 Husky 登场了。

目前已经有非常多的项目在使用 `husky` 了，包括：

- webpack
- babel
- create-react-app

Husky 的原理就是在项目的根目录中使用一个配置文件，然后在安装 Husky 的时候把配置文件和 Git hook 关联起来，在团队之间共享。

### 安装
安装：

    npm install husky --save-dev

在项目中安装：

    npx husky install

### 配置 Husky
使用 Husky 之前确保安装了 `npm`。

    npm install husky -D

Husky 支持如下几种格式配置：

- .huskyrc
- .huskyrc.json
- .huskyrc.yaml
- .huskyrc.yml
- .huskyrc.js
- husky.config.js

以 `.huskyrc` 为例：

```
{
  "hooks": {
    "pre-commit": "git restore -W -S dist examples/dist && eslint ."
  }
}
```

这一个例子就是每次执行 `git commit` 之前把 `dist` 和 `examples/dist` 中的修改撤掉，不提交到仓库中，然后执行 EsLint。

### Husky 原理
Husky 做了两件事情：

- 创建 `~/.husky` 目录
- `husky install` 时设置 `~/.husky` 目录为 `git hooks` 目录。

### 创建 Hook
使用 `husky add`:

    npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'

### 卸载还原 Husky

```
npm uninstall husky
// 删除.husky文件夹，并且重置core.hooksPath
rm -rf .husky && git config --unset core.hooksPath
```

## Husky 注意事项

Husky 不支持服务端 hooks。

包括 `pre-receive`、`update`、`post-receive` 。

如果想跳过所有的 hooks，可以使用：

    HUSKY_SKIP_HOOKS=1 git rebase ...

## 不使用 Husky 同步 Git hooks
在 git 2.9 中引入了 `core.hooksPath` 配置，可以手动配置 `git hooks` 所在的目录。这也就使得我们可以在另外的目录中创建 Git hooks，然后手动设置 Hooks 目录来实现 hooks 脚本的同步。

## reference

- <https://git-scm.com/docs/githooks>
- [How To Use Git Hooks To Automate Development and Deployment Tasks](https://www.digitalocean.com/community/tutorials/how-to-use-git-hooks-to-automate-development-and-deployment-tasks)
