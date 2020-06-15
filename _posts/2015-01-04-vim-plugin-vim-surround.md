---
layout: post
title: "Vim 插件之： vim-surrounding"
tagline: ""
description: ""
category: vim-plugin
tags: [vim, vim-plugin, vim-surrounding, tpope]
last_updated:
---

vim-surrounding 插件可以轻松的一次性修改成对出现的，比如 `()`, `[]`, `{}`, 双引号，XML 标签等等。提供了

- 增加
- 删除
- 修改

包围内容的方法。


首先放上链接：

- <https://github.com/tpope/vim-repeat>

## Installation

    Plugin 'tpope/vim-surrounding'


## Usage

用下面的例子做 demo

    print("hello world")

光标定位在 hello world 包括引号，那么使用如下的命令可以实现双引号替换成单引号：

    cs"'


### change surrounding
Change surroundings is `cs`. 接受两个参数，目标，和替换内容

    cs"'            # change " to '
    cs"<q>          # change " to <q>
    cs)]            # change ) to ]

如果要替换标签的内容，比如说将 h1 替换为 h2，则需要用到 `t`

    <h1>Title</h1>

则需要 `cst<h2>`，同理要将 `<h1>` 替换成双引号，则 `cst"`

假如有一行内容

    <h1>This is a title</h1>

`cs` 还有一个变种 `cS`，效果则是将变化的内容放到新行中。

### add surrounding
给 hello 增加 `<h2>`

    hello

那么可以使用 `csw<h2>`，简单记忆成 change surrounding of word `<h2>` ，给 word 增加 `<h2>` 标记

可以看到 cs 接受两个参数，会用后一个参数替换前一个。

### delete surrounding
比如删除双引号，delete + surrounding + "

    ds"             # delete surrounding "
    ds(             # delete surrounding (
    dst             # delete surrounding tags

`ds` 和 `cs` 都将 target 作为第一个参数，所有的 target （text-objects) 目前都是一个字符。

    (), [], {}, <>
    b, r, B, a 分别对应上面括号
    ', ", `
    t 表示 HTML 或者 XML 标签
    w, W, s 分别是 word, WORD, sentence
    p 表示 paragraph

### ys 给 surrounding 增加标记
给 hello 增加 `<h2>`

    hello

使用更加复杂一点的 you surrounding inside word with `<h2>`

    ysiw<h2>

`ys` 接受 vim motion 或者 text object 作为一个 object

如果要对整行操作可以使用 `yss` 后接修改的内容，比如给整行增加花括号

    yssB

和 `cS` 一样，`ys` 也有变种版本 `yS` 和 `ySS`，会在新行添加内容，比如给 paragraph 添加双引号

    ySS"

### Visual mode
在选择模式下可以使用 `S` + **需要添加的内容**，来看快速对选择的内容增加 surroundings。

比如我想要给下面这一行中的一部分内容，比如说 main title 增加一个 `<h1>` 标记。

	This is the main title  sub title`

那么只需要将 `This is the main title` 使用 `v` 选中，然后按下 `S<h1>Enter` 回车之后前后就加上了 h1 标签。

在单行选择模式下， surroundings 会添加在行中，在 blockwise 选择模式，每一行都会 surround。

    a = testa
    b = testb
    c = testc

加入上面的三行内容，想要给后面的内容增加双引号，那么可以使用列选选择然后 S + `"` 就可以快速添加。


## Conclusion

    Normal mode
    -----------
    ds  - delete a surrounding
    cs  - change a surrounding
    ys  - add a surrounding
    yS  - add a surrounding and place the surrounded text on a new line + indent it
    yss - add a surrounding to the whole line
    ySs - add a surrounding to the whole line, place it on a new line + indent it
    ySS - same as ySs

    Visual mode
    -----------
    s   - in visual mode, add a surrounding
    S   - in visual mode, add a surrounding but place text on new line + indent it

