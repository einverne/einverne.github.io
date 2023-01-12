---
layout: post
title: "手工编译安装 librime"
aliases: 
- "手工编译安装 librime"
tagline: ""
description: ""
category: 经验总结
tags: [rime, squirrel, input-method, macos, mac, open-source]
last_updated:
---

librime 是 Rime，包括各个系统上的桌面版，Squirrel（鼠须管） 等等依赖的核心库。

## Preparation
首先要安装 Xcode 和命令行工具，以及必要的编译工具：

``` sh
brew install cmake git
```

## Get the code
获取代码：

``` sh
git clone --recursive https://github.com/rime/librime.git
```

or [download from GitHub](https://github.com/rime/librime), then get code for
third party dependencies separately.

## Install Boost C++ libraries
安装 Boost 库，Boost 库是一个 C++ 的第三方库，Rime 大量地依赖了这个库。

**选择一 (推荐):** 下载源码，手工编译：

``` sh
cd librime
make xcode/thirdparty/boost
```

The make script will download Boost source tarball, extract it to
`librime/thirdparty/src/boost_<version>` and create needed static libraries
for building macOS uinversal binary.

Set shell variable `BOOST_ROOT` to the path to `boost_<version>` directory prior
to building librime.

``` sh
export BOOST_ROOT="$(pwd)/thirdparty/src/boost_1_75_0"
```

**选择 2:** 从 Homebrew 安装 Boost 库：

``` sh
brew install boost
```

如果你只想编译，并且安装到自己的 macOS 上，这是一个节省时间的选择。通过 Homebrew 中的 Boost 编译安装的 librime 可能不能在其他机器上完美的工作。

Built with Homebrewed version of Boost, the `librime` binary will not be
portable to machines without certain Homebrew formulae installed.

**选择 3:** Install an older version of Boost libraries from Homebrew.

Starting from version 1.68, `boost::locale` library from Homebrew depends on
`icu4c`, which is not provided by macOS.

Make target `xcode/release-with-icu` tells cmake to link to ICU libraries
installed locally with Homebrew. This is only required if building with the
[`librime-charcode`](https://github.com/rime/librime-charcode) plugin.

To make a portable build with this plugin, install an earlier version of
`boost` that wasn't dependent on `icu4c`:

``` sh
brew install boost@1.60
brew link --force boost@1.60
```

## Build third-party libraries

Required third-party libraries other than Boost are included as git submodules:

``` sh
# cd librime

# if you haven't checked out the submodules with git clone --recursive ..., do:
# git submodule update --init

make xcode/thirdparty
```

This builds libraries located at `thirdparty/src/*`, and installs the build
artifacts to `thirdparty/include`, `thirdparty/lib` and `thirdparty/bin`.

You can also build an individual library, eg. `opencc`, with:

``` sh
make xcode/thirdparty/opencc
```

## Build librime

``` sh
make xcode
```
This creates `build/lib/Release/librime*.dylib` and command line tools
`build/bin/Release/rime_*`.

Or, create a debug build:

``` sh
make xcode/debug
```

## Run unit tests

``` sh
make xcode/test
```

Or, test the debug build:

``` sh
make xcode/test-debug
```

## Try it in the console

``` sh
(
  cd debug/bin;
  echo "congmingdeRime{space}shurufa" | Debug/rime_api_console
)
```

Use it as REPL, quit with <kbd>Control+d</kbd>:

``` sh
(cd debug/bin; ./Debug/rime_api_console)
```
