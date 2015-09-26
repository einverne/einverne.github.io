---
layout: post
title: "bash 学习笔记"
tagline: "bash 学习笔记"
description: "bash 学习笔记"
category: [ Linux, 学习笔记]
tags: [ linux , bash]
last_updated: 
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

命令包括 <kbd>h</kbd>, <kbd>l</kbd>, <kbd>w</kbd>, <kbd>b</kbd> 等等Vi中使用的命令，可参考另外一篇[Vim学习笔记](/2015/05/06/vim-notes.html)。

- 通过按键 `Esc` , `Ctrl+l（L lower case）` ，clear screen。
- Ctrl-w
- Ctrl-u
- Ctrl-k
- Ctrl-y
- Ctrl-r

