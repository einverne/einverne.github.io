---
layout: post
title: "Maven 依赖管理"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, build, java, linux]
last_updated:
---


## dependencyManagement 作用
dependencyManagement 主要有两个作用

- 集中管理项目的依赖项
- 控制使用的依赖项的版本

使用 dependencyManagement 声明依赖，项目并不引入，因此子项目需要显示声明需要用的依赖

- 如果不在子项目中声明依赖，是不会从父项目中继承下来的
- 只有在子项目中写了该依赖项，并且没有指定具体版本，才会从父项目中继承该项，并且 version 和 scope 都读取自父 pom
- 如果子项目中指定了版本号，那么会使用子项目中指定的 jar 版本

`dependencies` 即使在子项目中不写该依赖项，那么子项目仍然会从父项目中继承该依赖项。父工程使用 dependencyManagement 假引用，目的是**管理版本号**。dependencies 用于实际上需要引入的工程，这些工程如果继承于父工程会找到对应的版本号。

maven 中的仓库分为两种，snapshot 快照仓库和 release 发布仓库。snapshot 快照仓库用于保存开发过程中的不稳定版本，release 正式仓库则是用来保存稳定的发行版本。定义一个组件或者模块为快照版本，只需要在 pom 文件中在该模块的版本号后加上 `-SNAPSHOT` 即可（注意这里必须是大写）。

在 distributionManagement 段中配置的是 snapshot 快照库和 release 发布库的地址

    <distributionManagement>
      <repository>
        <id>central</id>
        <name>artifactory-releases</name>
        <url>releases-url</url>
      </repository>
      <snapshotRepository>
        <id>snapshots</id>
        <name>artifactory-snapshots</name>
        <url>snapshots-releases</url>
      </snapshotRepository>
    </distributionManagement>

maven 区别对待 release 版本构件和 snapshot 版本，snapshot 为开发过程中版本，实时但不稳定。

一般来说发布到远程仓库还需要认证，没有任何配置信息，可能会得到 401 错误。所以还需要在 maven 的 settings.xml 文件中做如下配置：

    <server>
      <id>central</id>
      <username>admin</username>
      <password>admin123</password>
    </server>

    <server>
      <id>snapshots</id>
      <username>admin</username>
      <password>admin123</password>
    </server>

需要注意的是，settings.xml 中 server 元素下 id 的值必须与 POM 中 repository 或 snapshotRepository 下 id 的值完全一致。将认证信息放到 settings 下而非 POM 中，是因为 POM 往往是它人可见的，而 settings.xml 是本地的。配置完成后就可以通过 `mvn deploy` 进行发布了。

## Maven 解决依赖冲突
在之前的 [maven 介绍](/post/2017/09/maven-introduction.html) 中指出来 Maven 的传递性依赖两个原则，第一就近原则，第二依赖路劲距离一样则优先定义的依赖。

而当项目比较复杂之后，避免不了可能会出现打包时依赖的 jar 出现冲突。这个时候就需要通过下面的步骤来排查错误。

### 判断 jar 是否被正确引用
在项目启动时把所有的加载的 jar 包都打印出来，添加 VM 参数 `-verbose:class` 。通过打印的信息确认是否正确的 jar 包被依赖。

### 查看依赖树
通过 maven 自带的工具来查看依赖树

    mvn dependency:tree -Dverbose

通过查看其中可能导致冲突的 jar 包，然后使用 exclusions 来排除掉。


## reference

- <https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html>
