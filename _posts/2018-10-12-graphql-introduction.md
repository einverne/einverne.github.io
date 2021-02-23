---
layout: post
title: "GraphQL 初识"
tagline: ""
description: ""
category: 学习笔记
tags: [graphql, restful, api, github, facebook, ]
last_updated:
---

在开发服务端接口的时候接触到 GraphQL 这个名词，故而有了这篇文章。因为初始，所以整理过程难免有些错误和疏漏，请留言告知。在我们面对一个新的名词，或者一门新的技术时，了解的过程可以分成这么几部分，他是什么，他解决了什么问题，他和目前同类型的技术相比优势在哪里，这样几个部分去看也就能够比较粗略，但是快速的了解一样新东西了。所以这篇文章的组织结构也以这样的方式进行。

## GraphQL 是什么
GraphQL，很容易让人想起来 SQL，其实也很类似，可以理解为是一门查询语句，但和 SQL 不同的是，SQL 是查询关系型数据库，而 GraphQL 是查询 WEB 服务数据。GraphQL 是有 Facebook 开发开源，设计主要是为了解决 RESTful 接口的不足。

RESTful 在设计时，将互联网上的每一个内容都理解为资源，通过 HTTP 不同的请求方法来对资源进行增删改查，而 GraphQL 则是通过客户端自主使用查询语句来获得资源。GraphQL 并不是一门语言或者框架，而是请求数据的一种规范，协议。GraphQL 本身并不直接提供存储管理功能，也不和任何数据库绑定。


## GraphQL 解决了什么问题

RESTful 接口遇到的问题

- RESTful 接口数据格式由后端约定，调用者无法修改数据格式，只能够做适配和容错
- 难以维护，因为 RESTful 固有的属性，服务和资源提供接口，所以随着系统和业务变化，RESTful 接口数量会爆炸式增长，不利于维护
- 创建大而全的接口不仅影响调用速度，也浪费了移动端传输流量
- 很多情况下客户端只需要某一个接口中特殊几个字段，但是 RESTful 会将整个数据格式返回
- RESTful 接口在开发时需要相应的维护一套文档，而更新接口时可能导致文档修改不同步

## 特点
GraphQL 有如下特点：

- 强类型，所有类型都需要预先定义
- 服务端根据客户端提供的查询语句返回对应的 JSON

GraphQL 对外提供只有一个接口，所有请求通过该接口处理，GraphQL 内部做了路由处理。查询语句主要分为两大类，Query 查询，Mutation 修改（非幂等操作，post，put，delete 等）

比如客户端有如下查询语句

    query {
      user(id: 1) {
        id
        name
      }
    }

服务端返回

    {
      "data": {
        "user": {
          "id": "1",
          "name": "Uncle Charlie"
        }
      }
    }

服务端会返回一个和查询一致的 JSON 字串。

关于 GraphQL 的类型系统，标量类型，对象类型那就自行查看文档即可。

如果你看到这里想要亲手体验一下，那么可以访问 GitHub 提供的在线查询工具

- <https://developer.github.com/v4/explorer/>


## GraphQL 和 RESTful 比较
针对上面 RESTful 出现的问题 GraphQL 的解决方案：

- GraphQL 是强类型定义，接口 Schema 的类型是需要前后端事先约定的
- GraphQL 不会随着业务发展而接口数量暴增，GraphQL 只暴露一个接口，所以这个接口是数据库，缓存，服务的 Facade.
- GraphQL 的调用完全由客户端控制，不会产生无用传输流量
- GraphQL 会根据定义好的类型系统自动生成说明文档，省去了文档同步更新的麻烦

## GraphQL 思考模式
使用 GraphQL 接口设计获取数据步骤：

- 设计数据模型，用来描述数据对象
- 前端使用模式查询语言 Schema 来描述请求数据对象类型和具体需要的字段
- 后端 GraphQL 通过请求，根据需要，自动组装数据字段，返回前端


## 其他语言扩展

### Python

- <https://medium.com/@fasterpancakes/graphql-server-up-and-running-with-50-lines-of-python-85e8ada9f637>
- <https://graphene-python.org>

### JS

- <https://github.com/graphile/postgraphile>

## 其他扩展

- <https://github.com/facebook/graphql>
- <http://graphql.org/>
- 生成 GraphQL 接口示意图 voyager <https://github.com/APIs-guru/graphql-voyager>
- 数据查询优化 <https://github.com/facebook/dataloader>
- [prisma](https://www.prisma.io/docs/) 框架，在 GraphQL 基础上构建，与 GraphQL 兼容，可以当做 ORM 与数据库交互
- 在浏览器中使用查询语句 GraphiQL <https://github.com/graphql/graphiql>
- GraphQL 对各个语言的[支持](https://graphql.org/code/)


## reference

- <https://blog.apollographql.com/the-anatomy-of-a-graphql-query-6dffa9e9e747>
- <https://juejin.im/post/58fd6d121b69e600589ec740>
- <https://xiaomingplus.com/full-stack/graphql-intro/>
- <https://www.jianshu.com/p/2ec22fc1219c>
- <https://segmentfault.com/a/1190000014131950>
