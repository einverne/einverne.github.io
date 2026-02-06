---
layout: post
title: "使用 Atuin 同步 Shell 历史"
aliases:
- "使用 Atuin 同步 Shell 历史"
tagline: ""
description: ""
category: 经验总结
tags: [ shell, atuin, bash, bash-history ]
create_time: 2023-06-08 13:25:20
last_updated: 2023-06-08 13:25:20
---

[Atuin](https://atuin.sh/) 是一个可以同步，备份 Shell 命令历史的服务。借助 Atuin 可以在多台设备之前同步 Shell 命令历史，所有的命令都在数据库（SQLite）中加密存储。

它不仅可以同步历史记录，还提供了一个更好的 `Ctrl-R` 交互界面，支持模糊搜索、按目录过滤、按退出码过滤等功能。

## 安装

macOS 使用 Homebrew 安装：

```bash
brew install atuin
```

Linux 可以使用脚本安装：

```bash
bash <(curl https://raw.githubusercontent.com/atuinsh/atuin/main/install.sh)
```

安装完成后，需要将其集成到 Shell 中。以 Zsh 为例：

```bash
echo 'eval "$(atuin init zsh)"' >> ~/.zshrc
```

Bash 用户则添加到 `.bashrc`：

```bash
echo 'eval "$(atuin init bash)"' >> ~/.bashrc
```

## 配置自托管服务器

Atuin 官方提供了一个公共的同步服务器，但也支持自托管。如果你希望数据完全掌握在自己手中，可以使用 Docker 部署自己的 Atuin Server。

### Docker Compose 部署

创建一个 `docker-compose.yml` 文件：

```yaml
version: '3.5'
services:
  atuin:
    image: ghcr.io/atuinsh/atuin:latest
    container_name: atuin
    environment:
      ATUIN_HOST: "0.0.0.0"
      ATUIN_PORT: "8888"
      ATUIN_OPEN_REGISTRATION: "true"
      ATUIN_DB_URI: postgres://atuin:password@db:5432/atuin
    ports:
      - "8888:8888"
    volumes:
      - ./config:/config
    restart: unless-stopped
    depends_on:
      - db

  db:
    image: postgres:14
    container_name: atuin_db
    environment:
      POSTGRES_USER: atuin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: atuin
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    restart: unless-stopped
```

启动服务：

```bash
docker-compose up -d
```

### 客户端配置

在客户端机器上，修改配置文件 `~/.config/atuin/config.toml`，指向你的自托管服务器地址：

```toml
# ~/.config/atuin/config.toml
sync_address = "https://your.atuin-server.com"
```

如果服务器没有使用 HTTPS，需要配置 `sync_address = "http://IP:8888"`。

## 注册与登录

配置好服务器地址后，首先注册账号：

```bash
atuin register -u <USERNAME> -e <EMAIL> -p <PASSWORD>
```

登录：

```bash
atuin login -u <USERNAME> -p <PASSWORD>
```

### 导出 Key

Atuin 使用端到端加密，密钥保存在本地。为了在其他机器上登录，你需要导出这个 Key：

```bash
atuin key
```

保存好输出的 Key。在另一台机器登录时，会提示输入这个 Key。

## 使用

### 常用命令

手动同步：

```bash
atuin sync
```

查看统计信息：

```bash
atuin stats
```

### 搜索历史

Atuin 默认会接管 `Ctrl-R` 和 `Up` 键（取决于配置），提供一个全屏的交互式搜索界面。

你也可以使用命令行进行复杂的搜索：

*   **搜索当前目录下的命令**：
    ```bash
    atuin search --cwd . <query>
    ```

*   **搜索非 0 退出码（失败）的命令**：
    ```bash
    atuin search --exit 1 <query>
    ```

*   **搜索昨天的命令**：
    ```bash
    atuin search --after "yesterday"
    ```

### 导入旧历史

如果你之前使用 Zsh 或 Bash 的默认历史记录，可以将其导入 Atuin：

```bash
atuin import zsh
# 或
atuin import bash
```