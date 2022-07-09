---
layout: post
title: "最有用的 Chrome 快捷键提高数倍效率"
aliases: "最有用的 Chrome 快捷键提高数倍效率"
tagline: ""
description: ""
category: 经验总结
tags: [chrome, shortcut, efficiency, ]
last_updated:
---

本文总结一下我常使用的 Chrome 默认快捷键，Chrome 默认的快捷键已经非常全面，几乎可以不用鼠标操作浏览器的一切行为，我总以为使用不管是使用鼠标还是手势来进行网页浏览是非常耗时的一件事情，如果能够像 Vim 的哲学一样，不用离开键盘来浏览网页，不仅提高的是效率，也能够培养起，不再做内容的消费者，而是做内容的产生者这样的意识。

首先需要申明一下的是这些都是在 Linux 环境下，Mac 系统及 Windows 系统可能略微有差别，具体请查阅 Google 官方的 [Help](https://support.google.com/chrome/answer/157179?hl=en)

下面是 Chrome 自身的一些常用默认快捷键

MacOS 快捷键 |    Linux 快捷键       | 作用
-------------|-----------------------|--------------
Cmd + `[`  |  Alt + Left    | back current page
Cmd + `]`  |  Alt + Right  | Forward current page
Cmd + y  |  Ctrl + h | 在新标签页打开历史记录
Cmd + Shift + j  |  Ctrl + j | 在新标签页打开下载记录
  |  Ctrl + k | 将光标定位到 Omnibox ，也就是 Chrome 自定搜索
Cmd + l  |  **Ctrl + l** | 将光标快速定位到地址栏，可以输入地址，或者直接进行 Google 搜索
Cmd + t  |  **Ctrl + t** | 新标签页
Cmd + d  |  Ctrl + d | 收藏当前页面
Cmd + Shift + t  |  **Ctrl + Shift + t** | 重新打开关闭的标签页
Cmd + w  |  **Ctrl + w** | 快速关闭当前标签页
Cmd + p  |  Ctrl + p | 打印 或者 保存为 PDF
Cmd + n  |  Ctrl + n | 新开浏览器窗口
Cmd + Shift + n  |  **Ctrl + Shift + n** | 新开隐身窗口
Cmd + r  |  Ctrl + r 或者 F5  | 刷新
Cmd + Option + u  |  Ctrl + u | 查看源码
  |  **Ctrl + Shift + i** | 审查元素
  |  Ctrl + Shift + j | 开发者工具
  |  Ctrl + Tab | 切换到下一个打开的标签页
  |  Ctrl + Shift + Tab | 切换到上一个打开的标签页
  |  Ctrl + 单击 | 在新标签页打开
Cmd + 1/2/3/4  |  Ctrl/Alt + 1/2/3/4 | 快速切换标签页
Cmd + f | Ctrl + f | 页面内搜索

以上就是最最常用的到的一些快捷键，容易忽略的我使用加粗显示了。

## Google 隐藏的快捷方式
我们都知道 Google 的地址栏其实非常强大，Google 把它叫做 [Omnibox](https://www.chromium.org/user-experience/omnibox)，不仅可以预测下一个输入，也能够使用之前的记录保存多个搜索引擎。比如我经常使用的一种方式是输入 book.douban.com 然后因为豆瓣图书已经是 Chrome 认为的一个搜索引擎，所以再输入完毕之后 Tab，此时会进入搜索，然后输入图书的名字，回车，就会直接在豆瓣图书中搜索该图书。

对于默认使用 Google 作为地址栏的搜索引擎，那么直接输入回车就会在 Google 进行搜索。默认情况下只要访问过的网站提供搜索功能 Chrome 会自动记录这些网站到 search engines 中，可以在 `chrome://settings/searchEngines` 查看到。我们都知道 Chrome 中默认的 Google 搜索通常都带一系列的参数，默认情况下这些参数都不大必要，所以我会定义我自己的搜索 query，新增一个搜索引擎，其中的三个输入框分别填入

    MyGoogle
    google.com__
    https://www.google.com/search?q=%s

然后在设置 MyGoogle 作为默认搜索引擎即可。使用同样的方法可以添加自己的专属搜索引擎，比如搜索 Gmail，Google Drive 等等。

然而 Omnibox 其实不仅能够提供 Tab Search 功能，它远比用户想象的要强大的多，甚至可以把它想象成 Google 的搜索栏。这里举一些例子

- **数学计算**，Omnibox 输入之后直接会有结果
- **查询天气**，输入 Weather Beijing 不用回车会直接显示结果
- **查字典**, 输入 define + word 会直接显示词典结果
- **翻译**, 输入 translate + word or phrase
- **汇率转换** currency dollar to rmb


### 拖拽搜索
一个很常见的场景就是在网页浏览中看到一个新的词，想要搜索这个词，有很多方法可以实现，右击搜索也行，复制粘贴到新页面回车也好，不过最简单的方式就是直接选中然后拉到 Tab 位置。这时 Chrome 会使用默认的搜索引擎在新标签页中进行搜索。

### 长按返回键浏览当前页面历史
在网页中我们可能经常在一个又一个链接中迷失方向，这个时候不用担心，Chrome 记录了每一个浏览过的页面，长按返回键，可以看到一长串的浏览记录，点击其中的一个能看到 Chrome 非常快速的加载了，甚至断网也能够加载，因为 Chrome 已经缓存了访问过的页面。

### 几个非常常见的 internal URLs
Chrome 自带一些内部页面，这些页面有些非常常见的用来配置，管理插件，查看历史等等作用的，但更多的是开启一些真正测试功能的，一些 Chrome 内部的数据也能够看到，比如 Omnibox 中根据预测出现的地址等等。我们可以通过 `chrome://chrome-urls/` 这个页面来查看所有 Chrome 自带的内部地址。

- chrome://help
- chrome://extensions
- chrome://history
- chrome://bookmarks/
- chrome://omnibox/
- chrome://chrome-urls/
- chrome://predictors

## 插件的快捷键

### Vimium
在 Chrome 中使用 Vim 下的快捷键，现在市场上也有不少的在 Chrome 下使用 Vim 快捷键的插件了，但 Vimium 已经用了很多年，没有遇到太大的问题。

下载地址：<https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb>

使用 `shift + /` 查看所有快捷键，绝大部分都是 Vim 的快捷键，不在赘述。

页面内跳转

快捷键  | 作用
----------|--------------
j | 向下
k | 向上滚动
d | 向下翻页
u | 向上翻页
f | 显示快捷键导航
F | 新标签页打开此链接
**H** | 回退
**L** | Forward
b | 弹出 vomnibar 来打开收藏夹中的网址
**B** | 弹出 vomnibar，但在新标签页打开选中的网址
o | 打开搜索工具栏，在收藏夹，历史记录中搜索，如果没有匹配则直接使用默认的搜索引擎搜索，1.66 版本后 o 可搜索打开的标签页
**O** | 功能和 o 一致，区别为在新标签页中显示搜索结果
r  | 刷新
**yy** | 复制当前页地址
gi | 将光标放到第一个输入框中，在 Google 搜索结果页面非常有用
gg | 顶部
G  | 导航到页面底部

标签页

快捷键  | 作用
----------|--------------
J 或 gT   | 左边的标签页
K 或 gt   | 右边的标签页
**t**   | 创建新标签页
**x**   | 关闭当前的标签页
**X**   | 恢复刚刚关闭的标签页
g0  | 跳转到第一个标签页
g$  | 跳转到最后一个标签页



## 其他有用快捷键

快捷键 | 作用
----------|--------------
`Ctrl + Shift + W` | 关闭当前浏览器窗口

## 外延
虽然写了这么多 Chrome 常用的快捷键，但如果使用鼠标，还有一个非常常用的，那就是鼠标中键点击关闭标签页。
