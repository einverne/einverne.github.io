---
layout: post
title: "bash 学习笔记"
tagline: "bash 学习笔记"
description: "bash 学习笔记"
category: [ Linux, 学习笔记]
tags: [ linux , bash]
last_updated: 2016-03-08
---


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

### Emacs 编辑模式

[完整 Emacs编辑模式快捷键](http://ss64.com/bash/syntax-keyboard.html)，文档[link](/assets/readline-emacs-editing-mode-cheat-sheet.pdf)

Bash Keyboard Shortcuts

#### Moving the cursor:

Command |  Explain 
--------|------------|
  Ctrl + a  |  Go to the beginning of the line (Home)
  Ctrl + e  |  Go to the End of the line (End)
  Ctrl + p  |  Previous command (Up arrow)
  Ctrl + n  |  Next command (Down arrow)
   Alt + b  |  Back (left) one word
   Alt + f  |  Forward (right) one word
  Ctrl + f  |  Forward one character
  Ctrl + b  |  Backward one character
  Ctrl + xx |  Toggle between the start of line and current cursor position

#### Editing:

Command |  Explain 
--------|------------|
 Ctrl + L   |  Clear the Screen, similar to the clear command
  Alt + Del |  Delete the Word before the cursor.
  Alt + d   |  Delete the Word after the cursor.
 Ctrl + d   |  Delete character under the cursor
 Ctrl + h   |  Delete character before the cursor (Backspace)

 Ctrl + w   |  Cut the Word before the cursor to the clipboard.
 Ctrl + k   |  Cut the Line after the cursor to the clipboard.
 Ctrl + u   |  Cut/delete the Line before the cursor to the clipboard.

  Alt + t   |  Swap current word with previous
 Ctrl + t   |  Swap the last two characters before the cursor (typo).
 Esc  + t   |  Swap the last two words before the cursor.

 ctrl + y   |  Paste the last thing to be cut (yank)
  Alt + u   |  UPPER capitalize every character from the cursor to the end of the current word.
  Alt + l   |  Lower the case of every character from the cursor to the end of the current word.
  Alt + c   |  Capitalize the character under the cursor and move to the end of the word.
  Alt + r   |  Cancel the changes and put back the line as it was in the history (revert).
 ctrl + _   |  Undo
 
 TAB        |  Tab completion for file/directory names

For example, to move to a directory 'sample1'; Type cd sam ; then press TAB and ENTER. 
type just enough characters to uniquely identify the directory you wish to open.

#### History:

Command |  Explain 
--------|------------|
  Ctrl + r  |  Recall the last command including the specified character(s)
            |  searches the command history as you type.
            |  Equivalent to : vim ~/.bash_history. 
  Ctrl + p  |  Previous command in history (i.e. walk back through the command history)
  Ctrl + n  |  Next command in history (i.e. walk forward through the command history)

  Ctrl + s  |  Go back to the next most recent command.
            |  (beware to not execute it from a terminal because this will also launch its XOFF).
  Ctrl + o  |  Execute the command found via Ctrl+r or Ctrl+s
  Ctrl + g  |  Escape from history searching mode
        !!  |  Repeat last command
      !abc  |  Run last command starting with abc
    !abc:p  |  Print last command starting with abc
        !$  |  Last argument of previous command
   ALT + .  |  Last argument of previous command
        !*  |  All arguments of previous command
^abc­^­def|   Run previous command, replacing abc with def

#### Process control:

Command |  Explain 
--------|------------|
 Ctrl + C |  Interrupt/Kill whatever you are running (SIGINT)
 Ctrl + l |  Clear the screen
 Ctrl + s |  Stop output to the screen (for long running verbose commands)
          |  Then use PgUp/PgDn for navigation
 Ctrl + q |  Allow output to the screen (if previously stopped using command above)
 Ctrl + D |  Send an EOF marker, unless disabled by an option, this will close the current shell (EXIT)
 Ctrl + Z |  Send the signal SIGTSTP to the current task, which suspends it.
          |  To return to it later enter fg 'process name' (foreground).


最常使用的应该还是 `Ctrl-a`, `Ctrl-e`, `Ctrl-f`, `Ctrl-b`, `Ctrl-l`, `Ctrl-l`, `Ctrl-h`, `Ctrl-w`, `Ctrl-k`, `Ctrl-u`, `Ctrl-y`, `Ctrl-r`.

命令    |     说明    |
--------|-----------|
Ctrl-B  | 后移一个字符|
Ctrl-F  | 向前移动一个字符|
DEL     | 向后删除一个字符|
Ctrl-D  | 向前删除一个字符|
Ctrl-A  | 移到行首|
Ctrl-E  | 移到行尾 |
Ctrl-K  | 向前删除到行尾 |
Ctrl-P  | 移到前一行|
Ctrl-N  | 移到后一行 |
Ctrl-R  | 向后搜索 |
Ctrl-J  | 等同于 RETURN|
Ctrl-L  | 清除屏幕，将当前行放到屏幕最上面 |
Ctrl-M  | 等同于 RETURN |
Ctrl-O  | 等同于 RETURN 随后在显示历史命令中下一行 |
Ctrl-T  | 颠倒光标左右两个字符，将光标向前移一个|
Ctrl-U  | 从光标位置开始删除行 ，向后删除到行首| 
Ctrl-V  | 引用插入|


### Vi 编辑模式
通过设置 `set -o vi` 进入Vi编辑模式，正常环境为输入模式，对命令进行修改则按 <kbd>Esc</kbd>。完整命令[参考](/assets/bash-vi-editing-mode-cheat-sheet.pdf).

命令包括 <kbd>h</kbd>, <kbd>l</kbd>, <kbd>w</kbd>, <kbd>b</kbd> 等等Vi中使用的命令，可参考另外一篇[Vim学习笔记](/post/2015/05/vim-notes.html)。

- 通过按键 `Esc` , `Ctrl+l（L lower case）` ，clear screen。
- Ctrl-w
- Ctrl-u
- Ctrl-k
- Ctrl-y
- Ctrl-r

## 环境配置 {#env}

### 特殊文件 {#bash-profile}

最重要的bash文件是 `.bash_profile` ，它在每次用户登陆系统时被读取 `/etc/profile` 。bash 允许有 `.bash_profile` 两个同义文件， C Shell 的 `.bash_login` 以及 Bourne Shell 和 Korn Shell 的 `.profile` 。登录时三者中只有一个被读取，如果用户根目录下 `.bash_profile` 不存在，则 bash 依次查找 `.bash_login` , `.profile`.

`.bash_profile` 只被登录 shell 读取并执行，如果通过命令键入 bash 启动一个新 Shell， 它就会读取 bashrc 中的命令。

`.bash_logout` 在每次 shell 退出时被读取并执行。

### 别名 {#alias}

给命令添加熟悉的别名

	alias name=command

指定 name 是 command 的别名。在“=”两边没有空格，严格语法。

别名是可递归的，可以使用别名定义另外的别名。

### 选项 {#option}

别名可以为命令创建方便的名字，它们实际上并不改变shell的行为。选项则不然。基本命令：

	set -o optionname	-号 开启
    set +o optionname	+号 关闭

检查bash所有可选项，使用 `set -o` 打印所有列表。

shopt 选项

选项 | 含义
---- | ----
-p   | 显示可选设置及其当前取值
-s   | 设置
-u   | 失效
-o   | 允许选项名取值通过 set 命令 -o 选项定义



### 变量 {#variable}

Shell变量也是一个拥有取值的名字，bash有一些内置的变量，shell编程也可以自定义变量。按照惯例，内置变量名均为大写，当然也有两个例外。

	varname=value

等号两边必须没有空格。

引用

	echo $varname

bash 有很多内置变量分布在各个配置文件中。
