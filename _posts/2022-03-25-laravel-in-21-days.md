---
layout: post
title: "Laravel 21 天学习计划"
aliases: 
- "Laravel 21 天学习计划"
tagline: ""
description: ""
category: laravel
tags: [ php, laravel, website, learning-note, notes, phpstorm, docker, sail ]
last_updated: 2022-03-29 09:46:33
create_time: 2022-03-29 09:01:17
---

从上周开始和朋友进行一个以 21 天为一个周期的计划，每个人都制定了一个 21 天的目标，从计划到完成每一个步骤都计分，最后按照打分给每个小伙伴奖励或者惩罚。

所以我从我的计划列表中搜寻了一下大致看了一些 TODO，很多细碎的任务大都花不了一两天时间，所以就思考了一下有没有什么目标适合这个时间段，后来发现最近自建的一些项目好像都是用一个框架写成的，比如有一个可以自建的 PT 站 [[UNIT3D]]，比如非常轻量的论坛 [[Flarum]]，还有 [[Koel]] 一个在线的音乐播放器，还有很多很多。所以想来 21 天可以用来熟悉一下这个框架，也可以用来快速实现一些想法。所以就有了这个开篇。

## 什么是 Laravel
[[laravel]] 是一个 PHP 编写的 Web 框架，如果类比的话，那 Laravel 之于 PHP，就像 Spring 生态之于 Java。

## 目标
我学习 Laravel 的目标有两个：

- 至少可以看懂接触到的开源项目，如果有机会可以改动以满足自己的需求，比如 Flarum 的插件等
- 二来可以用 Laravel 来快速实现一些想法，之前用 Python Web，一直没有好好学前端，所以界面非常糟糕，所以这一次可以借着一起顺便熟悉一下 Laravel 的 Blade 模板引擎，以及 [[TailwindCSS]]，然后制作一个可以在线分享书单，并定时发送邮件的网站
    - 我平时用豆瓣使用比较多，我认为豆瓣中最最要的有两部分，一部分是其词条，另一部分是其用户，词条的存在可以让我不断的发现同导演同演员的其他作品，同作家的其他图书，而用户的存在可以让我以某一个话题发现同主题的内容，所以我非常喜欢豆列这个功能。
    - 然而豆瓣近两年的一系列行为让我非常不满意，删词条，不明理由封禁用户，让我非常不满意
    - 所以想借着学习 Laravel 的过程，实现一个简单的豆列
- 豆列的功能包含：
    - 用户可以用其来组织一个书单
    - 如果其他用户订阅了该书单，那么有电子书的情况下，每隔两周都会自动将书单内容发送到用户自定义的邮箱中

## 计划
学习计划非常简单，我提前看了一下 Laravel 的[官方文档](https://laravel.com/docs/9.x/)，非常详细，几乎包括了这个框架用户要了解的所有内容。所以我按照官网的组织结构，列了一些重点。

[[laravel 21天挑战计划]]

- 首先比较重要的就是搭建一个开发环境。
- 其次就是先上手使用，通过编码了解其工作原理，一次请求是如何在其中流转的
    - [[2022-03-28-laravel-file-upload]]
    - [[2022-03-29-laravel-send-email|Laravel 学习笔记：发送邮件]]
    - [[2022-03-30-laravel-queue]]
- 在了解一定使用基础之后，去了解一些底层实现原理
    - [[Laravel 学习笔记 —— 服务容器]]
    - [[Laravel 服务提供器]]
    - [[Laravel Facades]]
- 最后是如何部署上线

## 学习资源

官方：

- [文档](https://laravel.com/docs/9.x/)
- [Laravel best practices](https://github.com/alexeymezenin/laravel-best-practices)

### 网站教程

- <https://www.itsolutionstuff.com/> 这个网站提供类非常多的样例代码实现，像极了 Cookbook。
- <https://laracasts.com/series/laravel-5-from-scratch> 一个非常丰富的 Laravel 网站，可以先把基础内容看完，如果有进阶的需求可以订阅。
- <https://code.tutsplus.com/courses/get-started-with-laravel-5> 虽然 URL 上还是 Laravel 5，但实际内容以及更新，等阅读完官网的内容，作为补充

### 图书
准备和文档一起交叉阅读：

- [[Laravel: Up & Running: A Framework for Building Modern PHP Apps]]

### 视频
YouTube 上有非常多的视频，但我认为现阶段我只需要注重在官方文档即可。如果实在遇到无法实践的再寻求 YouTube，比如之前不知道怎么调试 PHP，找了半天文字材料都不行之后才去寻求视频，毕竟视频材料还是效率比较低的。
