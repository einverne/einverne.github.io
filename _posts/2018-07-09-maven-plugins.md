---
layout: post
title: "Maven 插件"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, java, build, management, build-tool]
last_updated:
---

Maven 本质上是一个插件框架，它的核心并不执行任何具体的构建任务，所有任务都交给插件来完成，例如编译源代码是由 `maven-compiler-plugin` 完成的。进一步说，每个任务对应了一个插件目标（goal），每个插件会有一个或者多个目标，例如 `maven-compiler-plugin` 的 compile 目标用来编译位于 src/main/java/ 目录下的主源码，testCompile 目标用来编译位于 src/test/java/ 目录下的测试源码。

## maven-compiler-plugin
compiler 插件是最常用到的一个，定义 build 的 Java 版本。

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
surefire 是 maven 的单元测试的插件，默认情况下 surefire 会执行文件名以 Test 开头或者结尾的测试用例，或者以 TestCase 结尾的用例。

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

排除某些类

    <configuration>
      <skip>true</skip>
      <excludes>
        <exclude>**/T</exclude>
      </excludes>
    </configuration>

另外如果要添加或者排除某些目录可以参考[官网](https://maven.apache.org/surefire/maven-surefire-plugin/examples/inclusion-exclusion.html) 的例子。

如果要在开发过程中执行 test，可以

    mvn -Dtest=TestCircle test   # test 表示当前测试方法所在的测试类，不需要扩展名

## maven-enforcer-plugin
在一个稍大一点的组织或团队中，你无法保证所有成员都熟悉 Maven，那他们做一些比较愚蠢的事情就会变得很正常，例如给项目引入了外部的 SNAPSHOT 依赖而导致构建不稳定，使用了一个与大家不一致的 Maven 版本而经常抱怨构建出现诡异问题。maven-enforcer-plugin 能够帮助你避免之类问题，它允许你创建一系列规则强制大家遵守，包括设定 Java 版本、设定 Maven 版本、禁止某些依赖、禁止 SNAPSHOT 依赖。只要在一个父 POM 配置规则，然后让大家继承，当规则遭到破坏的时候，Maven 就会报错。除了标准的规则之外，你还可以扩展该插件，编写自己的规则。maven-enforcer-plugin 的 enforce 目标负责检查规则，它默认绑定到生命周期的 validate 阶段。

使用如下定义

    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-enforcer-plugin</artifactId>
      <version>1.3.1</version>
    </plugin>


enforcer 插件有两个 goal，第一个是 `display-info`， 使用 `mvn enforcer:display-info` 会显示当前环境信息

    [INFO] Maven Version: 3.3.9
    [INFO] JDK Version: 1.8.0_131 normalized as: 1.8.0-131
    [INFO] OS Info: Arch: amd64 Family: unix Name: linux Version: 4.4.0-116-generic
    [INFO]

第二个也是最主要的 goal，就是 `mvn enforcer:enforce` 用来检查依赖。`enforce` goal 和 maven 生命周期 `validate` 阶段[绑定](http://maven.apache.org/enforcer/maven-enforcer-plugin/enforce-mojo.html)，也就意味着，如果要执行 `enforcer:enforce` 可以通过 `mvn validate` 来触发。

如果使用 `Maven > 3.1.1` 和 `enforcer 1.4.1` 可以使用 `@` 语法来[执行](https://issues.apache.org/jira/browse/MNG-5768) 特定 id 的 execution。

    mvn enforcer:enforce@no-duplicate-declared-dependencies

### configuration vs executions
插件的配置中能直接看到插件的 configuration 配置和 executions 中的 configuration 配置，这两个 configuration 配置有什么区别呢？在 executions 中的配置和 maven 的生命周期绑定，而外层插件的 configuration 是全局的配置。

    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-enforcer-plugin</artifactId>
        <version>1.0.1</version>
        <executions>
          <execution>
            <id>convergence</id>
            <goals>
              <goal>enforce</goal>
            </goals>
            <configuration>
              <rules>
                <dependencyConvergence/>
              </rules>
              <fail>false</fail>
            </configuration>
          </execution>
        </executions>
        <configuration>
            <rules>
                <AlwaysPass />
            </rules>
            <fail>true</fail>
        </configuration>
    </plugin>

如果要执行 executions 中的规则，则需要运行 `mvn validate` 来触发，而在定义在外层 configuration 中的规则，通过 `mvn enforcer:enforce` 就能够执行。

### 内置的规则
enforcer 插件自带了很多[规则](http://maven.apache.org/enforcer/enforcer-rules/index.html) 下面就列举比较常用的几个。

`dependencyConvergence` [规则](http://maven.apache.org/enforcer/enforcer-rules/dependencyConvergence.html) 可以保证 maven 以来的包都使用同一个版本。

    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-enforcer-plugin</artifactId>
      <version>3.0.0-M2</version>
      <executions>
        <execution>
          <id>convergence</id>
          <configuration>
            <rules>
              <dependencyConvergence/>
            </rules>
          </configuration>
          <goals>
            <goal>enforce</goal>
          </goals>
        </execution>
      </executions>
    </plugin>

单独执行该 goal 可以使用 `mvn enforcer:enforce@convergence`。

`bannedDependencies` 用来[禁用某依赖](http://maven.apache.org/enforcer/enforcer-rules/bannedDependencies.html)，

    <execution>
      <!-- mvn enforcer:enforce@ban-dependencies -->
      <id>ban-dependencies</id>
      <goals>
        <goal>enforce</goal>
      </goals>
      <configuration>
        <rules>
          <bannedDependencies>
            <!-- 是否检查依赖传递 -->
            <searchTransitive>false</searchTransitive>
            <excludes>
              <exclude>org.apache.maven</exclude>
              <exclude>org.apache.maven:badArtifact</exclude>
              <exclude>*:badArtifact</exclude>
              <!--<exclude>com.google.code.gson</exclude>-->
            </excludes>
            <includes>
              <!--only 1.0 of badArtifact is allowed-->
              <include>org.apache.maven:badArtifact:1.0</include>
            </includes>
            <message>检查这些依赖</message>
          </bannedDependencies>
        </rules>
        <fail>true</fail>
      </configuration>
    </execution>

`excludes` 中包含一些列禁止的 artifacts，格式是 `groupId[:artifactId][:version][:type][:scope][:classifier]` 除了 groupId 其他都是可选的，可以使用通配符

- org.apache.maven
- org.apache.maven:badArtifact
- org.apache.maven:artifact:badVersion
- org.apache.maven:*:1.2 (exclude version 1.2 and above, equivalent to [1.2,) )
- org.apache.maven:*:[1.2] (explicit exclude of version 1.2)
- org.apache.maven:*:*:jar:test
- *:*:*:jar:compile:tests
- org.apache.*:maven-*:*

`bannedPlugins` 禁止使用某些插件。

更多的插件内置规则可以查看：<http://maven.apache.org/enforcer/enforcer-rules/index.html>

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

## jetty-maven-plugin
http://wiki.eclipse.org/Jetty/Feature/Jetty_Maven_Plugin

在进行 Web 开发的时候，打开浏览器对应用进行手动的测试几乎是无法避免的，这种测试方法通常就是将项目打包成 war 文件，然后部署到 Web 容器中，再启动容器进行验证，这显然十分耗时。为了帮助开发者节省时间，jetty-maven-plugin 应运而生，它完全兼容 Maven 项目的目录结构，能够周期性地检查源文件，一旦发现变更后自动更新到内置的 Jetty Web 容器中。做一些基本配置后（例如 Web 应用的 contextPath 和自动扫描变更的时间间隔），你只要执行 mvn jetty:run ，然后在 IDE 中修改代码，代码经 IDE 自动编译后产生变更，再由 jetty-maven-plugin 侦测到后更新至 Jetty 容器，这时你就可以直接测试 Web 页面了。需要注意的是，jetty-maven-plugin 并不是宿主于 Apache 或 Codehaus 的官方插件，因此使用的时候需要额外的配置 settings.xml 的 pluginGroups 元素，将 org.mortbay.jetty 这个 pluginGroup 加入。


更多的插件可以到这里查到：<http://maven.apache.org/plugins/index.html>

## reference

- <https://maven.apache.org/plugins/maven-compiler-plugin/index.html>
- <https://maven.apache.org/surefire/maven-surefire-plugin/index.html>
- <http://maven.apache.org/maven-release/maven-release-plugin/index.html>
- <http://maven.apache.org/enforcer/maven-enforcer-plugin/>
