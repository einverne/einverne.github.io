---
layout: post
title: "Spring @Configuration 注解"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, annotation, notes, spring-boot]
last_updated:
---

@Configuration 标注在类上，相当于把该类作为 spring 的 xml 配置文件中的 `<beans>`，作用为：配置 spring 容器（context）

    package com.test.spring.support.configuration;

    @Configuration
    public class TestConfiguration {
        public TestConfiguration(){
            System.out.println("spring 容器启动初始化......");
        }
    }

相当于

    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:context="http://www.springframework.org/schema/context" xmlns:jdbc="http://www.springframework.org/schema/jdbc"
        xmlns:jee="http://www.springframework.org/schema/jee" xmlns:tx="http://www.springframework.org/schema/tx"
        xmlns:util="http://www.springframework.org/schema/util" xmlns:task="http://www.springframework.org/schema/task" xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
            http://www.springframework.org/schema/jdbc http://www.springframework.org/schema/jdbc/spring-jdbc-4.0.xsd
            http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-4.0.xsd
            http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
            http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-4.0.xsd
            http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task-4.0.xsd" default-lazy-init="false">

    </beans>

测试

    package com.test.spring.support.configuration;

    public class TestMain {
        public static void main(String[] args) {

            //@Configuration 注解的 spring 容器加载方式，用 AnnotationConfigApplicationContext 替换 ClassPathXmlApplicationContext
            ApplicationContext context = new AnnotationConfigApplicationContext(TestConfiguration.class);

            // 如果加载 spring-context.xml 文件：
            //ApplicationContext context = new ClassPathXmlApplicationContext("spring-context.xml");
        }
    }


