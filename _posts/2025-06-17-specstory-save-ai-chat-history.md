---
layout: post
title: "利用 SpecStory 记录每一次和 AI 的对话"
aliases:
- "利用 SpecStory 记录每一次和 AI 的对话"
tagline: ""
description: ""
category: 经验总结
tags: [ai, chat-history, specstory, cursor, visual-studio-code, vscode,]
create_time: 2025-06-19 17:03:28
last_updated: 2025-06-19 17:03:28
dg-home: false
dg-publish: false
---

今天想给大家介绍一款特别有意思的插件叫做 [SpecStory](https://github.com/specstoryai/getspecstory)，我们现在会在 VS Code， Cursor 编辑器中使用各种类型的代码辅助工具，也会利用 Cursor 等集成的 IDE 来 vibe coding，但是如果我们每一次都重头开始描述我们想要做的事情，或者每一次都新开一个聊天窗口，AI 大模型大概率会前后表现不一致，虽然我们也可以利用 Cursor Rules 等工具来给 AI 提供一些系统级别的提示词，但是 AI 在回复的过程中也可能跑偏。

SpecStory 这款插件恰好解决了这些问题。SpecStory 的核心功能是帮助开发者在编程过程中建立和维护一个持久的、可追溯的情境描述，它会记录下所有和 AI 的聊天记录。

## 功能

[SpecStory](https://github.com/specstoryai/getspecstory) 能够自动保存、组织并以结构化 Markdown 格式呈现所有 AI 聊天记录，确保每一次与 AI 的对话都成为可检索的资产。SpecStory 为 AI 提供丰富且准确的上下文信息，使得 AI 能够更好地理解你的意图，从而提供更精准的建议或生成代码。这种方式最大限度地减少了 AI 偏离主题或给出不相关建议的可能性，也避免了重复输入大量背景信息的问题。

- **对话自动保存**  
  SpecStory 安装后会在专案根目录生成 `.specstory` 文件夹，将所有与 AI 的交互以 Markdown 档案形式记录。
- **灵活导出与分享**  
  使用命令面板执行「SpecStory: Save Composer and Chat History」即可手动导出指定会话；「SpecStory: Share Composer and Chat History」则能生成匿名分享链接，支持 Markdown 及图片格式。
- **历史检索**
  由于所有对话都存为 Markdown，开发者可透过专案内建搜寻或外部工具快速查找过去的 prompt 及回应内容，提升重用与团队协作效率。
- **规则与提示生成**  
  SpecStory 可根据聊天历史自动产生 Cursor 规则或 Copilot 指令，帮助 AI 更好地延续上下文并优化开发流程。

## 安装

以下是如何安装和使用 SpecStory 的简单说明

### 安装步骤

确保你的编辑器兼容 SpecStory：目前 SpecStory 支持 GitHub Copilot、Cursor 编辑器。

| 编辑器    | 步骤                                                                                  | 备注                                              |
| --------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- |
| VS Code   | 扩展市场搜寻「SpecStory」，点击安装                                                   | 支持 GitHub Copilot 及 Cursor                     |
| Cursor    | Cursor 编辑器内部扩展面板 (Ctrl/Cmd+Shift-X) 搜索「SpecStory」并安装                  | 如从 Marketplace 网站安装，需另行在 Cursor 端安装 |
| VSIX 安装 | 下载 `specstory-vscode-latest.vsix`，于命令面板选择「Extensions: Install from VSIX…」 | 适用于无法从扩展市场直接安装的场景                |

打开命令面板 (Ctrl/Cmd+Shift-P)，输入 `SpecStory`，若能看到相关命令列表即表示安装成功。

## 使用

1. **自动保存**：启用 SpecStory 后，执行任何 AI 对话都会自动记录于 `.specstory/history/` 下的 Markdown 档案中。
2. **手动导出**：在命令面板执行「SpecStory: Save...」选择并合并所需会话，并另存为 Markdown。
3. **分享历史**：透过「SpecStory: Share...」生成可匿名访问的分享链接，便于团队同步。

所有对话记录均保存在本地专案中，不会自动上传云端，并提供匿名分享选项，无需注册，即可掌控分享内容。
