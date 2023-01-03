---
layout: post
title: "espanso：Rust 编写的跨平台开源文本扩展工具"
aliases: 
- "espanso：Rust 编写的跨平台开源文本扩展工具"
tagline: ""
description: ""
category: 产品体验
tags: [ linux, macos, keyboard, text-expander,  ]
last_updated:
---

今天在 review tldr 提交的新命令的时候发现了一个新的工具 espanso，查看其官网发现是一个文本扩展的工具。在之前 macOS 上短暂的体验过 [[Keyboard Maestro]] 但因为其是 macOS 独占，所以之后再回到 Ubuntu 下的时候就渐渐不用了，并且其授权还挺贵的。然后就一直使用 RIME 配置自定义的短语来作为短语的快捷输入，比如输入 date 的时候自动在候选词中添加日期。但这样的问题便在于每一次更改 RIME 的配置文件都需要经历 RIME 部署这样一个漫长的过程。并且可扩展性也不强。于是想来体验一下 espanso 。

[[Espanso]] 是一个使用 Rust 实现的跨屏平台的 Text Expander，可以在任何编辑器中扩展短语。可以完美代替 [[Keyboard Maestro]] 的 Text Expand 功能。

官网地址：

- <https://espanso.org>

特性：

- 扩展功能强，可以通过 package 扩展
- 响应速度快，我下载体验后没有任何卡顿
- 支持 form 和 regex
- 文档完善
- 完成度高
- 定义光标位置
- 支持剪贴板
- 可以自动填充图像
- 支持扩展外部脚本（任何语言）
- 用于特定程序匹配

## 安装

在 macOS 上：

    brew tap federico-terzi/espanso
    brew install espanso
    espanso --version

然后使用 `espanso register` 启用。

在 Linux 上：

    sudo snap install espanso --classic

安装完成后执行：

    espanso start

启动后台任务。这样在任何编辑器中输入 `:espanso` 会自动转变成 `Hi there!`。

更多安装方式可以参考[官网](https://espanso.org/install/)。

## 使用

其官网有一个非常生动形象的 GIF，当输入:

- `:greet` 自动变成 `hello world`
- `:date` 自动产生日期
- `:llo` 变成一串 Emoji
- `:ip` 变成真实的 IP 地址

执行 `espanso edit` 会自动使用默认的编辑器创建一个默认的配置文件到 `~/.config/espanso/default.yml` 文件：

```
matches:
  # Simple text replacement
  - trigger: ":espanso"
    replace: "Hi there!"

  # Dates
  - trigger: ":date"
    replace: "{{mydate}}"
    vars:
      - name: mydate
        type: date
        params:
          format: "%m/%d/%Y"

  # Shell commands
  - trigger: ":shell"
    replace: "{{output}}"
    vars:
      - name: output
        type: shell
        params:
          cmd: "echo Hello from your shell"
```

## Configuration

espanso 基于文本的配置文件对软件的行为进行设定，在不同操作系统上的路径：

- Linux: `~/.config/espanso`
- macOS: `/Users/einverne/Library/Preferences/espanso`
- Windows: `C:\Users\user\AppData\Roaming\espanso`

可以通过 `espanso path` 来快速获知路径。

`default.yml` 文件是 espanso 的主要配置文件，使用 [YAML](/post/2015/08/yaml.html) 语法。

更加详细的配置文件可以参考[官方文档](https://federicoterzi.com/)。

### 自定义光标位置

在 espanso 的配置 `replace` 中可以使用 `$|$` 作为占位符，表示光标。

比如想要输入 `:div` 的时候自动展开成为 `<div></div>` 然后将光标停留到中间，就可以使用：

```
  - trigger: ":div"
    replace: "<div>$|$</div>"
```

## Package

Espanso 更加强大的地方在与其扩展性，通过安装其他包可以将 espanso 的能力扩展。比如从 [espanso hub](https://hub.espanso.org/) 安装 [Basic Emojis](https://hub.espanso.org/packages/basic-emojis/) :

    espanso install basic-emojis

然后重启服务：

    espanso restart

然后输入 `:ok` 就可看到文本被替换成了 Emoji。

![[Pasted image 20211013182143.png]]

更多的 package 可以看 [espansohub](https://hub.espanso.org/)。

## 快捷键

一些非常有用的快捷键。

### Toggle Key

可以通过连续按两次 `ALT`(macOS 下为 Option) 按键来临时禁用 espanso。可以看到通知 `Espanso disabled`。 再按两次可以开启。可以通过配置文件修改 [Toggle Key](https://espanso.org/docs/configuration/#customizing-the-toggle-key)

### Backspace Undo

有些时候可能无意识中触发了 expansion，但又不想要这个结果，那么可以按一下 `BACKSPACE` 撤销这一次修改。

## 同步配置文件

可以使用软链接的方式将配置文件放在同步文件夹，或 git 仓库中保存管理。

    ln -s "/home/user/Dropbox/espanso" "/home/user/.config/espanso"

我个人直接将配方放到 [dotfiles](https://github.com/einverne/dotfiles) 中管理。

## 配置

- <https://www.webfx.com/tools/emoji-cheat-sheet/>

## reference

- [[Rust 开源项目]]
