---
layout: post
title: "每天学习一个命令：使用 rsync 增量同步备份文件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, rsync, scp, sync, command, ]
last_updated:
---

rsync 全名 Remote Sync，是类 UNIX 系统下的数据镜像备份工具。可以方便的实现本地，远程备份，rsync 提供了丰富的选项来控制其行为。rsync 优于其他工具的重要一点就是支持增量备份。

> rsync - a fast, versatile, remote (and local) file-copying tool

rsync 是一个功能非常强大的工具，其命令也有很多功能选项，它的特性如下：

- 可以保持文件原来的权限、时间、所有者、组信息、软硬链接等等
- 可以从远程或者本地镜像保存整个目录树和文件系统
- 无须特殊权限 super-user 即可安装使用
- 快速：要比 scp (Secure Copy) 要快；第一次同步时 rsync 会复制全部内容，但在下一次只传输修改过的文件。rsync 在传输数据的过程中可以实行压缩及解压缩操作，可以使用更少的带宽
- 安全：可以使用 scp、ssh 等方式来传输文件，当然也可以通过直接的 socket 连接
- 支持匿名传输，以方便进行网站镜像

rsync 的官方网站：<http://rsync.samba.org/>，可以从上面得到最新的版本。

## rsync 的使用

Rsync 的命令格式可以为以下六种：

    # 本地模式
	rsync [OPTION...] SRC DEST
    # 远程 Push
	rsync [OPTION...] SRC [USER@]HOST:DEST
    # 远程 Pull
	rsync [OPTION...] [USER@]HOST:SRC DEST
    # 通过 Rsync daemon Pull
	rsync [OPTION...] [USER@]HOST::SRC DEST
    rsync [OPTION...] rsync://[USER@]HOST[:PORT]/SRC... [DEST]
    # 通过 Rsync daemon Push
	rsync [OPTION...] SRC [USER@]HOST::DEST
	rsync [OPTION...] SRC... rsync://[USER@]HOST[:PORT]/DEST

上述命令中，SRC 表示源地址，而 DEST 表示目标地址，这二者可以是本地目录，也可以是远程服务器地址。当只有 SRC 地址没有 DEST 时会列出所有的文件列表，而不会执行拷贝。

rsync 有两种方式来连接远程服务器

- 使用 remote shell 程序，比如 ssh 或者 rsh
- 或者直接通过 TCP 来连接 daemon

这两种方式的直接区别体现在路径中的冒号 (:) ，当只有一个冒号时使用 remote shell，当有两个冒号时使用 daemon 连接。

rsync 有六种不同的工作模式：

1. 拷贝本地文件；当 SRC 和 DEST 路径信息都不包含有单个冒号":"分隔符时就启动这种工作模式。
2. 使用一个远程 shell 程序（如 rsh、ssh）来实现将本地机器的内容拷贝到远程机器。当 DEST 路径地址包含单个冒号":"分隔符时启动该模式。
3. 使用一个远程 shell 程序（如 rsh、ssh）来实现将远程机器的内容拷贝到本地机器。当 SRC 地址路径包含单个冒号":"分隔符时启动该模式。
4. 从远程 rsync 服务器中拷贝文件到本地机。当 SRC 路径信息包含"::"分隔符时启动该模式。
5. 从本地机器拷贝文件到远程 rsync 服务器中。当 DEST 路径信息包含"::"分隔符时启动该模式。
6. 列远程机的文件列表。这类似于 rsync 传输，不过只要在命令中省略掉本地机信息即可。

这 6 种方式看似复杂，其实只要记住一些常用参数，然后记住一些常用方法就能够将 `rsync` 利用起来。

可以 `man rsync` 参考 rsync 文档，了解详细的使用方法，下面解析一些参数的使用

常用的几个参数

	-v  verbose 详细输出
	-a 	归档模式，递归方式传输文件，并保持连接，权限，用户和组，时间信息
	-z  压缩文件传输
	-h  human-readable, 输出友好
	-u  跳过已经存在的文件，备份更新

rsync 参数的具体解释如下：

	-v, --verbose 详细模式输出
	-q, --quiet 精简输出模式
	-c, --checksum 打开校验开关，强制对文件传输进行校验
	-a, --archive 归档模式，表示以递归方式传输文件，并保持所有文件属性，等于 -rlptgoD
	-r, --recursive 对子目录以递归模式处理
	-R, --relative 使用相对路径信息
	-b, --backup 创建备份，也就是对于目的已经存在有同样的文件名时，将老的文件重新命名为~filename。可以使用 --suffix 选项来指定不同的备份文件前缀。
	--backup-dir 将备份文件（如~filename) 存放在在目录下。
	-suffix=SUFFIX 定义备份文件前缀
	-u, --update 仅仅进行更新，也就是跳过所有已经存在于 DST，并且文件时间晚于要备份的文件。（不覆盖更新的文件）
	-l, --links 保留软链结
	-L, --copy-links 想对待常规文件一样处理软链结
	--copy-unsafe-links 仅仅拷贝指向 SRC 路径目录树以外的链结
	--safe-links 忽略指向 SRC 路径目录树以外的链结
	-H, --hard-links 保留硬链结
	-p, --perms 保持文件权限
	-o, --owner 保持文件属主信息
	-g, --group 保持文件属组信息
	-D, --devices 保持设备文件信息
	-t, --times 保持文件时间信息
	-S, --sparse 对稀疏文件进行特殊处理以节省 DST 的空间
	-n, --dry-run 现实哪些文件将被传输
	-W, --whole-file 拷贝文件，不进行增量检测
	-x, --one-file-system 不要跨越文件系统边界
	-B, --block-size=SIZE 检验算法使用的块尺寸，默认是 700 字节
	-e, --rsh=COMMAND 指定使用 rsh、ssh 方式进行数据同步
	--rsync-path=PATH 指定远程服务器上的 rsync 命令所在路径信息
	-C, --cvs-exclude 使用和 CVS 一样的方法自动忽略文件，用来排除那些不希望传输的文件
	--existing 仅仅更新那些已经存在于 DST 的文件，而不备份那些新创建的文件
	--delete 删除那些 DST 中 SRC 没有的文件
	--delete-excluded 同样删除接收端那些被该选项指定排除的文件
	--delete-after 传输结束以后再删除
	--ignore-errors 及时出现 IO 错误也进行删除
	--max-delete=NUM 最多删除 NUM 个文件
	--partial 保留那些因故没有完全传输的文件，以是加快随后的再次传输
	--force 强制删除目录，即使不为空
	--numeric-ids 不将数字的用户和组 ID 匹配为用户名和组名
	--timeout=TIME IP 超时时间，单位为秒
	-I, --ignore-times 不跳过那些有同样的时间和长度的文件
	--size-only 当决定是否要备份文件时，仅仅察看文件大小而不考虑文件时间
	--modify-window=NUM 决定文件是否时间相同时使用的时间戳窗口，默认为 0
	-T --temp-dir=DIR 在 DIR 中创建临时文件
	--compare-dest=DIR 同样比较 DIR 中的文件来决定是否需要备份
	-P 等同于 --partial
	--progress 显示备份过程
	-z, --compress 对备份的文件在传输时进行压缩处理
	--exclude=PATTERN 指定排除不需要传输的文件模式
	--include=PATTERN 指定不排除而需要传输的文件模式
	--exclude-from=FILE 排除 FILE 中指定模式的文件
	--include-from=FILE 不排除 FILE 指定模式匹配的文件
	--version 打印版本信息

## Example
下面举例说明 rsync 的六种不同工作模式：

### 拷贝本地文件
当 SRC 和 DES 路径信息都不包含有单个冒号 ":" 分隔符时就启动这种工作模式。

同步文件

    rsync -ahvz backup.tar.gz  /backups/  # DESC 不存在时自动创建

将备份文件同步到 `/backups/` 目录下。

同步目录

	rsync -avzh /home/src /backups/files/

将 `/home/src` 目录下的文件同步发送到 `/backups/files` 目录下。记住如果目标地址没有 `src` 目录，rsync 会自动创建该文件夹。

	rsync -avz /home/src/ /backups/files/

SRC 路径末尾的 `/` 表示不自动创建 DEST 文件夹，在 `man rsync` 中的解释就是末尾的 `/` 表示"拷贝当前目录下的文件" ，而不是"拷贝当前的目录".

### 远程 shell 拷贝到远程
使用一个远程 shell 程序（如 rsh、ssh) 来实现将本地机器的内容拷贝到远程机器。当 DES 路径地址包含单个冒号":"分隔符时启动该模式。

    rsync -avz /local/path/  user@remoteip:/path/to/files/

将本地 `/local/path/` 中的文件同步备份到远程 `/path/to/files/` 目录。

### 远程 shell 拷贝到本地
使用一个远程 shell 程序（如 rsh、ssh) 来实现将远程机器的内容拷贝到本地机器。当 SRC 地址路径包含单个冒号":"分隔符时启动该模式。

    rsync -avz user@remoteip:/home/user/src  ./src

### 远程 rsync 服务器拷贝到本地
从远程 rsync 服务器中拷贝文件到本地机。当 SRC 路径信息包含"::"分隔符时启动该模式。

    rsync -av user@remoteip::www  /databack

### 拷贝本地文件到远程
从本地机器拷贝文件到远程 rsync 服务器中。当 DES 路径信息包含"::"分隔符时启动该模式。

    rsync -av /databack user@remoteip::www

### 文件列表
列远程机的文件列表。这类似于 rsync 传输，不过只要在命令中省略掉本地机信息即可。

    rsync -v rsync://remoteip /www

### rsync 使用非标准端口
经常遇见的一种情况就是 ssh 更改了默认 22 端口，这个时候就需要使用 `-e` 参数。

rsync 有两种常用的认证方式，一种为 rsync-daemon 方式，另外一种则是 ssh。

ssh 一般为首选，但当远端服务器的 ssh 默认端口被修改后，rsync 找不到一个合适的方法来输入对方 ssh 服务端口号。

比如现在向机器 remoteip 传送文件，但此时 remoteip 的 ssh 端口已经不是默认的 22 端口。

键入命令

	rsync /local/path user@remoteip:/path/to/files/ # 出现错误

rsync 中的命令 参数 `-e, --rsh=COMMAND` 指定使用 rsh、ssh 方式进行数据同步。

参数的作用是可以使用户自由选择想要使用的 shell 程序来连接远端服务器，当然也可以设置成使用默认的 ssh 来连接，但是这样我们就可以加入 ssh 的参数了。

现在命令可以这样写了：

	rsync -avz -e "ssh -p $port" /local/path/ user@remoteip:/path/to/files/

### 显示备份进度
可以使用 `--progress` 选项来显示进度

	rsync -avzhe ssh --progress /home/files/ root@remoteip:/path/to/files/

### 限制备份文件最大值
设置 Max size 备份文件

	rsync -avzhe ssh --max-size='2000k' /var/lib/rpm/ root@remoteip:/root/tmprpm

### 备份结束后自动删除本地文件

	rsync --remove-source-files -zvh backup.tar /tmp/backups/

需要注意的是 `rsync` 使用 `--remove-source-files` 之后源文件同步之后会被删除，但是源文件所在的文件夹是不会被删除的，可以通过如下命令删除空文件夹：

    find . -depth -type d -empty -delete

### 同步过程中删除远程中已经在本地删除的文件
使用 `--delete` 选项。

    rsync -avh --delete /path/to/local root@remote:/path/to/remote

### 设置备份带宽
`--bwlimit=RATE` 选项允许用户指定最大传输速率，RATE 值可以是字符串也可以是数值，如果是字符串，比如 `--bwlimit=1.5m` 表示每秒最高传输速率 1.5m，如果没有后缀那么单位是 1024 bytes。

	rsync --bwlimit=100 -avzhe ssh /var/lib/rpm/ root@remoteip:/root/tmprpm/

## 参考

- rsync 算法介绍 <http://rsync.samba.org/tech_report/node2.html>
- Coolshell 的博客 <http://coolshell.cn/articles/7425.html>
- <https://www.tecmint.com/rsync-local-remote-file-synchronization-commands/>
- <http://blog.csdn.NET/jackdai/article/details/460460>


