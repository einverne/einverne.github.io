---
layout: post
title: "Maven 依赖管理"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, build, java, linux, build-system, ]
last_updated:
---

使用 Maven 来管理项目的依赖，带来便捷性的同时也引入了一些问题。对于一个大型项目来说，引用数十个依赖是经常遇到的。Maven 在管理这些依赖的时候，遵循一些基本原则，这就是这篇文章主要要定义的问题。另外如果项目中出现了依赖冲突，也是这篇文章的重点。

## dependencyManagement 作用
dependencyManagement 主要有两个作用

- 集中管理项目的依赖项
- 控制使用的依赖项的版本

使用 dependencyManagement 声明依赖，实际项目并不会引入，因此子项目需要显示声明需要用的依赖

- 如果不在子项目中声明依赖，是不会从父项目中继承下来的
- 只有在子项目中写了该依赖项，并且**没有指定具体版本**，才会从父项目中继承该项，并且 version 和 scope 都读取自父 pom
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

## Maven 依赖原则
在之前的 Maven 介绍中也有提及，这边展开。

## Maven 解决依赖冲突
在之前的 [maven 介绍](/post/2017/09/maven-introduction.html) 中指出来 Maven 的传递性依赖两个原则，第一**就近原则**，第二依赖路径距离一样则优先定义的依赖。

而当项目比较复杂之后，避免不了可能会出现打包时依赖的 jar 出现冲突。当引入新的依赖，发现项目中突然出现很多 method not found，或者 class not found 问题，基本上可以确定是因为依赖产生了冲突。

举一个比较直观的例子

    加入我们的项目 A ，依赖 B， C 两个包，而 B ，C 各自依赖了 G1.0 和 G2.0 两个版本的包，那么 Maven 怎么选择？

[Maven](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html) 的依赖传递会自动寻找到 B，C 两个依赖，并且发现依赖的 C，并自动引入，那么 G 会引入 1.0 还是 2.0 呢？这里就要引入 Maven 的第一个原则，`最短路径优先`，这条原则是 A - B - C - D1.0 另外 A - E - D2.0 显然 Maven 会选择 D2.0，而显然在这个例子中是不行的；那么就要提到第二条原则，谁先定义则使用谁，所以在路径一致前提下，如果先定义了 A - B - G1.0，会选择 G1.0，而这个时候可能就会产生问题，命名我需要使用 G2.0 中新的方法和类，但是 G1.0 中并没有就会出现错误。

这个时候就需要通过下面的步骤来排查错误。

### 判断 jar 是否被正确引用
在项目启动时把所有的加载的 jar 包都打印出来，添加 VM 参数 `-verbose:class` 。通过打印的信息确认是否正确的 jar 包被依赖。

### 查看依赖树
通过 maven 自带的工具来查看依赖树

    mvn dependency:tree -Dverbose

通过查看其中可能导致冲突的 jar 包，然后使用 exclusions 来排除掉。

    <dependency>
      <groupId>info.einverne.chat</groupId>
      <artifactId>common-biz</artifactId>
      <version>1.0.0-SNAPSHOT</version>
      <exclusions>
        <exclusion>
          <artifactId>slf4j-log4j12</artifactId>
          <groupId>org.slf4j</groupId>
        </exclusion>
      </exclusions>
    </dependency>

### 使用 enforcer 快速发现冲突
上面提到的例子是一个很简单的演示，实际情况要比这个复杂许多，有的时候仅仅通过 `mvn dependency:tree` 可能无法快速的发现冲突，这个时候就可以尝试使用 [Enforcer 插件](http://maven.apache.org/enforcer/maven-enforcer-plugin/)，这个插件也可以自定义许多规则，我们可以使用 `dependencyConvergence – ensures all dependencies converge to the same version.` 来保证所有的依赖都使用相同的版本。

    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-enforcer-plugin</artifactId>
            <version>1.4.1</version>
            <configuration>
                <rules><dependencyConvergence/></rules>
            </configuration>
        </plugin>
    </plugins>

在定义了插件之后就可以使用 mvn 的 goal ---- `mvn enforcer:enforce` 来分析项目，会给出可能的冲突结果

    Dependency convergence error for log4j:log4j:1.2.17 paths to dependency are:
    +-com.ricston.conflict:conflict-info:2.1.3-SNAPSHOT
      +-org.slf4j:slf4j-log4j12:1.7.6
        +-log4j:log4j:1.2.17
    and
    +-com.ricston.conflict:conflict-info:2.1.3-SNAPSHOT
      +-log4j:log4j:1.2.16

对于这个插件更多的介绍，可以查看另一篇插件的[文章](/post/2018/07/maven-plugins.html)

## reference

- <https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html>
- <https://dzone.com/articles/solving-dependency-conflicts-in-maven>
