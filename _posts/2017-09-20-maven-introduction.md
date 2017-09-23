---
layout: post
title: "Maven 介绍"
tagline: ""
description: ""
category: 
tags: [maven, Java, build]
last_updated: 
---


Maven 是一个项目管理工具，主要用于项目构建，依赖管理，项目信息管理。自动化构建过程，从清理、编译、测试和生成报告、再到打包和部署。

## Maven 安装
安装之前先把 JDK 环境配置好。

Debian/Ubuntu/Linux Mint 下

	sudo apt install maven

如果要手动安装则按照下面步骤

- 下载Maven最新安装包，地址 <http://Maven.apache.org/download.cgi> 比如 apache-Maven-3.3.9-bin.tar.gz
- `tar -zxvf apache-Maven-3.3.9-bin.tar.gz`
- 将 apache-Maven-3.3.9 目录移动到 /usr/local 目录 命令： `sudo mv apache-maven-3.3.9/ /usr/local/`
- root身份修改配置命令 `sudo vi ~/.bashrc` 在文件最后添加：

		#set Maven environment
		M2_HOME=/usr/local/apache-maven-3.3.9
		export Maven_OPTS="-Xms256m -Xmx512m"
		export PATH=$M2_HOME/bin:$PATH
	
	保存并关闭。

- 使配置生效必须重启机器或者在命令行输入： source ~/.bashrc
- 查看Maven是否安装成功： mvn -version

如果进行了上面步骤在任意目录中mvn命令不能使用，可以在 `/etc/profile` 文件后面加入下面三行 `sudo vim ~/.bashrc`

然后输入以下内容

	Maven_HOME=/usr/local/apache-maven-3.3.9
	export Maven_HOME
	export PATH=${PATH}:${Maven_HOME}/bin

设置好Maven的路径之后，需要运行下面的命令 source ~/.bashrc 使刚刚的配置生效

## Maven 有什么作用

Maven 项目会有一个 pom.xml 文件， 在这个文件里面添加相应配置，Maven 就会自动帮你下载相应 jar 包

    <dependency> 
      <groupId>junit</groupId>  项目名
      <artifactId>junit</artifactId>  项目模块  
      <version>3.8.1</version>  项目版本
	  <scope>test</scope>
    </dependency>

项目名-项目模块-项目版本 三个坐标定义了项目在 Maven 世界中的基本坐标，任何 jar，pom， war 都是基于这些坐标进行区分的。

groupId 定义了项目组，组和项目所在组织或公司存在关联，一般为公司域名反写，比如 com.google.firebase 等等

artifactId 定义了 Maven 项目在组中的唯一 ID，在同一个项目中可能有不同的子项目，可以定义不同的 artifactId

version 顾名思义，就是项目的版本号，一般在开发中的版本号习惯性加上 1.0-SNAPSHOT

scope 定义了依赖范围，如果依赖范围为 test ，那么该依赖只对测试有效，也就是说在测试代码中引入 junit 有效，在主代码中用 junit 会造成编译错误。如果不声明依赖范围则默认为 compile ，表示该依赖对主代码和测试代码都有效。

Maven 有以下几种依赖范围：

- **compile** 编译依赖， 在编译、测试、运行都有效
- **test** 测试依赖，只对于测试 classpath 有效， JUnit 典型
- **provided** 已提供依赖，只在编译和测试有效，运行时无效， servlet-api 编译和测试项目时需要该依赖，但是在运行项目时，由于容器已经提供，不需要 Maven 重复引入
- **runtime** 运行时依赖，对于测试和运行有效，编译主代码无效， JDBC驱动实现，项目主代码编译只需要JDK提供的JDBC接口，只有执行测试或者运行项目才需要实现上述接口的具体JDBC驱动
- **system** 系统依赖范围，和 provided 范围依赖一致，但是使用 system 范围的依赖时必须通过 systemPath 元素显示地指定依赖文件的路径。

## Maven 核心概念 仓库
在上面介绍 Maven 的作用的时候提到了Maven 的两个核心概念：坐标和依赖，这也是 Maven 首要解决的问题。这里要引入 Maven 另外一个核心概念：仓库。 Maven 时间中通过坐标来定位依赖，Maven 通过仓库来统一管理这些依赖。

Maven 项目的每一个构件对应着仓库的路径为： groupId/artifactId/version/artifactId-version.packageing . 


## Maven 核心概念 生命周期和插件
Maven 的生命周期是抽象的，实际行为都有插件完成。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/123681" title="Maven 生命周期"><img src="https://farm5.staticflickr.com/4421/37213878562_751cdb04e4_b.jpg" width="1020" height="1024" alt="Maven 生命周期"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## Maven 项目文件结构
下面是一个标准的 Maven 工程

	src/main/java - 存放项目.java文件；
	src/main/resources - 存放项目资源文件；
	src/test/java - 存放测试类.java文件；
	src/test/resources - 存放测试资源文件；
	target - 项目输出目录；
	pom.xml - Maven核心文件（Project Object Model）；

## Maven 常用命令

	mvn archetype：create 创建Maven项目
	mvn compile 编译源代码
	mvn deploy 发布项目
	mvn test-compile 编译测试源代码
	mvn test 运行应用程序中的单元测试
	mvn site 生成项目相关信息的网站
	mvn clean 清除项目目录中的生成结果
	mvn package 根据项目生成的jar
	mvn install 在本地Repository中安装jar
	mvn eclipse:eclipse 生成eclipse项目文件
	mvnjetty:run 启动jetty服务
	mvntomcat:run 启动tomcat服务
	mvn clean package -DMaven.test.skip=true 清除以前的包后重新打包，跳过测试类
	mvn clean package 清除以前的包后重新打包




## reference

- <http://maven.apache.org/>
- Maven 自动补全 <https://github.com/juven/maven-bash-completion>
- [Apache Maven 入门上](http://www.oracle.com/technetwork/cn/community/java/apache-maven-getting-started-1-406235-zhs.html)
- [Apache Maven 入门下](http://www.oracle.com/technetwork/cn/community/java/apache-maven-getting-started-2-405568-zhs.html)
- [Maven in 5 Minutes](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)
- [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/index.html#How_do_I_make_my_first_Maven_project)
- [Maven Tutorial](http://tutorials.jenkov.com/maven/maven-tutorial.html)
