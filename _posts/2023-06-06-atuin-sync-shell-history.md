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

## 相关命令

安装 Atuin 命令行工具

```
brew install atuin
```

安装完成之后配置 ZSH

```
echo 'eval "$(atuin init zsh)"' >> ~/.zshrc
```

配置服务器地址，首先创建一个配置文件

```
vi ~/.config/atuin/config.toml
sync_address = "https://atuin.xxx.com"
```

注册帐号

```
atuin register -u username -e email@gmail.com -p password
```

登录

```
atuin login -u username -p password
```

同步

```
atuin sync
```
