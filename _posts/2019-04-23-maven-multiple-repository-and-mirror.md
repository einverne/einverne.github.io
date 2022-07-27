---
layout: post
title: "Maven 多仓库和镜像配置"
aliases: "Maven 多仓库和镜像配置"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, repository, build-tools, java, ]
last_updated:
---

之前看 Maven 书的时候对于 Maven 本地配置没有好好研究。这下闲下来从 GitHub 上拉了一个项目来，发现使用单一的 mirror 仓库无法找到一些 jboss 的依赖，所以想起来研究一下 Maven 多仓库和镜像相关的配置。

都知道在 `$HOME/.m2/settings.xml` 中配置了 Maven 在本地的全局配置，可能对于某些公司内网，已经配置了公司或者内部私有的镜像。但是如果遇到镜像的中央仓库部分依赖不存在的情况，其实就需要依赖外部的仓库。

## 使用单一仓库
可能对于大部分的公司来说，强制使用了内网提供的单一仓库，force maven 使用单一仓库，mirror 所有请求到单一仓库。这个时候就要求这个单一仓库需要包含所有需要的 artifacts，或者需要设置代理去请求其他仓库，否则 maven 可能找不到某些构建。要做到单一仓库，设置 `mirrorOf` 到 `*`.

maven 2.0.5+ 以上版本支持：

    <settings>
      ...
      <mirrors>
        <mirror>
          <id>internal-repository</id>
          <name>Maven Repository Manager running on repo.mycompany.com</name>
          <url>http://repo.mycompany.com/proxy</url>
          <mirrorOf>*</mirrorOf>
        </mirror>
      </mirrors>
      ...
    </settings>

记住这里的 `mirrorOf` 中配置的星号 ，表示匹配所有的 artifacts，也就是 everything 使用这里的代理地址。这里的 mirrorOf 如果配置了具体的名字，指的是 repository 的名字，继续往下看。

## multiple repository config
设置多仓库有两种方法，第一种直接在**项目**层级 POM 中定义：

    <project>
    ...
      <repositories>
        <repository>
          <id>my-repo1</id>
          <name>your custom repo</name>
          <url>https://maven.aliyun.com/repository/public</url>
        </repository>
        <repository>
          <id>my-repo2</id>
          <name>your custom repo</name>
          <url>https://maven.aliyun.com/repository/public</url>
        </repository>
      </repositories>
    ...
    </project>

这里的 id 就是 mirrorOf 要使用的 ID。

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
             <url>https://maven.aliyun.com/repository/public</url>
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

别忘了激活 profile，或者也可以使用 mvn 参数来指定：

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


## 设置镜像 {#mirror}

设置镜像的作用是为了加快依赖包的下载速度，理论上来说如果一个仓库 B 可以提供仓库 A 所有的内容，那么可以认为 B 是 A 的一个镜像，比如说 [阿里提供了很多仓库的镜像](https://help.aliyun.com/document_detail/102512.html) 使用这些镜像可以提高下载速度。

    <mirror>
	      <!-- 唯一标识一个 mirror -->
          <id>mirror</id>
		  <!-- 代表一个镜像的替代位置，例如 central 就表示代替官方的中央库 -->
          <mirrorOf>external:*,!repo</mirrorOf>
          <name>nexus repository</name>
          <url>https://maven.aliyun.com/repository/public</url>
    </mirror>

配置说明：

- `id`: 镜像的唯一标识
- `mirrorOf`: 指定镜像规则，什么情况下从镜像仓库拉取，[官方文档](https://maven.apache.org/guides/mini/guide-mirror-settings.html)
    - `*`: 匹配所有，所有内容都从镜像拉取
    - `external:*`: 除了本地缓存的所有从镜像仓库拉取
    - `repo,repo1`: repo 或者 repo1 ，这里的 repo 指的仓库 ID
    - `*,!repo1`: 除了 repo1 的所有仓库

- `name`: 名称描述
- `url`: 地址

## 使用场景

Maven 设置中的 `mirror` 和 `repository` 概念比较容易混淆，一般来说 repository 用来配置远程仓库的地址，mirror 则是作为中央仓库的镜像配置。

所以，当我的需求是，比如在内部远程仓库无法找到依赖时，从外部仓库中下载。那么我要做的就是配置多个 repository，那么当 maven 寻找依赖时就会按照配置的 repository 从上往下依次尝试下载。

	<settings>
		<mirrors>
		</mirrors>
		<profiles>
			<profile>
				<id>aliyun</id>
				<repositories>
					<repository>
						<id>aliyun</id>
						<url>https://maven.aliyun.com/repository/public</url>
						<releases><enabled>true</enabled></releases>
						<snapshots><enabled>true</enabled></snapshots>
					</repository>
				</repositories>
				<pluginRepositories>
					<pluginRepository>
						<id>aliyun</id>
						<url>https://maven.aliyun.com/repository/public</url>
						<releases><enabled>true</enabled></releases>
						<snapshots><enabled>true</enabled></snapshots>
					</pluginRepository>
				</pluginRepositories>
			</profile>
			<profile>
				<id>nexus-163</id>
				<repositories>
					<repository>
						<id>nexus-163</id>
						<name>Nexus 163</name>
						<url>http://mirrors.163.com/maven/repository/maven-public/</url>
						<layout>default</layout>
						<snapshots>
							<enabled>false</enabled>
						</snapshots>
						<releases>
							<enabled>true</enabled>
						</releases>
					</repository>
				</repositories>
				<pluginRepositories>
					<pluginRepository>
						<id>nexus-163</id>
						<name>Nexus 163</name>
						<url>http://mirrors.163.com/maven/repository/maven-public/</url>
						<snapshots>
							<enabled>false</enabled>
						</snapshots>
						<releases>
							<enabled>true</enabled>
						</releases>
					</pluginRepository>
				</pluginRepositories>
			</profile>
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
		<activeProfiles>
			<activeProfile>aliyun</activeProfile>
			<activeProfile>jboss</activeProfile>
		</activeProfiles>

		<servers>
			<server>
				<id>archiva.internal</id>
				<username>username</username>
				<password></password>
			</server>
			<server>
				<id>archiva.snapshots</id>
				<username>username</username>
				<password></password>
			</server>
		</servers>
	</settings>

mirror 与 repository 不同的是，假如配置同一个 repository 多个 mirror 时，相互之间是备份关系，只有当仓库连不上时才会切换到另一个，而如果能连上但是找不到依赖时是不会尝试下一个 mirror 地址的。

## reference

- <https://maven.apache.org/guides/mini/guide-mirror-settings.html>
