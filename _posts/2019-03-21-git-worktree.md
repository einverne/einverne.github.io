---
layout: post
title: "使用 Git worktree 将同一个项目分裂成多个本地目录"
aliases: "使用 Git worktree 将同一个项目分裂成多个本地目录"
tagline: ""
description: ""
category: 学习笔记
tags: [git, git-worktree, scm, version-control, ]
last_updated:
---

在偶然逛 StackOverflow 的时候看到一个提问，能不能在同一个 repo 中同时有两份代码，并且可以保持两份相似但不是完全相同的代码并行开发？虽然对其需求有些[好奇和疑惑](https://stackoverflow.com/q/55258459/1820217) ，但也关注了一下下方的回答。

这个时候我知道了 git 原来还有一个命令叫做 `git worktree` 这是 Git 2.15 版本引入的新概念。我们都知道一个正常的 git workflow 可能就是从 master 拉出新分支 feature 进行功能开发，如果遇到有紧急 bug，那么从 master 拉出 hotfix 分支紧急修复在合并。这是一个比较常规的工作流，那么 git worktree 为何要被引用进来。从官方的文档 [^1] 上能看到 git worktree 的作用是将多个 working trees 附加到同一个 repository 中，允许用户一次 check out 多个分支。但是问题是为了解决相同的问题，为何要引入一个更加复杂的 git worktree ？

[^1]: https://git-scm.com/docs/git-worktree


## 疑惑

于是我又去找了一些材料 [^2]，这个回答解决了我部分疑惑，他说到在大型软件开发过程中可能经常需要维护一个古老的分支，比如三年前的分支，当然 git 允许你每个分支维护一个版本，但是切换 branch 的成本太高，尤其是当代码变动很大的时候，有可能改变了项目结构，甚至可能变更了 build system，如果切换 branch，IDE 可能需要花费大量的时间来重新索引和设置。

但是通过 worktree, 可以避免频繁的切换分支，将老的分支 checkout 到单独的文件夹中作为 worktree，每一个分支都可以有一个独立的 IDE 工程。当然像过去一样你也可以在磁盘上 clone 这个 repo 很多次，但这意味着很多硬盘空间的浪费，甚至需要在不同的仓库中拉取相同的变更很多次。

[^2]: https://stackoverflow.com/a/31951225/1820217

回到原来的问题，使用 git worktree 确实能够解决最上面提及的问题。

## 使用

git worktree 的命令只有几行非常容易记住

    git worktree add ../new-dir some-existing-branch
    git worktree add [path] [branch]

这行命令将在 new-dir 目录中将 some-existing-branch 中的内容 check out 出来，就像在该目录中 clone 了一份新代码一样。新的文件地址可以在文件系统中的任何位置，但是注意千万不要将目录放到主仓库中。在此之后新目录中的内容就可以和主仓库中的内容一样，新建分支，push 到远端。

当工作结束后可以直接删除该目录，然后运行 `git worktree prune`.


## 总结

git worktree 非常适合大型项目又需要维护多个分支，想要避免来回切换的情况，这里总结一些优点：

- git worktree 可以快速进行并行开发，同一个项目多个分支同时并行演进
- git worktree 的提交可以在同一个项目中共享
- git worktree 和单独 clone 项目相比，节省了硬盘空间，又因为 git worktree 使用 hard link 实现，要远远快于 clone


