---
layout: post
title: "清空Chrome缓存的301重定向"
tagline: ""
description: ""
category: 经验总结
tags: [chrome, linux, redirect, browser, devtools]
last_updated: 
---

可能是之前测试短域名生成[服务](/post/2018/04/yourls.html)的时候，添加了 `http://localhost:8080` 的跳转，导致了此后所有对该地址的访问都被重定向到了另一个网址，即使我在 8080 端口的服务已经停止，并且已经更换了其他测试的服务，Chrome 依然缓存了 301 重定向。

而由因为跳转的时间非常快，所以我无法使用以前经常使用的 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> 来强行刷新页面清除缓存。所以只能求助 Google，幸而操作并不复杂，不过让我学到了一些 Chrome 的小 tips，因此记录下来。

## 强制刷新
之前提到的 Ctrl + Shift + R 就能够强制刷新，但其实还有一种UI上面的操作，如果打开 DevTools 的情况下，点击刷新按钮，并长按，会弹出如下的菜单，选择 `Empty Cache and Hard Reload` 即可。

![hard reload](https://i.stack.imgur.com/bx0D7.png)

针对我的情况，直接打开 `http://localhost` 然后强行刷新即可。

## 开启 Devtools 中的停止缓存

开启 Developer Tools，一般的快捷键是 Ctrl + Shift + I ，如果从菜单上开启是Chrome的点点点 -> 工具 -> 开发者工具；或者任意的页面点击 Inspect 审查当前页面，就能打开。

然后再打开的开发者调试工具集中，打开 Settings，快捷键 F1，在工具集的右上角，点点点-> Settings。

在 Perferences -> Network 标签下 有一个 `Disable Cache(while Devtools is open)` ，选中即可。

## 最暴力清除数据
当然最暴力的就是清除数据了，不建议这么做。

## reference

- https://superuser.com/a/869739/298782
