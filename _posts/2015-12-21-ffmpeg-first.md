---
layout: post
title: "FFmpeg 入门笔记"
tagline: ""
description: "使用 FFmpeg 进行转码"
category: 学习笔记
tags: [ffmpeg, linux, media, movie, mp4, mp3, format, ffplay, ffprobe]
last_updated: 2015-12-31
---

那天需要将一段视频文件转成 gif，偶遇 ffmpeg，于是就学习了一下，它真的很强大。在看资料的过程中也是挺有趣的，发现其实 kmplayer 以及国内的 QQ 影音，暴风等等，都不同程度的使用了 ffmpeg，可是根据 ffmpeg 的开源许可 LGPL，任何使用 ffmpeg 的软件都必须开源，于是乎 QQ 影音，暴风都上了 ffmpeg 的耻辱柱，如果没接触到 ffmpeg 还真不知道有这一茬，国内的黑心厂商真是拿开源社区的东西都不遵循开源协议。

下面就直接进正题吧：

## 几个概念 {#concepts}
在进入 ffmpeg 入门之前有一些基本概念需要了解，我在查看 ffmpeg 的时候回头查阅了这些资料，觉得先行了解比较好，这些概念都是视频或者音频中的基本概念。

### 比特率 {#bit-rate}

[[比特率]]，英文为 bit rate，描述每秒钟输出多少 KB 的参数，单位是 Kbps，也就是 kbit/s，8Kbit/s = 1KB/s。也就是说 800Kbps 意思就是每秒视频就要占用 100KB 磁盘空间。对于音频文件也存在比特率，同理。压缩同一个视频，视频比特率越大，文件体积越大。视频比特率越大，画质越好，马赛克越少。

MP3 一般使用的比特率为 8~320kbps。

举一个例子：

bitrate 可以理解为 file size / duration

比如一个视频文件 20.8 M 时长为 1min，那么

    bitrate = 20.8M bit/60s = 20.8 * 1024 * 1024 * 8 bit/60s = 2831 Kbps

假设音频的码率为固定 128 Kbps，那么视频的码率就是

    2831 Kbps - 128 Kbps = 2703 Kbps

H.264 标准建议

视频大小    |	分辨率	| 建议码率
------------|-----------|------------
480P  | 720X480	    | 1800Kbps
720P  | 1280X720	| 3500Kbps
1080P |	1920X1080	| 8500Kbps

#### 可变码率
可变码率叫做 Variable Bitrate (VBR)，也叫作**动态比特率编码**，VBR 指的是编码器的输出码率可以根据编码器输入源信号的复杂度自适应调整，目的是为了达到输出质量保持不变的同时节省存储空间。VBR 适用于存储，不太适用流式传输，可以更有效的地利用有限空间。

#### 固定码率
固定码率叫做 Constant Bitrate (CBR)，CBR 指的是编码器输出码率固定，CBR 不适合存储，CBR 对于复杂内容可能没有足够码率进行编码，从而导致质量下降，同时会在简单内容部分浪费一些码率。

### 帧数 {#fps}
帧数，又被叫做帧率，指的是每秒钟播放的图片数，单位 fps（英文：Frames Per Second），每秒的帧数或者帧率表示视频文件或者图形处理器场景时每秒钟能够更新的次数。

高的帧率可以得到更流畅、更逼真的画面。一般来说 30fps 就是可以接受的，但是将性能提升至 60fps 则可以明显提升交互感和逼真感，但是一般来说超过 75fps 一般就不容易察觉到有明显的流畅度提升了。如果帧率超过屏幕刷新率只会浪费图形处理的能力，因为显示器不能以这么快的速度更新，这样超过刷新率的帧率就浪费掉了。

在同一视频，同一码率的情况下，帧数越大，则画质越不好。尤其是运动的画面。因为每张画面会分担每秒有限的文件体积，如果画面越多，那么每张画面所能表现的内容就越有限。

当画面的 FPS 达到 60 帧 / 秒时，已经能满足绝大部分应用需求。一般情况下，如果能够保证游戏画面的平均 FPS 能够达到 30 帧 / 秒，那么画面已经基本流畅；能够达到 50 帧 / 秒，就基本可以体会到行云流水的感觉了。一般人很难分辨出 60 帧 / 秒与 100 帧 / 秒有什么不同。

### 分辨率 {#resolution}
[[分辨率]] 是最好理解的概念了，因为日常就能看到很多地方使用，表示画面的大小，单位是像素 px。

和编码率的关系：越高的分辨率，需要越高的编码率，因为图像的细节多了，需要的文件体积也应该增大，否则还不如画面小一些，你会发现同一码率，画面越大，图像的马赛克程度越明显。

### 采样率 {#sampling-rate}

[[采样率]] 是指每秒钟对音频信号的采样次数，采样频率越高声音还原度越高，声音更加自然。单位是赫兹 Hz。音频文件一般使用的采样率是 44100 Hz ，也就是一秒钟采样 44100 次，之所以使用这个数值是因为经过了反复实验，人们发现这个采样精度最合适，低于这个值就会有较明显的损失，而高于这个值人的耳朵已经很难分辨，而且增大了数字音频所占用的空间。我们所使用的 CD 的采样标准就是 44.1k，目前 44.1k 还是一个最通行的标准。

## 安装 {#installation}
Debian/Ubuntu/Linux Mint 下安装 ffmpeg 很简单：

    apt-get install ffmpeg

其他操作系统安装方法，参考[官网](https://www.ffmpeg.org/download.html)

如果想要手工编译 ffmpeg 可以参考官方 [wiki](https://trac.ffmpeg.org/wiki#CompilingFFmpeg)。 Ubuntu/Debian/Mint 系手工编译 ffmpeg 参考 [wiki](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)。

## 用法举例 {#examples}

### 显示文件信息
显示视频信息

    ffmpeg -i input.avi

### 将视频拆分图片 批量截图
将视频拆分多张图片，每一帧图片，保存到 frames 文件夹下，命名 frame001.png 这种。可以加上 -r 参数以用来限制每秒的帧数，`-r 10` 就表示每秒 10 帧。

    ffmpeg -i input.mp4 frames/frame%03d.png

### 图片合成视频
将多张图片合成视频

    ffmpeg -i frames/frame%3d.png output.mp4

### 从视频中提取音频
从视频文件中提取音频并保存为 mp3

    ffmpeg -i input.mp4 -f mp3 output.mp3
    # or
    ffmpeg -i input.mp4 -vn output.mp3
    # or
    ffmpeg -i input.mp4 -vn -ar 44100 -ac 2 -ab 320 -f mp3 output.mp3

说明：

如果需要可以在中间加上 `-ar 44100 -ac 2 -ab 192` 系数，表示采样率 44100 ，通道 2 立体声，码率 192 kb/s.

- `-vn` 表示不使用视频
- `-ar` 设置音频采样率
- `-ac` 设置音频 Channels
- `-ab` 设置音频比特率 bitrate
- `-f` 指定输出文件的格式


### 将声音合成到视频
将声音合成到视频中

    ffmpeg -i input_music.mp3 -i input_video.mp4 output.mp4

将音频流和视频流合并：

```
ffmpeg -i input.mp4 -i input.mp3 -c copy -map 0:v:0 -map 1:a:0 output.mp4
```

- `-map` 参数指定了从输入文件的视频流和音频流中输出文件
- 如果你的音频流时长超过视频流，或者相反，你可以使用-shortest参数，使ffmpeg参数在处理到两个输入短的结束时结束。

### 转化格式
格式之间转换 大部分的情况下直接运行一下即可

    ffmpeg -i input.mp4 output.avi

将 flv 转码 MP4

	ffmpeg -i input.flv -vcodec copy -acodec copy out.mp4

`-vcodec copy` 和 `-acodec copy` 表示所使用的视频和音频编码格式，为原样拷贝。

转换文件格式

    ffmpeg -y -i input_video.mp4 -bitexact -vcodec h263 -b 128 -r 15 -s 176x144 -acodec aac -ac 2 -ar 22500 -ab 24 -f 3gp test.3gp

或

    ffmpeg -y -i test.wmv -ac 1 -acodec libamr_nb -ar 8000 -ab 12200 -s 176x144 -b 128 -r 15 test.3gp

### 视频切片操作
对视频切片操作

比如需要从视频第 1 分 45 秒地方，剪 10 秒画面，-ss 表示开始位置，-t 表示延长时间

    ffmpeg -i input.mp4 -ss 00:01:45 -t 10 output.mp4

如果要精确控制切片的时间，比如想要剪切从 0 秒到 10 分的视频[^cut]

    ffmpeg -ss 00:00:00 -to 00:10:00 -i input.mp4 -c copy output.mp4

[^cut]: <https://stackoverflow.com/a/42827058/1820217>

### 加速减速视频
加速视频

    ffmpeg -i input.mp4 -vf “setpts=0.5*PTS” output.mp4

同理减速视频

    ffmpeg -i input.mp4 -vf “setpts=2.0*PTS” output.mp4

此操作对音频无影响

### 视频截图
视频 10 秒的地方 (`-ss` 参数）截取一张 1920x1080 尺寸大小的，格式为 jpg 的图片  `-ss`后跟的时间单位为秒

    ffmpeg -i input_video.mp4 -y -f image2 -t 0.001 -ss 10 -s 1920x1080 output.jpg

或者

	ffmpeg -i input_video.mp4 -ss 00:00:06.000 -vframes 1 output.png

### 合成 gif
把视频的前 30 帧转换成一个 Gif

    ffmpeg -i input_video.mp4 -vframes 30 -y -f gif output.gif

将视频转成 gif

    ffmpeg -ss 00:00:00.000 -i input.mp4 -pix_fmt rgb24 -r 10 -s 320x240 -t 00:00:10.000 output.gif

将输入的文件从 (-ss) 设定的时间开始以 10 帧频率，输出到 320x240 大小的 gif 中，时间长度为 -t 设定的参数。通过这样转换出来的 gif 一般都比较大，可以使用 [ImageMagick](http://www.imagemagick.org/) 来优化图片的大小。

     convert -layers Optimize output.gif output_optimized.gif

把 frame.[001-100].jpg 序列帧和 bg.mp3 音频文件利用 mpeg4 编码方式合成分辨率 720p 的视频文件 output.avi：

    ffmpeg -i bg.mp3 -i frame.%3d.jpg -s hd720 -vcodec mpeg4 output.avi

### 转换码率
ffmpeg 码率相关的参数主要有 `-minrate`, `maxrate`, `-b:v`

    ffmpeg -i input.mp4 -b:v 2000k output.mp4

也就是把原始视频转换成 2 Mbps 码率视频。ffmpeg 官方建议，在设置 `-b:v` 时，同时加上 `-bufsize` 用于设置码率控制缓冲器大小，让整体码率更加趋近于希望的值，减少波动。

    ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k output.mp4

而 `-minrate` 和 `-maxrate` 比较简单，设置码率不要低于或者超过某一个阈值

    ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k -maxrate 2500k output.mp4

### 强制输出文件的帧率
比如要强制输出文件的帧率为 24 fps:

```
ffmpeg -i input.avi -r 24 output.avi
```


### 压缩视频大小
对于一个非常大的文件，经常需要压缩文件大小可以使用

     ffmpeg -i input.mp4 -vcodec h264 -acodec mp3 output.mp4


### 更改视频的分辨率
如果想要改变视频的分辨率

    ffmpeg -i input.mp4 -filter:v scale=1280:720 -c:a copy output.mp4
    # or
    ffmpeg -i input.mp4 -s 1280x720 -c:a copy output.mp4

### 裁剪视频

    ffmpeg -i input.mp4 -filter:v "crop=w:h:x:y" output.mp4

说明：

- `-filter:v` 过滤视频

### 设置视频的宽高比

    ffmpeg -i input.mp4 -aspect 16:9 output.mp4

常见的宽高比：

- 16:9
- 4:3
- 16:10
- 5:4

### 给音频文件增加图片
将一个音频文件编程一个视频

    ffmpeg -loop 1 -i input_image.jpg -i input_audio.mp3 -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest output.mp4

### 给视频文件增加字幕

```
ffmpeg -i ./file.mp4 -c:v libx264 -c:a copy -vf "ass=t.ass" out.mp4
```

### 查看 ffmpeg 支持格式
要查看你的 ffmpeg 支持哪些格式，可以用如下命令：

    ffmpeg -formats | less

设置输出文件编码率 64 kbit/s, To set the video bitrate of the output file to 64 kbit/s:

     ffmpeg -i input.avi -b:v 64k -bufsize 64k output.avi

设置输出文件帧率为 24 fps，To force the frame rate of the output file to 24 fps:

     ffmpeg -i input.avi -r 24 output.avi

强制输入文件以 1 帧，输出文件 24 帧 ， To force the frame rate of the input file (valid for raw formats only) to 1 fps and the frame rate of the output file to 24 fps:

     ffmpeg -r 1 -i input.mp4 -r 24 output.avi

下面几步分别是，创建`frames`文件夹，利用 ffmpeg 将视频文件以每秒 10 帧输出成图像保存到 frames 文件夹中，再利用 ImageMagick 将图片组成 gif。其中 `convert` 命令来自 ImageMagick。

    mkdir frames
    ffmpeg -i input.mp4 -r 10 frames/frame%03d.png
    convert -delay 5 -loop 0 frames/frame*.png output.gif

Source: <http://superuser.com/a/556031>


### 利用 ffmpeg 屏幕录制

参考：<https://trac.ffmpeg.org/wiki/Capture/Desktop>


### 添加水印

	ffmpeg -i input.mp4 -i picture.png -filter_complex overlay="(main_w/2)-(overlay_w/2):(main_h/2)-(overlay_h)/2" output.mp4

picture.png 为水印图片， overlay 为水印位置

## ffmpeg 使用语法 {#ffmpeg-usage}

ffmpeg 使用语法：

    ffmpeg [global_options] {[input_file_options] -i input_file} ... {[output_file_options] output_file} ...

如果没有输入文件，那么视音频捕捉就会起作用。

作为通用的规则，选项一般用于下一个特定的文件。如果你给 –b 64 选项，改选会设置下一个视频速率。对于原始输入文件，格式选项可能是需要的。

缺省情况下，ffmpeg 试图尽可能的无损转换，采用与输入同样的音频视频参数来输出。

### 通用选项 {#Generic-options}

```
-L license 显示协议
-h 帮助
-formats 显示可用的格式，编解码的，协议的
-decoders 可用解码器
-encoders 可用编码器
```

### 主要选项 {#main-options}

```
-i 	filename 输入文件
-y 	覆盖输出文件
-n 	不覆盖输出文件，如果输出文件存在则退出
-t 	duration (input/output)
    设置纪录时间 hh:mm:ss[.xxx] 格式的记录时间也支持，在 `-i` 之前使用，则对输入文件限制记录时间；如果对输出文件使用，则是限制输出文件的时长。

-ss position
    搜索到指定的时间 [-]hh:mm:ss[.xxx] 的格式也支持 ，更多[参考](https://ffmpeg.org/ffmpeg-utils.html#time-duration-syntax)

-title string 设置标题
-author string 设置作者
-copyright string 设置版权
-comment string 设置评论
-f fmt 强迫采用格式 fmt 输出

-c[:stream_specifier] codec (input/output, per-stream)
-codec[:stream_specifier] codec (input/output, per-stream)
    给输入文件指定解码器，给输出文件指定编码器， codec 为编码器名字，如果 codec 值为 `copy` 则默认为和原视频一致。

-vcodec codec
    vcodec 是 -codec:v 的一个别称，强制使用 codec 编解码方式，未设定时使用与输入流相同的编码器。如果用 copy 表示原始编解码数据必须被拷贝。

-target type 设置目标文件类型 (vcd,svcd,dvd) 所有的格式选项（比特率，编解码以及缓冲区大小）自动设置，只需要输入如下的就可以了：

    ffmpeg -i input.avi -target vcd /tmp/vcd.mpg

-hq 激活高质量设置
-itsoffset offset 设置以秒为基准的时间偏移，该选项影响所有后面的输入文件。该偏移被加到输入文件的时戳，定义一个正偏移意味着相应的流被延迟了 offset 秒。 [-]hh:mm:ss[.xxx] 的格式也支持

### 视频选项 {#video-options}

-vframes number (output)
    设置视频输出帧数，是`-frames:v`的别称。

-b bitrate 设置比特率，缺省 200kb/s
-r fps 设置帧率 缺省 25
-s size 设置画面的宽高

    设置帧大小，分辨率， 格式为 wxh 缺省为原视频大小。下面的简写也可以直接使用：
    ntsc 720x480
    snits 640x480
    hd720 1280x720
    hd1080 1920x1080
    更多[参考](https://ffmpeg.org/ffmpeg-utils.html#toc-Video-size)

-aspect aspect 设置画面比例 4:3 16:9 或 1.3333 1.7777
-croptop size 设置顶部切除带大小 像素单位
-cropbottom size –cropleft size –cropright size
-padtop size 设置顶部补齐的大小 像素单位

-padbottom size –padleft size –padright size –padcolor color 设置补齐条颜色 (hex,6 个 16 进制的数，红：绿：兰排列，比如 000000 代表黑色）

-vn 不做视频记录，输出无视频内容
-bt tolerance 设置视频码率容忍度 kbit/s
-maxrate bitrate 设置最大视频码率容忍度
-minrate bitreate 设置最小视频码率容忍度

-bufsize size 设置码率控制缓冲区大小

-sameq 使用同样视频质量作为源（VBR）

-pass n 选择处理遍数（1 或者 2）。两遍编码非常有用。第一遍生成统计信息，第二遍生成精确的请求的码率

-passlogfile file 选择两遍的纪录文件名为 file
```

### 高级视频选项 {#video-advanced-options}

```
-g gop_size 设置图像组大小

-intra 仅适用帧内编码

-qscale q 使用固定的视频量化标度 (VBR)

-qmin q 最小视频量化标度 (VBR)

-qmax q 最大视频量化标度 (VBR)

-qdiff q 量化标度间最大偏差 (VBR)

-qblur blur 视频量化标度柔化 (VBR)

-qcomp compression 视频量化标度压缩 (VBR)

-rc_init_cplx complexity 一遍编码的初始复杂度

-b_qfactor factor 在 p 和 b 帧间的 qp 因子

-i_qfactor factor 在 p 和 i 帧间的 qp 因子

-b_qoffset offset 在 p 和 b 帧间的 qp 偏差

-i_qoffset offset 在 p 和 i 帧间的 qp 偏差

-rc_eq equation 设置码率控制方程 默认 tex^qComp

-rc_override override 特定间隔下的速率控制重载

-me method 设置运动估计的方法 可用方法有 zero phods log x1 epzs（缺省） full

-dct_algo algo 设置 dct 的算法 可用的有 0 FF_DCT_AUTO 缺省的 DCT 1 FF_DCT_FASTINT 2 FF_DCT_INT 3 FF_DCT_MMX 4 FF_DCT_MLIB 5 FF_DCT_ALTIVEC

-idct_algo algo 设置 idct 算法。可用的有 0 FF_IDCT_AUTO 缺省的 IDCT 1 FF_IDCT_INT 2 FF_IDCT_SIMPLE 3 FF_IDCT_SIMPLEMMX 4 FF_IDCT_LIBMPEG2MMX 5 FF_IDCT_PS2 6 FF_IDCT_MLIB 7 FF_IDCT_ARM 8 FF_IDCT_ALTIVEC 9 FF_IDCT_SH4 10 FF_IDCT_SIMPLEARM

-er n 设置错误残留为 n 1 FF_ER_CAREFULL 缺省 2 FF_ER_COMPLIANT 3 FF_ER_AGGRESSIVE 4 FF_ER_VERY_AGGRESSIVE

-ec bit_mask 设置错误掩蔽为 bit_mask, 该值为如下值的位掩码 1 FF_EC_GUESS_MVS (default=enabled) 2 FF_EC_DEBLOCK (default=enabled)

-bf frames 使用 frames B 帧，支持 mpeg1,mpeg2,mpeg4

-mbd mode 宏块决策 0 FF_MB_DECISION_SIMPLE 使用 mb_cmp 1 FF_MB_DECISION_BITS 2 FF_MB_DECISION_RD

-4mv 使用 4 个运动矢量 仅用于 mpeg4

-part 使用数据划分 仅用于 mpeg4

-bug param 绕过没有被自动监测到编码器的问题

-strict strictness 跟标准的严格性

-aic 使能高级帧内编码 h263+

-umv 使能无限运动矢量 h263+

-deinterlace 不采用交织方法

-interlace 强迫交织法编码仅对 mpeg2 和 mpeg4 有效。当你的输入是交织的并且你想要保持交织以最小图像损失的时候采用该选项。可选的方法是不交织，但是损失更大

-psnr 计算压缩帧的 psnr

-vstats 输出视频编码统计到 vstats_hhmmss.log

-vhook module 插入视频处理模块 module 包括了模块名和参数，用空格分开

### 音频选项 {#audio-options}

-aframes number (output)
    设置输出文件音频帧数，是`-frames:a` 的别名

-ab bitrate
    设置音频码率，声音比特率，-ac 设为立体声时要以一半比特率来设置，比如 192kbps 的就设置成 96，高品质音乐建议 160kbps(80) 一上

-ar freq
    设置音频采样率，一般设置 44100

-ac channels
    设置通道，声道数， 缺省为 1, 1 为单声道，2 为立体声

-an 不使用音频纪录

-acodec codec
    使用 codec 编解码，是`-codec:a`的别名
```

### 音频 / 视频捕获选项 {#audio-and-video-capture-options}

```
-vd device 设置视频捕获设备。比如 /dev/video0

-vc channel 设置视频捕获通道 DV1394 专用

-tvstd standard 设置电视标准 NTSC PAL(SECAM)

-dv1394 设置 DV1394 捕获

-av device 设置音频设备 比如 /dev/dsp

### 高级选项 {#advance-option}

-map file:stream 设置输入流映射

-debug 打印特定调试信息

-benchmark 为基准测试加入时间

-hex 倾倒每一个输入包

-bitexact 仅使用位精确算法 用于编解码测试

-ps size 设置包大小，以 bits 为单位

-re 以本地帧频读数据，主要用于模拟捕获设备

-loop 循环输入流。只工作于图像流，用于 ffserver 测试
```

## 附录 1：ffmpeg 简略帮助 {#appendix-1:-ffmpeg-help}

    Hyper fast Audio and Video encoder
    usage: ffmpeg [options] [[infile options] -i infile]... {[outfile options] outfile}...

    Getting help:
        -h      -- print basic options
        -h long -- print more options
        -h full -- print all options (including all format and codec specific options, very long)
        -h type=name -- print all options for the named decoder/encoder/demuxer/muxer/filter
        See man ffmpeg for detailed description of the options.

    Print help / information / capabilities:
    -L                  show license
    -h topic            show help
    -? topic            show help
    -help topic         show help
    --help topic        show help
    -version            show version
    -buildconf          show build configuration
    -formats            show available formats
    -devices            show available devices
    -codecs             show available codecs
    -decoders           show available decoders
    -encoders           show available encoders
    -bsfs               show available bit stream filters
    -protocols          show available protocols
    -filters            show available filters
    -pix_fmts           show available pixel formats
    -layouts            show standard channel layouts
    -sample_fmts        show available audio sample formats
    -colors             show available color names
    -sources device     list sources of the input device
    -sinks device       list sinks of the output device
    -hwaccels           show available HW acceleration methods

    Global options (affect whole program instead of just one file:
    -loglevel loglevel  set logging level
    -v loglevel         set logging level
    -report             generate a report
    -max_alloc bytes    set maximum size of a single allocated block
    -y                  overwrite output files
    -n                  never overwrite output files
    -ignore_unknown     Ignore unknown stream types
    -stats              print progress report during encoding
    -max_error_rate ratio of errors (0.0: no errors, 1.0: 100% error  maximum error rate
    -bits_per_raw_sample number  set the number of bits per raw sample
    -vol volume         change audio volume (256=normal)

    Per-file main options:
    -f fmt              force format
    -c codec            codec name
    -codec codec        codec name
    -pre preset         preset name
    -map_metadata outfile[,metadata]:infile[,metadata]  set metadata information of outfile from infile
    -t duration         record or transcode "duration" seconds of audio/video
    -to time_stop       record or transcode stop time
    -fs limit_size      set the limit file size in bytes
    -ss time_off        set the start time offset
    -sseof time_off     set the start time offset relative to EOF
    -seek_timestamp     enable/disable seeking by timestamp with -ss
    -timestamp time     set the recording timestamp ('now' to set the current time)
    -metadata string=string  add metadata
    -program title=string:st=number...  add program with specified streams
    -target type        specify target file type ("vcd", "svcd", "dvd", "dv" or "dv50" with optional prefixes "pal-", "ntsc-" or "film-")
    -apad               audio pad
    -frames number      set the number of frames to output
    -filter filter_graph  set stream filtergraph
    -filter_script filename  read stream filtergraph description from a file
    -reinit_filter      reinit filtergraph on input parameter changes
    -discard            discard
    -disposition        disposition

    Video options:
    -vframes number     set the number of video frames to output
    -r rate             set frame rate (Hz value, fraction or abbreviation)
    -s size             set frame size (WxH or abbreviation)
    -aspect aspect      set aspect ratio (4:3, 16:9 or 1.3333, 1.7777)
    -bits_per_raw_sample number  set the number of bits per raw sample
    -vn                 disable video
    -vcodec codec       force video codec ('copy' to copy stream)
    -timecode hh:mm:ss[:;.]ff  set initial TimeCode value.
    -pass n             select the pass number (1 to 3)
    -vf filter_graph    set video filters
    -ab bitrate         audio bitrate (please use -b:a)
    -b bitrate          video bitrate (please use -b:v)
    -dn                 disable data

    Audio options:
    -aframes number     set the number of audio frames to output
    -aq quality         set audio quality (codec-specific)
    -ar rate            set audio sampling rate (in Hz)
    -ac channels        set number of audio channels
    -an                 disable audio
    -acodec codec       force audio codec ('copy' to copy stream)
    -vol volume         change audio volume (256=normal)
    -af filter_graph    set audio filters

    Subtitle options:
    -s size             set frame size (WxH or abbreviation)
    -sn                 disable subtitle
    -scodec codec       force subtitle codec ('copy' to copy stream)
    -stag fourcc/tag    force subtitle tag/fourcc
    -fix_sub_duration   fix subtitles duration
    -canvas_size size   set canvas size (WxH or abbreviation)
    -spre preset        set the subtitle options to the indicated preset



## 附录 2：常用视频文件格式详解 {#appendix-2:-common-file-extension}

常见的视频格式：

1. AVI 格式 　　它的英文全称为 Audio Video Interleaved，即音频视频交错格式。它于 1992 年被 Microsoft 公司推出，随 Windows3.1 一起被人们所认识和熟知。所谓“音频视频交错”，就是可以将视频和音频交织在一起进行同步播放。这种视频格式的优点是图像质量好，可以跨多个平台使用，但是其缺点是体积过于庞大，而且更加糟糕的是压缩标准不统一，因此经常会遇到高版本 Windows 媒体播放器播放不了采用早期编码编辑的 AVI 格式视频，而低版本 Windows 媒体播放器又播放不了采用最新编码编辑的 AVI 格式视频。其实解决的方法也非常简单，我们将在后面的视频转换、视频修复部分中给出解决的方案。

2. DV-AVI 格式 　　DV 的英文全称是 Digital Video Format，是由索尼、松下、JVC 等多家厂商联合提出的一种家用数字视频格式。目前非常流行的数码摄像机就是使用这种格式记录视频数据的。它可以通过电脑的 IEEE 1394 端口传输视频数据到电脑，也可以将电脑中编辑好的的视频数据回录到数码摄像机中。这种视频格式的文件扩展名一般也是.avi，所以我们习惯地叫它为 DV-AVI 格式。

3. MPEG 格式 　　它的英文全称为 Moving Picture Expert Group，即运动图像专家组格式，家里常看的 VCD、SVCD、DVD 就是这种格式。MPEG 文件格式是运动图像压缩算法的国际标准，它采用了有损压缩方法从而减少运动图像中的冗余信息。MPEG 的压缩方法说的更加深入一点就是保留相邻两幅画面绝大多数相同的部分，而把后续图像中和前面图像有冗余的部分去除，从而达到压缩的目的。目前 MPEG 格式有三个压缩标准，分别是 MPEG-1、MPEG-2、和 MPEG-4，另外，MPEG-7 与 MPEG-21 仍处在研发阶段。 　　MPEG-1：制定于 1992 年，它是针对 1.5Mbps 以下数据传输率的数字存储媒体运动图像及其伴音编码而设计的国际标准。也就是我们通常所见到的 VCD 制作格式。这种视频格式的文件扩展名包括.mpg、.mlv、.mpe、.mpeg 及 VCD 光盘中的.dat 文件等。 　　MPEG-2：制定于 1994 年，设计目标为高级工业标准的图像质量以及更高的传输率。这种格式主要应用在 DVD/SVCD 的制作（压缩）方面，同时在一些 HDTV（高清晰电视广播）和一些高要求视频编辑、处理上面也有相当的应用。这种视频格式的文件扩展名包括.mpg、.mpe、.mpeg、.m2v 及 DVD 光盘上的.vob 文件等。 　　MPEG-4：制定于 1998 年，MPEG-4 是为了播放流式媒体的高质量视频而专门设计的，它可利用很窄的带度，通过帧重建技术，压缩和传输数据，以求使用最少的数据获得最佳的图像质量。MPEG-4 最有吸引力的地方在于它能够保存接近于 DVD 画质的小体积视频文件。这种视频格式的文件扩展名包括.asf、.mov 和 DivX 、AVI 等。

4. DivX 格式 　　这是由 MPEG-4 衍生出的另一种视频编码（压缩）标准，也即我们通常所说的 DVDrip 格式，它采用了 MPEG4 的压缩算法同时又综合了 MPEG-4 与 MP3 各方面的技术，说白了就是使用 DivX 压缩技术对 DVD 盘片的视频图像进行高质量压缩，同时用 MP3 或 AC3 对音频进行压缩，然后再将视频与音频合成并加上相应的外挂字幕文件而形成的视频格式。其画质直逼 DVD 并且体积只有 DVD 的数分之一。

5. MOV 格式 　　美国 Apple 公司开发的一种视频格式，默认的播放器是苹果的 QuickTimePlayer。具有较高的压缩比率和较完美的视频清晰度等特点，但是其最大的特点还是跨平台性，即不仅能支持 MacOS，同样也能支持 Windows 系列。

6. ASF 格式 　　它的英文全称为 Advanced Streaming format，它是微软为了和现在的 Real Player 竞争而推出的一种视频格式，用户可以直接使用 Windows 自带的 Windows Media Player 对其进行播放。由于它使用了 MPEG-4 的压缩算法，所以压缩率和图像的质量都很不错。

7. WMF 格式 　　它的英文全称为 Windows Media Video，也是微软推出的一种采用独立编码方式并且可以直接在网上实时观看视频节目的文件压缩格式。WMV 格式的主要优点包括：本地或网络回放、可扩充的媒体类型、可伸缩的媒体类型、多语言支持、环境独立性、丰富的流间关系以及扩展性等。

8. RM 格式 　　Networks 公司所制定的音频视频压缩规范称之为 Real Media，用户可以使用 RealPlayer 或 RealOne Player 对符合 RealMedia 技术规范的网络音频 / 视频资源进行实况转播，并且 RealMedia 还可以根据不同的网络传输速率制定出不同的压缩比率，从而实现在低速率的网络上进行影像数据实时传送和播放。这种格式的另一个特点是用户使用 RealPlayer 或 RealOne Player 播放器可以在不下载音频 / 视频内容的条件下实现在线播放。

9. RMVB 格式 　　这是一种由 RM 视频格式升级延伸出的新视频格式，它的先进之处在于 RMVB 视频格式打破了原先 RM 格式那种平均压缩采样的方式，在保证平均压缩比的基础上合理利用比特率资源，就是说静止和动作场面少的画面场景采用较低的编码速率，这样可以留出更多的带宽空间，而这些带宽会在出现快速运动的画面场景时被利用。这样在保证了静止画面质量的前提下，大幅地提高了运动图像的画面质量，从而图像质量和文件大小之间就达到了微妙的平衡。

## 参考 {#reference}

- <https://mrhanlon.com/posts/convert-an-mp4-to-gif-with-ffmpeg/>
- <http://superuser.com/questions/436056/how-can-i-get-ffmpeg-to-convert-a-mov-to-a-gif>
- <http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html>
- <https://gist.github.com/protrolium/e0dbd4bb0f1a396fcb55>
- <https://www.ostechnix.com/20-ffmpeg-commands-beginners/>
- <https://www.videoproc.com/resource/ffmpeg-commands.htm>