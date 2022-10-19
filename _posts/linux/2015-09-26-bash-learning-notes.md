---
layout: post
title: "Bash 学习笔记之基本使用"
tagline: "Bash 学习笔记"
description: "Bash 学习笔记"
category: [ Linux ]
tags: [ linux , bash, vim, shell, zsh, unix, command, cli ]
last_updated: 2017-01-08
---

Bash 的前身 shell 是 Unix 系统下的命令行解释器，主要用于用户和系统交互。 Unix 系统上有很多 Shell，首个 Shell，Bourne Shell，1978 年推出，后来又演变出 C Shell，Bash 等不同版本的 Shell。

Bash 全称为 Bourne-Again Shell，是一个为 GNU 项目编写的的 Unix Shell。Bash 脚本功能强大，尤其是在处理循环或者批量任务时。Bash 是大多数 Linux 平台默认的 Shell，所以学好 Bash 是基础。

首选来看一下 Bash 的版本，输入下面命令

    echo $BASH_VERSION

## 命令行编辑 Emacs mode vs Vi Mode
可以使用 `set -o | egrep -w "(vi|emacs)"` 命令查看，当前命令行编辑模式。

	$ set -o vi
	$ set -o|egrep -w "(vi|emacs)"
	emacs           off
	vi              on

All the above assume that bash is running in the default Emacs setting, if you prefer this can be switched to Vi shortcuts instead.

Set Vi Mode in bash:

	$ set -o vi

Set Emacs Mode in bash:

	$ set -o emacs

using `set -o` to check all the bash options.

## Emacs 编辑模式

[完整 Emacs 编辑模式快捷键](http://ss64.com/bash/syntax-keyboard.html)，文档 [link](/assets/readline-emacs-editing-mode-cheat-sheet.pdf)

Bash Keyboard Shortcuts 在绝大多数情况下一下快捷键可以直接使用

### 移动光标 Moving the cursor
在终端移动快捷键，下面几个快捷键在命令行中非常有用，尤其是当命令比较长时，在行前，行末快速切换能够提高不少效率。而如果要修改命令行中间内容，这时候组合使用 alt ctrl 和 b f 则能够快速定位到中间修改的内容，再进行修改。

Command |  Explain
--------|------------
**Ctrl + a**  |  移动到命令最前 Go to the beginning of the line (Home)
**Ctrl + e**  |  移动到行尾 Go to the End of the line (End)
**Ctrl + p**  |  上一个命令 Previous command (Up arrow)
**Ctrl + n**  |  下一个命令 Next command (Down arrow)
 **Alt + b**  |  不删除命令的情况下，向前移动一个单词 Back (left) one word
 **Alt + f**  |  向后一个单词 Forward (right) one word
**Ctrl + b**  |  光标向前移动一个字符 Backward
**Ctrl + f**  |  光标向后移动一个字符 Forward
**Ctrl + xx** |  在行首和当前光标的位置来回切换 Toggle between the start of line and current cursor position

`Ctrl-b` 和 `Ctrl-f` 这两个快捷键是我经常容易忘记的两个，但是有的时候又要比左右方向键要方便很多，所以还是要记一下的。

### 编辑 Editing
编辑相关的快捷键，对我而言 <kbd>Ctrl</kbd> + <kbd>w</kbd> 是一个非常常用的快捷键，当输入发生错误时，直接快速删除前一个单词再进行修正。

Command   |  Explain
----------|------------
Ctrl + L  |  Clear the Screen, similar to the `clear` command
Alt + Del |  Delete the Word before the cursor.
Alt + d   |  Delete the Word after the cursor.
Ctrl + d   |  Delete character under the cursor
Ctrl + h   |  Delete character before the cursor (Backspace)
 - | -
Ctrl + w   |  Cut the Word before the cursor to the clipboard. 一般用来快速删除前一个单词，也可以用 Alt + Backspace
Ctrl + k   |  Cut the Line after the cursor to the clipboard. 将光标后面的内容剪切
Ctrl + u   |  Cut/delete the Line before the cursor to the clipboard. 一般用来快速清除当前输入命令
-----------|----------------------
Alt + t    |  Swap current word with previous
Ctrl + t   |  Swap the last two characters before the cursor (typo).
Esc  + t   |  Swap the last two words before the cursor.
-----------|----------------------
Ctrl + y   |  Paste the last thing to be cut (yank)
Alt + u   |  UPPER capitalize every character from the cursor to the end of the current word.
Alt + l   |  Lower the case of every character from the cursor to the end of the current word.
Alt + c   |  Capitalize the character under the cursor and move to the end of the word.
Alt + r   |  Cancel the changes and put back the line as it was in the history (revert).
Ctrl + _   |  Undo
------------|-------------------------------
TAB        |  Tab completion for file/directory names

For example, to move to a directory 'sample1'; Type cd sam ; then press TAB and ENTER.
type just enough characters to uniquely identify the directory you wish to open.

### 历史 History
查询 bash 命令历史，快速执行历史命令

Command |  Explain
--------|------------|
**Ctrl + r**  |  Recall the last command including the specified character(s)      <br/>  searches the command history as you type. <br/>  Equivalent to : vim ~/.bash_history.
Ctrl + p  |  Previous command in history (i.e. walk back through the command history)
Ctrl + n  |  Next command in history (i.e. walk forward through the command history)
----------|-------------------------
Ctrl + s  |  Go back to the next most recent command. <br/> (beware to not execute it from a terminal because this will also launch its XOFF).
Ctrl + o  |  Execute the command found via Ctrl+r or Ctrl+s
Ctrl + g  |  Escape from history searching mode
      !!  |  Repeat last command
    !abc  |  Run last command starting with abc
  !abc:p  |  Print last command starting with abc
      !$  |  Last argument of previous command
ALT + .   |  Last argument of previous command
     !*   |  All arguments of previous command
^abc­^­def|   Run previous command, replacing abc with def

### 进程控制 Process control
下面几个命令可以控制命令行中正在执行的进程，包括中止进程，放置进程到后台，唤起进程等等。

Command |  Explain
--------|------------|
Ctrl + C |  Interrupt/Kill whatever you are running (SIGINT)
Ctrl + s |  Stop output to the screen (for long running verbose commands)
         |  Then use PgUp/PgDn for navigation
Ctrl + q |  Allow output to the screen (if previously stopped using command above)
Ctrl + D |  退出当前 Shell Send an EOF marker, unless disabled by an option, this will close the current shell (EXIT)
Ctrl + Z |  Send the signal `SIGTSTP` to the current task, which suspends it. <br/>  To return to it later enter fg 'process name' (foreground).


最常使用的应该还是 `Ctrl-a`, `Ctrl-e`, `Ctrl-f`, `Ctrl-b`, `Ctrl-l`, `Ctrl-h`, `Ctrl-w`, `Ctrl-k`, `Ctrl-u`, `Ctrl-y`, `Ctrl-r`.

| 命令   | 说明                                     |
| ------ | ---------------------------------------- |
| Ctrl-B | 后移一个字符                             |
| Ctrl-F | 向前移动一个字符                         |
| DEL    | 向后删除一个字符                         |
| Ctrl-D | 向前删除一个字符                         |
| Ctrl-A | 移到行首                                 |
| Ctrl-E | 移到行尾                                 |
| Ctrl-K | 向前删除到行尾                           |
| Ctrl-P | 移到前一行                               |
| Ctrl-N | 移到后一行                               |
| Ctrl-R | 向后搜索                                 |
| Ctrl-J | 等同于 RETURN                            |
| Ctrl-L | 清除屏幕，将当前行放到屏幕最上面         |
| Ctrl-M | 等同于 RETURN                            |
| Ctrl-O | 等同于 RETURN 随后在显示历史命令中下一行 |
| Ctrl-T | 颠倒光标左右两个字符，将光标向前移一个   |
| Ctrl-U | 从光标位置开始删除行 ，向后删除到行首    |
| Ctrl-V | 引用插入                                 |


## Vi 编辑模式
通过设置 `set -o vi` 进入 Vi 编辑模式，正常环境为输入模式，对命令进行修改则按 <kbd>Esc</kbd>。完整命令[参考](/assets/bash-vi-editing-mode-cheat-sheet.pdf).

命令包括 <kbd>h</kbd>, <kbd>l</kbd>, <kbd>w</kbd>, <kbd>b</kbd> 等等 Vi 中使用的命令，可参考另外一篇 [Vim 学习笔记](/post/2015/05/vim-notes.html)。

- 通过按键 `Esc` , `Ctrl+l（L lower case）` ，clear screen。
- Ctrl-w
- Ctrl-u
- Ctrl-k
- Ctrl-y
- Ctrl-r

## 环境配置 {#env}

### 特殊文件 {#bash-profile}

最重要的 Bash 文件是 `.bash_profile` ，它在每次用户登陆系统时被读取 `/etc/profile` 。Bash 允许有 `.bash_profile` 两个同义文件， C Shell 的 `.bash_login` 以及 Bourne Shell 和 Korn Shell 的 `.profile` 。登录时三者中只有一个被读取，如果用户根目录下 `.bash_profile` 不存在，则 bash 依次查找 `.bash_login` , `.profile`.

`.bash_profile` 只被登录 shell 读取并执行，如果通过命令键入 Bash 启动一个新 Shell， 它就会读取 bashrc 中的命令。

`.bash_logout` 在每次 shell 退出时被读取并执行。

可以使用 `source ~/.bashrc` 来使配置文件立即生效。

修改 `.bashrc` 文件可以精确到对当前用户有效。修改 `/etc/profile` 对全局用户生效。

### 别名 {#alias}

给命令添加熟悉的别名

	alias name=command

指定 name 是 command 的别名。在“=”两边没有空格，严格语法。

别名是可递归的，可以使用别名定义另外的别名。

### 选项 {#option}

别名可以为命令创建方便的名字，它们实际上并不改变 shell 的行为。选项则不然。基本命令：

	set -o optionname	- 号 开启
    set +o optionname	+ 号 关闭

检查 bash 所有可选项，使用 `set -o` 打印所有列表。

shopt 选项

选项 | 含义
-----|-----
-p   | 显示可选设置及其当前取值
-s   | 设置
-u   | 失效
-o   | 允许选项名取值通过 set 命令 -o 选项定义

列表选项如下：

    allexport           off
    braceexpand         on
    emacs               off
    errexit             off
    errtrace            off
    functrace           off
    hashall             on
    histexpand          on
    history             on
    ignoreeof           off
    interactive-comments     on
    keyword             off
    monitor             on
    noclobber           on
    noexec              off
    noglob              off
    nolog               off
    notify              off
    nounset             off
    onecmd              off
    physical            off
    pipefail            off
    posix               off
    privileged          off
    verbose             off
    vi                  on
    xtrace              off

| 选项      | 解释                                  |
| --------- | ------------------------------------- |
| emacs     | emacs 编辑模式                        |
| vi        | vi 编辑模式                           |
| ignoreeof | 不允许单独使用 Ctrl-D 退出            |
| noclobber | 不允许输出重定向（>）覆盖已存在的文件 |
| noglob    | 不允许扩展文件名通配符如`*`和 `?`     |
| nounset   | 试图使用未定义变量时给出错误          |


### 变量 {#variable}

Shell 变量也是一个拥有取值的名字，bash 有一些内置的变量，shell 编程也可以自定义变量。按照惯例，内置变量名均为大写，当然也有两个例外。

	varname=value

**等号两边必须没有空格**。

引用变量，使用符号 `$` , 单引号内部的变量会直接使用而不需要转义，而**双引号内部变量需要转义**。

	echo $varname

bash 有很多内置变量分布在各个配置文件中。

### 内置变量

PATH 变量，帮助 shell 找到输入的命令。输入 `echo $PATH` 得到类似：

	/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin


| 变量          | 含义                        |
| ------------- | --------------------------- |
| HOME          | 主目录                      |
| SECONDS       | 调用 shell 的秒数           |
| BASH          | 正在运行的 shell 实例路径名 |
| BASH_VERSION  | shell 版本号                |
| BASH_VERSINFO | shell 版本信息数组          |
| PWD           | 当前目录                    |
| OLDPWD        | 最后一个 cd 命令前的目录    |
