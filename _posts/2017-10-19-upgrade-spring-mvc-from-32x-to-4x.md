---
layout: post
title: "升级 Spring MVC 3.2.x 到 4.x 注意事项"
tagline: ""
description: ""
category: 经验总结
tags: [Spring, Java, Web]
last_updated: 
---

把 Spring 版本从 3.2.x 升级到了4.x ，这里记录一下。

## 新特性

Java 8 Support， 从 4.0 开始支持 Java 8，可以使用 lambda 表达式，等等 Java 8 的特性

Groovy DSL

新增 @RestController 注解，这样就不需要每个方法都使用 `@ResponseBody` 了。


更多内容可以查看: <https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/htmlsingle/#spring-whats-new>

## 注意事项

### 添加依赖
加入spring-context-support，以前3的版本不用加，但是4要加上，否则就会报 ClassNotFoundException,

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context-support</artifactId>
        <version>4.3.12.RELEASE</version>
    </dependency>

### 替换 Spring MVC jackson 依赖
更换Spring jackson依赖，Spring MVC返回 json 的时候需要依赖jackson的jar包，以前是codehaus.jackson，现在换成了fasterxml.jackson 同时修改配置文件

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-core</artifactId>
        <version>2.7.0</version>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.7.0</version>
    </dependency>

同时还要修改Spring的配置文件

    <bean
        class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter">
        <property name="messageConverters">
            <list>
                 <ref bean="stringHttpMessageConverter" />  
                <bean
                    class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
                </bean>
            </list>
        </property>
    </bean>

    <bean id="stringHttpMessageConverter"
        class="org.springframework.http.converter.StringHttpMessageConverter">
        <property name="supportedMediaTypes">
            <list>
                <value>text/plain;charset=UTF-8</value>
            </list>
        </property>
    </bean>


### xsd 文件版本
更换springxsd文件的版本，直接从 3.0 升级到 4.0 即可

    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xmlns:mvc="http://www.springframework.org/schema/mvc" xmlns:aop="http://www.springframework.org/schema/aop"
           xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-4.0.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">
 

## 修改 quarz 版本
修改quarz版本，用2以上的版本，maven依赖如下

    <dependency>
        <groupId>org.quartz-scheduler</groupId>
        <artifactId>quartz</artifactId>
        <version>2.2.2</version>
    </dependency>
