---
layout: post
title: "Unix 进程"
tagline: ""
description: ""
category: 学习笔记
tags: [unix, linux, process, ]
last_updated:
---

Unix 内核在硬件之上，与硬件交互，系统文件读写，网络数据发送，内存分配，扬声器播放音频等等。程序不能直接访问内核，通信通过系统调用完成。

系统调用是内核和用户空间交互的桥梁，规定了程序和计算机硬件之间可以发生的交互。

Unix 的系统调用文档已经在系统中，输入 man man 查看。

进程是 Unix 系统基石，所有的代码都在进程中被执行。

## 进程标示
唯一进程标示 PID，PID 本身没有任何进程信息，只是一个数字。系统中每一个进程都有其父进程，PPID。多数情况下，特定进程的父进程就是调用他的进程。

文件描述符值用来跟踪打开的资源，已经关闭的资源没有文件描述符。

每个 Unix 进程都有三个打开的资源，STDIN，STDOUT，STDERR。

## 限制打开的资源数量
每个进程打开的资源数量都是限制的，进程资源限制中，分为 soft limit 和 hard limit. soft limit 指的是内核所能支持的资源上限，hard limit 是 soft limit 的上限，当设置 hard limit  之后 soft limit 只能小于 hard limit.

可以使用 `ulimit -a` 来查看资源限制情况。

## 进程环境变量
所有进程都从父进程继承环境变量。

C 库函数 `setenv()` 和 `getenv()`

## 进程都有参数
所有进程都可以访问 ARGV 的特殊数组，argv 是 argument vector 缩写，参数向量

## 进程 fork
forking 是 Unix 编程中最强大的概念，fork 系统调用允许运行中的进程以编程的形式创建新的进程，这个新进程和原始进程一样。

在 forking 时，调用 fork 的进程被称为“父进程”，而新创建的进程被称为“子进程”。

forking 时会创建一样的新进程，所以 fork 尽管很快，但是会有一些问题，比如如果内存占用比较大，fork 多份之后可能内存被撑爆。

现代 Unix 采用写时复制（copy-on-write, CoW) 方法来克服这个问题，将实际内存复制操作推迟到真正写入的时候，父进程和子进程实际共享内存数据，直到其中一个需要对数据进行修改，才复制。

当 fork 多个并发子进程时，进程看管这些子进程，确保能够保持响应，对子进程的退出做出回应。

## 信号

信号    | 值        | 动作          | 说明
--------|-----------|-----------|-------------
SIGHUP	| 1	        | Exit	    | Hangup
SIGINT	| 2	        | Exit	    | Interrupt
SIGQUIT	| 3	        | Core	    | Quit
SIGILL	| 4	        | Core	    | Illegal Instruction
SIGTRAP	| 5	        | Core	    | Trace/Breakpoint Trap
SIGABRT	| 6	        | Core	    | Abort
SIGEMT	| 7	        | Core	    | Emulation Trap
SIGFPE	| 8	        | Core	    | Arithmetic Exception
SIGKILL	| 9	        | Exit	    | Killed
SIGBUS	| 10	    | Core	    | Bus Error
SIGSEGV	| 11	    | Core	    | Segmentation Fault
SIGSYS	| 12	    | Core	    | Bad System Call
SIGPIPE	| 13	    | Exit	    | Broken Pipe
SIGALRM	| 14	    | Exit	    | Alarm Clock
SIGTERM	| 15	    | Exit	    | Terminated
SIGUSR1	| 16	    | Exit	    | User Signal 1
SIGUSR2	| 17	    | Exit	    | User Signal 2
SIGCHLD	| 18	    | Ignore	| Child Status
SIGPWR	| 19	    | Ignore	| Power Fail/Restart
SIGWINCH| 20	    | Ignore	| Window Size Change
SIGURG	| 21	    | Ignore	| Urgent Socket Condition
SIGPOLL	| 22	    | Ignore	| Socket I/O Possible
SIGSTOP	| 23	    | Stop	    | Stopped (signal)
SIGTSTP	| 24	    | Stop	    | Stopped (user)
SIGCONT	| 25	    | Ignore	| Continued
SIGTTIN	| 26	    | Stop	    | Stopped (tty input)
SIGTTOU	| 27	    | Stop	    | Stopped (tty output)
SIGVTALRM	 |28	| Exit	    | Virtual Timer Expired
SIGPROF	| 29	    | Exit	    | Profiling Timer Expired
SIGXCPU	| 30	    | Core	    | CPU time limit exceeded
SIGXFSZ	| 31	    | Core	    | File size limit exceeded
SIGWAITING	| 32	| Ignore	| All LWPs blocked
SIGLWP	| 33	    | Ignore	| Virtual Interprocessor Interrupt for Threads Library
SIGAIO	| 34	    | Ignore	| Asynchronous I/O

进程可以在任何时候收到信号，常见的用法在 shell 中使用 kill 发送信号。在时间中，信号多由长期运行的进程使用，例如服务器和守护进程。

## 进程间通信

### 管道
管道是一个单向数据流，管道也是一种资源，有自己的文件描述符和其他一切，也可以和子进程共享。“流”数据没有开始和结束的概念，需要通过分隔符来确定。

### 套接字
Unix 套接字是一种只能用于同一台物理主机中进行通信的套接字，比 TCP 套接字快，适合用于 IPC。

管道提供的是单向通信，而套接字提供双向通信。

### 远程 IPC
如果要从单机扩展到多台机器，可以使用 TCP 套接字，或者 RPC，远程过程调用等来实现。

## 守护进程
在后台运行，不受终端用户控制。init 进程是所有进程的父进程。

## 总结
这本书能简单的了解下 Unix 下进程的一些知识，包括系统调用，资源限制，资源竞争，信号，进程通信等等内容，但内容都稍微有点浅，并且作者用了 Ruby，虽然不影响阅读，总有些隔阂。

## reference

- 《理解 Unix 进程》
