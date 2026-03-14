---
layout: post
title: "zsh 配置文件解析及优先级"
aliases:
- "zsh 配置文件解析及优先级"
tagline: ""
description: ""
category: 学习笔记
tags: [ zsh, zsh-config, zshrc, zprofile, zshenv, bash, shell, ]
last_updated: 2026-03-11
---

zsh 有五个配置文件，每个文件在不同的场景下被加载，理解它们之间的区别对于正确配置 Shell 环境非常重要。

- `.zshenv`
- `.zprofile`
- `.zshrc`
- `.zlogin`
- `.zlogout`

在理解这些配置文件之前，需要先理解几个 Shell 类型的概念。

## Shell 类型

### Login Shell 和 Non-login Shell

Login Shell 是用户登录系统时启动的第一个 Shell，比如通过 SSH 登录远程服务器、在 macOS 上打开 Terminal.app（macOS 默认每次打开终端都是 login shell）、或者通过 `su - username` 切换用户。

Non-login Shell 则是在已登录的会话中启动的子 Shell，比如在终端中输入 `zsh` 启动一个新的子 Shell，或者执行一个 Shell 脚本。

可以通过以下方式判断当前 Shell 是否是 login shell：

```bash
# 如果输出包含 "login"，则是 login shell
echo $0
# login shell 会显示 -zsh，注意前面的 -
# non-login shell 会显示 zsh

# 或者使用
[[ -o login ]] && echo "login shell" || echo "non-login shell"
```

### Interactive Shell 和 Non-interactive Shell

Interactive Shell 是用户可以直接输入命令并看到输出的 Shell，也就是平时在终端中使用的 Shell。

Non-interactive Shell 则是用来执行脚本的 Shell，不需要用户交互，比如运行 `zsh script.sh` 时启动的 Shell。

```bash
# 判断是否是 interactive shell
[[ -o interactive ]] && echo "interactive" || echo "non-interactive"
```

理解了这些概念之后，再来看每个配置文件的作用就很清晰了。

## 各配置文件详解

### .zshenv

`.zshenv` 是所有配置文件中最先被加载的，而且无论什么类型的 Shell 都会加载它，包括 login shell、interactive shell、non-interactive shell（脚本执行），甚至通过 `ssh host command` 远程执行命令时也会加载。

正因为 `.zshenv` 总是会被读取，所以适合放置那些在任何场景下都需要生效的环境变量。

适合放在 `.zshenv` 中的内容：

```bash
# 默认编辑器，脚本中也可能需要用到
export EDITOR="vim"
export VISUAL="vim"

# 语言和编码设置
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"

# XDG Base Directory 规范
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_STATE_HOME="$HOME/.local/state"

# 开发工具的环境变量
export GOPATH="$HOME/go"
export CARGO_HOME="$HOME/.cargo"
export RUSTUP_HOME="$HOME/.rustup"

# 关于 $PATH 的设置：
# 虽然技术上可以在 .zshenv 中设置 $PATH，但要注意
# macOS 上 /etc/zprofile 中的 path_helper 会在 .zshenv 之后重新排列 $PATH
# 所以在 macOS 上建议在 .zprofile 或 .zshrc 中设置 $PATH
```

需要注意的是，`.zshenv` 不适合放置以下内容：

- 与终端交互相关的设置（prompt、aliases、key bindings），因为脚本执行时不需要这些
- 会产生输出的命令，因为这会干扰脚本和管道命令的执行
- 非常耗时的操作，因为每次启动任何 Shell 都会执行

一个实际的使用场景：假设你写了一个定时任务（cron job）调用一个 Shell 脚本，脚本中需要用到 `$EDITOR` 或者 `$GOPATH`，如果这些变量只在 `.zshrc` 中设置，cron 执行脚本时就找不到这些变量（因为 cron 启动的是 non-interactive non-login shell）。但如果设置在 `.zshenv` 中，就可以正确读取。

### .zprofile

`.zprofile` 在 login shell 启动时加载，在 `.zshenv` 之后、`.zshrc` 之前执行。它的定位和 Bash 中的 `.bash_profile` 一致，适合放置只需要在登录时执行一次的配置。

```bash
# 适合放在 .zprofile 中的内容

# PATH 设置（只在登录时设置一次，避免子 Shell 重复追加）
export PATH="$HOME/.local/bin:$HOME/go/bin:$PATH"

# Homebrew（macOS）
eval "$(/opt/homebrew/bin/brew shellenv)"

# 登录时启动的服务
# 比如启动 ssh-agent
eval "$(ssh-agent -s)"
```

### .zshrc

`.zshrc` 是大家最熟悉的配置文件，只在 interactive shell 启动时加载。每次打开一个新的终端窗口或者标签页都会执行。

```bash
# 适合放在 .zshrc 中的内容

# 命令别名
alias ll="ls -la"
alias gs="git status"
alias gd="git diff"

# Shell 选项
setopt AUTO_CD
setopt HIST_IGNORE_DUPS

# 命令提示符设置
PROMPT='%F{green}%n@%m%f:%F{blue}%~%f$ '

# 自动补全
autoload -Uz compinit && compinit

# 历史记录配置
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000

# 插件管理器（如 oh-my-zsh、zinit 等）
source ~/.oh-my-zsh/oh-my-zsh.sh

# 命令行工具的初始化（需要交互式 Shell 的）
eval "$(fzf --zsh)"
eval "$(zoxide init zsh)"
eval "$(starship init zsh)"

# key bindings
bindkey -v  # vi mode
```

### .zlogin

`.zlogin` 也是在 login shell 启动时加载，但它在 `.zshrc` 之后执行。它和 `.zprofile` 的区别在于执行顺序：`.zprofile` 在 `.zshrc` 之前，`.zlogin` 在 `.zshrc` 之后。

`.zlogin` 的名字来源于 csh 的 `.login` 文件。一般来说，如果已经使用了 `.zprofile`，就不需要再使用 `.zlogin`，反之亦然。不建议同时使用这两个文件，选择其中一个即可。

```bash
# 适合放在 .zlogin 中的内容

# 登录后执行的命令，比如显示系统信息
fortune
uptime

# 编译 zcompdump（在 .zshrc 中的 compinit 之后）
{
  zcompdump="${ZDOTDIR:-$HOME}/.zcompdump"
  if [[ -s "$zcompdump" && (! -s "${zcompdump}.zwc" || "$zcompdump" -nt "${zcompdump}.zwc") ]]; then
    zcompile "$zcompdump"
  fi
} &!
```

### .zlogout

`.zlogout` 在 login shell 退出时执行，适合放置清理操作。

```bash
# 适合放在 .zlogout 中的内容

# 清除终端屏幕
clear

# 清除临时文件
rm -f ~/.zsh_tmp_*

# 重置终端标题
echo -ne "\033]0;\007"
```

## 系统级配置文件

除了用户目录下的配置文件，zsh 还会读取 `/etc/` 目录下的全局配置文件，全局配置先于用户配置加载：

| 全局配置文件 | 对应的用户配置文件 |
|---|---|
| `/etc/zshenv` | `~/.zshenv` |
| `/etc/zprofile` | `~/.zprofile` |
| `/etc/zshrc` | `~/.zshrc` |
| `/etc/zlogin` | `~/.zlogin` |
| `/etc/zlogout` | `~/.zlogout` |

macOS 上需要特别注意 `/etc/zprofile` 文件，系统在这个文件中调用了 `path_helper`，它会重新排列 `$PATH` 的顺序。这意味着如果在 `~/.zshenv` 中设置了 `$PATH`，它可能会被 `/etc/zprofile` 中的 `path_helper` 打乱顺序。这就是为什么在 macOS 上推荐在 `~/.zprofile` 或 `~/.zshrc` 中设置 `$PATH` 而不是 `~/.zshenv`。

## 加载顺序总结

完整的加载顺序如下：

```
/etc/zshenv → ~/.zshenv → [/etc/zprofile → ~/.zprofile] → [/etc/zshrc → ~/.zshrc] → [/etc/zlogin → ~/.zlogin] → [~/.zlogout → /etc/zlogout]
```

用表格来展示不同 Shell 类型加载哪些配置文件：

| 配置文件 | Login Interactive | Login Non-interactive | Non-login Interactive | Non-login Non-interactive (脚本) |
|---|---|---|---|---|
| `.zshenv` | 加载 | 加载 | 加载 | 加载 |
| `.zprofile` | 加载 | 加载 | - | - |
| `.zshrc` | 加载 | - | 加载 | - |
| `.zlogin` | 加载 | 加载 | - | - |
| `.zlogout` | 加载 | 加载 | - | - |

可以看到 `.zshenv` 是唯一一个在所有场景下都会被加载的配置文件。

## 与 Bash 配置文件的对比

如果从 Bash 迁移到 zsh，可以参考以下对应关系：

| Bash | zsh | 说明 |
|---|---|---|
| `.bash_profile` | `.zprofile` | login shell 配置 |
| `.bashrc` | `.zshrc` | interactive shell 配置 |
| `.bash_login` | `.zlogin` | login shell（较少使用） |
| `.bash_logout` | `.zlogout` | 退出时执行 |
| 无对应 | `.zshenv` | zsh 独有，所有 Shell 都加载 |

## 实践建议

一个推荐的配置策略：

- `.zshenv`：放置与 Shell 类型无关的、最基础的环境变量（`EDITOR`、`LANG`、XDG 目录规范等）
- `.zprofile`：放置 `$PATH` 设置、Homebrew 初始化等只需在登录时执行一次的内容
- `.zshrc`：放置别名、函数、补全、提示符、插件、key bindings 等交互相关的配置
- `.zlogin`：一般不使用，或者用于登录后的欢迎信息
- `.zlogout`：清理操作，一般也很��使用

如果不确定某个配置应该放在哪个文件中，可以问自己：

1. 这个配置在执行脚本时也需要吗？如果是，放 `.zshenv`
2. 这个配置只需要在登录时执行一次吗？如果是，放 `.zprofile`
3. 这个配置和终端交互有关吗？如果是，放 `.zshrc`

## ZDOTDIR 自定义配置文件位置

zsh 支持通过 `ZDOTDIR` 环境变量自定义配置文件的查找路径，默认值是 `$HOME`。如果想把 zsh 配置文件集中管理，可以在 `~/.zshenv` 中设置：

```bash
# ~/.zshenv
export ZDOTDIR="$HOME/.config/zsh"
```

这样 zsh 就会从 `~/.config/zsh/` 目录下查找 `.zshrc`、`.zprofile` 等文件。注意 `.zshenv` 本身必须放在 `$HOME` 目录下（或者在 `/etc/zshenv` 中设置 `ZDOTDIR`），因为 zsh 需要先读取它才能知道 `ZDOTDIR` 的值。

## reference

- [Source](https://apple.stackexchange.com/a/388623/149497)
- [Zsh Documentation - Startup/Shutdown Files](https://zsh.sourceforge.io/Doc/Release/Files.html)
- [Arch Wiki - Zsh](https://wiki.archlinux.org/title/Zsh)
- [What should/shouldn't go in .zshenv, .zshrc, .zlogin, .zprofile, .zlogout?](https://unix.stackexchange.com/questions/71253/what-should-shouldnt-go-in-zshenv-zshrc-zlogin-zprofile-zlogout)
