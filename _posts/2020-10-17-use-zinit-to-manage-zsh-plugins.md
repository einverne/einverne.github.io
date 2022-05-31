---
layout: post
title: "使用 zinit 管理 zsh 插件 完美代替 Antigen"
aliases: "使用 zinit 管理 zsh 插件 完美代替 Antigen"
tagline: ""
description: ""
category: 学习笔记
tags: [zsh, zinit, linux, terminal, antigen, plugin,]
last_updated:
---


一直使用的 [antigen](/post/2017/09/antigen-zsh-plugin-manager.html) 来管理 zsh 的插件，但是最近 zsh 因为加了一些插件变得非常慢，所以就想找找办法提速 zsh，在查询的过程中发现 antigen 已经很久没有更新，很多人推荐 antibody, 于是又试了一下 antibody, 不过在调研的过程中又发现了 `zinit`。 再一番对比以后，发现 antibody 所谓的并行执行也没有提速很多，反而是名不见经传的 zinit 通过配置将加载时间稳稳地降低，在新建终端时几乎立即可用。

## zinit 是什么
[zinit](https://github.com/zdharma/zinit) 在众多的 zsh 插件管理工具中是一个比较小众的工具，但是因为其具备的 Turbo mode 可以显著的提升加载的速度。它的原理是通过在后台加载插件的方式提速。

同时 zinit 也没有为了优化而牺牲易用性，可以通过加载 oh-my-zsh 和 Prezto 插件来扩展其能力。

并且在使用的过程中渐渐发现 zinit 的能力并不仅仅在于扩展和管理 zsh 插件，还可以通过简单的配置从 GitHub Release 发布页面安装二进制等等。这样的能力就使得我的 [dotfiles](https://github.com/einverne/dotfiles) 有可能通过一行命令来完成整个系统的初始化设置，再也不用手动一行行安装必要的二进制了。

## 安装 {#installation}
自动安装：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma-continuum/zinit/master/doc/install.sh)"
```

或手动安装：

    mkdir ~/.zinit
    git clone https://github.com/zdharma-continuum/zinit.git ~/.zinit/bin

如果你使用我的 [dotfiles](https://github.com/einverne/dotfiles) 在 `~/.zshrc` 中会自动安装。


## 配置 {#config}
zinit 的功能非常庞杂，官方的文档也非常详细，下面只挑选我认为入门需要掌握的一些基本使用技巧，如果要更深入的使用 zinit 可以等以后有机会再总结一篇，或者仔细阅读官方的文档。

### snippet
zinit 使用 `snippet` 来加载单个脚本，相当于 `source`。

```
zinit snippet OMZ::lib/completion.zsh
```

比如上面一行就表示加载 oh-my-zsh 中 lib 目录下的 `completion.zsh` 文件。

### load vs light
`zinit` 使用 `load` 和 `light` 来加载插件。后面跟随的是插件仓库的路径：

```
zinit load zdharma-continuum/history-search-multi-word
zinit light zsh-users/zsh-syntax-highlighting
```

这两个命令的差别在于：

- `load` 加载的插件可以使用 `zinit report` 来查看加载过程
- `light`, 表示关闭插件追踪功能，稍微比 `load` 快一些，但看不了 `report`

`load` 和 `light` 命令后面都接的是一个 URL，如果没有指定具体的地址默认都是从 GitHub 仓库获取。

### 加载 Oh My Zsh, Prezto 插件
zinit 也可以加载 Oh My Zsh 和 Prezto 的插件，使用 `snippet` 关键字。`snippet` 会使用 `wget`, `curl` 等工具下载指定的文件。

```
zinit snippet 'https://github.com/robbyrussell/oh-my-zsh/raw/master/plugins/git/git.plugin.zsh'
zinit snippet 'https://github.com/sorin-ionescu/prezto/blob/master/modules/helper/init.zsh'
```

也可以使用内置的缩写：

```
zinit snippet OMZ::plugins/git/git.plugin.zsh
zinit snippet PZT::modules/helper/init.zsh
```

其他仓库的简写方式：

```
OMZ: https://github.com/ohmyzsh/ohmyzsh
OMZL: https://github.com/ohmyzsh/ohmyzsh/tree/master/lib
OMZP: https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins
OMZT: https://github.com/ohmyzsh/ohmyzsh/tree/master/themes
PZT: https://github.com/sorin-ionescu/prezto
PZTM: https://github.com/sorin-ionescu/prezto/tree/master/modules
```

## ice-modifier

使用 ice 的语句会作用于下一句 zinit 的定义。`ice` 关键字会给下一条 zinit 命令增加额外的描述。

```
zinit ice svn pick"init.zsh"
zinit snippet PZT::modules/git
```

比如第二行配置加载 `PZT::modules/git` 这个目录，但是 ice 中定义了 `pick"init.zsh"` ， 那么就只会加载这个目录下的 `init.zsh` 这一个文件。

`ice` 提供的额外描述信息包括：

- Cloning Options（拉取）：`proto`, `from`, `ver`, `bpick`, `depth`, `cloneopts`, `svn`
- Selection of Files: `pick`, `src`, `multisrc`
- Conditional Loading: `wait`, `load`, `unload`, `cloneonly`, `if`, `has`, `subscribe/on-update-of`, `trigger-load`
- Plugin Output: `silent`, `lucid`, `notify`
- Completions: `blockf`, `nocompletions`
- Command Execution After Cloning, Updating or Loading: `mv`, `cp`, `atclone`, `atpull`, `atinit`, `atload`, `run-atpull`, `nocde`, `make`, `countdown`, `reset`
- Sticky-Emulation of Other Shells: `sh/!sh`, `bash/!bash`, `ksh/!ksh`, `csh/!csh`
- Others: `as`, `id-as`, `compile`, `nocompile`, `service`, `reset-prompt`, `bindmap`, `trackbinds`, `wrap-track`, `aliaes`, `light-mode`, `extract`

更多的可以看[官网](https://github.com/zdharma-continuum/zinit#ice-modifiers)


### as"program"
有些插件可能不是文件，而是需要加入到 `$PATH` 的一些命令，所以定义了 `as` 修饰符和 "program".

```bash
zinit ice from"gh-r" as"program"
zinit load junegunn/fzf
```

说明：

- `from"gh-r"` 指定了插件下载的位置，这里的 `gh-r` 表示的是 GitHub release 页面。其他的还有 `gh` 表示从 `github` 获取，`gl` 表示 `gitlab`, `bb` 表示 `bitbucket`, `nb` 表示 `notabug`
- `as"prorgam"` 表示下载插件的意图，将下载的插件做什么用，比如这里 `program` 表示下载完成后，会自动将其加入系统环境变量

所以上面两行的含义就是在 GitHub release 页面下载 `junegunn/fzf-bin` 文件，并解压添加到系统环境变量。

### cp
复制命令：

```
zinit ice as"program" cp"httpstat.sh -> httpstat" pick"httpstat"
zinit light b4b4r07/httpstat
```

上面的指令会下载插件 `b4b4r07/httpstat`，`cp`指令则将 `httpstat.sh` 拷贝到 `httpstat`，再由于 `pick` 把插件目录加入到 `$PATH` 中，并添加执行权限。因为指定了 `as"program"` 所以后面的 `pick` 会将其作为可执行文件。

### atpull

拷贝文件是一种安全的不影响更新的操作，原始的仓库没有修改，`Git` 不会有任何冲突。但是如果定义了合理的 `atpull`，也可以使用 `mv`

```
zinit ice as"program" mv"httpstat.sh -> httpstat" \
      pick"httpstat" atpull'!git reset --hard'
zinit light b4b4r07/httpstat
```

`atpull` 会在更新插件的时候执行，如果 `atpull` 以感叹号开始，表示会在 `git pull` 之前执行。

`atpull`, `mv`, `cp` 只会在有新的提交后执行。

如果用户使用 `zinit update b4b4r07/httpstat` 来更新插件，并且有新的提交被拉下来，那么

- 首先 `git reset --hard` 执行，恢复原来的 `httpstat.sh`
- 然后 `git pull` 执行，fast-forward 拉取最新的提交
- 然后 `mv` 执行

### wait
`wait` 用于插件延迟加载。

用法一，`wait'<number>'`, 表示在终端启动 number 毫秒之后，加载插件

```bash
zinit ice wait'1' 
zinit light wfxr/forgit
```

用法二，有条件加载 `wait'[[ ... ]]'`/`wait'(( ... ))'`，当满足条件时，加载插件。

```bash
zinit ice wait'[[ $PWD = */github || $PWD = */github/*  ]]'
zinit load unixorn/git-extra-commands '
```

用法三，`wait'!...'`, `!` 表示在加载完成后重置控制台，用于主题加载


### Snippets completions
使用 `as` 关键字和 `completion` 可以将 `snippet` 的内容加入到 `completion` 。

```
zinit ice as"completion"
zinit snippet https://github.com/docker/cli/blob/master/contrib/completion/zsh/_docker
```


### 自动补全管理
zinit 允许单独的禁用和启用每一个插件的自动补全。

```
zinit ice blockf
zinit light zsh-users/zsh-completions
```

可以通过  `zi clist` 查看插件提供的自动补全。

可以单独的启用和禁用补全：

```
$ zi cdisable cmake
Disabled cmake completion belonging to zsh-users/zsh-completions
$ zi cenable cmake
Enabled cmake completion belonging to zsh-users/zsh-completions
```


### Turbo Mode
Zinit 可以使用 `wait` ice-mod 来延迟加载插件。Zsh 5.3 以后可以使用。


## zinit 管理

zinit 升级

	zinit self-update

升级其他插件

	zinit update

清理没有加载的插件

	zinit delete --clean

## reference

- <https://github.com/zdharma/zinit/>
- <https://github.com/einverne/dotfiles>
