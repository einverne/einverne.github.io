---
layout: post
title: "nemo file manager"
tagline: ""
description: ""
category:
tags: []
last_updated:
---

自从用上 mint 之后，我才发现原来 File Manager 能这么好用，Cinnamon 自带的文件管理叫做 [Nemo](https://github.com/linuxmint/neme) ，至今用过 Windows，Mac，Ubuntu 还要各种发行版，但是唯有 Cinnamon 自带的这个 Nemo 的文件管理器让我用起来最舒服。至于为什么，我一一道来。

## 功能

### 双栏
Nemo 外观很简单，和大多数操作系统的 File Browser 都差不多，左边栏基本上是顶层导航栏，然后主体部分是文件浏览的功能。但是我非常喜欢的双栏设计，当时使用 Windows 的时候还需要借助 Total Commander，而 Mac 的 Finder 是层级的，基本上如果一层一层打开文件夹就会出现一连串的中间文件夹列表，依然不能使用双栏。

![nemo file browser extra pane](/assets/nemo-file-browser-extra-pane-2018-08-25-172939.png)

Nemo 的双栏模式叫做 `Extra pane`，右边一栏可以通过快捷键 F3 快速启动和隐藏，这就使得文件移动复制变得异常简单。当然有人说 `mv path1 path2` 更快当然在有命令行的情况下就不是同一比较线了。

### 检查 md5
很多时候下载文件要检查文件的完整性，大部分情况下都 `md5sum ~/Downloads/large.file.tar.gz` 然后完成了，但是 Nemo extension 原生支持

![nemo gtkhash md5](/assets/nemo-gtkhash-md5-sha1-2018-08-25-174126.png)

### 折叠文件夹
同一个层级的文件夹也可以类似树形展开

![nemo folder](/assets/nemo-folder-2018-08-25-182458.png)

### 标签页
我可以说其他 Windows，Mac 都需要其他额外的软件来支持文件管理器中的标签页，而 Nemo `Ctrl+T` 就能支持，这和我 Chrome 的[快捷键](/post/2017/12/most-useful-chrome-shortcut.html) 是一致的。

![nemo tab](/assets/nemo-tabs-2018-08-25-182923.png)

### 批量修改文件名
有人说不存在，其实 Nemo 本身不带批量重命名功能，但是 Nemo 是支持调用 thunar 的。

    sudo apt install thunar

然后在设置中 Edit->Preferences->Behaviour 标签下 'Bulk rename' 空白栏中填入：

    thunar -B

然后 `nemo -q` 重启，此时再多选，就可以批量重命名了

![nemo bulk rename](/assets/nemo-bulk-rename-2018-08-25-195441.png)

## 扩展
下面就是最主要的部分了，记住如果要想使得 Nemo 在安装之后生效需要强制重启 Nemo `nemo -q` 来退出。

## Dropbox 支持
Dropbox 同步标示

    sudo apt install nemo-dropbox

## Nextcloud 支持
Nextcloud 同步标示

    sudo apt install nextcloud-client-nemo

## nemo-gtkhash
Nemo gtkhash 就是用来显示文件 md5，sha 等等

    sudo apt install nemo-gtkhash

## nemo-fileroller
Nemo Fileroller 扩展就是用来在上下文菜单中管理压缩包，压缩 / 解压功能的，配合 Compress，几乎可以解压所有文件，压缩也支持非常多的格式。如果 Nemo 中右键没有压缩和解压缩的选项，不要慌一行命令就能解决。

    sudo apt-get install nemo-fileroller
    nemo -q

然后重启 nemo 即可。

## nemo-share
能够快速在浏览文件时共享到 samba

    sudo apt install nemo-share

## nemo-compare
使用 meld 来比较两个文件夹，或者两个文件

    sudo apt install nemo-compare

## nemo-seahorse
PGP 加密和签名的工具

    sudo apt install nemo-seahorse

## nemo-terminal
在文件夹中显示嵌入的命令行

    sudo apt install nemo-terminal

## nemo-emblems
可以用来自定义文件夹图标

## nemo-audio-tab
用来显示 mp3 的包含的 meta 信息，包括 title， artist， album 等等

## nemo-pastebin
支持直接上传到 pastebin ，我不怎么用所以没有安装

## Tips

### Nemo Actions
Nemo 允许用户自己定义上下文菜单，文件 `/usr/share/nemo/actions/sample.nemo_action` 包含一个样例，存放自定义 actions 脚本的目录：

- `/usr/share/nemo/actions/` 系统级别
- `~/.local/share/nemo/actions/` 用户级别脚本

actions 脚本必须以 `.nemo_action` 结尾

扫描病毒脚本 `clamscan.nemo_action`，需要提前安装 ClamAV

    [Nemo Action]
    Name=Clam Scan
    Comment=Clam Scan
    Exec=gnome-terminal -x sh -c "clamscan -r %F | less"
    Icon-Name=bug-buddy
    Selection=Any
    Extensions=dir;exe;dll;zip;gz;7z;rar;

在比如检查 md5 或者 sha1 也可以直接放到右击菜单中

    [Nemo Action]
    Active=true
    Name=Check SHA256
    Name[fr]=Vérifier le SHA256
    Comment=Check the SHA256 signature of the file
    Comment[fr]=Vérifier la signature SHA256 de ce fichier
    Exec=mint-sha256sum '%F'
    Icon-Name=gtk-execute
    Selection=S
    Mimetypes=application/x-iso9660-image;image/png;image/jpeg;

再比如我写一个脚本将选中的文件或者文件夹中空格部分替换为 `_`

`format_filename.nemo_action` 如下

    [Nemo Action]
    Active=true
    Name=Format filename %N
    Comment=Replace filename space with - applied to %N
    Exec=<format_filename.py %F>
    Selection=any
    Extensions=any;
    EscapeSpaces=true

python 脚本名叫 `format_filename.py`

    import sys
    import os

    command = sys.argv[0]
    print("Running " + command)
    print("With the following arguments:")
    for arg in sys.argv:
        if command == arg:
            continue
        else:
            formated_path = arg.replace(' ', '_')
            os.rename(arg, formated_path)

在 `nemo_action` 文件中用到了一些内置的变量

- %U - insert URI list of selection
- %F - insert path list of selection
- %P - insert path of parent (current) directory
- %f or %N (deprecated) - insert display name of first selected file
- %p - insert display name of parent directory
- %D - insert device path of file (i.e. /dev/sdb1)

官方的样例可以查看本地的文件也可以看 [GitHub](https://github.com/linuxmint/nemo/blob/master/files/usr/share/nemo/actions/sample.nemo_action)

Nemo Actions 将 Nemo 文件管理器的功能上升了另外一个层面，如果 Python/Bash 能够做的事情，那么在 Nemo 中都能够完成。那几乎就是所有的任务都能够在文件管理器中右键完成了。再举个简单的例子，我经常用 ffmpeg 将 Mp4 中的音频提取出来，那么就可以直接用 Actions ，然后定义

    Exec=gnome-terminal -x sh -c 'ffmpeg -i %F -f mp3 anyname.mp3'

当然其他的都可以完成了。

## reference

- <https://github.com/linuxmint/nemo-extensions>
- <https://wiki.archlinux.org/index.php/Nemo>
- <http://www.webupd8.org/2016/11/nemo-320-with-unity-patches-and-without.html>
