---
layout: post
title: "关于在 Docker 容器中如何优雅关闭 Java 应用的记录"
aliases:
- "关于在 Docker 容器中如何优雅关闭 Java 应用的记录"
tagline: ""
description: ""
category: 经验总结
tags: [ docker, java, sigterm, shell, dockerfile, ]
create_time: 2025-05-23 09:57:07
last_updated: 2025-05-23 09:57:07
dg-home: false
dg-publish: false
---

这两天遇到一个和 Docker 运行相关的问题，我们使用 Azure App Service 来运行服务，但是每次重启服务的时候，发现不会出发 Javalin 的 stop，感觉 Java 进程没有接受到 Docker 容器停机的信号，然后就被系统杀死了，所以就这个问题，仔细地研究了一下 Docker 运行以及如何优雅地关闭 Docker 容器中的 Java 进程。

## 问题原因

信号是操作系统用于向正在运行的进程发送消息，使其以特定方式运行的一种方式，常见的情况是操作系统会向进程 ID 发送 SIGTERM 信号来终止进程，当我们执行 kill PID 的时候，也是发送 SIGTERM 信号。

使用 `docker stop` 命令时，Docker 会向容器内 PID  1 的进程发送 SIGTERM 信号，如果 Java 应用不是 PID 1 的进程，而是 Shell 的子进程，那么 SIGTERM 信号可能无法正确传递到 Java 应用。

当使用 Shell 脚本启动 Java 应用时，Shell 进程称为 PID，而 Java 进程成为子进程，Shell 进程不会将 SIGTERM 信号转发给子进程，导致 Java 应用永远不会收到关闭信号。

Azure App Service在容器关闭时会发送SIGTERM信号给容器内的PID 1进程。如果应用在默认的30秒超时时间内没有响应，系统会强制发送SIGKILL信号终止进程。

## 使用 exec 命令
在 Dockerfile 中直接使用 exec 格式

```
# 推荐的CMD格式
CMD ["java", "-jar", "application.jar"]

# 而不是
CMD java -jar application.jar
```

Java 进程代替 Shell 进程，成为 PID 1.

## Javalin
对于 Javalin 应用，需要配置服务器的优雅关闭机制

```
Javalin app = Javalin.create(config -> {
    // 配置优雅关闭超时时间
    config.jetty.modifyServer(server -> 
        server.setStopTimeout(5000) // 等待5秒让现有请求完成
    );
});

// 添加关闭钩子
Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    app.stop();
}));

// 配置服务器事件监听
app.events(event -> {
    event.serverStopping(() -> {
        System.out.println("服务器正在停止...");
        // 在这里执行清理工作
    });
    event.serverStopped(() -> {
        System.out.println("服务器已停止");
    });
});
```


