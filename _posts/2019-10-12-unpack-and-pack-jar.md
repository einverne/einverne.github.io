---
layout: post
title: "解压和打包 jar 并手动上传到 Nexus 记录"
tagline: ""
description: ""
category: 经验总结
tags: [nexus, jar, maven, java, ]
last_updated:
---

解压和打包 jar 包，使用如下的方式。

unpack

	jar xf filename.jar

pack

	jar cf filename.jar path/to/dir


## 手动上传到 nexus

将打包好的 jar 包上传到 Nexus

	mvn deploy:deploy-file -DgroupId=my.group.id \
		-DartifactId=my-artifact-id \
		-Dversion=1.0.1 \
		-Dpackaging=jar \
		-Dfile=realfilename.jar \
		-DgeneratePom=true \
		-DrepositoryId=my-repo \
		-Durl=http://my-nexus-server.com:8081/repository/maven-releases/

记住这里的 repositoryId 一定是 `~/.m2/settings.xml` 文件中的 ID， 另外 url 也要区分一下 releases 和 snapshots.

	<servers>
	  <server>
		<id>my-repo</id>
		<username>admin</username>
		<password>admin123</password>
	  </server>
	</servers>


## reference

- <https://stackoverflow.com/a/39757111/1820217>
