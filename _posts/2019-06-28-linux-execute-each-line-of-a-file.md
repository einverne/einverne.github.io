---
layout: post
title: "Linux 下执行文件中的每一行"
tagline: ""
description: ""
category: 经验总结
tags: [linux, bash, xargs, commands, ]
last_updated:
---

今天想要通过 adb 将盒子中的所有 apk 备份出来，很早之前写过的[文章](/post/2016/09/useful-adb-command.html) 就提到过如何手动的备份 apk 文件，不过这样很麻烦，需要每一条都手敲，所以想到了使用刚了解到的 [xargs](/post/2019/06/xargs.html) 命令，所以想通过几个命令将文件路径全部都拷贝出来，包名也拷贝出来。然后使用 xargs 来批量执行每一行命令。

通过这个拿到所有包名

    adb shell pm list packages | cut -d: -f2 | tee pkg.txt

拿到所有文件路径

    adb shell pm list packages | cut -d: -f2 | xargs -I {} adb shell pm path {} | tee path.txt

合并文件

    paste -d" " path.txt pkg.txt | tee cmd.txt

然后添加

    sed -e 's/^/adb pull /' -i cmd.txt

这样就得到了每一行都是一个 adb pull 命令的文件  cmd.txt

    bash cmd.txt | bash

就能够快速的备份所有的 apk 文件了。

当然如果你熟悉 bash 可以非常快速的写出

    for i in $(adb shell pm list packages | awk -F':' '{print $2}'); do adb pull "$(adb shell pm path $i | awk -F':' '{print $2}')"; mv base.apk $i.apk 2&> /dev/null ;done


## reference

- <https://stackoverflow.com/a/4033005/1820217>
