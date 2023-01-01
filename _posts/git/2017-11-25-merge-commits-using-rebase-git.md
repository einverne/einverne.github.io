---
layout: post
title: "使用 rebase 来合并多个 commits"
aliases: "使用 rebase 来合并多个 commits"
tagline: ""
description: ""
category: Git
tags: [git, linux, verson-control, rebase, git-rebase,  ]
last_updated:
---

Git 作为分布式版本控制系统，所有修改操作都是基于本地的，在团队协作过程中，假设你和你的同伴在本地中分别有各自的新提交，而你的同伴先于你 push 了代码到远程分支上，所以你必须先执行 git pull 来获取同伴的提交，然后才能 push 自己的提交到远程分支。而按照 Git 的默认策略，如果远程分支和本地分支之间的提交线图有分叉的话（即不是 fast-forwarded），Git 会执行一次 merge 操作，因此产生一次没意义的提交记录。

在 pull 操作的时候，使用 `git pull --rebase` 选项即可很好地解决上述问题，使用 `-r` 或者 `--rebase` 的好处是，Git 会使用 rebase 来代替 merge 的策略。

使用 `man git-merge` 中的示例图说明：

                 A---B---C  remotes/origin/master
                /
           D---E---F---G  master

如果执行 git pull 之后，提交线是：

                 A---B---C remotes/origin/master
                /         \
           D---E---F---G---H master

结果是多出了 H 这个 无意义的提交。如果执行 `git pull -r` 的话，提交就是：

                       remotes/origin/master
                           |
           D---E---A---B---C---F'---G'  master

本地的两次提交就使用 rebase 重新添加到了远端的提交之后，多余的 merge 无意义提交消失。

在了解 `git pull -r` 的前提下，来看一下如何使用 rebase 命令来将本地的多个提交合并为一次提交。

假设本地 Git 仓库中因为临时提交产生了一些 commits


    commit 8b465db3672a24710207d91af74d61cee975b208
    Author: Ein Verne
    Date:   Thu Nov 30 20:25:52 2017 +0800

        Third commit

    commit 821476d2b043e85d131483279e23778aa3fd1241
    Author: Ein Verne
    Date:   Thu Nov 30 14:07:08 2017 +0800

        Second commit


    commit 51912266c1634dd2f0848071cc311975b6aad730
    Author: Ein Verne
    Date:   Thu Nov 23 20:39:42 2017 +0800

        Init commit

假设我们需要将第二次提交 `821476d2b043e85d131483279e23778aa3fd1241` 和 第三次提交 `8b465db3672a24710207d91af74d61cee975b208` 合并为一次提交，可以先使用

    git rebase -i 5191226

最后一次不需要修改的 commit id，然后进入 vi 的提交信息的编辑模式。

    pick 821476d Second commit
    pick 8b465db Third commit

    # Rebase 5191226..8b465db onto 5191226 (2 command(s))
    #
    # Commands:
    # p, pick = use commit
    # r, reword = use commit, but edit the commit message
    # e, edit = use commit, but stop for amending
    # s, squash = use commit, but meld into previous commit
    # f, fixup = like "squash", but discard this commit's log message
    # x, exec = run command (the rest of the line) using shell
    # d, drop = remove commit
    #
    # These lines can be re-ordered; they are executed from top to bottom.
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    #
    # However, if you remove everything, the rebase will be aborted.
    #
    # Note that empty commits are commented out

这里可以看到，上方未注释部分填写要执行的命令，下方注释部分为支持的指令说明。指令部分由命令，commit hash 和 commit message 组成。

这里

- pick 为选择该 commit
- squash，将这个 commit 合并到前一个 commit
- edit 选中提交，rebase 暂停，修改该 commit 提交内容
- reword 选中提交，并修改提交信息
- fixup 与 squash 相同，但不会保存当前 commit 的提交信息
- exec 执行其他 shell 命令
- drop 抛弃提交

这里只要将第三次提交前的 `pick` 修改为 `squash`，就可以将该 commit 合并到第二次提交。修改之后保存 `:wq` 退出。


    pick 821476d Second commit
    squash 8b465db Third commit

然后会进入 commit message 界面，在该界面中修改合适的提交信息，将两次的 commit 合并为一次，保存退出即可完成合并。

注意：`git rebase` 是一个比较危险的命令，如果一旦中途出现错误，可以使用 `git rebase --abort` 来终止 rebase，回到没有合并之前的状态。

## TIPS

### 合并本地多次提交
如果想要合并最近的多次提交，在 rebase 进入交互模式时，可以指定范围比如

    git rebase -i HEAD~8

选取最近的 8 次提交。

### 更换本地提交的顺序
在进入 `rebase -i` 交互模式时，更换提交信息的顺序，保存即可修改本地提交的 commit 顺序。比如

    pick 821476d Second commit
    pick 8b465db Third commit

修改为

    pick 8b465db Third commit
    pick 821476d Second commit

可以更换次序。

### 注意
`git rebase` 操作应该只用于本地尚未提交到远程仓库的 commit，一旦 push 到远端仓库，则不再允许修改 commit，否则可能会给其他开发者带来很多麻烦。尤其是多人协作时，千万要注意。

## reference

- <http://hungyuhei.github.io/2012/08/07/better-git-commit-graph-using-pull---rebase-and-merge---no-ff.html>
