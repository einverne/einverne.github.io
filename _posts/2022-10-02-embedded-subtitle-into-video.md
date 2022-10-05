---
layout: post
title: "将字幕压制到视频中"
aliases:
- "将字幕压制到视频中"
tagline: ""
description: ""
category: 经验总结
tags: [ subtitle, video, mp4, fansub,  ]
create_time: 2022-10-02 19:15:09
last_updated: 2022-10-02 19:15:09
---

本文总结一下将字幕文件压制到视频中的方式，（当然我个人是非常不喜欢直接将字幕压制到视频流中作为硬字幕压制的，但有些时候可能就是需要分享这样硬字幕的视频，比如视频网站，所以也会在下文总结一下）。

按照压制方式可以分成，将字幕嵌入视频流（也就是俗称的硬字幕）适合在视频网站分享，将字幕作为单独的字幕流和视频作为封装格式，需要用播放器播放。

压制方式（推荐程度从上到下）：

- [[FFmpeg]] 适合熟悉命令行工具的人
- [[HandBrake]] 开源的全平台的视频编码工具（推荐）
- [[MKVToolNix]] 将字幕文件添加到视频中，但是作为软字幕，不改变视频流（推荐！）
- [[MeGUI]] 只支持 Windows AVS 脚本生成器
- [小丸工具箱](https://maruko.appinn.me/) 只支持 Windows
- [[Arctime Pro]] Windows/macOS

如果要知道如何从 mkv 文件格式中提取字幕，可以参考 [这篇文章](/post/2022/07/extract-subtitle-from-mkv.html) 。

## 字幕类型

- 外挂字幕：一般是一个外部的独立文件，一般有 srt, ass 等格式，播放视频时如果字幕文件与视频文件名一致，大部分的播放器会自动加载
- 软字幕：也叫内挂字幕、封装字幕、内封字幕，字幕流等，就是把字幕文件嵌入到视频中，作为流的一部分，在播放视频文件时播放器会加载字幕，由用户选择使用哪一个字幕
- 硬字幕：将字幕嵌入到视频流中合成一个文件，此时字幕成为视频画面的一部分，在任何播放器中都会显示该字幕，且用户无法关闭字幕。硬字幕存在的原因在于用户端播放器兼容问题，适合在所有播放器上播放，但缺点也是无法去除字幕

## 软字幕
作为字幕流（内封字幕、软字幕）嵌入到视频容器中。字幕流和视频和音频流具有相同的地位。视频格式中的 mkv 就是一种封装格式，通过 `ffmpeg -i video.mkv` 就能在输出结果中看到视频流和字幕流是属于不同的 stream 的。

### MKVToolNix

MKV 封装工具：[[MKVToolNix]]
MKV 提取工具：gMKVExtractGUI、MKVExtractGUI

借助 MKVToolNix 提供的界面操作即可。

### FFmpeg
介绍一下如何使用 FFmpeg 将字幕作为单独的字幕流压制到视频中。

```
ffmpeg -i input.mkv -i subtitles.srt -c copy -c:s mov_text output.mp4
ffmpeg -i input.mkv -i subtitles.srt -c copy -c:s srt output.mkv
```

说明：

- `-c copy -c: s mov_text` 告诉 FFmpeg 对于视频，音频，和字幕文件都直接 copy
- 选项的顺序不能搞错，如果要随意顺序，那么可以显示指定 `-c: v copy -c: a copy -c: s mov_text`

假设原始输入文件没有字幕的情况下，也可以直接

```
ffmpeg -i input.mkv -i subtitles.srt -c copy output.mkv
```

FFmpeg 会自动识别字幕文件并做映射。

```
ffmpeg -i input.mp4 -sub_charenc 'UTF-8' -f srt -i input.srt -map 0:0 -map 0:1 -map 1:0 -c:v copy -c:a copy -c:s mov_text output.mp4
ffmpeg -i input.mp4 -sub_charenc 'UTF-8' -f srt -i input.srt -map 0:0 -map 0:1 -map 1:0 -c:v copy -c:a copy -c:s srt output.mkv
```

如果要指定语言：

```
ffmpeg -i input.mp4 -i subtitle.en.srt -c copy -c:s mov_text -metadata:s:s:0 language=eng ouptut_english.mp4
```

- `-metadata: s: s:0` 设置 metadata 格式 `Stream: Subtitle: Number` 从 0 开始
- `language=eng` 设置字幕的语言，使用 [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 3 位英文表示

如果要设置多个字幕：

```
ffmpeg -i ouptut_english.mp4 -i subtitle.chi.srt -map 0 -map 1 -c copy -c:s mov_text -metadata:s:s:1 language=chi output_chi.mp4
```

在之前的基础之上，再添加一个中文字幕。

或者直接使用一行命令：

```
ffmpeg -i input.mp4 -i subtitle.en.srt -i subtitle.chi.srt -map 0 -map 1 -map 2 -c copy -c:s mov_text -metadata:s:s:0 language=eng -metadata:s:s:1 language=chi output_eng_chi.mp4
```

## 硬字幕

### FFmpeg
使用硬编码将字幕嵌入视频的方式会更加耗时，需要重新编码文件。

[[FFmpeg]] 要在视频流上面加上字幕，需要用一个叫做 subtitles 的滤镜，要使用这个滤镜，在命令中写上 `-vf subtitles=字幕文件名 ` ，推荐不管文件名如何都在字幕文件两边加上双引号，比如 `-vf subtitles="字幕 文件名"`，因为如果文件名中包含空格或其他特殊字符，在不使用双引号的情况下 Shell 会解析失败。

```
# 使用 subtitles 滤镜为视频添加字幕，字幕文件在视频流中，输出文件不含字幕流
ffmpeg -i input.mkv -vf subtitles="subtitles.srt" output.mkv
```

说明：

- `-vf` 是 `-filter: v` 参数的缩写
- `subtitles="subtitle.srt"` 则是 filter 的名字，后面是字幕文件

将 mkv 文件中的字幕压制到 mp4

```
# 将 input.mkv 中的字幕（默认）嵌入到 output.mp4 文件
ffmpeg -i input.mkv -vf subtitles=input.mkv output.mp4
```

如果要将其他的字幕，可以指定，比如第二个字幕：

```
ffmpeg -i input.mkv -vf subtitles=input.mkv:si=1 output.mkv
```

subtitle 更多 [用法](http://ffmpeg.org/ffmpeg-all.html#ass)

### ass 格式
如果要处理 ass 格式的字幕文件，那么需要 FFmpeg 启用 `libass` ，可以通过执行 `ffmpeg —version` 来查看输出中是否有 `--enable-libass`，如果没有这个选项那么可能需要重新安装，或者重新编译安装  FFmpeg 。

如果要嵌入 `ass` 格式字幕，可以：

```
brew install ffmpeg --with-libass
ffmpeg -i path/to/video.mp4 -vf "ass=subtitle.ass" out.mp4
```

ass 格式字幕文件提供了更多的格式选择，比如加粗，斜体，字体，颜色等等，可以使用更加专业的字幕制作软件生成。

## reference

- <https://trac.ffmpeg.org/wiki/HowToBurnSubtitlesIntoVideo>
- <https://gist.github.com/kurlov/32cbe841ea9d2b299e15297e54ae8971>
- <https://www.bannerbear.com/blog/how-to-add-subtitles-to-a-video-file-using-ffmpeg/>
