---
layout: post
title: "『译』我最喜欢的命令行工具"
tagline: ""
description: ""
category: 整理合集
tags: [cli, linux, mac, tools, terminal, zsh, shell, fd, fzf]
last_updated:
---

偶然间看到一篇介绍 cli 的[文章](https://switowski.com/blog/favorite-cli-tools)，感觉写得不错，正好借此机会也整理一下我之前使用过，以及觉得非常值得推荐的 CLI 工具。

下面就是译文全文。原文可以见 <https://switowski.com/blog/favorite-cli-tools>

下面是一个很长的列表，如果觉得不想完整的看完，这里提供一个简介。

- [fish shell](#fish-shell) 一个简单易用的 shell
- [starship](#starship) 一个不需要额外设置的终端提示
- [z](#z) 可以在文件系统中快速跳转
- [fzf](#fzf) 模糊搜索
- [fd](#fd) `find` 命令的代替
- [ripgrep](#ripgrep) `grep` 的代替
- [htop and glances](#htop-and-glances) 系统监控工具
- [virtualenv and virtualfish](#virtualenv-and-virtualfish), Python 虚拟环境管理
- [pyenv, nodenv, and rbenv](#pyenv-nodenv-and-rbenv), Python, Node, 和 Ruby 的多版本管理
- [pipx](#pipx) 将 Python 的包安装到隔离的环境
- [ctop and lazydocker](#ctop-and-lazydocker), Docker 的监控工具
- [homebrew](#homebrew), MacOS 上的包管理
- [asciinema](#asciinema), 录制终端的会话（并且可以让观看者直接从录制中复制代码）
- [colordiff and diff-so-fancy](#colordiff-and-diff-so-fancy), 带有颜色的 `diff` 工具
- [tree](#tree), 展示文件夹的结构及内容
- [bat](#bat), 更好的 `cat`
- [httpie](#httpie), 更好的 `curl`
- [tldr](#tldr), 简化版的 `man pages`
- [exa](#exa), 更好的 `ls`
- [litecli and pgcli](#litecli-and-pgcli), 更好的 `sqlite3` 和 `psql`
- [mas](#mas), App Store 的 CLI 版
- [ncdu](#ncdu), 磁盘使用分析工具

## fish-shell

官网：<https://fishshell.com/>

每一次打开终端使用最多的就是 Shell。过去我使用过 Bash 和 Z shell，但是现在我使用 fish。这是一个非常棒的 shell，拥有很多开箱即用的特性，比如自动提示 (auto suggestions), 语法高亮，或者是切换文件夹 (⌥+Left 或者 ⌥+Right)。

换句话说，这对新手非常友好，你不需要设置任何东西。但是另一方面，fish 使用不同于其他 shell 的另一种语法，所以通常你并不能直接复制粘贴来使用互联网上的脚本。你要不就是将脚本改成适合 [fish scripts](https://fishshell.com/docs/current/index.html#syntax-overview) 语法，要不就只能打开一个 Bash 会话来执行脚本。我能理解 fish 背后不兼容的原因 (Bash 是一门不是那么容易理解的语言）。我很少编写 bash/fish 脚本，所以每一次使用都得从头再来。并且相较于 bash 脚本，fish 脚本的资料更少，所以我通常就只能阅读文档，而不是从 StackOverflow 来复制拷贝已经编写好的脚本。

是否要推荐 fish ? 答案是 Yes！切换 Shell 非常简单，尝试一下吧。尤其是当你不喜欢对你的 Shell 修修补补，或者想要通过最少的配置来达到很好的效果。

### Fish plugins
你可以通过给 fish 安装插件来扩展功能。通过插件管理工具可以非常轻松的安装和管理，比如 [Fisher](https://github.com/jorgebucaran/fisher), [Oh My Fish](https://github.com/oh-my-fish/oh-my-fish)，或者 [fundle](https://github.com/danhper/fundle)。

目前我只使用三个插件：

- [franciscolourenco/done](https://github.com/franciscolourenco/done)，当长时间执行的脚本完成后发送系统通知。我不会长时间开着终端，而是使用 [Guake style](http://guake-project.org/) 终端，当我需要的时候从屏幕的上方显示，当我不需要的时候就隐藏。使用这个插件的时候，当我执行一个耗时比较长的任务的时候，当完成的时候会发送一个桌面通知。
- [evanlucas/fish-kubectl-completions](https://github.com/evanlucas/fish-kubectl-completions), 提供了 `kubectl` 命令的自动补全。
- [fzf](https://github.com/jethrokuan/fzf)，将 fzf 和 fish 集成 （见 [fzf](#fzf))

过去我常常会使用很多插件 (rbenv, pyenv, nodenv, fzf, z)，但我切换到一个不同的 shell 来避免拖慢我的 shell。

如果你想了解更多 fish 的资料，可以查阅 [awesome-file](https://github.com/jorgebucaran/awesome-fish) 这个仓库。和 Z shell 和 Bash 相比，fish 只有更少的插件，如果你经常调整你的 Shell，这可能不是最好的选择。但是对我而言，这却是一个益处，这使得我不再启用很多的插件，然后再抱怨太慢。

## Starship

官网：<https://starship.rs/>

如果要我在这个列表里面选择一个最喜欢的工具，那就是 Starship。Starship 是一个终端提示 (prompt)，它可以和任何 Shell 搭配使用。如果你安装了它，你只需要在 `.bashrc` / `.zshrc` / `config.fish` 中添加一行即可。

它可以显示：

- 当前目录的`git status` 信息，以及不同的标识来显示是否有新文件，或者有更改等等。
- 如果你在一个 Python 项目目录下会显示 Python 的版本 （同样的道理在 Go/Node/Rust/Elm 等等其他语言中也一样）
- 命令执行的时间（如果超过几秒钟的话）
- 如果上一个命令失败了会有错误提示

## z

官网：<https://github.com/rupa/z>

![my cli z](/assets/my-cli-z.gif)

z 可以让你在文件系统中快速跳转。它会记住你曾经访问过的文件夹路径，经过一段时间后，你可以快速的直接使用 `z path` 来跳转。

比如，我经常访问的目录 `~/work/src/projects`，我可以直接执行 `z pro` 然后立即跳转过去。z 的算法基于频率，基于频率和最新访问的组合。如果它记住了一个不常使用的目录，你可以在任何时间手动移除它。

这个工具大大地提高了在常用的目录间切换的效率，并且节省了大量的击键次数。

## fzf

![my cil fzf](/assets/my-cli-fzf.jpg)

fzf 表示 "fuzzy finder", 这是一个通用工具，可以让你来查找文件，历史中的命令，进程名，git 提交历史，和其他更多的模糊查找。你可以敲入一些字母，然后尝试在结果中匹配这些字母。敲入的字母越多，搜索结果越精确。你可能在代码编辑器中曾经看到过这种搜索，当你想要打开一个文件，你不需要敲入完整的路径，只需要敲入部分文件的名字，这就是模糊搜索。

我通过 [fish fzf 插件](https://github.com/jethrokuan/fzf) 来使用，我可以快速找回历史命令，或者快速打卡一个文件。

## fd

![my cli fd](/assets/my-cli-fd.gif)

和 `find` 命令类似，但是易用，更快，并且拥有一个默认的设置。

如果你想找一个叫做 `invoice` 的文件，但是你不确定它的扩展名？ 或者你想要找一个放着所有发票的文件夹？你可以卷起袖子开始为 find 命令编写正则表达式，或这直接运行 `fd invoice`。

默认情况下，`fd` 会忽略任何在 `.gitignore` 中列出的文件和目录。大部分情况下，这就是你想要的，但是对于那些极特殊的情况，我有一个 alias : `fda='fd -IH'`

输出的结果是带颜色的，并且[根据 benchmarks](https://github.com/sharkdp/fd#benchmark)，它甚至比 `find` 要快。

## ripgrep

![my cli rg](/assets/my-cli-rg.gif)

和 `fd` 类似，`ripgrep` 是 `grep` 的一个代替品，并且非常快，健全的默认值以及彩色的输出结果。

它会跳过在 `.gitignore` 中定义的文件，以及隐藏的文件，你可以设置 alias: `rga='rg -uuu'`。他会禁用所有的智能过滤，让 `ripgrep` 和普通的 grep 一样。

## htop and glances

在 Linux 或者 Mac 上显示进程信息的工具就是 `top`，他是每一个系统管理员的好朋友。即使你通常在开发网站，也是一个不错的工具。你可以查看是否是你的 Docker 或者 Chrome 吃光了你的 RAM。

![my cli htop](/assets/my-cli-htop.jpg)

`top` 工具非常基础，所以大部分的人切换到了 `htop`。`htop` 在此基础上，增加了颜色，拥有丰富的选项，并且用起来非常方便。

![my cli glances](/assets/my-cli-glances.jpg)

glances 是 htop 的一款互补的工具。除了列举了所有进程的 CPU 和内存使用，它还展示系统一些其他额外的信息。

你可以看到：

- 网络或磁盘的使用
- 文件系统使用以及全部的空间
- 其他 sensor 的数据，比如电池
- 最近使用了大量资源的进程

我使用 `htop` 来快速过滤并杀死进程，但是我使用 `glances` 来快速查看电脑的状态。Glances 提供了 API，Web UI，等等不同的输出格式，这样你就可以将系统的监控带到另一个层级。

## virtualenv and virtualfish

virtualenv 是一个用来创建 Python 虚拟环境的工具。

## pyenv, nodenv and rbenv
Pyenv, nodenv, and rubyenv 是用来管理不同版本的 Python，Node，和 Ruby 的工具。

![my cli pyenv](/assets/my-cli-pyenv.jpg)

最近我又发现了一个叫做 `asdf` 的工具， 可以用来代替 pyenv, nodenv, rbenv, 和其他 envs 工具。它提供了几乎任何语言的版本控制。

## pipx

virtualenv 解决了 Python 包管理的问题，但还剩下一个问题。如果我想全局安装一个 Python package （因为这是一个独立的工具，比如 glances)。在虚拟环境之外安装包是一个不好的主意，可能导致未来的问题。但换一个角度，如果我决定使用 virtual environment, 那么每一次我想使用这个工具，我都需要重新激活这个 virtual environment。这不是一个方便的解决方法。

那么 `pipx` 解决的就是这样的问题，它会将 Python 安装到一个独立的环境中（这样他们的依赖就不会冲突）。但是，与此同时，CLI 工具是全局可访问的。我不需要激活任何东西，pipx 帮我完成了一切。

如果想要了解更多 Python 工具的使用，以及作者如何使用它们，作者在 PyCon 2020 会议上做了一次分享 "Modern Python Developer's Toolkit"，这是伊恩两小时的教程，如果感兴趣可以观看这个录制的[视频](https://www.youtube.com/watch?v=WkUBx3g2QfQ)。

## ctop and lazydocker

![my cli ctop](/assets/my-cli-ctop.gif)

当你使用 Docker 时，你会发现这两个工具非常有用。`ctop` 是一个给 Docker 容器的  `top-like` 界面，它可以：

- 显示当前正在运行或者已经停止的容器
- 每一个容器的内存，CPU 等等信息
- 一个快速的菜单来停止，杀死，或者显示给定容器的日志

这要比使用 docker ps 来显示这些信息来得方便许多。

如果你觉得 `ctop` 很 cool，那么尝试一下 `lazydocker` 吧！这是一个用来管理 Docker 成熟的终端 UI 界面。

## 一些我不是每天使用的工具 Tools that I don't use every day
除了上面提到的这些我每天在使用的工具，还有一些我收集了数年，并且发现在特定场景非常有用的工具。比如说录制终端的 GIF（可以让你暂停并且复制文字），显示文件夹结构，连接数据库的工具等等。

### Homebrew

如果你使用 Mac ，那么 Homebrew 自然无须多言，这是一个事实上的 macOS 包管理。它甚至还有一个 GUI 的版本 Cakebrew.

### asciinema

`asciinema` 是一个可以用来录制终端会话的工具。但是不像其他的 GIF 录制工具，它可以允许观看的人选择并复制录制过程中的代码。

这对于录制编程教程非常有用，没有什么能比敲入一大串长长的命令要令人沮丧的了。

### colordiff and diff-so-fancy

![my cli colordiff](/assets/my-cli-colordiff.jpg)

我现在很少在终端中比较两个文件的差异了，但是如果你经常做，那么尝试用 `colordiff` 代替 `diff` 命令。`colordiff` 命令会给结果着色，这样就非常容易文件的差异了。

如果运行 `git diff` 或者 `git show`，那么还有一个更好的工具叫做 `diff-so-fancy`，它提供了：

- 高亮变化的单词，而不是整行
- 简化了变化文件的 headers
- 省去了加号和减号，已经有了颜色
- 显示新增和删除的空行

### tree
如果你想要展示给定文件夹的内容，`tree` 是一个首选的工具 (go-to tool)。它会显示所有的子目录和其中的文件，并以 tree 的显示显示。

### bat

和 cat 类似用来显示文件内容，但是更好，增加了语法高亮，git gutter marks（当可用的时候）, 自动翻页（如果文件很大的话），最后就是让文件更易读。

### httpie
如果你需要发送一些 HTTP 请求，你可能会发现 curl 不是非常易用，那么尝试一下 `httpie`.

### tldr

地址：<https://tldr.sh/>

![my cli tldr](/assets/my-cli-tldr.jpg)


更简单的 man pages，"man pages" 是 Linux 软件的手册，解释了如何使用这些命令。尝试一下运行 `man cat` 或者 `man grep`。但是 man 手册通常非常详细，并且有些复杂一些的命令可能需要花一些时间来理解。`tldr` 是一个社区驱动的项目，提取了 man page 中重要的内容提供一些简洁的例子。

`tldr` 提供了大部分的命令行工具例子，这是社区的力量，但是也有很小的可能其他人编写的文档可能会误导你。但是大部分的情况下，还是能够找到你想要的内容。

比如你想要 gzip 压缩一些文件，`man tar` 大量的说明可能使得你无从下手，但是 `tldr tar` 显示了常用的例子，你可以立刻知道你想要的内容。

### exa
`exa` 是一个 `ls` 的代替。

彩色的显示输出，将文件大小转换成可读的，并且保持了 ls 的速度。


### litecli and pgcli

地址：<https://litecli.com/> 和 <https://www.pgcli.com/>

SQLite 和 PostgreSQL 的首选 CLI 工具，它提供了自动补全以及语法高亮，他们比默认的 `sqlite3` 和 `psql` 好用多了。

另外感谢 laixintao 在留言中推荐的 [dbcli](https://www.dbcli.com/) 一整套数据库 CLI 工具链，包括了 PostgreSQL, MySQL, SQLite, MS SQL Server, Redis, AWS Athena, VerticaDB 等等数据库的 CLI 客户端连接工具。

### mas

地址：<https://github.com/mas-cli/mas>

`mas` 是 App store 的命令行版本。它用来初始化的时候设置 Macbook，并且可以写成脚本来复用。

mas 可以让我自动安装命令，而不需要在 App Store 中点点点。既然你在阅读 CLI 相关的文章，那么我假设，你和我一样，不喜欢 Click。


### ncdu

官网地址：<https://dev.yorhel.nl/ncdu>，也可以参考之前的[文章](/post/2018/03/disk-analyze-ncdu.html)。

![my cli ncdu](/assets/my-cli-ncdu.jpg)

ncdu 是终端中的磁盘分析工具。快并且易用。



## 最后
本文的作者叫做 Sebastian，是一位 Python 开发者，我[征得其同意后](https://yak.li/543dda) 翻译了这篇文章。作者介绍了不少很好的工具，我之前也有再用，同时也介绍了不少我第一次听说的工具，比如 SQLite 和 PostgreSQL 的连接工具。总之这是一篇不错的文章，分享一下。
