---
layout: post
title: "lua installation"
tagline: ""
description: "instructions of lua installation, install lua in linux, install lua under macosx"
category: 学习笔记
tags: [lua, linux,]
last_updated: 
---

## Install Lua in Linux
You can install lua in Linux Mint/Debian/Ubuntu.. You can find all verions of lua [here](http://www.lua.org/download.html).

	wget http://www.lua.org/ftp/lua-5.3.1.tar.gz
	tar zxf lua-5.3.1.tar.gz
	cd lua-5.3.1
	make linux test

Finally, if test have passed, then install lua into the right place by running `sudo make install`:

	einverne@mint ~/Downloads/lua-5.3.1 $ sudo make install
	[sudo] password for einverne:
	cd src && mkdir -p /usr/local/bin /usr/local/include /usr/local/lib /usr/local/man/man1 /usr/local/share/lua/5.3 /usr/local/lib/lua/5.3
	cd src && install -p -m 0755 lua luac /usr/local/bin
	cd src && install -p -m 0644 lua.h luaconf.h lualib.h lauxlib.h lua.hpp /usr/local/include
	cd src && install -p -m 0644 liblua.a /usr/local/lib
	cd doc && install -p -m 0644 lua.1 luac.1 /usr/local/man/man1

According to the output, we know that lua header files are located under `/usr/local/include`. And `liblua.a` lib is located under `/usr/local/lib`. This two paths may be used later when coding with C/C++. And most important thing executalbe file is located under `/usr/local/bin`. Most of the Linux distributions are installed lua by default. But most of them don't have liblua.a installed.

## Install Lua on Mac OS X

If you want to build from source code like under linux, just change `make linux test` into `make macosx test`. And all the following steps are the same as I mentioned in the Linux section.

If you want a more convenient way to install lua, you can download binary package [here](http://rudix.org/packages/lua.html). And click next and next to finish installation.Default installation path is same as in Linux.

And id you are using Homebrew just run `brew install lua`, everything is done.

And you can find more ways to install lua on [lua-users.org](http://lua-users.org/wiki/MacOsxLua)

## For other OS
please see: <http://lua-users.org/wiki/LuaDistributions>

## Testing Lua

After installation , run `lua -v` to check the lua version. Test lua by printing “hello world” using following code. Run `lua` in terminal:

	einverne@mint ~ $ lua
	Lua 5.3.1  Copyright (C) 1994-2015 Lua.org, PUC-Rio
	> print "hello world"
	hello world

Type <kbd>Control</kbd>+<kbd>D</kbd> to exit.

## lua IDE
If you want to find a lua IDE, I highly recommend [Zerobrane Studio](http://studio.zerobrane.com/). It is cross-platform and support different versions of lua from 5.1 to lastest 5.3. And it has a debugger build-in, which is great for debug lua code from local or remote. It is worth to have a try.

