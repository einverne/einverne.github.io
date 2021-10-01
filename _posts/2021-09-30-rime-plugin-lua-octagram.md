---
layout: post
title: "推荐几个 Rime 插件"
aliases: 
- 推荐几个 Rime 插件
tagline: ""
description: ""
category: 经验总结
tags: [ rime, librime, librime-lua, input-method, squirrel, macos ]
last_updated:
---

切换到 Rime 输入法也好多年了，陆陆续续积累了不少的配置和词库，不过最近看到有朋友在 GitHub 上 star 了一个 Rime 的配置，点进去了一下，让我眼前一亮的是 Rime 通过插件的方式实现了一些非常不错的特性，虽然之前也陆陆续续的配置过 lua 扩展，但是这次看到还能让 Rime 加载预先训练的统计语言模型，所以就再次激起了我的兴趣。

之前的几篇文章，如果感兴趣也可以去看看：

- [Linux 和 macOS 下配置 Rime](/post/2014/11/rime.html)
- [利用 imewlconverter 制作 Rime 词库](/post/2019/08/make-rime-dict.html)
- [配置 Rime 输入法输入韩语](/post/2019/08/rime-korean-japanese-input-method.html)
- [配置 Rime 在 Vim 下退出编辑模式时自动切换成英文输入法](/post/2020/11/rime-auto-switch-language-in-vim-mode.html)
- [手工编译安装 macOS 下的 Rime（鼠须管）](/post/2021/07/manully-build-rime-squirrel-for-mac.html)

接下来就整理一下目前我用到的三个 Rime 插件。

## librime-lua
`librime-lua` 是我发现的第一个插件，之前看到有人提的一个 Feature Request 说到，能不能通过输入 date 或 「rq」这样的短语自动在候选词中出现当前的日期，后来发现果然可以。`librime-lua` 就是用来实现这样的功能的。

librime-lua 通过 Lua 扩展了 Rime 的能力，使得用户可以编写一定的 Lua 脚本来更改 Rime 候选词的结果。最常见的使用方式，比如当输入 date 的时候，在候选词中直接显示出当前的日期。

插件地址：<https://github.com/hchunhui/librime-lua>

![](/assets/rime-lua-date-20210930201359.png)

## 安装 librime-octagram 插件
librime-octagram 可以让 Rime 使用训练好的[统计语言模型](https://github.com/lotem/rime-octagram-data-s1)。

插件地址： <https://github.com/lotem/librime-octagram>

安装过程也比较简单，把插件以及模型放到 Rime 的配置文件夹中，然后在输入法配置方案，比如小鹤双拼 `double_pinyin_flypy.custom.yaml` 中加入：

```
patch:
  __include: grammar:/hant
```

如果之前有别的 patch，直接加入 `__include` 那一行即可。然后重新部署 Rime 输入法。

可以通过如下的方式验证是否安装成功，直接一次性输入下面的句子：

- 各個國家有各個國家的國歌  
- 充滿希望的跋涉比到達目的地更能給人樂趣

![](/assets/rime-squirrel-20211001090405.png)

## BlindingDark/rime-lua-select-character
这一个以词定字的插件是在这一次再学习的过程中发现的，在某些特定的时候，往往是通过组词去输入某个单字的，因为汉语中同音字还是很多的，如果只用拼音输入一个字的话可能会需要翻页很多次才能找到对的那个字，但是如果这个字出现在词语里面可能可以一次性命中，这个插件就是为了解决这个问题的。

以词定字插件可以让你在输入一个词组后，选取这个词组的开头或结尾的一个字直接上屏，比如想要打“嫉”这个字，可以先打“嫉妒”再按 `[` 键选择第一个字，如果要输入词语的第二个字，可以在词语出现之后按下 `]`。

插件地址：<https://github.com/BlindingDark/rime-lua-select-character>

在这个模式下，当候选词出现在第二个的时候，我就使用 `Tab` 来将候选词位置挪到第二位，然后使用 `[` 或 `]` 选择。不过默认情况下 Tab 绑定的快捷键是翻页： 

```
        - {accept: Tab, send: Page_Down, when: composing}
```

所以需要在 `default.custom.yaml` 中做一下调整：

```
patch:
  key_binder:
    bindings:
      - {accept: "Control+p", send: Up, when: composing}
      - {accept: "Control+n", send: Down, when: composing}
      - {accept: "Control+b", send: Left, when: composing}
      - {accept: "Control+f", send: Right, when: composing}
      - {accept: "Control+a", send: Home, when: composing}
      - {accept: "Control+e", send: End, when: composing}
      - {accept: "Control+d", send: Delete, when: composing}
      - {accept: "Control+k", send: "Shift+Delete", when: composing}
      - {accept: "Control+h", send: BackSpace, when: composing}
      - {accept: "Control+g", send: Escape, when: composing}
      - {accept: "Control+bracketleft", send: Escape, when: composing}
      - {accept: "Alt+v", send: Page_Up, when: composing}
      - {accept: "Control+v", send: Page_Down, when: composing}
      - {accept: ISO_Left_Tab, send: Page_Up, when: composing}
      - {accept: "Shift+Tab", send: Page_Up, when: composing}
      - {accept: Tab, send: Page_Down, when: composing}
      - {accept: Tab, send: Right, when: has_menu}
      - {accept: minus, send: Page_Up, when: has_menu}
      - {accept: equal, send: Page_Down, when: has_menu}
      - {accept: comma, send: Page_Up, when: paging}
      - {accept: period, send: Page_Down, when: has_menu}
      - {accept: "Control+Shift+1", select: .next, when: always}
      - {accept: "Control+Shift+2", toggle: ascii_mode, when: always}
      - {accept: "Control+Shift+4", toggle: simplification, when: always}
      - {accept: "Control+Shift+5", toggle: extended_charset, when: always}
      - {accept: "Control+Shift+exclam", select: .next, when: always}
      - {accept: "Control+Shift+at", toggle: ascii_mode, when: always}
      - {accept: "Control+Shift+numbersign", toggle: full_shape, when: always}
      - {accept: "Control+Shift+dollar", toggle: simplification, when: always}
      - {accept: "Control+Shift+percent", toggle: extended_charset, when: always}
      - {accept: "Control+period", toggle: ascii_punct, when: always}
```

注意其中的 

```
      - {accept: Tab, send: Right, when: has_menu}
```

这样就可以使用 Tab 来切换候选词了。更多的快捷键自定义可以查看[这篇文章](/post/2021/10/rime-shortcut.html)。

## 总结

使用这些插件请保证：

- 鼠须管在 0.12.0 及以上版本
- Linux 需根据需要自行编译安装 librime
- Windows 没有在用，管不了了