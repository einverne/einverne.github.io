---
layout: post
title: "Linux 常见目录结构说明"
aliases: "Linux 常见目录结构说明"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, dir-structure, file-system, command ]
last_updated:
---

主要总结 Linux 下常用的目录，主要是为了学习 Linux, 以及了解各个目录的作用，以便于方便的管理 Linux 下的配置以及文件。绝大多数的 Unix-like 操作系统都遵循 [Filesystem Hierarchy Standard](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard) 这个标准，这个标准规定了哪些目录作为什么功能，存放一些什么内容。

### 什么是文件系统
了解 Linux 文件系统的目录结构，是学好 Linux 的第一步，也是至关重要的一步。

当使用 Linux 的时候，如果您通过 `ls -l /` 查询根目录结构，就会发现，根目录下包含了很多的目录，比如 etc、usr、var、bin 等等，而在这些目录中，也有很多的目录或文件。文件系统在 Linux 下看上去就象树形结构，所以我们可以把文件系统的结构形象的称为树形结构。

Linux 文件系统的最顶端是 `/`，我们称 / 为 Linux 的 root(根目录），也就是 Linux 操作系统的文件系统。Linux 的文件系统的入口就是 /，所有的目录、文件、设备都在 / 之下，/ 就是 Linux 文件系统的组织者，也是最上级的领导者。

### 文件系统的类型

Linux 有四种基本文件系统类型：

- 普通文件：比如文本文件、C 语言源代码、SHELL 脚本、二进制的可执行文件等，可用 cat、less、more、vi、emacs 来察看内容
- 目录文件：包括文件名、子目录名及其指针。它是 Linux 储存文件名的唯一地方，可用 ls 列出目录文件时，用 `d` 来标识
- 连接文件：指向同一索引节点的那些目录条目。可以使用 `ln` 来创建，用 ls 来查看时，连接文件会用 `l` 来标识，而文件面后以"->"指向所连接的文件。
- 特殊文件：Linux 的一些设备如磁盘、终端、打印机等都在文件系统中表示出来，这类文件就是特殊文件，常放在 `/dev` 目录内，Linux 使用类似于 `/dev/sda1`, `/dev/sda2` 这样的方式来表示磁盘分区

文件类型可以用 `file` 命令来识别。

## Linux 文件系统的目录结构

`/` 是 Linux 文件系统的入口，目录树的根节点。

- `/bin` （essential binaries)系统所需的二进制命令，比如 ls、cp、mkdir 等命令，该目录中包含单用户模式下所有可执行的文件，功能和 `/usr/bin` 类似，这个目录中的文件都是可执行的、普通用户都可以使用的命令。作为基础系统所需要的最基础的命令就是放在这里
- `/dev` 设备文件存储目录，比如磁盘，光驱...
- `/boot` (static files of boot loader) Linux 的内核及引导系统程序所需要的文件目录，比如 vmlinuz initrd.img 文件都位于这个目录中。在一般情况下，[[GNU GRUB]] 或 LILO 系统引导管理器也位于这个目录
- `/etc`  (Host specific system config) 系统配置文件所在
- `/home` 普通用户目录默认存放目录，不同用户会在该目录下有对应用户名的子目录，保存用户个人文件以及个人配置
- `/lib`  库文件存放目录，一般用来存放给 `/bin` 或者 `/sbin` 目录下可执行文件的依赖库
- `/mnt`  临时挂载点，这个目录一般是用于存放挂载储存设备的挂载目录的，比如有 cdrom 等目录。可以参看 /etc/fstab 的定义。有时我们可以把让系统开机自动挂载文件系统，把挂载点放在这里也是可以的。主要看 /etc/fstab 中怎么定义了；比如光驱可以挂载到 /mnt/cdrom 。
- `/opt` 表示的是可选择的意思，有些软件包也会被安装在这里，也就是自定义软件包，比如在 Fedora Core 5.0 中，OpenOffice 就是安装在这里。有些我们自己编译的软件包，就可以安装在这个目录中；通过源码包安装的软件，可以通过 ./configure --prefix=/opt/ 目录
- `/proc`  操作系统运行时，进程信息及内核信息（比如 cpu、硬盘分区、内存信息等）存放在这里。/proc 目录伪装的文件系统 proc 的挂载目录，proc 并不是真正的文件系统，它的定义可以参见 /etc/fstab
- `/root` 超级权限用户 root 的 HOME 目录
- `/sbin` (system binary)大多是系统管理的命令的存放位置，是超级权限用户 root 的可执行命令存放地，普通用户无权限执行这个目录下的命令，这个目录和 `/usr/sbin`; /usr/X11R6/sbin 或 /usr/local/sbin 目录是相似的；我们记住凡是目录 sbin 中包含的都是 root 权限才能执行的。
- `/usr` (shareable and read-only data)是系统存放程序的目录，比如命令、帮助文件等。这个目录下有很多的文件和目录。当我们安装一个 Linux 发行版官方提供的软件包时，大多安装在这里。如果有涉及服务器配置文件的，会把配置文件安装在 /etc 目录中。/usr 目录下包括涉及字体目录 /usr/share/fonts ，帮助目录 /usr/share/man 或 /usr/share/doc，普通用户可执行文件目录 /usr/bin 或 /usr/local/bin 或 /usr/X11R6/bin ，超级权限用户 root 的可执行命令存放目录，比如 /usr/sbin 或 /usr/X11R6/sbin 或 /usr/local/sbin 等；还有程序的头文件存放目录 /usr/include。
- `/var` (variable data files)目录存放经常变化的内容
- `/lost+found` 在 ext2 或 ext3 文件系统中，当系统意外崩溃或机器意外关机，而产生一些文件碎片放在这里。当系统启动的过程中 fsck 工具会检查这里，并修复已经损坏的文件系统。有时系统发生问题，有很多的文件被移到这个目录中，可能会用手工的方式来修复，或移到文件到原来的位置上
- `/tmp` 临时文件目录，有时用户运行程序的时候，会产生临时文件。/tmp 就用来存放临时文件的。/var/tmp 目录和这个目录相似

### root
开机过程中仅有根目录会被挂载， 其他分区则是在开机完成之后才会持续的进行挂载的行为。

- /etc：配置文件
- /bin：重要执行档
- /dev：所需要的装置文件
- /lib：执行档所需的函式库与核心所需的模块
- /sbin：重要的系统执行文件

以上目录不可与根目录分开在不同的分区。

### usr
包含 multi-user 可以使用的工具和应用。

- `/usr/bin` 所有用户都能使用的二进制可执行文件
- `/usr/lib` 给 `/usr/bin` 和 `/usr/sbin` 的库文件
- `/usr/sbin` 非必须的系统二进制文件
- `/usr/local` 这台机器使用的本地文件，一般也有`bin`, `lib`, `share` 等几个目录

### etc
`/etc` 目录用来存放系统及应用配置文件。

- `/etc/opt` 附加包的配置信息存放地
- `/etc/X11` X Window System, version 11 配置文件存放地
- `/etc/passwd` 系统用户名

其他插件的软件一般会在 `/etc` 目录下新建一个以自己名字命名的文件夹并将自己的配置文件放在其中，比如 `/etc/nginx`, `/etc/mysql`, `/etc/redis` 等等。

### var

`/var` 该目录用来存放经常会发生变化的数据，程序运行中的数据存放地，比如系统日志、邮件内容、网站内容等，`/var` 是 `variable` 的缩写。

- `/var/log` 用来存放系统日志
- `/var/www` 存放 Apache/Nginx 服务器内容
- `/var/mail`存放邮箱内容
- `/var/lib` 用来存放一些库文件，比如程序运行时的持久化内容
- `/var/run` 某些程序或者服务启动后会将 PID 存放于此
- `/var/spool` 队列数据，这些数据经常在使用后被删除，比如 [crontab](/post/2017/03/crontab-schedule-task.html) 数据就在该目录


