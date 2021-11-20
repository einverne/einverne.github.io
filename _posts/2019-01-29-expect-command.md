---
layout: post
title: "expect 脚本使用"
aliases: "expect 脚本使用"
tagline: ""
description: ""
category: 学习笔记
tags: [expect, linux, automate, shell, script, 运维 , 自动化 ,  ]
last_updated:
---

expect 是用来进行自动化控制和测试的工具。主要是和交互式软件 telnet ftp passwd fsck rlogin ssh tip 等进行自动化的交互。Linux 交互命令中经常需要输入 yes/no 或者 password 等操作，模拟这些输入，就可以使用 expect 脚本。expect 是由 tcl 语言演变而来的。简单地说，expect 是一个工具，可以根据用户设定的规则和系统进程进行自动化交互，例如远程登陆的密码输入、自动化的执行远程命令。

一个非常典型的使用场景就是一般在公司中都会使用 relay 来连接管理服务器的远程连接和使用，通常会需要在 SSH 登录的时候使用用户名和密码，甚至需要二步验证来增强安全性，但是如果不想每一次都重复输入用户名和密码就可以使用 expect 命令来快速实现登录。

## 安装
Debian/Ubuntu/Linux Mint 系安装非常简单

    apt install expect

## 关键命令
expect 下几个非常重要的指令：

- spawn: **启动进程**（由 spawn 启动的进程的输出可以被 expect 所捕获）
- expect: 从进程接收字符串，期望获得字符串
- send: 向进程发送字符串，用于模拟用户的输入，注意一定要加 `\r` 回车
- interact: 用户交互
- sleep n: 使脚本暂停给定的秒数

spawn 指令用来开启比如 Shell, FTP, SSH ,SCP 等等的交互指令。

### 命令行参数

    $argc，$argv 0，$argv 1 ... $argv n

argc 表示命令行参数个数，后面分别表示各个参数项，0 表示第一个参数，1 表示第二个参数，以此类推，可以通过 lindex 获取对应参数值 (lindex $argv 0)。

    if {$argc < 2} {
        puts stdout "$argv0 err params\n"
        exit 1
    }

    if {[llength $argv] == 0} {
        puts stdout "need server name as param"
        exit 1
    }


### 输入输出

    puts stderr "Usage: $argv0 login passwaord.n "
    puts "hello world"
    puts stdout "1234"

### 变量赋值

    set argv [lindex $argv 0]
    set user "einverne"
    set count 3
    set ip "192.168.2.1"

### 复合指令
比如要将脚本的参数赋值给变量

    set my_var [lindex $argv 0]

### 命令调用

    spawn ssh $user@$ip

spawn 启动一个进程，进程执行 ssh 命令，程序后面可以通过 expect/send 和新起的进程进行交互

### 分支语句
单一分支语法：

    expect "hello" {send "you said hello"}

多分支模式语法：

    expect {
        "lilei" {send "hello lilei"; exp_continue}
        "hanmeimei" {send "hello hanmeimei"; exp_continue}
        "how do you do ?" {send "how do you do ?"}
    }

switch 分支

    switch -- $var {
    {
      }
    {
      }
    {
      }
    }

if else 分支

    set NUM 1
    if { $NUM < 5 } {
        puts "\Smaller than 5\n"
    } elseif { $NUM > 5 } {
        puts "\Bigger than 5\n"
    } else {
        puts "\Equals 5\n"
    }

### 循环
while 循环语法

    #!/usr/bin/expect -f
    set NUM 0
    while { $NUM <= 5 } {
        puts "Number is $NUM"
        set NUM [ expr $NUM + 1 ]
    }

for 循环

    for {set NUM 0} {$NUM <= 5} {incr NUM} {
        puts "\nNUM = $NUM"
    }
    puts ""


### 自定义方法

定义

    proc myfunc { TOTAL } {
        set TOTAL [expr $TOTAL + 1]
        return "$TOTAL"
    }

使用

    set NUM [myfunc $NUM]

### 使用正则表达式判断

    if {[regexp {^[0-9]+$} $NUM]} {
      Do something
    } else {
      Exit
    }

其他表示

    if {![regexp {\D+} $NUM]}
    if {![string match {[^0-9]+} $NUM]}

## 实例

### 登录远程服务器并创建文件夹

    #!/usr/bin/expect               // 告诉系统脚本的执行方式
    set timeout -1                  // 等待超时时间， -1 为无限制等待
    spawn ssh root@192.168.2.1      // spawn 执行 expect 内部命令，给 ssh 运行进程加壳，传递交互指令
    expect {                        // expect 是 expect 内部命令，判断上次输出结果是否包含，如果有则立即执行操作
        "password" {send "123456\r";}           // send 执行交互动作，与手工输入密码等效
        "yes/no" {send "yes\r";exp_continue}
    }
    expect "root" {send "mkdir testFolder\r"}
    expect eof
    exit

`expect eof` 等待结束标志，spawn 启动的命令在结束时会产生一个 eof 标志。

### 带参数的脚本
如果脚本依赖外部输入，比如有输入参数，那么可以在后面添加参数：

    ./expect.ex 192.168.2.1 123456

脚本可以首先用 set 给变量赋值

    #!/usr/bin/expect

    set ip [lindex $argv 0]
    set password [lindex $argv 1]
    set timeout -1
    spawn ssh root@ip
    expect {
        "password" {send "$password\r";}
        "yes/no" {send "yes\r";exp_continue}
    }
    expect "root" {send "mkdir test1\r"}
    send "exit\r"
    expect eof
    exit

### 等待手动操作
登录远程服务器之后使用 `interact` 来等待手动操作，比如：

    ./expect.ex 192.168.2.1 123456

脚本：

    #!/usr/bin/expect
    set ip [lindex $argv 0]
    set password [lindex $argv 1]
    set timeout -1
    spawn ssh root@$ip
    expect {
        "password" {send "$password\r";}
        "yes/no" {send "yes\r";exp_continue}
    }
    interact                // 完成后保持交互状态，把控制权交给控制台

注意最后的 interact

## 总结

expect 在 Linux 运维中非常有用，可以用来多机器重启，远程 copy 等等场景，shell 中受限于密码输入的操作，可以通过 expect 来节省很多工作。

涉及到脚本[地址](https://github.com/einverne/einverne.github.io/tree/master/expect-script/)

## reference

- <http://expect.sourceforge.net/>
- <https://likegeeks.com/expect-command/>
- <http://tcl.tk/man/tcl8.6/TclCmd/contents.htm>
