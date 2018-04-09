---
layout: post
title: "git 分支管理"
tagline: ""
description: ""
category: [Git, 学习笔记]
tags: [linux, git, github, branching, svn, version-control]
last_updated: 
---

提高分支管理，就不得不提[Vincent Driessen](http://nvie.com/posts/a-successful-git-branching-model/)很早之前提出的策略，他提出来几点

- 唯一主分支
- 开发分支，日常开发，发布 nightly
- 临时分支，功能分支从 develop 分支拉，预览版分支从最新 develop 拉，bug修补分支从 master 拉及时修复合并到master和develop


下面沿着经典的 master 和 dev 分支模型，讲两点保证 history 干净的方法。

## 小型feature使用 squash merge

小型 feature，or bug，能够在几小时内解决的 branch，可以使用 `squash merge`

    # under master
    git merge --squash private_feature_branch

## 大型 feature 使用 rebase 整理 history
对于大型分支，大型功能，可能需要花费长时间 working，需要提交数百次commit的分支，那么使用 `squash` 可能会导致一次提交有成千上万行代码，非常不利于 code review。那么这个时候就需要使用 `rebase` 的交互模式。可以参考之前的[文章](/post/2017/11/merge-commits-using-rebase-git.html) 来学习一下rebase基本的使用。

rebase 的交互模式非常强大，可以用来修改过去的提交，分割提交，合并提交，甚至重新排序提交。

    # on feature branch
    git rebase --interactive master
    git rebase -i master

当使用交互式rebase时，会显示一个编辑器，其中包含了一系列的命令和提交，比如下面三次提交，默认都为 pick，表示不修改该 commit，

    pick 9c422c5 Fix bug
    pick 8821164 Change html
    pick 89e9f73 Update

将第二次提交修改为 `s`, `squash`，并保存

    pick 9c422c5 Fix bug
    s 8821164 Change html
    pick 89e9f73 Update

那么第二次提交就会合并到第一次提交，最下面的提交为最新的提交，从上到下为旧->新，当保存退出时会弹出新的编辑器，可以在该编辑器中，书写新的提交信息，然后保存。

不过需要注意的是，**永远不要改写 public 或者 master 已经发布的分支**。

## 经典分支模型的问题

这几点都是老生常谈的要点了，经典的分支模型理论上除了 master 和 develop 分支外，其他分支都不应该存在于远程仓库中。当然理论和实际总是有出入的。Vincent Driessen 的分支模型固然合理，但是并不能满足所有的开发需求。

- 当大型 feature 的合并，可能导致 master 分支 build 失败，这个过程也就违背了如今的软件开发[持续集成](https://www.martinfowler.com/articles/continuousIntegration.html)的思路，经常将修改集成到现有的系统中，可以尽早的发现错误
- 如果使用 `--no-ff` 来合并分支，会出现额外的 `Merge branch xxx of git@github.com` 这样的无意义的 commit 出现，导致 master 线非常杂乱

## 解决经典分支模型的问题

### 考虑所有开发都在 master 进行

如果考虑所有的开发都在 master 上进行，本地开发者需要经常 `git rebase` 将 `origin/master` 上最新内容拉到本地，开发者推荐在本地维护小型的分支，一旦有可使用的代码立即提交到 master 中持续集成，从提交到合并中间可以加上 review 和 test 。

### 避免使用共享的远程分支
当所有的开发都在 `origin/master` 上进行时，开发者需要将所有的修改在最新的远程master上惊醒，以保证每次的开发都能够正常被合并而不会产生冲突。保证了这一点就可以避免在大量feature分支合并时产生的 [integration hell](http://c2.com/xp/IntegrationHell.html)。

如果使用 Gerrit，或者 Phabricator 等等 code review 工具那么这些集成就更方便了

### 从 origin/master 发布 release
每一个发布都有自己的 tag，并且有独立于 `origin/master` 的分支，加入有 hotfix，那就直接添加到 release 分支，并且 cherry-pick 到 master 分支。如果使用固定的 tag 和 分支命名方法，可以使用CI自动针对 tag 发布，整个过程对开发流程透明，开发者甚至可以不关心发布，而只关心 tag，让后面的流程自动在 CI 中执行。

### 只使用 fast-forward merges
避免大量的无意义的 merge commits 将仓库搞的[乱七八糟](http://stackoverflow.com/questions/14023648/why-does-my-git-history-look-like-a-christmas-tree)，只使用 `git rebase` 或者 `git cherry-pick` ，rebase 可以让历史提交线非常清晰，这样 `git bisect` 也能快速的定位到问题。

如果使用了 Gerrit，那就意味着提交了一组 commit 到 `origin/master`，你可以使用 cherry-pick 来任意调整 commit 的顺序。


## reference

- <https://sandofsky.com/blog/git-workflow.html>
- <https://barro.github.io/2016/02/a-succesful-git-branching-model-considered-harmful/>
- <https://hackernoon.com/a-branching-and-releasing-strategy-that-fits-github-flow-be1b6c48eca2>
