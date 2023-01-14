---
layout: post
title: "Warp 终端初体验"
aliases:
- "Warp 终端初体验"
tagline: ""
description: ""
category: 产品体验
tags: [ terminal, macos, warp, rust, gpu, command, iterm, tmux, vim, zsh ]
last_updated: 2022-04-09 11:40:58
create_time: 2022-04-09 10:41:21
---

Warp 是一个 Rust 编写，使用 GPU 渲染的终端(terminal)应用。目标是提升开发者的效率。

- <https://www.warp.dev/>

最近 Warp 发布了新闻稿，筹集了 2300 万美元的资金全力用来构建这个终端。

它之前筹集了 600 万美元的种子轮融资，由 GV 领投，Neo 和 BoxGroup 参投。还筹集了 1700 万美元的 A 轮融资，由 Figma 的联合创始人兼首席执行官 Dylan Field 领投。由企业家主导的这一轮投资，其参与者包括 Elad Gil、LinkedIn 前首席执行官 Jeff Weiner 和 Salesforce 的联合创始人兼联合首席执行官 Marc Benioff。

## Warp 想要解决的问题

### 简化配置
上手体验的过程也可以知道，Warp 基本上没什么配置，基本上所有的功能都是内建快捷键调用，对新手非常友好。

### 速度
早在之前的文章中我就 [提到过](/post/2020/10/use-zinit-to-manage-zsh-plugins.html) 因为使用越来越多的 zsh 插件，导致每一次打开新的 Tab 终端都要有一个明显的停顿，虽然后来使用 zinit 优化了一下插件加载，但是还是会感觉到一小点的卡顿，希望 Warp 能解决这个问题吧。

通过终端自身的能力，可以精减掉一些 zsh 的插件。

### 更加智能
Warp 的创始人 Zach Lloyd 说过，走过任何一个开发人员的桌面，都会看到一个打开的终端，还有代码编辑器，VS Code 完成了代码编辑器的重新定义，Warp 就去重新定义终端。

Warp 内置的命令自动补全，还有尚且不是很完善的 AI 搜索都是朝着智能化的方向前进的。GitHub Copilot 已经让我非常惊讶其代码自动补全的能力，我相信 Warp 未来在 AI 自动补全方面也会令人耳目一新。

### 协作
Warp 的创始人在总结其过去 20 年的程序生涯的时候说过现存的终端存在的两个痛点：

- 难用
- 只能一个人用

想来和他自身作为 Google Docs 的开发有着非常大的关系。当前的任何桌面程序如果加上了多人协作都是一个非常大的想象空间。那为什么终端不行？

在 Warp 中用户可以共享自己的命令行，设置，和历史。

## 上手体验
可以点击 [这里](https://app.warp.dev/referral/7GVDWJ) 下载体验。

### 登录不上问题
如果在国内，大概率会卡在登录的界面（在还没有开放 beta testing 的时候会卡在输入邀请码的界面）。

这个时候需要本地其一个 1080 端口的代理，然后使用代理来启动 Warp：

```
export HTTP_PROXY=http://127.0.0.1:1080
export HTTPS_PROXY=http://127.0.0.1:1080

/Applications/Warp.app/Contents/MacOS/stable
```

在 macOS 上推荐使用 [Clash for windows](https://docs.gtk.pw/contents/macos/cfw.html) 。

### 几个重要的快捷键

- `ctrl` + `shift` + `r` 可以从社区或者自定义的命令中搜索并执行长命令
- `cmd` + `p` 非常常见的 Command Palette，现在很多应用都使用这个涉及，我现在在用的 Obsidian 也是，可以调用出应用内置的命令
- `ctrl` + `r` 搜索历史
- `cmd` + `d` 切分窗口
- `ctrl` + `cmd` + `t` 用来切换主题！

更多的快捷键可以在设置中查看。

### 自动补全
Warp 自带了命令的补全，效果还不错。

![warp auto suggestions](https://photo.einverne.info/images/2022/04/09/5qcI.png)

Warp 提供了对于命令结果的快速复制，以及分享，点击 Share 可以非常轻松的把命令结果分享给别人。

![warp command copy](https://photo.einverne.info/images/2022/04/09/59r4.png)

比如对于我上面的 `git --help` 的结果可以到 [这里查看](https://app.warp.dev/block/XxeO8Htvba4TiHAmOwGwGU)

当然如果没有 Warp，我会在 Tmux 中用 Tmux 的复制粘贴来实现这个需要。

## 存在的问题

- 一个终端竟然需要登录！当然我能理解这样的一个商业模式，毕竟这款终端可能未来会商业化，向用户收费，但如果要让我付费，可能我会去看看其带给我的体验是不是要好过目前的方案。并且前期在测试阶段为了不扩大 bug 可能产生的负面影响，所以在有限人群内测试都是可以理解的。
- Warp 破坏掉了我之前的 fzf 的一些操作，比如我之前设定 `fe` 就是 fuzzy find 当前目录，然后输入模糊搜索词，回车之后就会立即用 vim 编辑，但是在 Warp 中并不能用 fzf。

当然这可能和 fe 使用的 zsh 脚本有关系，有时间再看看怎么解决。

```
which fe
fe () {
    local files
    IFS=$'\n' files=($(fzf-tmux --query="$1" --multi --select-1 --exit-0))
    [[ -n "$files" ]] && ${EDITOR:-vim} "${files[@]}"
}
```

## 总结
Warp 不需要用户查看文档也可以有一个不错的上手体验，更不像其他终端那样需要一个非常复杂的配置文档才能将其调教得比较好用。

如果你看完这篇文章觉得 Warp.dev 还不错，可以点击 [我的邀请](https://app.warp.dev/referral/7GVDWJ) 来尝试一下。

## 相关联终端

- 在 macOS 上我一直都用的 [kitty](/post/2020/08/cross-platform-gpu-based-terminal-emulator-kitty.html) 这样一款终端，通过简单的配置，日常用起来目前还没有遇到比较大的问题，配合 zsh, tmux 还算得上顺手
- [[Mac 应用 iTerm2]] 是一款比较正统的终端
- [[Mac 应用 alacritty 终端]] 也是一款 GPU 加速终端
- [[hyper.is]] 一款基于 Electron 的终端
- [[wezterm-terminal]] 是另一款 GPU 加速的终端，用 Rust 和 Lua 编写的，轻度体验了一下确实比较快，但是最近还没来得及深度体验。
- [fig.io](https://fig.io/) 是一款可以嵌入到其他 IDE 内部使用的终端，也实现了命令的自动补全等等功能。

## reference

- <https://docs.warp.dev/>
- <https://www.warp.dev/blog/fantastic-terminal-programs-and-how-to-quit-them-2>
