---
layout: post
title: "Drools 学习笔记之决策表: Guided Decision Table"
aliases: "Drools 学习笔记之决策表: Guided Decision Table"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, kie, guided-decision-table, ]
last_updated:
---



## Column
决策表的列定义。

### Ruleflow-Group
A string identifying a rule flow group. In rule flow groups, rules can fire only when the group is activated by the associated rule flow. Example: `ruleflow-group "GroupName"`


### Agenda-Group

> A string identifying an agenda group to which you want to assign the rule. Agenda groups allow you to partition the agenda to provide more execution control over groups of rules. Only rules in an agenda group that has acquired a focus are able to be activated. Example: `agenda-group "GroupName"`


Agenda Groups 是一种分区规则的方法，任何时候只有一组规则拥有 Focus，只有拥有 Focus 焦点的规则才会生效。
agenda-group 默认值 `MAIN`，类型是 String，可以如下方式定义：

	rule "Is of valid age"
	agenda-group "GroupA"
	when
		Applicant( age < 18 )
		$a : Application()
	then
		$a.setValid( false );
		System.out.println("GroupA fired age < 18");
	end

`Agenda-Group` 像栈一样工作，当给定 Group 设置 Focus 时，该 Group 会被放到栈顶。


### Metadata column
元数据列，默认情况下元数据列是隐藏的。可以在决策表的列属性中显示。


## reference

- <https://stackoverflow.com/q/17175037/1820217>
