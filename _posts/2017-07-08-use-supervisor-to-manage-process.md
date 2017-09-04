---
layout: post
title: "使用 supervisor 管理进程"
tagline: ""
description: ""
category: 经验总结
tags: [supervisor, python]
last_updated: 
---


Supervisor (http://supervisord.org) 是一个用 Python 开发的进程管理工具（client/server)，可以很方便的用来启动、重启、关闭进程（不仅仅是 Python 进程）。除了对单个进程的控制，还可以同时启动、关闭多个进程，比如很不幸的服务器出问题导致所有应用程序都被杀死，此时可以用 supervisor 同时启动所有应用程序而不是一个一个地敲命令启动。


## 安装

Supervisor 可以运行在 Linux、Mac OS X 上。如前所述，supervisor 是 Python 编写的，所以安装起来也很方便，可以直接用 pip :

    sudo pip install supervisor

如果是 Ubuntu 系统，还可以使用 apt-get 安装。命令如下

    sudo apt-get install supervisor

推荐使用 apt 方式安装，避免后期再配置开机启动脚本。

Supervisor 有两个主要的组成部分：

- supervisord，运行 Supervisor 时会启动一个进程 supervisord，它负责
    
    1. 启动所管理的进程，并将所管理的进程作为自己的子进程来启动，而且可以在所管理的进程出现崩溃时自动重启。
    2. 响应客户端命令
    3. 日志输出管理
    
- supervisorctl，是命令行管理工具，可以用来执行 stop、start、restart 等命令，对这些子进程进行管理。


## 手动 supervisord 配置

Supervisor 相当强大，提供了很丰富的功能，不过我们可能只需要用到其中一小部分。安装完成之后，可以编写配置文件，来满足自己的需求。为了方便，我们把配置分成两部分：supervisord（supervisor 是一个 C/S 模型的程序，这是 server 端，对应的有 client 端：supervisorctl）和应用程序（即我们要管理的程序）。

首先来看 supervisord 的配置文件。安装完 supervisor 之后，可以运行echo_supervisord_conf 命令输出默认的配置项，也可以重定向到一个配置文件里（如果是apt安装，则默认配置在 /etc/supervisor/supervisord.conf 下）：

    echo_supervisord_conf > /etc/supervisord.conf

去除里面大部分注释和“不相关”的部分，我们可以先看这些配置：

    [unix_http_server]
    file=/tmp/supervisor.sock   ; UNIX socket 文件路径，supervisorctl 会使用
    ;chmod=0700                 ; socket 文件的 mode，默认是 0700
    ;chown=nobody:nogroup       ; socket 文件的 owner，格式： uid:gid

    ;[inet_http_server]         ; HTTP 服务器，提供 web 管理界面
    ;port=127.0.0.1:9001        ; Web 管理后台运行的 IP 和端口，如果开放到公网，需要注意安全性
    ;username=user              ; 登录管理后台的用户名
    ;password=123               ; 登录管理后台的密码

    [supervisord]
    logfile=/tmp/supervisord.log ; 日志文件，默认是 $CWD/supervisord.log
    logfile_maxbytes=50MB        ; 日志文件大小，超出会 rotate (分割），默认 50MB
    logfile_backups=10           ; 日志文件保留备份数量默认 10
    loglevel=info                ; 日志级别，默认 info，其它: debug,warn,trace
    pidfile=/tmp/supervisord.pid ; pid 文件
    nodaemon=false               ; 是否在前台启动，默认是 false，即以 daemon 的方式启动
    minfds=1024                  ; 可以打开的文件描述符的最小值，默认 1024
    minprocs=200                 ; 可以打开的进程数的最小值，默认 200

    ; the below section must remain in the config file for RPC
    ; (supervisorctl/web interface) to work, additional interfaces may be
    ; added by defining them in separate rpcinterface: sections
    [rpcinterface:supervisor]
    supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

    [supervisorctl]
    serverurl=unix:///tmp/supervisor.sock ; 通过 UNIX socket 连接 supervisord，路径与 unix_http_server 部分的 file 一致
    ;serverurl=http://127.0.0.1:9001 ; 通过 HTTP 的方式连接 supervisord

    ; 包含其他的配置文件
    [include]
    files = relative/directory/*.ini    ; 可以是 *.conf 或 *.ini


我们把上面这部分配置保存到 /etc/supervisord.conf（或其他任意有权限访问的文件），然后启动 supervisord（通过 -c 选项指定配置文件路径，如果不指定会按照这个顺序查找配置文件：$CWD/supervisord.conf, $CWD/etc/supervisord.conf, /etc/supervisord.conf）


    supervisord -c /etc/supervisord.conf


查看 supervisord 是否在运行：

    ps aux | grep supervisord

`supervisord` 是 supervisor 的守护进程，但是他自身并没有 reload 选项，因此需要使用

	service supervisor restart  # 来重启 supervisord

如果需要使用其他 conf 文件，在 stop supervisord 之后在使用 `-c` 参数后接配置文件。


## APT安装

可以使用 `sudo service supervisor status` 来查看 supervisord 的服务状态

## program 配置

上面我们已经把 supervisrod 运行起来了，现在可以添加我们要管理的进程的配置文件。可以把所有配置项都写到 supervisord.conf 文件里，但并不推荐这样做，而是通过 include 的方式把不同的程序（组）写到不同的配置文件里。

为了举例，我们新建一个目录 /etc/supervisor/ 用于存放这些配置文件，相应的，把 /etc/supervisord.conf 里 include 部分的的配置修改一下：

    [include]
    files = /etc/supervisor/*.conf


假设有个用 Python 和 Flask 框架编写的用户中心系统，取名 program_name，用 gunicorn (http://gunicorn.org/) 做 web 服务器。项目代码位于 /home/einverne/projects/program_name，gunicorn 配置文件为 gunicorn.py，WSGI callable 是 wsgi.py 里的 app 属性。所以直接在命令行启动的方式可能是这样的：

    cd /home/einverne/projects/program_name
    gunicorn -c gunicorn.py wsgi:app


现在编写一份配置文件来管理这个进程（需要注意：用 supervisord 管理时，gunicorn 的 daemon 选项需要设置为 False）：

    ; 设置进程的名称， 使用 supervisorctl 来管理进程需要使用该进程名
    [program:your_program_name]
    directory = /home/einverne/projects/name; 程序的启动目录
    command = gunicorn -c gunicorn.py wsgi:app  ; 启动命令，与手动在命令行启动的命令是一样的
    autostart = true     ; 在 supervisord 启动的时候也自动启动
    startsecs = 5        ; 启动 5 秒后没有异常退出，就当作已经正常启动了
    autorestart = true   ; 程序异常退出后自动重启
    startretries = 3     ; 启动失败自动重试次数，默认是 3
    user = root          ; 用哪个用户启动
    redirect_stderr = true  ; 把 stderr 重定向到 stdout，默认 false
    stdout_logfile_maxbytes = 20MB  ; stdout 日志文件大小，默认 50MB
    stdout_logfile_backups = 20     ; stdout 日志文件备份数
    ; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
    stdout_logfile = /data/logs/program_name_stdout.log
    loglevel = info      ; loglevel 指定了日志级别， python 的 print 语句输出的日志是不会被记录到日志文件的，需要搭配 Python 的 logging 模块来输出指定级别的日志

    ; 可以通过 environment 来添加需要的环境变量，一种常见的用法是修改 PYTHONPATH
    ; environment=PYTHONPATH=$PYTHONPATH:/path/to/somewhere


一份配置文件至少需要一个 [program:x] 部分的配置，来告诉 supervisord 需要管理那个进程。[program:x] 语法中的 x 表示 program name，会在客户端（supervisorctl 或 web 界面）显示，在 supervisorctl 中通过这个值来对程序进行 start、restart、stop 等操作。更加详细的配置可以参考[官网](http://supervisord.org/configuration.html#program-x-section-settings)。


## 配置一组程序

使用 group 开启或者关闭一组程序，在配置目录下加上额外的配置文件

    [group:group1] 
    programs=group-member-1,group-member-2   ; each refers to 'x' in [program:x] definitions
    priority=999                  ; the relative start priority (default 999)
    
    [program:group-member-1] 
    command=xxx 
    autostart=true 
    autorestart=true 
    user=redis 
    stdout_logfile=xxx 
    stderr_logfile=xxx

    [program:group-member-2]
    command=xxx 
    autostart=true 
    autorestart=true 
    user=redis 
    stdout_logfile=xxx 
    stderr_logfile=xxx

添加了 group 配置之后， 进程管理名就变成了 group1:group-member-1 这样的形式，可以使用如下方法启动一组程序

    supervisor> start group1:*


## 使用 supervisorctl

Supervisorctl 是 supervisord 的一个命令行客户端工具，启动时需要指定与 supervisord 使用同一份配置文件，否则与 supervisord 一样按照顺序查找配置文件。

    supervisorctl -c /etc/supervisord.conf

上面这个命令会进入 supervisorctl 的 shell 界面，然后可以执行不同的命令了：

    > status    # 查看程序状态
    > stop program_name   # 关闭 program_name 程序
    > start program_name  # 启动 program_name 程序
    > restart program_name    # 重启 program_name 程序
    > reread    ＃ 读取有更新（增加）的配置文件，不会启动新添加的程序，也不会重启任何程序
    > reload    #  载入最新的配置文件，停止原有的进程并按照新的配置启动
    > update    ＃ 重启配置文件修改过的程序，配置没有改动的进程不会收到影响而重启


上面这些命令都有相应的输出，除了进入 supervisorctl 的 shell 界面，也可以直接在 bash 终端运行：

    $ supervisorctl status
    $ supervisorctl stop program_name
    $ supervisorctl start program_name
    $ supervisorctl restart program_name
    $ supervisorctl reread
    $ supervisorctl reload
    $ supervisorctl update



## 日志管理

当 supervisor 的日志文件大小超过 `stdout_logfile_maxbytes` 时，之前的日志文件会被放到 logfile.log.1 文件中备份。可以在相应program配置中配置如下两项改变日志的行为：

- 配置 `stdout_logfile_maxbytes` 为0 时，所有的日志文件都会被放到一个文件中
- 配置 `stdout_logfile_backups` 为0 时，当日志文件太大时，旧文件就会被删除而不是移动到单独的文件中。

配置 `stderr_logfile_maxbytes` 和 `stderr_logfile_backups` 类似。

这样的日志方式叫做 log file rotation 


## 其它

除了 supervisorctl 之外，还可以配置 supervisrod 启动 web 管理界面，这个 web 后台使用 Basic Auth 的方式进行身份认证。

除了单个进程的控制，还可以配置 group，进行分组管理。

经常查看日志文件，包括 supervisord 的日志和各个 pragram 的日志文件，程序 crash 或抛出异常的信息一半会输出到 stderr，可以查看相应的日志文件来查找问题。

Supervisor 有很丰富的功能，还有其他很多项配置，可以在官方文档获取更多信息：<http://supervisord.org/index.html>


## 一些问题

### 开机启动 supervisor
在使用 pip 安装的时候默认并没有安装成服务，因此如果想要使用开机启动可以使用 APT 安装。 而如果已经安装了 supervisor 想要自己配置开机启动脚本，可以使用这个 [link](https://serverfault.com/questions/96499/how-to-automatically-start-supervisord-on-linux-ubuntu) 中的方法来添加。

supervisor 官方[提供](https://github.com/Supervisor/initscripts) 的开机脚本似乎对于 Ubuntu 有些问题，可以使用上方 Serverfault 中提到的。

    sudo curl https://gist.github.com/howthebodyworks/176149/raw/88d0d68c4af22a7474ad1d011659ea2d27e35b8d/supervisord.sh > /etc/init.d/supervisord
    sudo chmod +x /etc/init.d/supervisord
    sudo update-rc.d supervisord defaults

确保在 `/etc/supervisord.conf` 中配置了正确的 pid， 并且和 `/etc/init.d/supervisord` 相对应：

    pidfile=/var/run/supervisord.pid

测试:

    service supervisord stop
    service supervisord start

### 某些情况下通过 supervisor 启动 program 会报错

错误关键字：supervisor can't find command

这时候可以[手动](https://stackoverflow.com/questions/43076406/why-cant-supervisor-find-command-source) 开启一个 bash ，或者 sh

    commmand=sh -c 'your command'

### 启动 supervisord 权限问题

问题关键字：error: <class 'socket.error'>, [Errno 13] Permission denied: file: /usr/lib/python2.7/socket.py line

权限问题，绝大部分情况下使用 `sudo supervisorctl` 即可解决。当然如果你愿意配置一个 supervisor 用户组，然后在 配置文件中配置相应的权限也可以解决。

具体参考：<https://github.com/Supervisor/supervisor/issues/173>


## reference

- <http://supervisord.org/configuration.html>
