---
layout: post
title: "phpMyAdmin 登录无反应问题记录"
aliases: "phpMyAdmin 登录无反应问题记录"
tagline: ""
description: ""
category: 经验总结
tags: [php, phpmyadmin, mysql, root, password, browser, ]
last_updated:
---

今天遇到一个神奇的错误，登录 phpMyAdmin 无论如何都登录不进去，开始还以为密码记错了，但是再输入错误密码时，会显示错误的提示

    #1045 - Access denied for user 'root'@'localhost' (using password: YES)

而在在我确认密码没有问题时，phpMyAdmin 的表现就像是登录成功过了，但是却没有跳转。

然后为了解决这个问题，修改过 `php.ini` 中的 `session.save_path` ，修改了 session 文件的 权限 `chmod 777 /path/to/session` ，重启了 apache，尝试了所有的可能，直到看到一个解决方法是，因为浏览器的问题，换别的浏览器就能登录，我果断用 Vivaldi 试了一下，果然可以。

于是这个奇怪的问题就解决了，然后我清理了一下 Chrome 的 Cookie ，Session 然后就好了。至于是 phpMyAdmin 的问题还是 Chrome 的问题我也就无从得知了。奇怪了。
