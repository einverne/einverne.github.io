---
layout: post
title: "Gemini Balance：搭建 Gemini 转发"
aliases:
- "Gemini Balance：搭建 Gemini 转发"
tagline: ""
description: ""
category: 经验总结
tags: [ gemini, gemini-proxy, hajimi, llm, google, ai-studio ]
create_time: 2025-08-14 10:12:22
last_updated: 2025-08-14 10:12:22
dg-home: false
dg-publish: false
---

Google 提供了非常慷慨的 Gemini 模型调用额度，但是如果日常高频使用的话，还是可能超出使用限制，我的主力帐号，每天几十 K Token 的使用也差不多有 3 美元左右的费用了，所以我想着能不能直接利用多个 Google 帐号的 AI Key 轮询使用免费的额度，果不其然都已经有人实现了并开源了，Gemini Balance 就是这样一个可以使用多个 API 密钥的项目。

## 什么是 Gemini Balance

[Gemini Balance](https://github.com/snailyp/gemini-balance) 是一个基于 Python FastAPI 构建的开源应用，专门为 Google Gemini API 提供代理和负载均衡功能。这个开源项目解决了开发者在使用 Gemini API 时遇到的配额限制、密钥管理复杂等问题，通过智能的多密钥轮询机制，让你能够突破单一 API 密钥的使用限制，实现近乎无限制的 Gemini API 调用。

作为一个完整的 API 代理解决方案，Gemini Balance 不仅支持原生 Gemini API 格式，还完美兼容 OpenAI API 格式，我们在调用的时候可以无缝切换或同时使用多种大语言模型服务。

## 功能特性

Gemini Balance 的功能非常丰富，我们来看一看它最吸引人的几个亮点。

- 支持配置多个 Gemini API 密钥，实现自动顺序轮询，提高可用性和并发性，这是这个项目的核心功能。只需要在配置中填入多个 Gemini 的 API Key，项目就会自动进行轮询，分担请求压力。
  - 在密钥出现使用限制是会自动切换到其他可用密钥
- 管理后端即时生效的可视化配置，只需要进入管理后台，就可以在页面上轻松修改配置。所有配置都能立即生效，无需重启服务。
- 双协议的 API 兼容，同时支持 Gemini API 和 OpenAI 的 Chat API 格式。 这也就意味着你可以使用 OpenAI 的兼容接口来调用 **Gemini**。
  - Gemini Balance 同时支持 Gemini 和 OpenAI 两种 API 格式：
  - **Gemini Base URL**: `http://localhost:8000/gemini/v1beta`
  - **OpenAI Base URL**: `http://localhost:8000/v1`
- 支持图像生成，通过配置，可以支持图像调用，实现图文对话和图片编辑。
- 提供实时查看每个密钥状态和使用情况的监控页面
  - 系统提供全面的监控管理功能，包括实时密钥状态监控、详细的使用统计和性能分析。开发者可以通过可视化界面查看每个 API 密钥的使用情况、成功率、响应时间等关键指标，便于优化和故障排查。
  - 提供详细的错误日志，便于故障排查

更多其他的功能改善

- 支持自定义 Gemini 代理
- 灵活的密钥添加方式，支持正则匹配
- 完美适配 OpenAI 格式的嵌入 API 接口
- 可选的流响应优化功能
- 自动处理 API 请求失败、重试和密钥管理
- 支持 AMD 和 ARM 架构的 Docker 部署
- 支持自动获取 OpenAI 和 Gemini 模型列表
- 支持配置 HTTP/SOCKS5 代理服务器
- 实时监控与统计

## 系统架构设计

Gemini Balance 采用了清晰的模块化架构设计：

```
app/
├── config/      # 配置管理
├── core/        # 核心应用逻辑（FastAPI 实例创建、中间件等）
├── database/    # 数据库模型和连接
├── router/      # API 路由（Gemini、OpenAI、状态页等）
├── service/     # 业务逻辑服务（聊天、密钥管理、统计等）
├── scheduler/   # 定时任务（密钥状态检查）
├── utils/       # 工具函数
└── main.py      # 应用入口
```

这种模块化设计确保了系统的高可维护性和扩展性，每个模块职责清晰，方便团队协作和功能扩展。

## 安装与部署指南

### 前置准备

在开始安装 Gemini Balance 之前，您需要准备以下环境：

1. Docker（推荐用于部署） Docker Compose
2. **MySQL 数据库**（或使用 SQLite）
3. **多个 Gemini API 密钥**

### 获取 Gemini API 密钥

首先需要申请 Gemini API 密钥：

1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 使用 Google 账户登录
3. 点击左上角的"Get API key"按钮
4. 选择"创建 API 密钥"
5. 复制并安全保存生成的 API 密钥

建议申请多个 Google 账户来获取多个 API 密钥，以实现真正的负载均衡效果。

### Docker 部署（推荐方式）

使用预构建镜像部署

```bash
# 拉取镜像
docker pull ghcr.io/snailyp/gemini-balance:latest

# 运行容器
docker run -d -p 8000:8000 --env-file .env \
  --dns 8.8.8.8 --dns 8.8.4.4 \
  ghcr.io/snailyp/gemini-balance:latest
```

使用 Docker Compose 部署（推荐）

创建 `docker-compose.yml` 文件，可以直接使用我的[项目配置](https://github.com/einverne/dockerfile/tree/master/gemini-balance)

以下的内容只是作为参考。 

```yaml
version: '3.8'
services:
  gemini-balance:
    image: ghcr.io/snailyp/gemini-balance:latest
    container_name: gemini-balance
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "python -c \"import requests; exit(0) if requests.get('http://localhost:8000/health').status_code == 200 else exit(1)\""]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  mysql:
    image: mysql:8
    container_name: gemini-balance-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s

volumes:
  mysql_data:
```

### 配置环境变量

创建 `.env` 配置文件：

```bash
# 数据库配置
DATABASE_TYPE=mysql
MYSQL_HOST=gemini-balance-mysql
MYSQL_PORT=3306
MYSQL_USER=gemini
MYSQL_PASSWORD=change_me
MYSQL_DATABASE=default_db

# API 密钥配置（支持多个密钥）
API_KEYS=["AIzaSyxxxxxxxxxxxxxxxxxxx","AIzaSyxxxxxxxxxxxxxxxxxxx"]

# 访问令牌配置
ALLOWED_TOKENS=["sk-123456"]
AUTH_TOKEN=sk-123456

# 时区设置
TZ=Asia/Shanghai
```

**重要配置说明**：

- `API_KEYS`: 支持配置多个 Gemini API 密钥，系统会自动进行轮询
- `ALLOWED_TOKENS`: 用于访问服务的认证令牌
- `AUTH_TOKEN`: 管理后台的登录密码

更详细的配置说明和模板可以参考我的 [dockerfile](https://github.com/einverne/dockerfile)。

### 本地开发部署

对于开发环境，可以选择本地部署方式：

```bash
# 克隆项目
git clone https://github.com/snailyp/gemini-balance.git
cd gemini-balance

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入实际配置

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 使用方法详解

### 基础 API 调用

部署完成后，可以通过以下方式调用 API：

#### OpenAI 格式调用

注意请求头中的 Authorization 参数需要填写之前配置中设定的。

```bash
curl -X POST "http://localhost:8000/v1/chat/completions" \
  -H "Authorization: Bearer sk-123456" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-1.5-flash",
    "messages": [
      {"role": "user", "content": "你好，请介绍一下自己"}
    ],
    "temperature": 0.7
  }'
```

#### Gemini 原生格式调用

```bash
curl -X POST "http://localhost:8000/gemini/v1beta/models/gemini-1.5-flash:generateContent" \
  -H "Authorization: Bearer sk-123456" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {"parts": [{"text": "你好，请介绍一下自己"}]}
    ]
  }'
```

### 管理后台使用

访问 `http://localhost:8000` 进入管理后台，使用 `AUTH_TOKEN` 中配置的密码登录。在管理后台中，您可以：

1. **实时查看密钥状态**：监控每个 API 密钥的健康状态和使用情况
2. **动态配置管理**：在线修改配置，无需重启服务
3. **使用统计分析**：查看详细的调用日志和性能统计
4. **密钥管理**：添加、删除或禁用特定的 API 密钥

### 高级功能配置

#### 图像生成支持

Gemini Balance 支持图像生成功能，可以通过 OpenAI 兼容接口调用：

```bash
curl -X POST "http://localhost:8000/v1/images/generations" \
  -H "Authorization: Bearer sk-123456" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一只可爱的小猫在花园里玩耍",
    "n": 1,
    "size": "1024x1024"
  }'
```

#### 联网搜索功能

对于支持搜索的模型，可以配置 `SEARCH_MODELS` 环境变量启用联网搜索功能：

```bash
SEARCH_MODELS=["gemini-2.0-flash-exp"]
```

#### SSL/HTTPS 配置

生产环境建议配置 HTTPS，可以使用 Nginx 反向代理：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }
}
```

#### Nginx Proxy Manager 配置

在 Nginx Proxy Manager 中可以如下配置。

![E6_JyDUdRc](https://pic.einverne.info/images/E6_JyDUdRc.png)

## Google Gen AI SDK

如果要在 Google Gemini 官方的 Gen AI SDK 中使用，可以通过特定的参数来设置自定义的 Base URL。比如在 Python 的 SDK 中，就可以通过 `http_options` 参数来配置 base_url

```
from google import genai
from google.genai import types

# 创建客户端，连接到 Gemini Balance 代理
client = genai.Client(
    api_key="你的认证令牌",  # 这里使用 Gemini Balance 的认证令牌
    http_options=types.HttpOptions(
        base_url="http://localhost:8000/gemini/v1beta"  # Gemini Balance 的代理地址
    )
)

# 使用代理服务调用 API
response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="你好，请介绍一下自己"
)
print(response.text)
```

同样 Gemini Balance 支持 OpenAI 兼容的接口，所以也可以使用 OpenAI 的客户端。

```
from openai import OpenAI

# 创建 OpenAI 客户端，指向 Gemini Balance
client = OpenAI(
    api_key="sk-123456",  # Gemini Balance 的认证令牌
    base_url="http://localhost:8000/v1"  # OpenAI 兼容接口
)

response = client.chat.completions.create(
    model="gemini-1.5-flash",
    messages=[
        {"role": "user", "content": "你好，请介绍一下自己"}
    ]
)

print(response.choices[0].message.content)
```

## 最后

Gemini Balance 是一个功能强大、易于部署的 Gemini API 代理和负载均衡解决方案。通过其多密钥轮询、可视化管理、双协议兼容等特性，为开发者提供了一个稳定、高效的 API 管理平台。

## related

- [[hajimi]]