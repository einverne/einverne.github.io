---
layout: post
title: "关于 .git 目录你需要知道的一切"
tagline: ""
description: ""
category: 学习笔记
tags: [git, linux, programming, coding, ]
last_updated:
---

之前也总结过不少的关于 git 使用的文章，但都很少提及 `.git` 目录，都知道在 `git init` 之后，git 会在目录下创建一个 `.git` 目录，该目录中保存着 git 的一切。昨天在 Twitter 上正好有人分享了三篇文章，今天就顺便学习一下。

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">通过.git 目录学习 git<br><br>- <a href="https://t.co/pBe2jE7QXM">https://t.co/pBe2jE7QXM</a><br>- <a href="https://t.co/w8kV4oAocV">https://t.co/w8kV4oAocV</a><br>- <a href="https://t.co/GqnF5FnkY2">https://t.co/GqnF5FnkY2</a></p>&mdash; Hao Chen (@haoel) <a href="https://twitter.com/haoel/status/1224992553562300417?ref_src=twsrc%5Etfw">February 5, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## 初识 git 目录 {#git-directory}
展开 git 目录，大致是这样的：

    ├── HEAD
    ├── branches
    ├── config
    ├── description
    ├── hooks
    │ ├── pre-commit.sample
    │ ├── pre-push.sample
    │ └── ...
    ├── info
    │ └── exclude
    ├── objects
    │ ├── info
    │ └── pack
    └── refs
     ├── heads
     └── tags

其中的每一个文件和目录都是有意义的，下面就一个一个看看。首先是 HEAD 文件，这个不陌生吧，git 中一个非常重要的概念，后面展开。

### conf
conf 文件中包含着 repository 的配置，包括 remote 的地址，提交时的 email, username, 等等，所有通过 `git config ..` 来设置的内容都在这里保存着。如果熟悉甚至可以直接修改该文件。

### description
被 gitweb(github 之前） 用来描述 repository 内容。

### hooks
hooks，国内通常被翻译成钩子，git 中一个比较有趣的功能。可以编写一些脚本让 git 在各个阶段自动执行。这些脚本被称为 hooks, 脚本可以在 commit/rebase/pull 等等环节前后被执行。脚本的名字暗示了脚本被执行的时刻。一个比较常见的使用场景就是在 `pre-push` 阶段检查本地提交是否遵循了 remote 仓库的代码风格。

### info exclude
该文件中定义的文件不会被 git 追踪，和 `.gitignore` 作用相同。大部分情况下 `.gitignore` 就足够了，但知道 `info/exclude` 文件的存在也是可以的。

## commit 中有什么？
每一次创建一些文件，提交，git 都会压缩并将其保存到自己的数据结构中。压缩的内容会拥有一个唯一的名字，一个 hash 值，该 hash 值会保存到 object 目录中。

在浏览 object 目录之前我们要问自己一个问题，什么是一次提交 (commit)？一次提交是当前工作目录的一个快照，但又不止于此。

事实上，当使用 git 提交时，git 为了创建工作区的快照，只做了两件事：

1. 如果文件没有改变，git 将压缩的文件名 (the hash) 保存到快照
2. 如果文件改变了， git 会压缩该文件，然后将压缩的文件保存到 object 目录，最后将 hash 保存到快照

一旦快照被创建，压缩的内容和名字都会到 object 目录中：

	├── 4c
	│ └── f44f1e3fe4fb7f8aa42138c324f63f5ac85828 // hash
	├── 86
	│ └── 550c31847e518e1927f95991c949fc14efc711 // hash
	├── e6
	│ └── 9de29bb2d1d6434b8b29ae775ad8c2e48c5391 // hash
	├── info // let's ignore that
	└── pack // let's ignore that too

上面的内容是新建了一个空文件 `file__1.txt` 并提交后 object 目录的结构。需要注意的是，如果 hash 是 `4cf44f1e...`，那么 git 会将内容保存到 `4c` 子目录中，然后将文件命名为 `f44f1...`。这样就使得 object 目录缩小了，最多只会有 00-ff 这些目录。

commit 由四部份组成：

- 工作区快照名 hash
- comment
- 提交者信息
- hash 的父 commit

如果解压一个 commit 文件，可以查看到这些内容。

	// by looking at the history you can easily find your commit hash
	// you also don't have to paste the whole hash, only enough
	// characters to make the hash unique

	git cat-file -p 4cf44f1e3fe4fb7f8aa42138c324f63f5ac85828

可以看到：

	tree 86550c31847e518e1927f95991c949fc14efc711
	author Pierre De Wulf <test[@gmail.com](mailto:pie@gmail.com)> 1455775173 -0500
	committer Pierre De Wulf <[test@gmail.com](mailto:pie@gmail.com)> 1455775173 -0500

	commit A

两个重要的内容：

1. 快照 hash  `86550` 同样是一个 object, 可以在 object 目录中找到
2. 因为是第一个提交，所以没有 parent

查看具体的快照内容：

	git cat-file -p 86550c31847e518e1927f95991c949fc14efc711

	100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 file_1.txt

这里就找到了上面提到的三个 object 中的另外一个，这个 object 是 blob, 后文在展开。

## branch, tags, HEAD 他们都一样
到目前为止你已经知道了 git 中的一切都可以通过正确的 hash 来获取。现在然我们来看看 HEAD.

	cat HEAD
	ref: refs/heads/master

然而，HEAD 不是一个 hash, 那也 OK，之前的文章在介绍 HEAD 时都将 HEAD 比喻成一个指针，指向当前工作的分支。让我们来看看 `refs/heads/master`

	cat refs/heads/master
	4cf44f1e3fe4fb7f8aa42138c324f63f5ac85828

熟悉吧，这就是第一次提交的 hash. 这就显示了 branchs, tags, 都是指向 commit 的指针。这也就意味着你可以删除所有的分支，所有的 tags，但所有的提交依然还在。如果还想了解更多，可以查看 [git book](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)

## reference

- <https://www.daolf.com/posts/git-series-part-1/>


