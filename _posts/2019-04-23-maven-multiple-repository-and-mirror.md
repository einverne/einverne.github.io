---
layout: post
title: "Maven 多仓库和镜像配置"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, repository, build-tools, java, ]
last_updated:
---

## 多仓库配置
设置多仓库有两种方法，第一种直接在项目 POM 中定义

    <project>
    ...
      <repositories>
        <repository>
          <id>my-repo1</id>
          <name>your custom repo</name>
          <url>http://jarsm2.dyndns.dk</url>
        </repository>
        <repository>
          <id>my-repo2</id>
          <name>your custom repo</name>
          <url>http://jarsm2.dyndns.dk</url>
        </repository>
      </repositories>
    ...
    </project>

这里的 id 就是 mirrorOf 使用的 ID。

第二种方法是在 `~/.m2/settings.xml` 文件中全局修改。

    <settings>
     ...
     <profiles>
       ...
       <profile>
         <id>myprofile</id>
         <repositories>
           <repository>
             <id>my-repo2</id>
             <name>your custom repo</name>
             <url>http://jarsm2.dyndns.dk</url>
           </repository>
           ...
         </repositories>
       </profile>
       ...
     </profiles>

     <activeProfiles>
       <activeProfile>myprofile</activeProfile>
     </activeProfiles>
     ...
    </settings>

别忘了激活 profile，或者也可以使用 mvn 参数

    mvn -Pmyprofile ...


这里提供一下 jboss 官方的配置

    <profiles>
        <profile>
          <id>jboss</id>
          <repositories>
            <repository>
              <id>jboss-public-repository-group</id>
              <name>JBoss Public Maven Repository Group</name>
              <url>https://repository.jboss.org/nexus/content/groups/public-jboss/</url>
              <layout>default</layout>
              <releases>
                <enabled>true</enabled>
                <updatePolicy>never</updatePolicy>
              </releases>
              <snapshots>
                <enabled>true</enabled>
                <updatePolicy>never</updatePolicy>
              </snapshots>
            </repository>
          </repositories>
          <pluginRepositories>
            <pluginRepository>
              <id>jboss-public-repository-group</id>
              <name>JBoss Public Maven Repository Group</name>
              <url>https://repository.jboss.org/nexus/content/groups/public-jboss/</url>
              <layout>default</layout>
              <releases>
                <enabled>true</enabled>
                <updatePolicy>never</updatePolicy>
              </releases>
              <snapshots>
                <enabled>true</enabled>
                <updatePolicy>never</updatePolicy>
              </snapshots>
            </pluginRepository>
          </pluginRepositories>
        </profile>
    </profiles>


[官方文档](https://maven.apache.org/guides/mini/guide-multiple-repositories.html)

## 设置镜像

设置镜像的作用是为了加快下载速度，理论上来说任何一个仓库 B 可以提供仓库 A 所有的内容，那么可以认为 B 是 A 的一个镜像，比如说 [阿里提供了很多仓库的镜像](https://help.aliyun.com/document_detail/102512.html) 使用这些镜像可以提高下载速度。

    <mirror>
          <id>mirror</id>
          <mirrorOf>external:*,!repo</mirrorOf>
          <name>nexus repository</name>
          <url>http://nexus.xxx/repository/maven-proxy</url>
    </mirror>

说明：

- `id` 唯一标识
- `mirrorOf` 指定镜像规则，什么情况下从镜像仓库拉取，[官方文档](https://maven.apache.org/guides/mini/guide-mirror-settings.html)
    - `*` 匹配所有
    - `external:*` 除了本地缓存的所有仓库
    - `repo,repo1` repo 或者 repo1 ，这里的 repo 指的仓库 ID
    - `*,!repo1` 除了 repo1 的所有仓库

- `name` 名称描述
- `url` 地址

## 使用场景
大部分情况下公司或者自用都会自建 nexus 仓库，那么首先 profile 中会配置需要的远程仓库，比如 id 为 `repo` url 为 `http://nexus.xxx.xxx` 那么可以在 mirror 中配置 mirrorOf

    <mirrorOf>repo</mirrorOf>
    <url>指向你自己的搭的代理</url>

这样对 repo 的所有请求都会转发给你自己的 Nexus。

mirrorOf 也有很多其他的语法，可以参考上面。
