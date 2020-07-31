---
layout: post
title: "Albert launcher"
tagline: ""
description: ""
category:
tags: [linux, albert, launcher, application,]
last_updated:
---

Albert 是一个 Linux 上的启动器，使用 C++ 和 QT 实现，实现了如下的功能：

- Run Applications
- Open files
- Open bookmarks
- Search web
- calculate things
- GPL-licensed

## Install

### Official Build
通过下面的网站下载官方编译的版本。

- <https://software.opensuse.org/download.html?project=home:manuelschneid3r&package=albert>

### 从源代码编译安装
从源码编译安装：

	git clone --recursive https://github.com/albertlauncher/albert.git
	mkdir albert-build
	cd albert-build
	cmake ../albert -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Debug
	make
	sudo make install

顺利的话可以走到最后一步，不过大概率会出现各种依赖的问题。

	➜ cmake ../albert -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Debug
	CMake Error at /opt/qt59/lib/cmake/Qt5/Qt5Config.cmake:28 (find_package):
	  Could not find a package configuration file provided by "Qt5X11Extras" with
	  any of the following names:

		Qt5X11ExtrasConfig.cmake
		qt5x11extras-config.cmake

	  Add the installation prefix of "Qt5X11Extras" to CMAKE_PREFIX_PATH or set
	  "Qt5X11Extras_DIR" to a directory containing one of the above files.  If
	  "Qt5X11Extras" provides a separate development package or SDK, be sure it
	  has been installed.
	Call Stack (most recent call first):
	  lib/globalshortcut/CMakeLists.txt:16 (find_package)


	-- Configuring incomplete, errors occurred!


安装缺失的依赖：

	➜ sudo apt install libqt5x11extras5 libqt5x11extras5-dev



	➜ cmake ../albert -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Debug
	CMake Error at /usr/lib/x86_64-linux-gnu/cmake/Qt5/Qt5Config.cmake:28 (find_package):
	  Could not find a package configuration file provided by "Qt5Svg" with any
	  of the following names:

		Qt5SvgConfig.cmake
		qt5svg-config.cmake

	  Add the installation prefix of "Qt5Svg" to CMAKE_PREFIX_PATH or set
	  "Qt5Svg_DIR" to a directory containing one of the above files.  If "Qt5Svg"
	  provides a separate development package or SDK, be sure it has been
	  installed.
	Call Stack (most recent call first):
	  plugins/widgetboxmodel/CMakeLists.txt:7 (find_package)


	-- Configuring incomplete, errors occurred!

安装缺失的依赖：

	➜ sudo apt install libqt5svg5 libqt5svg5-dev



## reference

- <https://albertlauncher.github.io/docs/installing/>
