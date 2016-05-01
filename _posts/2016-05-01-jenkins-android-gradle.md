---
layout: post
title: "利用Jenkins持续集成Android程序"
tagline: ""
description: ""
category: 经验总结
tags: [Android, Jenkins, gradle, ci]
last_updated: 
---

Jenkins 是 Java 编写的开源持续集成（Continuous integration）工具[^Jenkins]。在上一篇推荐网站中提到的 [AlternativeTo](../../../post/2016/04/alternativeto.html) 中去搜索一下，能够看到很多持续集成的[工具](http://alternativeto.net/software/jenkins/)，像 GitHub 上经常看到的 Travis CI， 还有 Jenkins 的前身 Hudson。

## 安装

详情请见[官网](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins).

Linux 下：

    wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
    sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'
    sudo apt-get update
    sudo apt-get install jenkins

直接安装源中的Package有几点需要注意：

1. Jenkins 会以守护进程（daemon）随机启动， 查看 `/etc/init.d/jenkins`。
2. 创建了 `jenkins` 用户来运行服务
3. Log 文件 `/var/log/jenkins/jenkins.log`
4. 配置地址 `/etc/default/jenkins` 比如 `JENKINS_HOME` 在该文件配置
5. 默认 Jenkins 使用 8080 端口，启动 `http://localhost:8080` 开始配置 Jenkins 吧。

更多服务器 Apache ， Nginx 的配置请见官网。

## 全局配置

这里默认已经有 Android 开发环境，也就是 JDK， Android-SDK，Gradle 都已经是完整的。进入 `http://localhost:8080` 配置，首次今日需要验证身份信息，验证之后创建用户，然后下载插件，进入之后，系统管理-> 管理插件，需要安装以下插件：

- Android Lint Plugin
- Git plugin
- Gradle plugin

如有其他插件 GitHub , gitlab 啦，可以就使用环境来选择安装。

更新玩插件，进入 系统管理->Global Tool Configuration , 然后配置 JDK 目录， Gradle 目录，Git目录。当然需要知道当前自己机器上的绝对地址：

- JDK： /usr/lib/jvm/java-7-openjdk-amd64
- Gradle： /home/einverne/android-studio/gradle/gradle-2.10
- Git： git

系统管理-> 系统系统设置：

Environment variables 下添加：

键 ： ANDROID_HOME    值：/home/einverne/Android/Sdk

如果这一行不添加，而 Android Studio 的工程没有在 `local.properties` 中指定 `sdk.dir=/home/einverne/Android/Sdk` 的话， Jenkins build failed, cannot found Android sdk[^1].

## 项目配置

配置好上面的环境，新建项目，名字+"构建一个自由风格的软件项目"。 然后进入项目，配置

### General

项目名字，项目描述， GitHub Project url。 如果想要自定义路径，可以在高级中设置。

### 源码管理

当然使用的是 Git， 然后是项目地址，然后需要验证身份信息，当然有很多的方式，用户名密码，用户名密钥，等等，根据自己的适用情况添加即可。可以选择分支 build.

### 构建触发器

这里可以选择何时触发构建， 有很多的方式，可以是有变动自动构建，也可以是定时构建，当然也有很多的触发方式。

### 构建环境

这边基本上在全局环境配置的时候就已经满足，细化一下build 环境。

### 构建

这里需要选择 `Invoke Gradle script`, 然后在配置中选择刚刚在全局配置中配置的 Gradle 版本。

在 Tasks 下输入 `clean build` .

### 构建后操作

1. 选择 `Publish Android Lint results`， 以便输出 Lint 结果，设置中输入 `**/lint-results*.xml`.
2. 选择 `Archive the artifacts` 来存档 apk 文件，设置中输入 `**/*.apk`。 默认输出文件在 Workspace 下 `app/build/outputs/apk/` 。

## 遇到问题

### Android Lint

Jenkins 默认启用 Lint 检查，所以需要在 `build.gradle` 中 `android` 下添加

    lintOptions {
        abortOnError false;
    }

图文教程，Windows下教程参考下面文章。

## reference

- <http://blog.csdn.net/ymlxku/article/details/39962481>
- <http://wangkuiwu.github.io/2015/08/07/jenkins-02/>
- <https://dzone.com/articles/automating-continuous>

[^Jenkins]: [维基](https://zh.wikipedia.org/wiki/Jenkins_(%E8%BD%AF%E4%BB%B6))
[^1]: <http://stackoverflow.com/a/29231580/1820217>
