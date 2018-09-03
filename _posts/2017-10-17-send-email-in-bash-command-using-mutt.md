---
layout: post
title: "使用 mutt 在 Bash 中发送邮件及附件"
tagline: ""
description: ""
category: Linux
tags: [linux, email, mutt,]
last_updated:
---

在编写定时备份脚本时遇到一个需求，就是在 Bash 脚本中发送带附件的邮件。于是找到了 mutt。

Mutt 是一个命令行的邮件客户端，Mutt 能够轻松地在命令行发送和读取邮件。 Mutt 支持 POP 和 IMAP 协议。 尽管 Mutt 是基于命令的，但也同样有一个友好的界面。

如果不使用界面，使用 Mutt 命令发邮件也非常方便，只需要一条命令即可发送或者批量发送邮件。

## 功能说明
E-mail 管理程序。

语法

    mutt [-hnpRvxz][-a 文件][-b 地址][-c 地址][-f 邮件文件][-F 配置文件][-H 邮件草稿][-i 文件][-m 类型][-s 主题] 邮件地址

补充说明：mutt 是一个文字模式的邮件管理程序，提供了全屏幕的操作界面。

参数：

- `-a` 文件 在邮件中加上附加文件。
- `-b` 地址 指定密件副本的收信人地址。
- `-c` 地址 指定副本的收信人地址。
- `-f` 邮件文件 指定要载入的邮件文件。
- `-F` 配置文件 指定 mutt 程序的设置文件，而不读取预设的.muttrc 文件。
- `-h` 显示帮助。
- `-H` 邮件草稿 将指定的邮件草稿送出。
- `-i` 文件 将指定文件插入邮件内文中。
- `-m` 类型 指定预设的邮件信箱类型。
- `-n` 不要去读取程序培植文件 (/etc/Muttrc)。
- `-p` 在 mutt 中编辑完邮件后，而不想将邮件立即送出，可将该邮件暂缓寄出。
- `-R` 以只读的方式开启邮件文件。
- `-s` 主题 指定邮件的主题。
- `-v` 显示 mutt 的版本信息以及当初编译此文件时所给予的参数。
- `-x` 模拟 mailx 的编辑方式。
- `-z` 与 -f 参数一并使用时，若邮件文件中没有邮件即不启动 mutt。

## 安装方法

Debian/Ubuntu/Linux Mint 安装

	sudo apt-get install -y mutt


## 使用方法

发送一封简单的邮件（可能会被主流邮箱认为垃圾邮件，垃圾箱查看一下）

	echo "Email body" | mutt -s "Email Title" root@einverne.info

进入命令行交互界面之后使用如下快捷键操作

- 使用 `t` 改变接受者邮件地址
- 使用 `c` 改变 Cc 地址
- 使用 `a` 来增加附件
- 使用 `q` 退出
- 使用 `y` 来发送邮件

发送带附件的邮件

	echo "body" | mutt -s "mysql backup" root@einverne.info -a /mysql.tar.gz

读取文本中的信息作为内容

	mutt -s "Test" xxxx@qq.com

添加多个附件

	echo "body" | mutt -s "web backup" root@einverne.info -a /mysql.tar.gz -a /web.tar.gz

抄送和密送

	echo "body" | mutt -s "title" -c cc@gmail.com -b bcc@gmail.com root@einverne.info

- 使用 `-c` 来抄送
- 使用 `-b` 来添加密送
- 使用 `-s` 来添加标题
- 使用 `-a` 来添加附件


设置发件人

编辑配置文件

	vi /etc/Muttrc

添加如下内容，防止被作为垃圾邮件

	set from="mutt@einverne.info"
	set use_from=yes
	set envelope_from="yes"
	set realname="Ein Verne"

mutt@einverne.info 为发信地址

mutt 发送邮件略慢，需要等待一分钟或者更长才能发送成功，作为备份工具好好利用。


## reference

- <https://www.tecmint.com/send-mail-from-command-line-using-mutt-command/>
