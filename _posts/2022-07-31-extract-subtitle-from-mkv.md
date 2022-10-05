---
layout: post
title: "从 mkv 文件中提取字幕文件"
aliases:
- "从 mkv 文件中提取字幕文件"
tagline: ""
description: ""
category: 学习笔记
tags: [ mkv, subtitle, cli, mac, linux ]
create_time: 2022-07-31 05:38:39
last_updated: 2022-08-01 10:06:32
---

mkv 是一种容器，可以包含视频，音频流，也可以包含字幕等等文件，如果要从 mkv 文件中提取字幕，可以使用一款叫做 `mkvtoolnix` 的命令行工具。

## mkvtoolnix

macOS 下：

```
brew install mkvtoolnix
```

在 Ubuntu 下：

```
sudo apt install mkvtoolnix
```

## mkvtoolnix 使用

查看文件内容：

```
mkvmerge -i path/to/video.mkv
```

提取字幕文件：

```
mkvextract tracks path/to/video.mkv 3:file1.srt 4:file2.srt
```

假设有很多个字幕文件提取，从轨道 3 开始：

```
for file in *.mkv; do
  sub=$(echo $file | sed 's/\.mkv$/.srt/'); 
  mkvextract tracks "${file}" 3:"${sub}"; 
done
```

## ffmpeg
使用 [[FFmpeg]] 也可以提取字幕。

首先查看文件内容：

```
ffmpeg -i video.mkd
```

查看输出的内容中 `Stream #<stream number>(eng): Subtitle: subrip` 其中 `<stream number>` 就是字幕的轨道。比如 `0:2`

然后使用如下命令提取：

```
ffmpeg -i video.mkv -map <stream number> subs.srt
```

比如：

```
ffmpeg -i video.mkv -map 0:2 subs.srt
```

另外一种更复杂一些的写法可以

```
ffmpeg -i video.mkv -map 0:s:0 subtitle.srt
```

这个地方 `-map 0:s:0` 中的第一个 `0` 表示的是输入文件的序号，因为这个地方只有一个输入文件 `video.mkv` 所以就表示这个文件。


## reference

- <https://gist.github.com/pavelbinar/20a3366b54f41e355d2745c89091ec46>
