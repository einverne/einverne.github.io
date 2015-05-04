---
layout: post
title: "vim插件Vundle"
description: "VIM插件Vundle，vim插件"
category: VIM
tags: [VIM, vim-plugin, vundle]
---

##简单介绍
经[Code Rush](http://foocoder.com/blog/mei-ri-vimcha-jian-kai-pian-zhi-vundle.html/)推荐，之后又陆陆续续看到很多在使用这款插件，所以在入门插件的时候就第一个安装了此插件，VIM如果不依靠插件来增强功能可谓鸡肋。而VIM提供的插件又很多，新手可能无从下手。幸好让我接触到了这个[Vundle]插件，Vundle用来安装，管理其他插件，这样以后安装插件卸载插件的问题就迎刃而解了。用[Vundle]管理插件有以下好处：

- 自动下载安装插件
- 自动更新插件
- 只需要保存一份配置文件即可在新环境下安装所有插件
- 自动清理没用的插件

##安装

###下载地址

> [https://github.com/gmarik/Vundle.vim](https://github.com/gmarik/Vundle.vim)

###Mac和Linux安装

1. 安装git客户端
Mac和Linux一般默认已经安装

2. 下载并安装Vundle

		git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim

3. vimrc配置

	把以下的配置放到vimrc最前面

		set nocompatible              " be iMproved, required
		filetype off                  " required

		" set the runtime path to include Vundle and initialize
		set rtp+=~/.vim/bundle/Vundle.vim
		call vundle#begin()
		" alternatively, pass a path where Vundle should install plugins
		"call vundle#begin('~/some/path/here')

		" let Vundle manage Vundle, required
		Plugin 'gmarik/Vundle.vim'

		" The following are examples of different formats supported.
		" Keep Plugin commands between vundle#begin/end.
		" plugin on GitHub repo
		Plugin 'tpope/vim-fugitive'
		" plugin from http://vim-scripts.org/vim/scripts.html
		Plugin 'L9'
		" Git plugin not hosted on GitHub
		Plugin 'git://git.wincent.com/command-t.git'
		" git repos on your local machine (i.e. when working on your own plugin)
		Plugin 'file:///home/gmarik/path/to/plugin'
		" The sparkup vim script is in a subdirectory of this repo called vim.
		" Pass the path to set the runtimepath properly.
		Plugin 'rstacruz/sparkup', {'rtp': 'vim/'}
		" Avoid a name conflict with L9
		Plugin 'user/L9', {'name': 'newL9'}

		" All of your Plugins must be added before the following line
		call vundle#end()            " required
		filetype plugin indent on    " required
		" To ignore plugin indent changes, instead use:
		"filetype plugin on
		"
		" Brief help
		" :PluginList       - lists configured plugins
		" :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
		" :PluginSearch foo - searches for foo; append `!` to refresh local cache
		" :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal
		"
		" see :h vundle for more details or wiki for FAQ
		" Put your non-Plugin stuff after this line

4. 安装插件

	启动vim，并运行`:PluginInstall`

###Windows下安装

查看官方[教程](https://github.com/gmarik/Vundle.vim/wiki/Vundle-for-Windows),官方的教程有点问题，完全按照所写配置并不能成功。

	vim74     #主程序目录 对应变量 $VIMRUNTIME
	vimfiles  #配置文件目录 对应变量 $VIM	

1. 同样需要Git，并且需要Curl

2. 下载安装[msysgit](http://msysgit.github.io/),add `Path` to your environment.安装过程中选择*Run git from Windows command prompt option*安装完成之后在终端运行`git --version`，如果出现类似以下情况即可：

		C:\> git --version
		git version 1.7.4.msysgit.0

3. 设置Curl

	将[以下内容](https://gist.github.com/912993)保存成`curl.cmd`,并存到msysgit安装目录中`C:\Program Files\Git\cmd\curl.cmd`,在终端运行`curl --version`出现以下类似内容即可：

		C:\> curl --version
		curl 7.21.1 (i686-pc-mingw32) libcurl/7.21.1 OpenSSL/0.9.8k zlib/1.2.3
		Protocols: dict file ftp ftps http https imap imaps ldap ldaps pop3 pop3s rtsp smtp smtps telnet tftp
		Features: Largefile NTLM SSL SSPI libz

4. 因为Windows下和mac,linux环境不同，vim的配置地址也不同,所以git clone到的目录如下：

		git clone https://github.com/gmarik/Vundle.vim.git vimfiles/bundle/Vundle.vim

5. _vimrc

	需要将Mac和Linux中相应位置代码修改成如下代码：

		" 配置同Mac，只需要按照下面修改rtp的路径即可
		set rtp+=$VIM/vimfiles/bundle/Vundle.vim/
		let path='$VIM/vimfiles/bundle'
		call vundle#rc(path)

##使用

使用方法很简单，只需3步使新插件生效即可

1. 将目标插件配置进vimrc或vundle_vimrc
2. 执行:PluginInstall
3. 重启

常用命令

	:PluginList       - 枚举已安装的插件列表
	:PluginInstall    - 安装插件或者后面加上'!'更新
	:PluginUpdate     - 更新插件 同 :PluginInstall!
	:PluginSearch foo - 查找插件。例如查找名称为foo的插件。或者后面加'!'更新本地缓存
	:PluginClean      - 清理无用插件或者后面加'!'自动清理

更多使用方法查看帮助 `:h vundle`

参考：

- [http://www.jianshu.com/p/40f275c2e454](http://www.jianshu.com/p/40f275c2e454)

[Vundle]:https://github.com/gmarik/Vundle.vim
