---
layout: post
title: "Head First Design Patterns"
tagline: ""
description: ""
category: 学习笔记
tags: [design-pattern, java, learning-notes, ]
last_updated:
---

Some of the Head First learning principles:

- make it visual.
- use a conversational and personalized style.
- think more deeply.
- keep attention.
- touch emotions.

To bend your brain into submission

- Slow down, the more you understand, the less you have to memorize.
- Do the exercises, write your own notes.
- Make this the last thing you read before bed.
- Talk about it. Out loud.
- Pay attention to whether your brain is getting overloaded. Take a break if necessary.
- Feel something, make up your own captions for the photos. Even bad jokes better then feeling nothing at all
- Design something new. Apply new knowledeg in your new desigin or refactor an old project.

## Principle
Identify the aspects of your application that vary and separate them from what stays the same.

The what varies and "encapsulate" it so it won't affect the rest of your code.

Program to an interface really means "Program to a supertype"


## The Open-Closed Principle
开闭原则

> Classes should be open for extension, but close for modification.

第一次听到开闭原则的时候可能会有些疑惑，但是这个原则其实是让架构容易扩展的同时不影响到原来的代码。比如观察者模式，我们可以轻松的在不修改被观察者代码的情况下，通过增加观察者来实现对系统的扩展。

开闭原则下的模式：

- Observer 模式
- 工厂模式

