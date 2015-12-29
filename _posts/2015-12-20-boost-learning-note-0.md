---
layout: post
title: "boost 学习笔记 0: 安装环境"
tagline: ""
description: "boost 安装"
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

这篇文章讲如何安装 boost 库，最完整的教程永远在[官网](http://www.boost.org/)。以下内容部分翻译自官方文档。

首先来看一看在Linux下安装 boost 库。

## Ubuntu/Debian/Linux Mint 安装boost

运行以下命令：

	sudo apt-get install libboost-all-dev

然后输入密码，安装，安装完之后目录在 `/usr/include/boost` 下。

### Linux下使用

Eclipse或者其他IDE中使用 boost 时，需要以下几步，引入头文件，添加库。

	C/C++ Build, Cross G++ Linker，Libraries， 添加相应Libraries（-l），并添加相应Library search path（-L） /usr/include

![boost config](https://lh3.googleusercontent.com/-jQywZCvSioI/Vnn7Tmepm-I/AAAAAAAA4rA/edGCX7VToVM/s912-Ic42/screenshot-window-2015-12-23-092918.png)


## Mac

Max 下安装 boost 最简单的方式，就是用 brew：

	brew install boost

或者手动安装，参考boost[官网](http://www.boost.org/doc/libs/1_60_0/more/getting_started/unix-variants.html)

简单翻译：

1. 下载 boost_1_60_0.tar.bz2
2. 解压 tar --bzip2 -xf /path/to/boost_1_60_0.tar.bz2
3. 一部分组件(Header-Only Libraries)在完成1和2以后就能直接用，因为是直接写在hpp的inline函数，但是要利用其它功能，需要build boost库里面的各个组件（步骤4-6）

    需要单独编译的库有：
    - Boost.Chrono
    - Boost.Context
    - Boost.Filesystem
    - Boost.GraphParallel
    - Boost.IOStreams
    - Boost.Locale
    - Boost.MPI
    - Boost.ProgramOptions
    - Boost.Python (see the Boost.Python build documentation before building and installing it)
    - Boost.Regex
    - Boost.Serialization
    - Boost.Signals
    - Boost.System
    - Boost.Thread
    - Boost.Timer
    - Boost.Wave

4. 进入解压后的目录 `cd path/to/boost_1_60_0`
5. 输入`./bootstrap.sh` 开始配置，添加 `--prefix` 选择安装地址
		./bootstrap.sh --prefix=path/to/installation/prefix
6. 输入 `./b2 install` 开始安装

备注：如果第5步直接输入./bootstrap.sh 则默认会安装到/usr/local下面的include和lib目录下，而/usr是在Macintosh HD下面的一个隐藏目录，到此boost就安装到了电脑上，可以使用它进行编程了。

Mac下默认安装地址是在 `/usr/local/include` 和 `/usr/local/lib` 下，因此在配置环境的时候需要注意将boost地址写入。

### xcode配置boost环境

基本思路和Linux中一样，添加头文件搜索路径，添加lib搜索路径，引用相应lib文件。

1. 用xcode创建控制台应用程序，在项目设置->build Settings->Search Paths->Header Search Paths和Library Search Paths里面分别添加上述默认安装地址 `/usr/local/include/` 和 `/usr/local/lib` 目录
2. 在项目设置->build Phases->Link Library With Libraries里面点加号，选择option，找到上述lib目录，选中里面以.a 或者 .dylib 结尾的文件，添加即可


参考：[YouTube](https://www.youtube.com/watch?v=z2o8wqhVh_M&list=PLKHfgb7QQO0gCMSg4BItxvA_gZPUXmSkb&index=2)

其他操作系统请参考以上 YouTube Playlist，我收集整理了一些基本够用了。