---
layout: post
title: "Git 使用过程中遇到的小技巧"
tagline: ""
description: "Git 使用过程中遇到的小技巧，偶尔需要使用，记录一下"
category: Git
tags: [git, linux, 经验总结 , version-control, ]
last_updated:
---

Git 使用过程中遇到的小技巧，平时没有 commit, merge, branch 用的那么勤快，但是需要时也需要查看一下，因此记录一下，以免忘记。

## 将其他分支中多次提交合并到 master 的一次提交

开发中经常使用分支开发，因此不可避免的在开发中向 dev，或者 bugfix 分支进行多次提交，而有些提交可能仅仅为了测试，commit message 也没有认认真真写，所以当开发完成，或者 bug 修复完成想要合并到 master 分支时，不希望保留中间糟糕的提交信息，有一种方法是使用 merge 的 `--squash` 。

而在之前我可能会用 soft reset 掉一些提交，然后重新合并为一次提交，而得知 merge 的 squash 之后，可以轻松将其他分之中的多次提交内容一次性合并到工作区中，然后使用 commit 作为提交。

	git merge --squash <branch name>
	# after
	git commit -s
	# then write your commit message

这里是 `--squash` 的解释：

> Produce the working tree and index state as if a real merge happened (except for the merge information), but do not actually make a commit or move the HEAD, nor record $GIT_DIR/MERGE_HEAD to cause the next git commit command to create a merge commit. This allows you to create a single commit on top of the current branch whose effect is the same as merging another branch (or more in case of an octopus).

其实如果不介意数一下提交次数的话使用 git rebase -i 也是可以实现的，不过这个就是在自己的 feature 分支上先将所有的零碎提交合并成一次，然后再 merge 了。

## 恢复 hard reset 丢失的 commit

有的时候会做了一些提交，但经过 review 或者中途发现变化需要丢弃的时候经常用 `git reset` 来丢掉一些 commit，一般情况下我都会使用 `git reset --soft HEAD~1` 来丢掉上一个提交，给自己重新检查一下上一次提交的内容。而有时可能不注意直接 `git reset --hard <commit-id>` 直接丢弃了好几个提交。等敲完回车才追悔莫及，此时就凸显了 git 的强大之处。其实在 Git 中做过的所有提交记录，都是有保存的，每一次修改 HEAD 的操作都被记录到了本地。

git 有一个命令 `git reflog` 可以查看所有对 HEAD 的变更操作，使用 reflog 命令找到需要恢复的 commit id 然后使用 `git reset --hard <commit-id>` 来恢复到那一次提交就可以了。


## 关联本地分支和远程分支

关联本地分支和远程分支，一般情况下使用 git push 时，直接将本地分支推送到远程同名分支，但是如果新项目不是 clone 远程，或者中途曾经更改了 remote，那么有可能 git 就不知道本地分支对应的远程分支，这时候使用 push 或者 pull 的时候就有可能会出错。

使用

    git branch --set-upstream-to=origin/master master

来将本地 master 分支关联到 origin/master 分支。

或者也可以在 push 时自动关联上

    git push -u origin master


## 删除本地某一次提交

本地做了很多修改，而想要放弃其中某一次提交可以使用 `git rebase -i` ， 对于最后一次提交可以使用 `git reset --hard HEAD~1` 来撤销

对于之前的提交，如果想要删除，可以使用

	git rebase -i HEAD~N

来查看本地前 N 次提交，然后编辑文件删除某一次 commit 即可。更多的信息可以参考 [Git book](http://git-scm.com/book/en/Git-Branching-Rebasing)

需要注意的是，rebase 交互界面出现的 commit 由老到新，使用下面的命令比如 squash 则会向上合并。

PS. 不要用来改变已经 push 到远端的提交，除非明确的知道想要做的事情，可以使用 force push.

## 重命名本地分支
虽然这个操作不是经常需要具体做，但是有的时候不免会遇到，记录一下

    git branch -m <new-name>

## 查看两个星期内的改动

    git whatchanged --since='2 weeks ago'


