---
layout: post
title: "给常用的 git 命令添加 alias 提升效率"
tagline: ""
description: ""
category: 学习笔记
tags: [git, alias, linux, ]
last_updated:
---


之前有写过 Git alias 的[文章](/post/2013/12/Git-note.html#git-aliases), 不过已经过去了很多时间，现在对 Git 命令越来越熟悉就希望更快的提高输入效率，也越来越感受到 alias 的重要性，不管是直接在 bash 中的 alias 还是 Git 的 alias。所以准备找一些合适的 alias 添加到自己的 gitconfig 文件中长期使用。

## 添加 alias

使用命令的方式添加

	git config --global alias.co checkout
	git config --global alias.ci commit
	git config --global alias.st status
	git config --global alias.br branch
	git config --global alias.hist "log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short"
	git config --global alias.type 'cat-file -t'
	git config --global alias.dump 'cat-file -p'

`git status`, `git add`, `git commit`, `git checkout` 和 `git branch` 是最常见的 git 命令，给他们设置 alias 能提高不少效率。使用以上命令添加 alias ，其实作用等同于直接编辑 HOME 目录下的 gitconfig 文件， `vim ~/.gitconfig`:

	[alias]
	  co = checkout
	  ci = commit
	  st = status
	  br = branch
	  hist = log --pretty=format:\"%h %ad | %s%d [%an]\" --graph --date=short
	  type = cat-file -t
	  dump = cat-file -p

如果这样设置之后就可以使用 `git co <branch>` 来切换分支了。

## bash alias
可以在 `~/.bashrc` 或者 `~/.zshrc` 中设置 `alias g=git` 这样就可以使用 g checkout 来代替 git checkout 了。

## 结合 fzf
结合 [fzf](/post/2019/08/fzf-usage.html) 的使用可以充分发挥 fzf 模糊搜索的能力。

比如我自己定义了 `gcbr` 表示 `git checkout branch`，然后 fzf 会根据 git 的信息将我所有的本地分支和远程分支拉取出来，然后我就可以进行模糊搜索，直接回车就可以切换到该分支。


## reference

- <https://github.com/GitAlias/gitalias/blob/master/gitalias.txt>
- <http://haacked.com/archive/2014/07/28/github-flow-aliases/>
