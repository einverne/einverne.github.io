---
layout: post
title: "Vimium 教程：使用键盘来浏览网页"
aliases:
- "Vimium 教程：使用键盘来浏览网页"
tagline: ""
description: ""
category: 经验总结
tags: [vimium, chrome, chrome-extension, vim,]
create_time: 2023-10-11 11:01:39
last_updated: 2023-10-11 11:01:39
---

[Vimium](https://github.com/philc/vimium) 是一款 Chrome 下模拟 Vim 操作的插件。很早之前我写过一篇文章讲的是 [Chrome 下如何利用快捷键来提高效率](/post/2017/12/most-useful-chrome-shortcut.html) 在那篇文章中已经提到过 Vimium，Vimium 几乎是 Chrome 下必备的插件之一了。

之前也有写过文章提到过 Vim Everythere，现在我在 [Obsidian](/post/2022/07/obsidian-vim-and-vimrc.html)，VS Code，[IntelliJ IDEA](/post/2020/12/my-idea-vimrc-config.html)，[Chrome](/post/2017/12/most-useful-chrome-shortcut.html) 中几乎都可以使用同一套语义的快捷键。

## 移动

基础移动

```
下/上/左/右移动  j/k/h/l
移动到下一个 word 第一个字母 w
移动到下一个 word 最后一个字母 e
移动到上一个 word 第一个字母 b
移动到行首第一个字符 0
移动到行首第一个非空白字符 ^
移动到行尾最后一个字符 $
```

页面内移动

```
向下/上移动半页  d/u
回到顶/尾部  gg/G
```

浏览历史

```
后退 H
前进 L
```

切换标签页

```
切换左/右标签 J/K
切换左/右标签 gT/gt
切换到第一个 Tab  g0
切换到最后一个 Tab  g$
上一个标签页  ^
新建一个 Tab  t
查看标签页列表  T
关闭/恢复标签 x/X
固定标签栏 <a-p>即 alt+p
```

```
新标签中打开多个链接   <a-f> 即：alt+f
开/关静音  <a-m>即：alt+m
```

URL 跳转

```
跳转到当前 URL 上一级/最高级 gu/gU
编辑当前地址栏 g+e/E   并在当前/新窗口中打开
跳转到当前文本框，将光标放在页面中的第一个输入框    gi
 (2gi就是第二个输入框)
```

标记

```
ma      当页标记，只能在当前tab页面跳转，m + 一个小写字母
mA      全局标记，可以再切换到其他tab的跳转过来，m + 一个大写字母
`a      跳转到当页标记
`A      跳转到全局标记
``      跳回之前的位置
```

其他常用操作

```
窗口打开模式 本窗口/新窗口 f/F
查找书签       b/B（当前/新窗口打开）
查找历史记录+书签   o
刷新 r
搜索剪贴板关键字 在当前/新窗口  p/P
将标签页移动到新窗口  W
```

## 搜索

```
查找 /
    然后使用 n/N 向下/上查找结果  n/N  (回车后直接打开链接，不用再使用f/F定位)
复制当前链接 yy
新模式 i
查看源码 gs
```

其他

```
查看所有快捷键 ?
复制当前标签页  yt
从页面中选择一个链接复制到粘贴板 yf
移动当前标签到左/右侧边  <</>>
滚动到页面最左/右边（在有滚动条下才有效果） zH/zL
插入模式  i（可以屏蔽掉vimium快捷键，使其不和网页默认快捷键冲突）
创建新标记（可创建多个  m 使用方法
      设置当前/全局滚动条位置   m+小/大写字母
      跳转到设置的滚动位置   ~+字母
```

## 复制模式

可以通过在普通模式下输入 `v` 来进入复制模式。

```
切换到复制模式 v
```

在复制模式下，就可以不用通过鼠标，而通过快捷键来选择页面中的内容。通过上面提到的鼠标移动方法，来选择需要复制的内容，然后 Cmd+C。

## 自定义映射

可以在自定义按键中设定键盘快捷键映射。

- `map key command` 将命令映射到 Vimium 中，覆盖 Chrome 默认值
- `unmap key` 取消一个命令，并重新载入 Chrome 默认
- `unmapAll` 取消所有命令绑定，尝试删除 Vimium 的所有命令

举例

```
map <c-d> scrollPageDown     设置 Ctrl+d 按键来向下滚动页面
map r reload     设置 r 为 reload 快捷键
unmap <c-d> 取消 c-d 的设置
```

## 自定义搜索

Vimium 引入了一个 Vomnibar 的概念，通过 `o` 来引入。

可以在 Vimium 的设置中，自定义搜索引擎的格式。

```
a: http://www.amazon.co.jp/s/?field-keywords=%s Amazon
d: https://duckduckgo.com/?q=%s DuckDuckGo
g: https://www.google.com/search?q=%s Google
y: https://www.youtube.com/results?search_query=%s YouTube
gm: https://www.google.com/maps?q=%s Google Maps
b: https://www.bing.com/search?q=%s Bing
bd: http://www.baidu.com/s?wd=%s Baidu
bl: http://www.bilibili.tv/search?keyword=%s Bilibili
w: https://www.wikipedia.org/w/index.php?title=Special:Search&search=%s Wikipedia
zh:https://www.zhihu.com/search?type=content&q=%s Zhihu
icb: http://www.iciba.com/%s
yd: http://dict.youdao.com/search?q=%us
gs: http://scholar.google.com.hk/scholar?q=%us&hl=zh-CN
gt: https://github.com/search?q=%s
tw: https://twitter.com/search?q=%s
```

更多的搜索引擎定义可以参考[这里](https://github.com/philc/vimium/wiki/Search-Engines)

当完成上述设置之后，就可以在页面中按下 `o` 按键，进入搜索模式，输入缩写和搜索内容进行快速搜索。

比如，先按下 o 然后在弹出的输入框中输入 `y vimium`，就表示用 YouTube 搜索关键字 vimium。

## related

- <https://github.com/brookhong/Surfingkeys>

## reference

- <https://github.com/philc/vimium/wiki>
