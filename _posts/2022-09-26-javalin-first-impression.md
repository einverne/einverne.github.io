---
layout: post
title: "Javalin：一个轻量的 Web Framework"
aliases:
- "Javalin：一个轻量的 Web Framework"
tagline: ""
description: ""
category: 学习笔记
tags: [ javalin, java, jetty, kotlin, web-framework, restful ]
create_time: 2022-09-26 19:49:21
last_updated: 2022-09-26 19:49:21
---

说起 Java 语言下的 Web 框架那就非 [[Spring Framework]] 不可了，但是今天在和别人在聊天的过程中发现了一个新奇的项目 Javalin。 [Javalin](https://javalin.io/) 是一个轻量的 Web 框架。支持 [[WebSocket]], HTTP2 和异步请求。简单的看了一下官方的说明文档，确实非常轻量，几行代码就可以启动一个 HTTP 服务。

[[Javalin]] 最初是 [[SparkJava]] 的一个分支，后来受到 JavaScript 框架 koa.js 的影响，逐渐独立成一个新的项目发展。

首先来看看一个比 Hello World 稍微复杂一些的例子：

```
var app = Javalin.create(config -> {
    config.defaultContentType = "application/json";
    config.autogenerateEtags = true;
    config.addStaticFiles("/public");
    config.asyncRequestTimeout = 10_000L;
    config.dynamicGzip = true;
    config.enforceSsl = true;
}).routes(() -> {
    path("users", () -> {
        get(UserController::getAll);
        post(UserController::create);
        path(":user-id"(() -> {
            get(UserController::getOne);
            patch(UserController::update);
            delete(UserController::delete);
        });
        ws("events", userController::webSocketEvents);
    });
}).start(port);
```

验证路径参数

```
var myQpStr = ctx.queryParam("my-qp"); // 没有验证，返回字符串或空
var myQpInt = ctx.pathParam("my-qp", Integer.class).get(); // 返回一个整数或抛出异常
var myQpInt = ctx.formParam("my-qp", Integer.class).check(i -> i > 4).get(); // 整数 > 4

// 验证两个依赖的查询参数 :
var fromDate = ctx.queryParam("from", Instant.class).get();
var toDate = ctx.queryParam("to", Instant.class)
        .check(it -> it.isAfter(fromDate), "'to' has to be after 'from'")
        .get();

// 验证一个json消息体:
var myObject = ctx.bodyValidator(MyObject.class)
        .check(obj -> obj.myObjectProperty == someValue)
        .get();
```

handler

```
//前置handler
app.before(ctx -> {
    // 在所有请求之前运行
});
app.before("/path/*", ctx -> {
    // 在/path/*请求之前运行
});

//端点handler
app.get("/", ctx -> {
    // 一些代码
    ctx.json(object);
});

app.get("/hello/*, ctx -> {
    // 捕获所有对/hello/子路径的请求 
});

//后置handler
app.after(ctx -> {
    // 在所有请求之后运行
});
app.after("/path/*", ctx -> {
    // 在/path/*请求之后运行 
});
```

使用 AccessManager 接口来实现验证和授权。

如果要部署 Javalin 应用程序，开发人员只需创建一个包含了依赖（使用 maven-assembly-plugin）的 jar，然后用 `java -jar filename.jar` 发布该 jar。Javalin 自带一个嵌入式 Jetty 服务器，无需额外的应用程序服务器。

Javalin 还有 [专门为教育工作者准备的页面](https://javalin.io/for-educators) ，该页面强调学生可以从 Javalin 受益，因为 Javalin 提供了嵌入式的 Jetty 服务器，所以不需要 Servlet Container/Application 服务器配置就可以开始编码。

有一系列教程可供使用，如 [Running on GraalVM](https://javalin.io/2018/09/27/javalin-graalvm-example.html) 和 [Kotlin CRUD REST API](https://javalin.io/tutorials/simple-kotlin-example) 。可以在 [教程页面](https://javalin.io/tutorials/) 找到完整的列表。

[文档页面](https://javalin.io/documentation) 提供了有关 Javalin 的更多细节。用户可以通过 maven 或从手动 [maven中央库](https://repo1.maven.org/maven2/io/javalin/javalin/) 下载 Javalin。

## 部署执行
通过 `mvn package` 就可以打包一个 jar 文件，直接运行 `java -jar xxx.jar` 就可以启动。

## 启动 7000 端口占用问题
因为我在 macOS 下启动 Javalin 程序，默认是使用的 7000 端口，但是起来的时候发现端口被占用了。

用 `lsof` 查看

```
❯ sudo lsof -nP -i4TCP |grep 7000
Password:
Swinsian   1563 einverne   36u  IPv4 0xa107511eb4d4e74b      0t0  TCP 127.0.0.1:50677->127.0.0.1:7000 (CLOSED)
Swinsian   1563 einverne   37u  IPv4 0xa107511eb4d4e74b      0t0  TCP 127.0.0.1:50677->127.0.0.1:7000 (CLOSED)
ControlCe  1578 einverne   29u  IPv4 0xa107511eb42171fb      0t0  TCP *:7000 (LISTEN)
```

查看进程

```
❯ sudo ps aux | grep 1578
einverne         46918   0.7  0.0 34253900    968 s000  S+    2:37PM   0:00.00 grep --color=auto 1578
einverne          1578   0.0  0.1 36594320  36324   ??  S    Sun12PM   1:24.15 /System/Library/CoreServices/ControlCenter.app/Contents/MacOS/ControlCenter
```

发现竟然是系统的 ControlCenter 占用了本地 7000 端口，用如下的方法禁用。

![stop airplay take 7000 port](https://photo.einverne.info/images/2022/12/22/ZQpp.png)

[[javalin-database]]

## reference

- <https://javalin.io/documentation>
