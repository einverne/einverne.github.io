---
layout: post
title: "GitHub Code Search 使用小技巧"
aliases: 
- "GitHub Code Search 使用小技巧"
tagline: ""
description: ""
category: 学习笔记
tags: [ github, code, code-search, ]
last_updated:
---

前两天收到 GitHub Code Search 的申请通过邮件，现在可以使用 <https://cs.github.com> 来作为之前的搜索的代替了，从第一手直观的感受来看就是更加精准的搜索，能根据文件名，代码方法，编程语言等等来进行搜索。

这里就只简单的记录一下我的使用体验，更加详细的使用指南请参考[官方文档](https://cs.github.com/about/syntax)。

## 概念
在进入下面的使用体验之前先了解一下 GitHub Code Search 中的一些概念。

### 理解 Scope
在 GitHub Code Search 中可以通过 Scope 来定义搜索的范围。

Scope 在字典里面的解释也比较直观：

> the range of things that a subject, an organization, an activity, etc deals with

中文一般翻译成「范围」。

GitHub 有一些约定：

- 必须登录 GitHub 账号才可以搜索全部公开的仓库
- 在 forks 中的代码只有当 stars 数超过父仓库时才会被列入索引，当需要搜索 star 数超过父项目的仓库时，需要使用 `fork:true` 或者 `fork:only` 参数。更多可以参考[如何搜索forks](https://docs.github.com/en/search-github/searching-on-github/searching-in-forks)
- 只有默认的分支会被索引
- 只有小于 384KB 的文件会被索引
- 只有小于 500000 个文件的仓库能被搜索
- 只有在过去一年中有活动的，或者在搜索结果中有记录的仓库才能被搜索
- 除了 filename 的搜索，必须至少有一个关键字才能搜索，比如，搜索 `language:javascript`  不是合法的，只有 `amazong language:javascript` 才是合法的
- 搜索结果中只会显示同一个文件的两个片段，但是有可能在文件中会存在更多的符合结果的内容
- 搜索中不能包含

        . , : ; / \ ` ' " = * ! ? # $ & + ^ | ~ < > ( ) { } [ ] @

### qualifiers
Code Search 中提供了一些修饰语语法，可以用来对搜索结果做限定。

- 限定在某仓库中 (eg. `repo:github/primer`)
- 限定在组织中 (eg. `org:github` 或者 `user:colinwm`)
- 限定语言 `language:python`
- 限定文件路径 `path:README.md`
- Symbol qualifier `symbol:scanbytes`
- 限定内容 `content:hello`

### 正则
Code Search 还支持使用正则表达式来搜索：

    /git.*push/

正则表达式需要使用 `/` 作为范围，上面的搜索词就会搜索所有以 `git` 开头 `push` 结束的内容。

记住如果要在其中使用 `/` 那么需要进行转义，比如搜索目录 `App/src`：

    /^App\/src\//


### 正确匹配
正常情况下搜索 `hello world` 相当于搜索 `hello AND world` 这两个词可能不连在一起，如果要精确地查找搜索词，可以使用双引号：

    "hello world"

### Boolean operations
Code search 支持几种常用的搜索连接词：

- AND
- OR
- NOT

可以使用括号来改变优先级：

    (language:ruby OR language:python) AND NOT path:"/tests/"

可以点击[这里](https://cs.github.com/about)加入到 waitlist

## 使用

### 搜索样例
过去几天我最常用的就是搜索学习别人是如何写 `docker-compose.yml` 文件的，因为最近在学习 [Traefik 入门使用](/post/2021/09/traefik-introduction.html) 所以把历史上用 [Nginx-proxy](/post/2017/02/docker-nginx-host-multiple-websites.html) 反向代理的一些服务重新配置了一下。因为 Traefiki 的配置语法略微复杂，我先阅读了一遍 Traefik 官网的文档，了解了一些基础概念，然后因为官网没有整体配置的一个样例，我就觉得直接看完整的项目配置比较快，所以直接用 Code Search 搜索一些完整的配置进行学习。

比如把 [[Vaultwarden]]，[[NextCloud]] 等，这个时候我就使用搜索语法：

    bitwarden path:docker-compose.yml
    nextcloud path:docker-compose.yml

搜索出来一些结果然后学习，然后配置的过程中还发现了不少很好的项目。

### 搜索配置
之前在配置 ArchiveBox 服务的 `ArchiveBox.conf` 的时候，直接搜索该文件直接可以找到对应的官网仓库的样例配置，依照样例配置进行自己的修改。

### 关键字搜索
我常用的另外一个比较多的场景就是搜索错误代码或者错误描述，常常在 IDE 中当然也能搜索，但是有些大型的库常常我本地没有索引所以搜索起来可能比较慢，这个时候拿到错误直接到界面搜索，反而可以更快的定位到问题。这个时候只需要限定仓库的位置，然后加上错误描述即可。

## reference

- <https://github.blog/2021-12-08-improving-github-code-search/>