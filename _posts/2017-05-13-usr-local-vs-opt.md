---
layout: post
title: "目录 /usr/local vs /opt 的区别及 JDK 安装"
tagline: ""
description: "JDK 的两种安装方式引出的目录结构对比"
category: 经验总结
tags: [Linux, FHS, Java, ]
last_updated: 
---

今天看 JDK 的路径突然发现我在两台机子上，一台装在了 `/usr/local/` 目录下，而我自己的 Mint 装在了 `/opt/` 目录下。感觉对 Linux 目录结构还需要增加了解，就Google了一下。

`/usr/local` 和 `/opt` 目录设计为存放非系统级命令，而 `/usr/local` 目录一般用来防止管理员通过本地编译安装的程序，比如通过 `./configure; make; make install` 等命令安装的程序，该目录的目的就是为了使用户产生的命令不和系统命令产生冲突。

`/opt` 目录一般用来安装非捆绑的软件程序，每个应用都有其自己的子目录，比如在安装Chrome 之后，Chrome 完整的程序和其资源文件都会存在 `/opt/google/chrome` 下。

## 安装JDK 的两种方式
因此在 Linux 下如果手工安装 JDK 7/8 时，可以将安装路径手动指定到 `/opt` 目录下，方便管理。

安装 JDK 的两种方式，一种是直接通过 apt 包管理来安装

	sudo add-apt-repository -y ppa:webupd8team/java
	sudo apt-get update
	sudo apt-get install oracle-java8-installer

然后使用 `java -version` 来验证。

或者直接从官网下载压缩包，将文件内容解压到 `/opt/java/` 目录下。然后配置环境变量 `JAVA_HOME` 指向 Java bin 的目录。

	wget http://..../jdk-8u91-linux-x64.tar.gz
	tar -zxvf jdk-8u91-linux-x64.tar.gz -C /opt/java/
	vim ~/.zshrc # or ~/.bashrc

添加

	export JAVA_HOME=/opt/java/jdk1.8.0_91/
	export PATH="$PATH:$JAVA_HOME/bin/"

使环境变量生效

	source ~/.zshrc

## 更新提供JDK

运行命令会得到目前系统安装的 JDK 或者 JRE，选择序号确定即可。

	$ sudo update-alternatives --config java
	There are 3 choices for the alternative java (providing /usr/bin/java).
	  Selection    Path                                            Priority   Status
	------------------------------------------------------------
	* 0            /usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java   1071      auto mode
	  1            /usr/lib/jvm/java-6-openjdk-amd64/jre/bin/java   1061      manual mode
	  2            /usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java   1071      manual mode
	  3            /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java   1081      manual mode
	Press enter to keep the current choice[*], or type selection number:

## reference 

- <https://launchpad.net/~webupd8team/+archive/ubuntu/java>
