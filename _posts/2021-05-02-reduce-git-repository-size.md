---
layout: post
title: "减小 git 仓库的大小"
aliases: 
- 减小 git 仓库的大小
tagline: ""
description: ""
category: 经验总结
tags: [git, linux, ]
last_updated:
---

我一直使用 Git 仓库来管理我的 Markdown 笔记，但是因为定时提交，没多久就产生了非常多的提交历史，并且因为频繁的提交和导入了一些比较大的 PDF 文件和图片文件，所以导致 `.git` 目录的体积已经超过了所有笔记的大小，笔记内容也就 300+M，但是整个仓库有近 1G 大小。

所以便想着能不能给 Git 仓库进行一下瘦身，最开始想要实现的方向是能不能压缩一下提交历史，然后把历史记录中的大文件剔除。所以查询方案的时候就先往这两个方向上靠。

## git gc

最先想到的就是在仓库执行 `git gc`， (garbage collection)，这条命令会对 Git 仓库中不需要的文件进行删除，然后将其他文件压缩：

    git gc --aggressive

然后再执行：

    git prune

`git-prune` 命令会删除在 object database 中不可达的 objects。不过通常在执行 `git gc` 的时候会自动调用该命令。

我的仓库中执行这两条命令后效果并不是很明显。

## 删除 Git 提交的大文件

可以使用 `git count-objects -v` 来查看 git 仓库占用的空间大小。

```
count: 391
size: 13968
in-pack: 41519
packs: 2
size-pack: 493311
prune-packable: 0
garbage: 10
size-garbage: 0
```

在输出的结果中 `size-pack` 就是包文件的大小，单位是 KB，可以看到我本地的包文件在 493MB 左右。

使用如下的命令查看仓库中的大文件：

    git rev-list --objects --all | grep -E `git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -10 | awk '{print$1}' | sed ':a;N;$!ba;s/\n/|/g'`

或者：

    git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -15 | awk '{print$1}')"

解释：在 `git gc` 命令执行之后，所有的对象会被放到一个打包的文件中，存放在 `.git/objects/pack/*.idx`，可以通过 `git verify-pack` 命令，对输出的第三列（文件大小）进行排序，从而找出这个大文件。

然后使用 `git rev-list` 命令使用 `--objects` 参数来找出相关的 SHA-1，对象的 SHA-1 和相关联的文件路径。

然后可以使用 `git filter-branch` 来改写历史，移除大文件

```
# 下面的命令请谨慎执行，在多人合作的仓库中小心执行
git filter-branch --tree-filter 'rm -f path/to/large/files' --tag-name-filter cat -- --all
git push origin --tags --force
git push origin --all --force
```

说明：`--tree-filter`

这里的路径别搞错。

## bfg

在搜寻的过程中发现了 `git filter-branch` 的代替工具 `bfg` 可以比 filter-branch 命令更快。

## reference

- [Git 内部原理](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-%E7%BB%B4%E6%8A%A4%E4%B8%8E%E6%95%B0%E6%8D%AE%E6%81%A2%E5%A4%8D)

In my case, I pushed several big (> 100Mb) files and then proceeded to remove them. But they were still in the history of my repo, so I had to remove them from it as well.

What did the trick was:

```
bfg -b 100M  # To remove all blobs from history, whose size is superior to 100Mb
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

Then, you need to push force on your branch:

```bash
git push origin <your_branch_name> --force
```

## bfg

[bfg](https://github.com/rtyley/bfg-repo-cleaner) 可以使用 brew 来安装：

```
brew install bfg
```

```
# 清除垃圾文件(大量无用的mp3文件)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch *.mp3' --prune-empty --tag-name-filter cat -- --all
```

```
# 提交到远程仓库(如GitHub, 我再次从git clone GitHub代码库会变小为1.3M)
git push origin --force --all
```

```csharp
# 必须回收垃圾,本地仓库才变小
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

rm -rf .git/refs/original
git reflog expire --expire=now --all
git gc --prune=now
git gc --aggressive --prune=now
```

## reference

- [https://github.com/newren/git-filter-repo](https://github.com/newren/git-filter-repo)  
- [https://rtyley.github.io/bfg-repo-cleaner/](https://rtyley.github.io/bfg-repo-cleaner/)  
- [https://git-scm.com/docs/git-filter-branch](https://git-scm.com/docs/git-filter-branch)
