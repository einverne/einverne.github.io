---
layout: post
title: "Homerow 配置 macOS 全键盘操作"
aliases:
- "Homerow 配置 macOS 全键盘操作"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, mac-app, mac-application, vim, vimium, vim-plugin]
create_time: 2025-03-21 21:03:34
last_updated: 2025-03-21 21:03:34
dg-home: false
dg-publish: false
---

今天想要和大家分享一下一款非常有趣的应用，叫做 [Homerow](https://www.homerow.app/)，他之前的名字叫做 [vimac](https://github.com/nchudleigh/vimac?tab=readme-ov-file)，是一款可以在 macOS 上实现全键盘操作的工具。

在 Chrome 里面，我一直在使用 [Vimium](https://blog.einverne.info/post/2023/10/vimium-chrome-extension.html)，这一款插件几乎是 Chrome 的必备插件，它可以让我在完全没有鼠标的情况下浏览网页。

在之前我也介绍过一款叫做 [Shortcat](https://blog.einverne.info/post/2023/05/shortcat-a-vimium-for-macos.html) 的 macOS 效率工具，也是使用类似的概念，可以在 macOS 上实现所有元素的浮标，然后使用键盘来控制。更甚至之前我还尝试过 yabai 和 [[shkd]] 的方案，但是这些方案都或多或少存在一些问题，要不是就是比较卡，要不就是配置非常繁琐。

而今天想要介绍的这一款 Homerow 非常简洁，非常用于使用。

![NmXAl5_Od6](https://pic.einverne.info/images/NmXAl5_Od6.png)

## Homerow

Homerow 是为 macOS 制作的全键盘操作工具，和 Vimium 对网页内容进行标记一样，Homerow 会对 macOS 窗口中的所有元素进行标记，这样，我们就可以使用键盘来找到我们要点击的元素，直接使用键盘就可以完成导航和点击操作。

## 为什么要使用键盘来导航呢？

这个时候有很多人可能就有疑问了？明明有鼠标，macOS 还有巨大的触摸板，为什么要使用键盘来进行鼠标移动和点击操作呢？其实，从键盘将手移动到鼠标，或者将手移动到触摸板，都是需要一定的切换成本的，而这个移动手臂的过程如果经常发生的话，一方面会严重影响到输入的效率，另外一方面可能造成手掌和手腕的过度使用，严重可能还会引发腱鞘炎等等疾病。

## 价格

在去年年中的时候作者还提供 三档不同的收费，最低 29USD 就可以，但是现在作者只提供 49.99 USD 可以解锁所有的设备。

![RXOMAyCJJc](https://pic.einverne.info/images/RXOMAyCJJc.png)

## 使用

首先需要声明一点的是，这一套操作习惯是 Vim 带来的，如果您不熟悉 Vim 相关的跳转操作，建议可以查看我博客中的[相关文章](https://blog.einverne.info/tags.html#vim)。

### 导航

默认情况下，Homerow 已经有了一个内置的快捷键 Cmd + Shift + Sp ace 可以触发应用内导航，当按下快捷键之后，Homerow 就会利用系统的 Accessibility API 去遍历当前应用中所有可以点击的控件，并且其上方利用字母进行标记。

![GGMe1UsLg_](https://pic.einverne.info/images/GGMe1UsLg_.png)

我们以对 Chrome 的操作为例，这里可以看到页面上出现了非常多的标签，此时按下 M，就会触发点击「Chrome」这一个菜单栏，点击 AG ，就会触发关闭新标签页的动作。

当前除了正常的鼠标点击，Homerow 还支持右键，双击。

比如要在 Homerow 这一个标签页上右击，可以按下 Cmd + Shift + Space ，然后按下 Shift + AC，此时就会在 AC 所在的地方右击，同样双击可以提前按住 Cmd。

![18VJOfjAWU](https://pic.einverne.info/images/18VJOfjAWU.png)

## 页面滚动

当然 Homerow 也是支持窗口内容滚动的，但是相较而言，我个人使用的频率不是很高，所以这里如果大家感兴趣可以自行去了解一下。
