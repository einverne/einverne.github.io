---
layout: post
title: "每天学习一个命令：tree 生成目录结构"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, tree, command]
last_updated:
---

tree 命令，是一个列出树型目录结构的命令。同时也能够统计出目录下的文件数量和目录数量。

生成目录结构的输出，可以是纯 ASCII 字符，也可以是 html

    tree -H baseHREF

根据手册

tree 命令是用来以树的方式 list 目录下的所有文件

    tree -s -v --du -T "目录索引 - Kindle 伴侣每周一书（往期）（更新：06 月 05 日）" -I "Z.*|index*" -h -H  ./ -o index.html

说明：

- `-s` 列出文件或者目录大小
- `-v` 按照字母序排序
- `--du` 在目录前显示整个目录的大小
- `-T title` 用参数后面的文字替换生成的默认标题
- `-I pattern` 用该参数来排除一些目录
- `-h` 表示打印出可读的文件大小
- `-H` 表示打印 HTML
- `-o file.html` 表示打印到文件而不是标准输出

得到如下的 Tree 图：

![tree directory structure](/assets/tree_directory_structure.png)

## 参数解释
全部参数解释

```
tree --help
usage: tree [-acdfghilnpqrstuvxACDFQNSUX] [-H baseHREF] [-T title ] [-L level [-R]]
[-P pattern] [-I pattern] [-o filename] [--version] [--help] [--inodes]
[--device] [--noreport] [--nolinks] [--dirsfirst] [--charset charset]
[--filelimit[=]#] [--si] [--timefmt[=]<f>] [<directory list>]
  ------- Listing options -------
  -a            All files are listed. 显示所有文件和目录，默认情况下不打印隐藏文件（以点开始的文件）。
  -d            List directories only. 显示目录名称。
  -l            Follow symbolic links like directories. 如遇到性质为符号连接的目录，直接列出该连接所指向的原始目录。
  -f            Print the full path prefix for each file. 在每个文件或目录之前，显示完整的相对路径名称。
  -x            Stay on current filesystem only. 将范围局限在现行的文件系统中，若指定目录下的某些子目录，其存放于另一个文件系统上，则将该子目录予以排除在寻找范围外。
  -L level      Descend only level directories deep. 目录深度
  -R            Rerun tree when max dir level reached.
  -P pattern    List only those files that match the pattern given. 只显示符合范本样式的文件或目录名称。
  -I pattern    Do not list files that match the given pattern. 不显示符合范本样式的文件或目录名称。
  --noreport    Turn off file/directory count at end of tree listing.
  --charset X   Use charset X for terminal/HTML and indentation line output. 指定字符集
  --filelimit # Do not descend dirs with more than # files in them.
  --timefmt <f> Print and format time according to the format <f>.
  -o filename   Output to file instead of stdout. 输出到文件，而不是直接输出到标准输出设备
  -------- File options ---------
  --du 在目录前显示整个目录的大小。
  -q            Print non-printable characters as '?'. 用"?"号取代控制字符，列出文件和目录名称。
  -N            Print non-printable characters as is. 直接列出文件和目录名称，包括控制字符。
  -Q            Quote filenames with double quotes.
  -p            Print the protections for each file. 列出权限标示。
  -u            Displays file owner or UID number. 列出文件或目录的拥有者名称，没有对应的名称时，则显示用户识别码。
  -g            Displays file group owner or GID number. 列出文件或目录的所属群组名称，没有对应的名称时，则显示群组识别码。
  -s            Print the size in bytes of each file. 列出文件或目录大小。
  -h            Print the size in a more human readable way. 打印出可读的文件大小， M，G
  --si          Like -h, but use in SI units (powers of 1000).
  -D            Print the date of last modification or (-c) status change. 列出文件或目录的更改时间。
  -F            Appends '/', '=', '*', '@', '|' or '>' as per ls -F. 在执行文件，目录，Socket，符号连接，管道名称名称，各自加上"*","/","=","@","|"号。
  --inodes      Print inode number of each file.
  --device      Print device ID number to which each file belongs.
  ------- Sorting options -------
  -v            Sort files alphanumerically by version. 字母序排序
  -r            Sort files in reverse alphanumeric order. 字母序逆序
  -t            Sort files by last modification time. 最后一次修改时间排序
  -c            Sort files by last status change time.
  -U            Leave files unsorted. 不排序
  --dirsfirst   List directories before files (-U disables).
  ------- Graphics options ------
  -i            Don't print indentation lines. 不以阶梯状列出文件或目录名称。
  -A            Print ANSI lines graphic indentation lines.
  -S            Print with ASCII graphics indentation lines.
  -n            Turn colorization off always (-C overrides). 不在文件和目录清单加上色彩。
  -C            Turn colorization on always. 在文件和目录清单加上色彩，便于区分各种类型。
  ------- XML/HTML options -------
  -X            Prints out an XML representation of the tree.
  -H baseHREF   Prints out HTML format with baseHREF as top directory.
  -T string     Replace the default HTML title and H1 header with string.
  --nolinks     Turn off hyperlinks in HTML output.
  ---- Miscellaneous options ----
  --version     Print version and exit.
  --help        Print usage and this help message and exit.
```

## reference

- <http://linux.die.net/man/1/tree>
- <http://superuser.com/questions/166579/generate-html-based-on-directory-structure>
- <http://unix.stackexchange.com/questions/45828/print-size-of-directory-content-with-tree-command-in-tree-1-5>

