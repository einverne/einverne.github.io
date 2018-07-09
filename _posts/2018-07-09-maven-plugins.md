---
layout: post
title: "maven plugins"
tagline: ""
description: ""
category:
tags: []
last_updated:
---


## maven-compiler-plugin
pom 文件定义，默认的 source 和 target 都是 1.5。

    <project>
      [...]
      <build>
        [...]
        <plugins>
          <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.7.0</version>
            <configuration>
              <source>1.8</source>
              <target>1.8</target>
              <fork>true</fork>
              <verbose>true</verbose>
              <encoding>UTF-8</encoding>
            </configuration>
          </plugin>
        </plugins>
        [...]
      </build>
      [...]
    </project>


## maven-surefire-plugin
pom 文件中定义，需要 Maven 2.2.1 or 3.x, and JDK 1.6 or higher

    <project>
      [...]
      <build>
        <pluginManagement>
          <plugins>
            <plugin>
              <groupId>org.apache.maven.plugins</groupId>
              <artifactId>maven-surefire-plugin</artifactId>
              <version>2.22.0</version>
            </plugin>
          </plugins>
        </pluginManagement>
      </build>
      [...]
    </project>

在 mvn 的生命周期中 ，`mvn test` 时会调用该插件。如果要在 build 时跳过 test 可以定义

    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>2.22.0</version>
        <configuration>
            <skip>true</skip>
        </configuration>
    </plugin>

另外如果要添加或者排除某些目录可以参考[官网](https://maven.apache.org/surefire/maven-surefire-plugin/examples/inclusion-exclusion.html) 的例子。

## maven-release-plugin
可用于构建 release 版本项目，实现自动打 tag、递增版本号、分发 release 版本 jar 包至仓库。

    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-release-plugin</artifactId>
        <version>2.5</version>
    </plugin>

一般来说引入 maven release plugin 需要如下几步：

- 在项目的 pom 文件中增加，无需添加 mvn-release-plugin 的依赖，因为它默认被包含于 maven 的 effective pom 中；
- 检查自己的 maven 的 settings.xml 是否包含了私服的用户名密码；
- 确保自己本地代码是在主分支，并且是最新的副本；
- 执行 `mvn release:prepare`, 这时插件会扫描项目依赖查看是否有 SNAPSHOT, 是否存在未提交的文件，确定当前 release 的版本号和下一个迭代的版本号，插件会运行单元测试，并向 git 中提交两次 commit, 一次是 release 版本，一次是下一个迭代的版本。并将当前 release 版本打一个 tag 并提交到 git 上面去；
- 执行 mvn release:perform, 插件会执行 mvn deploy 操作，并 clean 掉生成的缓存文件。

pom 设置

    <distributionManagement>
        <repository>
            <id>releases</id>
            <name>xxxx internal releases repository</name>
            <url>http://xxx.com/nexus/content/repositories/releases</url>
        </repository>
        <snapshotRepository>
            <id>snapshots</id>
            <name>xxxx internal snapshots repository</name>
            <url>http://xxx.com/nexus/content/repositories/snapshots</url>
        </snapshotRepository>
    </distributionManagement>

    <scm>
        <url>http://xxx.com/project</url>
        <connection>scm:git:git@xxx.com/project.git</connection>
        <developerConnection>scm:git:git@xxx.com/project.git</developerConnection>
        <tag>HEAD</tag>
    </scm>


## reference

- <https://maven.apache.org/plugins/maven-compiler-plugin/index.html>
- <https://maven.apache.org/surefire/maven-surefire-plugin/index.html>
- <http://maven.apache.org/maven-release/maven-release-plugin/index.html>
