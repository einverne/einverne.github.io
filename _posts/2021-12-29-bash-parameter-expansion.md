---
layout: post
title: "Bash 中的 Parameter Expansion"
aliases: 
- "Bash 中的 Parameter Expansion"
tagline: ""
description: ""
category: 学习笔记
tags: [ linux, bash, ]
last_updated:
---


Parameter Expansion 是一个用来描述命令行中部分参数被展开（内容被替换）的术语。在大部分的场景中，被展开的参数通常会带有 `$` 符号，在一些特定的场景中，额外的花括号（curly braces）也是必须的。

比如：

    echo "'$USER', '$USERs', '${USER}s'"
    'testuser', '', 'testusers'
    
上面的例子展示了基本的 parameter expansions(PE) 是什么，第二个 PE 结果是一个空字符串，那是因为参数 `USERs` 是空的。其实 `s` 不是参数的一部分，但是因为 bash 无法分辨这一点，所以我们需要使用 `{}` 来限定参数的边界（前后）。

Parameter Expansion 也可以让我们去修改会被展开的字符串，这个操作会使得一些修改变得非常方便：

    for file in *.JPG *.jepg
    do mv -- "$file" "${file%.*}.jpg"
    done

上述的代码会重命名所有扩展名为 `.JPG` 和 `.jepg` 的 JPEG 文件到 `.jpg` 扩展名。然后 `${file%.*}` 表达式则会截取 file 文件从开头到最后一个 `.` 的内容。

其他的一些 PE tricks

- `${parameter:-word}`, **Use Default Value** 如果当 parameter 未设置或为null时，使用默认值 `word`，否则直接使用 parameter 的值
- `${parameter:=word}`，**Assign Default Value** 赋值，当 `parameter` 未设置或为 null 时，`word` 会被赋值给 parameter，然后 parameter 的值会被展开
- `${parameter:+word}`，**Use Alternate Value** 如果 parameter 是 null 或者 未设置，那么结果没有任何被替换，如果 parameter 有值，则会被替换成 word
- `${parameter:offset:length}` Substring Expansion，使用 offset 和 length 限定的字串展开，序号从0开始。
- `${#parameter}` 使用 parameter 的长度展开，如果 parameter 是一个数组名，则展开其中元素个数
- `${parameter#pattern}` `pattern` 会从 parameter 值开始匹配，最短的 match 会从 parameter 中被删除然后剩余的被展开
- `${parameter##pattern}`， `##` 后面的 pattern 会把最长的 match 删掉
- `${parameter%pattern}`，pattern 从 parameter 后往前匹配，最短的匹配被删除，剩余部分展开
- `${parameter%%pattern}`，从后往前，最长的 match 会被删除
- `${parameter/pat/string}`，parameter 值中的第一个出现的 `pat` 会被替换为 `string`
- `${parameter//pat/string}`, 每一个出现的 `pat` 都会被替换
- `${parameter/#pat/string}`，
- `${parameter/%pat/string}`


## reference

- <http://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion>
- <https://www.gnu.org/software/bash/manual/bashref.html#Shell-Parameter-Expansion>