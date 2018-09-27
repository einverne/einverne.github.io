---
layout: post
title: "响应式网页编程中 HTML 标签 meta viewport"
tagline: ""
description: ""
category: 学习笔记
tags: [html, viewport, html5, css]
last_updated:
---

在看 html meta 信息的时候看到了 `<meta name="viewport" content="width=device-width">` 这样的内容，所以学习下 Viewport 概念。

viewport 是用户浏览网页时视觉区域的大小，浏览器的可见区域就大，而手机屏幕明显就小。在平板和手机还未流星之前，网页一般都是为计算机浏览器设计，这就通常让网页有一个固定的设计，和固定的宽高。

然后，当我们使用平板或者手机浏览网页时，固定大小的页面内容通常都无法适应 viewport，为了解决这个问题，这些小屏幕设备上的浏览器通常将整个页面缩放来适应屏幕大小。所以才有了 html 标签中 viewport 的概念。

## 设置 viewport
HTML5 在 `<meta>` 标签中引入了方法让网页设计师可以通过设置该 meta 来控制 viewport 。

    <meta name="viewport" content="width=device-width, initial-scale=1">

`<meta>` 标签让浏览器遵循该原则来控制页面的尺寸和缩放。

- `width=device-width` 表示让页面的宽度来适应设备的宽度
- `initial-scale=1.0` 设置了浏览器加载页面时的初始缩放大小

其他控制选项，`maximum-scale`，`minimum-scale`，`user-scalable` 用来控制用户能够缩放的大小。

`shrink-to-fit=no` 选项时 Safari 特有的，这个选项在 Safari 9.0 引入，防止 Safari 通过缩放来适应宽度。[^shrink]

[^shrink]: <https://stackoverflow.com/a/33949647/1820217>

## reference

- <https://www.w3schools.com/Css/css_rwd_viewport.asp>
