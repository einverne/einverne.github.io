---
layout: post
title: "手工编译安装 macOS 下的 Rime（鼠须管）"
aliases: 
- "手工编译安装 macOS 下的 Rime（鼠须管）"
tagline: ""
description: ""
category: 经验总结
tags: [ rime, squirrel, macos, input-method, mac, ]
last_updated:
---

因为 macOS 下的 Rime 输入法（[鼠须管](https://github.com/rime/squirrel)） 不是经常更新二进制，所以要体验性特性总是要手工进行编译安装。

之前的想要 [Rime 实现按下 Esc 切换为英文](/post/2020/11/rime-auto-switch-language-in-vim-mode.html)时，看到 commit history 有提交的时候就尝试手工编译安装了一下。一直都在笔记里面，现在整理一下发出来。

## Prerequisites

### 安装 Xcode 12.2 及以上
首先从 App Store 中安装 **Xcode 12.2** 及以上版本。

如果只有 Xcode 10 只能编译 `x86_64` 的版本。

### 安装 cmake

从[官网](https://cmake.org/download/) 下载安装。

或者从[Homebrew](http://brew.sh/) 安装:

``` sh
brew install cmake
```

或者从 [MacPorts](https://www.macports.org/) 安装:

``` sh
port install cmake
```

### Checkout the code
获取 Squirrel 的源码：

``` sh
git clone --recursive https://github.com/rime/squirrel.git

cd squirrel
```

通过如下方式获取 Rime 的插件（这一步如果不需要可以跳过，不过建议安装特定的插件以提高使用舒适度）：

``` sh
bash librime/install-plugins.sh rime/librime-sample # ...
bash librime/install-plugins.sh hchunhui/librime-lua
bash librime/install-plugins.sh lotem/librime-octagram
```

添加两个插件 [librime-lua](https://github.com/hchunhui/librime-lua),[librime-octagram](https://github.com/lotem/librime-octagram)

- librime-lua 可以使用户可以编写 lua 脚本，编写函数来处理输出，比如在英文单词后面自动添加一个空格，或者当输入 date 或 「日期」的时候自动出现当前的日期。

![](/assets/rime-lua-date-20210930201359.png)

- librime-octagram 是八股文插件，通过提前训练的模型增强 RIME 的长句组词能力

### Shortcut: get the latest librime release

You have the option to skip the following two sections - building Boost and
librime, by downloading the latest librime binary from GitHub releases.

可以直接执行如下命令从 GitHub release 页面下载编译好的 Boost 和 librime，跳过下面两个步骤：

``` sh
bash ./travis-install.sh
```

准备工作做好之后，就可以开始[编译 Squirrel](#build-squirrel)

### Install Boost C++ libraries

选择下面两种方式中的一个安装 Boost 库。

**Option:** 下载源码编译安装：.

``` sh
export BUILD_UNIVERSAL=1

make -C librime xcode/thirdparty/boost

export BOOST_ROOT="$(pwd)/librime/thirdparty/src/boost_1_75_0"
```

Let's set `BUILD_UNIVERSAL` to tell `make` that we are building Boost as
universal macOS binaries. Skip this if building only for the native architecture.

After Boost source code is downloaded and a few compiled libraries are built,
be sure to set shell variable `BOOST_ROOT` to its top level directory as above.

You may also set `BOOST_ROOT` to an existing Boost source tree before this step.

**Option:** 从 Homebrew 从安装:

``` sh
brew install boost
```

**Note:** with this option, the built Squirrel.app is not portable because it
links to locally installed libraries from Homebrew.

Learn more about the implications of this at
https://github.com/rime/librime/blob/master/README-mac.md#install-boost-c-libraries

**Option:** 从 [MacPorts](https://www.macports.org/) 安装:

``` sh
port install boost -no_static
```

### Build dependencies

Again, set `BUILD_UNIVERSAL` to tell `make` that we are building librime as
universal macOS binaries. Skip this if building only for the native architecture.

Build librime, dependent third-party libraries and data files:

``` sh
export BUILD_UNIVERSAL=1

make deps
```

### Build Squirrel

当所有的依赖都安装准备好之后, 开始编译 `Squirrel.app`:

``` sh
make
```

To build only for the native architecture, pass variable `ARCHS` to `make`:

``` sh
# for Mac computers with Apple Silicon
make ARCHS='arm64'

# for Intel-based Mac
make ARCHS='x86_64'
```

## Install it on your Mac

编译后之后就可以安装到系统上:

``` sh
# Squirrel as a Universal app
make install

# for Intel-based Mac only
make ARCHS='x86_64' install
```

之后就可以享受完美的 Rime 输入法体验了。

## Question
在 `make ARCHS='x86_64'` 的时候遇到错误：

```
CompileXIB /Users/einverne/Git/squirrel/zh-Hans.lproj/MainMenu.xib (in target 'Squirrel' from project 'Squirrel')
    cd /Users/einverne/Git/squirrel
    export XCODE_DEVELOPER_USR_PATH\=/Applications/Xcode.app/Contents/Developer/usr/bin/..
    /Applications/Xcode.app/Contents/Developer/usr/bin/ibtool --errors --warnings --notices --module Squirrel --output-partial-info-plist /Users/einverne/Git/squirrel/build/Squirrel.build/Release/Squirrel.build/zh-Hans.lproj/MainMenu-PartialInfo.plist --auto-activate-custom-fonts --target-device mac --minimum-deployment-target 10.9 --output-format human-readable-text --compile /Users/einverne/Git/squirrel/build/Release/Squirrel.app/Contents/Resources/zh-Hans.lproj/MainMenu.nib /Users/einverne/Git/squirrel/zh-Hans.lproj/MainMenu.xib
Command CompileXIB failed with a nonzero exit code

** BUILD FAILED **


The following build commands failed:
        CompileXIB /Users/einverne/Git/squirrel/Base.lproj/MainMenu.xib (in target 'Squirrel' from project 'Squirrel')
        CompileXIB /Users/einverne/Git/squirrel/zh-Hant.lproj/MainMenu.xib (in target 'Squirrel' from project 'Squirrel')
        CompileXIB /Users/einverne/Git/squirrel/zh-Hans.lproj/MainMenu.xib (in target 'Squirrel' from project 'Squirrel')
(3 failures)
make: *** [release] Error 65
```



1.  removing the old tools (`$ sudo rm -rf /Library/Developer/CommandLineTools`)
2.  install xcode command line tools again (`$ xcode-select --install`).


```
ld: warning: directory not found for option '-L/usr/local/lib/Release'
ld: warning: directory not found for option '-L/Users/einverne/Git/squirrel/librime/thirdparty/lib/Release'
ld: library not found for -licudata
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

