---
layout: post
title: "Spring boot 笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [spring-boot, spring, java, web,]
last_updated:
---

Spring aims to make developer challenges easy, like creating web applications, working with databases, securing applications, and microservices.

Spring Boot builds on top of Spring to make Spring even easier with simplified dependency management, automatic configuration, and runtime insights.


笔记

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;


    @SpringBootApplication()        // 开启组件扫描和自动配置
    public class Application {
        public static void main(String[] args) {
            try {
                SpringApplication.run(Application.class, args); // 负责启动引导程序
            } catch (Throwable ex) {
                ex.printStackTrace();
            }
        }
    }

`@SpringBootApplication` 将三个有用的注解组合在了一起

- Spring 的 @Configuration : 标明该类使用 Spring 基于 Java 的配置。
- Spring 的 @ComponentScan : 启用组件扫描，这样你写的 Web 控制器类和其他组件才能被自动发现并注册为 Spring 应用程序上下文里的 Bean。
- Spring Boot 的 `@EnableAutoConfiguration`  开启了 Spring Boot 自动配置

## 配置

application.properties

只要它存在就会被加载，Spring 和应用程序代码都能获取其中的属性

## maven plugin

```
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <configuration>
    <mainClass>com.einverne.api.Application</mainClass>
  </configuration>
</plugin>
```

构建插件的主要功能是把项目打包成一个可执行的超级 JAR (uber-JAR), 包括把应用程序的所有依赖打入 JAR 文件内，并为 JAR 添加一个描述文件，其中的内容能让你用 `java -jar target.jar` 来运行应用程序。
