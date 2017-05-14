---
layout: post
title: "Git 使用过程中遇到的小技巧"
tagline: ""
description: "Git 使用过程中遇到的小技巧，偶尔需要使用，记录一下"
category: Git
tags: [Git, 经验总结,]
last_updated: 
---

Git 使用过程中遇到的小技巧，平时没有 commit, merge, branch 用的那么勤快，但是需要时也需要查看一下，因此记录一下，以免忘记。

## 将其他分之中多次提交合并到master的一次提交

开发中经常使用分支开发，因此不可避免的在开发中向 dev，或者 bugfix 分支进行多次提交，而有些提交可能仅仅为了测试，commit message 也没有认认真真写，所以当开发完成，或者bug修复完成想要合并到 master 分支时，不希望保留中间糟糕的提交信息，有一种方法是使用 merge 的 `--squash` 。

而在之前我可能会用 soft reset 掉一些提交，然后重新合并为一次提交，而得知 merge 的 squash 之后，可以轻松将其他分之中的多次提交内容一次性合并到工作区中，然后使用 commit 作为提交。

	git merge --squash <branch name>
	# after
	git commit -s
	# then write your commit message

这里是 `--squash` 的解释：

> Produce the working tree and index state as if a real merge happened (except for the merge information), but do not actually make a commit or move the HEAD, nor record $GIT_DIR/MERGE_HEAD to cause the next git commit command to create a merge commit. This allows you to create a single commit on top of the current branch whose effect is the same as merging another branch (or more in case of an octopus).


## 恢复hard reset 丢失的commit

有的时候会做了一些提交，但经过review或者中途发现变化需要丢弃的时候经常用 `git reset` 来丢掉一些 commit，一般情况下我都会使用 `git reset --soft HEAD~1` 来丢掉上一个提交，给自己重新检查一下上一次提交的内容。而有时可能不注意直接 `git reset --hard <commit-id>` 直接丢弃了好几个提交。等敲完回车才追悔莫及，此时就凸显了 git 的强大之处。其实在 Git 中做过的所有提交记录，都是有保存的，每一次修改 HEAD 的操作都被记录到了本地。

git 有一个命令 `git reflog` 可以查看所有对 HEAD 的变更操作，使用 reflog 命令找到需要恢复的 commit id 然后使用 `git reset --hard <commit-id>` 来恢复到那一次提交就可以了。


