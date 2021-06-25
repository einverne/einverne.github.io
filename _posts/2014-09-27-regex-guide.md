---
layout: post
title: "正则表达式学习笔记"
aliases: "正则表达式学习笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [regex, regular-expression, java, python, nlp, ]
last_updated:
---

从开始接触正则到现在已经过去很多年了，然而依然没有完全学会正则，每一次回顾的时候总是有很多很多的新东西。

什么是正则，看中文非常抽象，而英文 regular expression 就好理解得多，regular expression 它是一个有规律，常规的，经常需要用的表达式，究其根本就是一个用来搜索特定字符串的表达式，这个表达式遵循一定的规律，有自身的逻辑表达，通过这种通用的方式可以写出比较容易理解的搜索语句。

根据维基百科的[说明](https://en.wikipedia.org/wiki/Regular_expression) 正则一词是美国数学家  Stephen Cole Kleene  于 1950s 正式使用。而这个概念则是在 1980s 因为 Unix 下文本编辑器工具的使用而变得常见。自此之后正则的语法规则 POSIX 和 Perl 区别。

## 常用表达
表示或

    gray|grey

表示匹配 gray 或者 grey 两个单词

分组，用来定义边界，或者确定执行顺序

    gr(a|e)y

和上面表达等效

常见的定量表达

    ?       表示前面的字符出现 0 次或者 1 次
    *       表示前面的字符出现 0 次或者多次
    +       表示前面的字符出现 1 次或者多次
    {n}     表示前面的字符出现 n 次
    {m,}    至少 m 次
    {m, n}  m 到 n 次

通配符 `.` 可以匹配任何一个字符

## 字符组 Character class
字符组 Character Class 是一个比较好理解的，就是一组字符，用方括号来标示，表示匹配其中某一个字符。比如常见的

    [aef]
    [0-9]
    [a-zA-Z]

字符组中的范围表示使用的是 ASCII 编码中的码值，所以不能写成 [9-0]

排除型字符组，在方括号后增加 `^`

    [^0-9]       # 非 0-9
    [^ae]       # 非 a 或 e

字符组简记法，常见的字符组，比如数字，英文字符组，可以用简单的缩写形式来表示。

    \d      [0-9]

## 元字符 meta-character
比如字符组中的 `-` 还有括号 `[`, `]` 还有常见的 `^`, `$` 这些特殊意义的字符都是元字符。如果遇到想要匹配这些特殊的字符就需要转义。

    ^
    $
    .
    []
    [^]
    *
    ()
    {}
    \b          单词边界
    \d          [0-9]
    \w          字母数字下划线和汉字
    \s          任意空白

## 后向引用
当用小括号指定子表达式后，匹配这个子表达式的文本（分组捕获）会自动拥有一个组号，从左到右，分组的左括号为标志，出现的第一个分组为 1，其后 2,3,4 类推。

后向引用则可以利用分组捕获的文本来匹配比如重复的单词

    \b(\w+)\b\s+\1\b

其中的 `\1` 在表示引用前面 `(\w+)` 括号中捕获的文本，比如 go go 则会被匹配。分组捕获通常用在想要获取匹配字符串中部分子串时使用。

但是在使用捕获时一定要注意，过多的捕获会影响正则表达式的效率，如果不需要捕获则可以使用

    (?:exp)

来忽略捕获的内容。

分组还有一些其他的语法

    (?<name>exp)        匹配 exp，将捕获的文本放到名字为 name 的组，也可以写成 (?'name'exp)
    (?#comment)         注释，无任何作用

### 零宽断言
了解零宽断言需要分两部分来理解，第一是匹配宽度为 0，第二断言表示满足一定的条件。匹配宽度指的是匹配时占字符宽度，比如在匹配不包含 a 或 b 开头的单词时，如果使用 `[^ab]` 那么 `[]` 则会占用一个字符宽度。零宽断言用于查找在某些内容（但并不包括这些内容）之前或之后的东西时。

零宽断言的英文是 Lookahead and Lookbehind Zero-Length Assertions 这就好理解很多了，就是正则表达式先要匹配的内容往前或者往后的断言，也就是比如我想要匹配的一串数字必须在 `id=` 后面就可以使用先行断言

    (?=id=)\d+

零宽断言又分四种

    (?=exp)         断言自身出现的位置的后面能匹配表达式 exp
    (?<=exp)        断言自身出现的位置的前面能匹配表达式 exp
    (?!exp)         断言此位置的后面不能匹配表达式 exp
    (?<!exp)        断言此位置的前面不能匹配表达式 exp

#### 先行断言
先行断言，也叫零宽度正预测先行断言 `(?=exp)` 表示匹配表达式前面的位置

比如，`b\w+(?=ing\b)` ，匹配以 ing 结尾的单词的前面部分（除了 ing 以外的部分）

注意：先行断言的执行步骤是这样的，先从要匹配的字符串中的最右端找到第一个 ing（也就是先行断言中的表达式）然后再匹配其前面的表达式，若无法匹配则继续查找第二个 ing 再匹配第二个 ing 前面的字符串，若能匹配则匹配

例如： `.*(?=ing)` 可以匹配 `cooking singing` 中的 `cooking sing` 而不是 `cook`

#### 后发断言
后发断言，也叫零宽度正回顾后发断言 `(?<=exp)` 表示匹配表达式后面的位置

例如 `(?<=abc).*` 可以匹配 abcdefg 中的 defg

注意：后发断言跟先行断言相反，它的执行步骤是这样的：先从要匹配的字符串中的最左端找到第一个 abc（也就是先行断言中的表达式）然后 再匹配其后面的表达式，若无法匹配则继续查找第二个 abc 再匹配第二个 abc 后面的字符串，若能匹配则匹配

例如 `(?<=abc).*` 可以匹配 `abcdefgabc` 中的 defgabc 而不是 abcdefg

#### 负向零宽断言

负向零宽断言 `(?!exp)` 也是匹配一个零宽度的位置，不过这个位置的“断言”取表达式的反值，同样，负向零宽断言也有“先行”和“后发”两种，负向零宽后发断言为 `(?<!exp)`

比如说想要匹配文本中所有等号后面的数字，但是就是不想匹配 `id=123` 这样 id= 开始的数字

    (?<!id)=\d+

这四个断言的中文翻译的太烂了，完全不知道说的什么，用英语解释就清晰很多。

## Atomic groups
Atomic groups 光看字面意思完全无法理解，但是如果举例说明，比如

    a(bc|b)c

这是一个普通的分组正则，可以匹配 abcc 或者 abc，但是

    a(?>bc|b)c

使用 Atomic groups 之后则只能匹配 abcc 而不能匹配 abc.

Atomic groups 在匹配 abc 时，括号中匹配到 bc 就退出了，而此时无法匹配括号外的 c 则失败了。

Atomic groups 会查找到第一个匹配的子串，然后就退出匹配，也不会回溯。所以如果在一些匹配到第一项，而后面不需要考虑的情况下可以使用 Atomic groups。


## 实例

比如说字符串 `foobarbarfoo`:

    bar(?=bar)     finds the 1st bar ("bar" which has "bar" after it)
    bar(?!bar)     finds the 2nd bar ("bar" which does not have "bar" after it)
    (?<=foo)bar    finds the 1st bar ("bar" which has "foo" before it)
    (?<!foo)bar    finds the 2nd bar ("bar" which does not have "foo" before it)

组合使用：

    (?<=foo)bar(?=bar)    finds the 1st bar ("bar" with "foo" before it and "bar" after it)

表示匹配 bar 要求前面是 foo 而后面是 bar，那么就匹配第一个 bar 了。

### Look ahead positive `(?=)`

Find expression A where expression B follows:

    A(?=B)

### Look ahead negative `(?!)`

Find expression A where expression B does not follow:

    A(?!B)

### Look behind positive `(?<=)`

Find expression A where expression B precedes:

    (?<=B)A

### Look behind negative `(?<!)`

Find expression A where expression B does not precede:

    (?<!B)A

### Atomic groups `(?>)`

An atomic group exits a group and throws away alternative patterns after the _first_ matched pattern inside the group (backtracking is disabled).

- `(?>foo|foot)s` applied to `foots` will match its 1st alternative `foo`, then fail as `s` does not immediately follow, and stop as backtracking is disabled

A non-atomic group will allow backtracking; if subsequent matching ahead fails, it will backtrack and use alternative patterns until a match for the entire expression is found or all possibilities are exhausted.

- `(foo|foot)s` applied to `foots` will:

  1. match its 1st alternative `foo`, then fail as `s` does not immediately follow in `foots`, and backtrack to its 2nd alternative;
  2. match its 2nd alternative `foot`, then succeed as `s` immediately follows in `foots`, and stop.

### 网页
匹配网页标题

    <head>([^<]+)</head>

然后取分组 1

网页图片

    <img\s+[^>]*? src=['"]?([^"'\s]+)['"]?[^>]*>

取分组 1

## 身份证
简单版本，不精确

    [1-9]\d{14}
    [1-9]\d{14}\d{2}[0-9xX]

## reference

- <https://stackoverflow.com/q/2973436/1820217>
- <https://www.regular-expressions.info/lookaround.html>
- <http://deerchao.net/tutorials/regex/regex.htm>
- http://www.regular-expressions.info/lookaround.html
- http://www.rexegg.com/regex-lookarounds.html
- https://www.regular-expressions.info/atomic.html
