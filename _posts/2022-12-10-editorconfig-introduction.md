---
layout: post
title: "editorconfig 配置文件说明"
aliases:
- "editorconfig 配置文件说明"
tagline: ""
description: ""
category: 学习笔记
tags: [ editorconfig, editor, ide, vscode, indent, code-format, ]
create_time: 2022-12-20 16:26:21
last_updated: 2022-12-20 16:26:21
---

在一些开源项目的根目录中会有一些 `.editorconfig` 文件，看名字也能大致猜出来是编辑器的配置文件，这个文件的主要内容就是编辑器编码、缩进等等配置。

editorconfig 可以跨不同编辑器，为不同的 IDE 维护一份一直的编码风格配置文件。

样式定义举例：

```
[*]
end_of_line = lf
insert_final_newline = true
```

第一行为通配符。

## 文件通配符

editorconfig 中可以使用正则来匹配文件，对匹配的文件使用之后定义的配置。

比如例子中的 `[*]` 就表示的是匹配所有的文件。

这个通配符类似正则表达式。

- `*` 匹配除 `/` 之外的任意
- `**` 匹配任意字符
- `?` 匹配单个字符
- `[name]` 匹配指定字符
- `[!name]` 匹配非指定字符
- `{s1, s2, s3}` 匹配多个字符
- `{num1..num2}` 匹配 num1 和 num2 之间的任意字符。

### 指定文件
如果要指定为 Markfile 文件设定格式：

```
[Makefile]
indent_style = tab
```

也可以指定多个文件，使用 `,` 分隔：

```
[{package.json,.travis.yml}]
```

### 指定文件类型生效
如果要匹配所有的 Python 源文件和 JavaScript 源文件可以使用：

```
[*.{js,py}]
```

### 指定路径
指定路径下的所有文件：

```
[lib/**.js]
indent_style = space
indent_size = 2
```

## 配置语法

缩进风格：

```
indent_stype
```

可选值：

- `space` 空格
- `tab` Tab 制表符

缩进大小：

```
indent_size
```

通常会设定 2 字符或 4 字符。

换行符号类型：

```
end_of_line
```

可以是：

- `lf` 换行，Unix 和 Linux 下的换行
- `cr` 回车，macOS 下的
- `crlf` 回车换行，Windows 和 Dos 下

编码格式：

```
charset
```

通常会：

- `utf-8`
- `utf-8-bom`
- `utf-16be`
- `utf-16le`

文件末尾是否插入空行：

```
insert_final_newline
```

如果配置 `true` 则在文件末尾插入空行。

常用的例子：

```
# top-most EditorConfig file
root = true

# all files
[*]
indent_style = tab
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

# .md file
[*.md]
trim_trailing_whitespace = false
```

所有其他的配置可以见 [官方 Wiki](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties) 。

## IDEA 配置 editorconfig
JetBrains 的 IDEA 可以安装 editorconfig 插件。

## Vim 配置 editorconfig 插件

在 Vim 下使用 [vim-plug](https://github.com/junegunn/vim-plug) 插件管理器，添加 [editorconfig-vim](https://github.com/editorconfig/editorconfig-vim#readme) 插件

```
Plug 'editorconfig/editorconfig-vim'
```

source `.vimrc` ，然后 `: PlugInstall` 即可。

其他编辑器可以查看 [官网](https://editorconfig.org/#download) 。

## reference

- <https://github.com/editorconfig/editorconfig/>
