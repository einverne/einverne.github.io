---
layout: post
title: "git presentation"
tagline: ""
description: "git history, basic, workflow, and basic branch skills"
category: Git
tags: [git, linux, version-control, ]
last_updated:
---

之前做过一个简单的 git 的介绍，下面是 PPT 的摘录。

## What is Git

> Git is a free and open source distributed version control system(VCS) designed to handle everything from small to very large projects with speed and efficiency.

Git 是一个分散式版本控制软件，最初由林纳斯·托瓦兹（Linus Torvalds）创作，于 2005 年以 GPL 发布。最初目的是为更好地管理 Linux 内核开发而设计。Linus Torvalds 自嘲的取名“git”，该词源自英国俚语，意思大约是“混账 [^1]”。

## 版本控制系统 {#version-control}

### Version Control Example
Microsoft Word
如果你用 Microsoft Word 写过长篇大论，那你一定有这样的经历：

想删除一个段落，又怕将来想恢复找不回来怎么办？有办法，先把当前文件“另存为……”一个新的 Word 文件，再接着改，改到一定程度，再“另存为……”一个新文件，这样一直改下去，最后你的 Word 文档变成了这样：

Wikis

https://zh.wikipedia.org/w/index.php?title=Git&amp;action=history

Undo
Windows: Ctrl+z
Mac: Command+z

### History
Version control has a very long histroy.

- Source Code Control System (SCCS)
 - 1972, closed source, free with Unix
- Revision Control System (RCS)
 - 1982, open source
- Concurrent Versions System (CVS)
 - 1986-1990, open source
- Apache Subversion (SVN)
 - 2000, open source

BitKeeper SCM

 - 2000, closed source, proprietary
 - distributed version control
 - "community version" was free
 - used for source code of the Linux kernel from 2002-2005
 - Controversial to use proprietary SCM for an open source project
 - April 2005: the "community version" not free anymore

Git is born

- April 2005
- created by Linus Torvalds
- replacement for BitKeeper to manager Linux kernel source code
- distributed version control
- open source and free software
- compatible with Unix-like systems (Linux, Mac OS X, and Solaris) and Windows
- faster than other SCMs (100x in some cases)

Git become popular, GitHub launched in 2008 to host Git repositories:

- 2009: over 50,000 repositories, over 100,000 users
- 2011: over 2 million repositories, over 1 million users

## 分布式 {#distributed-version-control}

Git 是一种分布式版本控制，不需要服务器端软件也可运行

- 不同用户维护自己的版本库，而不是和核心版本库交换数据
- 追踪 “change sets" 或者 ”patches"
- 无需网络，随时随地进行版本控制
- 分支的新建、合并非常方便、快速，没有任何成本，基本不耗时

## Who use Git?

anyone wanting to track edits

- review a histroy log of changes made
- view differences between versions
- retrieve old versions

anyone needing to share changes with collaborators

anyone not afraid of command-line tools

需要注意以下几点：

1. 只能跟踪文本文件的改动，二进制文件不行，也就是说 如果使用 Git 追踪 Word ，版本控制系统并不知道改动了那些行，只能知道二进制变化了。

	programmer

	- HTML, CSS, JavaScript
	- PHP, Ruby, Ruby on Rails, Perl, Python, ASP
	- Java, C, C++, C#, Objective-C
	- ActionScript, CoffeeScript, Haskell, Scala, Shell scripts

	not as useful for tracking non-text files

	- images, movies, music, fonts
	- word processing files, spreadsheets, PDFs

2. 编码问题，如果在多平台使用请千万使用 UTF-8 编码

	使用 Windows 的童鞋要特别注意：
	千万不要使用 Windows 自带的记事本编辑任何⽂文本⽂文件。原因是 Microsoft 开发记事本的团
	队使⽤用了⼀一 个非常弱智的⾏行为来保存 UTF-8 编码的⽂文件，他们⾃自作聪明地在每个⽂文件开头添
	加了 0xefbbbf（⼗十六进制）的字符，你会遇到很多不可思议的问题，比 如，网页第一⾏行可
	能会显⽰示⼀一个“?”，明明正确的程序⼀一编译就报语法错误，等等，都是由记事本的弱智⾏行
	为带来的。建议你下载 Notepad++ 代替记事本，不但功能强⼤大，而且免费！记得把
	Notepad++ 的默认编码设置为 UTF-8 without BOM 即可

## install

- Linux

`sudo apt-get install git` or `sudo yum install git`

- mac

`brew install git`

- windows

<https://git-scm.com/>

## Git basic

在开始使用 Git 之前有些配置

	git config --global user.name "John Doe"  # 配置提交用户名
	git config --global user.email johndoe@example.com  # 配置提交邮箱


    git init
    git status
    git add filename
    # 暂存区
    git commit -m “"
    git log

commit message best practices

- short single-line summary ( less then 50 characters 或者 小于 25 个汉字）
- optionally followed by a blank line and a more complete description
- keep each line to less than 72 characters
- write commit messages in present tense, not past tense
    - "fix bug" or "fixes bug", not "fixed bug"

## branch

    git branch <branchname>
    git checkout <branchname>
    git checkout -b <branchname>

    git push origin <branchname>

    git push origin --delete <branchname>

http://nvie.com/posts/a-successful-git-branching-model/

## remote

    git remote add origin git@blcu.tk:einverne/gitdemo.git
    git push -u origin master
    git remote show origin

## tag

    git tag     # list all tags
    git tag v0.9
    git tag -a v1.0 -m “my version 1.0"
    git show tag name #show tag details
    git push origin tag name
    git push origin --tags

## git GUI

## other

### gitignore

https://github.com/github/gitignore

### alias

    git config --global alias.st status
    git config --global alias.co checkout
    git config --global alias.ci commit
    git config --global alias.br branch
    git config --global alias.unstage 'reset HEAD --'
    git config --global alias.last 'log -1 HEAD'

## GitLab server

    http://server.address

[^1]: http://git.or.cz/gitwiki/GitFaq#head-90fa13ebe170116f1586156e73b549cc2135b784
