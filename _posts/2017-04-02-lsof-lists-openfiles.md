---
layout: post
title: "每天学习一个命令：lsof 列出打开的文件"
aliases: "每天学习一个命令：lsof 列出打开的文件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [lsof, linux, file, command,]
last_updated:
---

`lsof` 用于列出当前系统打开的文件 (list open files)，在 Linux 中，任何事物都以文件的形式存在，通过文件不仅仅可以访问常规数据，还可以访问网络连接和硬件。所以比如传输控制协议 (TCP) 和用户数据报协议 (UDP) 套接字等，系统在后台都为该应用程序分配了一个文件描述符，无论这个文件的本质如何，该文件描述符为应用程序与基础操作系统之间的交互提供了通用接口。因为 `lsof` 命令需要访问核心内存和各种文件，所以需要 root 用户执行。

## 简单使用
比如可以使用 `lsof` 来查看当前系统中 80 端口是否被占用

    sudo lsof -i tcp:80
    COMMAND     PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
    docker-pr 14863 root    4u  IPv6 38693061      0t0  TCP *:http (LISTEN)

然后获取到 PID 之后可以用 lsof 来查看进程

    sudo lsof -p 14863
    COMMAND     PID USER   FD      TYPE   DEVICE SIZE/OFF       NODE NAME
    docker-pr 14863 root  cwd       DIR      8,0     4096          2 /
    docker-pr 14863 root  rtd       DIR      8,0     4096          2 /
    docker-pr 14863 root  txt       REG      8,0  3329080      17531 /usr/bin/docker-proxy
    docker-pr 14863 root  mem       REG      8,0  1868984      20743 /lib/x86_64-linux-gnu/libc-2.23.so
    docker-pr 14863 root  mem       REG      8,0   138696      11625 /lib/x86_64-linux-gnu/libpthread-2.23.so
    docker-pr 14863 root  mem       REG      8,0   162632      10738 /lib/x86_64-linux-gnu/ld-2.23.so
    docker-pr 14863 root    0r      CHR      1,3      0t0       8085 /dev/null
    docker-pr 14863 root    1w      CHR      1,3      0t0       8085 /dev/null
    docker-pr 14863 root    2w      CHR      1,3      0t0       8085 /dev/null
    docker-pr 14863 root    4u     IPv6 38693061      0t0        TCP *:http (LISTEN)
    docker-pr 14863 root    5u  a_inode     0,12        0       8082 [eventpoll]
    docker-pr 14863 root   12r      REG      0,3        0 4026531993 net

由以上的信息就能看出来我的机器中的 80 端口是 docker 占用的，docker 的位置在系统中的 `/usr/bin/docker-proxy`

`lsof` 输出各列信息的意义如下：

- COMMAND：进程的名称
- PID：进程标识符
- PPID：父进程标识符（需要指定 -R 参数）
- USER：进程所有者
- PGID：进程所属组
- FD：文件描述符，应用程序通过文件描述符识别该文件。如 cwd、txt 等

FD 的取值

- cwd：表示 current work dirctory，即：应用程序的当前工作目录，这是该应用程序启动的目录，除非它本身对这个目录进行更改
- txt ：该类型的文件是程序代码，如应用程序二进制文件本身或共享库，如上列表中显示的 /sbin/init 程序
- lnn：library references (AIX);
- er：FD information error (see NAME column);
- jld：jail directory (FreeBSD);
- ltx：shared library text (code and data);
- mxx ：hex memory-mapped type number xx.
- m86：DOS Merge mapped file;
- mem：memory-mapped file;
- mmap：memory-mapped device;
- pd：parent directory;
- rtd：root directory;
- tr：kernel trace file (OpenBSD);
- v86  VP/ix mapped file;
- 0：表示标准输出
- 1：表示标准输入
- 2：表示标准错误

一般在标准输出、标准错误、标准输入后还跟着文件状态模式：r、w、u 等

- u：表示该文件被打开并处于读取 / 写入模式
- r：表示该文件被打开并处于只读模式
- w：表示该文件被打开并处于
- 空格：表示该文件的状态模式为 unknow，且没有锁定
- -：表示该文件的状态模式为 unknow，且被锁定

## 介绍
在有了基本的概念之后来看 `lsof` 的参数

    lsof  [ -?abChKlnNOPRtUvVX ] [ -A A ] [ -c c ] [ +c c ] [ +|-d d ] [ +|-D D ] [ +|-e s ] [ +|-E ] [ +|-f [cfgGn] ] [ -F [f] ] [ -g [s] ] [ -i [i] ] [ -k k ] [ +|-L [l] ] [ +|-m m
       ] [ +|-M ] [ -o [o] ] [ -p s ] [ +|-r [t[m<fmt>]] ] [ -s [p:s] ] [ -S [t] ] [ -T [t] ] [ -u s ] [ +|-w ] [ -x [fl] ] [ -z [z] ] [ -Z [Z] ] [ -- ] [names]

能看到非常多的选项，因此也能看到 `lsof` 的强大。

### -i 选项查看网络连接

默认 : 没有选项，lsof 列出活跃进程的所有打开文件

    -i : 列出网络连接

使用 `lsof -i` 来显示所有的链接，可以用来代替 `netstat`:

    sudo lsof -i
    COMMAND     PID     USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
    sshd       2972     root    3u  IPv4 18883553      0t0  TCP *:22 (LISTEN)
    sshd       2972     root    4u  IPv6 18883562      0t0  TCP *:22 (LISTEN)
    docker-pr 14852     root    4u  IPv6 38693034      0t0  TCP *:https (LISTEN)
    docker-pr 14863     root    4u  IPv6 38693061      0t0  TCP *:http (LISTEN)

这里输出结果有缩略，但也能看出来 22 的 SSH 端口，然后 `http` 默认的 80 端口，和 `https` 使用的 443 端口。如果要查看 IPv6 的流量可以使用 `lsof -i 6` 。

同样如果要查看 TCP 或者 UDP 连接信息，可以使用 `lsof -iTCP` 和 `lsof -iUDP`。

假如已经知道了端口号，想要查看该端口哪一个进程在使用可以使用：

	lsof -i:80

再比如查看和本地 22 端口的连接 `lsof -i:22`

显示来自特定主机的连接，`lsof -i@1.2.3.4` ，指定主机和端口 `lsof -i@1.2.3.4:22`

### 根据状态过滤
`lsof` 还可以使用过滤器来过滤连接状态，比如只查看正在监听 TCP 端口的进程：

	lsof -iTCP -sTCP:LISTEN

### -p 选项查看指定进程
如果已经知道进程的 PID，可以使用 `-p` 查看指定进程 ID 已打开的内容

    lsof -p 10075

### 列出用户打开的文件

    lsof -u einverne

### 查看 Unix 域套接字
使用 `-U` 选项来列出系统中正在使用的 Unix 域套接字：

	lsof -U

### 查看 java 项目依赖的 jar
比如说如果系统中依赖的一个 jar 被发现有漏洞，比如说可以查看 `fastjson` 在系统中有没有使用。

    lsof -X | grep fastjson
