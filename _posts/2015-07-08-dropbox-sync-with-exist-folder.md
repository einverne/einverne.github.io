---
layout: post
title: "Dropbox同步已存在的文件夹"
description: "How to sync with exist Dropbox folder 如何同步已存在的Dropbox文件夹"
category: 经验总结
tags: [Dropbox]
---

重装系统，或者在一台新电脑上重装 Dropbox 之后，如果不想 Dropbox 下载一遍所有的文件，可以使用以下的方法，让 Dropbox 同步已经存在的 Dropbox 文件夹。保证自己本地已经有一份 Dropbox 文件夹拷贝。然后执行以下操作：

>1. 假设已经存在的 Dropbox 文件夹在 `E:\Dropbox` 
>2. 安装 Dropbox 
>3. 安装完成之后，登陆，在某一界面会显示高级选项，点击高级
>4. 进入高级界面之后，可以选择将 Dropbox 放到硬盘的位置，设置自己本地的目录
>5. 因为我本地已经有了一份 Dropbox 备份，所以将 Dropbox 设置中的位置选到 `E:\`
>6. 因为本地已经有 Dropbox 目录，所以程序会告诉你本地已经有一份，你是否想要合并----"There is already a folder here called Dropbox. Do you want to merge all the existing files in that folder into your Dropbox?"，选择是，即可
>7. 之后 Dropbox 就会自己比较文件差异，然后就很快的将整个文件夹同步了

解决方案来自：[http://forums.dropbox.com/topic.php?id=29612](http://forums.dropbox.com/topic.php?id=29612)

附英文版：

Just copy from your existing Dropbox folder to Dropbox folder on new machine, and do the followting step:

>1. Put the existing Dropbox folder in /home/Me/, so it will be /home/Me/Dropbox
>2. Install Dropbox and do all things it requires you to do
>3. After installation, at some point, you will be asked to choose setup type. Here you will choose “Advanced”, and “Next”
>4. Now you want to specify where to put your Dropbox folder, so tick “I want to choose where to put my Dropbox”.
>5. Since I have my existing Dropbox folder at /home/Me/Dropbox, so I change the folder to ” /home/Me/”.
>6. Since you have the Dropbox folder already in the directory, the program would say “There is already a folder here called Dropbox. Do you want to merge all the existing files in that folder into your Dropbox?”. Here we click OK, and Next.
>7. In the extended attributes, we tick “Yes, enable synching for extended file attributes (may require root password)”
>8. Next, choose whatever you want. For me I choose to synch all files inthe Dropbox folder.

来源: [1](https://kittipatkampa.wordpress.com/2012/01/13/how-to-synch-with-existing-dropbox-folder/)
