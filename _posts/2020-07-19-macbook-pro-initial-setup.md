---
layout: post
title: "MacBook Pro 初始设置记录"
aliases: "MacBook Pro 初始设置记录"
tagline: ""
description: ""
category: 学习笔记
tags: [unix, macos, setup, github,]
last_updated:
---

这里就简单的记录一下我从 Linux Mint 迁移到 MacOS 根据我的个人需求来初始化新的 MacBook Pro 的一些设置，和一些基本的感想。下面的内容会按照我自身的需求出发，我会列举我想要的功能然后在此基础上我需要借助哪些工具来实现。在切换到 MacBook Pro 之前，我使用了大约 6 年多的 Linux Mint，我已经有一套我自己的 Workflow，在切换到 Mac OS 之前我就在想哪一些的事情我是必须有 Mac 的软硬件才能做到，并且很提高某一方面的效率的，我列了一些

- 被很多人追捧的触摸板，当然这个是硬件软件的结合其他系统可以追赶但体验确实不如 Mac 完整
- 一些无法在 Linux 上跑起来的应用，一些基本工具应用，Adobe 系列的软件主要是 Lightroom

## 选购考虑

### i7 2.6 vs i9 2.3
Macbook Pro have two different CPU specification, which is 2.6 GHz 6-core i7 and 2.3 GHz 8-core i9 processor.

The i9 9980H (2.3ghz) is 4% faster per core, and ~25% faster under full load than the i7 9750H (2.6ghz). $100 is ~4% of the price difference at that spec.[^cpu]

The i9 9980HK (2.4ghz) is 5% faster in every situation than the i9 9980H.

Whether that will make a difference for you at all is highly dependent on what you are doing with it. If you are not compiling software, rendering, doing video compositing/encoding, or other parallelized high CPU tasks, it probably won't.

[^cpu]: <https://www.reddit.com/r/mac/comments/dxd8q9/16_inch_macbook_pro_i7_vs_i9/>

### 16G vs 32G
内存是必需品，如果需要大量使用 Chrome，或者依赖于 IDE，或者需要同时开多个应用，大一些的内存还是必要的。

## 基础设置
首先是一些必要设置的设置，后面的一切都依赖这些设置。

### 设置代理
~~国内的网络环境，这已经成了所有设置的基础，甚至我想先下载一个 Chrome 都需要依赖代理设置好。首先从 GitHub 下载 [ClashX](https://github.com/yichengchen/clashX/releases)，然后导入 v2ray 配置。（或者可以用 v2rayU, [Qv2ray](https://github.com/Qv2ray/Qv2ray))~~

~~ClashX 的配置文件在 `~/.config/clash/` 目录下。~~

已经替换成 Clash For Windows。

在终端中要进行代理：

    # 设置 socks5 代理
    export http_proxy="socks5://127.0.0.1:1080"

alias

     alias setproxy="export ALL_PROXY=socks5://127.0.0.1:1080" alias unsetproxy="unset ALL_PROXY"

或者设置 curl (curl >= 7.21.7) 代理：

	curl -x socks5h://localhost:1080 http://www.google.com/

### 安装浏览器
在其他系统上在浏览器中的时间伴随着我使用系统的时间，大量的事是在浏览器的页面中完成的，比如在 Trello 中记录时间，比如收发邮件，比如密码管理等等。

有了代理，就可以很快的安装上 Google Chrome，然后登陆账号，没几分钟我所有的同步设置就全部来了，包括书签，插件，甚至历史记录。

LastPass 插件登录，密码同步；Trello 登录，代办事项同步；Tampermonkey 需要到设置中开启高阶设置，然后启用浏览器同步，所有的 userscripts 也同步过来了。等等还有很多的插件也一并同步了。Chrome 此时就已经可以是日常使用了。

### 输入法

我使用小鹤双拼，在开机设置的时候我就已经选择了双拼，然后在输入法中简单的设置一下使用小鹤双拼即可。在 Mac 下使用 <kbd>Ctrl</kbd>+<kbd>Space</kbd> 来切换输入法。

系统自带的小鹤双拼用起来似乎还没遇到什么大问题，先不配置 Mac 下的 [Rime](/post/2014/11/rime.html) 了。如果需要编译安装 [Squirrel](https://github.com/rime/squirrel/blob/master/INSTALL.md) 可以按照这个文档安装。

![double-pinyin-flypy.png](/assets/double-pinyin-flypy.png)

### 开启 SSH 远程登录
在系统设置 Sharing 中需要开启远程登录，这样就可以通过 `ssh yourname@<mac.ip>` 来登录系统了，非常方便我在局域网中将我原来的配置以及文件通过 rsync 传输过来。

### Mac 上的包管理 homebrew
Linux Mint 上继承了 Debian/Ubuntu 系列的 apt 包管理工具，一些工具的安装非常方便，Mac 下有 homebrew。

[官网](https://brew.sh/) 下载安装即可，如果遇到说 curl 443 端口连接不上，那就只能先 Chrome 上把这个脚本下载下来，然后 `bash install.sh` 来手动安装了。

homebrew 也还提供了字体安装的支持，安装 `homebrew-cask-fonts`

```
brew tap homebrew/cask-fonts                  # tap 类似于 apt 中添加第三方源的 add repository
brew cask install font-inconsolata
brew cask install font-fira-code
brew cask install font-source-code-pro

brew tap homebrew/cask-drivers
```

然后配置国内镜像，加速下载。

- <https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/>

brew 常用的命令：

```
brew search package_name
brew info package_name
brew install package_name
brew update
brew upgrade package_name
brew uninstall package_name
brew list
brew config
brew doctor
brew uninstall package_name
```

所有的 `brew cask` 包，可以到[这里](https://formulae.brew.sh/cask/) 查看。

homebrew 会将软件安装到 `/usr/local/Cellar`，然后通过软链接链接到 `/usr/loca/bin` 目录。

```
brew install asdf tree tmux hub p7zip openssl curl node automake autoconf ack
brew install macvim --with-cscope --with-override-system-vim --with-lua --HEAD
brew install coreutils curl git asdf
rehash
```

brew 和 `brew cask` 的区别在于 cask 用来安装 GUI 软件。

brew cask

```
brew cask install anki alfred eudic iterm2 visual-studio-code
```

brew 的备份和恢复，如果要在两台 Mac 间备份和恢复 brew 安装的包，可以使用：

	brew bundle dump    # dump
    brew bundle         # 恢复

`brew bundle dump` 会生成一个 Brewfile 文件，这是一个纯文本的文件，里面列举了系统上的 brew 配置和安装的列表，那么我只需要维护一个 Brewfile 文件就可以一键安装必备的命令和桌面软件了。

通过 App Store 安装的应用可以通过 mas 来管理。

### 手势
一直都说 Mac 的手势领先其他厂商，个人初使用来看确实非常顺手，没有卡顿，并且大面积的触摸板使用体验确实不错。

除了常用的双指上下滚动，左右翻页还有这样一些操作：

- 三指向上，Mission Control，会显示当前所有打开的窗口
- 三指向下，可以显示同一个应用的不同窗口
- 三指左右，可以在全屏的应用间切换
- 四指捏合，显示 Launchpad
- 四指放开，显示桌面

但是关于选择页面中的文本在 Mac 就比较有趣了，我一般的行为模式就是用左手大拇指双击进入选择模式，然后接触触摸板选择文字释放左手大拇指。我这个操作习惯在 Mac 需要用力按下触摸板选择，后来在 System Perferences -> Accessibility -> Mouse & Trackpad -> Trackpad Options -> Enable dragging without Drag Lock 找到了设置。

这个选项里面有三个选择：

- without drag lock
- with drag lock
- three finger drag

很多人推荐开启第三个，我个人不太喜欢，明明能有用一个指头完成的事情为何要用三个指头。

但前两个就有点暧昧不清了，这里具体解释一下：[^drag]

[^drag]: <https://apple.stackexchange.com/a/7195/149497>

- without drag lock: 这个模式下的拖拽选择操作是这样的：1. Double tap 然后第二次 Tap 不放开，直接开始拖拽，然后放开；2. 然后根据最后停顿的时间来判断是否结束选择，如果是短暂的停顿则即使松开手指也会继续在选择模式，直到再 Tap 一下触摸板，而如果在选择时有较长的停顿，操作系统则认为选择结束
- with drag lock: 则是 Double Tap 然后不放开手指进入选择模式，松开手指也会继续在选择模式中，直到再 Tap 一下停止选择。

我个人的习惯还是选择了第一个 without drag lock.


## 编程开发工具

### iTerm

[官网](https://www.iterm2.com/) 下载安装即可。

zsh, vim, tmux 的配置放在 [dotfiles](https://github.com/einverne/dotfiles) 项目管理。

	git clone git@github.com:einverne/dotfiles.git
    cd dotfiles
    make bootstrap

配置和 Guake 类似的下拉显示。

- 在 iterm2 的设置菜单中 Keys -> Create a Dedicated HotKey Window...
- 创建新的 Profile，在菜单中设置呼出快捷键，但是在 Mac 上因为 Touchbar 的诡异存在，使得我无法方便的按下 F12，所以只能选用其他的按键

### JetBrains Toolbox
下载 JetBrains Toolbox，然后一个个选择想用的 IDE。

### SmartGit
[官网](https://www.syntevo.com/smartgit/download/) 下载，我个人非常喜欢的一个 Git 客户端，跨平台，页面也很清晰。不过简单的提交和使用 IntelliJ IDEA 自带的 Git 管理也已经足够好了。


### 设置 GitHub SSH Key
设置 GitHub 的 SSH Key。

    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

然后 clone 我的 dotfiles 配置，笔记，wiki 等等配置。



## 默认软件的熟悉

### Finder

- Finder 中显示 Home 目录，使用快捷键 Command+Shift+h
- 删除文件，Cmd+delete
- 跳转到指定目录，Cmd+Shift+g，输入目录，Enter
- 打开新标签页，Cmd+t
- 切换窗口，Ctrl + Tab

### 鼠标滚轮的方向
虽然大部分的情况下触摸板和快捷键已经能满足一定的需求，但有些时候还是会接上鼠标，尤其是当连接显示器将 Mac 作为主机使用的时候，这个时候我就发现一个问题，那就是鼠标滚轮的方向和我在 Linux 下养成的习惯相反了，看网上的材料说设置里面可以设置更改鼠标 nature 的方向，但是修改过后发现触摸板的双指滚动方向也跟着变了，然后继续搜索发现很多人推荐 [Scroll Reverse](https://pilotmoon.com/scrollreverser/) 但是这个小工具在 OSX10.15 及以上有兼容性问题，继续搜索就发现了 [Mos](https://mos.caldis.me/)，这个软件可以更改鼠标滚动的方向，也可以让滚动更加平滑。


## 常用快捷键
Mac 的快捷键设计有一个非常容易的记忆方法，和 UI 相关的快捷键基本上和 Cmd 相关，和 Ctrl 相关的大多数是终端内的操作。所以 Cmd 组合 `Q/A/Z/C/V/X/T/H/M` 等等都是和界面窗口标签页相关的，而 Ctrl 和 `a/e/n/p/b/f` 都和终端中光标移动或者终端中字符处理相关的。

在打开的窗口中显示隐藏的文件：Cmd+Shift+`.`

默认在 Finder 中显示所有文件，包括隐藏文件。

	defaults write com.apple.finder AppleShowAllFiles TRUE
	killall Finder

### Cmd 快捷键

快捷键    | 说明
----------------|------------------
Cmd + Q | 退出应用
**Cmd + W** | 关闭当前窗口，关闭 Tab
Cmd + X/C/V | 和其他系统类似，剪切，复制，粘贴
Cmd + Tab | 切换打开的应用
**Cmd + `** | 切换同一个应用的多个窗口，当然结合触摸板的四指下滑也可以
Cmd + , | 打开大部分应用的偏好设置
**Cmd + [** | 后退
**Cmd + ]** | 前进
**Cmd + Space** | Spotlight search 被我替换成 [[Alfred]] 和 [[Raycast]] 的呼出按键
**Cmd + L** | 定位到地址栏，非全局快捷键，在 Chrome 中非常好用
Cmd + A | 全选
Cmd + Z | 撤销上一次操作，Cmd + Shift + Z 重做
Cmd + F | 页内搜索
Cmd + G | 搜索下一个， Cmd +Shift+G 上一个
Cmd + H | 隐藏最前面的窗口，这个操作不可逆，我应该不会用到
Cmd + M | 最小化前面的窗口到 Dock，也不可逆，所以我也不用
Cmd + N | 新建窗口
Cmd + O | 打开文件
Cmd + P | 打印当前文档
Cmd + S | 保存

截屏的快捷键

快捷键      | 解释
----------|-----------
command + 1 左边的按键 | 在同一个应用不同窗口间切换
Shift+command+3 | 截取全屏
Shift+command+4 | 截取部分，通过光标选择
Shift+command+5 | 打开截取工具，有更多选项

在大部分的文档类应用中了解这些快捷键也可以提升不少效率

快捷键    | 说明
----------------|------------------
Cmd + B  | 加粗
Cmd + I | 斜体
Cmd + K | 插入链接


### Ctrl 快捷键
上面提到的 Mac 下的 Ctrl 快捷键大部分是和终端或者输入框中的文字相关的，Ctrl 的组合在 Linux 的终端，Emacs 中也有不少的应用。

快捷键    | 说明
----------------|------------------
Ctrl + a/e | 光标跳转到行首，行尾
Ctrl + b/f | 光标向前 (backward), 向后 (forward) 移动一个字符
Ctrl + n/p | 下一个 / 上一个
Ctrl + h/d | 向前删除一个字符，向后删除一个字符
Ctrl + k | 删除光标都末尾所有内容，这个快捷键在我的配置中设置了切换到上一个 Panel，所以我不怎么用
Ctrl + w | 删除前面一个单词 (WORD)
Ctrl + u | 删除直到行首

Mac 全部快捷键

- <https://support.apple.com/en-us/HT201236>

Mac 有个 Wired 的快捷键组合，在 Linux 终端下，向前向后跳转一个 Word 是 Alt+b/f, 但是 Mac 下默认是 Esc+b/f，这个默认的快捷键太奇怪了，想象一下在键盘上按住 Esc 在按 b/f 的姿态，一个手几乎是做不到的。所以把 Esc 按键 remap 到 Caps Lock 也算是一种勉强的解决方法吧。不过更好的方法，以及延续我的习惯，我在 iTerm2 中可以设置一下 Option+b/f。

- Open iTerm.
- Go to iTerm > Preferences... > Profiles > Keys
- Under Profile Shortcut Keys, click the + sign.
- Type your key shortcut (option-b, option-f, option-d, option-left, etc.)
- For Action, choose Send Escape Sequence.
- Write b, d or f in the input field.

From: <https://apple.stackexchange.com/a/154296/149497>

## 其他需求

### 查字典

查字典是我个人非常频繁的一个需求，虽然 Mac 自带的词典日常使用已经完全够用，并且集成到系统的 Lookup 功能也是非常好用，但我个人还是比较喜欢 Ctrl+C+C 这样的快捷键。我个人的需求不仅是英文的字典，有的时候还会查阅韩语或其他语言的字典，我个人偏好离线的字典，所以一直一来使用的是跨平台的 [GoldenDict](/post/2018/08/goldendict.html)，从 GoldenDict GitHub 页面下载安装即可。我个人的需求：

- 离线查词，包括我自己常用的英语和韩语
- 导入我常用的词典，牛津，朗文，以及相关的同义词，词源字典
- 支持句子翻译，GoldenDict 可以支持自己定义脚本，所以我修改了一下 [skywind3000](https://github.com/einverne/translator) 的脚本，添加了 Google，Yandex, Youdao 的长句子翻译，我只要选择句子或段落，Ctrl+C+C 即可直接在任何地方翻译该文本

### 压缩图片的需求
在 Mac 上随便截一张图可能就是 7，8MB 大小，非常不适合在互联网上分享，我一般会使用 Google 的 [Squoosh](https://squoosh.app/) 来进行压缩。

有些人推荐 squash 这款软件，简单的看了一下官网，似乎就我这个需求并不需要 Squash 这款软件。

### 多重粘贴板
在 Linux 上我使用 fcitx 自带的粘贴板 <kbd>Ctrl</kbd>+<kbd>;</kbd> 就可以呼出，因为就是输入法的功能，所以非常方便。在 Windows 下用 Ditto 这样一款软件。那么切换到 MacOS 就想要一个代替品。

    ~~brew cask install maccy~~

默认是 Shift+Cmd+C 弹出粘贴历史，我习惯了 Ctrl+`;` 所以直接改成这个快捷键。

已经不再使用 maccy，先是购买了 Alfred，然后又切换到了 [[Raycast]] 其自带的粘贴板管理已经非常强大了。

![raycast clipboard](https://img.gtk.pw/i/2022/07/31/62e5f65c980ac.png)

### 在文件管理器 Finder 中快速打开终端
借助 [OpenInTerminal](https://github.com/Ji4n1ng/OpenInTerminal) 这个 Finder 的插件可以实现在 Finder 目录中，立即打开终端。

借助这个插件还可以：

- 选中的文件夹，通过 Vim，或者其他编辑器直接打开
- 快速复制当前的路径

这里不得不吐槽一下，文件管理器，Mint 中的 nemo 使用起来要舒服多，这上面的操作，右键就能完成，完全不需要额外安装插件。

### 改键的需求
在 Mint 我已经有了一套熟悉的快捷键，现在到了 MacOS 上一边熟悉自带的快捷键，也想对默认的一些快捷键做修改，这个时候就需要 Karabiner-Elements。

Karabiner-Elements 比较强大，可以自定义修改几乎键盘上的每一个键，不过我个人并不推荐把键盘修改的面目全非，这需要花费很长的时间来适应。

Karabiner-Elements

- <https://github.com/pqrs-org/Karabiner-Elements>

在使用 Karabiner 的时候发现组合键 Cmd+F12 等等 Fn 键，表现的就像是没有按下 Cmd 按键一样，最后发现需要在 Karabiner 中设置 [Devices](https://github.com/pqrs-org/Karabiner-Elements/issues/535#issuecomment-350522019) 才可以生效。

另外我将 Caps Lock 作为一个 Hyper Key，按下 Caps Lock 相当于同时按下 Cmd+Ctrl+Shift+Option, 这样 Caps Lock 就可以结合其他按键作为一个新的组合按键，在利用 Hammerspoon 可以实现一套自己的快捷键工作习惯，比如我个人将 Hyper Key + HJKL 作为调整窗口的快捷键，Hyper Key+NP 作为调整窗口在哪一个显示器的快捷键。

Karabiner 之后也会用一个篇幅来介绍一下。

### Telegram 即时聊天工具
去 Telegram 官网看，发现 MacOS 下有两个客户端，一个叫做 Telegram Desktop，这个和 Windows 和 Linux 放在一起；另一个叫做 Telegram for MacOS，简单了解一下后，发现这个客户端是单独用 Mac 的原生语言实现。这两个的区别在于 Telegram Desktop 使用跨平台的实现，所以体验上和其他两个平台相似，原生实现的 Telegram for MacOS 则提供了加密等额外的功能。


### 文件同步需求
从 Dropbox 换成了 分布式的 [Syncthing](https://syncthing.net/downloads/).

[[Syncthing]] 的配置[设置](https://docs.syncthing.net/users/config.html) 在 `$HOME/Library/Application Support/Syncthing`.

另外也会用中心化的 [NextCloud](https://nextcloud.com/install/#install-clients) 作为备份。

### 播放器需求
开源的选择 IINA

- [官网](https://iina.io/)

或者老牌的 VLC

### 笔记的需求
~~历史的笔记在为知笔记里面，下载，登录数据就回来了。~~ 已经切换为 [[Obsidian]]

- [官网](https://www.wiz.cn/wiznote-mac.html) 下载。

~~WizNote 打开的时候显示不被认证的开发者，需要执行~~

	sudo spctl --master-disable

~~开启信任任何来源的安装，当然这个操作会降低系统的安全性，谨慎！~~

另外今年起，我渐渐的将笔记迁移到了 [Obsidian](/post/2020/05/obsidian-note-taking.html).

- [官网](https://obsidian.md/) 下载。

我在 GitHub 上新建了一个 Private 的项目来同步 Obsidian 的笔记。详情可以参考[我的 Obsidian 跨设备同步方案](/post/2020/11/obsidian-sync-acrose-devices-solution.html)。


### 听音乐的需求
~~唯一的选择，网易云音乐，我之前也写过文章，在[体验过市面上所有的音乐软件后](/post/2014/07/music-website-thinking.html)，选择了网易，然后已经很多年了。~~

本地音乐播放器替换为 [[Swinsian]]，跨平台音乐播放器已经替换为 [[Plexamp]]。

### Dash 文档查看
[官网](https://kapeli.com/dash) 下载安装。

### 窗口管理
在 Mac 上我发现我无法想在 Mint 中拖拽窗口到左右边缘，然后将窗口左右分屏，导致现在 Mac 上的窗口层层叠叠，管理起来非常的不方便。找了几个开源的工具。

- SizeUp
- [Spectacle](https://www.spectacleapp.com/)
- [Rectangle](https://rectangleapp.com/)

体验了一下之后选择了 Rectangle，虽然也看到了 MacOS 上的平铺窗口管理。

- [Amethsy](https://github.com/ianyh/Amethyst)
- chunkwm

但这些都需要大量的定制，所以先放着了。

经过一段时间的使用之后，最后还是用 [Hammerspoon](https://github.com/einverne/dotfiles/tree/master/hammerspoon) 用自定义脚本实现了 macOS 上的窗口管理，绑定快捷键之后的体验比上面提到的软件都要好很多。

### 图片预览及管理
[Pixea](https://apps.apple.com/cn/app/pixea/id1507782672)
一款优秀的看图软件。

[pixea-shortcut-intro](/assets/pixea-shortcut-intro.png)

### 录制 GIF
LICEcap

### 压缩解压缩

- <https://www.keka.io/en/>

### 状态栏显示 CPU 内存网速
虽然 iStat Menus 很强大，但看看 CPU 和内存占用，网速，用开源的 [iGlance](https://github.com/iglance/iGlance) 足矣。


### 电子书管理
Linux 和 NAS 上一直用的 Calibre

	brew install --cask calibre

### HTTP 接口调试
因为历史上保存了一些请求，所以还是用了 Postman，不过新出的 Postwomen 也可以试试。

    brew install --cask postman

### 抓包工具
大名鼎鼎的 Charles，以及命令行 [mitmproxy](/post/2017/02/mitmproxy.html), 以及网络协议的 Wireshark 都来一套。

### FTP 文件传输分享

- Cyberducker
- Transmit

### 下载工具

aria2, you-get 和 `youtube-dl` 日常使用，Transmission 作为 BitTorrent 备用。

自有了 NAS 以来，将 PT 下载切换到了 [rtorrent 和 ruTorrent](/post/2020/03/rtorrent-and-rutorrent.html)。

### 密码管理

自己搭建的 Bitwarden，虽然常年使用 LastPass，但最近自己搭建 Bitwarden 后发现 Bitwarden 跨平台做的非常不错，还可以利用起 Mac 的 Touch ID。

2021 年 3 月开始完全放弃了 LastPass，全面切换到 Bitwarden。同时把 Android，macOS，Chrome 浏览器上的应用和扩展全部切换了

### 状态栏隐藏
开了很多应用，导致状态栏非常乱，很多人推荐收费的 Bartender 3，不过试了一下发现开源的 [Dozer](https://github.com/Mortennn/Dozer) 也非常不错。

### Finder 增强
在 Finder 中点击直接打开终端到当前文件夹。

	brew cask install go2shell

### 在屏幕上显示输入
在 Linux 下我使用一个叫 [screenkey](/post/2018/05/screencast.html) 的工具，在 Mac 上也找到一个类似的开源项目 [keycastr](https://github.com/keycastr/keycastr).

    brew cask install keycastr

### 记录和管理外接显示器
如果经常使用 Mac 外接显示器使用，就会发现如果断开连接之后再连接，系统对外接显示器的记忆就丢失了，这个时候还需要到设置中进行一番设置。

### 自动化工具
最开始只是想做到在不同的 WiFi 环境下使用不同的 DNS 配置，所以发现了 Hammerspoon 这个开源的自动化工具，不过发现 Hammerspoon 太强大了，可以代替上面提到的很多个工具，以后会再加一篇文章单独介绍一下 Hammerspoon。

### Tiling Windows Manager

yabai

- <https://github.com/koekeishiya/yabai>

### 使用 Touch Id 授权 sudo
如果经常修改系统配置，常用 sudo 命令就需要输入一串密码，在 Mac 下可以使用 Touch Id 来验证密码。

    sudo sed -i ".bak" '2s/^/auth       sufficient     pam_tid.so\'$'\n/g' /etc/pam.d/sudo

这一行命令的作用是把 `/etc/pam.d/sudo` 备份为 `/etc/pam.d/sudo.bak`，然后在 `/etc/pam.d/sudo` 的第二行前面加入 `auth sufficient pam_tid.so` 。

要恢复就使用：

    sudo mv /etc/pam.d/sudo.bak /etc/pam.d/sudo

Touch Id 的妙用还可以参考：[pam-touchID](https://github.com/Reflejo/pam-touchID) 和 [pam_touchid](https://github.com/hamzasood/pam_touchid).

### 查看监听的端口
Mac 上使用 `netstat` 显示监听的端口：

    netstat -an | grep LISTEN

或者使用 `lsof`:

    sudo lsof -iTCP -sTCP:LISTEN -n -P

`lsof` 可以看到具体某个端口关联的 PID。

## 开发环境安装
上面提到基础的编程环境安装，这里在针对具体细节补充说明。

### 安装 asdf 多版本管理
[asdf](/post/2020/04/asdf-vm-manage-multiple-language.html) 是一个命令行下的多语言，多版本管理工具，我之前的文章提到过 [pyenv](/post/2017/04/pyenv.html) 安装管理多个版本的 Python, 同样的我在外延部分提到了 Java 的多版本管理 jenv, 还有 Ruby 的多版本管理 rbenv，甚至还有 node.js 等等语言，等等编译工具的多版本管理工具，而 asdf 将这些多版本管理工具都整合到一起，通过简单的 asdf 一行命令就可以搞定很多二进制工具，或语言的版本管理，asdf 通过扩展的方式支持了非常多的常用工具。在 Mac 下的安装也非常简单，直接参考[官方网站](https://asdf-vm.com/) 即可。

### 安装 Java 开发环境

	asdf plugin add java
	asdf install java adoptopenjdk-8.0.262+10.openj9-0.21.0
	asdf install java adoptopenjdk-11.0.8+10.openj9-0.21.0
	asdf global java adoptopenjdk-8.0.262+10.openj9-0.21.0
	java -version

### 安装 maven

	asdf plugin add maven
	asfd install maven 3.6.2
	asdf global maven 3.6.2
	mvn --version

### 安装 Python 环境

	asdf plugin add python
	asdf install python 3.6.1
	asdf global python 3.6.1
	python -V

### Nodejs

	asdf plugin add nodejs
	bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
	asdf install nodejs 14.5.0
	asdf global nodejs 14.5.0
	node -v
	yarn -v


### 安装 MySQL 管理工具
我使用 MySQL 官方的管理工具 MySQL Workbench 结合 JetBrains 的 DataGrip 一起使用，相辅相成。


## 迁移 Lightroom 图片库
我的很大一部分照片库在 Windows 的 Lightroom 中，幸亏 Lightroom 的迁移并不麻烦，在 Windows 上使用 WinSCP，然后局域网连上 Mac，直接将 Lightroom 所在的 Pictures 图片库复制到 Mac 上面的图片库中，然后将 Lightroom 的 `.lrcat` catalog 文件夹也拷贝到 Mac 上，这个目录可以在 Windows 的“编辑”-“目录设置”中找到。

拷贝完成后在 Mac 上打开 lrcat 文件，然后在 Lightroom 中右击文件夹，Find missing folder，重新导入就 OK 了。

## 配件选购

### 拓展坞
选择拓展坞的时候看了京东上面的大部分牌子，也参考了一些帖子，无疑如果不差钱直接上贝尔金，CalDigit TS3 Plus，雷电 3 的拓展坞一步到位即可。但我自己并不需要 4K60Hz，也用不上那么大的带宽，我目前的需求只需要一个可以用的 HDMI 扩展，一个 USB 外接鼠标，最好再带一个 SD 卡槽，剩下的 VGA，RJ45 网口我并不是必须，所以开始的时候直接买了贝尔金的 Tpye-C 的拓展坞，京东下单叠加了一个优惠大概 500，但是拿回来之后试用了两天就发现了问题，我只接一个 USB 的时发热也有些大，另外一个致命的问题就是 SD 卡的读取速度真的和测评里面看到的一样 20M 就上不去了。所以果断退货换了一个飞利浦的 7 合 1(HDMI，SD/microSD，Tpye-C，三个 USB)，回来立即试了一下 SD 读取，以及发热问题，在只用 USB 接口的时候几乎感受不到温度，SD 卡也可以轻松地到 70M，就他吧。（另外要提一下为什么不买绿联的拓展坞，在京东上销量几乎被绿联拿走了一大半，但是我已经不止一次的看到过因为绿联的拓展坞从而导致接口损毁，甚至影响主板，导致重启的问题，所以直接排除在选择范围了）

## 疑难杂症

### 解决 rsync 乱码问题
Mac 自带的 rsync 会遇到乱码问题，使用 brew 重新安装

	brew install rsync

### .app cannot be opened because the developer cannot be verified
在安装应用时，有些应用没有上架到 App Store，比如 GoldenDict，Mac 在安装的时候就会提示上面的错误，并且没有办法打开，这个时候就需要到设置中 Security&Pravicy 中，将 **Allow apps downloaded from** 选项中的 All 打开。

### Mac 上 Chrome 遇到 NET::ERR_CERT_INVALID
我使用的 Resilio Sync 的后台管理界面使用了 BitTorrent 自己签发的证书，所以 Chrome 中打开的时候会报错“NET::ERR_CERT_INVALID”，普通情况下我知道该风险，在其他操作系统中会提供一个选项，点击高级可以继续访问链接，但是在 Mac 上并没有这个按钮，我搜索了一下，想要尝试信任证书，无果，后来发现一个神奇的方法，在页面中点击空白处，然后输入：**thisisunsafe**，即可。略神奇。

## 几点吐槽

- 念念不忘的 Touchbar，真的很鸡肋，我默认切换成了 Fn 功能键。
- 右上角的日期竟然连日历都没有，幸好有 day-o 和 Itsycal 这样的扩展，勉强可以用
- 分屏功能竟然需要第三方扩展来支持，虽然可以用 Option 来左右分屏，还是很鸡肋，连 Linux Mint 自带的桌面都赶不上
- 自带的 Finder 也就勉强能用，是我没有使用习惯吗？我还是觉得 Cinnamon 自带的 [Nemo](/post/2018/08/nemo-file-manager.html) 要远远好过 Finder。


## reference

- <https://github.com/macdao/ocds-guide-to-setting-up-mac>
- <https://github.com/nikitavoloboev/my-mac-os>
- <https://wsgzao.github.io/post/homebrew/>

