---
layout: post
title: "每天学习一个命令：ffprobe 查看多媒体信息"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, ffmpeg, ffplay, ffprobe, command, ]
last_updated:
---

在 ffmpeg package 中有一个 ffprobe 工具，主要用来查看多媒体文件或者流媒体信息，在线的视频信息也能够快速获取。大部分情况下个人比较喜欢使用 `ffmpeg -i input.mp4` 来快速查看，这种时候在终端上比较快速，而如果有些时候想要分析一下媒体文件，需要编程获取得到的媒体文件结果，显然 ffmpeg 的输出结果简直无法忍受，而 ffprobe 提供非常清晰的输出格式，非常方便的可以提供给编程软件解析使用。

官网说明：http://ffmpeg.org/ffprobe.html

## 命令格式

    ffprobe [OPTION] file

常用的参数

    -show_format            显示输入多媒体流的容器格式信息
    -show_streams           显示输入多媒体流中每一个流的信息
    -i input_file           指定输入文件
    -print_format json      json 形式输出
    -of 或者 -print_format  default/compact/csv/flat/ini/json/xml

命令行：

    ./ffprobe -print_format json -show_format -show_streams -i ./video/c.ts

其中：  

    -print_format json 以 json 格式输出 ， 
    -show_format 输出封装格式信息 ，
    -show_streams 输出流信息，
    -i ./video/c.ts 输入文件

## 使用实例

### 基本用法

    ffprobe -v error -show_format -show_streams input.mp4

输出该视频的基本信息，如果上面的命令输出结果过多，而只想要比如 size 可以

    ffprobe -v error -show_entries format=size -of default=noprint_wrappers=1 input.mp4

如果只想要结果可以

    ffprobe -v error -show_entries format=size -of default=noprint_wrappers=1:nokey=1 input.mp4

上面的命令中：

- `-v` 参数是日志输出级别
- `error` 则略去了 build 和 generic 信息，暴露 error 错误
- `-print_format` 则是输出结果格式

### 获取视频时长

    ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4

直接输出视频时长。

下面是一段 shell 脚本，之前遇到过有一批视频地址，想要获取这批视频的市场，用 ffprobe 就能够完成。

    while IFS='' read -r line || [[ -n "$line" ]]; do
        lineArray=($line)
        echo ${lineArray[0]}
        duration=$(ffprobe -i ${lineArray[1]} -show_entries format=duration -v quiet -of csv="p=0")
        echo $duration
        echo "${lineArray[0]} ${duration}" >> duration.txt
    done < "$1"


### 以 json 格式输出

    ffprobe -show_streams -show_entries format=bit_rate,filename,start_time:stream=duration,width,height,display_aspect_ratio,r_frame_rate,bit_rate -of json -v quiet -i 98a74a06741a091b8a42aaa31b4edc66.mp4

输出：

    {
        "programs": [

        ],
        "streams": [
            {
                "width": 720,
                "height": 1280,
                "display_aspect_ratio": "0:1",
                "r_frame_rate": "30/1",
                "duration": "40.833333",
                "bit_rate": "1710937",
                "disposition": {
                    "default": 1,
                    "dub": 0,
                    "original": 0,
                    "comment": 0,
                    "lyrics": 0,
                    "karaoke": 0,
                    "forced": 0,
                    "hearing_impaired": 0,
                    "visual_impaired": 0,
                    "clean_effects": 0,
                    "attached_pic": 0
                },
                "tags": {
                    "language": "und",
                    "handler_name": "VideoHandler"
                }
            },
            {
                "r_frame_rate": "0/0",
                "duration": "40.890431",
                "bit_rate": "128102",
                "disposition": {
                    "default": 1,
                    "dub": 0,
                    "original": 0,
                    "comment": 0,
                    "lyrics": 0,
                    "karaoke": 0,
                    "forced": 0,
                    "hearing_impaired": 0,
                    "visual_impaired": 0,
                    "clean_effects": 0,
                    "attached_pic": 0
                },
                "tags": {
                    "language": "und",
                    "handler_name": "SoundHandler"
                }
            }
        ],
        "format": {
            "filename": "98a74a06741a091b8a42aaa31b4edc66.mp4",
            "start_time": "-0.046440",
            "bit_rate": "1065995"
        }
    }


## 外延

mediainfo 也是一个用来获取音频视频信息的工具，比如封装格式、音视频编码格式、码率等信息。

mediainfo 可以获取的信息包括

- General: title, author, director, album, track number, date,
duration...
- Video: codec, aspect, fps, bitrate...
- Audio: codec, sample rate, channels, language, bitrate...
- Text: language of subtitle
- Chapters: number of chapters, list of chapters

mediainfo 支持的格式

- Video: MKV, OGM, AVI, DivX, WMV, QuickTime, Real, MPEG-1, MPEG-2,
MPEG-4, DVD (VOB)...
- Video Codecs: DivX, XviD, MSMPEG4, ASP, H.264, AVC...
- Audio: OGG, MP3, WAV, RA, AC3, DTS, AAC, M4A, AU, AIFF...
- Subtitles: SRT, SSA, ASS, SAMI...

mediainfo 输出的字段不容易被解析，表述方法不统一。例如，对于 h264 这种编码格式，mediainfo 可能输出的表述为 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10；还比如，对于 mp3 这样的音频格式，居然会分两个字段进行描述，分别说明 mpeg 和 layer3.


## reference

- <https://ffmpeg.org/ffprobe.html>
- <https://trac.ffmpeg.org/wiki/FFprobeTips>


