---
layout: post
title: "Gitlab 中使用命令行提交 merge request"
tagline: ""
description: ""
category: 学习笔记
tags: [gitlab, gitlab-cli, git, commands, merge-request]
last_updated:
---

gitlab-cli 是一个用 Javascript 所写的工具，可以用来在命令行中提交 gitlab 的 merge request 等等，作者说收到 [hub](https://github.com/github/hub) 工具的启发。

## Installation

    npm install git-lab-cli -g

## Usage
查看帮助

    lab -h

通过环境变量全局配置

    GITLAB_URL=https://gitlab.yourcompany.com
    GITLAB_TOKEN=abcdefghijskl-1230

TOKEN 可以在 `https://gitlab.yourcompany.com/profile/account` 这个地方找到。

一些常用的选项：

    -a, --assignee    "username"
    -m "merge request message"
    -r        标记合并之后删除远端分支

## 提交 Merge Request
首先将自己的分支 push 到 origin

    git push -u origin feature_branch

    lab -a "username" -m "Feature" -r

运行结束后会返回 Merge Request 的地址。

- <https://github.com/vishwanatharondekar/gitlab-cli>

## 相关

- <https://github.com/profclems/glab>