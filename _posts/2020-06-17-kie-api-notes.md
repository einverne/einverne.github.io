---
layout: post
title: "KIE API 学习笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [kie, drools, jbpm, decision-table, score-card,]
last_updated:
---


Kie have these concepts which every user need to know.

## KieService
KieService 允许创建 KieContainer

## KieContainer
KieContainer 是所有给定 KieModule 的 KieBases 的集合。

KieContainer 可以加载 KieModule 和其依赖，KieContainer 可以拥有一个或者多个 KieBases.

## KieModule
KieModule 在 `org.kie.api.builder` 包下，KieModule 是一个存放所有定义好的 KieBases 资源的容器，和 `pom.xml` 文件相似，定义了其 ReleaseId, `kmodule.xml` 文件定义了 `KieBase` 的名字，配置，以及其他用来创建 KieSession 的资源，以及其他用来 build KIEBases 的资源。

KieModule 用来定义多个 KieBases 和 KieSessions。KieModule 可以包含其他 KieModules.

## KieBase
KieBase 是应用所有定义好的 Knowledge 合集，包括了 rules（规则）, processes（流程）, functions（方法）, type models, KieBase 自身不包含任何运行时数据，sessions 可以从 KieBase 中创建，然后运行时数据可以被装入，并且通过 sessions 可以启动一个流程。

KieBase 代表着编译好的资源的版本，可以有 Stateless 和 Stateful Session，一个典型的使用场景是为一个 packages 使用一个 KieBase ，另一个 package 使用另一个 KieBase.

## KieSession
KieSession 是和工作流引擎交互的最常用的方式，KieSession 允许应用建立和引擎的交互，session 的状态会在每一次调用的时候保存下来。而流程会在一组相同的变量上触发多次。当应用完成调用，必须调用 `dispose()` 来释放资源以及使用的内存。

	KieServices kieServices = KieServices.Factory.get();
	KieContainer kContainer = kieServices.getKieClasspathContainer();
	KieSession kSession = kContainer.newKieSession();

	for( Object fact : facts ) {
		kSession.insert( fact );
	}
	kSession.fireAllRules();
	kSession.dispose();

每一个 KieBase 都可以有一个或者多个 KieSessions.

## KieBuilder

KieBuilder is a builder for the resources contained in a KieModule

## reference

- <https://stackoverflow.com/a/46350243/1820217>
