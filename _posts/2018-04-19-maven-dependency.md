---
layout: post
title: "Maven 依赖管理"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, build, java, linux]
last_updated: 
---


dependencyManagement 主要有两个作用

- 集中管理项目的依赖项
- 控制使用的依赖项的版本


使用 dependencyManagement 声明依赖，并不引入，因此子项目需要显示声明需要用的依赖

- 如果不在子项目中声明依赖，是不会从父项目中继承下来的
- 只有在子项目中写了该依赖项，并且没有指定具体版本，才会从父项目中继承该项，并且version和scope都读取自父pom
- 如果子项目中指定了版本号，那么会使用子项目中指定的jar版本

dependencies 即使在子项目中不写该依赖项，那么子项目仍然会从父项目中继承该依赖项。父工程使用 dependencyManagement 假引用，目的是管理版本号。dependencies 用于实际上需要引入的工程，这些工程如果继承于父工程会找到对应的版本号。


maven中的仓库分为两种，snapshot快照仓库和release发布仓库。snapshot快照仓库用于保存开发过程中的不稳定版本，release正式仓库则是用来保存稳定的发行版本。定义一个组件/模块为快照版本，只需要在pom文件中在该模块的版本号后加上-SNAPSHOT即可(注意这里必须是大写)




在distributionManagement段中配置的是snapshot快照库和release发布库的地址

配置完成后就可以通过mvn deploy进行发布了

那么还需要在maven的settings.xml文件中做如下配置：
<server>  
  <id>nexus-releases</id>  
  <username>admin</username>  
  <password>admin123</password>  
</server>  
  
<server>  
  <id>nexus-snapshots</id>  
  <username>admin</username>  
  <password>admin123</password>  
</server>  




