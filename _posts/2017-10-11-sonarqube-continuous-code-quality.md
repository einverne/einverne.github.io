---
layout: post
title: "SonarQube continuous code quality"
tagline: ""
description: ""
category: 学习笔记
tags: []
last_updated:
---

关键字提取，开源，代码质量管理，多语言支持。

> SonarQube is an open-source platform developed by SonarSource for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on 20+ programming languages.

开源协议：Lesser GNU General Public License

SonarQube 可以从以下七个维度检测代码质量，而作为开发人员至少需要处理前 5 种代码质量问题

- 不遵循代码标准 SonarQube 可以通过 PMD,CheckStyle,Findbugs 等等代码规则检测工具规范代码编写。
- 潜在的缺陷 SonarQube 可以通过 PMD,CheckStyle,Findbugs 等等代码规则检测工具检测出潜在的缺陷。
- 糟糕的复杂度分布 文件、类、方法等，如果复杂度过高将难以改变，这会使得开发人员难以理解它们，且如果没有自动化的单元测试，对于程序中的任何组件的改变都将可能导致需要全面的回归测试。
- 重复 显然程序中包含大量复制粘贴的代码是质量低下的，SonarQube 可以展示源码中重复严重的地方。
- 注释不足或者过多 没有注释将使代码可读性变差，特别是当不可避免地出现人员变动时，程序的可读性将大幅下降 而过多的注释又会使得开发人员将精力过多地花费在阅读注释上，亦违背初衷。
- 缺乏单元测试 SonarQube 可以很方便地统计并展示单元测试覆盖率。
- 糟糕的设计 通过 SonarQube 可以找出循环，展示包与包、类与类之间的相互依赖关系，可以检测自定义的架构规则 通过 SonarQube 可以管理第三方的 jar 包，可以利用 LCOM4 检测单个任务规则的应用情况， 检测耦合。



## reference

- <https://www.sonarqube.org/>
- <https://juejin.im/post/5b599a265188251ac22b585c>
