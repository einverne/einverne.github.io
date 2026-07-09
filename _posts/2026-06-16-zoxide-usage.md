---
layout: post
title: "zoxide：让目录跳转快到飞起的 cd 替代品"
aliases: ["zoxide：让目录跳转快到飞起的 cd 替代品"]
tagline: "告别重复输入长路径，一个命令跳到任意目录"
description: "zoxide 是用 Rust 编写的智能 cd 替代工具，通过频率和时效算法学习你的目录使用习惯，让目录跳转变得极其高效。"
category: 经验总结
tags: [zoxide, terminal, cli, shell, productivity]
create_time: 2026-06-16 10:00:00
last_updated: 2026-06-16 10:00:00
---

很早之前就将 zoxide 放到了我的 [dotfiles](https://github.com/einverne/dotfiles.git) 中，但是却发现没有好好总结一下它的用法，前两天用 Atuin 总结了一下终端下每天高频使用的命令，切换目录的使用频率遥遥领先，所以我觉得是时候好好来介绍一下 zoxide 的使用来加速终端下切换目录的操作效率。zoxide 能学习我们的行为习惯，让我们用几个字母就跳到任意常用目录。

![zoxide 终端目录跳转示意图](https://pic.einverne.info/images/2026-06-16-10-00-00-zoxide-terminal.png)

## zoxide 是什么

zoxide 是用 Rust 编写的智能目录跳转工具，可以看作是 `cd` 命令的进化版。它的核心原理是"frecency"算法——即 frequency（频率）和 recency（时效性）的结合。你越频繁访问某个目录、最近访问时间越新，这个目录的权重就越高。当你输入一个关键词时，zoxide 会从历史记录里找出权重最高的匹配项，直接跳过去，整个过程几乎在瞬间完成。

这个想法最早来自经典工具 [[autojump]] 和 [[z.sh]]，但 zoxide 用 Rust 重写，性能大幅提升，而且跨平台支持更完善，能和几乎所有主流 Shell 配合使用，包括 bash、zsh、fish、nushell，以及 PowerShell（Windows）。项目本身也非常活跃。

## 安装

不同系统下安装方式各有不同，但都很简单。

macOS 用户直接用 [[Homebrew]]：

```bash
brew install zoxide
```

Linux 用户根据发行版选择：

```bash
# Debian/Ubuntu
sudo apt install zoxide

# Arch Linux
sudo pacman -S zoxide

# 或者用 cargo 从源码安装（需要 Rust 工具链）
cargo install zoxide --locked
```

Windows 用户可以用 winget 或 Scoop：

```bash
winget install ajeetdsouza.zoxide
# 或
scoop install zoxide
```

安装完成之后，还需要在 Shell 配置文件里加上初始化命令，这一步是必须的，否则 zoxide 不会工作。

对于 zsh 用户，在 `~/.zshrc` 末尾添加：

```bash
eval "$(zoxide init zsh)"
```

bash 用户对应的是 `~/.bashrc`：

```bash
eval "$(zoxide init bash)"
```

fish 用户则在 `~/.config/fish/config.fish` 里加：

```fish
zoxide init fish | source
```

添加完之后重启终端，或者执行 `source ~/.zshrc`（zsh 用户）让配置立即生效。

## 基本使用

初始化之后，你会得到两个命令：`z` 和 `zi`。

`z` 是最常用的，用法和 `cd` 类似，但它接受关键词而不是完整路径：

```bash
z projects      # 跳转到包含 "projects" 的最高权重目录
z foo bar       # 跳转到同时包含 "foo" 和 "bar" 的目录
z proj src      # 比如可以跳到 ~/work/projects/src 这样的路径
z -             # 返回上一个目录，等同于 cd -
```

一开始 zoxide 的数据库是空的，它会记录你用 `z` 命令访问过的每个目录。随着使用时间的增加，它对你习惯的理解会越来越准确，跳转也会越来越精准。如果你想提前把常用目录加进去，可以手动添加：

```bash
zoxide add ~/work/projects
zoxide add ~/dotfiles
```

## 进阶技巧

### 用 zi 做交互式选择

`zi` 命令会启动交互式选择界面（需要安装 [[fzf]]），把所有匹配的目录列出来供选择，用键盘上下移动，回车确认：

```bash
zi             # 打开所有历史目录的交互选择
zi projects    # 先按 "projects" 过滤，再交互选择
```

这个功能在你忘记具体目录名、或者有多个同名目录时特别有用，直接看列表选，不用猜。

### 替换 cd 命令

如果你想彻底把 `cd` 替换掉，可以在初始化时加上 `--cmd cd` 参数：

```bash
eval "$(zoxide init zsh --cmd cd)"
```

这样你原来的 `cd` 命令就直接变成了 zoxide，完全无缝，不用改变使用习惯，但又享受到了智能跳转的能力。需要用到传统 `cd` 的场景（比如跳到根目录），直接输入完整路径依然有效，不会受到影响。

### 查看和管理数据库

随时可以查看 zoxide 记录了哪些目录：

```bash
zoxide query -l           # 列出所有已记录的目录（按权重排序）
zoxide query -l projects  # 列出匹配 "projects" 的所有目录
```

如果某个目录已经不存在，或者你不再需要它出现在结果里，可以手动删除：

```bash
zoxide remove /old/path
```

数据库文件本身位于 `~/.local/share/zoxide/db.zo`，是一个二进制文件。运行 `zoxide edit` 可以打开一个可编辑的文本界面来手动修改权重或删除条目，方便做清理。

### 绑定快捷键提升效率

把 `zi` 绑定到快捷键上之后，工作流会更流畅。在 `.zshrc` 里加上一行：

```bash
bindkey '^F' zi  # Ctrl+F 打开交互式目录选择
```

这样在终端任意位置按 `Ctrl+F`，zoxide 的目录选择器就会弹出来，配合 [[fzf]] 的模糊搜索，比任何文件管理器都快得多。

### 配合 fzf 发挥最大效果

[[fzf]] 和 zoxide 是天然的好搭档。安装 fzf 之后，`zi` 的交互界面会自动使用它来做模糊匹配，输入目录名的任意片段都能快速定位。如果你的 fzf 配置了预览功能，还能在选择目录时实时看到目录内容，非常方便。

```bash
# 确认 fzf 已安装
brew install fzf  # macOS
apt install fzf   # Ubuntu/Debian
```

## 常见使用场景

有几个具体场景让我明显感受到了效率提升。在多个项目之间频繁切换时，以前需要记住每个项目的完整路径，现在只需要 `z proj-name` 就搞定了，随着使用频率的积累，输入前两三个字母就能精确跳转。进入深层嵌套的配置目录时也省事很多，比如跳到 `~/.config/nvim/lua/plugins` 这种路径，直接 `z plugins` 就到了，不用一层一层 `cd` 进去。在不同机器或不同工作环境之间切换时，zoxide 的数据库是针对每台机器独立的，初期需要一段时间积累历史，但用不了几天就能达到满意的准确率。

## zoxide vs zsh-z：如何选择

在切换到 zoxide 之前，我用的是 `zsh-z`（`agkozak/zsh-z`），它是经典 `z.sh` 的 Zsh 原生重写版本。两者的核心思路相同，都基于 frecency 算法，但有几个值得关注的差异。

### 实现语言与性能

`zsh-z` 是纯 Zsh 脚本，无需外部二进制，对 Zsh 内建功能的依赖更彻底，在插件管理器（如 zinit）的懒加载场景下启动开销极小。zoxide 用 Rust 编写，运行时是一个独立的二进制文件，单次查询速度更快，但需要通过 `eval "$(zoxide init zsh)"` 注入钩子，有轻微的初始化成本。

### 依赖与可移植性

`zsh-z` 零依赖，只要有 Zsh 就能用，不依赖任何外部命令（原版 `z.sh` 还需要 `awk`）。zoxide 则需要提前安装二进制，在服务器或容器等最小化环境里，`zsh-z` 的部署更省事。

### 功能差异

| 特性 | zsh-z | zoxide |
|------|-------|--------|
| 实现语言 | 纯 Zsh | Rust |
| 外部依赖 | 无 | 需安装二进制 |
| 交互式选择 | 无内置（需手动配合 fzf） | 内置 `zi` 命令 |
| Shell 支持 | 仅 Zsh | bash/zsh/fish/nushell/PowerShell |
| 数据库格式 | 纯文本（`~/.z`） | 二进制（`~/.local/share/zoxide/db.zo`） |
| `cd` 替换 | 需手动设置别名 | `--cmd cd` 参数直接替换 |
| 大小写不敏感 | `ZSHZ_CASE=ignore` | 默认支持 |

### 选哪个

如果你的工作环境只有 Zsh、追求零依赖和极简配置，`zsh-z` 完全够用，行为上与原版 `z.sh` 高度兼容，几乎没有学习成本。如果你同时使用多种 Shell、需要内置的交互式选择（`zi`）、或者希望跨平台一致的体验，zoxide 是更现代的选择。两者的 frecency 核心逻辑没有本质区别，日常使用感受差距不大，差异更多体现在生态整合和边缘功能上。

## 最后

用了 zoxide 大概一两周之后，我基本上忘记了普通 `cd` 的存在。它最打动我的地方不是功能有多复杂，而是它真的很懂你——随着使用时间增加，它对目录使用习惯的预测准确率越来越高，高频目录两三个字母就能跳到，低频或模糊的情况也有 `zi` 兜底。这种"越用越顺手"的感觉，正是一个好工具应该有的样子。如果你是终端重度用户，强烈建议花五分钟装上试试，几乎零学习成本，但带来的效率提升是实实在在的。
