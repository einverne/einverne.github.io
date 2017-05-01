---
layout: post
title: "获取在线视频的时长"
tagline: ""
description: ""
category: 经验总结
tags: [ffmpeg, ffprobe, ]
last_updated: 
---

这是清理记事本的文章，解决一个问题之后，将之前整理的内容，整理发布。清空 WizNote 计划。

## 问题

手上有一些视频链接的 URL，如何快速的得到这些视频的时长信息？


## 答案

经过一番调研，发现使用 ffprobe (和 ffmpeg 套件一起) 可以完美解决这个事情。将命令 `-i` 参数后面的地址改成线上URL 地址即可。


	ffprobe -i https://cldup.com/po79gkocrO.mp4 -show_entries format=duration -v quiet -of csv="p=0"

也可以将此代码保存为 `get_video_duration.sh` 来使用 `./get_video_duration.sh URL` 这样的方式来跑。

	ffprobe -i $1 -show_entries format=duration -v quiet -of csv="p=0"

具体 bash script, 文件中每一行中，前面为 视频ID，空格，再是视频连接，使用下面脚本，将视频时长保存到 `duration.txt` 文件中。

    set -o nounset                              # Treat unset variables as an error
    while IFS='' read -r line || [[ -n "$line" ]]; do
        lineArray=($line)
        echo ${lineArray[0]}
        duration=$(ffprobe -i ${lineArray[1]} -show_entries format=duration -v quiet -of csv="p=0")
        echo $duration
        echo "${lineArray[0]} ${duration}" >> duration.txt
    done < "$1"

## 扩展

如果视频文件在本地的话，可能会方便很多， ffmpeg, ffprobe 都能够胜任。

	ffmpeg -i input.mp4 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,//
	# 或者
	ffprobe -show_format input.mp4 | sed -n '/duration/s/.*=//p'


## reference

- <https://superuser.com/questions/361329/how-to-get-length-of-video-file-from-console>