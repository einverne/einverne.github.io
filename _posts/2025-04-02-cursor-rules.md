---
layout: post
title: "Cursor Rules 为 AI 设限"
aliases:
- "Cursor Rules 为 AI 设限"
tagline: ""
description: ""
category: 经验总结
tags: [ cursor, ai, claude, cursor-rules, ai-coding, editor ]
create_time: 2025-04-02 11:04:37
last_updated: 2025-04-02 11:04:37
dg-home: false
dg-publish: false
---

我自己使用 Cursor 已经有一段时间了，Cursor 提供了非常好用的代码补全，以及代码生成功能，但是在使用的过程中难免也发现了一些问题，最近看到 Cursor 推出了这个 Cursor Rules，看到了官方尝试来解决一些问题，也正好以此契机来完整地介绍一下 Cursor Rule，给 AI 设定一些界限，规则，不让其过分地自由发挥以至于发生意想之外的错误。

## 什么是 Cursor Rules

Cursor Rules 本质上是一个控制 AI 模型行为的指令，可以将其理解成 Cursor「系统级别的 Prompt」。通过这些前置的规则，可以更好地约束 AI 生成代码的方向，按照我们自己特定的需求和标准来更好的辅助我们编码。

Cursor Rules 可以涵盖非常多的方面，包括编码规范，框架和库的使用，架构，目录，文件结构，文件质量和安全，测试，文档等等。

Cursor Rules 提供两种设置规则的方式

- Project Rules，项目级别的规则，独属于项目配置，存储在 `.cursor/rules` 目录下，当匹配的文件被引用时，自动包含规则。
  - 在 Cursor 0.47.5 中，Project Rules 新增了 Rule Type 功能，可以更细致地定义规则类型
- Global Rules，全局规则，适用于所有的项目，在 Cursor 设置中进行配置（Settings > General > Rules for AI）

![Pxfh](https://photo.einverne.info/images/2025/04/02/Pxfh.png)

## 如何编写 Cursor Rules

### 指定项目的技术栈

在 Cursor Rules 中指定当前项目使用的技术栈，可以让 Cursor 更好地根据这个技术栈来生成响应的代码。

### 命名规则

可以指定 AI 让其生成的变量名，方法名，类名等符合一定的命名风格，比如

- 变量名使用 camelCase 驼峰
- 常量使用全大小加下划线分割 MAX_VALUE
- 类名使用大驼峰命名法 PascalCase

这样设置之后，AI 生成的代码更加可控，也不需要自己手动去重命名。

### 注释代码

可以让 AI 生成的代码增加一些可读的注释，默认情况下 AI 生成的代码会缺少文档和相关的注释，特别是在复杂逻辑，函数时，可以预定义一些内容，让 AI 在生成时对应的生成注释和文档，比如

- 所有的公开函数需要有功能注释，解释其输入和输出，以及方法作用
- 复杂的函数或逻辑需要在行内注释

### 代码风格

每个开发团队都会有自己的代码风格和实践，比如代码缩进，函数长度，空行的使用，AI 生成的代码风格如果和团队的标准差异比较大的情况，可以自行设定代码风格规则，确保 AI 生成的代码风格一致。

### 其他的实践经验

1. 具体代码优先：“DO NOT GIVE ME HIGH LEVEL SHIT, IF I ASK FOR FIX OR EXPLANATION, I WANT ACTUAL CODE OR EXPLANATION!!!” 这条规则直接要求 AI 提供具体的代码或解释，而不是抽象的高层次描述。
2. 保持简洁：“Be terse”（简洁），这条规则要求 AI 省去无用的修饰词，直接提供有价值的信息。
3. 预测需求：“Suggest solutions that I didn’t think about—anticipate my needs”，这条规则鼓励 AI 不仅解决当前问题，还要预测用户可能需要的解决方案。

## 个人使用经验

充分利用 Git 去保存阶段性生成的可用代码，Cursor 生成代码的以及批量修改文件的能力非常强大，但是同时也可能将已有的功能破坏，所以我个人的经验就是每次会新建分支，让 Cursor 就某一个功能提供修改，直到改到成功为止，并提交 Git。一旦发生问题可以追溯或者进行 revert。

## 其他参考

- <https://cursor.directory/>
- <https://cursorlist.com/>
- GitHub 上的 [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) 项目收集了许多已经写好的规范，可以直接拿来使用
- <https://dotcursorrules.com/>

## related

- <https://docs.cursor.com/context/rules-for-ai>
