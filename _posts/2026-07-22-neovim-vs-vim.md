---
layout: post
title: "NeoVim 和 Vim 对比：十年 Vim 用户的选择与思考"
aliases:
- "NeoVim 和 Vim 对比：十年 Vim 用户的选择与思考"
tagline: "从 fork 到分道扬镳，两个编辑器如今差在哪里"
description: "从架构、配置语言、LSP、Treesitter、插件生态和社区治理等多个维度对比 NeoVim 和 Vim，并结合我个人十多年的使用经验给出选择建议。"
category: 经验总结
tags: [ vim, neovim, editor, lua, lsp, treesitter, developer-tools ]
create_time: 2026-07-22 10:00:00
last_updated: 2026-07-22 10:00:00
---

翻了一下博客的归档，我从 2014 年就开始写 [[Vim]] 相关的文章了，从 buffer 管理、寄存器、宏，到各种插件的推荐，十多年下来积累了几十篇。这期间我也一直在 Vim 和 [[NeoVim]] 之间来回横跳：服务器上随手 `vi` 打开配置文件，本地开发用 NeoVim，在 [[Obsidian]] 和 [[IntelliJ IDEA]] 里也都装了 Vim 模拟插件。经常有朋友问我，现在 2026 年了，到底应该学 Vim 还是 NeoVim，两者到底差在哪里。这篇文章就把我这些年的观察和体验整理出来，希望能帮到还在纠结的人。

![NeoVim 与 Vim 对比插图](https://pic.einverne.info/images/neovim-vs-vim.png)

先说结论：对绝大多数把编辑器当作日常开发工具的人来说，直接用 NeoVim；但 Vim 本身并没有过时，它依然是每一台 Unix 机器上都能找到的可靠工具，而且两者的核心操作方式完全一致，学会一个就等于学会了另一个的百分之九十。

## 从一次分叉说起

NeoVim 诞生于 2014 年，起因是开发者 Thiago de Arruda 给 Vim 提交的异步任务支持补丁迟迟无法被合并。当时的 Vim 由作者 Bram Moolenaar 一个人主导，代码库里堆积了大量历史包袱，外部贡献者很难参与核心开发。于是 NeoVim 以 fork 的形式出现，口号是 "literally the future of vim"，目标是重构代码、开放治理、让 Vim 的编辑理念在现代化的架构上继续演进。

有意思的是，这次分叉反过来刺激了 Vim 的发展。NeoVim 发布异步 job 支持之后，Vim 8.0 很快也加入了自己的异步任务和 channel 机制；NeoVim 内置终端模拟器之后，Vim 8.1 也跟进了 `:terminal`。两个项目在竞争中互相追赶，用户是最大的受益者。

2023 年 8 月，Bram Moolenaar 去世，这对 Vim 社区是一个巨大的损失。此后 Vim 项目由 Christian Brabandt 等长期贡献者接手维护，进入了 Vim 9.1 时代。Vim 并没有像一些人担心的那样停滞，日常的补丁发布依然频繁，但大的方向性演进明显放缓，更多精力放在稳定性维护上。而 NeoVim 这边，0.5 版本内置 LSP 客户端是一个分水岭，之后的每个版本都在快速迭代，到 0.11 版本，LSP 的配置已经简化到几行代码就能启用。

## 架构与配置语言的差异

两者最根本的分歧在配置和扩展语言上。Vim 选择了自研的 Vim9 script，这是一门为了性能重新设计的脚本语言，相比传统 Vimscript 有数量级的速度提升，但它依然是一门只在 Vim 里使用的私有语言，你在别的地方学到的编程经验很难迁移过来，在 Vim 里学到的语言知识也带不走。

NeoVim 则把 [[Lua]] 作为一等公民。Lua 是一门在游戏开发、嵌入式领域广泛使用的通用语言，语法简单，性能出色（LuaJIT 的执行速度接近原生代码）。整个 NeoVim 的 API 都暴露给了 Lua，配置文件可以直接用 `init.lua` 来写：

```lua
-- ~/.config/nvim/init.lua
vim.opt.number = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.clipboard = "unnamedplus"

vim.keymap.set("n", "<leader>w", ":w<CR>", { desc = "Save file" })
```

对比一下等价的 Vimscript 写法，其实差别不算大，但当配置膨胀到几百行、开始涉及函数、模块、条件逻辑的时候，Lua 的工程化优势就体现出来了。你可以把配置拆分成模块，用 `require` 引入，写单元测试，甚至用 LSP 补全你自己的配置代码。现代 NeoVim 插件几乎清一色用 Lua 编写，开发体验和传统 Vimscript 插件完全不在一个量级。

另一个架构层面的差异是 RPC API。NeoVim 从设计之初就把界面和核心分离，任何程序都可以通过 msgpack-rpc 协议和 NeoVim 实例通信。这带来了一个繁荣的 GUI 生态：Neovide 提供平滑动画和 GPU 渲染，Firenvim 可以把浏览器里的文本框变成 NeoVim，VSCode 的 vscode-neovim 插件甚至直接嵌入一个真实的 NeoVim 实例来驱动编辑操作，而不是模拟按键。Vim 虽然也有 gVim 和一些第三方 GUI，但深度和广度都无法相比。

## LSP 与 Treesitter 才是真正的分水岭

如果说配置语言的差异还只是口味问题，那么内置 LSP 客户端和 [[Treesitter]] 支持就是实打实的能力差距了。

LSP（Language Server Protocol）是现代编辑器智能能力的基石，代码补全、跳转定义、查找引用、重命名、诊断信息都依赖它。NeoVim 从 0.5 开始内置了 LSP 客户端，到 0.11 版本，启用一个语言服务器只需要这样几行：

```lua
vim.lsp.enable('pyright')
vim.lsp.enable('rust_analyzer')
```

配合 mason.nvim 这样的工具，语言服务器的安装管理也是全自动的。而在 Vim 这边，想要同样的体验需要依赖 coc.nvim（本质上是跑了一个 Node.js 进程）或者 vim-lsp 这样的第三方插件，能用，但始终隔了一层，配置的复杂度和运行时的开销都更高。

Treesitter 则解决了另一个老大难问题：语法高亮。传统 Vim 的高亮基于正则表达式匹配，速度慢而且经常出错，遇到复杂的嵌套结构（比如 JSX、模板字符串里的 SQL）就束手无策。Treesitter 通过增量解析生成真正的语法树，高亮精确到语义级别，还能基于语法树做代码折叠、结构化选择、文本对象扩展。我第一次在 NeoVim 里用 Treesitter 提供的 `af`/`if`（选中整个函数）文本对象时，那种"编辑器真的理解我的代码"的感觉是很难回去的。这个能力 Vim 至今没有对等的方案。

## 插件生态与开箱体验

十年前装 Vim 插件，流程是找到 GitHub 仓库、选一个插件管理器（Vundle、vim-plug）、复制配置、祈祷不冲突。今天的 NeoVim 生态已经完全不同了。lazy.nvim 提供了带懒加载、版本锁定、依赖管理的现代插件管理体验；Telescope 和 fzf-lua 把模糊搜索做成了统一的界面层；更重要的是出现了 LazyVim、kickstart.nvim、AstroNvim 这样的发行版，新手可以在十分钟内得到一个功能对标 [[VS Code]] 的开发环境，然后再按需裁剪。

这里我想给一个可能有点反直觉的建议：如果你是想认真学习 NeoVim 而不只是用它，不要从大而全的发行版开始，而是从 kickstart.nvim 这种单文件、注释详尽的起点开始。发行版帮你做了太多决定，出问题的时候你根本不知道是哪一层的问题；而一份自己亲手长出来的配置，每一行你都知道为什么存在。我自己踩过的坑是早年直接抄了别人几千行的 vimrc，结果每次报错都要花半天定位，最后干脆删掉重写，反而轻松了。

Vim 的插件生态并没有消失，vim-surround、vim-repeat、vim-fugitive 这些经典插件依然坚挺，而且大部分老插件在 NeoVim 里也能直接运行，因为 NeoVim 保持了对 Vimscript 的兼容。但方向是明显的：新的、有野心的插件几乎全部只支持 NeoVim，因为作者们需要 Lua、需要内置 LSP、需要 Treesitter 的 API。

## Vim 依然有它的位置

说了这么多 NeoVim 的好话，我并不认为 Vim 已经可以被扫进历史。有几个场景 Vim 依然是更好的、甚至是唯一的选择。

第一是服务器环境。几乎所有 Linux 发行版都预装了 Vim 或者至少是 vi，当你 SSH 到一台生产机器上改配置文件时，可用的就是它。这也是我一直强调的一点：核心的 Vim 操作能力（动作、文本对象、寄存器、宏）才是真正值钱的技能，它在 Vim、NeoVim、IdeaVim、Obsidian Vim 模式里通用，值得刻意练习。

第二是稳定性和确定性。Vim 的更新极其保守，一份十年前的 vimrc 今天大概率还能原样工作。NeoVim 的快速迭代是双刃剑，大版本升级偶尔会有破坏性变更，插件跟着 API 演进，如果你几个月不更新，一次 `lazy.nvim` 全量升级后出几个报错并不罕见。对于把编辑器当成"装好就不想再动"的基础设施的人，Vim 的性格反而更合适。

第三是资源占用和启动速度。两者其实都很快，但一个裸的 Vim 在任何嵌入式或者资源受限的环境下都能跑，这是它作为"Unix 传统工具"的身份带来的价值。

## 迁移建议与避坑指南

如果你现在是 Vim 用户，想迁移到 NeoVim，过程比想象中平滑。NeoVim 兼容绝大部分 Vimscript，最简单的做法是先让 NeoVim 直接加载你现有的 vimrc：

```vim
" ~/.config/nvim/init.vim
set runtimepath^=~/.vim runtimepath+=~/.vim/after
let &packpath = &runtimepath
source ~/.vimrc
```

跑通之后再逐步把配置迁移到 Lua，不必一步到位。几个我踩过的坑也一并记录：剪贴板在 Linux 下需要额外安装 `xclip` 或 `wl-clipboard`，否则 `"+y` 不生效；NeoVim 的配置目录是 `~/.config/nvim`；coc.nvim 和内置 LSP 不要混用，选一条路线走到底；升级 NeoVim 大版本前先看 release note 里的 breaking changes，尤其是依赖 `vim.lsp` 旧式配置写法的部分。

还有一个容易被忽略的点：如果你在服务器上工作时间很长，与其纠结服务器上装不装 NeoVim，不如把本地的 NeoVim 配置好，然后用它自带的远程编辑能力，或者干脆用 `scp`/sshfs 的方式在本地编辑远程文件。把重型配置留在本地，让服务器上的 vi 保持朴素。

## 最后

回头看这十二年，NeoVim 的分叉是开源世界里少有的双赢故事：它没有杀死 Vim，反而逼着 Vim 加入了异步和终端支持；它自己也从一个"愤怒的 fork"成长为架构清晰、社区治理健康、生态繁荣的现代编辑器。今天的选择其实很清晰：日常开发的主力编辑器用 NeoVim，享受 Lua、LSP、Treesitter 带来的现代体验；同时保持对原生 Vim 操作的熟练，让自己在任何一台机器上都不至于束手无策。

