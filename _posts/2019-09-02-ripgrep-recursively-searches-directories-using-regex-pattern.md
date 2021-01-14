---
layout: post
title: "使用 ripgrep 通过正则快速查找文件内容"
tagline: ""
description: "Linux 下文本搜索神器"
category: 学习笔记
tags: [ripgrep, grep, find, ag, rg, search, regex, ]
last_updated:
---

`ripgrep`（简称 rg)，是一个用 Rust 实现的命令行搜索工具，可以通过正则来搜索当前的目录。默认情况下 ripgrep 会遵循 `.gitignore` 的内容，并且自动跳过隐藏的文件目录，以及二进制文件。 ripgrep 原生支持 Windows, MacOS, Linux。ripgrep 和其他流行的搜索工具非常相似，比如 `The Silver Searcher`, `ack` 和 `grep`.

- <https://github.com/BurntSushi/ripgrep>

## rg 的优势

目前 Linux 下可用的搜索工具非常多，GNU 中的 [grep](/post/2017/09/grep.html)， [ack-grep](/post/2017/10/ack-grep.html)，[The Silver Searcher](/post/2019/04/the-silver-searcher.html) 等等，而 `rg` 的优势在于**快**。

- `ripgrep` 是真正的快，我在一个有 26G 代码的目录中查找一个方法也可以在几乎秒级的速度找到，所以我经常用来搜索不确定调用关系，但代码又分布在不同项目中时使用
- `ripgrep` 遵循 `.gitignore`，在默认情况下会跳过二进制文件，隐藏的文件目录，不会追踪软链接，更进一步加快了速度
- `ripgrep` 支持 Unicode, 可以搜索压缩文件，还可以自己选择正则表达式匹配引擎，比如 [PCRE2](https://www.pcre.org/current/doc/html/pcre2syntax.html)


## Installation
安装的内容直接参考[官方页面](https://github.com/BurntSushi/ripgrep) 即可。

    brew install ripgrep

## Usage
来看看 rg 的通用格式

	USAGE:
		rg [OPTIONS] PATTERN [PATH ...]
		rg [OPTIONS] [-e PATTERN ...] [PATH ...]
		rg [OPTIONS] [-f PATTERNFILE ...] [PATH ...]
		rg [OPTIONS] --files [PATH ...]
		rg [OPTIONS] --type-list
		command | rg [OPTIONS] PATTERN

最不用记忆的就是直接：

	rg "keyword"

会显示当前目录下的搜索内容，会打印出**文件名**及**关键字出现的行数**。

和 grep 命令类似，也有三个打印出上下行的选项

- `-A NUM` 打印匹配行后面 after N 行
- `-B NUM` 打印匹配行前面 before N 行
- `-C NUM` 打印匹配行前后 N 行

### 用正则表达式搜索
使用 `-e REGEX` 来指定正则表达式

	rg -e "*sql" -C2

### 搜索所有内容包括 gitignore 和隐藏文件
默认 rg 会忽略 `.gitignore` 和隐藏文件，可以使用 `-uu` 来查询所有内容：

	rg -uu "word" .

### 显示匹配的次数
使用 `-c` 来显示匹配的次数：

	rg -c "word" .

结果会在文件名后面增加一个次数。

### 搜索指定的文件类型
可以使用 `-t type` 来指定文件类型：

	rg -t markdown "mysql" .

支持的文件类型可以通过

	rg --type-list

来查看。

看到这里，有些读者可能要问假如我要在两个文件类型中查找呢，这个时候 `-t` 参数就无法满足了，需要引入新的 `-g` 参数，`man rg` 看一下 `-g` 就知道该选项后面跟着一个 GLOB，正则表达式，包括或者去除一些文件或者目录。比如要在 `md` 文件或者 `html` 文件中查找 "mysql" 关键字

	rg -g "*.{md,html}" "mysql"

注意这里是花括号。

### 只打印包含匹配内容的文件名

使用 `-l` 来打印文件名

	rg -l -w "word" .

相反的是如果要打印没有匹配内容的文件名

	rg --files-without-match -w "word" .

### 启用大小写敏感
使用 `-s` 选项来启用大小写敏感

	rg -s "word" .

使用 `-i` 来关闭大小写敏感。

### 显示不包含关键字的行
使用选项 `-v` 来显示不包含关键字的行

	rg -v "word" .

### 搜索单词

添加 `-w` 参数仅显示该单词的内容，该选项等同于在搜索 Pattern 前后加上 `\b`，这样可以避免因为模糊搜索而导致的不精确。

	rg -w "myword" .

比如搜索 abc，可能有些单词包含 dabce ，那么也会被搜索出来，而加上 `-w` 就不会搜索出来了。

## reference

有两个方法查看 rg 使用

- `man rg`
- `tldr rg`
- <https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md>
