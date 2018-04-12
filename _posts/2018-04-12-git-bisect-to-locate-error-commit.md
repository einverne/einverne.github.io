---
layout: post
title: "使用 git bisect 来快速定位出错版本"
tagline: ""
description: ""
category: Git
tags: [linux, git, version-control, ]
last_updated: 
---

在整理之前那篇 [Git 分支管理][^branching] 的时候接触了 `git bisect` ，用了那么长时间的 git 竟然又出现了一个不曾用过的命令，于是就看了下文档学习下使用。

`git bisect` 使用二分查找来快速定位出错的 commit，举个例子来说，假设线上正常运行的一个版本，之后进行了大量的开发，提交了成百上千次提交，而导致了线上其中一个小功能的失效。为了定位问题，你可能需要查看过去的提交。

- 如果你知道这个功能具体在那个文件，那其实很好办，git blame 找出修改的部分，修正即可
- 而如果提交实在太多，无法定位问题文件的话，那么就需要使用 git bisect

## git bisect 使用
在使用之前你需要知道两个前提，一个是已知的正常运行的版本，一个是出问题的版本，`git bisect` 会在两个版本之间使用二分查找，然后根据定位的commit id创建新的分支，然后在此分支上可以进行检查，是否有问题。

假设这个中间版本依然可以运行，那么通过 `git bisect good` 命令告诉 git，然后进行剩下一半的查找，以此类推，最终会快速的定位到问题所在 commit。因为每次都把提交历史切为两半，所以非常快，时间复杂度 log(n)

运行 git bisect 的整个过程

    git bisect start         # 告诉git开始二分查找
    git bisect good [good-commit-id] # 告诉 git 该版本无问题
    git bisect bad [bad-commit-id]   # 告诉 git 出问题版本 git bisect bad HEAD
    # 此时 git 就会检出中间版本，然后就可以去测试该版本
    git bisect good/bad      # 此时就会遇到两种可能，有问题或者无问题，使用 good/bad 来告诉git
    # 当找到第一个问题版本后，git 会告诉你 bisect 结束
    git bisect reset         # 返回到 git bisect 初始的版本
    git bisect log           # 显示最后一次完全成功的 git bisect 日志

## git branching
看完整个过程就知道了为什么在 [Git 分支管理][^branching] 那篇文章中要提到这个 bisect 了，因为如果在 master 上的提交每次都 rebase ，而不是使用 merge ，就会让 master 分支非常干净，而 bisect 去查找的时候就不会那么的费力，而如果 master 分支非常多的分叉，查找过程就会非常费力了。

[^branching]: [Git 分支管理](/post/2018/04/git-branching.html)
