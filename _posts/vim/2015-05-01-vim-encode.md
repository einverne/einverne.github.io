---
layout: post
title: "Vim字符编码及中文菜单乱码"
description: "VIM字符编码解决方案，自动识别文件编码，中文菜单乱码"
category: Vim
tags: [vim,linux, encode, fileencoding]
last_updated: 2016-07-16
---

vim经常遇到文件乱码的情况，很多的文章都只是解决了作者遇到的乱码问题，不同的使用者由于环境不一样，参考之后，反而更加混淆和复杂。

其实vim乱码是与系统环境非常相关的，一味执着于修改vim的配置而不知道分析系统的实际环境，往往导致混淆，本文从原理分析vim编码的设计和乱码原因，帮助所有的用户解决vim的乱码。

vim为何会出现乱码：

1. 首先是输入，vim 以错误的格式解析文件，比如原本是utf-8，但以ansi解析，那必然是乱码了。
2. 然后是处理，vim 以错误的格式处理文件，比如原本是utf-8，但内部以 ansi 保存处理，导致乱码。
3. 然后是输出，vim 输出显示的编码与系统不一致，也会乱码。
4. 最后是写入，vim 回写文件与打开的不一致，造成编辑后文件乱码。

在 Linux 下需要考虑：

1. Linux 默认支持的语系，/etc/sysconfig/i18n
2. 终端 bash 的语系，与 $LANG 变量有关
3. 再就是上面提到的文件编码有关

## VIM编码相关选项
Vim 有四个跟字符编码方式有关的选项，`encoding` 、`fileencoding`、`fileencodings`、`termencoding` (这些选项可能的取值请参考 Vim 在线帮助  :help encoding-names)，它们的意义如下:

### encoding
encoding(enc) : Vim 内部使用的字符编码方式，包括 Vim 的 buffer (缓冲区)、寄存器中字符串、菜单文本、消息文本等。用户手册上建议只在 `.vimrc` 中改变它的值，事实上似乎也只有在 .vimrc 中改变它的值才有意义。Vim 读取文件之后，但并不以读取文件的编码来处理，而是会转换成内部编码的格式。这个编码默认是系统 locale 决定，一般与操作系统相关，linux下utf-8居多，中文windows下则是gbk。可以使用 `:set enc` 来查看当前 enc 设置

### fileencoding
fileencoding(fenc) : 用于配置打开文件和保存文件的编码，fenc 是当前缓冲区文件自身的编码。从磁盘读取文件， Vim 会对文件编码检查，如果文件的编码与 Vim 内部编码(enc) 不同， Vim 会对文本做转码。当 Vim 向磁盘写文件时， enc 与 fenc 不一样， Vim 会转码成 fenc 编码保存文件。

该设置只能有一个值，只适合少数文件都是同种编码的环境

### fileencodings
fileencodings(fencs): 这是一个字符编码的列表，Vim 启动时会按照它所列出的字符编码方式逐一探测即将打开的文件的字符编码方式，并且将 fileencoding 设置为最终探测到的字符编码方式。因此最好将 Unicode 编码方式放到这个列表的最前面，将拉丁语系编码方式 latin1 放到最后面。从名字上看就知道是fileencoding的增强版，可以配置多种不同的编码，常见的配置为，配置好之后，列表中的文本编码只要合法，都能被 Vim 正确的读取。

### termencoding
termencoding(tenc): Vim 所工作的终端 (或者 Windows 的 Console 窗口) 的字符编码方式，或者说是 Vim 用于屏幕显示时的编码。这个选项在 Windows 下对我们常用的 GUI 模式的 gVim 无效，而对 Console 模式的 Vim 而言就是 Windows 控制台的代码页，并且通常我们不需要改变它。Vim 输出的编码，输出指输出到操作系统或命令终端等，默认与操作系统的语言编码一致，如果使用linux命令终端，建议终端和linux系统配置相同的编码，然后配置相同的termencoding，否则顾全了vim就顾不上shell，不过如果shell不存在中文名文件，则配置终端和termencoding一致即可，对于windows，能自动的识别gbk和utf-8，不用特殊配置。

### fileformats
fileformats，用于区分操作系统，主要是回车\r\n的区别，fileformats选项，用于处理文件格式问题。以下命令，告诉 Vim 将UNIX文件格式做为第一选择，而将MS-DOS的文件格式做为第二选择：（换行方式 在早期的打印机时代，开始新的一行要占用两个字符的时间。如果到了一行的结尾处，你要快速回到新的一行的开头，需要打印针头在纸面上飞快地掠过，常常会在纸面上留下污点。解决这个问题的办法就是，用两个字符：一个字符<Return>来移到第一列，另一个字符<Line feed>来新增一行。计算机产生以后，存储较为昂贵，在如何解决回车换行这个老问题上，人们产生了不同的意见。UNIX人认为在到达一行的结尾时新增一行<Line feed> (LF)，而Mac人则认同<Return> (CR)的解决办法，MS则坚持古老的<Return><Line feed> (CRLF)的方法。这就意味着如果你将一个文件从一个系统转移到另一个系统，就面临着回车换行的问题。而 Vim 编辑器则会自动的认出这种文件格式方面的区别，并做出相应处理。）

	set fileformats=unix,dos

### VIM 多字符编码方式工作流程
再记录一下，Vim 的多字符编码方式支持是如何工作的：

1. Vim 启动，根据 .vimrc 中设置的 encoding 的值来设置 buffer、菜单文本、消息文的字符编码方式。
2. 读取需要编辑的文件，根据 fileencodings 中列出的字符编码方式逐一探测该文件编码方式。并设置 fileencoding 为探测到看起来是正确的字符编码方式,如果没有找到合适的编码，就用latin-1(ASCII)编码打开。
3. 对比 fileencoding 和 encoding 的值，若不同则调用 iconv 将文件内容转换为 encoding 所描述的字符编码方式，并且把转换后的内容放到为此文件开辟的 buffer 里，此时我们就可以开始编辑这个文件了。
4. 编辑完成后保存文件时，再次对比 fileencoding 和 encoding 的值。若不同，再次调用 iconv 将即将保存的 buffer 中的文本转换为 fileencoding 所描述的字符编码方式，并保存到指定的文件中。

由于 Unicode 能够包含几乎所有的语言的字符，而且 Unicode 的 UTF-8 编码方式又是非常具有性价比的编码方式 (空间消耗比 UCS-2 小)，因此建议 encoding 的值设置为 utf-8。这么做的另一个理由是 encoding 设置为 utf-8 时，Vim 自动探测文件的编码方式会更准确 (或许这个理由才是主要的 ;) 。我们在中文 Windows 里编辑的文件，为了兼顾与其他软件的兼容性，文件编码还是设置为 GB2312/GBK 比较合适，因此 fileencoding 建议设置为 chinese (chinese 是个别名，在 Unix 里表示 gb2312，在 Windows 里表示 cp936，也就是 GBK 的代码页)。

### vimrc中设置

在分析了乱码原因，了解了vim编码的参数之后，就可以根据实际情况来配置了

1. 分析文件编码，配置 Vim 文件文件解析编码fileencodings，让 Vim 能解析出来
2. 分析系统编码，配置 Vim 内码encoding，如果linux系统语言为ansi，则必须配置内码，否则 Vim 无法处理中文，中文windows下 Vim 内码为gbk，但还是建议统一配置为utf-8
3. 根据输出配置显示编码，linux系统如果使用了putty或者SecureCRT，需要注意配置termencoding和终端软件一致，windows系统比较少有终端软件，系统能自动解析gdb和utf-8，建议统一配置为utf-8

参考的 Vim 编码配置如下，linux 和 windows 配置相同，linux系统语言编码和ssh终端编码配置为utf-8，windows则不需要配置，即可正常的打开utf-8，gdk等编码的文件

	" Vim 内部编码
	set encoding=utf-8
	"按照utf-8 without bom，utf-8，顺序识别打开文件
	set fileencodings=ucs-bom,utf-8,gbk,gb2312,cp936,big5,gb18030,shift-jis,euc-jp,euc-kr,latin1

	set fileencoding=utf-8

	"防止菜单乱码
	if(has("win32") || has("win64") || has("win95") || has("win16"))
		source $VIMRUNTIME/delmenu.vim
		source $VIMRUNTIME/menu.vim
		language messages zh_CN.utf-8
	endif
	"默认以双字节处理那些特殊字符
	if v:lang =~? '^\(zh\)\|\(ja\)\|\(ko\)'
		set ambiwidth=double
	endif

	set nobomb "不自动设置字节序标记

参考：

- [http://blog.zheezes.com/vim-ultimate-character-encoding-scheme.html](http://blog.zheezes.com/vim-ultimate-character-encoding-scheme.html)
- http://www.vimer.cn/2009/10/87.html

