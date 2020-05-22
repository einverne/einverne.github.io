---
layout: post
title: "解析 bpmn 文件"
tagline: ""
description: ""
category: 学习笔记
tags: [bpmn, xml, java, business-process, workflow, ]
last_updated:
---

Business Process Model and Notation (BPMN) is a graphical representation for specifying business processes in a business process model.

## Choice
可供选择的方案，如下。

### jBPM

jBPM 是一个用 Java 写的开源工作流引擎，可以用来执行 BPMN 2.0 定义的工作流。

- Apache License 2.0


### EasyBPMN
EasyBPMN Toolbox is a powerful Java library for BPMN 2.0. It can parse and manipulate BPMN 2.0 files easily by providing a Java model for any BPMN 2.0 compliant business process.

- <https://research.petalslink.org/display/easybpmn/EasyBPMN+Overview>

### EMF Java Api
EMF 是 Eclipse 下面的一个建模工具，我没有具体细看，但 BPMN 2.0 的规范定义，本质上 bpmn 文件就是一个 xml 格式的文件，如果知道 bpmn 文件的定义规范，使用任意的 xml 解析工具都可以解析出想要的内容。

> BPMN2 model is based on EMF model (org.eclipse.bpmn2 project, model folder, BPMN20.ecore file). You can use EMF Java Api to create, read or modify BPMN2 models.

## Business Process Model And Notation

BPMN 2.0 规范

- <https://www.omg.org/spec/BPMN/2.0/>

## Solution
在搜罗了一圈之后在 jBPM 项目中发现了下面的代码。`XmlProcessDumper` 类实现了 bpmn 文件的解析。


	InputStream inputBpmn = getClass().getResourceAsStream("/BPMN2-BrokenStructureRef.bpmn2");
	XmlProcessDumper dumper = XmlProcessDumperFactory.getXmlProcessDumperFactoryService().newXmlProcessDumper();
	Assert.assertNotNull(dumper);
	String processXml = new String(IoUtils.readBytesFromInputStream(inputBpmn), "UTF-8");
	Assert.assertNotNull(processXml);
	org.kie.api.definition.process.Process proc = dumper.readProcess(processXml);
	Assert.assertNotNull(proc);
	Assert.assertEquals("BrokenStructureRef", proc.getId());


## reference

- <https://en.wikipedia.org/wiki/List_of_BPMN_2.0_engines>
- BPMN 2.0 执行引擎列表：<https://en.wikipedia.org/wiki/List_of_BPMN_2.0_engines>
