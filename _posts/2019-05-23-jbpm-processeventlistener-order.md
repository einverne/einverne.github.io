---
layout: post
title: "jbpm 中 ProcessEventListener 顺序问题"
tagline: ""
description: ""
category: 学习笔记
tags: [jbpm, drools, business-process, rule, rule-engine, ]
last_updated:
---

在 jBPM 商业流程中有一个 [ProcessEventListener](https://docs.jboss.org/drools/release/7.11.0.Final/kie-api-javadoc/) ，可以用来回调流程的执行过程，但是这个 Listener 的执行顺序非常奇怪。

首先我们先看看这个 interface

    public interface ProcessEventListener {

      void beforeProcessStarted( ProcessStartedEvent event );
      void afterProcessStarted( ProcessStartedEvent event );
      void beforeProcessCompleted( ProcessCompletedEvent event );
      void afterProcessCompleted( ProcessCompletedEvent event );
      void beforeNodeTriggered( ProcessNodeTriggeredEvent event );
      void afterNodeTriggered( ProcessNodeTriggeredEvent event );
      void beforeNodeLeft( ProcessNodeLeftEvent event );
      void afterNodeLeft( ProcessNodeLeftEvent event );
      void beforeVariableChanged(ProcessVariableChangedEvent event);
      void afterVariableChanged(ProcessVariableChangedEvent event);

    }


我相信大多数人看到这些方法回调大致可以猜测 afterProcessStarted 应该是在流程开始之后被调用，然而实际的调用顺序是这样的：


    - beforeProcessStarted
      - beforeNodeTriggered
        - beforeNodeLeft
          - beforeNodeTriggered
            - beforeVariableChanged
              afterVariableChanged
            - beforeNodeLeft
              - beforeNodeTriggered
                - beforeNodeLeft
                  - beforeNodeTriggered
                    afterNodeTriggered
                  afterNodeLeft
                - beforeNodeLeft
                    beforeNodeTriggered
                    afterNodeTriggered
                  afterNodeLeft
                afterNodeTriggered
              afterNodeLeft
            afterNodeTriggered
          afterNodeLeft
        afterNodeTriggered
      afterProcessStarted

`afterProcessStarted` 会在流程结束时被调用。有人提过 [bug](https://bugzilla.redhat.com/show_bug.cgi?id=798876) 但是官方认为这是程序设计，所以使用文档的[形式](https://github.com/kiegroup/jbpm/commit/89bca815b8efc026dae51cd52afc0077a4f0eb71) 将这种方式说明了。


查看源代码可以在 RuleExecutor 中可以看到：

![jbpm listener](/assets/jbpm-screenshot-area-2019-05-23-194532.png)


## 实验

假设有如下图的流程

![jbpm process](/assets/jbpm-process-event-listener-order-2019-05-24-181428.png)

那么打印所有的日志可以观察到：

    - DefaultRuleContainer beforeVariableChanged ==>[ProcessVariableChanged(id=age; instanceId=age; oldValue=null; newValue=18; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterVariableChanged ==>[ProcessVariableChanged(id=age; instanceId=age; oldValue=null; newValue=18; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeProcessStarted ==>[ProcessStarted(name=BPTest; id=FlowTest.BPTest)]
    - event ==>[ProcessStarted(name=BPTest; id=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeTriggered ==>[ProcessNodeTriggered(nodeId=4; id=0; nodeName=StartPoint; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeLeft ==>[ProcessNodeLeft(nodeId=4; id=0; nodeName=StartPoint; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeTriggered ==>[ProcessNodeTriggered(nodeId=7; id=1; nodeName= 年龄是否大于 18; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeLeft ==>[ProcessNodeLeft(nodeId=7; id=1; nodeName= 年龄是否大于 18; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeTriggered ==>[ProcessNodeTriggered(nodeId=2; id=2; nodeName=A1Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeLeft ==>[ProcessNodeLeft(nodeId=2; id=2; nodeName=A1Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeTriggered ==>[ProcessNodeTriggered(nodeId=6; id=3; nodeName=A2Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeLeft ==>[ProcessNodeLeft(nodeId=6; id=3; nodeName=A2Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeTriggered ==>[ProcessNodeTriggered(nodeId=3; id=4; nodeName=End; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeNodeLeft ==>[ProcessNodeLeft(nodeId=3; id=4; nodeName=End; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer beforeProcessCompleted ==>[ProcessCompleted(name=BPTest; id=FlowTest.BPTest)]
    - DefaultRuleContainer afterProcessCompleted ==>[ProcessCompleted(name=BPTest; id=FlowTest.BPTest)]
    - event ==>[ProcessCompleted(name=BPTest; id=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeLeft ==>[ProcessNodeLeft(nodeId=3; id=4; nodeName=End; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeTriggered ==>[ProcessNodeTriggered(nodeId=3; id=4; nodeName=End; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeLeft ==>[ProcessNodeLeft(nodeId=6; id=3; nodeName=A2Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeTriggered ==>[ProcessNodeTriggered(nodeId=6; id=3; nodeName=A2Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeLeft ==>[ProcessNodeLeft(nodeId=2; id=2; nodeName=A1Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeTriggered ==>[ProcessNodeTriggered(nodeId=2; id=2; nodeName=A1Task; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeLeft ==>[ProcessNodeLeft(nodeId=7; id=1; nodeName= 年龄是否大于 18; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeTriggered ==>[ProcessNodeTriggered(nodeId=7; id=1; nodeName= 年龄是否大于 18; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeLeft ==>[ProcessNodeLeft(nodeId=4; id=0; nodeName=StartPoint; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterNodeTriggered ==>[ProcessNodeTriggered(nodeId=4; id=0; nodeName=StartPoint; processName=BPTest; processId=FlowTest.BPTest)]
    - DefaultRuleContainer afterProcessStarted ==>[ProcessStarted(name=BPTest; id=FlowTest.BPTest)]


## reference

- <https://bugzilla.redhat.com/show_bug.cgi?id=798876>
- <https://github.com/kiegroup/jbpm/commit/89bca815b8efc026dae51cd52afc0077a4f0eb71>
