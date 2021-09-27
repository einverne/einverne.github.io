---
layout: post
title: "Maven 插件"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, java, build, management, build-tool]
last_updated:
---

Maven 本质上是一个插件框架，它的核心并不执行任何具体的构建任务，而是将所有任务都交给插件来完成，例如编译源代码是由 `maven-compiler-plugin` 完成的。进一步说，每个任务对应了一个插件目标（goal），每个插件会有一个或者多个目标，例如 `maven-compiler-plugin` 的 compile 目标用来编译位于 `src/main/java/` 目录下的主源码，`testCompile` 目标用来编译位于 `src/test/java`/ 目录下的测试源码。

## maven-source-plugin
[[maven-source-plugin]] 打包插件，会根据当前的源码文件创建 jar 包。默认情况下 jar 文件会在项目 target 目录下。

如果没有进行特殊配置，maven 会按照标准接口查找和处理各种类型文件。一个标准的 maven 项目

    ├── project.iml
    ├── pom.xml
    ├── src
    │   ├── main
    │   │   ├── java
    │   │   └── resources
    │   └── test
    │       ├── java
    │       └── resources
    └── target
        ├── classes
        │   └── info
        ├── generated-sources
        │   └── annotations
        ├── generated-test-sources
        │   └── test-annotations
        └── test-classes


`src/main/java` 和 `src/test/java` 中的所有 `*.java` 文件都会在 Maven 的 compile 和 test-compile 阶段被编译，结果会分别放到 `target/classes` 和 `target/test-classes` 目录中。

`src/main/resources` 和 `src/test/resources` 这两个目录的文件也会被复制到 `target/classes` 和 `target/test-classes` 目录中。打包插件默认会将 `target/classes` 中的所有内容打包到 jar 包或者 war 包中。

如果想要 deploy 阶段跳过 sources.jar ，可以在命令中使用：[^skip-source]

    -Dmaven.source.skip

如果可以修改 POM，可以使用如下配置不生成 sources.jar 文件：

```
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-source-plugin</artifactId>
    <version>2.2.1</version>
    <configuration>
      <skipSource>true</skipSource>
    </configuration>
  </plugin>
```



[^skip-source]: <https://maven.apache.org/plugins/maven-source-plugin/jar-mojo.html>



## maven-archetype-plugin
Archetype 插件允许用户从模板中创建 Maven 项目，该插件需要 Java 6 及以上版本。[^1]

[^1]: <http://maven.apache.org/archetype/maven-archetype-plugin/index.html>



## maven-compiler-plugin
compiler 插件是最常用到的一个，定义 build 的 Java 版本，编译 Java 代码。

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

## maven-dependency-plugin
maven-dependency-plugin 是处理依赖相关的插件，该插件有很多 goal，常用的比如 `mvn dependency:tree`， `mvn dependency:analyze` 等等。该插件方便用来排查依赖相关的问题。

    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-dependency-plugin</artifactId>
        <version>2.8</version>
    </plugin>

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
在一个稍大一点的组织或团队中，你无法保证所有成员都熟悉 Maven，那他们做一些比较愚蠢的事情就会变得很正常，例如给项目引入了外部的 SNAPSHOT 依赖而导致构建不稳定，使用了一个与大家不一致的 Maven 版本而经常抱怨构建出现诡异问题。maven-enforcer-plugin 能够帮助你避免之类问题，它允许你创建一系列规则强制所有使用者遵守，包括设定 Java 版本、设定 Maven 版本、禁止某些有漏洞的依赖、禁止 SNAPSHOT 依赖等等。只需要在一个父 POM 配置规则，然后各项目继承，当规则遭到破坏的时候，Maven 就会无法编译并抛出相应的错误。除了标准的规则之外，你还可以扩展该插件，编写自己的规则。`maven-enforcer-plugin` 的 enforce 目标负责检查规则，它默认绑定到[[Maven 生命周期]]的 validate 阶段。

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
- 检查自己的 maven 的 `settings.xml` 是否包含了私服的用户名密码；
- 确保自己本地代码是在主分支，并且是最新的副本；
- 执行 `mvn release:prepare`, 这时插件会扫描项目依赖查看是否有 SNAPSHOT, 是否存在未提交的文件，确定当前 release 的版本号和下一个迭代的版本号，插件会运行单元测试，并向 git 中提交两次 commit, 一次是 release 版本，一次是下一个迭代的版本。并将当前 release 版本打一个 tag 并提交到 git 上面去；
- 执行 `mvn release:perform`, 插件会执行 `mvn deploy` 操作，并 clean 掉生成的缓存文件。

pom 设置：

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

## Apache Maven Checkstyle Plugin
[[maven-checkstyle-plugin]]
引入 pom

    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-checkstyle-plugin</artifactId>
        <version>3.0.0</version>
        <executions>
            <execution>
                <id>validate</id>
                <phase>validate</phase>
                <configuration>
                    <configLocation>checkStyle.xml</configLocation>
                    <encoding>UTF-8</encoding>
                    <consoleOutput>true</consoleOutput>
                    <failsOnError>true</failsOnError>
                    <includeTestSourceDirectory>true</includeTestSourceDirectory>
                </configuration>
                <goals>
                    <goal>check</goal>
                </goals>
            </execution>
        </executions>
    </plugin>

用来检查代码规范。

- <https://maven.apache.org/plugins/maven-checkstyle-plugin/>

## jetty-maven-plugin

http://wiki.eclipse.org/Jetty/Feature/Jetty_Maven_Plugin

在进行 Web 开发的时候，打开浏览器对应用进行手动的测试几乎是无法避免的，这种测试方法通常就是将项目打包成 war 文件，然后部署到 Web 容器中，再启动容器进行验证，这显然十分耗时。为了帮助开发者节省时间，jetty-maven-plugin 应运而生，它完全兼容 Maven 项目的目录结构，能够周期性地检查源文件，一旦发现变更后自动更新到内置的 Jetty Web 容器中。做一些基本配置后（例如 Web 应用的 contextPath 和自动扫描变更的时间间隔），你只要执行 mvn jetty:run ，然后在 IDE 中修改代码，代码经 IDE 自动编译后产生变更，再由 jetty-maven-plugin 侦测到后更新至 Jetty 容器，这时你就可以直接测试 Web 页面了。需要注意的是，jetty-maven-plugin 并不是宿主于 Apache 或 Codehaus 的官方插件，因此使用的时候需要额外的配置 settings.xml 的 pluginGroups 元素，将 org.mortbay.jetty 这个 pluginGroup 加入。


更多的插件可以到这里查到：<http://maven.apache.org/plugins/index.html>

## maven-git-commit-id-plugin
这不是一个官方的插件，实现的功能是能够在打包的二进制文件中关联 git 代码的版本。

地址：

- <https://github.com/ktoso/maven-git-commit-id-plugin>

maven 项目构建项目，打包成 jar 时，默认情况是 名字加上版本号，通过这个插件可以在命名的时候再增加一个 git 版本号，比如

    com-einverne-api-1.0.0-SNAPSHOT-b31229dd.jar


    <build>
        <plugins>
            <plugin>
                <groupId>pl.project13.maven</groupId>
                <artifactId>git-commit-id-plugin</artifactId>
                <version>2.2.4</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>revision</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <verbose>true</verbose>
                    <generateGitPropertiesFile>true</generateGitPropertiesFile>
                    <injectAllReactorProjects>true</injectAllReactorProjects>
                    <!-- git 描述， JGIT 提供 -->
                    <gitDescribe>
                        <!-- 是否生成描述属性 -->
                        <skip>false</skip>
                        <!-- 提交操作未发现 tag 时，仅打印提交操作 ID,-->
                        <always>false</always>
                        <!-- 提交操作 ID 显式字符长度，最大值为：40; 默认值：7;
                            0 代表特殊意义；后面有解释；
                        -->
                        <abbrev>7</abbrev>
                        <!-- 构建触发时，代码有修改时（即"dirty state"), 添加指定后缀；默认值："";-->
                        <dirty>-dirty</dirty>
                        <!--always print using the "tag-commits_from_tag-g_commit_id-maybe_dirty" format, even if "on" a tag.
                            The distance will always be 0 if you're "on" the tag.
                        -->
                        <forceLongFormat>false</forceLongFormat>
                    </gitDescribe>
                </configuration>
            </plugin>
        </plugins>
    </build>

说明：

- `dotGitDirectory` 默认值为 `${project.basedir}/.git`，表示 `.git` 文件夹路径，可以自定义 `${project.basedir}/../.git`
- `failOnNoGitDirectory` 默认值：true，`.git` 文件夹未找到时，构建是否失败；若设置 true, 则构建失败；若设置 false, 则跳过执行该目标

更多详细的设置可以参考[这里](https://github.com/git-commit-id/maven-git-commit-id-plugin/blob/master/docs/using-the-plugin.md)

## appassembler-maven-plugin
Mojo Appassembler

主要作用是将 Java 程序打包成单一可执行程序，以往编写单一的可执行的 Java 程序可能非常复杂。The Application Assembler Plugin 是一个用来生成直接启动 Java 程序脚本的 Maven 插件。所有的依赖和构建都会被放到一个定义好的 assemble 目录中，所有的依赖都会在脚本中添加到 classpath 中。

### Goals

- appassembler:assemble Assembles the artifacts and generates bin scripts for the configured applications.
- appassembler:create-repository Creates an appassembler repository.
- appassembler:generate-daemons Generates JSW based daemon wrappers.

### Usages

如果直接使用 mvn 命令

    mvn archetype:generate \
      -DarchetypeGroupId=org.apache.maven.archetypes \
      -DarchetypeArtifactId=maven-archetype-quickstart \
      -DgroupId=com.mycompany.app \
      -DartifactId=my-app \
      -Dversion=1.0-SNAPSHOT

或者定义到 pom 文件中

    <project>
      ...
      <build>
        <plugins>
          <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>appassembler-maven-plugin</artifactId>
            <version>1.10</version>
            <configuration>
              <programs>
                <program>
                  <mainClass>com.mycompany.app.App</mainClass>
                  <id>app</id>
                </program>
              </programs>
            </configuration>
          </plugin>
        </plugins>
      </build>
    </project>

然后使用生成的脚本

    $ mvn package appassembler:assemble
    ...
    $ sh target/appassembler/bin/app
    Hello World!

其他更多的控制选项可以参考[这里](https://www.mojohaus.org/appassembler/appassembler-maven-plugin/assemble-mojo.html)


## reference

- <http://maven.apache.org/archetype/maven-archetype-plugin/index.html>
- <https://maven.apache.org/plugins/maven-compiler-plugin/index.html>
- <https://maven.apache.org/surefire/maven-surefire-plugin/index.html>
- <http://maven.apache.org/maven-release/maven-release-plugin/index.html>
- <http://maven.apache.org/enforcer/maven-enforcer-plugin/>
