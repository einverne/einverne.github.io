---
layout: post
title: "修复突然断电后 git 仓库 corrupt"
aliases:
- "修复突然断电后 git 仓库 corrupt"
tagline: ""
description: ""
category: 经验总结
tags: [ git, linux, git-repair,  ]
create_time: 2022-06-27 15:25:58
last_updated: 2022-06-27 03:58:32
---

今天在 Ubuntu 下编译项目，突然负载飙升到 140 多，然后整个系统就卡住，所有 UI 卡死，无奈之下只能对系统强制重启，不过重启之后发生了一件更严重的问题，当我访问我的项目，执行 `git status` 之后，显示：

```
error: object file .git/objects/2b/ca69094c49050b232756d8d862c39be9d4fe55 is empty
error: object file .git/objects/2b/ca69094c49050b232756d8d862c39be9d4fe55 is empty
fatal: loose object 2bca69094c49050b232756d8d862c39be9d4fe55 (stored in .git/objects/2b/ca69094c49050b232756d8d862c39be9d4fe55) is corrupt
```

git 仓库损坏了！虽然之前因为把 git 放到 Syncthing 中同步也曾经出现过一次 corrupt 的情况，但是之前修复的时候已经把全部代码 push 到了远端仓库，所以直接重新拉一下代码就可以。

但是这一次我本地的分支没有推送到远端所有的修改还在本地，但是这个时候已经无法访问本地的分支代码了!

这个时候立马去网上 Google 解决办法，大部分的回答都让我删除掉 `.git` 目录，然后重新去远端获取。但这个方法一定会丢掉本地的修改，所以没有尝试，等到最后实在没有办法的时候再试试吧。

```
rm -fr .git  
git init  
git remote add origin your-git-remote-url  
git fetch  
git reset --hard origin/master  
git branch --set-upstream-to=origin/master master   
```

然后继续查看解决办法的时候发现了，可以使用：

```
git repair
git repair --force
```

执行完成之后，发现分支回来了。然后赶紧拉一下代码 `git pull`。

之后在切换分支的时候发现本地的分支还在，所以基本完成修复。

另外一个项目也出现了相同的问题，不过本地分支名丢失了，不过还好之前合并过其他分支，在 git log 中找到之前的分支最后一次提交 commit id，重新 checkout 一个新分支即可。

## 深入 .git 目录 refs
Git 中大部分行为都会有一个 hash 来存储，可以使用 `git show 52611da62ae41498fa186ec8b4913b5c7173a896` ，但是这需要用户记住所有的 hash 值，但 hash 值是一个随机的字符串，非常难以记忆，所以 Git 提供了一个 references(引用)，或者简称 `refs`。

引用是存储在 `.git/refs` 目录下的文件，通常这个文件中包含一个 commit object 的 hash。

```
$ ls -F1 .git/refs 
heads/
master
remotes/
tags/
v0.3
```

`heads` 目录中包含了所有本地分支，每一个文件都对应着一个分支名字，文件内容就是该分支最新的 commit hash。

在 Git 中，分支其实就是一个引用，修改 master 分支，其实 Git 只需要做的事情就是改变 `/refs/heads/master` 文件内容。而类似的，创建一个分支，其实就是将 commit hash 写到一个新的文件中。

而同样 `tags` 目录也是一样的，这个目录中包含标签的信息。

## Special Refs
Git 也有一个特殊的引用，`HEAD`，这个一个当前分支的引用，而非对 commit hash 的引用。

```
cat .git/HEAD
ref: refs/heads/dev
```

可以看到的是当前正在 dev 分支。当然也可以将 HEAD 直接指向一个真实的 commit id，这个时候 Git 会提示 `detached HEAD state`，意味着你当前不是在一个分支上。

除了 `HEAD` 这个特殊的 refs，还有一些其他的：

- `FETCH_HEAD`: 从远端最近一次拉取的分支
- `ORIG_HEAD`: A backup reference to HEAD before drastic changes to it
- `MERGE_HEAD`: The commit(s) that you’re merging into the current branch with git merge.
- `CHERRY_PICK_HEAD`: The commit that you’re cherry-picking.

## Reflog
`Reflog` 是 Git 的安全网，他会记录在仓库中所有的操作。可以将其想象成一个本地仓库修改的时序历史记录.

Git reflog 是一个你对本地仓库所作的所有修改的记录。每一次提交，每一次切换分支，都会在 reflog 中留下记录。

在 Git 仓库中执行：

```
git reflog
ceb40ab HEAD@{0}: commit: messsage
```

## reference

- <https://aboullaite.me/deep-dive-into-git-git-refs/>
