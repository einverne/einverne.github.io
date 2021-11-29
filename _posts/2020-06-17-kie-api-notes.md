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
通过如下方式产生 KieServices：

    KieServices ks = KieServices.Factory.get();
    
KieService 可以用来创建 KieContainer。

KieContainer 定义了规则的范围。

## KieContainer
KieContainer 是所有给定 KieModule 的 KieBases 的集合。

KieContainer 承载了 KieModule 和其依赖，一个层级的 KieModules 结构可以被加载到一个 KieContainer 实例中。

KieContainer 可以拥有一个或者多个 KieBases.

![kie container hierarchical structure](/assets/kie-container-hierarchical-structure-20210225105827.png)

KieContainer 可以通过 KieService 产生：

    KieContainer kContainer = ks.newKieClasspathContainer();

## KieModule
每一个 KieModule 包含了 business assets(包括了流程，规则，决策表等等)。

一个 KieModule 是一个标准的 Java-Maven 项目。

KieModule 在 `org.kie.api.builder` 包下，KieModule 是一个存放所有定义好的 KieBases 资源的容器，和 `pom.xml` 文件相似，定义了其 ReleaseId, `kmodule.xml` 文件定义了 `KieBase` 的名字，配置，以及其他用来创建 KieSession 的资源，以及其他用来 build KIEBases 的资源。

指定的文件 `kmodule.xml` 定义在 `META-TNF/` 目录下，一定了内部的资源如何分组如何配置等等信息。

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

## KieSession 是否是线程安全的

KieContainer 是线程安全的。

`KieContainer.newStatelessKieSession()` 和 


`KieContainer.newKieSession()` 方法是线程不安全的。


## 有状态 Session 和无状态 Session 区别
Drools 的 Session 分为有状态和无状态。

stateful KieSession 可以在多次和 Rule Engine 交互的过程中保持状态。
而无状态的 KieSession 只允许我们交互一次，并直接获取结果。

### StatefulKnowledgeSession

- 与[[规则引擎]]持久交互
- 推理过程多次触发同一个数据集
- 使用完后，要调用 dispose() 方法
- 有状态会话可以随时添加 Fact

Stateful 可以通过 `insert` 方法插入 Fact，并取得 FactHandle，通过这个 Handle 可以多次更新 Fact 从而触发规则

```
        FactHandle handle = statefulKieSession.insert(factObject);
        factObject.setBalance(100.0);
        statefulKieSession.update(handle,factObject);
```

### StatelessKnowledgeSession

- 对 StatefulKnowledgeSession 做了包装
- 不能重复插入 Fact
- 执行规则使用 execute() 方法
- insert, fireAllRules 和 dispose 方法

Stateless 类似一次函数调用，通过 `execute` 方法传入 `Fact`，匹配规则

```
session.execute(Arrays.asList(new Object[]{routeResult,featureManager.getFreeFeatures(),accessManager,this}));
// 又或者，执行完获得结果：
List<Command> cmds = new ArrayList<>();
cmds.add(CommandFactory.newInsert(routeResult,"routeResult"));        cmds.add(CommandFactory.newInsert(featureManager.getFreeFeatures(),"freeFeature"));
cmds.add(CommandFactory.newInsert(accessManager,"accessManager"));
cmds.add(CommandFactory.newInsert(this,"router"));
ExecutionResults results = statelessKieSession.execute( CommandFactory.newBatchExecution( cmds ) );
```
  



## KieBuilder

KieBuilder is a builder for the resources contained in a KieModule


```
KieServices ks = KieServices.Factory.get();
KieRepository kr = ks.getRepository();
InputStream is = new ByteArrayInputStream(bytes);
KieModule kModule = kr.addKieModule(ks.getResources().newInputStreamResource(is));
KieContainer kContainer = ks.newKieContainer(kModule.getReleaseId());
```

## KieResources

KieResources 可以从很多来源构造，字节流 (InputStream)，文件系统 (File)，ClassPath 等等。

	KieModuleModel
	KieRepository
	KieContainerImpl
	KieBase
	KieSession

真正用来启动 Process 的类

	ksession.startProcess()

## reference

- <https://stackoverflow.com/a/46350243/1820217>
