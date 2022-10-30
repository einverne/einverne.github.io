---
layout: post
title: "《Go 语言高并发与微服务实战》 读书笔记"
aliases:
- "《Go 语言高并发与微服务实战》读书笔记"
tagline: ""
description: ""
category: 读书笔记
tags: [ reading, reading-2022 , reading-2022q3 , golang,  ]
create_time: 2022-10-30 09:25:34
last_updated: 2022-10-30 09:26:36
---

楼下刚开了一个图书室，第一天逛的时候恰好看到这一本就借了回来粗读了一下，没有料想的好，不过至少可以对 Golang 构建一个微服务应用有一个初步的了解，也顺带了解一下 Golang 周边相关的模块，Web 框架，ORM 框架，以及一些必要组件，注册中心，网关等等。书中在中后部分出现了大量的代码部分，我没有仔细看，直接跳过了。总之读起来这一本书虽然介绍了很多的组件，原理，但都是类似 Wiki ，都没有很深入，比较适合我这样想要初步了解一下 Golang 的人，如果已经是 Golang 的使用者跳过这一本书即可。

## 第二章 微服务概述

微服务是一种架构模式，提倡将单一应用划分成一组小的服务，服务之间相互协调配合，为用户提供最终价值。

每个微服务只关注于完成单一职责。

- 系统架构演进
    - 单体架构
    - 垂直分层
    - SOA 面向服务架构
    - 微服务架构
    - 云原生架构
- 常见的微服务架构
    - Java 中的 Spring Cloud 和 Dubbo 框架
    - Go 中的 Go Kit 和 Go Micro
- 六大原则：
    - 高内聚低耦合
    - 高度自治
        - 独立开发、部署、发布
        - 进程隔离
    - 弹性设计
    - 日志与监控
    - 自动化
    - 以业务为中心

## 第三章 Go 语言基础

[[golang]]

- 环境安装
- 基础语法
    - 变量
    - 数据类型
    - 指针
        - [[golang-flag]]
    - 常量与类型别名
    - 分支与循环控制
- 容器
    - 数组
    - 切片
    - 列表与字典
    - 容器遍历
- 函数与接口
    - 函数声明和参数传递
    - 匿名函数和闭包
    - 接口声明和嵌套
    - 函数体实现接口
- 结构体和方法
    - 结构体定义
    - 结构体实例化和初始化
    - 方法和接收器
    - 结构体实现接口
    - 内嵌和组合

## 第四章 Go 语言高级特性

- 依赖管理
    - 包管理
    - GOPATH
    - Go Modules
- 反射基础
    - reflect.Type 类型对象
    - 类型对象 reflect.StructField 和 reflect.Method
    - reflect.Value 反射值对象
- 并发模型
    - 并发与并行
    - CSP 并发模型
    - 常见线程模型
    - MPG 线程模型
- 并发实践
    - 协程 goroutine
    - 通道 channel
    - sync

## 第五章 Go Web

- Web 工作原理
    - HTTP 协议
        - 在 TCP 协议之上
- 访问 Web 站点的过程
    - URL -> DNS -> IP -> TCP 链接 -> HTTP Request -> Web 服务器处理 -> HTTP Response -> 渲染 -> 展示 -> 断开 TCP 连接
- 使用 Go 语言构建服务器
    - http 模块可以快速建立 Web 服务程序
- 接收和处理请求
- [[Gin]] Web 框架
- 数据存储
    - 内存数据
    - database/sql 接口
    - MySQL 数据库
- Golang ORM 框架 [[beego]]

## 第六章 服务注册与发现

- 服务注册与发现的基本原理
    - 服务注册与发现中心的职责
    - 服务实例注册服务信息
    - CAP 原理
- 常用的服务注册与发现框架
    - Raft 算法的 Consul
    - 基于 HTTP 的 key/value 存储 Etcd
    - Zookeeper
- Consul

## 第七章 RPC

- RPC 机制和实现过程
    - RPC 机制
    - 传递参数
    - 通信协议制定
    - 出错和超时处理
    - RPC 接口
- 简易 Go 原生 RPC
- 高性能 gRPC
- Go-kit RPC

## 第八章 分布式配置中心

- 常见分布式配置中心
    - Spring Cloud Config
    - Apollo
    - Disconf
- Spring Cloud Config
- 配置热更新
- 配置信息加解密

## 第九章 微服务网关

- 实现网关
- API 网关
    - Nginx
    - Netflix Zuul
    - Mashape Kong
- Kong 接入
- Kong 插件
    - 跨域身份验证 JWT 认证插件
    - Prometheus 可视化监控
    - Zipkin 实时链路数据追踪
    - 自定义 Kong 插件

## 第十章 微服务的容错处理与负载均衡

- 服务熔断
    - 分布式系统中的服务雪崩
    - 熔断保障系统可用性
    - 断路器
- 负载均衡
    - 负载均衡类型
    - 负载均衡算法
- Hystrix 监控面板

## 第十一章 统一认证与授权

- 常见的认证和授权方案
    - OAuth2
    - 数据共享的分布式 Session
    - 安全传输对象 JWT
- 基于 OAuth2 协议和 JWT 实现简单的认证和授权系统

## 第十二章 分布式链路追踪

- 诊断分布式系统问题
    - 为什么需要分布式链路追踪
    - 什么是分布式链路追踪
    - OpenTracing
- 流行的分布式链路追踪组件
    - Twitter Zipkin
    - Uber Jaeger
    - SkyWalking
    - Pinpoint
- Zipkin 追踪 Go 微服务

## 第十三章 秒杀系统的设计和实现

- 秒杀系统
    - 三大问题
        - 瞬时并发
        - 超卖
        - 性能
    - 解决问题：
        - 传输数据尽量少
        - 请求数尽量少
        - 路径短，发出请求到返回响应过程
        - 依赖尽量少，完成一次请求需要依赖的系统服务
        - 不要有单点
    - 系统设计：
        - 静态页面，CDN
        - 应用服务器需要有限流和熔断机制 Hystrix
        - 服务降级
- 微服务脚手架
    - 服务注册和发现
    - 负载均衡策略
    - RPC 客户端
    - 限流
    - Go Redis
    - Zookeeper 集成
    - Go-kit 开发利器 Truss
- 秒杀核心逻辑
- 性能压测
