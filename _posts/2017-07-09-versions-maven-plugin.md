---
layout: post
title: "Versions maven plugin"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, versions, maven-plugin, ]
last_updated:
---

Versions Plugin 该插件用于需要管理项目 POM 的 artifacts 的版本时。

## versions:set
用来设置版本号

    mvn versions:set -DnewVersion=1.0.1

如果需要回滚

    mvn versions:revert

确认则使用

    mvn versions:commit

## reference

- <http://www.mojohaus.org/versions-maven-plugin/index.html>
