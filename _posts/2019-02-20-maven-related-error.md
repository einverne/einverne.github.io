---
layout: post
title: "maven 相关的错误"
tagline: ""
description: ""
category: 经验总结
tags: [maven, error, ]
last_updated:
---


## deploy 遇到 400 错误

错误日志

    [ERROR] Failed to execute goal org.apache.maven.plugins:maven-deploy-plugin:2.7:deploy (default-deploy) on project xxxx: Failed to deploy artifacts: Could not transfer artifact xxx:pom:1.0.1 from/to archiva.internal (http://nexus.xxx/nexus/content/repositories/releases/): Failed to transfer file: http://nexus.xxx/nexus/content/repositories/releases/xxx.pom. Return code is: 400, ReasonPhrase: Bad Request. -> [Help 1]

在 deploy 正式版本时，一般遇到 400 错误，去 Nexus 上看下是否版本已经存在，因为正式的版本不允许覆盖。
