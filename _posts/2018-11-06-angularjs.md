---
layout: post
title: "AngularJS 学习笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [angular, google, javascript, mvc, angularjs, ]
last_updated:
---

如果要说 AngularJS 是什么，那么用这些关键词就能够定义，单页面，适合编写大量 CRUD 操作，MVC

AngularJS 有如下特性：

- 模板语言
- 自动刷新
- 依赖注入
- 模块测试

## AngularJS 安装
安装 AngularJS 之前需要确保 Node.js 和 npm 安装。AngularJS 需要 node.js 的 8.x 或者 10.x 版本。

### nodejs npm 安装
以前不熟悉 nodejs 的时候为了简单的使用 npm 所以找了 apt 方式安装的方法，这里如果要学习推荐通过 nvm 来安装，可以类似于 [pyenv](/post/2017/04/pyenv.html) 一样来安装多个版本的 nodejs，并且可以非常方便的管理不同的环境。安装过程比较简单，直接去官方 repo 即可。

- <https://github.com/creationix/nvm>

简单使用

    nvm install node            # "node" 是最新版本的别名，所以这行命令是安装最新的 node
    nvm install v10.13.0

如果要查看可用版本可以使用

    nvm ls-remote

启用并使用最新版本

    nvm use v10.13.0

这时在查看 npm 的位置 `whereis npm` 就会发现在 `~/.nvm/versions` 目录下了。

### 安装 Angular CLI
Angular CLI 用来创建项目，创建应用和库代码，并可以执行多种开发任务，测试，打包，发布等等

    npm install -g @angular/cli

### 创建工作空间和初始化应用
在创建开发环境时还会选择一些特外的特性

    ng new angularjs-demo

### 启动开发服务器
Angular 自带一个开发服务器，可以在本地轻松构建和调试，进入工作空间 (angularjs-demo)

    cd angularjs-demo
    ng serve --open

更加详细的可以参考官网 [quickstart](https://angular.cn/guide/quickstart)

## 使用 {#usage}
在学完官网的 Hero demo 之后对 AngularJS 有了一个基本印象，对于基本的 MVC，在 AngularJS 中通过学习 Java 中，定义好 Service 通过依赖注入到模板和 Component 中。

![angularjs overview](/assets/angularjs-overview.png)

组件和模板定义 Angular 的视图，然后在视图中注入 Service 提供服务。

### 模块 {#module}
模块称为 NgModule，存放一些内聚的代码和模板，每个 Angular 都至少有一个 NgModule 类，根模板，习惯上命名为 AppModule，位于 `app.module.ts`。

在 1.x 时代，可以使用如下代码定义模块

    angular.module('myApp', []);

### 组件 {#components}
组件控制屏幕上一小片区域，在类中定义组件的逻辑，为视图提供支持。@Component 装饰器会指出紧随其后的那个类是个组件类，并为其指定元数据。

每一个 Component 由以下部分组成：

- Template
- Class
- Metadata

AngularJS 有一套自己的模板语法，这个需要熟悉一下。

AngularJS 支持双向数据绑定，大致语法如下：

从 Component 到 DOM

- `{{value}}`
- `[property]="value"`

从 DOM 到 Component

- `(event) = "handler"`
- `[(ng-model)] = "property"`

### 服务 {#services}
Angular 将组件和服务区分，提高模块性和复用性，服务应该提供某一类具体的功能。Angular 通过依赖注入来将逻辑和组件分离。服务可以被多个 Component 共用。

### Controller
在 Angular 1.x 时代，Controller 也是很重要的一个部分，一个 Controller 应该是最简单，并且只对一个 view 负责的角色。如果要在 Controller 之间共享信息那么可以使用上面提及的 Service。

### Directive
Directive 一般被叫做指令，Angular 中有三种类型的指令：

- 组件，是一种特殊的包含模板的指令
- 结构指令 (structural directives)，通过添加和移除 DOM 元素的指令，包括 ngFor, ngIf
- 属性指令，改变元素显示和行为的指令，ngStyle

Angular2 中，属性指令至少需要一个带有 `@Directive` 装饰器修饰的控制器类，官网有一个很好的 `highlight.directive.ts` [例子](https://v2.angular.io/docs/ts/latest/guide/attribute-directives.html)。

## 数据绑定
数据模型对象 `$scope` 是一个简单的 Javascript 对象，其属性可以被视图，或者 Controller 访问。双向数据绑定意味着如果视图中数值发生变化，数据 Model 会根据脏检查意识到该变化，而数据 Model 发生变化，视图也会依据变化重新渲染。

简单的数据绑定

    <input ng-model="person.name" type="text" placeholder="Yourname">
    <h1>Hello\{\{ person.name \}\}</h1>



## 独特的语法
Angular 有一套自己的 HTML 标记语法，比如在 `app.component.ts` 中定义

    title = '这是一个 AngularJS-demo 演示';

那就可以通过类似于模板的语法来访问该变量：

    Welcome to {{ title }}!

又比如条件语句 `ngIf`，后面的 isLogin 是在 class 中定义好的 boolean 变量：

    <div *ngIf="isLogin">Hi {{username}}</div>

或者循环 `ngFor`，for 后面接一个表达式

    *ngFor = "let variable of variablelist"

比如：

    <a *ngFor="let nav of navs">{{nav}}</a>


本文 demo 源码： <https://gitlab.com/einverne/angularjs-demo>


## reference

- <https://yoember.com/nodejs/the-best-way-to-install-node-js/>
- <https://angular.io/guide/quickstart>
