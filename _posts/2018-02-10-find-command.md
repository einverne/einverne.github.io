---
layout: post
title: "每天学习一个命令：find 查找文件"
aliases: "每天学习一个命令：find 查找文件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, find, file, command, search, ]
last_updated:
---

查找的动作在平时使用的频率也还是很高的，所以知道并用好 `find` 这个命令也很重要。`find` 命令顾名思义，就是搜索特定文件夹内的文件。当然后来用了 [fzf](/post/2019/08/fzf-usage.html) 日常使用比 find 要高很多，不过如果要写脚本 find 命令的使用也是不得不了解的。

find 命令提供了非常多的选项，功能很强大。

## 基本使用
最基本的使用

    find [path] [expression]

在 path 目录下查找 expression 的文件。

## 使用举例

### 通过文件名查找

    find -name "query"   # 搜索文件名，大小写敏感
    find -iname "query"  # 大小写不敏感
    find -not -name "query"  # 查找不包含关键字的文件
    find \! -name "query"    # 不包含

### 按照类型查找文件

    find -type [fdlcb] "query"

`type` 后能够使用的类型有

- `f` 常规文件
- `d` 目录
- `l` 连接
- `c` 字符设备文件 character devices
- `b` 块设备文件 block devices

比如要查找系统中所有以 `.conf` 结尾的文件

    find / -type f -name "*.conf"

### 通过文件大小查找

    find /path/to/folder -size 50M

查找 50M 的文件，`size` 后能够使用的单位有：

- `b` 512byte blocks
- `c` byte 字节
- `w` two byte
- `k` kB 千字节
- `M` MB
- `G` GB

`size` 后面的参数可以使用 `+` 或者 `-` 或者不加来标识，超过，少于，或者正好。

    find / -size +700M   # 表示查找大于 700M 的文件
    find / -size -50c    # 表示查找小于 50 byte 的文件
    find . -size 50M     # 表示在当前目录查找正好 50M 的文件

### 通过时间来查找文件

Linux 会存储下面的时间：

- Access time 上一次文件读或者写的时间
- Modifica time 上一次文件被修改的时间
- Change time 上一次文件 inode meta 信息被修改的时间

在按照时间查找时，可以使用 `-atime`， `-mtime` 或者 `-ctime` ，和之前 `size` 参数一样可以使用 `+` 或者 `-` 来标识超多多长时间或者少于多长时间。

    find / -mtime 1          # 寻找修改时间超过一天的文件
    find / -atime -1         # 寻找在一天时间内被访问的文件
    find / -ctime +3         # 寻找 meta 信息被修改的时间超过 3 天的文件

寻找修改时间超过 1 小时的 mp3 文件

    find /path/to/folder -maxdepath 1 -mmin +60 -type f -name "*.mp3"

其中的`-mmin n` 参数表示的就是文件内容在前 n 分钟没有修改。

    find /path/to/folder -maxdepath 1 -mmin +60 -type f -name "*.mp3" -exec rm -f {} \;

通过上面的语句就能够一次性删除超过 60 分钟未修改的 mp3 了。

### 通过 Owner 和权限搜索
使用 `-user` 和 `-group` 参数来通过拥有者搜寻

    find / -user einverne
    find / -group shadow

同样按着权限查找文件

    find / -perm 644
    find / -perm -644 # 查找权限至少是 644 的文件

### 限制查找的深度
使用 `-maxdepth` 来限制查找的深度，默认情况下 find 会一层层搜索，如果只想让 find 命令查找当前目录或者子目录，可以使用

    find -maxdepth 2 -name "query"

同理 还有一个选项 `-mindepth`

    find -mindepth 2 -maxdepth 3 -name "query"

### 对搜索结果批处理
在搜索出结果之后，可以使用如下的方式对搜索的结果执行一个命令

    find [param] -exec command {} \;

比如批量修改权限

    find . -type f -perm 644 -exec chmod 664 {} \;
    find . -type d -perm 755 -exec chmod 700 {} \;   # 批量修改文件夹权限

### 批量删除时间超过 1 天的文件
综合上面按时间查找文件和对搜索结果批处理，可以获知

    find /path/to/folder/* -mtime +1 -exec rm {} \;

- find 后面接一个完整的 path
- `-mtime +1` 表示的查找时间超过 1 天的内容
- `-exec` 后面表示对搜索的结果进行处理

或者直接使用 `-delete`:

    find /path/to/folder/* -mtime +1 -delete

### 删除目录下空文件夹

	find path/to/folder -type d -empty -print
	find path/to/folder -type d -empty -delete

## 使用 locate
`locate` 命令需要额外安装

    sudo apt install mlocate

`locate` 命令维护了一份文件和目录的数据库，所以检索速度会快一些，数据库通常一天更新一次，可以手动更新数据库

    sudo updatedb
    locate -S   # 查看当前数据库数据

`locate` 使用的方式和 `find` 大致差不多。

## reference

- <http://stackoverflow.com/questions/543946/find-mtime-files-older-than-1-hour>
- <https://www.digitalocean.com/community/tutorials/how-to-use-find-and-locate-to-search-for-files-on-a-linux-vps>
