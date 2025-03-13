---
layout: post
title: "Gemini 2 的原生多模态图片生成"
aliases:
- "Gemini 2 的原生多模态图片生成"
tagline: ""
description: ""
category: 经验总结
tags: [ gemini, gemini-2, google-gemini, ai-studio, image-generation, gemini-2-flash ]
create_time: 2025-03-13 21:02:24
last_updated: 2025-03-13 21:02:24
dg-home: false
dg-publish: false
---

Google 今天发布了 Gemini 2.0 Flash 的多模态图像生成功能。

## 功能

- 文本到图像
  - 生成一张东京塔和烟花的图像
- 文本到图像和文本
  - 生成一份西班牙海鲜饭的图解食谱
- 文本和图像到文本和图像
  - 带有一个装修房间的图像，什么颜色的沙发适合房间，更新图片
- 图片编辑
  - 编辑图片，使其看上去更像日式卡通
  - 猫的图像，枕头的图像，在这个枕头上创建猫的十字绣

[Bilibili](https://www.bilibili.com/video/BV1xeQPYoE9A/) [YouTube](https://youtu.be/3PtYm9FK-fQ)

## 生成连续的会话

用 6 张连续的中国传统画风的漫画来讲述买椟还珠的故事，生成文字和图片。

![etZCIL3eoD](https://pic.einverne.info/images/etZCIL3eoD.png)

## 对话式修改图片

Gemini 2.0 Flash 现在不仅可以通过聊天生成图像，还可以直接通过对话的方式来编辑图片的局部。

### 人物旋转

图片中的人物左转 90 度，展示侧面，并且手举起

### 扩展图片

比如只有头部的照片，可以「扩展成全身照，白色衬衫，黑色裤子」

### 去水印

直接和 Gemini 对话就可以去除水印。

### 图片上色

make a line art out of this sketch

give it some base color

add some soft shading, the source of the low light is on the left upper corner

add some background, indoors, fit the environment with the current source of light and shading, use proper angle

make it monochrome greyscale for light novel illustration

### 合并图片

在之前介绍过的 [Whisk](https://blog.einverne.info/post/2025/01/google-ai-whisk.html) 中大家可能就已经感受到了 Google 生成图像融合图像的能力了，现在 Google 将这个能力更进一步扩展了。

## 文字渲染

准确来说就是直接在图片中渲染文字。

Gemini 可以直接生成简单的海报，官方的例子就是直接生成生日贺卡。

## 一些问题

比如一些人像生成的时候会将脸部修改。

## related

- [Whisk](https://blog.einverne.info/post/2025/01/google-ai-whisk.html)
- [[Recraft]]
- [[ideogram]] 是由 Ideogram Inc 开发的免费文本转图像生成模型，能根据提示词生成图像，该模型在生成图片文字方面的能力很强
- [[jimeng]]
- krea
- grok

## reference

- <https://developers.googleblog.com/zh-hans/experiment-with-gemini-20-flash-native-image-generation/>
