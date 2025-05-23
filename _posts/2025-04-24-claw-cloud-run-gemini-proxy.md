---
layout: post
title: "使用 Claw Cloud 免费部署 Gemini 反向代理教程"
aliases: 
- "使用 Claw Cloud 免费部署 Gemini 反向代理教程"
tagline: ""
description: ""
category: 经验总结
tags: [ claw, gemini, gemini-proxy, openai, cherry-studio, ]
last_updated:
dg-home: false
dg-publish: false
---

前两天介绍过永久免费的 Claw Cloud Run，本文将介绍一下如何使用 Claw Cloud Run 来免费部署一个 Gemini API 反向代理服务。

## 特点

1.  **完全免费:** 利用平台的免费额度，无需支付费用。
2.  **操作简单:** 部署过程直观，易于上手。
3.  **国内友好:** 部分节点（如日本）对中国大陆访问速度较好。
4.  **流量充足:** 每月提供 10GB 免费流量，对于个人使用 Gemini API 来说通常绰绰有余。

## 搭建流程

配置应用信息

- **Application Name:** 填写一个应用名称（必须是**英文**，且以**小写字母**开头）。
- **Image Name:** 输入镜像地址 `ghcr.io/wyeeeee/hajimi:latest`
- 配置端口为 7860 并打开
- **找到环境变量设置** 向下滚动页面，找到 **Environment Variables** 部分。

```
#基础部分
#设置一个你自己的访问密码
PASSWORD=123
#配置时区
TZ=Asia/Shanghai

#ai studio部分

#将key1,key2,key3等替换为你真正拥有的gemini api key
GEMINI_API_KEYS=key1,key2,key3

#每分钟最大请求数
MAX_REQUESTS_PER_MINUTE=30

#每天每个 IP 最大请求数
MAX_REQUESTS_PER_DAY_PER_IP=600

#是否启用假流式传输
FAKE_STREAMING=true

#单api 24小时最大使用次数
API_KEY_DAILY_LIMIT=100

#空响应重试次数
MAX_EMPTY_RESPONSES=5

#是否启用伪装信息
RANDOM_STRING=true

#伪装信息长度
RANDOM_STRING_LENGTH=5

#默认的并发请求数
CONCURRENT_REQUESTS=1

#当请求失败时增加的并发请求数
INCREASE_CONCURRENT_ON_FAILURE=0

允许的最大并发请求数
MAX_CONCURRENT_REQUESTS=3

#是否启用联网模式(联网模式有严格的审核)
SEARCH_MODE=false

#联网模式提示词(用英文单引号包裹提示词)
SEARCH_PROMPT='（使用搜索工具联网搜索，需要在content中结合搜索内容）'

#vertex部分（如果您不需要vertex或不知道vertex是什么，无需配置这些内容）

#是否启用vertex
ENABLE_VERTEX=false

#vertex ai 凭证
GOOGLE_CREDENTIALS_JSON=''
```

大部分设置都拥有默认值，只需要填写拥有的 gemini key 到对应位置即可

点击 claw 的 **Add environment variable**将 txt 文件内容复制并粘贴进去

- **部署应用** 返回页面顶部，点击 **Deploy application** 按钮。

等待部署完成 等待应用状态 (`Status`) 变为 **Running**，这表示部署已成功。

获取反代地址并使用\*\*

- 切换到 **Network** 标签页。
- 在右侧会看到一个 URL 地址，这就是你的反向代理地址。点击 **Copy** 复制它。

**访问前端界面**

把刚刚复制的链接地址在浏览器中打开，就能看到如图所示的前端界面。

- 如果无法显示，请耐心等待，若仍无法打开，请将链接开头的 https 改为 http

## reference

- <https://github.com/wyeeeee/hajimi/blob/main/wiki/claw.md>
