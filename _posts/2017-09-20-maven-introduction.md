---
layout: post
title: "Maven 介绍"
tagline: ""
description: "项目管理工具 Maven"
category: 学习笔记
tags: [maven, java, build, management,  ]
last_updated:
---


Maven 是一个项目管理工具，主要用于项目构建，依赖管理，项目信息管理。自动化构建过程，从清理、编译、测试和生成报告、再到打包和部署。Maven 通过一小段描述信息来管理项目。

## Maven 安装
安装之前先把 JDK 环境配置好。

Debian/Ubuntu/Linux Mint 下

	sudo apt install maven

如果要手动安装则按照下面步骤，选择一个合适的版本

- 下载 Maven 最新安装包，地址 <http://maven.apache.org/download.cgi> 比如 apache-Maven-3.3.9-bin.tar.gz
- `tar zxvf apache-Maven-3.3.9-bin.tar.gz`
- 将 apache-Maven-3.3.9 目录移动到 /opt/ 目录 命令： `sudo mv apache-maven-3.3.9/ /opt/`
- 创建链接 `sudo ln -s /opt/apache-maven-3.3.9/ /opt/maven`
- root 身份修改配置命令 `sudo vi ~/.bashrc` 在文件最后添加：

		#set Maven environment
        #export Maven_OPTS="-Xms256m -Xmx512m"
        export M2_HOME=/opt/maven
        export M2=$M2_HOME/bin
        export PATH=$M2:$PATH

	保存并关闭。

- 使配置生效必须重启机器或者在命令行输入： source ~/.bashrc
- 查看 Maven 是否安装成功： `mvn -version`

如果进行了上面步骤在任意目录中 mvn 命令不能使用，可以在 `/etc/profile` 文件后面加入下面三行 `sudo vim ~/.bashrc`

然后输入以下内容

	Maven_HOME=/usr/local/apache-maven-3.3.9
	export Maven_HOME
	export PATH=${PATH}:${Maven_HOME}/bin

设置好 Maven 的路径之后，需要运行下面的命令 `source ~/.bashrc` 使刚刚的配置生效

## Maven 作用

Maven 最熟悉的一个概念就是 POM，Maven 项目会有一个 pom.xml 文件， 在这个文件里面添加相应配置，Maven 就会自动帮你下载相应 jar 包

    <dependency>
      <groupId>com.google.firebase</groupId>    项目名
      <artifactId>firebase-admin</artifactId>   项目模块
      <version>5.3.1</version>                  项目版本
    </dependency>

`项目名 - 项目模块 - 项目版本` 三个坐标定义了项目在 Maven 世界中的基本坐标，任何 jar，pom， war 都是基于这些坐标进行区分的。

- `groupId` 定义了项目组，组和项目所在组织或公司，或者开源项目名称，一般为公司域名反写，比如 com.google.firebase 等等。Maven 项目和实际项目并不一定是一对一关系，比如 SpringFramework 实际项目，对应的 Maven 项目会有很多，spring-core， spring-context 等等，更进一步推荐 groupId 应当定义项目隶属的实际项目，如果定义到组织或者公司，那么一个组织下可能会有很多实际项目，造成混乱
- `artifactId` 定义了 Maven 项目的名称，在组中的唯一 ID，在同一个项目中可能有不同的子项目，可以定义不同的 artifactId，可以理解为 Maven 项目的模块。artifactId 也是构建完成项目后生成的 jar 包或者 war 包的文件名的一部分。
- `version` 顾名思义，就是项目的版本号，如果项目维发布，一般在开发中的版本号习惯性加上 SNAPSHOT， 比如 1.0-SNAPSHOT

根据上面的例子，比如上面定义的 Maven 坐标，可以在对应的中央仓库中 `https://repo1.maven.org/maven2/com/google/firebase/firebase-admin/5.3.1/` 目录下找到对应的文件。

- `scope` 定义了依赖范围，如果依赖范围为 test ，那么该依赖只对测试有效，也就是说在测试代码中引入 junit 有效，在主代码中用 junit 会造成编译错误。如果不声明依赖范围则默认为 compile ，表示该依赖对主代码和测试代码都有效。

Maven 有以下几种依赖范围：

- **compile** 编译依赖，在编译、测试、运行时都有效
- **test** 测试依赖，只对于测试 classpath 有效， JUnit 典型
- **provided** 已提供依赖，只在编译和测试有效，运行时无效，servlet-api 编译和测试项目时需要该依赖，但是在运行项目时，由于容器已经提供，不需要 Maven 重复引入
- **runtime** 运行时依赖，对于测试和运行有效，编译主代码无效， JDBC 驱动实现，项目主代码编译只需要 JDK 提供的 JDBC 接口，只有执行测试或者运行项目才需要实现上述接口的具体 JDBC 驱动
- **system** 系统依赖范围，和 provided 范围依赖一致，但是使用 system 范围的依赖时必须通过 systemPath 元素显示地指定依赖文件的路径。
- **import** 导入依赖，一般不用

依赖范围和 classpath 的关系

依赖范围 Scope |   编译 classpath 有效  | 测试 classpath 有效   | 运行 classpath 有效 | 例子
--------------|-----------------------|---------------------|-----------------|--------
compile       | Y                     | Y                   | Y               | spring-core
test          | -                     | Y                   | -              | junit
provided      | Y                     | Y                   | -              | servlet-api
runtime       | -                     | -                   | Y             | JDBC 驱动
system        | Y                     | Y                   | -              | 本地的， Maven 仓库之外的类库


Maven 依赖调解  Dependency Mediation ，第一原则：**路径最近者优先**；第二原则：**第一声明者优先**。

SNAPSHOT 快照版本只应该在组织内部的项目或者模块之间的依赖使用，组织对于这些快照版本的依赖具有完全的理解和控制权。项目不应该依赖于任何组织外部的快照版本，由于快照的不稳定性，依赖会产生潜在的危险，即使项目构建今天是成功的，由于外部快照版本可能变化，而导致未来构建失败。

## Maven 核心概念 仓库
在上面介绍 Maven 的作用的时候提到了 Maven 的两个核心概念：坐标和依赖，这也是 Maven 首要解决的问题。这里要引入 Maven 另外一个核心概念：仓库。 Maven 时间中通过坐标来定位依赖，Maven 通过仓库来统一管理这些依赖。

Maven 项目的每一个构件对应着仓库的路径为： groupId/artifactId/version/artifactId-version.packageing

Maven 的仓库分为远程仓库和本地仓库，当第一次运行 Maven 命令时，需要网络连接，从远程仓库下载可用的依赖和插件。而当以后在运行 Maven 命令的时候，Maven 会自动先检查本地 `~/.m2/repository` 目录下的依赖，如果本地有缓存优先从本地获取，在找不到的情况下去远程仓库寻找。

常用的在线 maven 依赖查看网站

- <https://mvnrepository.com/>
- <http://repository.sonatype.org>
- <http://www.jarvana.com/jarvana>
- <http://www.mvnbrowser.com>

## Maven 核心概念 生命周期和插件

Maven 的生命周期是抽象的，实际行为都有插件完成。

### clean 生命周期

清理项目，包含三个阶段

- `pre-clean` 执行清理前需要完成的工作
- `clean` 清理上一次构建生成的文件
- `post-clean` 执行一次清理后需要完成的工作

### default 生命周期

定义了真正构建时所需要执行的步骤

- validate 验证工程是否正确，所有需要的资源是否可用。
- initialize
- generate-sources
- process-sources 主要资源文件
- generate-resources
- process-resources
- compile 编译主源码
- process-classed
- generate-test-sources
- process-test-sources 测试资源
- generate-test-resources
- process-test-resources
- test-compile 编译项目测试代码
- process-test-classes 已发布的格式，如 jar，将已编译的源代码打包
- prepare-package
- pre-integration-test 在集成测试可以运行的环境中处理和发布包
- post-integration-test
- verify 运行任何检查，验证包是否有效且达到质量标准。
- install 将包安装到 Maven 本地仓库，供本地 Maven 项目使用
- deploy 复制到远程仓库，供其他人使用


### site 生命周期

建立和发布项目站点

- pre-site 生成项目站点之前需要完成的工作
- site 生成站点文档
- post-site 生成之后
- site-deploy 生成的站点发布到服务器上

具体的流程可以参考下图

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/123681" title="Maven 生命周期"><img src="https://farm5.staticflickr.com/4421/37213878562_751cdb04e4_b.jpg" width="1020" height="1024" alt="Maven 生命周期"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## Maven 项目文件结构
下面是一个标准的 Maven 工程

	src/main/java - 存放项目.java 文件；
	src/main/resources - 存放项目资源文件；
	src/test/java - 存放测试类.java 文件；
	src/test/resources - 存放测试资源文件；
	target - 项目输出目录；
	pom.xml - Maven 核心文件（Project Object Model）；

## Maven 常用命令

	mvn archetype：create 创建 Maven 项目
	mvn compile 编译源代码
	mvn deploy 发布项目
	mvn test-compile 编译测试源代码
	mvn test 运行应用程序中的单元测试
	mvn site 生成项目相关信息的网站
	mvn clean 清除项目目录中的生成结果
	mvn package 根据项目生成的 jar
	mvn install 在本地 Repository 中安装 jar
	mvn eclipse:eclipse 生成 eclipse 项目文件
	mvn jetty:run 启动 jetty 服务
	mvn tomcat:run 启动 tomcat 服务
	mvn clean package -DMaven.test.skip=true 清除以前的包后重新打包，跳过测试类
	mvn clean package 清除以前的包后重新打包

## 简单例子
创建一个 Maven 项目

    mvn -B archetype:generate
		-DarchetypeGroupId=org.apache.maven.archetypes
		-DgroupId=com.log4j.maven
	    -DartifactId=dependency-example

## reference

- <http://maven.apache.org/>
- Maven 自动补全 <https://github.com/juven/maven-bash-completion>
- [Apache Maven 入门上](http://www.oracle.com/technetwork/cn/community/java/apache-maven-getting-started-1-406235-zhs.html)
- [Apache Maven 入门下](http://www.oracle.com/technetwork/cn/community/java/apache-maven-getting-started-2-405568-zhs.html)
- [Maven in 5 Minutes](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)
- [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/index.html#How_do_I_make_my_first_Maven_project)
- [Maven Tutorial](http://tutorials.jenkov.com/maven/maven-tutorial.html)
- <http://maven.apache.org/background/philosophy-of-maven.html>
