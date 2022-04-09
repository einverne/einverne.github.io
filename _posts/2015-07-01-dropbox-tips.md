---
layout: post
title: "Dropbox 技巧"
description: "Dropbox 技巧"
category: 产品体验
tags: [Dropbox,]
---

Dropbox 是一个云端硬盘，你可以在任何有网络的地方访问到它。它本身就足够的强大，和别人共享一个文件夹，添加到文件到该文件夹，文件就能出现在所有共享的人文件夹下。并且因为它公开的 API，它变得更加强大。

## 同步任意文件夹到 Dropbox

"如何同步任意文件夹到 Dropbox?",这个问题好多人问过我，国内有家坚果云能够实现，其实 Dropbox 完全能够同步 PC 端任意文件夹的。查看官方的 [帮助](https://www.dropbox.com/en/help/12) ：

    Right now, Dropbox will only sync the files in your Dropbox folder.

当时官方并没有直接说死，并且简单的提供了他们的解决方案：将文件移动到 Dropbox 文件夹下，在 Windows 下建立一个快捷方式(shortcut)，在 Mac OS X 下 alias，Linux 下使用 Link 来实现从 Dropbox 文件夹外访问的目的。

当然如果要实现的更加智能的话，关键词----mklink。Windows 7 以上内部支持，Windows 7 以下关键词----junction。

    D: \>mklink /?
    创建符号链接。

    MKLINK [[/D] | [/H] | [/J]] Link Target

            /D      创建目录符号链接。默认为文件
                    符号链接。
            /H      创建硬链接，而不是符号链接。
            /J      创建目录联接。
            Link    指定新的符号链接名称。
            Target  指定新链接引用的路径
                    (相对或绝对)。

例如：

    mklink /D "D: \Dropbox\DestFolder" "D: \SourceFolder"

命令的意思是创建一个在 D 盘的 SourceFolderm 目录,指向 Dropbox 下 DestFolder 目录。如果对其中任意一个文件夹里内容做修改，另一个同样会改变。junction 目录是 NTFS 文件系统的一个特性，语法类似，更多内容参考 [这里](http://lifehacker.com/5154698/sync-files-and-folders-outside-your-my-dropbox-folder) 。需要注意的是，对于Dropbox来说，只能将Target目录放在Dropbox中，而不能在Dropbox目录里创建junction目录。而mklink命令没有这样的限制，Dropbox中的目录无论是Link,还是Target，Dropbox都能同步。附加一句，Target目录是事实上占用硬盘空间的目录。

如果你不熟悉命令行，那么 GUI 也是很好的选择，有许多的工具能够实现：

- [Dropboxifier](http://dropboxifier.codeplex.com/)
- [Dropbox Folder Sync](http://satyadeepk.in/dropbox-folder-sync/)

附加：如果想知道 mklink /D 和 mklink /J 的区别，可以查看 [这里](http://superuser.com/questions/347930/what-are-the-various-link-types-in-windows-how-do-i-create-them)

哦，对了 Mac OS X 和 Linux 下使用 `ln -s` 吧。

## Dropbox 搭建静态网站或博客

你的 Dropbox 有一个公共文件夹，你在这个文件夹中添加的文件，网络上任何人都可以访问到，只要他们有一个链接指向该文件。从而可以把所有的 HTML，JAVASCRIPT，CSS 和图像文件放到这个文件夹中， 定向到你的域名，你的迷你网站就正式上线了。
另外，如果你想有一个更简单的解决方案，使用 [DropPages.com](http://DropPages.com) ， [Scriptogr.am](http://Scriptogr.am) 和 [Pancake.io](http://Pancake.io) 这样的应用，它们都可以使用Dropbox免费的发布你的简单的网站。DropPages和Pancake适合定期发布网页，而Scriptogram更适合于博客格式（按时间倒序）。国内还有一家 Farbox ，最初也是同类型的网站，后来渐渐的有了其他功能。

我自己的体验来说 Pancake 的体验最好，可以绑定域名，支持 https，支持 Jekyll，支持 git  等等，这里是我的主页 [http://pancake.einverne.info](http://pancake.einverne.info) 也可以是 [https://einverne.pancakeapps.com](https://einverne.pancakeapps.com)

更多类似 Pancake 服务请看 [alternativeto](http://alternativeto.net/software/pancake-io/) ，比较出名的还有Droppages，和国产的 [Farbox](https://www.farbox.com/) 。

## 保存网页图片到 Dropbox

Chrome 扩展 [Ballloon for Chrome](https://chrome.google.com/webstore/detail/kbmligehjhghebleanjcmenomghmcohn) ，这个并不是单纯的Dropbox应用，这个扩展支持的云端存储覆盖面还是挺广泛的，从Dropbox，OneDrive，Google Drive，到Box，以及可能在国外流行的 Copy，SugarSync等等。

## 给我发送文件 Send me file direct to Dropbox

我使用 [DropITtoMe](http://www.dropitto.me) ，你可以通过 [这个网页](http://www.dropitto.me/einverne) 向我发送文件 up to 75M，发送密码为：einverne

## 结合 IFTTT 产生更多火花

### Save all Gmail attachments to Dropbox

将 Gmail 附件添加到 Dropbox，网络上有些应用可以生成一个 Dropbox 的邮箱，发送到邮箱就能将文件存入 Dropbox，我觉得还是没有这个方便，我自己的 Gmail，我自己的账号，安全性好，并且不容易忘记。

Link: [https://ifttt.com/recipes/98759-save-all-your-gmail-attachments-to-dropbox](https://ifttt.com/recipes/98759-save-all-your-gmail-attachments-to-dropbox)

### Send to kindle if file is stored under kindle folder

只要有文件存入 kindle 文件夹，自动将文件作为附件发送到 @kindle.com 邮箱。

Link: [https://ifttt.com/recipes/17578-if-stored-in-kindle-dropbox-folder-then-send-it-to-your-kindle](https://ifttt.com/recipes/17578-if-stored-in-kindle-dropbox-folder-then-send-it-to-your-kindle)

### Save all Instagram photos to Dropbox

将 Instagram 照片保存到 Dropbox

Link: [https://ifttt.com/recipes/56-save-all-your-instagram-photos-to-dropbox](https://ifttt.com/recipes/56-save-all-your-instagram-photos-to-dropbox)

### Save all liked Instagram photos into Dropbox

将 Instagram 加心照片保存到 Dropbox

Link: [https://ifttt.com/recipes/21350-shuffle-your-liked-instagram-photos-into-a-screensaver](https://ifttt.com/recipes/21350-shuffle-your-liked-instagram-photos-into-a-screensaver)

更多 IFTTT 内容可参考另一篇 [IFTTT](/post/2015/06/ifttt.html) 文章。

## reference

参考文章：

- 最佳 Dropbox 应用 [http://www.labnol.org/internet/best-dropbox-apps/20672/](http://www.labnol.org/internet/best-dropbox-apps/20672/)
- 20 个 Dropbox 应用 [http://www.hongkiat.com/blog/dropbox-tools/](http://www.hongkiat.com/blog/dropbox-tools/)
- Dropbox 托管网站 [http://alexcican.com/post/guide-hosting-website-dropbox-github/](http://alexcican.com/post/guide-hosting-website-dropbox-github/)

最后，如果你还没有注册 Dropbox，欢迎使用我的 [邀请](https://db.tt/B0sJSIVy) ，这样你我都增加500M的永久空间。
