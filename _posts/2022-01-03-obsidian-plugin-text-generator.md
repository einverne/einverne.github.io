---
layout: post
title: "在 Obsidian 中集成 GPT-3 提高输入效率"
aliases:
- "在 Obsidian 中集成 GPT-3 提高输入效率"
tagline: ""
description: ""
category: 
tags: [obsidian, text-generator, gpt-3, openai, chatgpt, github-copilot]
create_time: 2023-01-03 10:33:06
last_updated: 2023-01-03 10:33:06
---

前两天在 Twitter 上发了一个贴子，说如果 [[Obsidian]] 中能继承 [[ChatGPT]] 和 [[GitHub Copilot]] 就好了，我想来虽然也可以在 IntelliJ 和 VSCode 中打开本地的笔记仓库，但是一个礼拜前我尝试了一下用 VSCode 打开，竟然比 Obsidian 还卡，不知道哪里除了问题，所以只能再切换回 Obsidian。好在发帖没多久就发现了 [Text Generator](https://text-gen.com/) 这个插件，用 GTP-3 的 API 驱动的文字生成，并且在调研的过程中又还发现了 Obisidain 下不少能提高输入效率的工具，这里就一切总结一下。

## 文本生成

使用 Text Generator 生成文本

- 在 Obsidian 下安装 Text Generator 插件
- 获取 OpenAI API Key
  - 登录 OpenAI 官网，点击 Account，然后点击 `View API keys`，或者直接访问 [OpenAI API key](https://beta.openai.com/account/api-keys)
- 使用 `cmd+j` 快捷键

### 使用方式

- 第一种方式，在记笔记的过程中，使用快捷键 `cmd+j`，让 Text Generator 续写后文内容。
- 第二种方式是使用左侧边栏上的按钮

## 文本扩展

Text Expander 类的工具是将用户的输入自动扩展成一个更长的内容，通常用来快速输入某些内容。因为我已经有了很多方法来实现 Text Expander（文本扩展），就没有使用 Obsidian 中的插件。

我个人使用的文本扩展方法主要有两个：

- [[RIME]] 中的缩略语
- [[Espanso]] [使用指南](/post/2021/09/espanso-text-expand.html)

这两个工具一直都秉持我的理念，开源，跨平台，并且可以通过文本的方式配置。

### RIME

RIME 是中州韻輸入法引擎 (Rime Input Method Engine) 的缩写，由 RIME 扩展出了不同平台上的输入法，小狼毫，中州韵，鼠须管等等，在 RIME 中可以配置自定义词库，然后在输入法中，通过自定义的映射来实现快速输入。

比如在自定义短语中配置：

```
MySQL   mysql   100
我看下  wkx     30
```

就可以实现在输入 mysql 的时候自动修正为 `MySQL`，在输入 `wkx` 的时候扩展成 `我看下`。通过进阶的 lua 脚本也可以实现输入 `date` 自动扩展成当前日期等等。

### Espanso

[Espanso](/post/2021/09/espanso-text-expand.html) 是一款是 Rust 编写的跨平台的 Text Expander。Espanso 可以通过[纯文本配置](https://github.com/einverne/dotfiles/tree/master/espanso) 来设定文本的扩展。

![espanso demo](https://photo.einverne.info/images/2023/01/03/gW1l.gif)

比如演示中输入 `:date` 自动扩展成日期。为了防止误扩展，一般都会在缩略词前面加上冒号。

## related

- [[HuggingFace]]

## reference

- <https://text-gen.com/>
