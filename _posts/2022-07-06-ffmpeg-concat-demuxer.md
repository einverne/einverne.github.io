---
layout: post
title: "FFmpeg 使用指南之 concat demuxer 串联多个文件"
aliases:
- "FFmpeg 使用指南之 concat demuxer 串联多个文件"
tagline: ""
description: ""
category: 学习笔记
tags: [ ffmpeg, linux, video, encoder, ffmpeg-concat, ]
create_time: 2022-07-06 10:21:01
last_updated: 2022-07-28 01:11:58
---

FFmpeg 可以使用 `-i` 参数来输入一个或多个文件，但有些时候会有一些将多个文件串联成一个文件的需求。比如将多个视频合并成一个视频文件，将多个音频文件合并和一个长音频文件。这个时候就需要使用到 FFmpeg 的 `concat demuxer`。

`concat demuxer` 是 FFmpeg 1.1 引入的。主要可以用来合并多个媒体文件。

## 串联多个相同编码的文件
FFmpeg 有两种方式可以串联相同的文件：

- the concat "demuxer"
- the concat "protocol"

`demuxer` 更加灵活，需要相同的编码，容器格式可以不一样。而 `protocol` 则需要容器的格式也一致。

### Concat demuxer
`demuxer` 通过从一个固定格式的文件中读取文件列表，然后 FFmpeg 可以对这些文件一同处理。

创建文件 `mylist.txt`，包含所有想要串联的文件：

```
# this is a comment
file '/path/to/file1.wav'
file '/path/to/file2.wav'
file '/path/to/file3.wav'
```

注意，这里的 `#` 是注释语句。文件中的文件路径可以是绝对的或相对的路径，然后就可以使用 FFmpeg 对这多个文件 [stream-copy](https://ffmpeg.org/ffmpeg.html#Stream-copy) 或者 re-encode(重新编码) ：

```
ffmpeg -f concat -safe 0 -i mylist.txt -c copy output.wav
```

如果路径是相对的，这里的 `-safe 0` 可以省略。

如果有多个文件要添加到 `mylist.txt` 文件中，可以使用  Bash 脚本批量生成：

```
# with a bash for loop
for f in *.wav; do echo "file '$f'" >> mylist.txt; done
# or with printf
printf "file '%s'\n" *.wav > mylist.txt
```

### Concat protocol
`demuxer` 在文件流级别工作，`concat protocol` 在文件级别工作。特定的文件（比如 MPEG-2 传输流，或者其他）可以串联起来。

下面的命令将三个 MPEG-2  TS 文件串联到一起，不重编码：

```
ffmpeg -i "concat:input1.ts|input2.ts|input3.ts" -c copy output.ts
```

## 串联不同编码的文件
某些情况下，多个文件可能使用不同的编码，那么上面的命令就都无法使用。

### Concat filter

如果要让 concat filter 工作，输入的文件必须拥有相同的 frame dimensions (eg. 1920*1080 pixels) 并且要有相同的 framerate。

假设有三个文件需要串联起来，每一个文件都有一个视频流和一个音频流：

```
ffmpeg -i input1.mp4 -i input2.webm -i input3.mov \
-filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0]concat=n=3:v=1:a=1[outv][outa]" \
-map "[outv]" -map "[outa]" output.mkv
```

来拆解一下命令，首先指定所有的输入文件，然后实例化一个 `-filter_complex` filtergraph

然后：

```
[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0]
```

告诉 ffmpeg 使用输入文件中的哪一个流，然后发送给 concat filter。在这个例子中，第一个文件的视频流 0 `[0: v:0]` 和音频流 0 `[0: a:0]` ，第二个文件的视频流 0 `[1: v:0]` 和音频流 0 `[1: a:0]`。

```
concat=n=3:v=1:a=1[outv][outa]
```

这个就是 concat fitler， `n=3` 告诉 filter 这里有三个输入分段，`v=1` 则表明每一个分段有一个视频流，`a=1` 表明每一个分段有一个音频流。filter 然后将这些分段连接产生两个输出流， `[outv]` 和 `[outa]` 两个输出流的名字。

注意的是两侧的双引号是必须的。

然后使用这些输出流，将他们 [组合成输出文件](http://trac.ffmpeg.org/wiki/Map) ：

```
-map "[outv]" -map "[outa]" output.mkv
```

这行告诉 FFmpeg 使用 concat filter 的结果，而不是直接使用输入的 streams。

有一个叫做 [mmcat](http://trac.ffmpeg.org/wiki/mmcat) 的 Bash script，可以在老版本的 FFmpeg 中实现 concat filter。

## reference

- <http://trac.ffmpeg.org/wiki/Concatenate>
- <https://ffmpeg.org/ffmpeg-formats.html#concat>
