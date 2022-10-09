---
layout: post
title: "Laravel 学习笔记：Blade Component"
aliases: 
- "Laravel 学习笔记：Blade Component"
tagline: ""
description: ""
category: 学习笔记
tags: [ laravel, blade, php ]
last_updated:
---

Blade 模板中的 Components 提供了和 `section`, `layout` 和 `includes` 相似的机制。都可以用来复用构造的 Blade 模板。

但 Component 更容易理解，提供了两种方式：

- class based components
- anonymous components

使用命令创建：

    php artisan make:component Alert

创建的文件在 `App\View\Components` 目录。

`make:component` 命令会创建一个 `template` 在 `resources/views/components` 目录中。

也能在子目录中创建 Components：

    php artisan make:component Forms/Input

如果传参 `--view`:

    php artisan make:component forms.input --view

就不会创建 class，只会创建模板。

