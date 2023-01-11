---
layout: post
title: "Maven 中的 classifier"
aliases: 
- "Maven 中的 classifier"
tagline: ""
description: ""
category: 学习笔记
tags: [ maven, build-tool, java,  ]
last_updated: 2023-01-11 12:50:57
create_time: 2021-01-29 09:57:11
---

今天看 `maven-embedder` 中定义的引用 [[Google Guice 轻量级依赖注入]] 依赖时，定义了 `classifier` 标签。故来学习一下 Maven 配置中 classifier 的含义。

首先来看两个例子：

```
<dependency>
    <groupId>net.sf.json-lib</groupId>
    <artifactId>json-lib</artifactId>
    <version>2.2.2</version>
    <classifier>jdk15</classifier>
</dependency>

<dependency>
    <groupId>net.sf.json-lib</groupId>
    <artifactId>json-lib</artifactId>
    <version>2.2.2</version>
    <classifier>jdk13</classifier>
</dependency>
```

实际上 Maven 会去寻找的是 json-lib-2.2.2-jdk15.jar 和 json-lib-2.2.2-jdk13.jar 这两个 jar 包。

回到正题：

```
    <dependency>
       <groupId>com.google.inject</groupId>
       <artifactId>guice</artifactId>
       <version>4.2.1</version>
       <classifier>no_aop</classifier>
     </dependency>
```

classifier 用于区分从项目不同的组成部分，源代码、javadoc，类文件等等。

这是一个可选项，当存在时，会附加到 artifact 名字和版本后面。最终的 jar 包会是 `guice-4.2.1-no_aop.jar`

![maven classifier](https://photo.einverne.info/images/2023/01/11/ggyd.png)

## Build different classified version

如果要在构建的时候构建不同的包，可以使用 `maven-jar-plugin` 插件，然后也是通过 classifier 来区分。

```
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-jar-plugin</artifactId>
   <version>3.0.2</version>
   <configuration>
       <classifier>${classifier}</classifier>
   </configuration>
</plugin>
```

引用的时候指定不同的 `classifier` 就行了。

## Deploy an artifact with classifier

通过手动执行命令来 deploy

```
mvn org.apache.maven.plugins:maven-deploy-plugin:3.0.0:deploy-file -Durl=http://localhost:8081/repomanager/ \
                                                                            -DrepositoryId=some.id \
                                                                            -Dfile=path/to/artifact-name-1.0.jar \
                                                                            -DpomFile=path-to-your-pom.xml \
                                                                            -Dfiles=path/to/artifact-name-1.0-debug.jar,path/to/site.pdf \
                                                                            -Dclassifiers=debug,site \
                                                                            -Dtypes=jar,pdf
```

通过 `classifiers` 来指定。

## reference

- <https://maven.apache.org/plugins/maven-deploy-plugin/examples/deploying-with-classifiers.html>
