---
layout: post
title: "Python 中 subprocess.call() vs os.system() 区别"
tagline: ""
description: ""
category: 经验总结
tags: [python, subprocess, system, subshell, ]
last_updated:
---


在 Python 中调用系统命令可以使用两种方法，一种是 os 模块中的 system() 方法，一种是 subprocess 模块中的 call() 方法。


## os.system()
这个方法会接受一个字符串命令，然后在 subshell 中执行，通常是 linux/OSX 下的 bash ，或者 Windows 下面的 cmd.exe。根据官方的文档，`os.system()` 方法时使用标准 C 方法 system() 来调用实现的，所以存在和 C 方法中一样的限制。

    os.system("python –version")

举例

    import os
    cmd = "git --version"
    returned_value = os.system(cmd)  # returns the exit code in unix
    print('returned value:', returned_value)


## subprocess.call()

默认情况下不使用 shell，他只是简单的执行传入的字符串

运行带参数的命令需要传 list

    subprocess.call(["python", "–version"])

subprocess.call() 当使用 shell=True 时和 os.system() 一样使用 shell

    subprocess.call(["python", "–version"], shell=True)

举例

    import subprocess

    cmd = "date"
    # returns output as byte string
    returned_output = subprocess.check_output(cmd)
    # using decode() function to convert byte string to string
    print('Current date is:', returned_output.decode("utf-8"))


## subproecess.Popen()
subproecess 模块中如果想要实现更加复杂的命令，可以使用 Popen()。popen() 会创建一个管道，fork 一个子进程，然后该子进程执行命令。返回值在标准 IO 流中，该管道用于父子进程间通信。父进程要么从管道读信息，要么向管道写信息，至于是读还是写取决于父进程调用 popen 时传递的参数（w 或 r）。

    import subprocess
    child = subprocess.Popen(['ping','-c','4','douban.com'])
    child.wait()
    print 'main process'

默认情况下，开启子进程之后不会等待 child 执行完成，需要使用 wait() 来等待子进程完成。

父进程对子进程还有其他的操作

    child.poll()           # 检查子进程状态
    child.kill()           # 终止子进程
    child.send_signal()    # 向子进程发送信号
    child.terminate()      # 终止子进程

子进程的标准输入、标准输出和标准错误

    child.stdin
    child.stdout
    child.stderr

举例

    import subprocess
    child1 = subprocess.Popen(["ls","-l"], stdout=subprocess.PIPE)
    print child1.stdout.read()


使用 subprocess 创建子进程能够重定向 stdin stdout，总体来说要比 os.system() 更加强大。

## reference

- <https://stackoverflow.com/a/44731082/1820217>
