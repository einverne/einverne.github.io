---
layout: post
title: "每天学习一个命令：tar 压缩和解压文件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [tar, linux, archive, extract, command]
last_updated:
---

tar 本质上只是一个打包命令，可以将多个文件或者文件夹打包到一个 tar 文件中，结合其他的压缩程序再将打包后的档案文件压缩。所以看到 `.tar.gz`, `.tar.bz2`, `.tar.xz` 等等文件其实是 tar 文件之后进行 Gzip, Bzip2, XZ 压缩之后的文件。

## 命令格式

    tar [-] A --catenate --concatenate | c --create | d --diff --compare |
         --delete | r --append | t --list | --test-label | u --update | x
         --extract --get [options] [pathname ...]

tar 命令常用参数

    -c      创建 archive
    -x      解压文件
    -f ARCHIVE      使用该 ARCHIVE
    -v      输出 verbose 日志
    -t      测试压缩文件内容

    -z, --gzip, --gunzip,  gzip 格式
    -j  支持 bzip2 格式

## 使用实例
常见的压缩和解压用法

    tar -cvf filename.tar /folder    # 仅打包不压缩
    tar -xvf filename.tar            # 解压包

压缩与解压 gzip：

    tar -zcvf filename.tar.gz /folder # gzip 压缩
    tar -zxvf filename.tar.gz         # 当前目录下解压文件

压缩解压 bzip2 / bz2

    tar -jcvf filename.tar.bz2 /folder # bzip2 压缩
    tar -jxvf filename.tar.bz2 -C /path # 解压

压缩解压 tar.xz

    tar -Jcvf filename.tar.xz /folder  # xz 压缩
    tar -Jxvf filename.tar.xz          # 解压

解释

- `-c` 表示创建
- `-x` 表示解压
- `-t` 表示查看压缩包内容

        注意 c/x/t 三个参数不能同时使用

- `-v` 表示打印出日志
- `-j` 表示 bzip2 压缩方法
- `-J` 表示 xz 压缩方法
- `-z` 表示 gzip 压缩方法
- `-f ARCHIVE` 后面接文件，`-f` 后面需要直接接压缩包名

经过上面的解释，可以习惯上可以记忆成 压缩格式 (z/j/J) + 压缩 / 解压 / 查看 (c/x/t) + v + f 文件名

### 压缩时排除绝对路径
有的时候在打包文件的时候会跟随着很长的路径，如果不想要这个很长的路径可以使用 `-C` 参数来将目录 `change to directory`

比如想要备份 Docker volume 目录 `/var/lib/docker/volumes/chevereto_chevereto_content/`，如果：

	tar -zcvf backup_content.tar.gz /var/lib/docker/volumes/chevereto_chevereto_content/

这样打包，最后的压缩包内容会将整个相对目录也打包进去，可以使用

	tar -zcvf backup_content.tar.gz -C /var/lib/docker/volumes/chevereto_chevereto_content/ .

然后打包的结果 tar 中就只有 `chevereto_chevereto_content` 目录下的内容。

### 列出压缩包内的文件

    tar -ztvf filename.tar.gz     # 列出 tar.gz 下文件
    tar -zxvf filename.tar.gz folder/filename   # 仅仅解压某个文件

    tar -zcvpf fileetc.tar.gz /etc   # 将 /etc/ 内所有文件备份，并保存其权限 -p

### 保留文件原始属性

    tar -zcvpf file.tar.gz /etc

这里多了一个 `-p` 参数，保留原始属性时使用，比如打包时不想改变文件的权限等等。

### 打包时排除文件或文件夹
比如说在打包 `/etc` 和 `/home` 目录到 file.tar.gz 文件中时排除 `/path` 目录

    tar --exclude /path -zcvf file.tar.gz /etc /home

这里注意 `--exclude` 参数

### 打包比特定时间更新的文件
使用 `-N` 参数来打包更新的文件

    tar -N "2016/01/01" -zcvf download.tar.gz /home/einverne/Download

比如只打包指定目录下文件日期新于 20160101 的文件。

### 解压到指定目录
使用 `-C` 参数来指定解压到的目录

    tar -zxvf filename.tar.gz -C /path/to/

使用 `-C` 参数将压缩包内容解压到目录 `/path/to/filename`

### 不解压直接查看压缩包内容

    tar -tf archive.tar.gz

### 跨机器压缩传输
上面提到的命令都需要将压缩文件存储到本地，那么如果有一种情况，本地空间有限，无法容纳压缩包的内容，想要实时通过压缩，然后传输到另一台机器，可以使用：[^1]

```
tar czvf - /source | ssh username@remote.host "cd /destination; tar xzvf -"
```

[^1]: <https://serverfault.com/a/678430/288331>

### 跨机器打包
比如要在 A 机器将目录 `/www/backup` 备份到 B 机器的 `/home/einverne/Backup` 目录，并压缩：

```
tar zcvf - /www/backup/ | ssh your_username@ip_of_hostname "cat > /home/einverne/Backup/aapanel.tgz"
```

## Gzip Bzip2 vs XZ

Gzip, Bzip2 和 XZ 是 UNIX 系统下常见的压缩工具。 xz 是一个使用 LZMA 压缩算法的无损数据压缩文件格式，xz 文件格式的压缩率更高。

[这里](https://www.rootusers.com/gzip-vs-bzip2-vs-xz-performance-comparison/) 有篇文章对比了三个工具的压缩率，压缩时间等等

### xz 文件
如果不使用上面提及的一步压缩和解压方式，可以拆看先解压，再拆包

    xz -d file.tar.xz
    tar -xvf file.tar

创建同理

    tar -cvf file.tar /file
    xz -z file.tar
