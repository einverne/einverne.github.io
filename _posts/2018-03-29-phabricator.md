---
layout: post
title: "使用 Phabricator 来review"
tagline: ""
description: ""
category: 学习笔记
tags: [code review, git, version control, php, mysql, gerrit]
last_updated: 
---

Phabricator 是最早发源于 Facebook 的代码review工具, 后来创始人离开 Facebook 独立开发这款工具. Phabricator 和同类型的 Google 的 gerrit 有着相似的功能

1. Phabricator 会将所有文件diff直接展开, 而Gerrit只有一个文件列表,需要点每一个文件看具体修改;   
2. admin的权限设置区别
3. Phabricator 可以附加 unit test和以及格式检查和规范的工具(e.g. JSLint), 然后用户在上传diff的时候, Phabricator会自动用新版本代码去跑unit tests,以及运行JSLint, 然后在code review里面就可以看到unit tests有几个failure和error,以及JSLint的报警信息

## Arcanist
Phabricator 提供了个命令行叫 arc （Arcanist），使用 `arc` 命令来连接开发者和 Phabricator 服务器。

## 安装 Arcanist

### Mac OS

    brew install node
    npm install -g arcanist
    arc help
    arc upgrade

### Ubuntu/Debian/Linux Mint

```
sudo apt update && sudo apt-get install php7.0-cli php7.0-curl php-pear

# 任意其它目录也可以
mkdir ~/phabricator
cd ~/phabricator
# 如果下载慢的话，可以先尝试设置一下proxy: export https_proxy="ip:3128"
git clone https://github.com/facebook/libphutil.git
git clone https://github.com/facebook/arcanist.git

# 编辑~/.bashrc，加入如下一行，之后source ~/.bashrc
export PATH="$PATH:$HOME/phabricator/arcanist/bin/"
# 如果没有项目配置，可以运行下面的命令设置全局的参数：
arc set-config default https://<phabricator server address>
arc install-certificate
# 按照屏幕提示，访问http://<phabricator server address>/conduit/token/ ,把token copy/paste下来
# 在~/.bashrc里添加下面两行
export EDITOR=vim
alias arc='LC_ALL=C arc'
# 并在命令行执行
source ~/.bashrc
```

### Windows

自行处理: https://www.jianshu.com/p/a6ee738da1aa

## 配置
一般情况下在 HOME 目录下会产生一个 `.arcrc` 配置文件，格式类似下方：

    {
      "config": {
        "default": "https://<phabricator server address>",
        "editor": "vim"
      },
      "hosts": {
        "https://<phabricator server>/api/": {
          "token": "cli-rdm2xxxxxxxxxxxx"
        }
      }
    }

可以使用如下命令来更改该配置

    arc set-config phabricator.uri "<phabricator server>"
    arc set-config editor "vim"

### 本地开发流程

```
# 本地开发，新建feature
arc feature feature_1
# 或 git checkout -b feature_1
# 修改本地文件,然后提交
git add
git commit
 
# 提交code review
arc diff
# 通过--reviewers name参数可以指定reviewer
 
# 这里可以和一个Task（比如T123）关联起来，在Summary那个域里填上Ref T123，或者Fixes T123
# 两者的区别是Fixes在代码提交后会自动关闭Task，Ref不会
# 也可以提交code review之后，在浏览器里操作
 
# 本地修改后再次提交code review（这个revision是上次创建code review时的id，比如D1252）
arc diff --update 1252
# --update 1252 也可以不加，默认会合到上一个review中
 
# reviewer已经Accept之后，提交代码（不要用git push！）：
arc land feature_1
# 如果报错找不到对应的revision，带上revision号（比如1252）运行：
arc land --revision 1252
# land之后，feature branch会被自动删除
# land 使用后会将当前分支 merge 或者squash merge 到master分支，提供详细的提交信息，推送到master并且删除本地分支
```


## QA
问题： No changes found. (Did you specify the wrong commit range?)

答： Arcanist(arc) 是一个 `pre-commit` 或者说 `pre-push` 代码审查工具，一旦本地分支被push到origin，这就打破了 Arcanist 工具的意义，但是可以用以下方法来补救：

- 删除当前分支的远端分支 `git push origin --delete branch_name`
- 在使用 `arc diff` 时告诉分支需要和哪一个分支对比 `arc diff origin/master`
- 或者显示指定 land 的目的地 `arc land --onto master`

