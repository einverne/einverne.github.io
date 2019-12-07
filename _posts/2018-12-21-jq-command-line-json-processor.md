---
layout: post
title: "每天学习一个命令：jq 命令行下处理 JSON"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [jq, json, linux, command, ]
last_updated:
---

jq 是一个命令行下的 JSON 字符串处理工具，就像 sed 对于文本一样，jq 对应着 json 文件，jq 命令可以不同方式转换 JSON。jq 可以接受文本输入，默认情况下，jq 从 stdin 读取 JSON 流。通过和管道的组合可以非常方便的处理 JSON。

> jq is a lightweight and flexible command-line JSON processor


## 使用实例

### 直接处理文件

    js -I '.' input.json
    cat input.json | jq -I '.'

jq 只能接受标准 JSON 格式，输入的文件内容必须严格遵守 JSON 格式标准。所以的属性名必须是双引号字符串。

### 格式化 JSON
jq 命令，原文格式化输出：

    echo '{ "foo": "lorem", "bar": "ipsum" }' | jq .
    cat input.json | jq .

### 将格式化的 JSON 字符串压缩到一行
如果有一个纯文本的大 JSON，比如好几 M 的文件，那么通过 GUI 去压缩显然不合理，通过命令非常快

    jq -c . input.json

### 获取特定文本
比如上面的字符串

    { "foo": "lorem", "bar": "ipsum" }

那么如果

    cat input.json | jq '.foo'

则输出的就是 foo 为 key 的值

    "lorem"

如果 key 不存在则返回 null

key 的书写方式支持 `.key.key` 级联的访问。

## 外延
在线练习场

- <https://jqplay.org/>


## reference

- <https://stedolan.github.io/jq/>
- <https://github.com/stedolan/jq/wiki/Cookbook>
