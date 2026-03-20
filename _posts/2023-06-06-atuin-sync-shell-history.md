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
last_updated: 2026-03-18 00:00:00
---

[Atuin](https://atuin.sh/) 是一个可以同步，备份 Shell 命令历史的服务。借助 Atuin 可以在多台设备之前同步 Shell 命令历史，所有的命令都在数据库（SQLite）中加密存储。

它不仅可以同步历史记录，还提供了一个更好的 `Ctrl-R` 交互界面，支持模糊搜索、按目录过滤、按退出码过滤等功能。

## 同步机制

Atuin 默认会将本地所有历史同步上传到服务器。在执行 `atuin sync` 或每隔一段时间（默认 `1h`）自动触发同步时，会将本地 SQLite 数据库中的所有 shell 历史上传到服务器。这包括通过 `atuin import auto` 导入的旧历史记录，也包括之后新增的命令。

### 端对端加密

所有历史在离开本机之前都会被加密，具体流程如下：

- Atuin 在注册时本地生成一个对称加密密钥，该密钥只存储在你的设备上，从不上传
- 历史记录先在本地加密，然后以密文形式发送到服务器
- 服务器运营者（包括 Atuin 官方）无法读取你的任何历史内容
- 要在另一台机器同步，需要通过 `atuin key` 获取密钥并手动传递

### 控制同步行为

| 场景 | 做法 |
|------|------|
| 完全不使用同步 | 不注册账号，纯本地使用 |
| 自建服务器 | 部署自托管 Atuin Server（支持 Docker） |
| 调整同步频率 | 修改 `~/.config/atuin/config.toml` 中的 `sync_frequency` |
| 从服务器删除数据 | 执行 `atuin account delete`，不影响本地数据 |

### 本地数据说明

本地历史是明文存储在 SQLite 数据库中的（为了支持本地搜索），只有上传到服务器时才加密。所以本地文件本身没有加密保护，需要注意本机安全。

如果你对隐私比较在意，推荐的做法是自建 Atuin Server，这样数据完全在自己的基础设施上，同时仍然享受端对端加密的双重保障。

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

Atuin 安装后只会记录之后执行的命令，安装之前的历史仍然保存在 shell 原生的历史文件中，需要手动导入。

```bash
# 自动检测当前 shell 并导入（推荐）
atuin import auto

# 或者指定 shell 类型
atuin import zsh
atuin import bash
atuin import fish
```

如果历史文件不在默认位置，可以手动指定路径：

```bash
HISTFILE=/path/to/your/.zsh_history atuin import zsh
```

导入完成后会显示类似 `Imported 500 old history entries.` 的提示。

导入完成后，执行同步，这些历史就会被加密上传到服务器：

```bash
atuin sync
```

需要注意：

- 原始的 `.zsh_history` / `.bash_history` 文件不会被删除或修改，Atuin 只是读取并复制内容进自己的 SQLite 数据库
- 旧历史文件通常缺少时间戳，Atuin 会自动补填（以当前时间为基准递增 1ms），因此这部分历史的时间信息不精确
- 不要重复执行 `atuin import`，否则会产生大量重复条目，且目前难以清理

## 在新机器上同步

整个流程分三步：在第一台机器获取 key，新机器安装并登录，然后同步。

### 获取加密密钥

在已有 Atuin 的机器上执行，记录输出的密钥（一串助记词）：

```bash
atuin key
# 输出类似：express spot simple ocean foil ...
```

这个 key 是解密历史的唯一凭证，请存入密码管理器，切勿泄露。

### 新机器安装 Atuin

```bash
# 安装
curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh

# 添加 init 到 rc 文件（以 zsh 为例）
echo 'eval "$(atuin init zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 登录并同步

```bash
atuin login -u <用户名>
# 会依次提示输入密码和上面的 key
```

或者一行命令直接传入：

```bash
atuin login -u <用户名> -p <密码> -k "express spot simple ocean foil ..."
```

登录后执行同步：

```bash
atuin sync
```

如果同步后历史不完整，这通常是 sync v2 版本不一致导致的。确保新机器配置文件 `~/.config/atuin/config.toml` 中已启用：

```toml
[sync]
records = true
```

然后强制全量拉取：

```bash
atuin store pull
atuin sync -f
```

之后 `Ctrl+R` 即可在新机器上搜索到来自其他机器的所有历史。

## 合并多台机器的历史

在新机器上登录完成后，按顺序执行：

```bash
# 1. 先将新机器的本地 shell 历史导入 Atuin
atuin import auto

# 2. 再同步（上传本地 + 下载服务器历史）
atuin sync
```

Atuin 使用 append-only 事件日志（每条历史都有唯一 UUID + 时间戳）进行合并，来自不同机器的记录会直接合并在一起。搜索时默认展示所有机器的历史，可通过 `Ctrl+R` 后按 `Alt+H` 切换显示范围（仅当前主机 / 全部）。

### 关于重复条目

`atuin import` 不做去重，所以有一个重要原则：

- `import` 只在初始迁移时执行一次，之后绝对不要再运行
- 如果已经重复导入导致条目翻倍，可以用以下命令清理（较新版本支持）：

```bash
# dry-run 先预览
atuin history dedup --dry-run --dupkeep 1 --before "$(date +%Y-%m-%d)"

# 确认无误后执行
atuin history dedup --dupkeep 1 --before "$(date +%Y-%m-%d)"
```

`--dupkeep 1` 表示每个相同命令保留 1 条，`--before` 建议设为今天，避免误删新历史。

## Ctrl+R 工作原理

Atuin 接管 `Ctrl+R` 的机制本质上是利用各 shell 自身的键绑定系统，将原生的 reverse-search 替换为 Atuin 的 TUI 界面。

### Shell Init Script 做了什么

执行 `eval "$(atuin init zsh)"` 时，Atuin 会向当前 shell 注入一段脚本，核心逻辑分两部分：

1. 重新绑定按键：用 shell 内置的 bindkey（zsh）/ bind（bash）/ bind（fish）命令，将 `Ctrl+R` 和 `↑` 从原生历史搜索重映射到 Atuin 的自定义函数
2. 注册 hook：在每条命令执行前后（`preexec` / `precmd`）注入 hook，用于将新命令实时写入 Atuin 的 SQLite 数据库

各 shell 的绑定方式：

| Shell | 绑定机制 |
|-------|---------|
| Zsh | `bindkey '^R' _atuin_search_widget` |
| Bash | `bind -x '"\C-r": __atuin_history'`，依赖 `bash-preexec` 库 |
| Fish | `bind \cr _atuin_search` |

### 按下 Ctrl+R 后的执行流程

1. Shell 捕获按键，触发绑定的 Atuin 函数
2. 该函数调用 `atuin search --interactive`，启动全屏 TUI 界面（用 Rust 的 `ratatui` 库渲染）
3. TUI 实时查询本地 SQLite 数据库，支持 prefix / fulltext / fuzzy 三种搜索模式
4. 用户按 `Enter` 后，所选命令被写回到 shell 的当前命令行缓冲区（而非直接执行），按 `Tab` 可继续编辑

### 可配置的行为

如果不想接管 `↑` 键，或想自定义绑定，可在 `~/.config/atuin/config.toml` 中调整：

```toml
[keys]
scroll_exits = false   # 按 Ctrl+C 退出时不清空输入
```

在 shell rc 文件中可用参数控制绑定：

```bash
# 不接管上箭头
eval "$(atuin init zsh --disable-up-arrow)"

# 不接管 Ctrl+R
eval "$(atuin init zsh --disable-ctrl-r)"
```

这样你可以只用 `atuin search -i` 手动触发，同时保留 shell 原生的 `Ctrl+R` 行为。

## 常见问题

### ATUIN_SESSION 未设置

如果执行 `atuin sync` 时提示 `ATUIN_SESSION` 环境变量未设置，这个错误的根本原因是 shell 插件（init script）没有被正确加载。

确认当前 shell：

```bash
echo $SHELL
```

检查 rc 文件是否有 init 配置。Zsh 检查 `~/.zshrc`：

```bash
eval "$(atuin init zsh)"
```

Bash 检查 `~/.bashrc`：

```bash
. "$HOME/.atuin/bin/env"
[[ -f ~/.bash-preexec.sh ]] && source ~/.bash-preexec.sh
eval "$(atuin init bash)"
```

Fish 检查 `~/.config/fish/conf.d/atuin.fish`：

```fish
atuin init fish | source
```

如果缺少这些行，手动添加到对应文件。重新加载配置并验证：

```bash
# 重新加载（以 zsh 为例）
source ~/.zshrc

# 验证环境变量是否存在
echo $ATUIN_SESSION   # 应输出一个 UUID

# 再次执行同步
atuin sync
```

如果 sync 提示 history store 为 0，这是 Atuin v18 引入的新 record store 机制导致的，执行以下命令初始化并迁移历史：

```bash
atuin history init-store
atuin sync
```

这会将旧 SQLite 历史迁移到新的 record store 格式，之后即可正常同步。

### Warp 终端兼容性

Warp 和 Atuin 目前无法完全兼容。Warp 自己完全接管了终端的输入处理层（不走标准的 shell readline），因此 shell 的 `bindkey` / `bind` 命令对 Warp 无效。

虽然 `Ctrl+R` 绑定失效，但 Atuin 的同步和存储功能仍然正常工作。可以用以下方式手动调用 TUI：

```bash
# 直接启动 Atuin TUI
atuin search -i

# 推荐设置一个简短 alias 放到 ~/.zshrc
alias hh='atuin search -i'
```

但注意：在 Warp 中选中命令后无法自动填入输入框，只能手动复制粘贴。

如果你重度依赖 Atuin 的 `Ctrl+R` 体验，建议切换到兼容的终端：

| 终端 | Atuin 兼容性 |
|------|------------|
| iTerm2 | 完全兼容 |
| Kitty / Alacritty | 完全兼容 |
| [[Ghostty]] | 完全兼容 |
| Warp | bindkey 失效，TUI 无法回填命令行 |