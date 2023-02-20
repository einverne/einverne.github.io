---
layout: post
title: "REST-assured 简单使用"
aliases:
- "REST-assured 简单使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ java, unit-test, rest-assured, ]
create_time: 2023-02-20 18:07:53
last_updated: 2023-02-20 18:07:53
---

REST-assured 是 Java 实现的一套 REST API 测试框架。在 Java 中测试和验证 REST 接口的难度要大于动态语言比如 Ruby 或 Groovy，而 REST Assured 将测试接口的能力大大简化了。

- 官网：<https://rest-assured.io/>

Maven:

```
<dependency>
      <groupId>io.rest-assured</groupId>
      <artifactId>rest-assured</artifactId>
      <version>4.2.0</version>
      <scope>test</scope>
</dependency>
```

导入静态类：

```
import static io.restassured.RestAssured.*;
```

使用：

```
given().
   XXXX
when().
   XXXX
then().
   XXXX
```

行为驱动开发中定义的结构，Given-When-Then。

- Given 在某场景下
    - 设置测试的初始内容，包括请求头，参数，请求体，cookie 等
- When 发生了什么事情
    - 执行的操作，GET/POST/PUT/DELETE 等
- Then 产生了什么结果
    - 解析结果，断言

### GET
测试 GET 请求：

```
given().
    queryParam("mobilephone","13323234545").
    queryParam("password","123456").
when().
    get("http://httpbin.org/get").
then().
    log().body();
```

### POST
测试 POST 请求：

表单：

```
given().
    formParam("mobilephone","13323234545").
    formParam("password","123456").
when().
    post("http://httpbin.org/post").
then().
    log().body();
```

JSON 参数：

```
String jsonData = "{\"mobilephone\":\"18023234545\",\"password\":\"23456456\"}";
given().
    body(jsonData).contentType(ContentType.JSON).
when().
    post("http://httpbin.org/post").
then().
    log().body();
```

上传文件：

```
given().
    multiPart(new File("D:\\file.png")).
when().
    post("http://httpbin.org/post").
then().
    log().body();
```